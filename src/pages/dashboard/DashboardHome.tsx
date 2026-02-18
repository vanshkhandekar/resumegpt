import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardHome() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border bg-card p-8">
        <div className="relative">
          <p className="text-sm font-medium text-primary">AI Resume Builder - 100% Free</p>
          <h1 className="mt-2 text-balance text-4xl font-semibold tracking-tight text-foreground">
            Build a recruiter-ready resume in minutes.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Clean editing, smart AI suggestions, live A4 preview, and instant PDF export - all inside AI Resume Studio.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-12 px-6 text-base bg-primary hover:bg-primary/90">
              <Link to="/create">Start Building Resume</Link>
            </Button>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="h-10 rounded-full border-2">
                <Link to="/templates">Templates</Link>
              </Button>
              <Button asChild variant="outline" className="h-10 rounded-full border-2">
                <Link to="/score">Resume Score</Link>
              </Button>
              <Button asChild variant="outline" className="h-10 rounded-full border-2">
                <Link to="/export">Export</Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 text-sm md:grid-cols-3">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              <span className="text-foreground">Live preview while typing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-secondary" />
              <span className="text-foreground">AI help in 3-4 lines</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              <span className="text-foreground">Print-ready A4 PDF</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">What you can do</h2>
            <p className="mt-1 text-muted-foreground">Everything works from the left menu - no locked features.</p>
          </div>
          <Button asChild className="hidden sm:inline-flex bg-primary">
            <Link to="/create">Create Resume</Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Create Resume",
              desc: "Unlimited sections + live preview while typing.",
              cta: "Open Builder",
              href: "/create",
              icon: "📝"
            },
            {
              title: "Templates",
              desc: "Pick a professional template for ATS + design.",
              cta: "Browse",
              href: "/templates",
              icon: "🎨"
            },
            {
              title: "Export",
              desc: "Choose Manual vs AI version, then export A4 PDF.",
              cta: "Export",
              href: "/export",
              icon: "📄"
            },
          ].map((x) => (
            <Card key={x.title} className="bg-card border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{x.icon}</span>
                  <CardTitle className="text-lg text-foreground">{x.title}</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">{x.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full border-2">
                  <Link to={x.href}>{x.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-12 border-t pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">How it works</h2>
        <p className="mt-1 text-muted-foreground">A simple flow that feels like a real SaaS product.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-4">
          {[
            { n: "01", t: "Fill details", d: "Profile, education, projects, experience." },
            { n: "02", t: "Use AI (optional)", d: "Get polished content in 3-4 lines." },
            { n: "03", t: "Pick template", d: "Clean, ATS-friendly formats." },
            { n: "04", t: "Export PDF", d: "Print-ready A4 resume." },
          ].map((s) => (
            <Card key={s.n} className="bg-card">
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-primary/30">{s.n}</p>
                <p className="mt-3 font-medium text-foreground">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why AI Resume Studio */}
      <section className="mt-12 border-t pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Why AI Resume Studio</h2>
        <p className="mt-1 text-muted-foreground">Designed to look premium, built to stay simple.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Professional output</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your resume preview stays clean and formal, so it's ready for internships, placements, and job applications.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Fast editing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Add/remove unlimited entries, reorder sections, and keep a live A4 preview while you type.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border bg-card p-6 md:flex-row md:items-center">
          <div>
            <p className="font-medium text-foreground">Ready to build your resume?</p>
            <p className="text-sm text-muted-foreground">Click the button below or use the left menu - Create Resume.</p>
          </div>
          <Button asChild size="lg" className="h-12 px-7 text-base bg-primary hover:bg-primary/90">
            <Link to="/create">Start Building Resume</Link>
          </Button>
        </div>
      </section>

      <footer className="mt-12 border-t py-10">
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-foreground">AI Resume Studio - Professional Resume Builder</p>
          <p className="text-muted-foreground">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
