import { Head, Html, Main, NextScript } from 'next/document'
import { THEME_KEY } from '@/components/Layout'

// 在頁面繪製前套用使用者手動選的主題，避免閃一下錯的顏色
const themeScript = `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}`

export default function Document() {
  return (
    <Html lang="zh-Hant">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
