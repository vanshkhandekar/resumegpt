import { ModeToggle } from "@/components/theme/ModeToggle";
import { LandingHero } from "@/pages/landing/LandingHero";
import { LandingReportAccordion } from "@/pages/landing/LandingReportAccordion";
import { FloatingAiAssistant } from "@/components/ai/FloatingAiAssistant";
import {
  Menu,
  X,
  FileText,
  LayoutDashboard,
  Plus,
  Shield
} from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src="/logo.png"
              alt="ResumeGPT Logo"
              className="h-12 w-12 object-contain"
            />
            <div className="hidden sm:block">
              <p className="text-xl font-bold text-foreground">ResumeGPT</p>
              <p className="text-xs text-muted-foreground">Professional Resume Builder</p>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-3">
            <a
              href="/create"
              className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-primary-foreground bg-primary transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create Resume
            </a>
            <a
              href="/dashboard"
              className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all bg-muted text-foreground border border-border hover:border-primary"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </a>
            <a
              href="/admin"
              className="flex items-center gap-1 px-4 py-2 font-medium transition-all text-primary hover:underline"
            >
              <Shield className="h-4 w-4" />
              Admin
            </a>
            <div className="ml-2">
              <ModeToggle />
            </div>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg bg-muted text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background p-4">
            <nav className="flex flex-col gap-3">
              <a href="/create" className="px-4 py-3 text-center text-primary-foreground bg-primary rounded-lg font-medium">Create Resume</a>
              <a href="/dashboard" className="px-4 py-3 text-center rounded-lg font-medium bg-muted text-foreground">Dashboard</a>
              <a href="/admin" className="px-4 py-3 text-center font-medium text-primary">Admin Panel</a>
              <ModeToggle />
            </nav>
          </div>
        )}
      </header>

      <main className="px-4 py-8 md:py-12">
        <div className="mx-auto w-full max-w-6xl space-y-16">
          <LandingHero />

          <section aria-label="Project Report" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-primary">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Project Report</h2>
                <p className="text-sm text-muted-foreground">Academic documentation and details</p>
              </div>
            </div>

            <LandingReportAccordion />
          </section>

          <footer className="border border-border rounded-2xl p-8 bg-card/80 backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-xl text-foreground">ResumeGPT</p>
                <p className="text-sm text-muted-foreground">Professional Resume Builder</p>
              </div>
              <div className="flex gap-4">
                <a href="/admin" className="text-primary font-semibold hover:underline">Admin Panel</a>
                <a href="/dashboard" className="text-muted-foreground font-semibold hover:text-foreground">Dashboard</a>
              </div>
              <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Academic project only.</p>
            </div>
          </footer>
        </div>
      </main>

      <FloatingAiAssistant context="ResumeGPT - Professional Resume Builder landing page" enabled />
    </div>
  );
}
