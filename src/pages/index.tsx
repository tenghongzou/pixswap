import React from 'react'
import Link from 'next/link'

const IndexPage: React.FC = () => {
    return (
        <div>
            <h1>歡迎來到我的網站</h1>
            <p>這是一個Next.js應用程式的首頁</p>
            <Link legacyBehavior href="/jpg-to-png">
                <a>前往JPG to PNG頁面</a>
            </Link>
            <Link legacyBehavior href="/png-to-jpg">
                <a>前往PNG to JPG頁面</a>
            </Link>
        </div>
    )
}

export default IndexPage
