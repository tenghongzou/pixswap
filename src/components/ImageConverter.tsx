import { useEffect, useState } from 'react'
import Link from 'next/link'

type Format = {
  label: string
  mime: 'image/jpeg' | 'image/png'
  ext: string
}

export const JPG: Format = { label: 'JPG', mime: 'image/jpeg', ext: 'jpg' }
export const PNG: Format = { label: 'PNG', mime: 'image/png', ext: 'png' }

type Result = {
  name: string
  url: string
  size: number
}

type Props = {
  from: Format
  to: Format
}

// 在瀏覽器內以 Canvas 轉檔，檔案不會離開使用者裝置
async function convert(file: File, to: Format, quality: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('瀏覽器不支援 Canvas 2D')

  // JPG 不支援透明，先鋪白底避免透明區域變成黑色
  if (to.mime === 'image/jpeg') {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('轉檔失敗'))),
      to.mime,
      quality,
    )
  })
}

function renameExt(name: string, ext: string): string {
  const dot = name.lastIndexOf('.')
  return `${dot > 0 ? name.slice(0, dot) : name}.${ext}`
}

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function ImageConverter({ from, to }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [quality, setQuality] = useState(0.92)
  const [results, setResults] = useState<Result[]>([])
  const [error, setError] = useState<string | null>(null)
  const [converting, setConverting] = useState(false)

  // 釋放舊的 object URL，避免記憶體洩漏
  useEffect(() => {
    return () => results.forEach((r) => URL.revokeObjectURL(r.url))
  }, [results])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files ?? []))
    setResults([])
    setError(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setConverting(true)
    setError(null)

    try {
      const converted = await Promise.all(
        files.map(async (file) => {
          const blob = await convert(file, to, quality)
          return {
            name: renameExt(file.name, to.ext),
            url: URL.createObjectURL(blob),
            size: blob.size,
          }
        }),
      )
      setResults(converted)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setConverting(false)
    }
  }

  return (
    <main>
      <Link href="/">← 回首頁</Link>
      <h1>
        {from.label} to {to.label} 轉換器
      </h1>
      <p className="hint">所有轉換都在瀏覽器內完成，圖片不會上傳到伺服器。</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="fileInput">選擇要轉換的 {from.label} 檔案（可多選）：</label>
        <input
          type="file"
          id="fileInput"
          accept={from.mime}
          multiple
          onChange={handleFileChange}
        />

        {to.mime === 'image/jpeg' && (
          <label htmlFor="quality">
            品質：{Math.round(quality * 100)}
            <input
              type="range"
              id="quality"
              min={0.1}
              max={1}
              step={0.01}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
            />
          </label>
        )}

        <button type="submit" disabled={files.length === 0 || converting}>
          {converting ? '轉換中…' : `轉換為 ${to.label}`}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {results.length > 0 && (
        <ul className="results">
          {results.map((r) => (
            <li key={r.url}>
              {/* eslint-disable-next-line @next/next/no-img-element -- blob URL 無法走 next/image */}
              <img src={r.url} alt={r.name} />
              <a href={r.url} download={r.name}>
                下載 {r.name}
              </a>
              <span className="hint">{formatSize(r.size)}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
