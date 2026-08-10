[← Nginx](./07-nginx.md) · **Docker** · [Thuật ngữ →](./09-thuat-ngu.md)

---

# 07. Docker

> File config: [`Dockerfile`](../Dockerfile), [`docker-compose.yml`](../docker-compose.yml), [`.dockerignore`](../.dockerignore)

## Thuật ngữ trong bài

| Keyword | Giải thích |
|---|---|
| **Image** | Bản thiết kế **chỉ đọc**, đóng gói sẵn OS + app + config. Giống file `.iso` |
| **Container** | Một **tiến trình đang chạy** từ image. Giống object được tạo từ class |
| **Dockerfile** | Công thức để build image |
| **Layer** | Mỗi lệnh trong Dockerfile tạo một tầng. Layer được **cache** và **chia sẻ** giữa các image |
| **Build context** | Toàn bộ thư mục được gửi tới Docker daemon lúc build. `.dockerignore` lọc bớt |
| **Base image** | Image làm nền, khai bằng `FROM` |
| **Multi-stage build** | Dùng nhiều `FROM` trong một Dockerfile; image cuối chỉ giữ stage cuối |
| **Alpine** | Bản Linux siêu nhẹ (~5 MB), dùng làm base image cho gọn |
| **Registry** | Kho chứa image (Docker Hub, GHCR) |
| **Tag** | Nhãn phiên bản: `myapp:latest`, `myapp:v1.2` |
| **Port mapping** | `"3000:80"` = port **host** 3000 → port **container** 80 |
| **Volume** | Cơ chế gắn dữ liệu vào container |
| **Bind mount** | Gắn **thư mục thật trên máy host** vào container (`.:/app`) |
| **Anonymous volume** | Volume do Docker tự quản, không trỏ tới host (`/app/node_modules`) |
| **Orchestrator** | Công cụ quản lý nhiều container: Docker Compose, Kubernetes, ECS |
| **Healthcheck** | Lệnh container tự chạy định kỳ để báo mình còn khoẻ |
| **Daemon** | Tiến trình Docker chạy nền, thực thi lệnh build/run |

---

## Docker giải quyết vấn đề gì

> *"Trên máy tôi chạy được mà?"*

App của bạn cần: đúng phiên bản Node, đúng bộ dependency, Nginx, đúng file config, đúng OS. Chỉ cần một thứ lệch là hỏng.

Docker đóng gói **tất cả** vào một **image** — một artifact bất biến chạy **y hệt nhau** trên laptop Windows của bạn, trên CI Linux, và trên server production.

### Image vs Container

```
   Dockerfile           docker build          docker run
   (công thức)   ──────────────────►  IMAGE  ──────────►  CONTAINER
                                    (chỉ đọc)          (đang chạy)
                                        │
                                        ├──► container A  (port 3000)
                                        ├──► container B  (port 3001)
                                        └──► container C  (trên server khác)
```

Quan hệ giống **class → object**: một image tạo được nhiều container.

---

## Multi-stage build — thiết kế của Dockerfile này

```dockerfile
# ═══════ Stage 1: BUILD ═══════
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install                  # cài dependency
COPY . .
RUN npm run build                # sinh /app/dist

# ═══════ Stage 2: PRODUCTION ═══════
FROM nginx:alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html    # ← chỉ lấy dist
EXPOSE 80
HEALTHCHECK ...
CMD ["nginx", "-g", "daemon off;"]
```

### Vì sao 2 stage?

**Image cuối cùng CHỈ chứa stage 2.** Stage 1 bị vứt bỏ hoàn toàn sau khi build xong.

| | Nếu chỉ 1 stage | **Với multi-stage** |
|---|---|---|
| Nội dung image | Node runtime + npm + `node_modules` (~400 MB) + source code + `dist/` | Nginx + `dist/` |
| Kích thước | **~1.2 GB** | **~25 MB** |
| Bề mặt tấn công | Có Node, npm, toàn bộ source code | Chỉ Nginx + file tĩnh |
| Thời gian pull/deploy | Chậm | Nhanh |

Dòng `COPY --from=build /app/dist /usr/share/nginx/html` là **chìa khoá**: nó với sang stage trước lấy **đúng thứ cần**, bỏ lại tất cả phần còn lại.

Logic: `node_modules` và source code chỉ cần **lúc build**. Lúc chạy, chỉ cần file tĩnh trong `dist/` và một web server.

### `alpine` là gì

Bản Linux siêu nhẹ (~5 MB, so với Ubuntu ~70 MB). Đó là lý do image cuối chỉ ~25 MB.

Đánh đổi: alpine dùng `musl libc` thay `glibc`. Đôi khi package có binary native (như `sass-embedded`) gặp vấn đề. Project này không gặp vì `sass-embedded` chỉ chạy ở stage build.

---

## Layer cache — vì sao thứ tự lệnh quan trọng

**Mỗi lệnh trong Dockerfile tạo một layer được cache.** Docker chỉ build lại từ layer đầu tiên **bị thay đổi** trở đi.

```dockerfile
COPY package.json ./     # ① ít khi đổi
RUN npm install          # ② CHẬM (~60s) — chỉ chạy lại khi ① đổi
COPY . .                 # ③ đổi liên tục (mỗi lần sửa code)
RUN npm run build        # ④ nhanh
```

**Bạn sửa 1 dòng CSS rồi build lại:**

```
① COPY package.json   →  package.json không đổi  →  ✅ CACHE HIT
② RUN npm install     →  layer trước cache hit   →  ✅ CACHE HIT   (tiết kiệm 60s!)
③ COPY . .            →  code đổi                →  ❌ chạy lại
④ RUN npm run build   →  layer trước đổi         →  ❌ chạy lại
```

**Nếu viết sai thứ tự:**

```dockerfile
COPY . .                 # ← code đổi ở đây
RUN npm install          # ← BUỘC phải chạy lại, dù package.json không đổi
RUN npm run build
```
→ Mỗi lần sửa 1 dòng CSS phải `npm install` lại từ đầu. Build từ 20 giây thành 90 giây.

> **Nguyên tắc chung: xếp lệnh theo thứ tự "ít thay đổi → hay thay đổi".**
>
> Đây là tối ưu Dockerfile phổ biến nhất và cũng dễ làm sai nhất.

---

## `.dockerignore`

```
node_modules
dist
.git
.github
.env
.env.*
*.md
.dockerignore
Dockerfile
docker-compose.yml
Makefile
.gitignore
.vscode
.idea
*.log
```

Loại các mục này khỏi **build context** (toàn bộ thư mục được gửi tới Docker daemon). Ba lý do:

| Lý do | Giải thích |
|---|---|
| **Nhanh hơn** | Không phải gửi `node_modules` hàng trăm MB tới daemon |
| **Đúng hơn** | `node_modules` trên Windows chứa binary compile cho **Windows** — copy vào container **Linux** sẽ hỏng |
| **An toàn hơn** | `.env` và `.git` không lọt vào image (image có thể bị push lên registry công khai) |

Ý thứ 2 rất quan trọng: nếu không ignore `node_modules`, dòng `COPY . .` sẽ ghi đè `node_modules` Linux (vừa cài ở bước trước) bằng bản Windows → build fail hoặc chạy sai.

---

## `HEALTHCHECK`

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
```

| Tham số | Nghĩa |
|---|---|
| `--interval=30s` | Cứ 30 giây kiểm tra 1 lần |
| `--timeout=3s` | Quá 3 giây không phản hồi → tính là fail |
| `--start-period=5s` | Ân hạn 5 giây đầu — fail trong lúc khởi động không bị tính |
| `--retries=3` | Fail **3 lần liên tiếp** → đánh dấu `unhealthy` |
| `--spider` | Cờ wget: chỉ kiểm tra tồn tại, **không tải nội dung** |

Container tự gọi chính mình để kiểm tra sức khoẻ. Orchestrator (Compose, Kubernetes, ECS) dựa vào tín hiệu này để **restart container** hoặc **ngừng route traffic** vào nó.

Xem trạng thái:
```bash
docker ps          # cột STATUS hiện: Up 2 minutes (healthy)
```

---

## `docker-compose.yml` — hai môi trường

Compose = định nghĩa nhiều container bằng một file YAML thay vì gõ `docker run` dài dòng.

### Service production

```yaml
portfolio:
  build:
    context: .                # thư mục build context
    dockerfile: Dockerfile
  container_name: portfolio-mobile
  ports:
    - "3000:80"               # host:container
  restart: unless-stopped
  healthcheck: ...
```

**Port mapping `"3000:80"`:**
```
Bạn mở localhost:3000
        │
        ▼
   [ Docker chuyển tiếp ]
        │
        ▼
   Nginx đang nghe port 80 BÊN TRONG container
```
Số bên trái đổi tự do; số bên phải phải khớp `listen 80` trong `nginx.conf`.

**`restart: unless-stopped`** — tự bật lại khi crash hoặc khi máy reboot, **trừ khi** bạn chủ động `docker stop`.

### Service development

```yaml
portfolio-dev:
  image: node:20-alpine       # dùng THẲNG image Node, KHÔNG build Dockerfile
  working_dir: /app
  ports:
    - "5173:5173"
  volumes:
    - .:/app                  # ① bind mount
    - /app/node_modules       # ② anonymous volume
  command: sh -c "npm install && npm run dev -- --host 0.0.0.0"
  environment:
    - NODE_ENV=development
```

Chú ý: service này **không build Dockerfile**. Nó lấy thẳng `node:20-alpine` rồi chạy lệnh — vì mục tiêu là dev, không cần Nginx.

### Hai dòng `volumes` — mẹo quan trọng nhất

```yaml
volumes:
  - .:/app                # ① bind mount: thư mục host → container
  - /app/node_modules     # ② anonymous volume: CHE phần trên
```

**①** gắn thư mục code trên máy bạn vào `/app` trong container → bạn sửa file trên Windows, **Vite trong container thấy ngay** → HMR hoạt động.

**②** là **anonymous volume**. Nó **ghi đè lên** phần `/app/node_modules` của bind mount ①.

Vì sao cần:
```
Không có dòng ②:
  .:/app  mount TẤT CẢ, gồm cả node_modules build cho WINDOWS
  → tràn vào container LINUX
  → sass-embedded (có binary native) crash

Có dòng ②:
  /app/node_modules được Docker quản riêng
  → npm install trong container ghi vào đây
  → node_modules Windows bị che, không ảnh hưởng
```

Thứ tự khai báo quan trọng: mount **cụ thể hơn** phải đứng sau.

### `--host 0.0.0.0` — bắt buộc

```yaml
command: sh -c "npm install && npm run dev -- --host 0.0.0.0"
```

Mặc định Vite chỉ nghe `localhost`. Trong container, `localhost` là **của chính container**, không ai bên ngoài vào được → mở `localhost:5173` trên máy bạn sẽ trắng trang.

`0.0.0.0` = "nghe trên mọi network interface" → Docker chuyển tiếp được.

`--` trong `npm run dev -- --host` là cú pháp npm: mọi thứ sau `--` được truyền tiếp cho lệnh bên dưới (`vite`), không phải cho npm.

---

## Lệnh hay dùng

```bash
# npm scripts của project
npm run docker:up          # production (Nginx)  → localhost:3000
npm run docker:up:dev      # development (Vite)  → localhost:5173
npm run docker:down        # dừng tất cả

npm run docker:build       # build image thủ công
npm run docker:run         # chạy container từ image đã build
npm run docker:stop        # dừng + xoá container đó
```

```bash
# lệnh Docker trực tiếp
docker ps                              # container đang chạy (có cột health)
docker ps -a                           # gồm cả container đã dừng
docker images                          # danh sách image + kích thước

docker compose logs -f portfolio       # xem log realtime
docker exec -it portfolio-mobile sh    # vào shell bên trong container
docker exec portfolio-mobile ls /usr/share/nginx/html   # kiểm tra dist/ đã copy đúng chưa

docker compose up -d --build           # build lại rồi chạy
docker compose down -v                 # dừng + xoá cả volume

docker system prune -a                 # ⚠️ dọn sạch image/container không dùng (giải phóng nhiều GB)
```

### Debug khi container không chạy

```bash
docker compose logs portfolio          # ① đọc log trước tiên
docker ps -a                           # ② container có tồn tại không, exit code bao nhiêu
docker exec -it portfolio-mobile sh    # ③ vào trong xem file có đúng chỗ không
  ls /usr/share/nginx/html             #    dist/ đã copy vào chưa?
  cat /etc/nginx/conf.d/default.conf   #    nginx.conf đúng chưa?
  nginx -t                             #    cú pháp config có hợp lệ?
```

---

[← Nginx](./07-nginx.md) · **Docker** · [Thuật ngữ →](./09-thuat-ngu.md)
