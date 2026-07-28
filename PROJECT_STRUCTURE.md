# Cấu trúc thư mục dự án Portfolio (React + Vite + SASS)

Tài liệu mô tả cấu trúc thư mục và vai trò từng phần, dùng cho phát triển và bảo trì sau này.

---

## 1. Cây thư mục (chỉ phần nguồn)

```
c:\my-app\
├── index.html
├── package.json
├── vercel.json
├── portfolio.config.json
├── PROJECT_STRUCTURE.md          ← file này
├── PROJECT_STRUCTURE_V1.md       ← bản mô tả cũ (tham khảo)
│
└── src/
    ├── main.tsx                  # Entry React, mount #root
    ├── App.tsx                    # Root: ThemeProvider, I18nProvider, InnerApp (sections + carousel)
    ├── index.css                  # Global CSS (nếu dùng)
    ├── App.css                    # (có thể bỏ nếu dùng SASS)
    │
    ├── config/
    │   └── portfolioModules.ts    # assertPortfolioConfig(), type PortfolioModuleId, đọc portfolio.config.json
    │
    ├── content/
    │   ├── CV_V1.md               # Nội dung CV thô (tham chiếu)
    │   └── cv_v1.parsed.ts        # Dữ liệu CV cấu trúc (intro, skills, experience, project, goals, education, hobbies)
    │
    ├── theme/
    │   └── ThemeContext.tsx       # ThemeProvider, useTheme(), dark/light, lưu localStorage (portfolio_theme)
    │
    ├── i18n/
    │   └── I18nContext.tsx       # I18nProvider, useI18n(), t(), lang vi/en, lưu localStorage (portfolio_lang)
    │
    ├── styles/
    │   ├── main.scss              # Entry SASS: @forward variables; @use layout, typography, portfolio
    │   ├── _variables.scss        # Biến: color, radius, spacing, max-width
    │   ├── _layout.scss           # body, portfolio-page, portfolio-main, portfolio-section, breakpoints
    │   ├── _typography.scss       # heading, paragraph, list, link
    │   └── _portfolio.scss        # Header, carousel, nav, blog issues, project cards, contact, responsive
    │
    ├── modules/
    │   ├── layout/
    │   │   ├── PageLayout.tsx     # Bọc: Header + main + Footer, export SectionId
    │   │   ├── Header.tsx         # Brand + theme toggle (Dark/Light) + lang toggle (VI/EN)
    │   │   ├── Footer.tsx         # Copyright, có thể thêm link
    │   │   ├── Section.tsx        # Wrapper section (id, title, subtitle, children)
    │   │   └── HorizontalScrollCarousel.tsx  # Cuộn ngang Framer Motion, useScroll/useTransform, scale/opacity theo vị trí
    │   │
    │   ├── user/
    │   │   └── UserProfile.tsx    # Tên, role, location, intro (dữ liệu từ cv_v1.parsed)
    │   │
    │   ├── cv/
    │   │   ├── AboutMe.tsx        # UserProfile + CvGoals + CvEducation + kỹ năng mềm
    │   │   ├── CvSkills.tsx       # Kỹ năng chuyên môn (nhóm mobile, state, auth, performance, tools)
    │   │   ├── CvExperience.tsx   # Kinh nghiệm Eatsy JSC (features, API, native, testing)
    │   │   ├── CvProjects.tsx     # Block dự án Eatsy (trong CV)
    │   │   ├── CvGoals.tsx        # Mục tiêu ngắn hạn / dài hạn
    │   │   ├── CvEducation.tsx   # Học vấn
    │   │   └── CvHobbies.tsx     # Sở thích
    │   │
    │   ├── projects/
    │   │   ├── data/
    │   │   │   └── projects.ts    # Danh sách project (Eatsy, ...), type Project
    │   │   ├── ProjectCard.tsx    # Card 1 project (title, description, tech, link)
    │   │   └── ProjectsList.tsx  # Grid ProjectCard
    │   │
    │   ├── blog/
    │   │   └── BlogIssues.tsx    # Danh sách “issue” dạng open/close, toggle mở nội dung (JS, FlatList, TextInput, TS, Permissions)
    │   │
    │   └── tech/
    │       └── TechStack.tsx     # Các nhóm công nghệ (Mobile, State, Auth, Backend, Tools) dạng chip
    │
    └── assets/
        └── react.svg
```

---

## 2. Luồng chính trong App

- **App.tsx**: `ThemeProvider` → `I18nProvider` → `InnerApp`.
- **InnerApp**:
  - State: `activeSection` (about | projects | experience | blog | contact).
  - Nguồn text: `t()` từ `useI18n()` cho section title/subtitle.
  - **Chọn section**: `HorizontalScrollCarousel` với 5 item (nút), mỗi nút gọi `setActiveSection(section.id)`.
  - **Nội dung**: Một carousel (viewport + track) render từng `Section` tương ứng `activeSection`; chuyển slide bằng `translateX(-activeIndex * 100%)`, có hiệu ứng 3D (rotateY) cho trang trước/sau.

---

## 3. Config và “hợp đồng” module

- **portfolio.config.json** (root):
  - `cvVersion`, `structureVersion`, `modules`, `contentFiles`.
  - Dùng bởi `assertPortfolioConfig()` trong `src/config/portfolioModules.ts`.
- **portfolioModules.ts**: Kiểm tra đúng version CV/structure và đủ module; App gọi 1 lần khi load.

---

## 4. Style (SASS)

- Toàn bộ style portfolio nằm trong `src/styles/`; component không tự viết CSS file riêng (có thể dùng className).
- Theme dark/light: `_layout.scss` dùng CSS variable theo `data-theme` trên `:root` (đặt bởi ThemeContext).
- Responsive: breakpoints trong `_portfolio.scss` (mobile &lt; 640px, tablet 640–1023px, desktop ≥ 1024px).

---

## 5. Deploy (Vercel)

- **vercel.json**: `builds` với `src: "package.json"`, `distDir: "dist"`.
- **Lệnh**: `yarn build` → `yarn deploy` (hoặc `npx vercel --prod`). Không cần cài Vercel CLI global.

---

## 6. Ghi chú mở rộng sau này

- Thêm section: bổ sung id vào type `SectionId` (PageLayout + App), thêm entry vào mảng `sections` và item tương ứng trong `HorizontalScrollCarousel`.
- CV V2: thêm `CV_V2.md`, `cv_v2.parsed.ts`, cập nhật `portfolio.config.json` và logic đọc content.
- Cấu trúc V2: tạo file mô tả mới (vd. `PROJECT_STRUCTURE_V2.md`) và cập nhật `structureVersion` trong config nếu dùng check.
