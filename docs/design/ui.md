# pixswap UI 視覺規格

> 範圍：視覺語言，包含色彩、字體、間距、元件外觀與狀態。流程、文案和無障礙規則以 `docs/design/ux.md` 為準（文案見 §5），本文件只定義「長什麼樣子」。
> 對應 mockup：`docs/design/mockup.html`，直接用瀏覽器開啟。右上角可以切換 light / dark。
> 修訂 v2（2026-09-24）：首頁就是轉換器；轉檔中可以繼續排隊加檔；檔案卡有五個狀態；字體改由 `next/font` 自架。

---

## 1. 品牌方向

pixswap 的核心承諾是「圖片不離開你的電腦」。視覺要讓人一眼就信任、三秒內會用，但不要長得像隨處可見的藍色 SaaS 模板。

### 方向 A：印樣工作台（Contact Sheet）——**採用**

- **意象**：攝影暗房裡的印樣紙和工作桌。暖白紙色底、墨黑文字，重點色用朱砂（cinnabar），像印樣上的校對記號。
- **識別元素**：
  - **透明棋盤格**：影像軟體用這種格紋表示「透明」。拿來當拖放區底紋，暗示這裡是處理圖片的地方，也呼應 PNG 的透明特性。
  - **等寬數字**：檔案大小、百分比、格式代號一律用等寬字，像量測儀表。「3.8 MB → 612 KB −84%」這類資訊可以一眼掃完。
  - **紙張壓印陰影**：按鈕和卡片用 1–2px 的實色底邊（hard shadow），像紙疊在桌上，不用大片模糊陰影。
- **個性關鍵字**：可靠、手作感、精準、安靜。

### 方向 B：霓虹像素（Neon Pixel）——不採用

- **意象**：深色底、電光萊姆綠重點色、8-bit 像素字標、掃描線質感。
- **優點**：辨識度高，對開發者族群有吸引力。
- **不採用的原因**：
  1. 主要使用者多半只是想把一張 PNG 轉成 JPG 的一般人（ux.md 情境 B）。遊戲感會削弱工具的可信度，也和「隱私」訴求的沉穩調性衝突。
  2. 萊姆綠當底色時很難配出符合 AA 的文字對比，淺色模式尤其難處理。
  3. 像素字體幾乎不支援中文，中英混排會很破碎。

### 選 A 的理由

- 暖色紙感和常見的冷藍 SaaS 明顯不同，版面仍然是乾淨的工具型結構：單欄、主要動作清楚、狀態顏色有語意。
- 棋盤格和等寬數字這兩個元素本身就有功能：一個標示拖放區，一個讓數字好讀。它們不是純裝飾。
- 朱砂色在淺、深兩種模式下都容易調出 AA 對比。

> 已知風險：朱砂重點色和錯誤紅色相近。處理方式：error 偏向**玫瑰緋紅**（色相約 350°），重點色偏**橘朱**（約 13°）；錯誤狀態**一定同時用圖示、文字和左側色條**表示，不能只靠顏色區分，這也照顧到色覺辨識障礙的使用者。

---

## 2. Design Tokens

### 2.1 色彩

對比度依 WCAG 2.x 的相對亮度公式計算。AA 門檻：一般文字 4.5:1，大字和 UI 元件邊界 3:1。

#### Light

| Token | 值 | 用途 | 對比度 |
|---|---|---|---|
| `--color-bg` | `#F7F4EE` | 頁面底色（暖白紙） | — |
| `--color-surface` | `#FFFFFF` | 卡片、面板 | — |
| `--color-surface-2` | `#F0EBE3` | 次層區塊、分段選擇器軌道、縮圖佔位 | — |
| `--color-border` | `#E2DBD0` | 裝飾性分隔線、卡片外框 | 裝飾用，不要求 |
| `--color-border-strong` | `#8C8378` | 輸入框、滑桿軌道、拖放區虛線、略過狀態色條 | 對 surface **3.7:1**（AA 非文字） |
| `--color-fg` | `#1C1917` | 主要文字 | 對 bg **15.9:1**、對 surface 17.5:1（AAA） |
| `--color-fg-muted` | `#6B635A` | 次要文字、說明 | 對 bg **5.5:1**、對 surface 6.0:1（AA） |
| `--color-accent` | `#C23B17` | 朱砂：主要按鈕、連結、焦點、轉換中 | 白字在上 **5.3:1**、對 bg 4.9:1（AA） |
| `--color-accent-hover` | `#A83212` | hover | 白字 6.6:1 |
| `--color-accent-active` | `#8E2A0F` | 按下 | 白字 8.3:1 |
| `--color-accent-fg` | `#FFFFFF` | 重點色上的文字 | — |
| `--color-accent-soft` | `#FBE6DD` | 選取、dragover 底色 | — |
| `--color-success` | `#2F7A3E` | 完成、檔案變小 | 對 surface **5.3:1**、對 bg 4.8:1 |
| `--color-success-soft` | `#E4F1E6` | 完成狀態底色 | — |
| `--color-warning` | `#8A5A00` | 注意事項、檔案變大 | 對 surface **5.9:1** |
| `--color-warning-soft` | `#FBF0D9` | — | — |
| `--color-error` | `#A8233A` | 失敗（玫瑰緋紅） | 對 surface **7.1:1** |
| `--color-error-soft` | `#F9E3E7` | — | — |
| `--color-focus` | `#C23B17` | 焦點環（和 accent 相同） | 對 bg 4.9:1 |

#### Dark

| Token | 值 | 用途 | 對比度 |
|---|---|---|---|
| `--color-bg` | `#151311` | 頁面底色（暗房） | — |
| `--color-surface` | `#1E1B18` | 卡片 | — |
| `--color-surface-2` | `#27231F` | 次層 | — |
| `--color-border` | `#35302A` | 裝飾性分隔 | — |
| `--color-border-strong` | `#6E665D` | 輸入框、軌道 | 對 bg **3.3:1**、對 surface 3.0:1 |
| `--color-fg` | `#F2EDE6` | 主要文字 | 對 bg **15.9:1** |
| `--color-fg-muted` | `#A89F94` | 次要文字 | 對 bg **7.1:1**、對 surface 6.5:1 |
| `--color-accent` | `#FF7A4D` | 朱砂（提亮） | 對 bg **7.2:1** |
| `--color-accent-hover` | `#FF9168` | hover（深色模式的 hover 是變亮） | — |
| `--color-accent-active` | `#F2683A` | 按下 | — |
| `--color-accent-fg` | `#1A0A04` | 重點色上的文字（深色字） | 對 accent **7.5:1** |
| `--color-accent-soft` | `#33190F` | — | — |
| `--color-success` | `#5BC27A` | — | 對 bg **8.1:1** |
| `--color-success-soft` | `#16271B` | — | — |
| `--color-warning` | `#E8B04A` | — | 對 bg **9.3:1** |
| `--color-warning-soft` | `#2B2213` | — | — |
| `--color-error` | `#F2708A` | — | 對 bg **6.6:1** |
| `--color-error-soft` | `#2E171C` | — | — |

**深色模式策略**：不是單純把顏色反轉。底色維持暖棕黑，不用純黑，以免和縮圖的黑邊混在一起。重點色提亮後改配深色字。陰影改用 `rgba(0,0,0,.4)` 加 1px 亮邊來做出層次。

### 2.2 字體

| 角色 | Token | 字體堆疊 | 說明 |
|---|---|---|---|
| Display（標題、字標） | `--font-display` | `var(--font-bricolage, "Bricolage Grotesque"), var(--font-sans)` | 字形帶一點手作的彎折，是和 SaaS 模板拉開差距的主要來源。只用 600、700 |
| Sans（內文、UI） | `--font-sans` | `system-ui, -apple-system, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif` | 全部用系統字，不需要下載 |
| Mono（大小、百分比、格式 badge） | `--font-mono` | `var(--font-jetbrains, "JetBrains Mono"), ui-monospace, "SF Mono", Menlo, Consolas, monospace` | 只用 500、700 |

#### 正式版：用 `next/font/google` 自架

`next/font/google` 會在 **build 時**下載字檔，輸出到 `/_next/static/media/`，和網站一起部署到 GitHub Pages。使用者瀏覽時**不會連到 Google**，符合「不上傳、隱私」的品牌承諾。靜態匯出（`output: 'export'`）和 `basePath` 都支援，另外會自動產生尺寸校正過的 fallback 字體，減少版面位移（CLS）。

建議的 `src/pages/_app.tsx`：

```tsx
import type { AppProps } from 'next/app'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import '../styles/globals.css'

// build 時下載並自架；只取 latin 子集，中文走系統字
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* 把 next/font 產生的 font-family 掛到 :root，供 globals.css 的 token 使用 */}
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
```

**為什麼不用 `variable` 選項加 className**：`next/font` 的 `variable` 會把 CSS 變數定義在「套用 className 的元素」上。Pages Router 裡這個元素通常是 `_app` 的包裝 `<div>`，但 token 是在 `:root` 解析的，`:root` 讀不到子元素上的變數，結果會直接落到 fallback。用 `style jsx global` 把變數寫到 `:root` 最直接，styled-jsx 是 Next 內建的，不需要另外安裝。

**`var()` 的第二個參數**：`--font-display` 寫成 `var(--font-bricolage, "Bricolage Grotesque")`。正式版會用 next/font 注入的值；mockup 或 Storybook 沒有注入時，就退回字體名稱，改用 Google Fonts `<link>` 載入的字體。

#### 中文 fallback

- Bricolage 和 JetBrains Mono 只取 latin 子集。瀏覽器遇到中文會逐字 fallback 到 `--font-sans`，所以 h1「圖片格式轉換，全部在你的瀏覽器裡完成」這種中英混排的標題，英數字用 Bricolage，中文用蘋方或正黑。
- 中文**完全不下載字檔**：macOS 和 iOS 用蘋方，Windows 用微軟正黑，Android 用系統內建的 Noto Sans CJK。`"Noto Sans TC"` 只是名稱比對，不會觸發下載。
- 中文標題的 `letter-spacing` 設 0，Bricolage 英文設 `-0.02em`。內文行高 1.7，因為中文需要比英文寬鬆的行高。
- 數字一律加上 `font-variant-numeric: tabular-nums`，清單裡的數字才會上下對齊。

> mockup.html 為了能單檔預覽，仍然用 Google Fonts `<link>` 載入，檔案內有註解標明「只供預覽，正式版不要這樣做」。

### 2.3 字級階層（基準 16px，比例約 1.25）

| Token | 值 | 行高 | 字重 | 用途 |
|---|---|---|---|---|
| `--text-xs` | 12px | 1.5 | 500 | badge、輔助標籤 |
| `--text-sm` | 14px | 1.6 | 400 | 說明文字、檔案 meta |
| `--text-base` | 16px | 1.7 | 400 | 內文、按鈕 |
| `--text-lg` | 18px | 1.6 | 600 | 摘要列、拖放區主文字 |
| `--text-xl` | 22px | 1.4 | 700 | 區塊標題 |
| `--text-2xl` | 28px | 1.3 | 700 | 落地頁 h1（「PNG 轉 JPG」） |
| `--text-h1-home` | `clamp(24px, 3vw + 14px, 36px)` | 1.3 | 700 | 首頁 h1（一行標語，不做大型 hero） |

### 2.4 間距（4px 基準）

`--space-1: 4px`、`--space-2: 8px`、`--space-3: 12px`、`--space-4: 16px`、`--space-5: 20px`、`--space-6: 24px`、`--space-8: 32px`、`--space-10: 40px`、`--space-12: 48px`、`--space-16: 64px`

- 版面寬度：首頁和落地頁一律單欄，`--content-max: 760px`
- 頁面左右留白：手機 16px，≥640px 用 24px
- 卡片內距：手機 12px 16px，≥640px 用 16px 20px

### 2.5 圓角

| Token | 值 | 用途 |
|---|---|---|
| `--radius-sm` | 6px | badge、縮圖、小按鈕 |
| `--radius-md` | 10px | 按鈕、輸入框、檔案卡 |
| `--radius-lg` | 16px | 拖放區、設定面板 |
| `--radius-full` | 9999px | 滑桿、chip、流動條 |

### 2.6 陰影（紙張壓印風格）

| Token | Light | Dark |
|---|---|---|
| `--shadow-press` | `0 1px 0 rgba(28,25,23,.12)` | `0 1px 0 rgba(0,0,0,.5)` |
| `--shadow-sm` | `0 1px 0 rgba(28,25,23,.06), 0 1px 3px rgba(28,25,23,.06)` | `0 1px 0 rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.03)` |
| `--shadow-md` | `0 2px 0 rgba(28,25,23,.06), 0 8px 24px -8px rgba(28,25,23,.18)` | `0 2px 0 rgba(0,0,0,.4), 0 12px 32px -8px rgba(0,0,0,.6)` |
| `--shadow-accent` | `0 2px 0 #8E2A0F` | `0 2px 0 #B8461F` |

主要按鈕用 `--shadow-accent`（實色底邊）。按下時 `translateY(1px)`，陰影縮成 1px，模擬蓋印章的觸感。

### 2.7 動效

| Token | 值 | 用途 |
|---|---|---|
| `--dur-fast` | 120ms | hover、按下 |
| `--dur-base` | 200ms | focus、狀態色切換、dragover |
| `--dur-slow` | 320ms | toast 進出、卡片出現 |
| `--ease-out` | `cubic-bezier(.2,.8,.2,1)` | 進場、一般情況 |
| `--ease-in` | `cubic-bezier(.4,0,1,1)` | 退場 |

`@media (prefers-reduced-motion: reduce)`：所有 transition 和 animation 縮成 0.01ms。轉換中的旋轉圖示和流動條停止動畫，改成靜態顯示（流動條變成 40% 寬的實心段），狀態仍靠文字「轉換中…」表達。

---

## 3. 元件規格

### 3.1 Logo／字標

- **圖形**：28×28 的 SVG。左上是朱砂色實心方塊（原格式），右下是墨色方塊（新格式），兩個角落各有一個弧形箭頭，形成「交換」的循環。
- **字標**：`pixswap` 全小寫，Bricolage Grotesque 700，`letter-spacing: -0.03em`。`pix` 用 `--color-fg`，`swap` 用 `--color-accent`。
- 尺寸：頁首的圖形 28px、文字 20px，兩者間距 8px。圖形最小 20px。
- favicon 只用圖形，不放文字。

### 3.2 按鈕

| 尺寸 | 高度 | 左右內距 | 字級 |
|---|---|---|---|
| sm | 32px（用 `::after` 把觸控範圍擴大到 44px） | 12px | 14px |
| md（預設） | 40px | 16px | 15px / 600 |
| lg | 48px | 24px | 16px / 600 |

| 變體 | 預設 | hover | active | focus-visible | disabled |
|---|---|---|---|---|---|
| **primary** | accent 底、accent-fg 字、`--shadow-accent` | 底色改成 accent-hover | 底色改成 accent-active、`translateY(1px)`、陰影縮成 1px | 2px 焦點環（`outline: 2px solid var(--color-focus)`，offset 2px） | surface-2 底、fg-muted 字、無陰影、`cursor: not-allowed`。**不要用 opacity**，否則對比會低於 AA |
| **secondary** | surface 底、1px `border-strong` 框、fg 字、`--shadow-press` | 底色改成 surface-2 | `translateY(1px)` | 同上 | 框改成 border、字改成 fg-muted |
| **ghost** | 透明底、fg-muted 字 | surface-2 底、fg 字 | surface-2 底 | 同上 | 50% 透明 |

- 圖示按鈕是正方形，邊長等於按鈕高度，必須加 `aria-label`。
- 按鈕內的圖示 16px、描邊 2px，和文字間距 8px。
- 忙碌中（「打包中…」、「轉換中…」）：文字前加一個 14px 旋轉圖示，按鈕保持停用，寬度不變。

### 3.3 拖放區

拖放區**永遠接受 `image/*`**，轉檔中也一樣。新加入的檔案排到清單最後。所以拖放區**沒有** disabled 和 reject 狀態：格式不支援或無法解碼的檔案，是在清單裡標成「失敗」。

**結構**：外框是 `<div>`，只負責視覺，不可聚焦。裡面放一顆真正的 `<button>`「選擇圖片」（primary），加上說明文字。說明文字要用 `aria-describedby` 和按鈕關聯。整個視窗都接受 drop，拖放區是視覺上的放置目標。

**尺寸**：最小高度手機 176px、桌機 208px；圓角 `--radius-lg`；內距 32px / 24px。

**棋盤格**：用 `repeating-conic-gradient` 畫 16px 方格，light 用 `#EFE9DF` 配 bg，dark 用 `#1B1815` 配 bg。刻意畫得很淡，不能干擾文字。

| 狀態 | 框線 | 底 | 圖示 | 文案（ux.md §5.3） |
|---|---|---|---|---|
| idle | 2px dashed `border-strong` | 棋盤格 | fg-muted | 「拖曳圖片到這裡，或」［選擇圖片］／「也可以直接貼上（⌘V）· 支援 JPG、PNG、WebP 等常見格式，可多選」 |
| hover（滑鼠移入） | 2px dashed `accent` | 棋盤格 | accent | 不變。按鈕 focus 時用按鈕本身的焦點環 |
| dragover（檔案拖進視窗） | 2px **solid** `accent` | `accent-soft`，棋盤格隱藏 | accent，放大到 1.08 並上移 2px | 主文字換成「放開以加入圖片」 |
| compact（已有結果） | 1.5px dashed `border-strong` | surface-2 | — | 一列：［＋ 加入更多圖片］（secondary）「或拖曳、貼上」。高 56px，dragover 時一樣變成 accent 實線加 accent-soft |

**手機（<640px）**：不提拖曳和貼上，只顯示滿版的 lg primary 按鈕「選擇圖片」和「可一次選多張」。快捷鍵依平台顯示 ⌘V 或 Ctrl+V。

### 3.4 檔案卡片

**結構**：grid `[縮圖 56px] [資訊 minmax(0,1fr)] [動作 auto]`。寬度 <480px 時，動作區移到第二列，和資訊欄同寬。

- 外框：surface 底、1px border、`--radius-md`、內距 12px 16px、`--shadow-sm`。
- 狀態以左側 3px 色條表示（`box-shadow: inset 3px 0 0 <color>`），同時一定有狀態文字，圖示可選。
- 檔名 14px / 600，單行，超出用省略號。資訊欄必須設 `minmax(0, 1fr)` 加上 `min-width: 0`，否則在 375px 寬時長檔名會撐出水平捲動。
- 完成前顯示原始檔名，完成後顯示輸出檔名。
- meta 列：`[來源格式] → [目標格式]` badge 和大小。

| 狀態 | 色條 | 縮圖區 | 狀態文字 | 內容 | 動作 |
|---|---|---|---|---|---|
| **等待中** | 無 | surface-2 佔位加圖片圖示（fg-muted） | fg-muted「等待中」 | 原始大小 | ghost sm「移除」 |
| **轉換中** | accent | surface-2 佔位 | accent，12px 旋轉圖示加「轉換中…」 | 3px **不定量流動條**：accent 色、長 40% 的段落左右往返，1.2s 一輪，軌道是 surface-2。**不顯示百分比**，因為 Canvas 拿不到真實進度 | ghost sm「移除」 |
| **完成** | success | 輸出圖縮圖（`alt=""`） | success，✓ 加「完成」 | 大小比較元件。檔案變大時再加一行 warning 說明（§3.7） | secondary sm「下載」（`aria-label="下載 {檔名}"`） |
| **略過** | `border-strong`（中性） | 原圖縮圖，50% 透明 | fg-muted，↷ 加「略過」 | fg-muted 14px「已經是 JPG，不需要轉換」（格式依目標而定） | ghost sm「仍要重新輸出」 |
| **失敗** | error | surface-2 佔位加 ✕ 圖示（error） | error，✕ 加「失敗」 | 錯誤原因，14px、fg 色（不用 error 色，避免大片紅字）；卡片底色 error-soft。文案見 ux.md §5.5 | ghost sm「移除」（`aria-label="移除 {檔名}"`） |

- 清單順序：失敗項置頂（ux.md §4.2），其他依加入順序排列，新加入的排在最後。
- 卡片出現時淡入並從 4px 下方升起，時長 `--dur-slow`。多張依序出現，每張延遲 40ms，最多延遲到第 5 張。
- 狀態切換時，色條和狀態文字的顏色用 `--dur-base` 過渡，卡片高度不做動畫。

### 3.5 輸出格式選擇器（分段切換）

- 語意上是 `<fieldset><legend>輸出格式</legend>` 裡面的兩個原生 `<input type="radio">`，視覺做成分段切換。
- 軌道：surface-2 底，內距 3px，`--radius-md`。每個選項高 40px（手機 44px），最小寬 72px，手機上兩個選項平分滿版寬度。
- 選項文字：JetBrains Mono 700，14px。未選是 fg-muted，選中是 fg，底色 surface 加 `--shadow-sm`。
- 焦點環畫在選中的那一格（`input:focus-visible + span`）。
- 只在首頁出現。落地頁的輸出格式固定，改放反向連結「要反過來轉？JPG 轉 PNG →」。

### 3.6 品質滑桿

- 標籤列：左邊「品質」（14px / 600），右邊是等寬數字 `85`（18px / 700，accent 色）。
- 範圍 10–100，**預設 85**。
- 軌道：高 6px、`--radius-full`。已填段用 accent，未填段是 surface-2 加 1px `border-strong`。填色寬度用 CSS 變數 `--val` 控制，實作時把 `(value-10)/90*100` 寫進 inline style。
- 把手：20px 圓形，surface 底、2px accent 框、`--shadow-sm`。hover 放大到 1.1，active 放大到 1.15。focus-visible 時外加 4px accent-soft 光暈和焦點環。
- 軌道下方兩端標示「檔案較小」和「畫質較好」（12px，fg-muted）。
- 只在輸出 JPG 時出現，用 `--dur-base` 淡入。輸出 PNG 時改顯示 info 提示「PNG 是無損格式，由 JPG 轉過來的檔案通常會變大，畫質不會變好。」
- 桌機（≥640px）上，格式選擇器和滑桿並排在同一列（`auto 1fr`），提示放在下一列。

### 3.7 格式 badge

- JetBrains Mono 700、12px、`letter-spacing: .04em`、高 22px、左右內距 8px、`--radius-sm`。
- **JPG**：light 是底 `#FBE6DD`、字 `#8E2A0F`，dark 是底 `#33190F`、字 `#FF9168`。暖色代表照片。
- **PNG**：底用 6px 的小棋盤格，字 `--color-fg`，外加 1px border，暗示透明。
- **其他來源格式**（WEBP、GIF、BMP、HEIC、PSD…）：surface-2 底、fg-muted 字、1px border。來源格式不設限（image/*），只有輸出格式（JPG/PNG）有專屬配色。
- 轉換方向的寫法：`[WEBP] → [JPG]`。箭頭用 fg-muted，前後各留 6px。

### 3.8 大小比較

```
3.8 MB  →  612 KB   −84%
```

- 原始大小：等寬、14px、fg-muted，加刪除線（fg-muted 50%）。
- 箭頭：fg-muted。
- 新大小：等寬、16px / 700、fg。
- 差值 pill：等寬、12px / 700、高 22px、`--radius-full`。
  - 變小：success-soft 底、success 字，`−84%`（用真正的減號 U+2212）。
  - 變大（JPG 轉 PNG 常見）：warning-soft 底、warning 字，`+186%`。下方再加一行 12px fg-muted 說明「PNG 是無損格式，檔案變大是正常的，畫質不會因此變差。」**不用 error 色**，因為變大是正常結果，不是錯誤。
  - 差距小於 1%：surface-2 底、fg-muted 字，`±0%`。
- 正負號文字一定要保留，不能只靠顏色（ux.md §6.5）。
- 外層加 `aria-label="由 3.8 MB 縮小為 612 KB，減少 84%"`。

### 3.9 摘要列

- 放在清單上方，是 `role="status"` 的區塊。
- 第一行：狀態標題，18px / 700。依狀態顯示：
  - 轉換中：「轉換中 4 / 6」，前面加旋轉圖示
  - 全部完成：「已完成 18 張」
  - 部分失敗：「完成 17 張，1 張失敗」
- 第二行：大小比較元件的放大版（字級大一級），前面加 fg-muted「共」，例如「共 6.2 MB → 1.4 MB −77%」。
- 動作：［全部下載（ZIP）］primary 和［清除全部］ghost。轉換中「全部下載」停用，文字改成「轉換中…」；部分失敗時是「下載 17 張（ZIP）」；只有一張時是「下載 cover.jpg」。
- **手機（<640px）**：動作固定在畫面底部。動作列是 surface 底、上方 1px border、`--shadow-md`，內距 12px 16px，再加 `env(safe-area-inset-bottom)`。兩顆按鈕的比例是 2:1，清單底部要留同等高度的空白。

### 3.10 提示：inline 與 toast

**Inline 提示**：放在設定區或清單上方，不會自動消失。

- 結構：16px 圖示加 14px 文字，內距 10px 14px，`--radius-md`，左側 3px 色條。
- `info`：surface-2 底、fg 字、fg-muted 圖示。例：「JPG 不支援透明，透明區域會變成白色。」
- `warning`：warning-soft 底、warning 圖示。
- `error`：error-soft 底、error 圖示，`role="alert"`。例：「這些檔案不是圖片，沒有加入。」這則提示放在拖放區下方。

**Toast**：只用在沒有固定位置可以顯示的全域回饋，例如貼上時剪貼簿沒有圖片。逐檔的結果不用 toast。

- 位置：桌機在右下角，距邊 24px，寬 360px。手機在底部，左右各 16px；如果有底部動作列，就放在動作列上方。
- 外觀：fg 底、bg 字（反色，和頁面清楚區分），`--radius-md`、`--shadow-md`，內距 12px 16px，左側是狀態圖示。
- 進場由下方 8px 淡入，時長 `--dur-slow`；4 秒後淡出，時長 `--dur-base`。hover 或 focus 時暫停計時。
- 錯誤用 `role="alert"`，一般回饋用 `role="status"`。

### 3.11 隱私提示

- 放在 h1 正下方，一行：🔒 圖示（fg-muted）＋「圖片不會上傳，關掉分頁就消失。」＋「怎麼做到的？」連結樣式的 `<details><summary>`。
- 展開後的內容：surface-2 底、`--radius-md`、內距 12px 16px，14px fg-muted 文字（ux.md §5.6）。
- 頁尾一行：「pixswap 是開源專案 · 所有轉換在本機進行 · 原始碼」。原本首頁的「隱私／快速／免費」三點特色已移除，由這兩處取代。

### 3.12 其他

- **連結**：accent 色，底線 1px、`text-underline-offset: 3px`；hover 時底線加粗到 2px。
- **常用轉換**（首頁，轉換器下方）：14px / 600 fg-muted 小標，下方是 inline 連結「JPG 轉 PNG ›」「PNG 轉 JPG ›」。桌機排成一行，間距 24px；手機每行一個，行高 44px。

---

## 4. 版面

所有頁面都是單欄，最大寬 760px。

**首頁（就是轉換器）**，由上到下：

1. 頁首：logo、GitHub ↗、主題切換
2. h1「圖片格式轉換，全部在你的瀏覽器裡完成」（`--text-h1-home`）
3. 隱私提示一行
4. 設定面板：輸出格式和品質滑桿，加上 info 提示
5. 拖放區：空狀態是完整版，有結果後縮成 compact
6. 摘要列和檔案清單（有結果時才出現）
7. 常用轉換連結
8. 頁尾一行

**落地頁**：和首頁相同，但 h1 是「PNG 轉 JPG」（`--text-2xl`），下面接一行描述和反向連結，設定面板裡沒有格式選擇器。

**斷點**：`480px`（檔案卡的動作區回到同一列）、`640px`（間距加大、設定並排、底部動作列回到摘要列內、拖放區顯示拖曳和貼上說明）。

**觸控目標**：所有可點擊元素至少 44×44px。

**375px 檢查清單**：所有 grid 欄位用 `minmax(0, 1fr)`；flex 子項裡含文字的加 `min-width: 0`；檔名用 ellipsis；大小比較和 meta 列用 `flex-wrap`；按鈕列用 `flex-wrap` 或平分寬度；不要用 `overflow-x: hidden` 蓋掉問題。

---

## 5. 可直接貼進 `globals.css` 的 token 區塊

> 最後保留了舊變數名稱（`--fg`、`--bg`、`--muted`、`--accent`、`--error`）作為別名，現有樣式不用改就能先套上新顏色。
> `data-theme` 屬性優先；沒有設定時跟隨 `prefers-color-scheme`。
> `--font-bricolage`、`--font-jetbrains` 由 `_app.tsx` 注入（§2.2）。

```css
:root {
  color-scheme: light;

  /* Color — light */
  --color-bg: #F7F4EE;
  --color-surface: #FFFFFF;
  --color-surface-2: #F0EBE3;
  --color-border: #E2DBD0;
  --color-border-strong: #8C8378;
  --color-fg: #1C1917;
  --color-fg-muted: #6B635A;
  --color-accent: #C23B17;
  --color-accent-hover: #A83212;
  --color-accent-active: #8E2A0F;
  --color-accent-fg: #FFFFFF;
  --color-accent-soft: #FBE6DD;
  --color-success: #2F7A3E;
  --color-success-soft: #E4F1E6;
  --color-warning: #8A5A00;
  --color-warning-soft: #FBF0D9;
  --color-error: #A8233A;
  --color-error-soft: #F9E3E7;
  --color-focus: #C23B17;
  --color-checker: #EFE9DF;
  --color-badge-jpg-bg: #FBE6DD;
  --color-badge-jpg-fg: #8E2A0F;

  /* Typography（--font-bricolage / --font-jetbrains 由 next/font 注入） */
  --font-sans: system-ui, -apple-system, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif;
  --font-display: var(--font-bricolage, "Bricolage Grotesque"), var(--font-sans);
  --font-mono: var(--font-jetbrains, "JetBrains Mono"), ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.375rem;
  --text-2xl: 1.75rem;
  --text-h1-home: clamp(1.5rem, 3vw + 0.875rem, 2.25rem);
  --leading-tight: 1.3;
  --leading-normal: 1.7;

  /* Spacing (4px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --content-max: 760px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Elevation */
  --shadow-press: 0 1px 0 rgba(28, 25, 23, 0.12);
  --shadow-sm: 0 1px 0 rgba(28, 25, 23, 0.06), 0 1px 3px rgba(28, 25, 23, 0.06);
  --shadow-md: 0 2px 0 rgba(28, 25, 23, 0.06), 0 8px 24px -8px rgba(28, 25, 23, 0.18);
  --shadow-accent: 0 2px 0 #8E2A0F;

  /* Motion */
  --dur-fast: 120ms;
  --dur-base: 200ms;
  --dur-slow: 320ms;
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);

  /* Legacy aliases (existing globals.css) */
  --fg: var(--color-fg);
  --bg: var(--color-bg);
  --muted: var(--color-fg-muted);
  --accent: var(--color-accent);
  --error: var(--color-error);
}

/* Dark：跟隨系統，除非使用者手動選了 light */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --color-bg: #151311;
    --color-surface: #1E1B18;
    --color-surface-2: #27231F;
    --color-border: #35302A;
    --color-border-strong: #6E665D;
    --color-fg: #F2EDE6;
    --color-fg-muted: #A89F94;
    --color-accent: #FF7A4D;
    --color-accent-hover: #FF9168;
    --color-accent-active: #F2683A;
    --color-accent-fg: #1A0A04;
    --color-accent-soft: #33190F;
    --color-success: #5BC27A;
    --color-success-soft: #16271B;
    --color-warning: #E8B04A;
    --color-warning-soft: #2B2213;
    --color-error: #F2708A;
    --color-error-soft: #2E171C;
    --color-focus: #FF7A4D;
    --color-checker: #1B1815;
    --color-badge-jpg-bg: #33190F;
    --color-badge-jpg-fg: #FF9168;
    --shadow-press: 0 1px 0 rgba(0, 0, 0, 0.5);
    --shadow-sm: 0 1px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03);
    --shadow-md: 0 2px 0 rgba(0, 0, 0, 0.4), 0 12px 32px -8px rgba(0, 0, 0, 0.6);
    --shadow-accent: 0 2px 0 #B8461F;
  }
}

/* Dark：使用者手動指定（內容和上面相同） */
:root[data-theme="dark"] {
  color-scheme: dark;
  --color-bg: #151311;
  --color-surface: #1E1B18;
  --color-surface-2: #27231F;
  --color-border: #35302A;
  --color-border-strong: #6E665D;
  --color-fg: #F2EDE6;
  --color-fg-muted: #A89F94;
  --color-accent: #FF7A4D;
  --color-accent-hover: #FF9168;
  --color-accent-active: #F2683A;
  --color-accent-fg: #1A0A04;
  --color-accent-soft: #33190F;
  --color-success: #5BC27A;
  --color-success-soft: #16271B;
  --color-warning: #E8B04A;
  --color-warning-soft: #2B2213;
  --color-error: #F2708A;
  --color-error-soft: #2E171C;
  --color-focus: #FF7A4D;
  --color-checker: #1B1815;
  --color-badge-jpg-bg: #33190F;
  --color-badge-jpg-fg: #FF9168;
  --shadow-press: 0 1px 0 rgba(0, 0, 0, 0.5);
  --shadow-sm: 0 1px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03);
  --shadow-md: 0 2px 0 rgba(0, 0, 0, 0.4), 0 12px 32px -8px rgba(0, 0, 0, 0.6);
  --shadow-accent: 0 2px 0 #B8461F;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-fast: 0.01ms;
    --dur-base: 0.01ms;
    --dur-slow: 0.01ms;
  }
}
```

**實作備註**

- dark 區塊寫了兩次，是為了同時支援「跟隨系統」和「手動切換」，而且不需要先執行 JS。之後如果導入 preprocessor，可以再抽成共用區塊。
- 手動切換的偏好存在 `localStorage`，在 `_document.tsx` 的 `<head>` 用一小段 blocking script 先寫入 `data-theme`，避免頁面載入時閃一下錯的主題。
- 轉換中的旋轉圖示和流動條要另外寫 `@media (prefers-reduced-motion: reduce)` 規則停止 `animation`，只把時長 token 縮短不夠，因為無限循環的動畫還是會跑。
