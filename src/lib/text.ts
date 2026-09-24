export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// 用真正的減號（U+2212），不用連字號
export function formatDelta(from: number, to: number): { text: string; trend: 'down' | 'up' | 'same' } {
  const pct = from > 0 ? ((to - from) / from) * 100 : 0
  if (Math.abs(pct) < 1) return { text: '±0%', trend: 'same' }
  const rounded = Math.round(Math.abs(pct))
  return pct < 0 ? { text: `−${rounded}%`, trend: 'down' } : { text: `+${rounded}%`, trend: 'up' }
}

export function renameExt(name: string, ext: string): string {
  const dot = name.lastIndexOf('.')
  return `${dot > 0 ? name.slice(0, dot) : name}.${ext}`
}

// 同一批輸出檔名重複時，後者加上 -2、-3
export function uniqueName(name: string, taken: Set<string>): string {
  if (!taken.has(name)) return name
  const dot = name.lastIndexOf('.')
  const base = dot > 0 ? name.slice(0, dot) : name
  const ext = dot > 0 ? name.slice(dot) : ''
  let n = 2
  while (taken.has(`${base}-${n}${ext}`)) n++
  return `${base}-${n}${ext}`
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function timestamp(date = new Date(), withSeconds = true): string {
  const day = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  const time = `${pad(date.getHours())}${pad(date.getMinutes())}${withSeconds ? pad(date.getSeconds()) : ''}`
  return `${day}-${time}`
}
