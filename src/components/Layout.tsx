import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import Icon, { IconSprite } from './Icon'

export const REPO_URL = 'https://github.com/tenghongzou/pixswap'
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const SITE_URL = `https://tenghongzou.github.io${BASE_PATH}`
export const THEME_KEY = 'pixswap-theme'

type Props = {
  title: string
  description: string
  // 相對於站台根目錄的路徑，例如 '/'、'/png-to-jpg/'
  path: string
  children: ReactNode
}

function isDark(): boolean {
  const theme = document.documentElement.getAttribute('data-theme')
  return theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
}

// 圖示由 CSS 依主題切換（避免載入時閃爍），這裡只負責切換與無障礙標籤
function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const sync = () => setDark(isDark())
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const toggle = () => {
    const next = isDark() ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // 無痕模式等情況存不了偏好，當次仍然有效
    }
    setDark(next === 'dark')
  }

  return (
    <button
      className="btn btn--ghost btn--icon theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={dark ? '切換淺色模式' : '切換深色模式'}
    >
      <Icon name="moon" size={18} className="icon-moon" />
      <Icon name="sun" size={18} className="icon-sun" />
    </button>
  )
}

export default function Layout({ title, description, path, children }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}${path}`} />
        <link rel="icon" href={`${BASE_PATH}/favicon.svg`} type="image/svg+xml" />
      </Head>
      <IconSprite />

      <header className="site-header">
        <div className="container">
          <Link className="logo" href="/" aria-label="pixswap 首頁">
            <Icon name="logo" size={28} />
            <span className="logo__word">
              pix<b>swap</b>
            </span>
          </Link>
          <div className="header-actions">
            <a className="btn btn--ghost btn--sm" href={REPO_URL}>
              GitHub <Icon name="ext" size={14} />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container">{children}</main>

      <footer className="site-footer">
        <div className="container">
          <p>
            pixswap 是開源專案 · 所有轉換在本機進行 · <a href={REPO_URL}>原始碼</a>
          </p>
        </div>
      </footer>
    </>
  )
}
