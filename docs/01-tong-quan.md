[← Mục lục](./README.md) · **Tổng quan** · [Static server →](./02-static-server.md)

---

# 00. Tổng quan — Từ code tới người dùng

## Vấn đề gốc

Trình duyệt **chỉ hiểu 3 thứ**: HTML, CSS, JavaScript.

Nhưng bạn đang viết:

| Bạn viết | Trình duyệt hiểu? | Ai xử lý |
|---|---|---|
| `.tsx` (TypeScript + JSX) | ❌ | Vite (esbuild) + Babel |
| `.scss` | ❌ | Vite (sass-embedded) |
| `import x from '@/utils'` | ❌ (không biết `@` là gì) | Vite (alias resolution) |
| `import x from 'react'` | ❌ (không biết tìm `node_modules` ở đâu) | Vite (bare import rewriting) |

Toolchain tồn tại để lấp khoảng cách đó.

---

## Sơ đồ toàn cảnh

```
  ①  BẠN VIẾT                  ②  KIỂM TRA                ③  BIẾN ĐỔI & ĐÓNG GÓI
┌────────────────────┐      ┌────────────────────┐    ┌──────────────────────────┐
│ src/**/*.tsx       │      │ TypeScript (tsc)   │    │  Vite                    │
│ src/**/*.scss      │ ───► │   → sai kiểu?      │──► │   ├─ esbuild  (dev, TS→JS)│
│ import '@/...'     │      │ ESLint             │    │   ├─ Babel    (React      │
│                    │      │   → sai style?     │    │   │            Compiler)  │
└────────────────────┘      └────────────────────┘    │   └─ Rollup   (build)     │
                                                       └────────────┬─────────────┘
                                                                    │
                              ┌─────────────────────────────────────┴───────┐
                              │                                             │
                    ④a  DEV (máy bạn)                          ④b  PROD (deploy)
                              │                                             │
                   ┌──────────▼──────────┐                    ┌─────────────▼─────────────┐
                   │ vite dev server     │                    │  dist/                    │
                   │ • không bundle      │                    │   ├─ index.html           │
                   │ • HMR giữ state     │                    │   └─ assets/              │
                   │ • localhost:5173    │                    │       ├─ index-a3f9.js    │
                   └─────────────────────┘                    │       └─ index-a3f9.css   │
                                                              └─────────────┬─────────────┘
                                                                            │
                                              ⑤  PHẢI CÓ AI ĐÓ "PHỤC VỤ" dist/
                                                                            │
                                    ┌───────────────────────────────────────┴──────────┐
                                    │  vite preview  │  npx serve  │  Nginx (Docker) ✅│
                                    └──────────────────────────────────────────────────┘
```

---

## Ý quan trọng nhất

> **`dist/` chỉ là một đống file nằm trên đĩa. Nó không tự chạy được.**

Phải có một **web server** đọc file đó và trả về qua giao thức HTTP. Đó là toàn bộ lý do tồn tại của `serve`, `live-server`, `vite preview`, và Nginx.

Chúng khác nhau ở **mức độ nghiêm túc**:

```
npx serve dist          → test nhanh, 1 lệnh, không config
vite preview            → như trên, có sẵn trong project
Nginx trong Docker      → production: gzip, cache, security header, healthcheck
```

---

## Hai chế độ, hai thế giới

Đây là điểm hay gây nhầm nhất. Cùng một codebase, nhưng `dev` và `build` chạy theo **hai cơ chế hoàn toàn khác nhau**:

| | `npm run dev` | `npm run build` |
|---|---|---|
| Có bundle không | **Không** | **Có** |
| Ai xử lý file | esbuild, on-demand | Rollup, toàn bộ |
| Trình duyệt nhận gì | Hàng trăm file `.js` riêng lẻ (qua ESM) | 2–5 file đã gộp & nén |
| Tên file | `/src/App.tsx` | `/assets/index-a3f91b2c.js` |
| Tốc độ khởi động | Tức thì | 10–60 giây |
| Sửa code | HMR, giữ state | Phải build lại |
| Dùng khi | Phát triển | Deploy |

**Hệ quả thực tế:** có những bug **chỉ xuất hiện ở bản build** (tree-shaking cắt nhầm, biến môi trường thiếu, đường dẫn asset sai vì `base`). Vì thế bước `npm run preview` trước khi deploy là có ý nghĩa, không phải thừa.

---

## Vai trò từng công cụ trong một câu

| Công cụ | Trả lời câu hỏi |
|---|---|
| **TypeScript** | "Code này có đúng kiểu dữ liệu không?" |
| **ESLint** | "Code này có viết đúng chuẩn team không?" |
| **Babel** | "Biến đổi code này theo plugin tôi chỉ định" |
| **Vite (dev)** | "Cho tôi xem kết quả **ngay lập tức** khi tôi sửa" |
| **Vite (build)** | "Gom tất cả lại thành file nhỏ nhất có thể" |
| **Nginx** | "Trả file này cho hàng nghìn user, nhanh và an toàn" |
| **Docker** | "Đảm bảo nó chạy giống hệt nhau ở mọi máy" |

---

## Thứ tự học đề xuất

Nếu bạn mới, đọc theo thứ tự này sẽ ít bị hụt khái niệm nhất:

```
02-static-server   → hiểu "phục vụ file" và SPA fallback (nền tảng cho Nginx)
03-vite            → công cụ bạn dùng hằng ngày
06-eslint          → cái báo đỏ mỗi ngày
07-nginx           → tái dùng lại khái niệm SPA fallback từ file 02
08-docker          → đóng gói tất cả những thứ trên
04-webpack, 05-babel → đọc sau, khi cần hiểu sâu
```

---

[← Mục lục](./README.md) · **Tổng quan** · [Static server →](./02-static-server.md)
