## Cấu trúc portfolio React + SASS (V1)

**Mục tiêu:**

- Tách biệt rõ ràng giữa: thông tin người dùng, nội dung CV, danh sách dự án (Eatsy), layout chung.
- Dễ mở rộng cho các version sau (CV_V2, cấu trúc V2, thêm project).
- Phù hợp deploy trên Vercel (Vite + React).

---

### 1. Thư mục nguồn chính

- `src/main.tsx`: Entry React, mount vào `#root`.
- `src/App.tsx`: Layout/root component, chỉ đóng vai trò router/layout nhẹ, không chứa logic CV chi tiết.
- `src/styles/`: Chứa toàn bộ SASS
  - `src/styles/main.scss`: File SASS chính, import các partial/module.
  - `src/styles/_variables.scss`: Biến màu sắc, spacing, font.
  - `src/styles/_layout.scss`: Các style layout chung (container, grid, section).
  - `src/styles/_typography.scss`: Style cho heading, paragraph, list.
  - `src/styles/_portfolio.scss`: Style riêng cho portfolio page.

---

### 2. Module theo domain

- `src/modules/user/`
  - `UserProfile.tsx`: Hiển thị phần giới thiệu bản thân ngắn, avatar, title (Fresher React Native Developer).
  - `UserMeta.tsx`: Thông tin cơ bản (địa điểm, năm kinh nghiệm, contact) — có thể để placeholder nếu chưa có.

- `src/modules/cv/`
  - `CvSection.tsx`: Component generic để render một section CV (title + content).
  - `CvSkills.tsx`: Render phần **Kỹ năng chuyên môn** từ dữ liệu cấu trúc.
  - `CvExperience.tsx`: Render phần **Kinh nghiệm làm việc** (Eatsy JSC).
  - `CvProjects.tsx`: Render phần **Dự án** trong CV (Eatsy).
  - `CvGoals.tsx`: Render phần **Mục tiêu** (ngắn hạn, dài hạn).
  - `CvEducation.tsx`: Render phần **Học vấn**.
  - `CvHobbies.tsx`: Render phần **Sở thích**.
  - **Lưu ý:** Các component này **không** chứa text hard-code dài; text sẽ lấy từ layer dữ liệu (`src/content`).

- `src/modules/projects/`
  - `ProjectCard.tsx`: Card hiển thị 1 project (tên, mô tả, tech stack, link).
  - `ProjectsList.tsx`: Danh sách các project, trong đó có **Eatsy** là project chính.
  - `data/projects.ts`: Dữ liệu cấu trúc cho các project (Eatsy và các project khác nếu thêm sau này).

- `src/modules/layout/`
  - `PageLayout.tsx`: Layout chung cho portfolio (header, main, footer).
  - `Header.tsx`: Tên, role, navigation (CV / Projects / Contact).
  - `Footer.tsx`: Copyright, link mạng xã hội (placeholder).
  - `Section.tsx`: Wrapper section dùng lại (title + description + children).

---

### 3. Layer dữ liệu (content)

- `src/content/CV_V1.md`: Nội dung CV thô, đúng như user cung cấp (dùng cho đọc tham chiếu, hiển thị raw nếu cần).
- `src/content/cv_v1.parsed.ts`:
  - Chuyển nội dung CV V1 thành cấu trúc TypeScript để dễ render:
    - `intro`
    - `skills` (mobile, state/data, auth/integration, performance, tools)
    - `experience` (Eatsy)
    - `project` (Eatsy)
    - `goals` (shortTerm, longTerm)
    - `education`
    - `hobbies`
  - File này sẽ là **nguồn dữ liệu chính** cho các module trong `src/modules/cv/`.

---

### 4. File cấu hình / “hợp đồng” module

- `portfolio.config.json` (root project):
  - `cvVersion`: `"CV_V1"`
  - `structureVersion`: `"PROJECT_STRUCTURE_V1"`
  - `modules`: danh sách module bắt buộc có: `user`, `cv`, `projects`, `layout`
  - `contentFiles`: đường dẫn tới `src/content/CV_V1.md` và `src/content/cv_v1.parsed.ts`

- `src/config/portfolioModules.ts`:
  - Export type `PortfolioModuleId = 'user' | 'cv' | 'projects' | 'layout'`
  - Hàm `assertPortfolioConfig()` đọc `portfolio.config.json` (import statically) và đảm bảo:
    - `cvVersion === 'CV_V1'`
    - `structureVersion === 'PROJECT_STRUCTURE_V1'`
    - Đủ module id như định nghĩa type.
  - App khi khởi tạo (`App.tsx`) sẽ gọi `assertPortfolioConfig()` một lần để “check hợp đồng” giữa cấu trúc, CV và module.

**Nguyên tắc:**

1. **User module** không render chi tiết CV, chỉ show profile ngắn.
2. **CV module** chỉ dùng dữ liệu từ `cv_v1.parsed.ts`, không hard-code text dài trong component.
3. **Projects module** dùng dữ liệu từ `data/projects.ts`; trong đó project Eatsy sẽ tái sử dụng thông tin từ CV V1 khi phù hợp.
4. Tất cả style viết bằng SASS trong `src/styles`, không trộn CSS lẻ tẻ trong component.

---

### 5. App.tsx (root composition)

`App.tsx` sẽ:

- Import global SASS: `import './styles/main.scss'`
- Sử dụng `PageLayout` để bọc toàn bộ.
- Render cấu trúc cơ bản:
  - `Header`
  - `Section` cho:
    - Giới thiệu nhanh (`UserProfile`)
    - CV chi tiết (`CvSkills`, `CvExperience`, `CvProjects`, `CvGoals`, `CvEducation`, `CvHobbies`)
    - Dự án (`ProjectsList`) — highlight Eatsy
  - `Footer`

Không để lại code default của Vite (count button, logo, ...).

---

### 6. Ghi chú cho các version sau

- Khi có **CV_V2**:
  - Tạo `src/content/CV_V2.md`
  - Tạo `src/content/cv_v2.parsed.ts`
  - Cập nhật `portfolio.config.json` với `cvVersion: "CV_V2"`.
- Khi thay đổi cấu trúc:
  - Tạo `PROJECT_STRUCTURE_V2.md`
  - Cập nhật `structureVersion` tương ứng.
