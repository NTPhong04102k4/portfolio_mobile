[← Thuật ngữ](./09-thuat-ngu.md) · **Lưu ý config** · [Mục lục](./README.md)

---

# 09. Lưu ý về config hiện tại

Những điểm phát hiện khi đọc config. Xếp theo mức độ nên xử lý.

> **Trạng thái:** mục (a) và (b) **đã fix** trong `nginx.conf` — giữ lại phần mô tả để hiểu vì sao config trông như hiện tại. Mục (c), (d), (e) vẫn còn.

---

## ✅ a. `add_header` trong Nginx ghi đè, không cộng dồn — ĐÃ FIX

**File:** [`nginx.conf`](../nginx.conf)

### Vấn đề

Nginx kế thừa `add_header` từ cấp cha **chỉ khi cấp hiện tại không có `add_header` nào**. Có một cái thôi là **mất hết** cấp trên.

```nginx
server {
    # 4 header này khai ở cấp `server`
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location ~* \.(js|css|png|...)$ {
        add_header Cache-Control "public, immutable";   # ← có add_header ở đây
        # ⇒ 4 header trên KHÔNG được áp cho các file này
    }
}
```

Kiểm chứng:
```bash
curl -I http://localhost:3000/                              # có đủ 4 security header
curl -I http://localhost:3000/assets/index-a3f91b2c.js      # chỉ có Cache-Control
```

### Mức độ ảnh hưởng

**Thấp.** Security header chủ yếu có ý nghĩa với response **HTML** — `X-Frame-Options` chống nhúng iframe, `Referrer-Policy` áp cho điều hướng. Trả về cho file `.js` gần như không thay đổi gì về bảo mật.

### Đã sửa thế nào

Lặp lại header trong location có khai `add_header`:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable" always;

    # Repeated for the same inheritance reason as above.
    add_header X-Content-Type-Options "nosniff" always;

    access_log off;
}
```

Chỉ lặp `nosniff` — header **duy nhất có ý nghĩa thật** cho file `.js`/`.css`. Ba header còn lại chỉ tác dụng lên response HTML.

Có comment trong `nginx.conf` giải thích vì sao lặp, để lần sau không ai "dọn cho gọn" rồi vô tình xoá mất.

**Cách khác nếu sau này header nhiều lên:** tách ra file riêng rồi `include` — nhưng phải thêm dòng `COPY` trong `Dockerfile`.

---

## ✅ b. `index.html` chưa có `Cache-Control` tường minh — ĐÃ FIX

**File:** [`nginx.conf`](../nginx.conf)

### Vấn đề

`index.html` rơi vào `location /` và không có header cache nào. Nginx không gửi `Cache-Control` → trình duyệt dùng **heuristic caching**: tự đoán thời gian cache (thường ~10% tuổi file tính theo `Last-Modified`).

Trong khi đó `index.html` là file **quan trọng nhất** phải luôn mới — nó chứa các thẻ trỏ tới bundle có hash:

```html
<script type="module" src="/assets/index-7d2e4f01.js"></script>
```

Cache nhầm `index.html` → user vẫn đọc "bản đồ" cũ → vẫn tải bundle cũ → **deploy xong mà không ai thấy thay đổi**.

### Mức độ ảnh hưởng

**Thấp–trung bình.** Thực tế thường vẫn ổn vì Nginx gửi `ETag` và `Last-Modified` → trình duyệt vẫn revalidate. Nhưng đây là hành vi **không xác định trước**, phụ thuộc trình duyệt.

### Đã sửa thế nào

```nginx
location = /index.html {
    add_header Cache-Control "no-cache" always;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

`=` là **exact match** — ưu tiên cao nhất trong nginx, khớp trước mọi prefix/regex location khác.

Nó bắt được **cả ba** đường vào `index.html`:

| Request | Đường đi |
|---|---|
| `GET /index.html` | Khớp trực tiếp |
| `GET /` | `index index.html` → **internal redirect** → chạy lại match |
| `GET /projects` | `try_files` fallback → **internal redirect** → chạy lại match |

Vì block này có `add_header`, 4 security header **phải lặp lại** (đúng vấn đề (a) ở trên). Đây là chỗ chúng có ý nghĩa nhất — response HTML.

`no-cache` = "được lưu, nhưng luôn hỏi server trước khi dùng". Chưa đổi → server trả `304 Not Modified` (response rỗng, vài trăm byte). Rất rẻ mà luôn đảm bảo mới.

---

## 🔶 c. Dockerfile không copy lockfile

**File:** [`Dockerfile`](../Dockerfile)

```dockerfile
# Copy package.json only (ignore Windows lockfile)
COPY package.json ./
RUN npm install
```

### Vấn đề

`npm install` **không có lockfile** sẽ resolve lại dependency theo range `^`:

```json
"vite": "^7.3.1"    // chấp nhận 7.3.1, 7.4.0, 7.9.2... bất kỳ 7.x nào
```

→ Build hôm nay và build tháng sau có thể ra **bộ dependency khác nhau**, dù code không đổi. Nếu một package minor release có bug, image production hỏng mà bạn không đổi dòng code nào.

### Mức độ ảnh hưởng

**Trung bình** — nhưng chỉ lộ ra khi có sự cố, và lúc đó rất khó debug ("hôm qua build được mà?").

### Nếu muốn sửa

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci
```

| | `npm install` | `npm ci` |
|---|---|---|
| Đọc lockfile | Có thể **sửa** nó | **Chỉ đọc**, sai là fail |
| Kết quả | Có thể khác nhau giữa các lần | **Giống hệt nhau** |
| Tốc độ | Chậm hơn | Nhanh hơn (xoá sạch `node_modules` rồi cài thẳng) |
| Dùng cho | Máy dev | **CI/CD, Docker** |

Điều kiện: phải commit `package-lock.json` vào git. Lockfile **không phụ thuộc OS** — nó chỉ ghi phiên bản và integrity hash, nên lockfile sinh trên Windows dùng được trên Linux. Comment "ignore Windows lockfile" trong Dockerfile có lẽ xuất phát từ hiểu nhầm này (điều đúng với **`node_modules`** — cái đó thật sự phụ thuộc OS, và đã được `.dockerignore` xử lý).

---

## 🔷 d. Lệch phiên bản Node giữa dev và prod

**File:** [`Dockerfile`](../Dockerfile) vs [`docker-compose.yml`](../docker-compose.yml)

```dockerfile
FROM node:22-alpine AS build        # Dockerfile — build production
```
```yaml
image: node:20-alpine               # compose service portfolio-dev
```

Môi trường dev và môi trường build production lệch **một major version**.

### Mức độ ảnh hưởng

**Thấp** với stack hiện tại (Vite 7 + React 19 chạy tốt trên cả 20 và 22). Nhưng nó là một biến số thừa: khi có bug "chạy local ok, trong Docker fail", bạn sẽ phải loại trừ khả năng này trước.

### Nếu muốn sửa

Đồng bộ về `node:22-alpine` ở cả hai. Bonus: thêm vào `package.json` để chốt luôn cho máy dev:

```json
"engines": { "node": ">=22" }
```

---

## 🔷 e. `yarn` nằm trong `dependencies`

**File:** [`package.json`](../package.json)

```json
"dependencies": {
  "yarn": "^1.22.22"
}
```

`yarn` là **package manager**, không phải runtime dependency của app.

### Mức độ ảnh hưởng

**Rất thấp.** Nó không lọt vào `dist/` (bundler chỉ đóng gói cái được `import`), nên **không ảnh hưởng bundle size**. Chỉ tốn thời gian và dung lượng lúc `npm install` — kể cả trong Docker build.

Ngoài ra project đang dùng **npm** (mọi script đều là `npm run`), nên nó cũng không được dùng tới.

### Nếu muốn sửa

```bash
npm uninstall yarn
```

Nếu thật sự cần yarn, cài global (`npm i -g yarn`) hoặc dùng `corepack` — không đưa vào `dependencies`.

---

## Tóm tắt

| # | Vấn đề | Ảnh hưởng | Trạng thái |
|---|---|---|---|
| a | `add_header` ghi đè → asset mất security header | 🔶 Thấp | ✅ **Đã fix** |
| b | `index.html` chưa có `Cache-Control` | 🔶 Thấp–TB | ✅ **Đã fix** |
| c | Dockerfile không dùng lockfile | 🔶 TB | ⬜ Còn — cần commit lockfile trước |
| d | Node 22 vs Node 20 | 🔷 Thấp | ⬜ Còn — đổi 1 chữ số |
| e | `yarn` trong `dependencies` | 🔷 Rất thấp | ⬜ Còn — 1 lệnh |

Ba mục còn lại không cái nào đang gây lỗi. Nếu làm tiếp, **(c)** đáng giá nhất — nó là cái duy nhất có thể khiến build production hỏng mà bạn không đổi dòng code nào.

### Kiểm chứng (a) và (b) sau khi chạy

```bash
npm run docker:up

curl -I http://localhost:3000/
# → Cache-Control: no-cache
# → đủ 4 security header

curl -I http://localhost:3000/assets/index-<hash>.js
# → Cache-Control: public, immutable
# → X-Content-Type-Options: nosniff
```

Kiểm tra cú pháp config mà không cần chạy cả stack:
```bash
docker run --rm -v "$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" nginx:alpine nginx -t
```

---

[← Thuật ngữ](./09-thuat-ngu.md) · **Lưu ý config** · [Mục lục](./README.md)
