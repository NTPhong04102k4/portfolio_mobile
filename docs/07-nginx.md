[← ESLint](./06-eslint.md) · **Nginx & Cache** · [Docker →](./08-docker.md)

---

# 06. Nginx & Cache

> File config: [`nginx.conf`](../nginx.conf) · Chạy bên trong container production

## Thuật ngữ trong bài

| Keyword | Giải thích |
|---|---|
| **Web server** | Chương trình nhận HTTP request và trả HTTP response |
| **Reverse proxy** | Server đứng trước, nhận request rồi chuyển tiếp tới backend khác. Nginx làm được, nhưng project này **không dùng** vai trò đó — chỉ phục vụ file tĩnh |
| **`server` block** | Khối cấu hình cho một "virtual host" (một site) |
| **`location` block** | Khối quy tắc cho một nhóm URL |
| **`root`** | Thư mục gốc chứa file để phục vụ |
| **`try_files`** | Thử lần lượt các đường dẫn, dùng cái đầu tiên tồn tại |
| **`$uri`** | Biến chứa đường dẫn của request hiện tại (`/projects`) |
| **Gzip** | Thuật toán nén. Server nén trước khi gửi, trình duyệt tự giải nén |
| **HTTP header** | Cặp `Tên: giá trị` gửi kèm request/response, chứa metadata |
| **`Cache-Control`** | Header quyết định **ai được cache, bao lâu, có phải hỏi lại không** |
| **`max-age`** | Số **giây** được coi là còn "tươi" |
| **`immutable`** | "Nội dung không bao giờ đổi" — trình duyệt bỏ qua cả việc hỏi lại, kể cả khi F5 |
| **`no-cache`** | Được lưu, **nhưng phải hỏi server** trước mỗi lần dùng |
| **`no-store`** | Cấm lưu hoàn toàn |
| **Revalidate** | Hỏi server "file này còn mới không?" |
| **ETag** | Mã định danh phiên bản file. Dùng để revalidate |
| **`304 Not Modified`** | Server trả lời "chưa đổi, dùng bản cache đi" — response **rỗng**, rất nhẹ |
| **Stale** | Cache đã cũ, không còn khớp bản trên server |
| **Cache busting** | Kỹ thuật buộc trình duyệt tải lại — ở đây là **đổi tên file** |
| **SPA fallback** | URL không khớp file nào → trả `index.html`. Xem [Static server](./02-static-server.md) |
| **Clickjacking** | Tấn công: nhúng site bạn vào `<iframe>` trong suốt để lừa user bấm nhầm |
| **MIME sniffing** | Trình duyệt tự đoán loại file khi header không rõ — có thể bị lợi dụng để chạy script |

---

## Nginx là gì và vì sao dùng nó

Trong project này, Nginx làm **đúng một việc**: nhận HTTP request và trả file từ `/usr/share/nginx/html` — chính là `dist/` đã copy vào image lúc build Docker.

**Vì sao không dùng `serve` hay `vite preview` cho production?**

| | `serve` / `vite preview` | **Nginx** |
|---|---|---|
| Viết bằng | Node.js | C |
| Concurrency | Vài trăm connection | **Hàng chục nghìn** |
| Gzip | Cơ bản/không | ✅ cấu hình chi tiết |
| Cache header | Không kiểm soát | ✅ theo từng loại file |
| Security header | Không | ✅ |
| Độ chín | Vài năm | **20+ năm production** |

Nói ngắn: `serve` là để **test**, Nginx là để **chạy thật**.

---

## Đọc `nginx.conf` từng khối

### Khối cơ bản

```nginx
server {
    listen 80;                        # nghe port 80 (trong container)
    server_name localhost;
    root /usr/share/nginx/html;       # thư mục gốc = dist/ đã copy vào
    index index.html;                 # file mặc định khi truy cập thư mục
}
```

`listen 80` là port **bên trong container**. Bên ngoài bạn vào `localhost:3000` là nhờ port mapping `"3000:80"` trong `docker-compose.yml` — xem [Docker](./08-docker.md).

---

### Gzip — nén trước khi gửi

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_min_length 256;
gzip_types text/plain text/css text/javascript application/javascript
           application/json application/xml image/svg+xml font/woff2;
```

| Directive | Nghĩa |
|---|---|
| `gzip on` | Bật nén |
| `gzip_comp_level 6` | Mức nén 1 (nhanh, nén ít) → 9 (chậm, nén nhiều). **6 là điểm cân bằng** tiêu chuẩn — lên 9 chỉ hơn ~2% dung lượng nhưng tốn nhiều CPU hơn hẳn |
| `gzip_min_length 256` | File dưới 256 byte **không nén** — overhead header gzip còn lớn hơn phần tiết kiệm được |
| `gzip_vary on` | Thêm header `Vary: Accept-Encoding`, để CDN/proxy cache riêng bản nén và bản không nén. Thiếu dòng này, proxy có thể gửi bản gzip cho client không hỗ trợ |
| `gzip_proxied any` | Nén cả khi request đi qua proxy |
| `gzip_types` | Chỉ nén các MIME type này |

**Hiệu quả thật:** JS/CSS là text → nén được **70–80%**.
```
bundle gốc:  300 KB
sau gzip:     70 KB     ← user tải nhanh hơn ~4×
```

Đây là cải thiện tốc độ **rẻ nhất** bạn có thể có: 8 dòng config.

> **Lưu ý:** không cần liệt kê `text/html` trong `gzip_types` — Nginx **luôn nén HTML** mặc định.
>
> Cũng đừng thêm `image/png`, `image/jpeg` — chúng **đã nén sẵn**, gzip lại chỉ tốn CPU mà file còn có thể to hơn. `image/svg+xml` thì nên có, vì SVG là text.

---

### SPA fallback

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Đọc là: *thử file `$uri` → thử thư mục `$uri/` → không có thì trả `/index.html`*.

```
GET /assets/index-a3f9.js
  → thử ./assets/index-a3f9.js   → CÓ    → trả file ✅

GET /projects
  → thử ./projects               → không
  → thử ./projects/              → không
  → trả ./index.html             → React tự đọc URL và render ✅
```

Không có dòng này, **F5 tại `/projects` sẽ ra 404**. Giải thích đầy đủ vì sao ở [Static server](./02-static-server.md#spa-fallback--khái-niệm-quan-trọng-nhất-trong-file-này).

---

## Cache — phần quan trọng nhất

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

Dịch nghĩa: *"File nào có đuôi này, trình duyệt cứ giữ **1 năm** và **đừng bao giờ hỏi lại server**."*

### Cú pháp `location ~*`

| Ký hiệu | Nghĩa |
|---|---|
| `location /path` | Khớp **tiền tố** |
| `location = /path` | Khớp **chính xác** (nhanh nhất) |
| `location ~ regex` | Regex, **phân biệt** hoa thường |
| `location ~* regex` | Regex, **không phân biệt** hoa thường ← đang dùng |

`~*` để `.PNG` và `.png` đều khớp.

### Từng directive

| Directive | Tác dụng |
|---|---|
| `expires 1y` | Sinh 2 header: `Expires: <ngày>` và `Cache-Control: max-age=31536000` (365 ngày = 31.536.000 giây) |
| `public` | **CDN/proxy trung gian** cũng được cache, không riêng trình duyệt |
| `immutable` | Nội dung **không bao giờ đổi** → trình duyệt bỏ qua cả revalidation. **Kể cả khi user bấm F5** nó vẫn không gửi request |
| `access_log off` | Không ghi log cho asset tĩnh → giảm I/O đáng kể (mỗi trang load hàng chục asset) |

`immutable` là phần dễ bỏ qua nhưng rất giá trị: không có nó, F5 vẫn khiến trình duyệt gửi request revalidate cho **từng** asset. Có nó → 0 request.

---

### Tại sao cache 1 năm mà KHÔNG bị stale

Đây là mấu chốt của cả chiến lược.

**Vì Vite hash tên file theo nội dung:**

```
dist/assets/index-a3f91b2c.js
                  └────┬───┘
                       └─ hash của NỘI DUNG file
```

Sửa một ký tự trong code:

```
trước deploy:   assets/index-a3f91b2c.js
sau deploy:     assets/index-7d2e4f01.js     ← TÊN FILE ĐỔI
```

Trình duyệt **chưa từng thấy URL mới** → bắt buộc phải tải. File cũ còn nằm trong cache cũng vô hại — không ai gọi tới nó nữa.

```
┌─────────────────────────────────────────────────────────┐
│  Vite hash tên file  ──►  Nginx cache 1 năm an toàn      │
│                                                          │
│  Đổi nội dung = đổi URL = cache tự động "hết hiệu lực"   │
└─────────────────────────────────────────────────────────┘
```

Kỹ thuật này gọi là **cache busting qua content hashing**. Nó cho phép cache vĩnh viễn **mà vẫn deploy được** — bạn được cả hai, không phải đánh đổi.

---

### Mắt xích còn thiếu: `index.html`

`index.html` **không** được hash — URL của nó buộc phải cố định là `/`.

Mà nó chính là file chứa các thẻ trỏ tới bundle mới:
```html
<script type="module" src="/assets/index-7d2e4f01.js"></script>
```

Nên logic đúng phải là:

| File | Cache | Vì sao |
|---|---|---|
| `assets/*` (có hash) | **1 năm, immutable** | Tên đổi khi nội dung đổi |
| `index.html` | **Không cache / no-cache** | Là "bản đồ" trỏ tới asset mới nhất |

Nếu `index.html` bị cache lâu → user vẫn đọc bản đồ cũ → vẫn tải bundle cũ → **deploy xong mà không ai thấy thay đổi**.

Config đang khai báo tường minh:

```nginx
location = /index.html {
    add_header Cache-Control "no-cache" always;

    # 4 security header lặp lại ở đây — xem phần dưới về add_header
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

`location = /index.html` dùng **exact match** (`=`) — ưu tiên cao nhất trong nginx, khớp trước mọi prefix/regex location khác.

Nó bắt được **cả ba** đường vào `index.html`:

| Request | Đường đi |
|---|---|
| `GET /index.html` | Khớp trực tiếp |
| `GET /` | Directive `index index.html` → **internal redirect** tới `/index.html` → chạy lại match |
| `GET /projects` | `try_files` fallback `/index.html` → **internal redirect** → chạy lại match |

Không có dòng này, Nginx sẽ không gửi `Cache-Control` nào → trình duyệt **tự suy đoán** thời gian cache (*heuristic caching*, thường ~10% tuổi file tính theo `Last-Modified`) — hành vi không xác định trước, phụ thuộc từng trình duyệt.

> **`no-cache` ≠ `no-store`** — hai cái này rất hay bị nhầm:
>
> | | Được lưu? | Hành vi |
> |---|---|---|
> | `no-cache` | ✅ Có | Lưu, nhưng **luôn hỏi server** trước khi dùng. Chưa đổi → server trả **`304 Not Modified`** (response rỗng, ~vài trăm byte) |
> | `no-store` | ❌ Không | Cấm lưu hoàn toàn, luôn tải lại đầy đủ |
>
> Với `index.html`, `no-cache` là đúng: rẻ (thường chỉ tốn 1 lần 304) mà luôn đảm bảo mới.

---

### Security headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

| Header | Chống gì |
|---|---|
| `X-Frame-Options: SAMEORIGIN` | **Clickjacking** — chỉ site cùng origin được nhúng bạn vào `<iframe>` |
| `X-Content-Type-Options: nosniff` | **MIME sniffing** — cấm trình duyệt tự đoán loại file. Ngăn file upload `.txt` bị thực thi như JS |
| `X-XSS-Protection: 1; mode=block` | XSS filter — **legacy**, trình duyệt hiện đại đã bỏ. Vô hại, giữ cho trình duyệt cũ |
| `Referrer-Policy: strict-origin-when-cross-origin` | Rò rỉ URL — khi user click sang site khác, chỉ gửi domain chứ không gửi full path |

**`always`** = gửi header kể cả với response lỗi (4xx/5xx). Thiếu `always`, trang 404 sẽ không có các header này.

### ⚠️ Bẫy nginx: `add_header` KHÔNG cộng dồn — nó ghi đè

Nginx chỉ kế thừa `add_header` từ cấp cha **khi cấp hiện tại không có `add_header` nào**. Có **một** cái thôi là mất sạch cấp trên.

```nginx
server {
    add_header X-Frame-Options "SAMEORIGIN" always;   # khai ở cấp server

    location /a { }                                   # ✅ kế thừa — không có add_header nào
    location /b { add_header Foo "bar" always; }       # ❌ MẤT X-Frame-Options
}
```

Vì thế config này **cố ý lặp lại** header trong 2 location có khai `add_header`:

| Location | Header được gửi |
|---|---|
| `location /` (không có `add_header`) | Kế thừa đủ 4 security header từ `server` |
| `location = /index.html` | Lặp lại đủ 4 + `Cache-Control: no-cache` |
| `location ~* \.(js\|css\|...)$` | Lặp lại `nosniff` + `Cache-Control: public, immutable` |

Location static asset chỉ lặp lại `X-Content-Type-Options: nosniff` — đây là header **duy nhất có ý nghĩa thật** cho file `.js`/`.css`. Ba header còn lại chỉ tác dụng lên response HTML (chống iframe, kiểm soát Referer khi điều hướng), gửi kèm file JS không thay đổi gì về bảo mật.

**Cách khác nếu sau này header nhiều lên:** tách 4 dòng ra file riêng rồi `include` vào từng location — nhưng phải thêm một dòng `COPY` trong `Dockerfile` cho file đó.

---

### Chặn file ẩn

```nginx
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}
```

Chặn mọi đường dẫn chứa `/.` — tránh lộ `.git/`, `.env`, `.htaccess` nếu lỡ bị copy vào image. Lớp phòng thủ thứ hai (lớp thứ nhất là `.dockerignore`).

---

## Debug cache

```bash
# xem header thật server trả về
curl -I http://localhost:3000/
curl -I http://localhost:3000/assets/index-a3f91b2c.js

# kiểm tra gzip có hoạt động không
curl -I -H "Accept-Encoding: gzip" http://localhost:3000/assets/index-a3f91b2c.js
# → phải thấy: Content-Encoding: gzip
```

Trong DevTools → tab Network, cột **Size**:

| Hiển thị | Nghĩa |
|---|---|
| `(disk cache)` / `(memory cache)` | Không gửi request — cache hoạt động ✅ |
| `304` | Có gửi request, server trả "chưa đổi" — revalidate |
| Số byte cụ thể | Tải mới hoàn toàn |

---

[← ESLint](./06-eslint.md) · **Nginx & Cache** · [Docker →](./08-docker.md)
