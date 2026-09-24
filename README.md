# pixswap

在瀏覽器內完成的圖片格式轉換工具。所有轉換都透過 Canvas API 在使用者裝置上執行，**圖片不會上傳到任何伺服器**。

線上版：<https://tenghongzou.github.io/pixswap/>

## 功能

| 頁面 | 說明 |
|---|---|
| `/` | 萬用轉換器：任何瀏覽器能讀的圖片（JPG、PNG、WebP、GIF…）轉成 PNG 或 JPG |
| `/jpg-to-png/` | JPG 轉 PNG 落地頁 |
| `/png-to-jpg/` | PNG 轉 JPG 落地頁；透明區域會以白底填滿 |

- 點選、拖放（整個視窗都能放）、⌘V／Ctrl+V 貼上，加入後自動開始轉換
- 逐張依序處理，轉檔中可以繼續加入排隊；每張各自成功或失敗
- 顯示轉檔前後大小比較；單張下載，或打包成 ZIP 全部下載（自寫 STORE 模式，零依賴）
- 已經是目標格式的圖片會標成「略過」，可選擇仍要重新輸出

設計規格見 [`docs/design/`](docs/design/)（UX 流程、UI tokens 與 mockup）。

## 技術

- [Next.js](https://nextjs.org/) 16（Pages Router，`output: 'export'` 靜態匯出）
- React 19、TypeScript 6
- ESLint 9（flat config，`eslint-config-next`）
- 字體用 `next/font/google` 在 build 時自架（Bricolage Grotesque、JetBrains Mono），瀏覽時不會連到 Google
- GitHub Actions 自動部署到 GitHub Pages

## 開發

需求：Node.js 20.9 以上、Yarn 1.x

```bash
yarn install
yarn dev      # 開發伺服器 http://localhost:3000
yarn lint     # ESLint
yarn build    # 靜態匯出到 out/
yarn start    # 以靜態伺服器預覽 out/
```

## 專案結構

```
src/
├── components/
│   ├── Converter.tsx   # 轉換器：設定、拖放／貼上、佇列、摘要與下載
│   ├── FileCard.tsx    # 單一檔案卡片（等待中／轉換中／完成／略過／失敗）
│   ├── Layout.tsx      # 頁首、頁尾、SEO 標籤、主題切換
│   ├── PairPage.tsx    # 格式配對落地頁
│   └── …
├── lib/
│   ├── convert.ts      # Canvas 轉檔與白話錯誤訊息
│   ├── formats.ts      # 輸出格式定義、來源格式判斷
│   ├── zip.ts          # STORE 模式 ZIP 產生器
│   └── text.ts         # 大小、百分比、檔名處理
├── pages/              # index、jpg-to-png、png-to-jpg、404、_app、_document
└── styles/globals.css  # design tokens 與全站樣式
```

新增格式配對時，在 `src/pages/` 加一個頁面並傳入 `PairPage` 的 `from` / `to`；新增輸出格式則在 `lib/formats.ts` 定義並加進 `OUTPUT_FORMATS`。

## 部署

push 到 `master` 會觸發 `.github/workflows/deploy.yml`：

1. `yarn lint` → `yarn build`
2. build 時以 `NEXT_PUBLIC_BASE_PATH=/<repo 名稱>` 設定子路徑
3. 將 `out/` 發佈到 `gh-pages` 分支

GitHub repo 的 **Settings → Pages** 來源需設為 `gh-pages` 分支。
