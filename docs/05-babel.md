[← Webpack](./04-webpack.md) · **Babel** · [ESLint →](./06-eslint.md)

---

# 04. Babel & React Compiler

> Config nằm **inline** trong [`vite.config.ts`](../vite.config.ts) — project **không có** file `babel.config.js`

## Thuật ngữ trong bài

| Keyword | Giải thích |
|---|---|
| **Compiler** | Chương trình nhận code dạng này, nhả code dạng khác |
| **Transpile** | Compile giữa hai ngôn ngữ **cùng cấp độ** (JS mới → JS cũ, TS → JS). Khác với compile xuống machine code |
| **AST** (Abstract Syntax Tree) | Cây cấu trúc biểu diễn code. Babel parse code → AST → sửa cây → sinh code mới. Mọi plugin đều thao tác trên AST |
| **Plugin** (Babel) | Một phép biến đổi cụ thể trên AST |
| **Preset** | Bộ plugin đóng gói sẵn. `@babel/preset-env` = "các plugin cần để chạy được trên trình duyệt tôi chỉ định" |
| **Polyfill** | Code bổ sung **API còn thiếu** lúc runtime (`Array.prototype.includes`, `Promise`). Khác transpile — transpile sửa **cú pháp**, polyfill thêm **hàm** |
| **Browserslist** | Cú pháp khai báo "tôi cần hỗ trợ trình duyệt nào": `> 0.5%, last 2 versions` |
| **Memoization** | Ghi nhớ kết quả tính toán để lần sau khỏi tính lại |
| **Referential equality** | Hai biến có **cùng tham chiếu** không (`===` với object/hàm). React dựa vào đây để biết prop có "đổi" hay không |
| **Re-render** | React chạy lại hàm component để tính ra UI mới |
| **React Compiler** | Compiler chính thức của React 19, tự động chèn memo hoá |

---

## Babel là gì

**JavaScript compiler**: nhận JS/TS/JSX vào, nhả JS ra.

```
code nguồn  →  [ parse ]  →  AST  →  [ plugin sửa AST ]  →  [ generate ]  →  code đích
```

Hai công dụng chính:

### 1. Transpile cú pháp mới → cú pháp cũ

```js
// input (ES2020)
const f = () => x ?? 1;

// output (target ES5)
var f = function () {
  return x !== null && x !== void 0 ? x : 1;
};
```

Đây là lý do Babel nổi tiếng thời 2015–2020, khi IE11 còn phải hỗ trợ. Ngày nay ít quan trọng hơn nhiều — trình duyệt hiện đại đã hiểu gần hết cú pháp mới, và **esbuild làm việc này nhanh hơn Babel rất nhiều**.

### 2. Biến đổi code qua plugin

Đây mới là lý do project này dùng Babel.

---

## Vì sao project KHÔNG có `babel.config.js`

Vite dùng **esbuild** để xử lý TypeScript và JSX. esbuild viết bằng Go, nhanh hơn Babel ~20–100 lần.

→ **Mặc định Babel không chạy chút nào.**

Babel chỉ được gọi tới khi bạn **chủ động yêu cầu**. Và bạn đang yêu cầu, ngay trong `vite.config.ts`:

```js
react({
  babel: {
    plugins: [['babel-plugin-react-compiler']],
  },
})
```

> **Đây CHÍNH LÀ "babel config" của project.** Nó không nằm ở file riêng mà nằm inline trong config Vite.

Cấu trúc `['tên-plugin', { options }]` là cú pháp chuẩn của Babel: mảng 2 phần tử = plugin + option. Ở đây không truyền option nên chỉ có 1 phần tử.

Muốn tách ra file riêng vẫn được (tạo `babel.config.js`, plugin `@vitejs/plugin-react` sẽ tự đọc), nhưng với **1 plugin** thì không đáng.

### Ai xử lý cái gì

```
file .tsx
   │
   ├──► esbuild:  strip type TypeScript, transform JSX     (nhanh, luôn chạy)
   │
   └──► Babel:    chạy babel-plugin-react-compiler         (chậm hơn, chỉ vì bạn yêu cầu)
```

---

## `babel-plugin-react-compiler` làm gì

Đây là **React Compiler** — tính năng lớn nhất của React 19.

Nó **tự động memo hoá** component: tự làm việc mà trước đây bạn phải viết tay bằng `useMemo`, `useCallback`, `React.memo`.

### Vấn đề nó giải quyết

React re-render bằng cách **chạy lại toàn bộ hàm component**. Mỗi lần chạy lại, mọi object/hàm khai báo bên trong đều được **tạo mới**:

```tsx
function ProjectList({ items }) {
  const sorted = items.sort(cmp);          // mảng MỚI mỗi lần render
  const onClick = () => select(id);        // hàm MỚI mỗi lần render

  return <Card data={sorted} onClick={onClick} />;
}
```

`Card` nhận prop "mới" mỗi lần (dù nội dung giống hệt), vì **tham chiếu khác nhau** → `Card` re-render vô ích.

### Cách cũ — viết tay

```tsx
const sorted   = useMemo(() => items.sort(cmp), [items]);
const onClick  = useCallback(() => select(id), [id]);
```

Vấn đề của cách này:
- Dài dòng, làm rối code
- Rất dễ **quên dependency** → bug stale closure (dùng giá trị cũ)
- Rất dễ **lạm dụng** → memo hoá cả thứ rẻ tiền, hại nhiều hơn lợi
- Không ai chắc chỗ nào thật sự cần

### Cách mới — compiler tự lo

```tsx
function ProjectList({ items }) {
  const sorted  = items.sort(cmp);      // viết "ngây thơ"
  const onClick = () => select(id);

  return <Card data={sorted} onClick={onClick} />;
}
```

Lúc build, compiler phân tích luồng dữ liệu và **tự chèn memo hoá tương đương**, đúng chỗ cần, không thừa không thiếu.

> **Hệ quả trong repo này:** trong `src/` bạn thấy rất ít `useMemo` / `useCallback`. Đó là **đúng thiết kế**, không phải thiếu sót. Đừng thêm thủ công trừ khi đã đo được vấn đề thật.

### Đánh đổi

| Được | Mất |
|---|---|
| Code sạch, ít boilerplate | Build **chậm hơn** — Babel phải chạy thêm 1 lượt trên mỗi file component |
| Không còn bug thiếu dependency | Thêm 1 lớp "phép thuật" — khó suy luận khi debug |
| Memo hoá đúng chỗ, không thừa | Compiler **bỏ qua** component vi phạm Rules of Hooks |

Ý cuối quan trọng: React Compiler chỉ tối ưu code **tuân thủ Rules of React**. Component nào vi phạm (mutate props, side effect trong lúc render…) sẽ bị bỏ qua âm thầm.

→ Đó là lý do rule `react-hooks` trong ESLint không phải "cho vui" — nó là **điều kiện để compiler hoạt động**. Xem [ESLint](./06-eslint.md).

---

## Nếu sau này cần thêm plugin Babel

```ts
// vite.config.ts
react({
  babel: {
    plugins: [
      ['babel-plugin-react-compiler'],
      ['babel-plugin-styled-components', { displayName: true }],  // ví dụ
    ],
  },
})
```

Nhớ: **mỗi plugin Babel thêm vào đều làm build chậm hơn**. Trước khi thêm, kiểm tra xem có plugin Vite/esbuild tương đương không — thường nhanh hơn nhiều.

---

[← Webpack](./04-webpack.md) · **Babel** · [ESLint →](./06-eslint.md)
