/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 純前端轉檔，靜態匯出到 out/ 供 GitHub Pages 部署
  output: 'export',
  // GitHub Pages 專案頁位於 /<repo> 子路徑，由 CI 注入
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // 輸出成 jpg-to-png/index.html，GitHub Pages 重新整理時才不會 404
  trailingSlash: true,
  images: { unoptimized: true },
}

module.exports = nextConfig
