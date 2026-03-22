<div align="center">
  <img src="public/favicon.svg" alt="AI Resume Studio Logo" width="120" />

  <h1 align="center">AI Resume Studio</h1>

  <p align="center">
    <strong>The Enterprise-Grade, Cloud-Native Resume Builder & Applicant Tracking System (ATS) Analyzer</strong>
    <br />
    Craft standout resumes in minutes utilizing context-aware AI, premium typography, and real-time semantic scoring.
  </p>

  <p align="center">
    <a href="https://github.com/vanshkhandekar/resumegpt/stargazers"><img src="https://img.shields.io/github/stars/vanshkhandekar/resumegpt?color=blue&style=for-the-badge" alt="Stars" /></a>
    <a href="https://github.com/vanshkhandekar/resumegpt/network/members"><img src="https://img.shields.io/github/forks/vanshkhandekar/resumegpt?color=blue&style=for-the-badge" alt="Forks" /></a>
    <a href="https://github.com/vanshkhandekar/resumegpt/issues"><img src="https://img.shields.io/github/issues/vanshkhandekar/resumegpt?color=blue&style=for-the-badge" alt="Issues" /></a>
    <a href="https://github.com/vanshkhandekar/resumegpt/blob/master/LICENSE"><img src="https://img.shields.io/github/license/vanshkhandekar/resumegpt?color=blue&style=for-the-badge" alt="License" /></a>
  </p>
</div>

---

## 📸 Platform Showcase

### 1. High-Converting SaaS Landing Page
![Landing Page](public/screenshots/landing_ui.png)
*Designed with modern Glassmorphism, tailored for max conversion with a clear value proposition.*

### 2. Centralized User Dashboard
![Dashboard](public/screenshots/dashboard_ui.png)
*A secure, cloud-synced dashboard tracking resource usage (Tokens/Credits) with quick-action resume cards.*


## 🚀 Core Features

- **Context-Aware Semantic Assistant** — Unlike generic wrappers, our Engine receives your entire resume payload, asking sequential questions to generate perfectly tailored, ATS-optimized bullet points.
- **Enterprise SaaS Architecture** — Decoupled frontend (React/Vite) from serverless execution (Supabase/Edge Functions) ensuring zero client-side credential exposure.
- **Cloud Auto-Save Infrastructure** — Debounced background sync pushes your localized document states to the cloud seamlessly, guarding against accidental refreshing or network drops.
- **Dual-Pane Live Compiler** — A 60 FPS real-time rendering engine. Edit your raw data on the left panel while watching the A4-scaled PDF update instantaneously on the right.
- **Algorithmic ATS Scoring** — A built-in semantic rule-engine measuring keyword density, action-verb usage, quantifiable metrics, and overall structural integrity.

## 🛠️ Technology Stack

| Architecture Layer | Core Technologies | Description |
|-------------------|-------------------|-------------|
| **Frontend Framework** | React 18, Vite | High-performance SPA with fast HMR |
| **State & Fetching** | React Query, Zustand | Deterministic state management & caching |
| **UI Ecosystem** | Tailwind CSS, Shadcn/UI | Highly accessible, highly customizable aesthetic |
| **Backend & Cloud DB** | Supabase, PostgreSQL | Secure RLS policies, Auth authentication |
| **Serverless Compute** | Deno Edge Functions | API routing, prompt sanitization, rate-limiting |
| **Export Engine** | Custom DOM-to-PDF | Precision A4 printing retaining CSS specificities |

## 📂 System Architecture

The repository enforces a strict domain-driven design structure:

```text
/ai-resume-studio
 ├── /frontend
 │   ├── /components    # Atomic React functional components (modals, inputs, layout)
 │   ├── /pages         # Route-level views (Dashboard, ResumeBuilder)
 │   ├── /hooks         # Domain-specific logic (`useAutoSave`, `useResumes`)
 │   └── /utils         # Constants, validation schemas, global helpers
 ├── /backend
 │   └── /functions     # Severless entry points (AI inference, payment webhooks)
 ├── /database
 │   └── /migrations    # Version-controlled SQL schema definitions & RLS
 └── /docs              # Technical roadmaps and architectural decisions
```

## 🏁 Quick Start Guide

### 1. Clone the Source
```bash
git clone https://github.com/vanshkhandekar/resumegpt.git
cd resumegpt
```

### 2. Environment Setup
Rename `.env.example` to `.env` and inject your infrastructure keys:
```env
VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

### 3. Install & Launch
```bash
npm install
npm run dev
```
The client will securely bind to local port.

## 🤝 Contributing & Long-term Vision

AI Resume Studio aims to be the defacto open-source standard for algorithmic career development.
We actively welcome Pull Requests focusing on:
1. Addition of new distinct, LaTeX-quality CSS template designs.
2. Enhancements to the semantic ATS rule-engine.
3. Automated Unit Testing coverage (Vitest / Playwright).

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  <i>Engineered for the Modern Professional. Built by <a href="https://github.com/vanshkhandekar">Vansh Khandekar</a> & Team.</i>
</div>
