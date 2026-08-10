[← Docker](./08-docker.md) · **Thuật ngữ** · [Lưu ý config →](./10-luu-y-config.md)

---

# 08. Từ điển thuật ngữ

Tra cứu nhanh mọi keyword xuất hiện trong bộ tài liệu này. Sắp theo chủ đề.

---

## Build & Module

| Keyword | Giải thích | Chi tiết |
|---|---|---|
| **Module** | Một file code có thể `import`/`export` | |
| **ESM** (ES Modules) | Chuẩn module chính thức của JS: `import`/`export`. Trình duyệt hiện đại chạy trực tiếp được | [Vite](./03-vite.md) |
| **CommonJS** (CJS) | Chuẩn module cũ của Node: `require()`/`module.exports`. Trình duyệt không hiểu | |
| **Bare import** | `import x from 'react'` — tên trần, không `./` hay `/`. Trình duyệt không biết tìm ở đâu | [Vite](./03-vite.md) |
| **Bundle** | Kết quả gộp nhiều file nguồn thành ít file đầu ra | |
| **Bundler** | Công cụ làm việc đó: Rollup, Webpack, esbuild | [Webpack](./04-webpack.md) |
| **Entry point** | File bắt đầu, nơi bundler khởi hành đi tìm mọi thứ khác | [Webpack](./04-webpack.md) |
| **Dependency graph** | Đồ thị "file nào import file nào" | [Webpack](./04-webpack.md) |
| **Chunk** | Một mảnh bundle. Code splitting sinh ra nhiều chunk | |
| **Code splitting** | Chia bundle thành nhiều mảnh, tải mảnh nào khi cần mảnh đó | [Vite](./03-vite.md) |
| **Tree-shaking** | Loại bỏ code được import nhưng **không bao giờ dùng tới** | [Vite](./03-vite.md) |
| **Minify** | Nén code: xoá khoảng trắng, rút tên biến thành 1 ký tự, bỏ comment | |
| **Transpile** | Compile giữa hai ngôn ngữ **cùng cấp** (TS→JS, JSX→JS, ES2020→ES5) | [Babel](./05-babel.md) |
| **Source map** | File `.map` ánh xạ code đã build ngược về code gốc, để debug thấy đúng dòng | |
| **Content hash** | Chuỗi sinh từ **nội dung** file, gắn vào tên: `index-a3f91b2c.js` | [Vite](./03-vite.md) |
| **Polyfill** | Code bổ sung **API còn thiếu** lúc runtime. Khác transpile — transpile sửa **cú pháp**, polyfill thêm **hàm** | [Babel](./05-babel.md) |
| **AST** | Cây cấu trúc biểu diễn code. Mọi plugin Babel thao tác trên AST | [Babel](./05-babel.md) |
| **esbuild** | Bundler/transpiler viết bằng Go, nhanh hơn tool JS ~20–100× | [Vite](./03-vite.md) |
| **Rollup** | Bundler viết bằng JS, mạnh tree-shaking. Vite dùng ở build | [Vite](./03-vite.md) |
| **On-demand** | Chỉ xử lý khi được yêu cầu, không làm trước | [Vite](./03-vite.md) |
| **Loader** (Webpack) | "Phiên dịch" cho một loại file. Chạy **phải → trái** | [Webpack](./04-webpack.md) |
| **Plugin** | Can thiệp vào vòng đời build (khác loader — loader chỉ biến đổi từng file) | [Webpack](./04-webpack.md) |

---

## Dev server

| Keyword | Giải thích | Chi tiết |
|---|---|---|
| **Static file** | File nằm sẵn trên đĩa, trả nguyên xi. Ngược lại là **dynamic** (sinh theo request) | [Static server](./02-static-server.md) |
| **Static file server** | Chương trình mở port HTTP, tìm file theo URL, trả về | [Static server](./02-static-server.md) |
| **Port** | Số hiệu cổng để phân biệt các chương trình cùng nghe mạng | |
| **MIME type** | Chuỗi mô tả loại nội dung, gửi qua header `Content-Type` | |
| **SPA** | App chỉ tải **một** file HTML; mọi thay đổi trang sau đó do JS vẽ lại | [Static server](./02-static-server.md) |
| **Client-side routing** | Đổi trang do JS xử lý, URL đổi nhưng **không gửi request** | [Static server](./02-static-server.md) |
| **SPA fallback** | URL không khớp file nào → trả `index.html`. Bắt buộc, nếu không F5 sẽ 404 | [Static server](./02-static-server.md) |
| **HMR** | Thay module vừa sửa trong app **đang chạy**, **giữ state** | [Vite](./03-vite.md) |
| **Fast Refresh** | Bản HMR chuyên cho React — giữ được cả `useState` | [Vite](./03-vite.md) |
| **WebSocket** | Kênh 2 chiều giữ mở liên tục giữa trình duyệt và server | [Static server](./02-static-server.md) |
| **Inject** | Chèn nội dung vào file trước khi gửi | [Static server](./02-static-server.md) |
| **Alias** | Bí danh đường dẫn: `@` ⇢ `./src`. Phải khai ở **cả** `vite.config.ts` lẫn `tsconfig.json` | [Vite](./03-vite.md) |
| **`base`** | Tiền tố URL cho mọi asset trong `index.html` sau build. Sai → trang trắng | [Vite](./03-vite.md) |

---

## Lint & Type

| Keyword | Giải thích | Chi tiết |
|---|---|---|
| **Linter** | Đọc code **mà không chạy code** để tìm lỗi và vi phạm quy ước | [ESLint](./06-eslint.md) |
| **Static analysis** | Phân tích tĩnh — suy luận từ cấu trúc code, không thực thi | |
| **Rule** | Một luật cụ thể, ví dụ "cấm dùng `var`" | [ESLint](./06-eslint.md) |
| **Severity** | `'off'` / `'warn'` / `'error'`. Chỉ `'error'` mới làm CI fail | [ESLint](./06-eslint.md) |
| **Flat config** | Định dạng config mới của ESLint 9 (`eslint.config.js`, export mảng) | [ESLint](./06-eslint.md) |
| **Preset** | Bộ rule đóng gói sẵn, dùng qua `extends` | [ESLint](./06-eslint.md) |
| **Parser** | Bộ phân tích cú pháp. ESLint gốc không hiểu TS → cần `typescript-eslint` | [ESLint](./06-eslint.md) |
| **Autofix** | Rule tự sửa được, chạy bằng `--fix` | [ESLint](./06-eslint.md) |
| **Globals** | Danh sách biến toàn cục có sẵn (`window`, `process`) để không báo `no-undef` | [ESLint](./06-eslint.md) |
| **Glob pattern** | Mẫu khớp đường dẫn: `**/*.tsx` | [ESLint](./06-eslint.md) |
| **Rules of Hooks** | Không gọi hook trong `if`/loop. React nhận diện hook **theo thứ tự gọi** | [ESLint](./06-eslint.md) |
| **`verbatimModuleSyntax`** | Option tsconfig: TS **giữ nguyên** câu lệnh import, không tự xoá type import | [ESLint](./06-eslint.md) |
| **Memoization** | Ghi nhớ kết quả để lần sau khỏi tính lại | [Babel](./05-babel.md) |
| **Referential equality** | Hai biến có cùng **tham chiếu** không. React dựa vào đây để biết prop có đổi | [Babel](./05-babel.md) |
| **React Compiler** | Compiler React 19, **tự động** chèn memo hoá thay `useMemo`/`useCallback` | [Babel](./05-babel.md) |

---

## HTTP & Cache

| Keyword | Giải thích | Chi tiết |
|---|---|---|
| **HTTP header** | Cặp `Tên: giá trị` gửi kèm request/response | [Nginx](./07-nginx.md) |
| **Gzip** | Thuật toán nén. Server nén trước khi gửi, trình duyệt tự giải nén. Text nén được 70–80% | [Nginx](./07-nginx.md) |
| **`Cache-Control`** | Header quyết định **ai được cache, bao lâu, có phải hỏi lại không** | [Nginx](./07-nginx.md) |
| **`max-age`** | Số **giây** được coi là còn "tươi". `31536000` = 1 năm | [Nginx](./07-nginx.md) |
| **`public`** | CDN/proxy trung gian cũng được cache | [Nginx](./07-nginx.md) |
| **`immutable`** | "Không bao giờ đổi" — bỏ qua cả revalidation, kể cả khi F5 | [Nginx](./07-nginx.md) |
| **`no-cache`** | Được lưu, **nhưng phải hỏi server** trước mỗi lần dùng | [Nginx](./07-nginx.md) |
| **`no-store`** | **Cấm lưu** hoàn toàn | [Nginx](./07-nginx.md) |
| **Revalidate** | Hỏi server "file này còn mới không?" | [Nginx](./07-nginx.md) |
| **ETag** | Mã định danh phiên bản file, dùng để revalidate | [Nginx](./07-nginx.md) |
| **`304 Not Modified`** | Server trả "chưa đổi, dùng cache đi" — response **rỗng**, rất nhẹ | [Nginx](./07-nginx.md) |
| **Stale** | Cache đã cũ, không còn khớp bản trên server | [Nginx](./07-nginx.md) |
| **Cache busting** | Kỹ thuật buộc tải lại — ở đây là **đổi tên file** qua content hash | [Nginx](./07-nginx.md) |
| **Heuristic caching** | Trình duyệt **tự đoán** thời gian cache khi server không gửi `Cache-Control` | [Nginx](./07-nginx.md) |

---

## Nginx

| Keyword | Giải thích | Chi tiết |
|---|---|---|
| **Web server** | Chương trình nhận HTTP request, trả HTTP response | [Nginx](./07-nginx.md) |
| **Reverse proxy** | Server đứng trước, chuyển tiếp request tới backend. Project **không dùng** vai trò này | [Nginx](./07-nginx.md) |
| **`server` block** | Khối cấu hình cho một virtual host | [Nginx](./07-nginx.md) |
| **`location` block** | Khối quy tắc cho một nhóm URL. `=` chính xác, `~` regex, `~*` regex không phân biệt hoa thường | [Nginx](./07-nginx.md) |
| **`root`** | Thư mục gốc chứa file để phục vụ | [Nginx](./07-nginx.md) |
| **`try_files`** | Thử lần lượt các đường dẫn, dùng cái đầu tiên tồn tại | [Nginx](./07-nginx.md) |
| **`$uri`** | Biến chứa đường dẫn của request hiện tại | [Nginx](./07-nginx.md) |
| **`always`** | Hậu tố `add_header`: gửi header kể cả với response lỗi 4xx/5xx | [Nginx](./07-nginx.md) |
| **Clickjacking** | Nhúng site bạn vào `<iframe>` trong suốt để lừa user bấm nhầm | [Nginx](./07-nginx.md) |
| **MIME sniffing** | Trình duyệt tự đoán loại file khi header không rõ — có thể bị lợi dụng | [Nginx](./07-nginx.md) |

---

## Docker

| Keyword | Giải thích | Chi tiết |
|---|---|---|
| **Image** | Bản thiết kế **chỉ đọc**. Giống file `.iso` | [Docker](./08-docker.md) |
| **Container** | Một **tiến trình đang chạy** từ image. Giống object từ class | [Docker](./08-docker.md) |
| **Dockerfile** | Công thức build image | [Docker](./08-docker.md) |
| **Layer** | Mỗi lệnh Dockerfile tạo một tầng, được **cache** | [Docker](./08-docker.md) |
| **Build context** | Toàn bộ thư mục gửi tới Docker daemon lúc build | [Docker](./08-docker.md) |
| **Base image** | Image làm nền, khai bằng `FROM` | [Docker](./08-docker.md) |
| **Multi-stage build** | Nhiều `FROM` trong 1 file; image cuối chỉ giữ stage cuối. 1.2 GB → 25 MB | [Docker](./08-docker.md) |
| **Alpine** | Bản Linux siêu nhẹ (~5 MB) | [Docker](./08-docker.md) |
| **Registry** | Kho chứa image (Docker Hub, GHCR) | [Docker](./08-docker.md) |
| **Tag** | Nhãn phiên bản: `myapp:latest` | [Docker](./08-docker.md) |
| **Port mapping** | `"3000:80"` = port **host** : port **container** | [Docker](./08-docker.md) |
| **Volume** | Cơ chế gắn dữ liệu vào container | [Docker](./08-docker.md) |
| **Bind mount** | Gắn **thư mục thật trên host** vào container (`.:/app`) | [Docker](./08-docker.md) |
| **Anonymous volume** | Volume Docker tự quản, dùng để **che** một phần bind mount (`/app/node_modules`) | [Docker](./08-docker.md) |
| **Orchestrator** | Công cụ quản lý nhiều container: Compose, Kubernetes, ECS | [Docker](./08-docker.md) |
| **Healthcheck** | Lệnh container tự chạy định kỳ để báo mình còn khoẻ | [Docker](./08-docker.md) |
| **Daemon** | Tiến trình Docker chạy nền | [Docker](./08-docker.md) |
| **`0.0.0.0`** | "Nghe trên mọi network interface" — bắt buộc cho dev server trong container | [Docker](./08-docker.md) |

---

## Ba cặp khái niệm hay bị nhầm

### `no-cache` vs `no-store`
| | Được lưu? | Hành vi |
|---|---|---|
| `no-cache` | ✅ | Lưu, nhưng **luôn hỏi server** trước khi dùng → thường nhận `304` (rỗng, rất nhẹ) |
| `no-store` | ❌ | Cấm lưu, luôn tải lại đầy đủ |

### Transpile vs Polyfill
| | Sửa gì | Ví dụ |
|---|---|---|
| Transpile | **Cú pháp** | `x ?? 1` → `x !== null ? x : 1` |
| Polyfill | **API/hàm còn thiếu** | Thêm `Array.prototype.includes` khi runtime chưa có |

### Image vs Container
| | Là gì | Tương tự |
|---|---|---|
| Image | Bản thiết kế, chỉ đọc | class |
| Container | Tiến trình đang chạy | object |

---

[← Docker](./08-docker.md) · **Thuật ngữ** · [Lưu ý config →](./10-luu-y-config.md)
