[← Tổng quan](./01-tong-quan.md) · **Static server** · [Vite →](./03-vite.md)

---

# 01. Static server — `serve` & `live-server`

## Thuật ngữ trong bài

| Keyword | Giải thích |
|---|---|
| **Static file** | File nằm sẵn trên đĩa, trả về **nguyên xi** không xử lý gì: `.html`, `.js`, `.css`, `.png`. Ngược lại là **dynamic** — nội dung được sinh ra theo từng request (PHP, Node API, Django…) |
| **Static file server** | Chương trình mở một port HTTP, nhận đường dẫn URL, tìm file tương ứng trên đĩa, trả về |
| **Port** | Số hiệu "cổng" trên máy để phân biệt các chương trình cùng nghe mạng. `localhost:3000` = chương trình đang nghe cổng 3000 |
| **MIME type** | Chuỗi mô tả loại nội dung, gửi kèm trong header `Content-Type`. Ví dụ `text/javascript`. Trình duyệt dựa vào đây để biết cách xử lý file |
| **SPA** (Single Page Application) | App chỉ tải **một** file HTML duy nhất; mọi thay đổi trang sau đó do JavaScript vẽ lại, không tải lại trang |
| **Client-side routing** | Việc đổi trang do JS ở phía trình duyệt xử lý, URL đổi nhưng **không gửi request** tới server |
| **SPA fallback** | Quy tắc: URL nào không khớp file nào thì trả về `index.html`, để JS tự xử lý route |
| **WebSocket** | Kênh kết nối 2 chiều, giữ mở liên tục giữa trình duyệt và server (khác HTTP thường: hỏi–đáp rồi đóng) |
| **Inject** | Chèn thêm nội dung vào file trước khi gửi đi, ở đây là chèn thẻ `<script>` vào HTML |
| **HMR** (Hot Module Replacement) | Thay **đúng module** vừa sửa trong app đang chạy, **giữ nguyên state** — xem [Vite](./03-vite.md) |

---

## `serve` là gì

Một **static file server** tối giản. Không hơn.

```bash
npx serve dist
# → Serving at http://localhost:3000
```

Nó làm đúng một việc:

```
Trình duyệt:  GET /assets/index-a3f9.js
     serve:  → tìm file ./dist/assets/index-a3f9.js
             → đọc nội dung
             → trả về kèm Content-Type: text/javascript
```

Hết. Không compile, không watch, không reload.

### Cờ hay dùng

```bash
npx serve dist -s -l 3000
```

| Cờ | Đầy đủ | Tác dụng |
|---|---|---|
| `-s` | `--single` | Bật **SPA fallback** (xem bên dưới) |
| `-l 3000` | `--listen` | Chọn port |
| `-n` | `--no-clipboard` | Không tự copy URL vào clipboard |

---

## SPA fallback — khái niệm quan trọng nhất trong file này

Bạn sẽ gặp lại khái niệm này ở **Nginx**. Hiểu kỹ một lần ở đây là đủ dùng mãi.

### Vấn đề

React chạy **client-side routing**. URL `/projects` **không** tương ứng với file `dist/projects.html` nào cả — nó chỉ là state trong JavaScript.

**Kịch bản A — điều hướng trong app (OK):**
```
1. Bạn mở  localhost:3000/          → server trả index.html
2. index.html tải JS                → React khởi động
3. Bạn bấm link "Projects"          → JS đổi URL thành /projects
                                      (history.pushState — KHÔNG gửi request)
4. React vẽ lại màn hình            → ✅ hoạt động
```

**Kịch bản B — F5 tại `/projects` (404):**
```
1. Bạn nhấn F5 tại localhost:3000/projects
2. Trình duyệt gửi thật: GET /projects
3. Server tìm file ./dist/projects  → không tồn tại
4. Trả 404                          → ❌ trang trắng
```

Cùng URL, nhưng bước 2 khác nhau hoàn toàn: một bên JS xử lý nội bộ, một bên server thật sự bị hỏi.

### Cách giải quyết

Bảo server: **"file nào không tìm thấy thì trả `index.html`"**.

```
1. GET /projects
2. Server: không có file → trả index.html (status 200)
3. Trình duyệt tải JS → React đọc window.location.pathname = "/projects"
4. React vẽ đúng trang Projects  → ✅
```

Cùng một quy tắc, ba cách viết:

```bash
npx serve dist -s                     # serve
npx live-server --entry-file=index.html   # live-server
```
```nginx
location / { try_files $uri $uri/ /index.html; }   # Nginx
```

Project này dùng cách thứ ba — xem [Nginx](./07-nginx.md).

---

## `live-server` là gì

= `serve` **+ tự động reload trình duyệt khi file thay đổi**.

```bash
npx live-server --port=3000
```

### Cơ chế

```
① live-server đọc index.html
② Trước khi gửi, nó INJECT một thẻ script vào cuối file:
      <script>  // mở WebSocket tới ws://localhost:3000
                // khi nhận tín hiệu → location.reload()
      </script>
③ Song song, nó WATCH thư mục đang phục vụ
④ Bạn sửa style.css → live-server phát hiện
⑤ Gửi tín hiệu qua WebSocket
⑥ Script trong trình duyệt gọi location.reload()  → F5 tự động
```

### Điểm yếu: nó chỉ biết reload cả trang

`location.reload()` = bấm F5. Nghĩa là:

- Toàn bộ state React **mất sạch**
- Đang ở bước 3 của form nhiều bước? Sửa 1 dòng CSS → về bước 1
- Vị trí scroll mất
- Modal đang mở → đóng

Vite dùng **HMR**: chỉ thay module vừa sửa, **giữ nguyên state**. Đây là khác biệt về chất, không phải về lượng.

```
live-server:  sửa Button.css  →  reload cả app  →  state = rỗng
Vite HMR:     sửa Button.tsx  →  thay Button    →  state = giữ nguyên
```

### Tình trạng bảo trì

`live-server` bản gốc **gần như đã dừng phát triển**. Nếu thật sự cần, dùng fork còn sống: `five-server` hoặc `live-server-plus`.

---

## So sánh ba anh em

| | `serve` | `live-server` | `vite` (dev) |
|---|---|---|---|
| Phục vụ file tĩnh | ✅ | ✅ | ✅ |
| Auto reload | ❌ | ✅ reload cả trang | ✅ **HMR, giữ state** |
| Biên dịch TS / JSX / SCSS | ❌ | ❌ | ✅ |
| Resolve `import 'react'` | ❌ | ❌ | ✅ |
| SPA fallback | `-s` | `--entry-file` | mặc định bật |
| Còn bảo trì | ✅ (Vercel) | ⚠️ gần như bỏ | ✅ |
| **Dùng cho** | Test bản `dist/` | HTML thuần | **Phát triển hằng ngày** |

---

## Trong project này thì sao

**Không cần cả hai.**

| Muốn gì | Dùng gì |
|---|---|
| Code hằng ngày | `npm run dev` — Vite HMR, mạnh hơn `live-server` |
| Xem thử bản build | `npm run preview` — chính là `vite preview`, vai trò y hệt `serve dist -s` |
| Chạy như production thật | `npm run docker:up` — Nginx, có gzip + cache |

`serve` chỉ hữu ích trong 2 tình huống ngách:
- Test `dist/` trên máy **không có** source code / không cài Vite
- Trong CI, chạy Lighthouse hoặc e2e test trên artifact build ra

`live-server` thì **không có lý do dùng** trong project React + Vite.

---

[← Tổng quan](./01-tong-quan.md) · **Static server** · [Vite →](./03-vite.md)
