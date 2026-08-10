# Project Profile — portfolioMobile

> Sinh bởi skill `learn-project` (skillrunner). Đây là bộ nhớ kiến trúc dùng lại cho các phiên sau.
> **Chỉ rebuild khi người dùng yêu cầu rõ ràng** (`sr emit learn-project`).
>
> - Ngày dựng: 2026-08-08
> - Commit gốc: `87109f7` (branch `feat/maintain`)
> - Stack do `sr detect`: **react**

---

## 1. Tổng quan

Portfolio cá nhân một trang (single-page) của **Nguyễn Thế Phong** — Mobile Engineer (React Native / Flutter / Native Swift & Kotlin). Nội dung CV được version hoá và parse sẵn thành TypeScript, render qua các module React thuần. Không có backend trong repo trừ một serverless function cho AI chat.

**Deploy:** Vercel (`vercel.json`) + Docker/nginx (`Dockerfile`, `nginx.conf`, `docker-compose.yml`).

---

## 2. Framework & Language

| Hạng mục | Giá trị |
|---|---|
| Framework | React **19.2** (`^19.2.0`, bundle build ra 19.2.8) |
| Language | TypeScript **~5.9.3**, `strict: true` |
| Build tool | Vite **^7.3.1** + `@vitejs/plugin-react` |
| Compiler | **babel-plugin-react-compiler** ^1.0.0 (bật trong `vite.config.ts`) |
| Styling | **SCSS** qua `sass-embedded` ^1.97.3 — KHÔNG dùng Tailwind, KHÔNG CSS Modules |
| Charts | `chart.js` ^4.4.7 + `react-chartjs-2` ^5.3.0 |
| Animation | `framer-motion` ^12.34.5 |
| Code display | `react-syntax-highlighter` ^16.1.1 |
| Package manager | npm (có cả `yarn.lock` — **lệch**, xem §9) |

**tsconfig đáng chú ý:** `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals/Parameters`, `moduleResolution: bundler`, alias `@/*` → `src/*` (khai báo cả ở `tsconfig.json` và `vite.config.ts`).

---

## 3. Kiến trúc & các lớp

Kiến trúc **module theo domain**, không có lớp data/service — toàn bộ nội dung là static TypeScript.

```
src/
├── main.tsx                    entry — createRoot + StrictMode
├── App.tsx                     đăng ký section, compose provider
├── config/portfolioModules.ts  assertPortfolioConfig() — guard chạy lúc import
├── content/
│   ├── CV_V1.md                nguồn CV dạng markdown (không import vào bundle)
│   └── cv_v1.parsed.ts         cvV1Data — nguồn dữ liệu THẬT (224 dòng)
├── theme/ThemeContext.tsx      ThemeProvider / useTheme
├── i18n/
│   ├── ThemeLanguageContext.tsx  bản cài đặt thật (I18nProvider, useI18n, translations)
│   └── I18nContext.tsx           re-export 2 dòng (facade)
├── modules/<domain>/           layout | cv | projects | skills | blog | ai | tech | user
└── styles/                     SCSS tập trung, xem §6
```

**Luồng compose (App.tsx):**

```
ThemeProvider → I18nProvider → InnerApp
                                 └── PageLayout (Header + main + AiAssistantWidget + Footer)
                                       └── Section × 4  (about | projects | experience | blog)
```

**Quy ước lớp thực tế:**
- Component = 1 file `.tsx`, export **named** (`export function X`), không default export (trừ `App`).
- Dữ liệu nằm cạnh module: `src/modules/projects/data/projects.ts`.
- Không có `handler.tsx` / `index.tsx` tách logic-view. State cục bộ đặt thẳng trong component.
- Component lớn được tách con theo view: `ProjectCard` → `ProjectCardDetails` + `ProjectCardLinks`.

---

## 4. Các luồng chính

### 4.1 Navigation — KHÔNG có router
Không cài `react-router` hay tương đương. Điều hướng = **state + scroll**:
- `App.tsx` giữ `useState<SectionId>('about')`.
- `Header` nhận `activeSection` / `onSelectSection`, bấm nav → set state **và** `window.scrollTo` tới `getElementById(id)` với offset `-90px` (bù sticky header).
- **Cả 4 section luôn render đồng thời** — `activeSection` chỉ tô sáng nav, không unmount gì.
- `SectionId = 'about' | 'projects' | 'experience' | 'blog' | 'contact'` (`contact` khai báo nhưng chưa có section).

### 4.2 Theme
`ThemeContext.tsx` → `useEffect` set `document.documentElement.setAttribute('data-theme', theme)`, persist `localStorage['portfolio_theme']`, mặc định `'dark'`.
⚠️ Xem §9 — light theme chưa có CSS.

### 4.3 i18n
Tự viết, không dùng i18next. `translations: Record<string, {vi, en}>` hard-code trong `ThemeLanguageContext.tsx`. `t(key)` trả về chính `key` nếu thiếu. Persist `localStorage['portfolio_lang']`, mặc định `'vi'`.
Hiện chỉ có **10 key** (`nav.*`, `section.*.subtitle`) — phần lớn UI đang hard-code tiếng Việt trực tiếp trong JSX.

### 4.4 Data
Không có HTTP client, không react-query. Mọi nội dung import tĩnh từ `cv_v1.parsed.ts` và `projects.ts`.

### 4.5 AI Assistant (luồng mạng duy nhất)
`AiAssistantWidget.tsx:49` → `fetch(import.meta.env.VITE_AI_API_URL || '/api/ai-assistant')`, có fallback trả lời cục bộ khi lỗi. Backend: `api/ai-assistant.ts` (proxy Gemini).
⚠️ Xem §9 — route này chưa được `vercel.json` phục vụ.

### 4.6 Config guard
`assertPortfolioConfig()` chạy **ngay khi import `App.tsx`** (top-level, không trong component). Đọc `portfolio.config.json`, ném lỗi nếu `cvVersion !== 'CV_V1'`, `structureVersion !== 'PROJECT_STRUCTURE_V1'`, hoặc thiếu module trong `['user','cv','projects','layout']`. Sai config = app crash lúc boot, không phải lúc render.

---

## 5. Catalog component (tái sử dụng — dùng thẳng, đừng đọc lại source)

### Layout
| Component | Path | Mục đích |
|---|---|---|
| `PageLayout` | `modules/layout/PageLayout.tsx` | Khung trang: Header + `<main>` + AI widget + Footer. Export cả type `SectionId`. |
| `Section` | `modules/layout/Section.tsx` | Wrapper card có title/subtitle. **Dùng cái này cho mọi khối mới.** |
| `Header` | `modules/layout/Header.tsx` | Sticky nav, brand, nút CV PDF. Nav items khai báo inline (kèm emoji icon). |
| `Footer` | `modules/layout/Footer.tsx` | 13 dòng, dùng `useI18n`. |

### Projects
| Component | Path | Ghi chú |
|---|---|---|
| `ProjectsList` | `modules/projects/ProjectList.tsx` | Map `projects` → grid `.bento-projects-grid`. |
| `ProjectCard` | `modules/projects/ProjectCard.tsx` | `useState` toggle chi tiết. |
| `ProjectCardDetails` | `modules/projects/ProjectCardDetails.tsx` | Render `detailCategories`. |
| `ProjectCardLinks` | `modules/projects/ProjectCardLinks.tsx` | Store badge, tự ẩn nếu không có link. |
| `MobileShowcase` | `modules/projects/MobileShowCase.tsx` | Mockup điện thoại CSS. Import bởi `Cvprojects`. |

### CV / Content
| Component | Path | Được render? |
|---|---|---|
| `AboutMe` | `modules/cv/AboutMe.tsx` | ✅ (bọc `UserProfile`) |
| `CvProjects` | `modules/cv/Cvprojects.tsx` | ✅ |
| `CvExperience` | `modules/cv/CvExperencies.tsx` | ✅ (bọc `NativeCodeShowcase`) |
| `CvHobbies` | `modules/cv/CvHobbies.tsx` | ✅ |
| `UserProfile` | `modules/user/UserProfiles.tsx` | ✅ gián tiếp |
| `CvSkills` | `modules/cv/CvSkills.tsx` | ❌ mồ côi |
| `CvEducation` | `modules/cv/CvEducation.tsx` | ❌ mồ côi |
| `CvGoals` | `modules/cv/CvGoals.tsx` | ❌ mồ côi |

### Skills / Blog / AI
| Component | Path | Được render? |
|---|---|---|
| `SkillsRadar` | `modules/skills/SkillRadar.tsx` | ✅ chart.js radar |
| `NativeCodeShowcase` | `modules/skills/NativeCodeShowCase.tsx` | ✅ gián tiếp, syntax-highlighter |
| `BlogIssues` | `modules/blog/BlogIssues.tsx` | ✅ accordion |
| `AiAssistantWidget` | `modules/ai/AiAssistantWidget.tsx` | ✅ FAB + panel chat |
| `MyAiStack` | `modules/ai/MyAiStack.tsx` | ❌ mồ côi |
| `TechStack` | `modules/tech/TechStack.tsx` | ❌ mồ côi |

**5 component mồ côi** (0 importer): `MyAiStack`, `CvEducation`, `CvGoals`, `CvSkills`, `TechStack`.

---

## 6. Design system / tokens

Không có design system dùng chung. Style tập trung ở `src/styles/`, nạp một lần qua `App.tsx:1` → `@/styles/main.scss`.

**Hai tầng token:**
1. **Sass variables** — `_variables.scss`: `$color-accent: #38bdf8`, `$color-purple`, `$radius-lg/md/sm/pill`, `$spacing-xl…xs`, `$max-width: 1140px`, map `$breakpoints` (sm 640 / md 768 / lg 1024 / xl 1280) + mixin `respond-to($size)`.
2. **CSS custom properties** — `_layout.scss` dưới `:root[data-theme='dark']`: `--bg-body`, `--color-text`, `--color-muted`, `--card-bg`, `--card-border`, `--card-shadow`, `--header-bg`, `--header-border`, `--item-bg`, `--item-border`.

**Quy ước class:** BEM (`.block__element--modifier`), state dùng `.is-active` / `.is-open`. Prefix chính: `portfolio-`, `project-card`, `cv-`, `blog-issue`, `ai-assistant`.

**Font:** Inter (body) + Outfit (heading), load qua `<link>` Google Fonts ở `index.html:23`.

**Chỉ 5 chỗ inline style** toàn repo (`App.tsx` ×2, `AboutMe.tsx` ×2, `SkillRadar.tsx` ×1) — giữ kỷ luật này.

---

## 7. Config, env, script

| File | Vai trò |
|---|---|
| `portfolio.config.json` | Khai báo version CV/structure + module bắt buộc. Thay đổi phải đồng bộ `portfolioModules.ts`. |
| `vite.config.ts` | `base` từ `VITE_BASE_URL`, alias `@`, react-compiler. |
| `eslint.config.js` | Flat config, xem §8. |
| `vercel.json` | `@vercel/static-build`, `distDir: dist`. |
| `Dockerfile` / `nginx.conf` / `docker-compose.yml` | Build tĩnh + serve nginx. |

**Env vars:** `VITE_BASE_URL` (build), `VITE_AI_API_URL` (runtime, tùy chọn), + API key Gemini phía serverless.

**Scripts:** `dev`, `build` (`tsc -b && vite build`), `lint`, `lint:fix`, `typecheck`, **`ci` = lint + typecheck + build**, `preview`, `deploy`, `docker:*`, `clean`.

---

## 8. Convention bắt buộc (từ eslint.config.js)

- `simple-import-sort/imports` + `exports` — **error**. Import phải sort đúng nhóm.
- `@typescript-eslint/consistent-type-imports` với `fixStyle: 'inline-type-imports'` → viết `import { type Foo, bar }`.
- `no-explicit-any` — **error**.
- `no-unused-vars` — cho phép prefix `_`.
- `prefer-const`, `no-var`, `prefer-template`, `object-shorthand`, `arrow-body-style: as-needed`, `eqeqeq` (bỏ qua null).
- `no-duplicate-imports`.
- Hook rules + react-refresh (vite preset) → file export cả component lẫn hook cần `// eslint-disable-next-line react-refresh/only-export-components` (đã áp dụng ở `ThemeContext.tsx`, `ThemeLanguageContext.tsx`).

Chạy `npm run ci` trước khi giao việc.

---

## 9. Vấn đề đã biết (tính tới 2026-08-08, chưa sửa)

| # | Mức | Vấn đề |
|---|---|---|
| 1 | 🔴 | **Light theme hỏng.** `ThemeContext.tsx:30` set `data-theme='light'` nhưng `_layout.scss:3` chỉ định nghĩa `:root[data-theme='dark']`. Bật light → 10 CSS var undefined, 45 chỗ `var(--…)` không fallback → trang vỡ. |
| 2 | 🔴 | **Boilerplate Vite lọt vào production.** `main.tsx:1` import `./index.css` → `body{display:flex;place-items:center}` không bị ghi đè (đã xác nhận trong `dist/assets/*.css`). `src/App.css` mồ côi hoàn toàn. |
| 3 | 🟠 | **~630 dòng CSS chết** (~25%): `option-slider__*`, `portfolio-navrow*`, `portfolio-carousel*`, `portfolio-footer`, `experience-metrics*`, `experience-bento*`, `code-showcase*`, `hscroll-carousel*`, `bento-hero-grid`, `bento-grid-2col`. |
| 4 | 🟠 | **Selector trùng** do script tách file: `.portfolio-header__right` ×2, `.portfolio-header__cv-button` ×2 (style mâu thuẫn), `.portfolio-navrow-*` ×2. `_leftovers.scss` = 967 dòng (37% CSS) là thùng rác. |
| 5 | 🟠 | `_variable.scss` (số ít) mồ côi, giá trị **khác** `_variables.scss` — bẫy import nhầm. |
| 6 | 🟠 | **Breakpoint không nhất quán:** mixin `respond-to` chỉ dùng 3 lần, còn 11 media query magic number (346/375/639/720/800/1100/1024px). `.bento-projects-grid` chồng biên tại đúng 1024px (`min-width:1024` vs `max-width:1024`). |
| 7 | 🟠 | **`/api/ai-assistant` không được phục vụ trên Vercel.** `vercel.json` khai báo `builds` tường minh → tắt auto-detect thư mục `api/`; route `/(.*)` đẩy hết về static. Widget luôn rơi vào fallback cục bộ trừ khi set `VITE_AI_API_URL`. |
| 8 | 🟡 | **0 style `:focus`/`:focus-visible`** trong `src/styles/`. Focus ring duy nhất đến từ `index.css` boilerplate — sửa #2 sẽ mất hẳn keyboard navigation. |
| 9 | 🟡 | Không có `prefers-reduced-motion`. `backdrop-filter` đặt trên `.tech-chip` (render hàng chục lần) — nặng trên mobile. `transition: all` ×15. |
| 10 | 🟡 | 5 component mồ côi (§5). `SectionId` có `'contact'` nhưng không có section tương ứng. |
| 11 | 🟡 | `yarn` nằm trong `dependencies` (sai chỗ) + tồn tại cả `package-lock.json` lẫn `yarn.lock`. |
| 12 | 🟡 | Script one-off `split-scss.cjs`, `fix-imports.cjs` vẫn ở root; `fix-imports.cjs` xoá dòng `@use` — chạy lại sẽ **hỏng** build. |
| 13 | 🟡 | i18n mới phủ 10 key; phần lớn UI hard-code tiếng Việt. |
| 14 | 🟡 | `.agents/skills/portfolio-expert/SKILL.md` nằm sai path (không phải `.claude/skills/`) nên có thể không được nạp, và nội dung khẳng định light theme tồn tại — **sai** so với code. |

---

## 10. Lệch so với react pack của skillrunner

Pack rules mà `sr emit` nạp được viết cho một dự án khác (hệ `@ghm`). **Không áp dụng cho repo này:**

| Pack yêu cầu | Thực tế repo này |
|---|---|
| `src/api/{resource}.ts → handler.tsx → index.tsx` | Module theo domain, không tách handler/view |
| TanStack Query (`useCustomQuery`) | Không có react-query — dữ liệu tĩnh |
| Tailwind + design token `@ghm` | SCSS thuần + BEM + Sass variables |
| CASL `ability.can()` | Không có auth/permission |
| React Hook Form + validation | Không có form |
| `react-router-dom` | Không có router (§4.1) |
| i18next | i18n tự viết |
| `docs/reference/libraries/` | Không tồn tại |
| exceljs, tanstack-table | Không cài |

➡️ Khi chạy skill khác (`build-ui`, `scaffold-data`, `scaffold-screen`, `gen-routes`) trong repo này, **ưu tiên convention thật ở §3/§6/§8**, và báo người dùng nếu skill đòi hạ tầng không tồn tại. Riêng `gen-routes` hiện **không áp dụng được** vì chưa có routing.

---

## 11. Nhắc nhanh cho phiên sau

- Thêm khối mới → bọc `<Section>`, thêm entry vào mảng `sections` trong `App.tsx`, thêm `SectionId` + nav item trong `Header.tsx`.
- Thêm project → sửa `src/modules/projects/data/projects.ts` (type `Project`).
- Sửa nội dung CV → `src/content/cv_v1.parsed.ts` (`CV_V1.md` chỉ là bản gốc để tham chiếu).
- Style mới → thêm file `src/styles/components/_x.scss` + `@use` trong `main.scss`; mở đầu bằng `@use '../variables' as *;`.
- Đổi version CV/structure → phải sửa **đồng thời** `portfolio.config.json` và `src/config/portfolioModules.ts`, nếu không app crash lúc boot.
- Luôn chạy `npm run ci` trước khi báo xong.
