import Link from 'next/link'

export default function IndexPage() {
  return (
    <main>
      <h1>Image Tools</h1>
      <p className="hint">在瀏覽器內完成的圖片格式轉換工具。</p>
      <ul className="links">
        <li>
          <Link href="/jpg-to-png">JPG to PNG</Link>
        </li>
        <li>
          <Link href="/png-to-jpg">PNG to JPG</Link>
        </li>
      </ul>
    </main>
  )
}
