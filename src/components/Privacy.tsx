import Icon from './Icon'

export default function Privacy() {
  return (
    <details className="privacy">
      <summary>
        <Icon name="lock" size={14} />
        <span>圖片不會上傳，關掉分頁就消失。</span>
        <span className="link">怎麼做到的？</span>
      </summary>
      <div className="privacy__body">
        <p>
          pixswap 沒有伺服器。轉換是用你的瀏覽器內建功能在這台裝置上完成的，圖片從頭到尾沒有離開你的電腦或手機。你可以在載入頁面後關掉網路，一樣能轉換。
        </p>
        <p>附帶一提：轉換後的圖片不會保留拍攝地點、相機型號等資訊（EXIF）。</p>
      </div>
    </details>
  )
}
