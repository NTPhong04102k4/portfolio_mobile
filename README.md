# Nguyễn Thế Phong — Mobile Developer Portfolio

This is the personal portfolio of Nguyễn Thế Phong, a Middle Mobile Developer specializing in React Native, Flutter, and Native Modules (Swift/Kotlin). The portfolio is designed as an interactive, AI-first resume featuring an intelligent AI Assistant and a Bento Grid layout.

## ✨ Key Features
- **Bento Grid Architecture**: Modern, highly-responsive grid layout.
- **Dark/Light Theme**: Sleek toggleable theme system built with pure SCSS and CSS Custom Properties.
- **AI Assistant Widget**: A built-in chat widget powered by a Serverless Backend (Vercel + Gemini API) allowing recruiters to interactively ask questions about the CV. Features robust local fallbacks for static hosting.
- **Cross-Platform Compatibility**: Fully automated CI/CD pipeline targeting GitHub Pages with Node 22 LTS.

## 🛠️ Tech Stack
- **Framework**: React 18, Vite
- **Styling**: SCSS (BEM methodology), Framer Motion
- **Tooling**: ESLint, Prettier, TypeScript
- **Backend (Serverless)**: Vercel Edge API + Google Gemini SDK
- **CI/CD**: GitHub Actions, Docker (multi-stage)

## 🚀 Getting Started

### 1. Run Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Deployment (GitHub Pages & Vercel)
This project is configured to deploy the Frontend to GitHub Pages and the AI Backend to Vercel.
- **Frontend**: Commits to `main` automatically trigger GitHub Actions to deploy to GitHub Pages.
- **AI Backend**: Connect the repo to Vercel. Set `GEMINI_API_KEY` in Vercel settings. Update `.env` with `VITE_AI_API_URL=<vercel-url>/api/ai-assistant` so the frontend can call the AI.

## 👨‍💻 About Me
- **Experience**: 3 Years in Mobile Development.
- **Key Projects**: Eatsy (800k+ downloads), CredHR.
- **Focus**: Performance optimization (FlatList, Native Code integration), UI/UX animations, and AI-driven workflows.
