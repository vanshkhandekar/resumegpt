import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Target,
  Lightbulb,
  Users,
  Code,
  CheckCircle,
  GraduationCap,
  Building2
} from "lucide-react";

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="bg-muted/30 border-primary/20 dark:border-primary/30">
      <CardContent className="p-5 md:p-6">{children}</CardContent>
    </Card>
  );
}

export function LandingReportAccordion() {
  return (
    <section aria-label="Project report sections">
      <Accordion type="single" collapsible className="space-y-4">
        <AccordionItem value="project-details" className="rounded-2xl border bg-card px-4 border-primary/25 dark:border-primary/35">
          <AccordionTrigger className="py-4 text-left hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary dark:text-primary" />
              </div>
              <span className="font-semibold">Project Details</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionCard>
              <dl className="grid gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs bg-gradient-to-r from-primary to-secondary">Project Name</Badge>
                  <dd className="font-medium">ResumeGPT (Professional Resume Builder)</dd>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary dark:text-primary" />
                    <div>
                      <dt className="text-muted-foreground text-xs">Class</dt>
                      <dd className="font-medium">BCA 3rd Year</dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary dark:text-primary" />
                    <div>
                      <dt className="text-muted-foreground text-xs">College</dt>
                      <dd className="font-medium">Janaprabha College, Ramtek</dd>
                    </div>
                  </div>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs mb-2">Team Members</dt>
                  <dd className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { name: "Vansh Khandekar", role: "Team Leader" },
                      { name: "Shubham Chandekar", role: "Developer" },
                      { name: "Rahul Yenurkar", role: "Designer" },
                      { name: "Pranay Mende", role: "Researcher" }
                    ].map((member) => (
                      <div key={member.name} className="rounded-lg border border-primary/25 dark:border-primary/35 bg-primary/10 dark:bg-primary/15 p-3">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    ))}
                  </dd>
                </div>
              </dl>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="abstract" className="rounded-2xl border bg-card px-4 border-primary/25 dark:border-primary/35">
          <AccordionTrigger className="py-4 text-left hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-primary dark:text-primary" />
              </div>
              <span className="font-semibold">Abstract</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionCard>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This project focuses on the development of an AI-based Resume Maker that helps users create professional resumes
                efficiently. The system collects user details and generates structured resumes with AI-assisted content
                improvement. It provides an intuitive interface for students and job seekers to build ATS-friendly resumes
                quickly and effectively.
              </p>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="introduction" className="rounded-2xl border bg-card px-4 border-primary/25 dark:border-primary/35">
          <AccordionTrigger className="py-4 text-left hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary dark:text-primary" />
              </div>
              <span className="font-semibold">Introduction</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionCard>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A resume is a key document for internships, placements, and job applications. Many students find it difficult to
                create a strong resume because they are unsure about the right format, what to include, and how to describe their
                skills and work clearly. ResumeGPT solves this by guiding users to enter details step-by-step and using AI
                assistance to improve the wording and structure. This makes resume creation faster, simpler, and more
                professional.
              </p>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="objectives" className="rounded-2xl border bg-card px-4 border-primary/25 dark:border-primary/35">
          <AccordionTrigger className="py-4 text-left hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <Target className="h-4 w-4 text-primary dark:text-primary" />
              </div>
              <span className="font-semibold">Objectives</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionCard>
              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: CheckCircle, text: "Easy resume creation" },
                  { icon: CheckCircle, text: "AI-assisted content improvement" },
                  { icon: CheckCircle, text: "Professional formatting" },
                  { icon: CheckCircle, text: "Time-saving solution" },
                  { icon: CheckCircle, text: "User-friendly interface" },
                  { icon: CheckCircle, text: "ATS-optimized templates" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-lg border border-primary/25 dark:border-primary/35 bg-primary/10 dark:bg-primary/15 px-4 py-3">
                    <item.icon className="h-4 w-4 text-primary dark:text-primary shrink-0" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="workflow" className="rounded-2xl border bg-card px-4 border-primary/25 dark:border-primary/35">
          <AccordionTrigger className="py-4 text-left hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary dark:text-primary" />
              </div>
              <span className="font-semibold">Process / Workflow</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionCard>
              <div className="grid gap-4 md:grid-cols-5">
                {[
                  { step: "1", title: "User enters details", desc: "Fill in personal info" },
                  { step: "2", title: "System structures", desc: "Organizes content" },
                  { step: "3", title: "AI enhances", desc: "Improves wording" },
                  { step: "4", title: "User reviews", desc: "Make corrections" },
                  { step: "5", title: "Export PDF", desc: "Download resume" }
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 rounded-xl border border-primary/25 dark:border-primary/35 bg-primary/10 dark:bg-primary/15">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-bold">{item.step}</span>
                    </div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tools" className="rounded-2xl border bg-card px-4 border-primary/25 dark:border-primary/35">
          <AccordionTrigger className="py-4 text-left hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <Code className="h-4 w-4 text-primary dark:text-primary" />
              </div>
              <span className="font-semibold">Development Tools</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionCard>
              <div className="flex flex-wrap gap-2">
                {[
                  "React", "TypeScript", "Vite", "Tailwind CSS",
                  "Shadcn UI", "OpenRouter", "jsPDF", "Claude 3 Opus"
                ].map((tool) => (
                  <Badge key={tool} className="px-3 py-1 text-sm bg-gradient-to-r from-primary to-secondary">{tool}</Badge>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-primary/25 dark:border-primary/35">
                <p className="text-sm text-muted-foreground">
                  Built with modern web technologies for a fast, responsive experience.
                </p>
              </div>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="conclusion" className="rounded-2xl border bg-card px-4 border-primary/25 dark:border-primary/35">
          <AccordionTrigger className="py-4 text-left hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-primary dark:text-primary" />
              </div>
              <span className="font-semibold">Conclusion</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <SectionCard>
              <p className="text-sm leading-relaxed text-muted-foreground">
                ResumeGPT demonstrates how AI can simplify resume building. The system helps students and job seekers
                create professional resumes quickly and efficiently. Future enhancements may include multiple templates,
                job-based suggestions, and integration with more AI services.
              </p>
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
