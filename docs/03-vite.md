[← Static server](./02-static-server.md) · **Vite** · [Webpack →](./04-webpack.md)

---

# 02. Vite

> File config: [`vite.config.ts`](../vite.config.ts) · Lệnh: `npm run dev`, `npm run build`, `npm run preview`

## Thuật ngữ trong bài

| Keyword | Giải thích |
|---|---|
| **ESM** (ES Modules) | Chuẩn module chính thức của JavaScript: `import` / `export`. Trình duyệt hiện đại **chạy được trực tiếp** qua `<script type="module">` |
| **CommonJS** | Chuẩn module cũ của Node: `require()` / `module.exports`. Trình duyệt **không** hiểu |
| **Bare import** | `import x from 'react'` — tên trần, không có `./` hay `/`. Trình duyệt không biết tìm ở đâu, phải có tool viết lại thành đường dẫn thật |
| **Bundle** | Gộp nhiều file nguồn thành ít file đầu ra |
| **Bundler** | Công cụ làm việc đó (Rollup, Webpack, esbuild) |
| **Transform / Transpile** | Biến đổi code từ dạng này sang dạng khác cùng cấp (TS → JS, JSX → JS) |
| **esbuild** | Bundler/transpiler viết bằng **Go**, nhanh hơn công cụ JS ~20–100×. Vite dùng nó ở dev |
| **Rollup** | Bundler viết bằng JS, mạnh về tree-shaking. Vite dùng nó ở build |
| **Tree-shaking** | Loại bỏ code được import nhưng **không bao giờ dùng tới** khỏi bundle |
| **Minify** | Nén code: xoá khoảng trắng, đổi tên biến thành 1 ký tự, bỏ comment |
| **Code splitting** | Chia bundle thành nhiều mảnh, tải mảnh nào khi cần mảnh đó |
| **Content hash** | Chuỗi ký tự sinh từ **nội dung** file, gắn vào tên file: `index-a3f91b2c.js`. Nội dung đổi → hash đổi |
| **HMR** (Hot Module Replacement) | Thay module vừa sửa trong app **đang chạy**, không reload trang, **giữ state** |
| **Fast Refresh** | Bản HMR chuyên cho React — giữ được cả `useState` của component |
| **On-demand** | Chỉ xử lý khi được yêu cầu, không làm trước |
| **Alias** | Bí danh đường dẫn: `@` ⇢ `./src` |
| **Source map** | File `.map` ánh xạ code đã build ngược về code gốc, để debug thấy đúng dòng TS |
| **`base`** | Tiền tố URL cho mọi asset trong `index.html` sau khi build |

---

## Vite là gì

Vite là **build tool + dev server**. Trong project này nó đóng **hai vai hoàn toàn khác nhau**, tuỳ lệnh bạn gõ:

| Lệnh | Vai | Engine bên dưới |
|---|---|---|
| `npm run dev` | Dev server | **esbuild**, transform on-demand |
| `npm run build` | Bundler | **Rollup**, bundle toàn bộ |
| `npm run preview` | Static server | phục vụ `dist/` để test |

Đây là điểm nhiều người bỏ qua: **dev và build dùng engine khác nhau**.

---

## Vì sao Vite nhanh: ở dev, nó KHÔNG bundle

### Cách cũ (Webpack)

```
Bạn gõ `npm start`
   │
   ├─ Đọc entry point
   ├─ Đi theo mọi import → dựng dependency graph toàn bộ app
   ├─ Transform tất cả file
   ├─ Bundle tất cả lại
   └─ ✅ Giờ mới mở được trang        ← 10–60 giây, tăng theo kích thước app
```

### Cách của Vite

```
Bạn gõ `npm run dev`
   │
   └─ ✅ Server sẵn sàng ngay          ← ~300ms, gần như không đổi dù app lớn
      │
      Trình duyệt: GET /index.html
                 → thấy <script type="module" src="/src/main.tsx">
      Trình duyệt: GET /src/main.tsx
                 → Vite transform ĐÚNG file đó (esbuild) → trả JS
                 → trong đó có `import App from './App.tsx'`
      Trình duyệt: GET /src/App.tsx
                 → Vite transform đúng file đó
      ... cứ thế, chỉ file nào trình duyệt hỏi tới
```

Vite **giao việc dựng graph cho chính trình duyệt**, thông qua ESM native. Nó chỉ đóng vai "người phiên dịch tại chỗ".

### Hai xử lý Vite vẫn phải làm ở dev

**1. Rewrite bare import** — trình duyệt không hiểu `import React from 'react'`:
```js
// bạn viết
import { useState } from 'react';
// Vite trả về cho trình duyệt
import { useState } from '/node_modules/.vite/deps/react.js';
```

**2. Pre-bundle dependencies** — `node_modules` có thể chứa CommonJS, và một package như `lodash` có hàng trăm file con. Vite dùng esbuild gộp sẵn chúng vào `node_modules/.vite/deps` **một lần** lúc khởi động đầu tiên. Đó là lý do lần chạy `npm run dev` đầu tiên sau khi `npm install` hơi lâu, các lần sau thì tức thì.

---

## Config của project

```ts
// vite.config.ts
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [
    react({
      babel: { plugins: [['babel-plugin-react-compiler']] },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
});
```

### `defineConfig`

Chỉ là hàm bọc để **TypeScript/editor gợi ý được** các option. Về runtime nó trả lại y nguyên object bạn truyền vào. Không có tác dụng gì khác.

### `base` — tiền tố đường dẫn asset

Quyết định `src=` trong `index.html` sau khi build trông thế nào:

| `base` | HTML sinh ra | Dùng khi |
|---|---|---|
| `'/'` | `<script src="/assets/index-a3f9.js">` | Deploy ở **root domain** — Vercel, Docker/Nginx |
| `'/portfolio/'` | `<script src="/portfolio/assets/index-a3f9.js">` | Deploy ở **thư mục con** — GitHub Pages `user.github.io/portfolio/` |
| `'./'` | `<script src="./assets/index-a3f9.js">` | Đường dẫn tương đối — mở file trực tiếp, hoặc không biết trước sẽ đặt ở đâu |

Project đọc từ biến môi trường:
```js
base: process.env.VITE_BASE_URL || '/'
```
→ đổi được lúc build mà không sửa code:
```bash
VITE_BASE_URL=/portfolio/ npm run build
```

> **Triệu chứng khi `base` sai:** deploy xong ra **trang trắng**, mở DevTools → Console thấy 404 cho các file `.js`/`.css`. Gần như luôn là do `base` không khớp nơi deploy.

### `plugins: [react(...)]`

`@vitejs/plugin-react` mang lại 3 thứ:

| | Tác dụng |
|---|---|
| **JSX transform** | Biến `<div />` thành `jsx("div")`. Dùng `jsx: "react-jsx"` từ `tsconfig.json` → **không cần** `import React` ở đầu mỗi file |
| **Fast Refresh** | HMR cho React — sửa component, state được giữ nguyên |
| **Babel hook** | Cho phép cắm plugin Babel vào pipeline (project dùng để chạy React Compiler) |

Phần `babel: { plugins: [...] }` được giải thích riêng ở [Babel](./05-babel.md).

### `resolve.alias` — và cái bẫy phải khai 2 nơi

```js
alias: { '@': path.resolve(import.meta.dirname, './src') }
```

Cho phép viết:
```ts
import Button from '@/components/Button';        // ✅
// thay vì
import Button from '../../../components/Button'; // ❌ dễ sai khi di chuyển file
```

⚠️ **Alias phải khai báo ở CẢ HAI nơi**, vì hai công cụ khác nhau đọc hai file khác nhau:

| File | Ai đọc | Nếu thiếu thì sao |
|---|---|---|
| `vite.config.ts` → `resolve.alias` | **Vite** lúc dev/build | Build **fail**: `Failed to resolve import "@/..."` |
| `tsconfig.json` → `paths` | **TypeScript + editor** | Code **chạy được** nhưng VSCode báo đỏ, không go-to-definition, `npm run typecheck` fail |

Project đã có đủ:
```jsonc
// tsconfig.json
"baseUrl": ".",
"paths": { "@/*": ["src/*"] }
```

`baseUrl` là mốc để `paths` tính tương đối. `"@/*": ["src/*"]` đọc là: *"cái gì khớp `@/...` thì tìm ở `src/...`"*.

---

## `npm run build` — chuyện gì xảy ra

```json
"build": "tsc -b && vite build"
```

**Bước 1 — `tsc -b`** (`--build`): typecheck toàn bộ. Sai kiểu → **dừng ngay**, không build. Đây là cổng chặn: bug kiểu không lọt vào `dist/`.

**Bước 2 — `vite build`**: Rollup chạy 5 việc:

| Việc | Kết quả |
|---|---|
| **Bundle** | Gom hàng trăm module → vài file |
| **Tree-shake** | Import mà không dùng → bị cắt khỏi bundle |
| **Minify** | Xoá khoảng trắng, rút gọn tên biến (esbuild) |
| **Code split** | Tách `vendor` (react, chart.js…) khỏi code của bạn — vendor ít đổi nên cache lâu hơn |
| **Content hash** | `index-a3f91b2c.js` — **nền tảng cho toàn bộ chiến lược cache của Nginx** |

Kết quả:
```
dist/
├── index.html
└── assets/
    ├── index-a3f91b2c.js     ← code app
    ├── index-7d2e4f01.css
    └── vendor-9b1c3a5e.js    ← react, chart.js, framer-motion...
```

### Content hash — tại sao quan trọng

`a3f91b2c` là hash của **nội dung file**. Sửa 1 ký tự trong code:

```
trước:  assets/index-a3f91b2c.js
sau:    assets/index-5e8d2f14.js     ← TÊN FILE ĐỔI
```

Trình duyệt chưa từng thấy URL mới → bắt buộc tải mới. Điều này cho phép Nginx cache file cũ **1 năm** mà vẫn deploy được. Xem chi tiết ở [Nginx & Cache](./07-nginx.md).

---

## Biến môi trường trong Vite

Vite chỉ expose biến có tiền tố **`VITE_`** ra client — để bạn không vô tình lộ secret vào bundle.

```bash
# .env
VITE_API_URL=https://api.example.com   # ✅ dùng được trong code client
DATABASE_PASSWORD=hunter2              # ❌ KHÔNG lọt vào bundle (đúng như mong muốn)
```

```ts
// trong src/
const api = import.meta.env.VITE_API_URL;
```

| | |
|---|---|
| `import.meta.env.VITE_*` | Đọc **trong `src/`** (code chạy ở trình duyệt) |
| `process.env.*` | Đọc **trong `vite.config.ts`** (code chạy ở Node lúc build) |

Đó là lý do `vite.config.ts` dùng `process.env.VITE_BASE_URL`, không phải `import.meta.env`.

⚠️ Mọi biến `VITE_*` đều **nhìn thấy được** trong bundle của trình duyệt. Đừng bao giờ đặt API key bí mật vào đó.

---

## Lệnh & cheatsheet

```bash
npm run dev                      # dev server, port 5173
npm run dev -- --host 0.0.0.0    # cho máy khác trong LAN / trong Docker truy cập
npm run dev -- --port 3000       # đổi port

npm run build                    # typecheck + bundle → dist/
npm run preview                  # phục vụ dist/ để kiểm tra trước khi deploy
```

`--host 0.0.0.0`: mặc định Vite chỉ nghe `localhost`. Trong Docker, `localhost` là **của container**, bên ngoài không vào được. Đó là lý do `docker-compose.yml` phải có cờ này.

---

[← Static server](./02-static-server.md) · **Vite** · [Webpack →](./04-webpack.md)
