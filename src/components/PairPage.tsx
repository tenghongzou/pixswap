import Link from 'next/link'
import Converter from './Converter'
import Layout from './Layout'
import Privacy from './Privacy'
import type { OutputFormat } from '@/lib/formats'

type Props = {
  from: OutputFormat
  to: OutputFormat
}

// 格式配對的落地頁：輸出格式固定，改放反向連結（ux.md §2.2）
export default function PairPage({ from, to }: Props) {
  const title = `${from.label} 轉 ${to.label}`
  const description = `在瀏覽器內把 ${from.label} 轉成 ${to.label}，可以一次轉多張，圖片不會上傳。`

  return (
    <Layout title={`${title}：免上傳、可批次 · pixswap`} description={description} path={`/${from.ext}-to-${to.ext}/`}>
      <div className="intro intro--pair">
        <h1>{title}</h1>
        <p className="lead">{description}</p>
        <p className="lead">
          <Link href={`/${to.ext}-to-${from.ext}/`}>
            要反過來轉？{to.label} 轉 {from.label} →
          </Link>
        </p>
        <Privacy />
      </div>

      <Converter fixedOutput={to} />
    </Layout>
  )
}
