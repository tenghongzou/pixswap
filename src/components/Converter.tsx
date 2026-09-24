import { useCallback, useEffect, useId, useRef, useState } from 'react'
import FileCard, { type Item } from './FileCard'
import Icon from './Icon'
import SizeCompare from './SizeCompare'
import { convert, ConvertError, MESSAGES } from '@/lib/convert'
import { isSameFormat, JPG, looksLikeImage, OUTPUT_FORMATS, sourceLabel, type OutputFormat } from '@/lib/formats'
import { renameExt, timestamp, uniqueName } from '@/lib/text'
import { createZip } from '@/lib/zip'

type Props = {
  // 落地頁固定輸出格式；首頁不傳，改顯示格式選擇器
  fixedOutput?: OutputFormat
}

type Toast = { id: number; message: string }

const DEFAULT_QUALITY = 85
const LARGE_ZIP_BYTES = 500 * 1024 * 1024

let nextId = 1

// 失敗項置頂，其餘依加入順序
function sortItems(items: Item[]): Item[] {
  return [...items.filter((i) => i.status === 'error'), ...items.filter((i) => i.status !== 'error')]
}

function revoke(item: Item) {
  if (item.result) URL.revokeObjectURL(item.result.url)
  if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
}

function triggerDownload(url: string, name: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
}

export default function Converter({ fixedOutput }: Props) {
  const [output, setOutput] = useState<OutputFormat>(fixedOutput ?? JPG)
  const [quality, setQuality] = useState(DEFAULT_QUALITY)
  const [items, setItems] = useState<Item[]>([])
  const [dragging, setDragging] = useState(false)
  const [rejectNote, setRejectNote] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [toast, setToast] = useState<Toast | null>(null)
  const [zipping, setZipping] = useState(false)
  const [pasteKey, setPasteKey] = useState('Ctrl+V')
  const [isIOS, setIsIOS] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const pickRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const busy = useRef(false)
  const itemsRef = useRef(items)
  const pendingFocus = useRef<number | 'pick' | null>(null)
  const wasProcessing = useRef(false)
  const hintId = useId()
  const qualityId = useId()

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  // 平台相關的文案只能在瀏覽器端判斷，避免 SSR 輸出不一致
  useEffect(() => {
    const mac = /Mac|iPhone|iPad/.test(navigator.platform) || /Mac OS X/.test(navigator.userAgent)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 只在掛載時讀一次瀏覽器資訊
    setPasteKey(mac ? '⌘V' : 'Ctrl+V')
    setIsIOS(/iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform)))
  }, [])

  // 離開頁面時釋放所有 object URL
  useEffect(() => () => itemsRef.current.forEach(revoke), [])

  const showToast = useCallback((message: string) => setToast({ id: Date.now(), message }), [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  const addFiles = useCallback(
    (files: File[], source: 'pick' | 'drop' | 'paste') => {
      if (files.length === 0) return
      const images = files.filter(looksLikeImage)
      if (images.length === 0) {
        setRejectNote('這些檔案不是圖片，沒有加入。')
        return
      }
      setRejectNote(null)

      const stamp = timestamp()
      const added: Item[] = files.map((file, index) => {
        const name =
          source === 'paste'
            ? `pasted-${stamp}${files.length > 1 ? `-${index + 1}` : ''}.${sourceLabel(file).toLowerCase()}`
            : file.name
        const base = { id: nextId++, file, name, source: sourceLabel(file), to: output, quality: quality / 100 }
        if (!looksLikeImage(file)) return { ...base, status: 'error', error: MESSAGES.decode }
        if (isSameFormat(file, output)) return { ...base, status: 'skipped', previewUrl: URL.createObjectURL(file) }
        return { ...base, status: 'waiting' }
      })

      setItems((prev) => sortItems([...prev, ...added]))
      setAnnouncement(`已加入 ${added.length} 張圖片，開始轉換`)
    },
    [output, quality],
  )

  // 佇列：一次處理一張，每張各自成功或失敗，不互相拖累
  useEffect(() => {
    if (busy.current) return
    const next = items.find((i) => i.status === 'waiting')
    if (!next) return

    busy.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 佇列推進本來就由狀態變化驅動
    setItems((prev) => prev.map((i) => (i.id === next.id ? { ...i, status: 'processing' } : i)))

    convert(next.file, next.to, next.quality)
      .then(({ blob, width, height }) => {
        busy.current = false
        setItems((prev) => {
          // 轉換中被移除：丟掉結果，但仍要回傳新陣列讓佇列繼續推進
          if (!prev.some((i) => i.id === next.id)) return [...prev]
          const taken = new Set(prev.flatMap((i) => (i.result ? [i.result.name] : [])))
          const result = {
            name: uniqueName(renameExt(next.name, next.to.ext), taken),
            blob,
            url: URL.createObjectURL(blob),
            size: blob.size,
            width,
            height,
          }
          return prev.map((i) => (i.id === next.id ? { ...i, status: 'done', result, previewUrl: undefined } : i))
        })
      })
      .catch((err: unknown) => {
        busy.current = false
        const error = err instanceof ConvertError ? err.message : MESSAGES.failed
        setItems((prev) => sortItems(prev.map((i) => (i.id === next.id ? { ...i, status: 'error', error } : i))))
      })
  }, [items])

  const done = items.filter((i) => i.status === 'done')
  const failed = items.filter((i) => i.status === 'error')
  const skipped = items.filter((i) => i.status === 'skipped')
  const pending = items.filter((i) => i.status === 'waiting' || i.status === 'processing')
  const processing = pending.length > 0
  const totalFrom = done.reduce((sum, i) => sum + i.file.size, 0)
  const totalTo = done.reduce((sum, i) => sum + (i.result?.size ?? 0), 0)

  // 整批結束時播報一次摘要，不逐檔播報
  useEffect(() => {
    if (processing) {
      wasProcessing.current = true
      return
    }
    if (!wasProcessing.current) return
    wasProcessing.current = false
    const saved = totalFrom - totalTo
    const parts = [`轉換完成：${done.length} 張成功`]
    if (failed.length) parts.push(`${failed.length} 張失敗。失敗的項目列在清單最上方`)
    else if (saved > 0) parts.push(`共省下 ${(saved / 1024 / 1024).toFixed(1)} MB`)
    setAnnouncement(parts.join('，'))
  }, [processing, done.length, failed.length, totalFrom, totalTo])

  // 移除或清除後把焦點放到合理的位置（ux.md §6.2）
  useEffect(() => {
    const target = pendingFocus.current
    if (target === null) return
    pendingFocus.current = null
    if (target === 'pick') {
      pickRef.current?.focus()
      return
    }
    listRef.current?.querySelector<HTMLElement>(`[data-id="${target}"] .file__actions > *`)?.focus()
  }, [items])

  // 整個視窗都能接收拖放與貼上
  useEffect(() => {
    let depth = 0
    const hasFiles = (e: DragEvent) => e.dataTransfer?.types.includes('Files') ?? false

    const onEnter = (e: DragEvent) => {
      if (!hasFiles(e)) return
      depth++
      setDragging(true)
    }
    const onLeave = (e: DragEvent) => {
      if (!hasFiles(e)) return
      depth = Math.max(0, depth - 1)
      if (depth === 0) setDragging(false)
    }
    const onOver = (e: DragEvent) => {
      if (hasFiles(e)) e.preventDefault()
    }
    const onDrop = (e: DragEvent) => {
      if (!hasFiles(e)) return
      e.preventDefault()
      depth = 0
      setDragging(false)
      addFiles(Array.from(e.dataTransfer?.files ?? []), 'drop')
    }
    const onPaste = (e: ClipboardEvent) => {
      // 在文字輸入框裡貼上時交給瀏覽器處理
      if (e.target instanceof Element && e.target.closest('input[type="text"], textarea, [contenteditable="true"]')) return
      const files = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'))
      if (files.length === 0) {
        showToast(`剪貼簿裡沒有圖片。先複製一張圖片，再按 ${pasteKey}。`)
        return
      }
      e.preventDefault()
      addFiles(files, 'paste')
    }

    window.addEventListener('dragenter', onEnter)
    window.addEventListener('dragleave', onLeave)
    window.addEventListener('dragover', onOver)
    window.addEventListener('drop', onDrop)
    document.addEventListener('paste', onPaste)
    return () => {
      window.removeEventListener('dragenter', onEnter)
      window.removeEventListener('dragleave', onLeave)
      window.removeEventListener('dragover', onOver)
      window.removeEventListener('drop', onDrop)
      document.removeEventListener('paste', onPaste)
    }
  }, [addFiles, showToast, pasteKey])

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []), 'pick')
    // 清空才能再次選同一個檔案
    event.target.value = ''
  }

  const removeItem = (id: number) => {
    const index = items.findIndex((i) => i.id === id)
    if (index < 0) return
    revoke(items[index])
    const rest = items.filter((i) => i.id !== id)
    const neighbor = rest[index] ?? rest[index - 1]
    pendingFocus.current = neighbor ? neighbor.id : 'pick'
    setItems(rest)
  }

  const forceItem = (id: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i
        if (i.previewUrl) URL.revokeObjectURL(i.previewUrl)
        return { ...i, status: 'waiting', previewUrl: undefined, to: output, quality: quality / 100 }
      }),
    )
  }

  const clearAll = () => {
    items.forEach(revoke)
    pendingFocus.current = 'pick'
    setItems([])
    setRejectNote(null)
    setAnnouncement('已清除所有圖片')
  }

  const downloadAll = async () => {
    if (done.length === 1) {
      const { url, name } = done[0].result!
      triggerDownload(url, name)
      return
    }
    setZipping(true)
    try {
      const zip = await createZip(done.map((i) => ({ name: i.result!.name, blob: i.result!.blob })))
      const url = URL.createObjectURL(zip)
      triggerDownload(url, `pixswap-${done.length}-images-${timestamp(new Date(), false)}.zip`)
      // 給瀏覽器一點時間開始下載再釋放
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch {
      showToast('打包失敗，可能是檔案太大。請改用逐張下載。')
    } finally {
      setZipping(false)
    }
  }

  const hasItems = items.length > 0
  const settingsNote =
    output.id === 'jpg'
      ? 'JPG 不支援透明，透明區域會變成白色。'
      : 'PNG 是無損格式，由 JPG 轉過來的檔案通常會變大，畫質不會變好。'

  let summaryTitle: string
  if (processing) summaryTitle = `轉換中 ${items.length - pending.length} / ${items.length}`
  else if (done.length === 0 && failed.length > 0) summaryTitle = '沒有圖片轉換成功'
  else if (failed.length > 0) summaryTitle = `完成 ${done.length} 張，${failed.length} 張失敗`
  else summaryTitle = `已完成 ${done.length} 張`
  if (!processing && skipped.length > 0) summaryTitle += `，${skipped.length} 張略過`

  let primaryLabel: string
  if (processing) primaryLabel = '轉換中…'
  else if (zipping) primaryLabel = '打包中…'
  else if (done.length === 1) primaryLabel = `下載 ${done[0].result!.name}`
  else if (failed.length > 0 || skipped.length > 0) primaryLabel = `下載 ${done.length} 張（ZIP）`
  else primaryLabel = '全部下載（ZIP）'

  return (
    <>
      <div className="panel">
        {!fixedOutput && (
          <fieldset>
            <legend className="field-label">輸出格式</legend>
            <div className="segmented">
              {OUTPUT_FORMATS.map((format) => (
                <label key={format.id}>
                  <input
                    type="radio"
                    name="output"
                    value={format.id}
                    checked={output.id === format.id}
                    onChange={() => setOutput(format)}
                  />
                  <span>{format.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {output.id === 'jpg' && (
          <div className="slider">
            <div className="slider__head">
              <label className="field-label" htmlFor={qualityId}>
                品質
              </label>
              <span className="slider__value" aria-hidden="true">
                {quality}
              </span>
            </div>
            <input
              className="range"
              id={qualityId}
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              style={{ '--val': ((quality - 10) / 90) * 100 } as React.CSSProperties}
              aria-valuetext={`${quality}，數值越高畫質越好、檔案越大`}
            />
            <div className="slider__scale" aria-hidden="true">
              <span>檔案較小</span>
              <span>畫質較好</span>
            </div>
          </div>
        )}

        <div className="inline-note">
          <Icon name="info" />
          <span>
            {settingsNote}
            {hasItems && ' 調整設定只會套用到之後加入的圖片。'}
          </span>
        </div>
      </div>

      <div className={`dropzone${hasItems ? ' dropzone--compact' : ''}${dragging ? ' is-dragover' : ''}`}>
        {!hasItems && <Icon name="upload" size={40} className="dropzone__icon only-desktop" />}
        {!hasItems && (
          <span className="dropzone__title only-desktop">{dragging ? '放開以加入圖片' : '拖曳圖片到這裡，或'}</span>
        )}
        <button
          ref={pickRef}
          className={`btn ${hasItems ? 'btn--secondary' : 'btn--primary btn--lg'}`}
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-describedby={hintId}
        >
          {hasItems && <Icon name="plus" />}
          {hasItems ? '加入更多圖片' : '選擇圖片'}
        </button>
        <span className="dropzone__sub only-desktop" id={hintId}>
          {hasItems
            ? dragging
              ? '放開以加入圖片'
              : '或拖曳、貼上'
            : `也可以直接貼上（${pasteKey}）· 支援 JPG、PNG、WebP 等常見格式，可多選`}
        </span>
        {!hasItems && <span className="dropzone__sub only-mobile">可一次選多張</span>}
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handlePick} />
      </div>

      {rejectNote && (
        <div className="inline-note inline-note--error reject-note" role="alert">
          <Icon name="x" />
          <span>{rejectNote}</span>
        </div>
      )}

      {hasItems && (
        <>
          <div className="summary">
            <div className="summary__stats">
              <div className="summary__title">
                {processing && <span className="spinner" aria-hidden="true" />}
                <span>{summaryTitle}</span>
              </div>
              {done.length > 0 && (
                <div className="summary__total">
                  <span>共</span>
                  <SizeCompare from={totalFrom} to={totalTo} large />
                </div>
              )}
              {!processing && done.length > 0 && isIOS && (
                <p className="summary__hint">iPhone：下載的圖片會在「檔案」App 的「下載項目」裡。</p>
              )}
            </div>
            <div className="summary__actions">
              <button className="btn btn--ghost" type="button" onClick={clearAll}>
                {done.length === 0 && !processing ? '清除並重新選擇' : '清除全部'}
              </button>
              {(processing || done.length > 0) && (
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={downloadAll}
                  disabled={processing || zipping}
                >
                  {processing || zipping ? <span className="spinner" aria-hidden="true" /> : <Icon name="download" />}
                  <span className="btn__label">{primaryLabel}</span>
                </button>
              )}
            </div>
          </div>

          {!processing && totalTo > LARGE_ZIP_BYTES && done.length > 1 && (
            <div className="inline-note inline-note--warning">
              <Icon name="warn" />
              <span>檔案很大，打包可能需要一點時間，手機可能無法完成。</span>
            </div>
          )}

          <ul className="file-list" ref={listRef}>
            {items.map((item) => (
              <FileCard key={item.id} item={item} onRemove={removeItem} onForce={forceItem} />
            ))}
          </ul>
          <div className="actionbar-spacer" aria-hidden="true" />
        </>
      )}

      <div className="sr-only" role="status">
        {announcement}
      </div>

      {toast && (
        <div className="toast" role="alert" key={toast.id}>
          <Icon name="warn" size={18} className="toast__icon" />
          <span className="toast__text">{toast.message}</span>
          <button className="btn btn--ghost btn--sm btn--icon" type="button" aria-label="關閉通知" onClick={() => setToast(null)}>
            <Icon name="x" size={14} />
          </button>
        </div>
      )}
    </>
  )
}
