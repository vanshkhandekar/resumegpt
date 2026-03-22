# ResumeGPT

![ResumeGPT](https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3)

**ResumeGPT** is a professional, open-source resume builder that helps job seekers create ATS-friendly, polished resumes in minutes. Built with React, TypeScript, and modern web technologies — it offers smart writing assistance, real-time preview, and instant PDF export.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)

## 🚀 Features

- **Smart Writing Assistant** — Generate professional summaries and bullet points with intelligent suggestions.
- **ATS-Friendly Templates** — 20+ professionally designed templates optimized for Applicant Tracking Systems.
- **Real-Time Preview** — See your changes instantly as you type with live A4 preview.
- **Resume Score** — Get instant feedback on your resume's strength and ATS compatibility.
- **PDF Export** — High-quality, watermark-free PDF downloads ready for printing.
- **Data Privacy** — Your data stays in your browser. No tracking, no ads.
- **Modern UI** — Clean, minimal, and responsive interface built with Shadcn UI and Tailwind CSS.
- **Dark Mode** — Full dark/light theme support.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Shadcn UI, Lucide React |
| State | React Query, React Hook Form |
| Backend | Supabase (Auth, Database, Edge Functions) |
| AI Integration | Google Gemini API |
| Routing | React Router DOM v6 |
| PDF Engine | jsPDF |

## 📂 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ai/           # Smart assistant widget
│   ├── app/          # Sidebar, layout
│   ├── admin/        # Admin panel components
│   ├── resume/       # Resume-specific components
│   ├── theme/        # Dark/light mode
│   └── ui/           # Shadcn UI primitives
├── hooks/            # Custom React hooks
├── integrations/     # Supabase client & types
├── lib/              # Utilities & storage
├── pages/            # Route pages
│   ├── dashboard/    # Builder, Templates, Score, Export
│   └── landing/      # Landing page sections
└── test/             # Test utilities
```

## 🏁 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/vanshkhandekar/resumegpt.git
cd resumegpt

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your Supabase URL and anon key

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Vercel auto-detects the Vite configuration.
4. Add environment variables in Vercel project settings.
5. Deploy!

### Deploy to Netlify

1. Connect your GitHub repo to [Netlify](https://netlify.com).
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables.
5. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

*Built by [Vansh Khandekar](https://github.com/vanshkhandekar) & Team*
