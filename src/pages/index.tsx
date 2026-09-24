import Link from 'next/link'
import Converter from '@/components/Converter'
import Icon from '@/components/Icon'
import Layout from '@/components/Layout'
import Privacy from '@/components/Privacy'

export default function IndexPage() {
  return (
    <Layout
      title="pixswap：線上圖片格式轉換，不用上傳"
      description="在瀏覽器內把 JPG、PNG、WebP 等圖片轉成 JPG 或 PNG，可以一次轉多張，圖片不會上傳。"
      path="/"
    >
      <div className="intro">
        <h1>圖片格式轉換，全部在你的瀏覽器裡完成</h1>
        <Privacy />
      </div>

      <Converter />

      <nav className="popular" aria-labelledby="popular-title">
        <h2 id="popular-title">常用轉換</h2>
        <ul>
          <li>
            <Link href="/jpg-to-png/">
              JPG 轉 PNG <Icon name="chev" size={14} />
            </Link>
          </li>
          <li>
            <Link href="/png-to-jpg/">
              PNG 轉 JPG <Icon name="chev" size={14} />
            </Link>
          </li>
        </ul>
      </nav>
    </Layout>
  )
}
