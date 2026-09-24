import type { AppProps } from 'next/app'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'

// build 時下載並自架，使用者瀏覽時不會連到 Google；只取 latin 子集，中文走系統字
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['500', '700'], display: 'swap' })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* 掛到 :root 讓 globals.css 的 token 讀得到；next/font 的 variable 只會定義在套用 className 的元素上 */}
      <style jsx global>{`
        :root {
          --font-bricolage: ${bricolage.style.fontFamily};
          --font-jetbrains: ${jetbrains.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
