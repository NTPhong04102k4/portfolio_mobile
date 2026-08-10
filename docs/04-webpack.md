[← Vite](./03-vite.md) · **Webpack** · [Babel →](./05-babel.md)

---

# 03. Webpack

> **Project này KHÔNG dùng Webpack.** File này để bạn hiểu Vite đứng ở đâu, và để đọc được project cũ khi cần.

## Thuật ngữ trong bài

| Keyword | Giải thích |
|---|---|
| **Module bundler** | Công cụ gom nhiều file module thành ít file đầu ra |
| **Entry point** | File bắt đầu — nơi bundler khởi hành để đi tìm mọi thứ khác |
| **Dependency graph** | Đồ thị "file nào import file nào", dựng bằng cách đi theo mọi `import`/`require` từ entry |
| **Output** | Cấu hình ghi bundle ra đâu, tên gì |
| **Loader** | "Phiên dịch viên" cho một loại file. Webpack gốc chỉ hiểu JS; muốn hiểu `.scss` phải cắm loader |
| **Chain** (chuỗi loader) | Nhiều loader nối tiếp nhau, chạy **phải → trái** |
| **Plugin** | Can thiệp vào **vòng đời build** (khác loader — loader chỉ biến đổi từng file) |
| **Mode** | `development` (build nhanh, có source map) hoặc `production` (minify, tối ưu) |
| **Chunk** | Một mảnh bundle. Code splitting sinh ra nhiều chunk |
| **`[contenthash]`** | Placeholder trong tên file, Webpack thay bằng hash nội dung lúc build |
| **Module Federation** | Tính năng riêng của Webpack 5: cho phép nhiều app build độc lập chia sẻ module **lúc runtime** — nền tảng của micro-frontend |
| **HMR** | Webpack cũng có, nhưng chậm dần khi app lớn |

---

## Webpack là gì

**Module bundler** — thế hệ thống trị 2015–2021. Create React App, Next.js (bản cũ), Angular CLI, Vue CLI đều chạy trên nó.

### Nguyên lý

```
       entry: src/index.js
              │
              │  đi theo mọi import...
              ▼
    ┌─────────────────────┐
    │  DEPENDENCY GRAPH   │
    │                     │
    │   index.js          │
    │    ├── App.jsx      │
    │    │    ├── Button.jsx
    │    │    └── style.scss
    │    └── utils.js     │
    └──────────┬──────────┘
               │  áp loader cho từng loại file
               │  chạy plugin theo vòng đời
               ▼
        bundle.js  +  style.css  +  index.html
```

Điểm mấu chốt: **phải dựng xong toàn bộ graph rồi mới phục vụ được request đầu tiên**. Đây chính là chỗ Vite khác biệt.

---

## Bốn khái niệm lõi

### 1. Entry & Output

```js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',   // → main.a3f91b2c.js
    clean: true,                            // xoá dist/ trước mỗi lần build
  },
};
```

`[name]` và `[contenthash]` là **placeholder**, Webpack thay lúc build.

### 2. Loader — phiên dịch cho từng loại file

Webpack gốc **chỉ hiểu JavaScript**. Mọi thứ khác phải có loader.

```js
module: {
  rules: [
    {
      test: /\.(js|jsx|ts|tsx)$/,      // file nào khớp regex này
      exclude: /node_modules/,
      use: 'babel-loader',              // thì đưa qua loader này
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      //     ③ chèn vào DOM  ② hiểu @import  ① SCSS → CSS
    },
  ],
}
```

⚠️ **Chuỗi loader chạy PHẢI → TRÁI.** Đây là điểm gây nhầm nhiều nhất:

```
file.scss
   │
   ├─► sass-loader    ① SCSS  → CSS
   ├─► css-loader     ② hiểu @import / url() trong CSS, biến thành JS module
   └─► style-loader   ③ chèn thẻ <style> vào DOM lúc runtime
```

Viết sai thứ tự → lỗi khó hiểu kiểu "Unexpected token" ở giữa file CSS.

### 3. Plugin — can thiệp vòng đời build

Khác loader ở chỗ: loader xử lý **từng file**, plugin xử lý **cả quá trình**.

```js
plugins: [
  new HtmlWebpackPlugin({ template: './public/index.html' }),  // sinh index.html + tự chèn thẻ script
  new MiniCssExtractPlugin(),                                   // tách CSS ra file .css riêng
  new DefinePlugin({ 'process.env.NODE_ENV': '"production"' }), // thay thế biến lúc build
],
```

### 4. Mode

```js
mode: 'production',   // bật minify, tree-shaking, tối ưu
// hoặc
mode: 'development',  // build nhanh, source map đầy đủ, không minify
```

---

## Webpack vs Vite

| | **Webpack** | **Vite** |
|---|---|---|
| **Dev server** | Bundle **toàn bộ app** trước khi phục vụ request đầu tiên | Không bundle — transform **on-demand** qua ESM native |
| **Khởi động** | 10s → 60s+, **tăng theo kích thước** project | ~300ms, gần như **không đổi** |
| **HMR** | Chậm dần khi app phình to | Gần như tức thì |
| **Build production** | Webpack tự bundle | **Rollup** (output thường gọn hơn) |
| **Config** | Rõ ràng nhưng dài — 60–100 dòng cho React cơ bản | ~15 dòng, phần lớn "chạy luôn" |
| **Xử lý CSS/ảnh** | Phải cắm loader | Có sẵn |
| **Hệ sinh thái** | Rất lớn, cực trưởng thành, loader cho mọi thứ | Đủ dùng, đang lớn nhanh |
| **Trình duyệt cũ** | Tốt hơn | Dev server cần trình duyệt hỗ trợ ESM |
| **Module Federation** | ✅ có sẵn | ⚠️ qua plugin bên thứ ba |

### Vì sao khác biệt tốc độ lại lớn đến vậy

```
WEBPACK DEV                              VITE DEV
────────────                             ────────
npm start                                npm run dev
   │                                        │
   ├─ đọc entry                             └─ server sẵn sàng (~300ms) ✅
   ├─ dựng graph 1000+ module                     │
   ├─ transform 1000+ file                        │  trình duyệt hỏi file nào
   ├─ bundle                                      │  → transform đúng file đó
   │  ⏳ 10–60 giây                               │  ⚡ ~5ms/file
   └─ ✅ mở được trang
```

Webpack làm việc **trước, cho toàn bộ**. Vite làm việc **khi cần, cho từng cái**.

Lý do Vite làm được: **ESM native trong trình duyệt** — thứ chưa tồn tại khi Webpack ra đời năm 2012.

---

## Khi nào vẫn nên chọn Webpack

- Bảo trì codebase legacy đã chạy Webpack (đừng migrate chỉ vì thích)
- Cần **Module Federation** cho kiến trúc micro-frontend
- Cần một loader ngách mà Vite chưa có tương đương
- Phải hỗ trợ trình duyệt rất cũ với setup phức tạp

Với **project mới** → Vite. Project này chọn đúng.

---

## Điểm cần nhớ

**Cả hai giải quyết cùng một bài toán**: biến code hiện đại thành thứ trình duyệt chạy được. Vite không "phát minh" gì mới về mục tiêu — nó chỉ tận dụng được một khả năng của trình duyệt hiện đại (ESM native) mà thời Webpack chưa có.

Hiểu Webpack vẫn có ích: khái niệm **entry / loader / plugin / chunk** xuất hiện dưới tên khác trong hầu hết mọi bundler, kể cả Rollup mà Vite dùng bên trong.

---

[← Vite](./03-vite.md) · **Webpack** · [Babel →](./05-babel.md)
