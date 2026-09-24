// SVG sprite：在 Layout 放一次 <IconSprite />，各處用 <Icon name="…" /> 引用

export type IconName =
  | 'logo'
  | 'upload'
  | 'image'
  | 'plus'
  | 'chev'
  | 'ext'
  | 'download'
  | 'check'
  | 'x'
  | 'skip'
  | 'clock'
  | 'info'
  | 'warn'
  | 'lock'
  | 'sun'
  | 'moon'

type Props = {
  name: IconName
  size?: number
  className?: string
}

export default function Icon({ name, size = 16, className }: Props) {
  return (
    <svg width={size} height={size} className={className} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  )
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="i-logo" viewBox="0 0 28 28">
          <rect x="2" y="2" width="11" height="11" rx="2.5" fill="var(--color-accent)" />
          <rect x="15" y="15" width="11" height="11" rx="2.5" fill="currentColor" />
          <path d="M17 3.5h4.5a3 3 0 0 1 3 3V11" {...stroke} />
          <path d="M21.5 8.5l2.5 2.5 2.5-2.5" {...stroke} />
          <path d="M11 24.5H6.5a3 3 0 0 1-3-3V17" {...stroke} stroke="var(--color-accent)" />
          <path d="M1 19.5l2.5-2.5 2.5 2.5" {...stroke} stroke="var(--color-accent)" />
        </symbol>
        <symbol id="i-upload" viewBox="0 0 24 24" {...stroke} strokeWidth={1.75}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 16l5-5 4 4 3-3 6 6" />
          <circle cx="16" cy="8" r="1.6" />
        </symbol>
        <symbol id="i-image" viewBox="0 0 24 24" {...stroke} strokeWidth={1.75}>
          <rect x="4" y="4" width="16" height="16" rx="2.5" />
          <path d="M4 15l4-4 3.5 3.5L14 12l6 6" />
        </symbol>
        <symbol id="i-plus" viewBox="0 0 24 24" {...stroke}>
          <path d="M12 5v14M5 12h14" />
        </symbol>
        <symbol id="i-chev" viewBox="0 0 24 24" {...stroke}>
          <path d="M9 6l6 6-6 6" />
        </symbol>
        <symbol id="i-ext" viewBox="0 0 24 24" {...stroke}>
          <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </symbol>
        <symbol id="i-download" viewBox="0 0 24 24" {...stroke}>
          <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
        </symbol>
        <symbol id="i-check" viewBox="0 0 24 24" {...stroke} strokeWidth={2.5}>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </symbol>
        <symbol id="i-x" viewBox="0 0 24 24" {...stroke} strokeWidth={2.5}>
          <path d="M6 6l12 12M18 6L6 18" />
        </symbol>
        <symbol id="i-skip" viewBox="0 0 24 24" {...stroke}>
          <path d="M4 16a8 8 0 0 1 14.5-6.5" />
          <path d="M19 4v6h-6" />
        </symbol>
        <symbol id="i-clock" viewBox="0 0 24 24" {...stroke}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </symbol>
        <symbol id="i-info" viewBox="0 0 24 24" {...stroke}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </symbol>
        <symbol id="i-warn" viewBox="0 0 24 24" {...stroke}>
          <path d="M12 3l9.5 17h-19z" />
          <path d="M12 10v4M12 17h.01" />
        </symbol>
        <symbol id="i-lock" viewBox="0 0 24 24" {...stroke}>
          <rect x="4" y="10" width="16" height="11" rx="2.5" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </symbol>
        <symbol id="i-sun" viewBox="0 0 24 24" {...stroke}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </symbol>
        <symbol id="i-moon" viewBox="0 0 24 24" {...stroke}>
          <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
        </symbol>
      </defs>
    </svg>
  )
}
