import Icon from './Icon'
import SizeCompare from './SizeCompare'
import type { OutputFormat } from '@/lib/formats'
import { formatSize } from '@/lib/text'

export type ItemStatus = 'waiting' | 'processing' | 'done' | 'skipped' | 'error'

export type Item = {
  id: number
  file: File
  // 顯示用檔名：貼上的圖片會改成帶時間的名稱
  name: string
  source: string
  to: OutputFormat
  quality: number
  status: ItemStatus
  // 略過項用原圖當縮圖
  previewUrl?: string
  result?: {
    name: string
    blob: Blob
    url: string
    size: number
    width: number
    height: number
  }
  error?: string
}

type Props = {
  item: Item
  onRemove: (id: number) => void
  onForce: (id: number) => void
}

function Badge({ label }: { label: string }) {
  const kind = label === 'JPG' ? 'jpg' : label === 'PNG' ? 'png' : 'other'
  return <span className={`badge badge--${kind}`}>{label}</span>
}

const STATUS: Record<ItemStatus, { label: string; icon?: 'clock' | 'check' | 'skip' | 'x' }> = {
  waiting: { label: '等待中', icon: 'clock' },
  processing: { label: '轉換中…' },
  done: { label: '完成', icon: 'check' },
  skipped: { label: '略過', icon: 'skip' },
  error: { label: '失敗', icon: 'x' },
}

export default function FileCard({ item, onRemove, onForce }: Props) {
  const { status, result } = item
  const name = result?.name ?? item.name
  const status_ = STATUS[status]

  const thumb =
    result || item.previewUrl ? (
      // eslint-disable-next-line @next/next/no-img-element -- blob URL 無法走 next/image
      <img src={result?.url ?? item.previewUrl} alt="" />
    ) : (
      <Icon name={status === 'error' ? 'x' : 'image'} size={status === 'error' ? 20 : 22} />
    )

  return (
    <li className={`file file--${status}`} data-id={item.id}>
      <div className={`file__thumb${result || item.previewUrl ? '' : ' file__thumb--placeholder'}`}>
        {result ? (
          <a href={result.url} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">
            {thumb}
          </a>
        ) : (
          thumb
        )}
      </div>

      <div className="file__info">
        <div className="file__row">
          <span className="file__name" title={name}>
            {name}
          </span>
          <span className="status">
            {status === 'processing' ? (
              <span className="spinner" aria-hidden="true" />
            ) : (
              status_.icon && <Icon name={status_.icon} size={14} />
            )}
            {status_.label}
          </span>
        </div>

        {status === 'processing' && <div className="indeterminate" aria-hidden="true" />}
        {status === 'error' && <p className="file__msg">{item.error}</p>}
        {status === 'skipped' && <p className="file__msg">已經是 {item.to.label}，不需要轉換</p>}
        {result && (
          <>
            <SizeCompare from={item.file.size} to={result.size} />
            {result.size > item.file.size * 1.01 && item.to.id === 'png' && (
              <p className="size-note">PNG 是無損格式，檔案變大是正常的，畫質不會因此變差。</p>
            )}
          </>
        )}

        <div className="file__meta">
          {status === 'skipped' || status === 'error' ? (
            <Badge label={item.source} />
          ) : (
            <span className="convert-dir">
              <Badge label={item.source} />→<Badge label={item.to.label} />
            </span>
          )}
          <span className="mono">
            {result ? `${result.width}×${result.height}` : formatSize(item.file.size)}
          </span>
        </div>
      </div>

      <div className="file__actions">
        {result && (
          <a className="btn btn--secondary btn--sm" href={result.url} download={result.name} aria-label={`下載 ${result.name}`}>
            <Icon name="download" size={14} />
            下載
          </a>
        )}
        {status === 'skipped' && (
          <button className="btn btn--ghost btn--sm" type="button" onClick={() => onForce(item.id)}>
            仍要重新輸出
          </button>
        )}
        <button className="btn btn--ghost btn--sm" type="button" onClick={() => onRemove(item.id)} aria-label={`移除 ${name}`}>
          移除
        </button>
      </div>
    </li>
  )
}

