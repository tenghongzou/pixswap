import { formatDelta, formatSize } from '@/lib/text'

type Props = {
  from: number
  to: number
  large?: boolean
}

export default function SizeCompare({ from, to, large }: Props) {
  const delta = formatDelta(from, to)
  const verb = { down: '縮小為', up: '變大為', same: '變為' }[delta.trend]
  const change = delta.trend === 'same' ? '' : `，${delta.trend === 'down' ? '減少' : '增加'} ${delta.text.slice(1)}`

  return (
    <span
      className={`size${large ? ' size--lg' : ''}`}
      role="img"
      aria-label={`由 ${formatSize(from)} ${verb} ${formatSize(to)}${change}`}
    >
      <span className="size__from">{formatSize(from)}</span>
      <span className="size__arrow">→</span>
      <span className="size__to">{formatSize(to)}</span>
      <span className={`delta delta--${delta.trend}`}>{delta.text}</span>
    </span>
  )
}
