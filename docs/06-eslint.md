[← Babel](./05-babel.md) · **ESLint** · [Nginx →](./07-nginx.md)

---

# 05. ESLint

> File config: [`eslint.config.js`](../eslint.config.js) · Lệnh: `npm run lint`, `npm run lint:fix`

## Thuật ngữ trong bài

| Keyword | Giải thích |
|---|---|
| **Linter** | Công cụ **đọc code mà không chạy code** (static analysis) để tìm lỗi và vi phạm quy ước |
| **Static analysis** | Phân tích tĩnh — suy luận từ cấu trúc code, không thực thi |
| **Rule** | Một luật cụ thể, ví dụ "cấm dùng `var`" |
| **Severity** | Mức độ: `'off'` (0) / `'warn'` (1) / `'error'` (2). Chỉ `'error'` mới làm process **exit code ≠ 0** → CI fail |
| **Flat config** | Định dạng config mới của ESLint 9 (`eslint.config.js`, export mảng). Thay cho `.eslintrc.json` cũ |
| **`extends`** | Kế thừa một bộ rule đã đóng gói sẵn |
| **Preset / shareable config** | Bộ rule đóng gói sẵn để `extends` |
| **Plugin** (ESLint) | Package **cung cấp thêm rule mới**. Phải `plugins: {}` nạp vào trước khi dùng rule của nó |
| **Parser** | Bộ phân tích cú pháp. ESLint gốc không hiểu TypeScript → `typescript-eslint` cung cấp parser riêng |
| **Autofix** | Rule có thể tự sửa. Chạy bằng `--fix` |
| **Globals** | Danh sách biến toàn cục có sẵn (`window`, `process`…) để ESLint không báo `no-undef` |
| **Glob pattern** | Mẫu khớp đường dẫn: `**/*.tsx` = mọi file `.tsx` ở mọi cấp thư mục |

---

## ESLint là gì, và khác TypeScript chỗ nào

Đây là câu hỏi hay bị lẫn nhất.

| | **TypeScript (`tsc`)** | **ESLint** |
|---|---|---|
| Câu hỏi | "Code này có **đúng kiểu** không?" | "Code này có **viết đúng chuẩn** không?" |
| Bắt được | `string` gán vào `number`, gọi hàm thiếu tham số, truy cập property không tồn tại | Dùng `var`, quên dependency trong `useEffect`, import lộn xộn, so sánh bằng `==` |
| Không bắt được | Import lộn xộn, `var`, Rules of Hooks | Sai kiểu dữ liệu |

**Cả hai đều cần** — chúng phủ hai vùng khác nhau, không thay thế nhau.

Project chạy tách riêng:
```json
"lint":      "eslint .",
"typecheck": "tsc --noEmit",
"ci":        "npm run lint && npm run typecheck && npm run build"
```

`--noEmit` = chỉ kiểm tra, **không xuất file** (việc xuất file để Vite lo).

---

## Cấu trúc `eslint.config.js`

Đây là **flat config** — chuẩn của ESLint 9. File export một **mảng** config object, áp dụng **lần lượt từ trên xuống**; object sau ghi đè object trước ở phần trùng nhau.

```js
export default defineConfig([
  globalIgnores(['dist', 'node_modules', '.tmp']),      // ① bỏ qua
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],                // ② áp cho file nào
    plugins: { 'simple-import-sort': simpleImportSort },// ③ nạp plugin
    extends: [ /* 4 preset */ ],                        // ④ kế thừa
    languageOptions: { /* env */ },                     // ⑤ môi trường
    rules: { /* luật riêng */ },                        // ⑥ tuỳ chỉnh
  },
]);
```

### ① `globalIgnores`

```js
globalIgnores(['dist', 'node_modules', '.tmp'])
```
Bỏ qua hoàn toàn. `dist` là code đã minify — lint nó vô nghĩa và cực chậm.

### ② `files` — phạm vi áp dụng

```js
files: ['**/*.{js,mjs,cjs,ts,tsx}']
```

| Phần | Nghĩa |
|---|---|
| `**/` | Mọi thư mục, mọi độ sâu |
| `*.{a,b}` | File có đuôi `a` hoặc `b` |
| `mjs` | ES Module (dùng `import`) |
| `cjs` | CommonJS (dùng `require`) |

### ③ `plugins` — nạp rule mới

```js
plugins: { 'simple-import-sort': simpleImportSort }
```

Key `'simple-import-sort'` chính là **tiền tố** khi gọi rule sau này: `'simple-import-sort/imports'`. Không nạp ở đây thì viết rule sẽ lỗi "rule not found".

### ④ `extends` — 4 preset

| Preset | Mang lại gì |
|---|---|
| `js.configs.recommended` | Luật JS nền tảng: `no-undef`, `no-unreachable`, `no-dupe-keys`, `no-constant-condition`… |
| `tseslint.configs.recommended` | Parser TypeScript + luật TS: `no-misused-promises`, `no-unnecessary-type-assertion`… |
| `reactHooks.configs.flat.recommended` | **Rules of Hooks** — xem bên dưới |
| `reactRefresh.configs.vite` | Đảm bảo file component export đúng cách để **HMR không vỡ** |

**Rules of Hooks** — hai luật:
```tsx
// ❌ rules-of-hooks: không gọi hook trong if / loop / sau early return
if (isLoggedIn) {
  const [name, setName] = useState('');   // LỖI
}

// ⚠️ exhaustive-deps: thiếu dependency
useEffect(() => {
  fetchData(userId);
}, []);                                   // CẢNH BÁO: thiếu userId
```

Lý do luật 1 tồn tại: React nhận diện hook **theo thứ tự gọi**, không theo tên. Gọi có điều kiện → thứ tự đổi giữa các lần render → state lẫn lộn giữa các hook.

**`reactRefresh`** — vì sao cần: Fast Refresh chỉ hoạt động khi file **chỉ export component React**. Export lẫn hằng số / hàm thường vào cùng file → Vite không biết cách thay module → **HMR âm thầm chuyển thành full reload**. Rule này cảnh báo trước.

### ⑤ `languageOptions`

```js
languageOptions: {
  ecmaVersion: 'latest',
  globals: { ...globals.browser, ...globals.node },
}
```

| | |
|---|---|
| `ecmaVersion: 'latest'` | Hiểu cú pháp JS mới nhất |
| `globals.browser` | Khai báo `window`, `document`, `fetch`, `localStorage`, `console`… |
| `globals.node` | Khai báo `process`, `__dirname`, `Buffer`… |

Không có `globals`, ESLint sẽ báo `'window' is not defined` khắp nơi. Cần `globals.node` vì `vite.config.ts` có dùng `process.env`.

---

## ⑥ Từng rule tự định nghĩa

**Tất cả đều để `'error'`** → `npm run ci` sẽ **fail**, không chỉ cảnh báo. Đây là lựa chọn có chủ đích: rule ở mức `warn` thường bị lơ đi cho tới khi tích tụ thành hàng trăm cảnh báo.

Ký hiệu: 🔧 = có autofix (`npm run lint:fix` tự sửa được)

### Nhóm 1 — Import

```js
'simple-import-sort/imports': 'error',   // 🔧
'simple-import-sort/exports': 'error',   // 🔧
```

Ép sắp xếp import theo nhóm cố định, tự chèn dòng trắng giữa các nhóm:

```ts
import path from 'node:path';         // ① Node builtin

import { motion } from 'framer-motion'; // ② package ngoài
import React from 'react';

import Button from '@/components/Button'; // ③ alias nội bộ

import styles from './Card.module.scss';  // ④ relative
```

**Lợi ích thật sự: giảm conflict git.** Khi mọi người thêm import vào một vị trí xác định theo thuật toán, hai nhánh khác nhau ít khi đụng cùng dòng.

```js
'@typescript-eslint/consistent-type-imports': [
  'error',
  { prefer: 'type-imports', fixStyle: 'inline-type-imports' },   // 🔧
],
```

Ép đánh dấu rõ import nào là **type**:
```ts
// ❌
import { User, getUser } from './api';

// ✅ inline-type-imports
import { type User, getUser } from './api';

// (fixStyle: 'separate-type-imports' sẽ tách thành 2 dòng thay vì inline)
```

> ⚠️ **Đây không phải rule thẩm mỹ.** `tsconfig.json` đang bật `"verbatimModuleSyntax": true` — nghĩa là TypeScript **giữ nguyên** câu lệnh import khi biên dịch, **không tự xoá** type import nữa.
>
> Không đánh dấu `type` → bundler tưởng đó là giá trị runtime thật → sinh import thừa, hoặc lỗi "does not provide an export named 'User'".
>
> **Rule này và `verbatimModuleSyntax` là một cặp.** Tắt rule mà giữ tsconfig là tự chuốc bug.

```js
'no-duplicate-imports': 'error',
```
Chặn import cùng một module ở 2 dòng riêng biệt.

### Nhóm 2 — TypeScript nghiêm ngặt

```js
'@typescript-eslint/no-explicit-any': 'error',
```

Cấm `any`. Lý do: **`any` lây lan**. Mọi giá trị dẫn xuất từ nó cũng mất kiểu, vô hiệu hoá TypeScript ở cả vùng xung quanh.

```ts
const data: any = await res.json();
data.user.profile.nam;   // ✅ TS im lặng — nhưng runtime crash (typo "name")
```

Thay bằng `unknown` rồi thu hẹp kiểu:
```ts
const data: unknown = await res.json();
if (isUser(data)) { data.name; }   // ✅ an toàn
```

```js
'@typescript-eslint/no-unused-vars': [
  'error',
  { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
],
```

Cấm biến thừa, **trừ** biến bắt đầu bằng `_`. Đây là quy ước để nói *"tôi cố ý bỏ qua cái này"*:

```ts
const [, setCount] = useState(0);        // bỏ qua phần tử đầu
arr.map((_item, index) => index);        // _item được tha
catch (_err) { showToast('Lỗi'); }       // _err được tha
```

### Nhóm 3 — Code style ES6+

| Rule | Ép làm gì | Vì sao |
|---|---|---|
| `no-var` 🔧 | `let`/`const` thay `var` | `var` có **function-scope** và **hoisting** — biến "rò rỉ" ra ngoài block, nguồn bug kinh điển |
| `prefer-const` 🔧 | Biến không gán lại → phải `const` | Đọc là biết ngay giá trị có đổi hay không |
| `prefer-template` 🔧 | `` `Hi ${n}` `` thay `'Hi ' + n` | Dễ đọc, tránh ép kiểu ngầm khi nối chuỗi với số |
| `object-shorthand` 🔧 | `{ name }` thay `{ name: name }` | Ngắn, đồng nhất |
| `arrow-body-style: as-needed` 🔧 | `() => x` thay `() => { return x; }` | Bỏ ngoặc thừa khi chỉ return |
| `eqeqeq` (`null: 'ignore'`) | `===` thay `==` | `==` **ép kiểu ngầm** — nguồn bug âm thầm |

**Vì sao `eqeqeq` tha `== null`:**

`==` ép kiểu ngầm, cho ra kết quả phi trực giác:
```js
0   == ''       // true  😱
'1' == 1        // true  😱
[]  == false    // true  😱
```

Nhưng `== null` là một **idiom hữu ích**: nó bắt **cả `null` lẫn `undefined`** trong một phép so sánh.
```js
if (x == null)                          // ✅ gọn — bắt cả null và undefined
if (x === null || x === undefined)      // dài dòng, tương đương
```
Nên option `{ null: 'ignore' }` tha riêng trường hợp này.

---

## Dùng hằng ngày

```bash
npm run lint       # chỉ báo lỗi
npm run lint:fix   # tự sửa: import sort, prefer-const, prefer-template, object-shorthand...
```

Phần lớn rule trong config này **có autofix**. Thói quen tốt: chạy `lint:fix` trước khi commit.

### Tắt rule khi thật sự cần

```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacy = thirdPartyThing as any;

/* eslint-disable @typescript-eslint/no-explicit-any */
// ... cả khối được tha
/* eslint-enable @typescript-eslint/no-explicit-any */
```

Luôn ghi **tên rule cụ thể**, đừng `eslint-disable` trần — disable trần tắt toàn bộ rule trong file, che luôn những lỗi khác bạn không định bỏ qua.

### Debug config

```bash
npx eslint --print-config src/App.tsx    # xem rule nào đang thực sự áp cho file này
npx eslint src/App.tsx --fix-dry-run     # xem sẽ sửa gì mà không ghi đè
```

---

[← Babel](./05-babel.md) · **ESLint** · [Nginx →](./07-nginx.md)
