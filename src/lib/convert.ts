import { isHeic, type OutputFormat } from './formats'

export type Converted = {
  blob: Blob
  width: number
  height: number
}

// 錯誤訊息直接給使用者看，所以用白話文案（docs/design/ux.md §5.5）
export const MESSAGES = {
  decode: '無法讀取這個檔案。請確認它是 JPG、PNG 或 WebP 圖片。',
  heic: '這個瀏覽器無法讀取 HEIC。請改用 Safari，或在 iPhone「設定 › 相機 › 格式」選擇「最相容」。',
  tooLarge: '圖片太大，這台裝置無法處理。請改用電腦，或先縮小尺寸。',
  failed: '轉換失敗，請再試一次。如果一直失敗，可以試試一次少放幾張。',
  unsupported: '你的瀏覽器版本太舊，無法在本機轉換圖片。請更新瀏覽器後再試。',
}

// iOS Safari 的 Canvas 面積上限約 16.7M 像素，超過時 toBlob 會回傳 null
const IOS_CANVAS_AREA_LIMIT = 16_777_216

export class ConvertError extends Error {}

// 在瀏覽器內以 Canvas 轉檔，檔案不會離開使用者裝置
export async function convert(file: File, to: OutputFormat, quality: number): Promise<Converted> {
  if (typeof createImageBitmap !== 'function') throw new ConvertError(MESSAGES.unsupported)

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new ConvertError(isHeic(file) ? MESSAGES.heic : MESSAGES.decode)
  }

  const { width, height } = bitmap
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new ConvertError(MESSAGES.tooLarge)
  }

  // JPG 不支援透明，先鋪白底避免透明區域變成黑色
  if (to.mime === 'image/jpeg') {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
  }
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, to.mime, quality))
  // 釋放 Canvas 記憶體，批次轉檔時手機才撐得住
  canvas.width = canvas.height = 0

  if (!blob) {
    throw new ConvertError(width * height > IOS_CANVAS_AREA_LIMIT ? MESSAGES.tooLarge : MESSAGES.failed)
  }
  return { blob, width, height }
}
