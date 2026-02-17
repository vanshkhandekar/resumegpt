import { ArrowRight, BriefcaseBusiness, LayoutDashboard, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function LandingHero() {
  const features = [
    { title: "AI Assistance", desc: "Get AI-powered suggestions to improve your resume.", icon: "✨" },
    { title: "Professional Templates", desc: "Choose from 20+ polished layouts.", icon: "📄" },
    { title: "Easy Export", desc: "Download print-ready PDF in one click.", icon: "📥" },
    { title: "ATS Optimized", desc: "Structure designed for ATS-friendly parsing.", icon: "✅" },
    { title: "Fast Creation", desc: "Build a complete resume in under 10 minutes.", icon: "⚡" },
    { title: "For Students", desc: "Made for students, freshers, and internships.", icon: "🎓" },
  ];

  const team = [
    { initials: "VK", name: "Vansh Khandekar", role: "Team Leader" },
    { initials: "SC", name: "Shubham Chandekar", role: "Developer" },
    { initials: "RY", name: "Rahul Yenurkar", role: "Designer" },
    { initials: "PM", name: "Pranay Mende", role: "Researcher" },
  ];

  return (
    <div className="space-y-12">
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary via-primary/90 to-secondary text-white shadow-lg shadow-primary/20">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -bottom-14 -left-14 h-44 w-44 rounded-full bg-cyan-200/50 blur-3xl" />
        </div>
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Janaprabha College, Ramtek</h2>
                <p className="text-lg text-white/90 font-medium">BCA 3rd Year • Academic Project 2025-26</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {team.map((member) => (
                <div key={member.name} className="flex items-center gap-2 rounded-full border border-white/35 bg-white/20 px-4 py-2 backdrop-blur">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary font-bold text-sm">{member.initials}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{member.name}</p>
                    <p className="text-xs text-white/80">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <header className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/85 shadow-lg backdrop-blur">
        <div className="absolute inset-0 opacity-35">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="relative p-8 md:p-12 lg:p-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                AI-Powered Resume Builder
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-foreground">
              Build Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Professional Resume</span> in Minutes
            </h1>

            <p className="mt-4 max-w-2xl text-lg md:text-xl text-muted-foreground">
              Create stunning, ATS-friendly resumes with AI assistance. Stand out from the crowd and land your dream job.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="/create" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a href="/dashboard" className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background/80 px-8 font-semibold text-foreground transition-colors hover:bg-muted/70">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </a>
              <a href="/admin" className="inline-flex h-12 items-center justify-center rounded-lg px-8 font-semibold text-primary hover:text-primary/80">
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </a>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background/80 px-8 font-semibold text-foreground transition-colors hover:bg-muted/70">
                    Project Details
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Project Details</DialogTitle>
                    <DialogDescription>Academic evaluation snapshot</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 text-sm">
                    <div><span className="font-semibold">Project Title:</span> ResumeGPT - AI Resume Builder</div>
                    <div><span className="font-semibold">Course:</span> BCA 3rd Year Major Project</div>
                    <div><span className="font-semibold">Group Members:</span> Vansh Khandekar, Shubham Chandekar, Rahul Yenurkar, Pranay Mende</div>
                    <div><span className="font-semibold">Problem Statement:</span> Students struggle to create ATS-friendly professional resumes quickly.</div>
                    <div><span className="font-semibold">Solution Overview:</span> Guided form + AI writing assistant + template system + PDF export + resume scoring.</div>
                    <div><span className="font-semibold">Key Features:</span> Live preview, multiple templates, AI suggestions, score analysis, admin controls.</div>
                    <div><span className="font-semibold">Future Scope:</span> Job-role matching, keyword optimization, interview preparation assistant.</div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <section aria-label="Features">
        <h2 className="mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">Why Choose ResumeGPT?</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card/80 p-6 transition-colors hover:border-primary/60">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg text-foreground">{item.title}</h3>
              <p className="text-muted-foreground mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Stats" className="grid gap-6 sm:grid-cols-3">
        {[
          { label: "Templates Available", value: "20+" },
          { label: "AI-Powered", value: "Yes" },
          { label: "PDF Export", value: "✓" }
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-border bg-card/80 p-6 text-center">
            <p className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-extrabold text-transparent">{stat.value}</p>
            <p className="text-foreground mt-2 font-semibold">{stat.label}</p>
          </div>
        ))}
      </section>

      <section aria-label="Templates Preview">
        <h2 className="mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">Templates Preview</h2>
        <div className="grid gap-4 md:grid-cols-5">
          {["Clean", "Professional", "ATS-friendly", "Modern", "Two-column"].map((name) => (
            <Card key={name} className="bg-card/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-20 rounded-md border bg-muted/40" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-label="AI and Score Preview" className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">AI Assistant Preview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Floating assistant helps generate summary, improve experience lines, suggest skills, and give resume tips.
          </CardContent>
        </Card>
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-base">Resume Score Preview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            AI-powered score out of 100 with section analysis and actionable improvement suggestions.
          </CardContent>
        </Card>
      </section>

      <section aria-label="Quick Links">
        <h2 className="mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a href="/admin" className="block">
            <div className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card/80 p-5 transition-colors hover:border-primary/60">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Shield className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-bold text-xl text-foreground">Admin Panel</p>
                  <p className="text-muted-foreground">Manage settings</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
          </a>
          <a href="/dashboard" className="block">
            <div className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card/80 p-5 transition-colors hover:border-primary/60">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <BriefcaseBusiness className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-bold text-xl text-foreground">Dashboard</p>
                  <p className="text-muted-foreground">View resumes</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
