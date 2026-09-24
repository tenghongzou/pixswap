import Link from 'next/link'
import Layout from '@/components/Layout'

export default function NotFoundPage() {
  return (
    <Layout title="找不到這個頁面 · pixswap" description="找不到這個頁面。" path="/404/">
      <div className="intro">
        <h1>找不到這個頁面</h1>
        <p className="lead">
          網址可能打錯了，或頁面已經搬走。<Link href="/">回到首頁開始轉換 →</Link>
        </p>
      </div>
    </Layout>
  )
}
