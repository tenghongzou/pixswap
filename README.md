# pixswap

在瀏覽器內完成的圖片格式轉換工具。所有轉換都透過 Canvas API 在使用者裝置上執行，**圖片不會上傳到任何伺服器**。

線上版：<https://tenghongzou.github.io/pixswap/>

## 功能

| 頁面 | 說明 |
|---|---|
| `/jpg-to-png` | JPG 轉 PNG |
| `/png-to-jpg` | PNG 轉 JPG，可調整品質；透明區域會以白底填滿 |

- 支援一次選取多個檔案批次轉換
- 轉換後可預覽、查看檔案大小並直接下載

## 技術

- [Next.js](https://nextjs.org/) 16（Pages Router，`output: 'export'` 靜態匯出）
- React 19、TypeScript 6
- ESLint 9（flat config，`eslint-config-next`）
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
│   └── ImageConverter.tsx   # 共用轉檔元件（Canvas 轉檔、下載、預覽）
├── pages/
│   ├── _app.tsx
│   ├── index.tsx            # 首頁
│   ├── jpg-to-png.tsx
│   └── png-to-jpg.tsx
└── styles/
    └── globals.css
```

新增轉換類型時，在 `ImageConverter.tsx` 定義新的 `Format`，再新增一個頁面傳入 `from` / `to` 即可。

## 部署

push 到 `master` 會觸發 `.github/workflows/deploy.yml`：

1. `yarn lint` → `yarn build`
2. build 時以 `NEXT_PUBLIC_BASE_PATH=/<repo 名稱>` 設定子路徑
3. 將 `out/` 發佈到 `gh-pages` 分支

GitHub repo 的 **Settings → Pages** 來源需設為 `gh-pages` 分支。
