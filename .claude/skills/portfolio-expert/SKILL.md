---
name: Portfolio Development Expert
description: Guidelines and architectural context for maintaining the Nguyễn Thế Phong Mobile Portfolio. Trigger this when modifying the portfolio's UI, SCSS theme, or the AI Assistant backend.
---

# 🚀 Portfolio Architecture & Guidelines

When working on this repository, you must adhere to the following architecture and style principles to ensure code quality and a premium user experience.

## 1. Theme System (Dark / Light Mode)
The portfolio uses a CSS Custom Properties (Variables) approach for its theme.
- The base variables are defined in `src/styles/_layout.scss` under `:root[data-theme='dark']` and `:root[data-theme='light']`.
- **CRITICAL:** When adding new UI components in `src/styles/_portfolio.scss`, NEVER hardcode literal Dark Mode colors (e.g. `rgba(15, 23, 42, 0.9)`). Always map them to a CSS Variable like `var(--item-bg)` or `var(--card-bg)`.
- **Animations:** When applying CSS `:hover` animations involving `transform: translateY()`, ensure you don't fight with `transition: all`. Separate the transition properties (e.g., `transition: transform 0.25s`) and apply `@keyframes` to a `::before` pseudo-element to avoid infinite jitter loops.

## 2. Bento Grid Layout
The layout uses a CSS Grid approach (`.bento-projects-grid`, `.bento-hero-grid`).
- When defining rows containing cards that can expand (like the Project Details toggle), ALWAYS use `align-items: start;` on the grid container. This prevents sibling cards in the same row from stretching vertically when one card expands.

## 3. AI Assistant Widget (Serverless Architecture)
The AI chat widget (`src/modules/ai/AiAssistantWidget.tsx`) relies on a Vercel Serverless Function.
- **Frontend (GitHub Pages):** The frontend is hosted statically on GitHub Pages. It CANNOT store API keys. It calls `VITE_AI_API_URL`. If the fetch fails (due to CORS, downtime, or missing environment variables), the widget MUST fallback gracefully using `buildLocalFallback()` to answer based on hardcoded keywords (e.g., Eatsy, exp, native).
- **Backend (Vercel):** The API route is at `api/ai-assistant.ts`. It securely handles the `GEMINI_API_KEY` and adds the System Prompt context before calling the LLM. It includes CORS headers specifically allowing the GitHub Pages domain to fetch data.

## 4. Coding Standards
- **TypeScript:** Strict typing is enforced. Use explicit interfaces for props and states.
- **SCSS:** Use the BEM methodology for naming classes (e.g., `.project-card__title`).
- **Dependencies:** Avoid adding heavy libraries. Prefer native CSS/SCSS and Framer Motion for animations.

---
**Note to Claude/Gemini:** Always verify the Theme Variables in `_layout.scss` before styling a new component, and test how it behaves under both data-theme='dark' and data-theme='light'.
