export type OutputFormat = {
  id: 'jpg' | 'png'
  label: string
  mime: 'image/jpeg' | 'image/png'
  ext: string
}

export const JPG: OutputFormat = { id: 'jpg', label: 'JPG', mime: 'image/jpeg', ext: 'jpg' }
export const PNG: OutputFormat = { id: 'png', label: 'PNG', mime: 'image/png', ext: 'png' }

export const OUTPUT_FORMATS = [PNG, JPG]

// 常見 MIME 對應的顯示名稱；其餘用副檔名推斷
const MIME_LABELS: Record<string, string> = {
  'image/jpeg': 'JPG',
  'image/jpg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WEBP',
  'image/gif': 'GIF',
  'image/bmp': 'BMP',
  'image/avif': 'AVIF',
  'image/heic': 'HEIC',
  'image/heif': 'HEIF',
  'image/tiff': 'TIFF',
  'image/svg+xml': 'SVG',
}

function extOf(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : ''
}

export function sourceLabel(file: File): string {
  const label = MIME_LABELS[file.type] ?? extOf(file.name).toUpperCase()
  return label === 'JPEG' ? 'JPG' : label || '?'
}

export function isSameFormat(file: File, to: OutputFormat): boolean {
  return sourceLabel(file) === to.label
}

// 瀏覽器有時給不出 MIME（例如 HEIC），用副檔名補判斷
export function isHeic(file: File): boolean {
  return /image\/hei[cf]/.test(file.type) || ['heic', 'heif'].includes(extOf(file.name))
}

export function looksLikeImage(file: File): boolean {
  return file.type.startsWith('image/') || isHeic(file)
}
