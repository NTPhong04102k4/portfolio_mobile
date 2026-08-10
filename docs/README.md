# Toolchain Docs

Tài liệu giải thích **từng công cụ trong project này** — nó là gì, giải quyết vấn đề gì, và nó nằm ở đâu trong repo.

Mọi ví dụ đều lấy từ config thật của project, không phải ví dụ chung chung.

---

## Đọc theo thứ tự

| # | File | Nội dung | Đọc khi |
|---|---|---|---|
| 00 | [Tổng quan](./01-tong-quan.md) | Bức tranh toàn cảnh: từ code tới người dùng | **Bắt đầu ở đây** |
| 01 | [Static server](./02-static-server.md) | `serve`, `live-server`, và SPA fallback | Muốn hiểu "phục vụ file tĩnh" nghĩa là gì |
| 02 | [Vite](./03-vite.md) | Dev server + bundler của project | Sửa `vite.config.ts` |
| 03 | [Webpack](./04-webpack.md) | Bundler thế hệ trước, so sánh với Vite | Tò mò / phải làm project cũ |
| 04 | [Babel](./05-babel.md) | Compiler JS + React Compiler | Thấy `babel` trong `vite.config.ts` |
| 05 | [ESLint](./06-eslint.md) | Lint rules, giải thích từng rule | `npm run lint` báo đỏ |
| 06 | [Nginx & Cache](./07-nginx.md) | Web server production, cơ chế cache | Deploy / user không thấy bản mới |
| 07 | [Docker](./08-docker.md) | Đóng gói môi trường, multi-stage build | Chạy `npm run docker:*` |
| 08 | [Thuật ngữ](./09-thuat-ngu.md) | **Từ điển tra cứu mọi keyword** | Gặp từ lạ ở bất kỳ file nào |
| 09 | [Lưu ý config](./10-luu-y-config.md) | Điểm cần biết trong config hiện tại | Trước khi sửa hạ tầng |

---

## Tra nhanh

| Công cụ | Một câu | File config | Lệnh |
|---|---|---|---|
| **Vite** | Dev server (HMR) + bundler | `vite.config.ts` | `npm run dev` / `build` |
| **Babel** | Chạy React Compiler lúc build | inline trong `vite.config.ts` | (tự động) |
| **TypeScript** | Kiểm tra kiểu dữ liệu | `tsconfig.json` | `npm run typecheck` |
| **ESLint** | Kiểm tra style & lỗi logic | `eslint.config.js` | `npm run lint` |
| **Nginx** | Web server production | `nginx.conf` | (trong container) |
| **Docker** | Đóng gói toàn bộ môi trường | `Dockerfile`, `docker-compose.yml` | `npm run docker:up` |
| `serve` | Static server tạm | — | `npx serve dist -s` |
| `live-server` | Static server + auto reload | — | (không dùng ở đây) |

---

## Vòng đời một lần deploy

```
1. npm run dev          Vite dev server + HMR — code hằng ngày
2. npm run lint:fix     ESLint tự sắp import, sửa style
3. npm run ci           lint → typecheck → build   (cổng chất lượng)
4. npm run build        Rollup bundle → dist/ (tên file có hash)
5. npm run preview      kiểm tra bản build ở local
6. npm run docker:up    Docker build image → Nginx phục vụ dist/ tại :3000
```

---

## Toàn bộ npm scripts

```jsonc
"dev":           "vite",                    // dev server, HMR, port 5173
"build":         "tsc -b && vite build",    // typecheck rồi bundle ra dist/
"lint":          "eslint .",                // chỉ báo lỗi
"lint:fix":      "eslint . --fix",          // tự sửa cái nào sửa được
"typecheck":     "tsc --noEmit",            // chỉ check kiểu, không xuất file
"ci":            "lint && typecheck && build",
"preview":       "vite preview",            // phục vụ dist/ ở local
"deploy":        "npx vercel --prod",
"docker:build":  "docker build -t ...",
"docker:run":    "docker run -d -p 3000:80 ...",
"docker:stop":   "docker stop && docker rm",
"docker:up":     "docker compose up -d portfolio",      // prod (Nginx)
"docker:up:dev": "docker compose up portfolio-dev",     // dev (Vite HMR)
"docker:down":   "docker compose down",
"clean":         "npx rimraf dist node_modules"
```
