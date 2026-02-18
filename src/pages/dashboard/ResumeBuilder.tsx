import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Award, Briefcase, FolderKanban, GraduationCap, Languages, Plus, Trophy, Trash2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { EmptyStateCard } from "@/components/resume/EmptyStateCard";
import { StepProgressHeader } from "@/components/resume/StepProgressHeader";
import { bumpAiUsageMetric, bumpResumeCreatedMetric, bumpTemplateUsageMetric, getActiveApiKey, isTemplateVisible } from "@/lib/demoStorage";

type Education = { school: string; degree: string; year: string };
type Experience = { company: string; role: string; bullets: string };
type Project = { name: string; bullets: string };
type Certification = { name: string; org: string; year: string };

type StepId =
  | "profile"
  | "education"
  | "projects"
  | "skills"
  | "languages"
  | "achievements"
  | "experience"
  | "certs"
  | "templates"
  | "preview";

export default function ResumeBuilder() {
  const { toast } = useToast();

  const [step, setStep] = useState<StepId>("profile");
  const [unlocked, setUnlocked] = useState<Record<StepId, boolean>>({
    profile: true,
    education: false,
    projects: false,
    skills: false,
    languages: false,
    achievements: false,
    experience: false,
    certs: false,
    templates: false,
    preview: false,
  });

  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryAiInput, setSummaryAiInput] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [languages, setLanguages] = useState<string>("");
  const [achievements, setAchievements] = useState<string>("");

  const [aiBusy, setAiBusy] = useState<string | null>(null);

  const [showEducation, setShowEducation] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showSkills, setShowSkills] = useState(true);
  const [showLanguages, setShowLanguages] = useState(true);
  const [showAchievements, setShowAchievements] = useState(true);
  const [showExperience, setShowExperience] = useState(true);
  const [showCerts, setShowCerts] = useState(true);

  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);

  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");

  const templates = useMemo(
    () =>
      [
        // Normal templates - unique designs
        {
          id: "classic", name: "Classic", kind: "normal" as const,
          note: "Traditional ATS-safe layout with center alignment",
          design: "classic" as const
        },
        {
          id: "minimal", name: "Minimal", kind: "normal" as const,
          note: "Clean modern with extra white space",
          design: "minimal" as const
        },
        {
          id: "modern", name: "Modern", kind: "normal" as const,
          note: "Bold headers with section dividers",
          design: "modern" as const
        },
        {
          id: "executive", name: "Executive", kind: "normal" as const,
          note: "Professional with strong hierarchy",
          design: "executive" as const
        },
        {
          id: "twocol", name: "Two-Column", kind: "normal" as const,
          note: "Left sidebar for skills, right for content",
          design: "twocol" as const
        },
        {
          id: "compact", name: "Compact", kind: "normal" as const,
          note: "Fits more content in less space",
          design: "compact" as const
        },
        {
          id: "atspro", name: "ATS Pro", kind: "normal" as const,
          note: "Optimized for resume scanners",
          design: "atspro" as const
        },
        {
          id: "slate", name: "Slate", kind: "normal" as const,
          note: "Soft gray accents with clean look",
          design: "slate" as const
        },
        {
          id: "nimbus", name: "Nimbus", kind: "normal" as const,
          note: "Light separators and subtle styling",
          design: "nimbus" as const
        },
        {
          id: "vertex", name: "Vertex", kind: "normal" as const,
          note: "Sharp geometric section blocks",
          design: "vertex" as const
        },
        // Color templates - with accent colors
        {
          id: "aurora", name: "Aurora", kind: "color" as const,
          note: "Purple gradient header bar",
          design: "aurora" as const, accent: "#8b5cf6"
        },
        {
          id: "metro", name: "Metro", kind: "color" as const,
          note: "Blue section markers",
          design: "metro" as const, accent: "#3b82f6"
        },
        {
          id: "nova", name: "Nova", kind: "color" as const,
          note: "Green accent sidebar",
          design: "nova" as const, accent: "#10b981"
        },
        {
          id: "pulse", name: "Pulse", kind: "color" as const,
          note: "Pink skills with chip styling",
          design: "pulse" as const, accent: "#ec4899"
        },
        {
          id: "orbit", name: "Orbit", kind: "color" as const,
          note: "Orange accent dividers",
          design: "orbit" as const, accent: "#f59e0b"
        },
        {
          id: "colorpop", name: "Color Pop", kind: "color" as const,
          note: "Bold red accents",
          design: "colorpop" as const, accent: "#ef4444"
        },
        {
          id: "elegant", name: "Elegant", kind: "color" as const,
          note: "Indigo accent with lines",
          design: "elegant" as const, accent: "#6366f1"
        },
        {
          id: "creative", name: "Creative", kind: "color" as const,
          note: "Teal modern accent layout",
          design: "creative" as const, accent: "#14b8a6"
        },
        {
          id: "bold", name: "Bold", kind: "color" as const,
          note: "Red high-contrast headings",
          design: "bold" as const, accent: "#dc2626"
        },
        {
          id: "professional", name: "Professional", kind: "color" as const,
          note: "Sky blue accent tags",
          design: "professional" as const, accent: "#0ea5e9"
        },
      ],
    []
  );

  const [order, setOrder] = useState<Array<"education" | "projects" | "skills" | "languages" | "achievements" | "experience" | "certs">>([
    "education",
    "projects",
    "skills",
    "languages",
    "achievements",
    "experience",
    "certs",
  ]);

  const sectionEnabled = useMemo(
    () => ({
      education: showEducation,
      projects: showProjects,
      skills: showSkills,
      languages: showLanguages,
      achievements: showAchievements,
      experience: showExperience,
      certs: showCerts,
    }),
    [showEducation, showProjects, showSkills, showLanguages, showAchievements, showExperience, showCerts],
  );

  const move = (id: (typeof order)[number], dir: -1 | 1) => {
    setOrder((prev) => {
      const i = prev.indexOf(id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const visibleTemplates = useMemo(() => templates.filter((t) => isTemplateVisible(t.id)), [templates]);

  const SectionHeader = ({
    title,
    enabled,
    onEnabledChange,
    onMoveUp,
    onMoveDown,
  }: {
    title: string;
    enabled: boolean;
    onEnabledChange: (v: boolean) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
  }) => (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">Toggle on/off and reorder for preview.</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
          <p className="text-sm text-muted-foreground">Show</p>
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
        <Button variant="outline" size="icon" onClick={onMoveUp} aria-label="Move section up">
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onMoveDown} aria-label="Move section down">
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const steps = useMemo(
    () =>
      [
        { id: "profile" as const, label: "Profile" },
        { id: "education" as const, label: "Education" },
        { id: "projects" as const, label: "Projects" },
        { id: "skills" as const, label: "Skills" },
        { id: "languages" as const, label: "Languages" },
        { id: "achievements" as const, label: "Achievements" },
        { id: "experience" as const, label: "Experience" },
        { id: "certs" as const, label: "Certifications" },
        { id: "templates" as const, label: "Templates" },
        { id: "preview" as const, label: "Preview" },
      ],
    [],
  );

  const currentIndex = steps.findIndex((s) => s.id === step);
  const goTo = (id: StepId) => {
    if (!unlocked[id]) return;
    setStep(id);
  };
  const unlockAndGoNext = () => {
    const next = steps[currentIndex + 1]?.id;
    if (!next) return;
    setUnlocked((p) => ({ ...p, [next]: true }));
    setStep(next);
  };
  const goBack = () => {
    const prev = steps[currentIndex - 1]?.id;
    if (!prev) return;
    setStep(prev);
  };

  const handlePhoto = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ variant: "destructive", title: "Invalid file", description: "Please select an image." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const aiGenerate = async ({
    key,
    prompt,
    onApply,
  }: {
    key: string;
    prompt: string;
    onApply: (text: string) => void;
  }) => {
    setAiBusy(key);
    try {
      const { data, error } = await supabase.functions.invoke("ai-resume-assistant", {
        body: { prompt, context: "Resume writing", apiKey: getActiveApiKey() },
      });
      if (error) throw error;
      const content = String(data?.content || "").trim();
      if (!content) {
        toast({ variant: "destructive", title: "No response", description: "AI did not return any content." });
        return;
      }
      onApply(content);
      bumpAiUsageMetric();
      toast({ title: "AI generated", description: "You can edit it manually too." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "AI error", description: "Failed to generate. Please try again." });
    } finally {
      setAiBusy(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <StepProgressHeader
        title="Resume Builder"
        stepLabel={`Step ${currentIndex + 1} of ${steps.length}`}
        stepText={steps[currentIndex]?.label ?? ""}
        progress={(currentIndex + 1) / steps.length}
      />

      {/* Optional quick jump chips (hidden on mobile to match reference UI) */}
      <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
        {steps.map((s, i) => {
          const active = s.id === step;
          const canOpen = unlocked[s.id];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(s.id)}
              disabled={!canOpen}
              className={
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition " +
                (active
                  ? "bg-muted text-foreground"
                  : canOpen
                    ? "bg-background/40 text-muted-foreground hover:bg-muted/50"
                    : "bg-background/30 text-muted-foreground/60 opacity-60")
              }
            >
              <span className="text-xs font-semibold">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-medium">{s.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="grid gap-6">
          {step === "profile" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm text-muted-foreground">Let's start with your basic details. This information appears at the top of your resume.</p>

                <div className="rounded-xl border border-dashed bg-muted/20 p-5">
                  <div className="grid place-items-center gap-3 text-center">
                    <div className="grid h-16 w-16 place-items-center rounded-full border bg-background">
                      {photoDataUrl ? (
                        <img src={photoDataUrl} alt="Profile" className="h-16 w-16 rounded-full object-cover" />
                      ) : (
                        <UserRound className="h-7 w-7 text-muted-foreground" />
                      )}
                    </div>
                    <div className="grid gap-1">
                      <Button variant="outline" asChild>
                        <label className="cursor-pointer">
                          Upload Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhoto(e.target.files?.[0])}
                            className="sr-only"
                          />
                        </label>
                      </Button>
                      <p className="text-xs text-muted-foreground">Optional · Max 5MB (JPG, PNG)</p>
                    </div>
                  </div>
                </div>

                <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input
                  placeholder="Headline (e.g., BCA Student | Frontend Developer)"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="grid gap-2">
                  <p className="text-sm font-medium">Professional Summary</p>
                  <p className="text-sm text-muted-foreground">
                    Optional: Generate with AI above, or write manually below.
                  </p>

                  {/* AI box */}
                  <div className="grid gap-2 rounded-xl border bg-muted/20 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">Generate with AI</p>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={aiBusy === "summary"}
                        onClick={() =>
                          aiGenerate({
                            key: "summary",
                            prompt:
                              summaryAiInput.trim() ||
                              `Write a professional resume summary in 3–4 lines for: ${name || "a candidate"}. Headline: ${headline}.`,
                            onApply: (t) => setSummary(t),
                          })
                        }
                      >
                        {aiBusy === "summary" ? "Generating..." : "Generate"}
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Enter details for AI (role, skills, goals). Example: BCA student, frontend, HTML CSS JS, fresher, ATS friendly."
                      value={summaryAiInput}
                      onChange={(e) => setSummaryAiInput(e.target.value)}
                      className="min-h-[90px]"
                    />
                    <p className="text-xs text-muted-foreground">Generated content will appear in the box below for editing.</p>
                  </div>

                  {/* Manual box */}
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Write manually</p>
                    <Textarea
                      placeholder="Professional Summary (2–4 lines)"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">Write directly here if you prefer manual entry.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {step === "education" ? (
            <Card>
              <CardHeader>
                <SectionHeader
                  title="Education"
                  enabled={showEducation}
                  onEnabledChange={setShowEducation}
                  onMoveUp={() => move("education", -1)}
                  onMoveDown={() => move("education", 1)}
                />
              </CardHeader>
              <CardContent className="grid gap-4">
                {education.length === 0 ? (
                  <EmptyStateCard
                    title="No education added yet"
                    description="Add your educational qualifications to strengthen your resume."
                    icon={<GraduationCap className="h-7 w-7 text-muted-foreground" />}
                    actionLabel="Add Education"
                    onAction={() => setEducation([{ school: "", degree: "", year: "" }])}
                  />
                ) : (
                  <>
                    {education.map((ed, idx) => (
                      <div key={idx} className="rounded-xl border bg-card p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium">Education {idx + 1}</p>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEducation((p) => p.filter((_, i) => i !== idx))}
                            aria-label="Remove education"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 grid gap-3">
                          <Input
                            placeholder="Institution Name"
                            value={ed.school}
                            onChange={(e) =>
                              setEducation((p) => p.map((x, i) => (i === idx ? { ...x, school: e.target.value } : x)))
                            }
                          />
                          <Input
                            placeholder="Degree"
                            value={ed.degree}
                            onChange={(e) =>
                              setEducation((p) => p.map((x, i) => (i === idx ? { ...x, degree: e.target.value } : x)))
                            }
                          />
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Input
                              placeholder="Start / End Year"
                              value={ed.year}
                              onChange={(e) =>
                                setEducation((p) => p.map((x, i) => (i === idx ? { ...x, year: e.target.value } : x)))
                              }
                            />
                            <Input placeholder="GPA (Optional)" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setEducation((p) => [...p, { school: "", degree: "", year: "" }])}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Another Education
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : null}

          {step === "projects" ? (
            <Card>
              <CardHeader>
                <SectionHeader
                  title="Projects"
                  enabled={showProjects}
                  onEnabledChange={setShowProjects}
                  onMoveUp={() => move("projects", -1)}
                  onMoveDown={() => move("projects", 1)}
                />
              </CardHeader>
              <CardContent className="grid gap-4">
                {projects.length === 0 ? (
                  <EmptyStateCard
                    title="No projects added yet"
                    description="Add projects to demonstrate your practical skills."
                    icon={<FolderKanban className="h-7 w-7 text-muted-foreground" />}
                    actionLabel="Add Project"
                    onAction={() => setProjects([{ name: "", bullets: "" }])}
                  />
                ) : (
                  <>
                    {projects.map((p, idx) => (
                      <div key={idx} className="rounded-xl border bg-card p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium">Project {idx + 1}</p>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setProjects((pp) => pp.filter((_, i) => i !== idx))}
                            aria-label="Remove project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 grid gap-3">
                          <Input
                            placeholder="Project Name"
                            value={p.name}
                            onChange={(e) =>
                              setProjects((pp) => pp.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))
                            }
                          />

                          <div className="grid gap-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-medium">Description</p>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={aiBusy === `project_${idx}`}
                                onClick={() =>
                                  aiGenerate({
                                    key: `project_${idx}`,
                                    prompt: `Write 3–4 lines (no special symbols) as ATS-friendly bullet points (one per line) for a resume project named: ${p.name || "My Project"}.`,
                                    onApply: (t) =>
                                      setProjects((pp) => pp.map((x, i) => (i === idx ? { ...x, bullets: t } : x))),
                                  })
                                }
                              >
                                {aiBusy === `project_${idx}` ? "Generating..." : "AI Generate"}
                              </Button>
                            </div>
                            <Textarea
                              placeholder="Describe your project, its purpose, and your contributions..."
                              value={p.bullets}
                              onChange={(e) =>
                                setProjects((pp) => pp.map((x, i) => (i === idx ? { ...x, bullets: e.target.value } : x)))
                              }
                              className="min-h-[130px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => setProjects((p) => [...p, { name: "", bullets: "" }])}>
                      <Plus className="mr-2 h-4 w-4" /> Add Another Project
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : null}

          {step === "skills" ? (
            <Card>
              <CardHeader>
                <SectionHeader
                  title="Skills"
                  enabled={showSkills}
                  onEnabledChange={setShowSkills}
                  onMoveUp={() => move("skills", -1)}
                  onMoveDown={() => move("skills", 1)}
                />
              </CardHeader>
              <CardContent className="grid gap-3">
                <Textarea
                  placeholder="Skills (comma separated or one per line)\nExample: HTML, CSS, JavaScript, React"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="min-h-[140px]"
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">Tip: Use comma separated for clean formatting.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={aiBusy === "skills"}
                    onClick={() =>
                      aiGenerate({
                        key: "skills",
                        prompt: `Suggest a strong skills list for a fresher resume in 3–4 lines. Candidate: ${headline || "student"}. Return skills comma separated.`,
                        onApply: (t) => setSkills(t),
                      })
                    }
                  >
                    {aiBusy === "skills" ? "Generating..." : "AI Suggest"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {step === "languages" ? (
            <Card>
              <CardHeader>
                <SectionHeader
                  title="Languages"
                  enabled={showLanguages}
                  onEnabledChange={setShowLanguages}
                  onMoveUp={() => move("languages", -1)}
                  onMoveDown={() => move("languages", 1)}
                />
              </CardHeader>
              <CardContent className="grid gap-3">
                <Textarea
                  placeholder="Languages (comma separated or one per line)\nExample: English (Fluent), Hindi (Native), Marathi (Intermediate)"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  className="min-h-[140px]"
                />
                <p className="text-xs text-muted-foreground">Add speaking proficiency if possible for better clarity.</p>
              </CardContent>
            </Card>
          ) : null}

          {step === "achievements" ? (
            <Card>
              <CardHeader>
                <SectionHeader
                  title="Achievements"
                  enabled={showAchievements}
                  onEnabledChange={setShowAchievements}
                  onMoveUp={() => move("achievements", -1)}
                  onMoveDown={() => move("achievements", 1)}
                />
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">Write achievements one per line. Quantifiable impact is best.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={aiBusy === "achievements"}
                    onClick={() =>
                      aiGenerate({
                        key: "achievements",
                        prompt: `Write 3 to 4 ATS-friendly achievement lines for a fresher resume. Headline: ${headline || "student"}.`,
                        onApply: (t) => setAchievements(t),
                      })
                    }
                  >
                    {aiBusy === "achievements" ? "Generating..." : "AI Generate"}
                  </Button>
                </div>
                <Textarea
                  placeholder="Achievements (one per line)"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  className="min-h-[160px]"
                />
              </CardContent>
            </Card>
          ) : null}

          {step === "experience" ? (
            <Card>
              <CardHeader>
                <SectionHeader
                  title="Experience"
                  enabled={showExperience}
                  onEnabledChange={setShowExperience}
                  onMoveUp={() => move("experience", -1)}
                  onMoveDown={() => move("experience", 1)}
                />
              </CardHeader>
              <CardContent className="grid gap-4">
                {experience.length === 0 ? (
                  <EmptyStateCard
                    title="No experience added yet"
                    description="Add internships, jobs, or freelancing work to strengthen your resume."
                    icon={<Briefcase className="h-7 w-7 text-muted-foreground" />}
                    actionLabel="Add Experience"
                    onAction={() => setExperience([{ company: "", role: "", bullets: "" }])}
                  />
                ) : (
                  <>
                    {experience.map((ex, idx) => (
                      <div key={idx} className="rounded-xl border bg-card p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium">Experience {idx + 1}</p>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setExperience((p) => p.filter((_, i) => i !== idx))}
                            aria-label="Remove experience"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 grid gap-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Input
                              placeholder="Company"
                              value={ex.company}
                              onChange={(e) =>
                                setExperience((p) => p.map((x, i) => (i === idx ? { ...x, company: e.target.value } : x)))
                              }
                            />
                            <Input
                              placeholder="Role"
                              value={ex.role}
                              onChange={(e) =>
                                setExperience((p) => p.map((x, i) => (i === idx ? { ...x, role: e.target.value } : x)))
                              }
                            />
                          </div>

                          <div className="grid gap-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-medium">Description / Bullets</p>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={aiBusy === `exp_${idx}`}
                                onClick={() =>
                                  aiGenerate({
                                    key: `exp_${idx}`,
                                    prompt: `Write ATS-friendly resume bullets (one per line) in 3–4 lines for role: ${ex.role || "Role"} at ${ex.company || "Company"}.`,
                                    onApply: (t) =>
                                      setExperience((p) => p.map((x, i) => (i === idx ? { ...x, bullets: t } : x))),
                                  })
                                }
                              >
                                {aiBusy === `exp_${idx}` ? "Generating..." : "AI Generate"}
                              </Button>
                            </div>
                            <Textarea
                              placeholder="Bullets (one per line)"
                              value={ex.bullets}
                              onChange={(e) =>
                                setExperience((p) => p.map((x, i) => (i === idx ? { ...x, bullets: e.target.value } : x)))
                              }
                              className="min-h-[110px]"
                            />
                            <p className="text-xs text-muted-foreground">Manual or AI — both supported.</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setExperience((p) => [...p, { company: "", role: "", bullets: "" }])}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Another Experience
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : null}

          {step === "certs" ? (
            <Card>
              <CardHeader>
                <SectionHeader
                  title="Certifications"
                  enabled={showCerts}
                  onEnabledChange={setShowCerts}
                  onMoveUp={() => move("certs", -1)}
                  onMoveDown={() => move("certs", 1)}
                />
              </CardHeader>
              <CardContent className="grid gap-4">
                {certs.length === 0 ? (
                  <EmptyStateCard
                    title="No certifications added yet"
                    description="Add certifications to show verified skills and achievements."
                    icon={<Award className="h-7 w-7 text-muted-foreground" />}
                    actionLabel="Add Certification"
                    onAction={() => setCerts([{ name: "", org: "", year: "" }])}
                  />
                ) : (
                  <>
                    {certs.map((c, idx) => (
                      <div key={idx} className="rounded-xl border bg-card p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium">Certification {idx + 1}</p>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCerts((p) => p.filter((_, i) => i !== idx))}
                            aria-label="Remove certification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <Input
                            placeholder="Certification"
                            value={c.name}
                            onChange={(e) =>
                              setCerts((p) => p.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))
                            }
                            className="sm:col-span-2"
                          />
                          <Input
                            placeholder="Year"
                            value={c.year}
                            onChange={(e) =>
                              setCerts((p) => p.map((x, i) => (i === idx ? { ...x, year: e.target.value } : x)))
                            }
                          />
                          <Input
                            placeholder="Organization"
                            value={c.org}
                            onChange={(e) =>
                              setCerts((p) => p.map((x, i) => (i === idx ? { ...x, org: e.target.value } : x)))
                            }
                            className="sm:col-span-3"
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => setCerts((p) => [...p, { name: "", org: "", year: "" }])}>
                      <Plus className="mr-2 h-4 w-4" /> Add Another Certification
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : null}

          {step === "templates" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choose a Template</CardTitle>
                <p className="text-sm text-muted-foreground">Select from visible professional resume templates</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleTemplates.map((t) => {
                    const active = selectedTemplate === t.id;
                    const isColor = t.kind === "color";
                    const accent = t.accent || "#3b82f6";

                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${active ? "border-primary ring-2 ring-primary" : "border-muted hover:border-muted-foreground"
                          }`}
                      >
                        {/* Mini Preview */}
                        <div className="h-28 bg-white p-2">
                          {/* Classic Template Preview */}
                          {t.id === "classic" && (
                            <div className="h-full text-center border-b">
                              <p className="text-[6px] font-bold">JOHN DOE</p>
                              <p className="text-[4px] text-gray-500">Software Engineer</p>
                              <p className="text-[3px] text-gray-400 mt-1">john@email.com | (123) 456-7890</p>
                              <p className="text-[3px] text-gray-400 mt-1 border-t pt-1">Experience</p>
                              <p className="text-[3px] text-gray-500">Tech Corp - Developer</p>
                            </div>
                          )}

                          {/* Minimal Template Preview */}
                          {t.id === "minimal" && (
                            <div className="h-full pl-2">
                              <p className="text-[6px] font-bold text-gray-800">John Doe</p>
                              <p className="text-[4px] text-gray-400 mt-0.5">Software Engineer</p>
                              <p className="text-[3px] text-gray-300 mt-2">john@email.com</p>
                              <p className="text-[3px] text-gray-300">Skills</p>
                              <p className="text-[3px] text-gray-400 mt-1">JavaScript • React</p>
                            </div>
                          )}

                          {/* Modern Template Preview */}
                          {t.id === "modern" && (
                            <div className="h-full">
                              <div className="flex justify-between border-b border-gray-300 pb-1">
                                <p className="text-[6px] font-bold">JOHN DOE</p>
                                <p className="text-[4px] text-gray-500">Software Engineer</p>
                              </div>
                              <p className="text-[3px] text-gray-400 mt-1">john@email.com</p>
                              <p className="text-[3px] text-gray-500 mt-1 border-l-2 border-gray-400 pl-1">Experience</p>
                            </div>
                          )}

                          {/* Executive Template Preview */}
                          {t.id === "executive" && (
                            <div className="h-full">
                              <div className="bg-gray-800 text-white p-1">
                                <p className="text-[5px] font-bold text-center">JOHN DOE</p>
                              </div>
                              <p className="text-[4px] text-center mt-1">Software Engineer</p>
                              <p className="text-[3px] text-gray-500 text-center mt-0.5">john@email.com</p>
                              <p className="text-[3px] text-gray-600 mt-1 border-t pt-0.5">Experience</p>
                            </div>
                          )}

                          {/* Two Column Template Preview */}
                          {t.id === "twocol" && (
                            <div className="h-full flex">
                              <div className="w-1/3 bg-gray-200 p-1">
                                <p className="text-[4px] font-bold">Skills</p>
                                <p className="text-[3px] text-gray-600">JS</p>
                                <p className="text-[3px] text-gray-600">React</p>
                              </div>
                              <div className="w-2/3 p-1">
                                <p className="text-[5px] font-bold">John Doe</p>
                                <p className="text-[3px] text-gray-500">Software Engineer</p>
                                <p className="text-[3px] text-gray-400 mt-1">Experience</p>
                              </div>
                            </div>
                          )}

                          {/* Compact Template Preview */}
                          {t.id === "compact" && (
                            <div className="h-full p-0.5">
                              <p className="text-[5px] font-bold">John Doe - Software Engineer</p>
                              <p className="text-[3px] text-gray-500">john@email.com</p>
                              <p className="text-[3px] text-gray-400">Skills: JavaScript, React, Node</p>
                              <p className="text-[3px] text-gray-400">Exp: Tech Corp - Developer</p>
                            </div>
                          )}

                          {/* ATS Pro Template Preview */}
                          {t.id === "atspro" && (
                            <div className="h-full text-left">
                              <p className="text-[6px] font-bold uppercase tracking-wide">John Doe</p>
                              <p className="text-[4px] uppercase">Software Engineer</p>
                              <p className="text-[3px] text-gray-500 mt-0.5">john@email.com</p>
                              <p className="text-[3px] text-gray-600 mt-1 border-b">SKILLS</p>
                              <p className="text-[3px] text-gray-500">JavaScript React</p>
                            </div>
                          )}

                          {/* Slate Template Preview */}
                          {t.id === "slate" && (
                            <div className="h-full bg-gray-50 p-1">
                              <p className="text-[6px] font-semibold text-gray-700">John Doe</p>
                              <p className="text-[4px] text-gray-500">Software Engineer</p>
                              <p className="text-[3px] text-gray-400 mt-1">john@email.com</p>
                              <p className="text-[3px] text-gray-400 border-t mt-1 pt-1">Experience</p>
                            </div>
                          )}

                          {/* Nimbus Template Preview */}
                          {t.id === "nimbus" && (
                            <div className="h-full">
                              <p className="text-[6px] font-medium">John Doe</p>
                              <p className="text-[4px] text-gray-400">Software Engineer</p>
                              <div className="h-px bg-gray-200 my-1"></div>
                              <p className="text-[3px] text-gray-500">john@email.com</p>
                              <p className="text-[3px] text-gray-500">Skills: JS, React</p>
                            </div>
                          )}

                          {/* Vertex Template Preview */}
                          {t.id === "vertex" && (
                            <div className="h-full">
                              <div className="bg-gray-900 p-1">
                                <p className="text-[5px] font-bold text-white text-center">JOHN DOE</p>
                              </div>
                              <div className="bg-gray-100 p-1">
                                <p className="text-[4px] text-center">Software Engineer</p>
                              </div>
                              <p className="text-[3px] text-center mt-1">john@email.com</p>
                            </div>
                          )}

                          {/* Color Templates */}
                          {isColor && (
                            <div
                              className="h-full p-1"
                              style={{ background: `linear-gradient(135deg, ${accent}10, ${accent}20)` }}
                            >
                              <div
                                className="text-white p-1 rounded"
                                style={{ background: accent }}
                              >
                                <p className="text-[5px] font-bold text-center">John Doe</p>
                                <p className="text-[3px] text-center opacity-90">Software Engineer</p>
                              </div>
                              <p className="text-[3px] text-gray-600 mt-1" style={{ color: accent }}>john@email.com</p>
                              <p className="text-[3px] mt-0.5" style={{ color: accent, borderColor: accent, borderLeft: `2px solid ${accent}` }}>Experience</p>
                            </div>
                          )}
                        </div>

                        <div className="p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-medium">{t.name}</span>
                            {active && <span className="text-xs text-primary">✓ Selected</span>}
                          </div>
                          <p className="text-xs text-muted-foreground">{t.note}</p>
                          <div className={`mt-2 h-1 rounded ${isColor ? "" : "bg-muted"}`}
                            style={isColor && t.accent ? { background: t.accent } : {}} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {step === "preview" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Final Check</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <p className="text-sm text-muted-foreground">Your resume preview is on the right. You can still jump back and edit.</p>
                <div className="mt-2 rounded-xl border bg-muted/20 p-3">
                  <p className="mb-2 text-sm font-medium">Drag to reorder sections</p>
                  <div className="grid gap-2">
                    {order.map((sectionId) => (
                      <div
                        key={sectionId}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("text/plain", sectionId)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const dragged = e.dataTransfer.getData("text/plain") as typeof order[number];
                          if (!dragged || dragged === sectionId) return;
                          setOrder((prev) => {
                            const from = prev.indexOf(dragged);
                            const to = prev.indexOf(sectionId);
                            if (from < 0 || to < 0) return prev;
                            const next = [...prev];
                            const [moved] = next.splice(from, 1);
                            next.splice(to, 0, moved);
                            return next;
                          });
                        }}
                        className="cursor-move rounded-lg border bg-background px-3 py-2 text-sm capitalize"
                      >
                        {sectionId}
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  className="mt-2"
                  onClick={() => {
                    // Save resume data to localStorage for export page
                    const resumeData = {
                      name, headline, email, phone, summary, photoDataUrl, skills, languages, achievements,
                      education, projects, experience, certs, selectedTemplate,
                      order, sectionEnabled
                    };
                    localStorage.setItem('resumeData', JSON.stringify(resumeData));
                    bumpResumeCreatedMetric();
                    bumpTemplateUsageMetric(selectedTemplate);
                  }}
                >
                  <Link to="/export">Go to Export</Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {/* Mobile-like bottom bar navigation */}
          <div className="sticky bottom-0 z-10 -mx-1 mt-2 border-t bg-background/80 px-1 py-3 backdrop-blur lg:static lg:mx-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-0">
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" className="h-12 flex-1" onClick={goBack} disabled={currentIndex === 0}>
                Previous
              </Button>
              <Button className="h-12 flex-1" onClick={unlockAndGoNext} disabled={currentIndex === steps.length - 1}>
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-16 lg:self-start">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Live Preview
                {visibleTemplates.find((t) => t.id === selectedTemplate) && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    - {(visibleTemplates.find((t) => t.id === selectedTemplate))?.name}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const template = visibleTemplates.find((t) => t.id === selectedTemplate) || templates[0];
                const accent = template?.accent || null;
                const isColor = template?.kind === "color";
                const design = template?.design || "classic";

                // Template-specific styles
                const getTemplateStyles = () => {
                  switch (design) {
                    case "minimal":
                      return { headerStyle: "text-left pl-0", nameStyle: "font-light text-2xl", accentBorder: false };
                    case "modern":
                      return { headerStyle: "flex justify-between items-start border-b pb-2", nameStyle: "font-bold text-xl", accentBorder: false };
                    case "executive":
                      return { headerStyle: "bg-gray-900 text-white p-3 -mx-5 -mt-5 mb-4 rounded-t", nameStyle: "font-bold text-xl text-white", accentBorder: false };
                    case "twocol":
                      return { headerStyle: "flex gap-4", nameStyle: "font-semibold text-xl", accentBorder: false, twoColumn: true };
                    case "compact":
                      return { headerStyle: "text-left", nameStyle: "font-bold text-lg tracking-tight", accentBorder: false, compact: true };
                    case "atspro":
                      return { headerStyle: "uppercase tracking-wide", nameStyle: "font-bold text-xl uppercase tracking-widest", accentBorder: false };
                    case "slate":
                      return { headerStyle: "bg-gray-50 p-3 -mx-5 -mt-5 mb-4", nameStyle: "font-semibold text-xl text-gray-700", accentBorder: false };
                    case "nimbus":
                      return { headerStyle: "", nameStyle: "font-medium text-xl", accentBorder: true, borderStyle: "border-gray-200" };
                    case "vertex":
                      return { headerStyle: "", nameStyle: "font-bold text-xl", accentBorder: false, sharp: true };
                    default:
                      return { headerStyle: "text-center border-b pb-2", nameStyle: "font-bold text-xl", accentBorder: false };
                  }
                };

                const styles = getTemplateStyles();

                return (
                  <div
                    className="rounded-md border border-slate-200 bg-white p-5 text-slate-900 shadow-sm"
                    style={{
                      borderLeft: accent ? `4px solid ${accent}` : "1px solid #e2e8f0"
                    }}>
                    <div>
                      {/* Template Header */}
                      {isColor && accent && (
                        <div className="-mx-5 -mt-5 mb-4 rounded-t-md px-5 py-3" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}99)` }}>
                          <p className="text-xl font-bold text-white">{name || "Your Name"}</p>
                          {headline && <p className="text-sm text-white/90">{headline}</p>}
                        </div>
                      )}

                      {!isColor && (
                        <div className={`flex items-start gap-3 ${styles.twoColumn ? 'flex-col' : ''}`}>
                          {photoDataUrl ? (
                            <img src={photoDataUrl} alt="Profile photo" className="h-12 w-12 rounded-full object-cover" />
                          ) : null}
                          <div className={styles.headerStyle}>
                            <p className={styles.nameStyle}>{name || "Your Name"}</p>
                            {headline ? <p className="text-sm text-slate-600">{headline}</p> : null}
                            <p className="mt-2 text-sm text-slate-500">
                              {(email || phone)
                                ? `${email ? `📧 ${email}` : ""}${email && phone ? "  •  " : ""}${phone ? `📱 ${phone}` : ""}`
                                : "📧 Email  •  📱 Phone"}
                            </p>
                          </div>
                        </div>
                      )}

                      {isColor && (
                        <div className="mt-2 text-sm text-slate-600">
                          {(email || phone)
                            ? `${email ? `📧 ${email}` : ""}${email && phone ? "  •  " : ""}${phone ? `📱 ${phone}` : ""}`
                            : "📧 Email  •  📱 Phone"}
                        </div>
                      )}
                    </div>

                    {summary ? (
                      <>
                        <Separator className="my-4" />
                        <p className="whitespace-pre-line text-sm text-slate-700">{summary}</p>
                      </>
                    ) : null}

                    {order.map((id) => {
                      if (!sectionEnabled[id]) return null;
                      if (id === "education") {
                        return (
                          <div key={id}>
                            <Separator className="my-4" />
                            <p className="text-sm font-semibold">Education</p>
                            <div className="mt-2 grid gap-2">
                              {education
                                .filter((e) => e.school || e.degree || e.year)
                                .map((e, i) => (
                                  <div key={i} className="text-sm text-slate-600">
                                    <p className="font-medium text-slate-900">{e.school || "College / School"}</p>
                                    <p>{[e.degree, e.year].filter(Boolean).join(" — ")}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      }
                      if (id === "projects") {
                        return (
                          <div key={id}>
                            <Separator className="my-4" />
                            <p className="text-sm font-semibold">Projects</p>
                            <div className="mt-2 grid gap-3">
                              {projects
                                .filter((p) => p.name || p.bullets)
                                .map((p, i) => (
                                  <div key={i}>
                                    <p className="text-sm font-medium">{p.name || "Project"}</p>
                                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-600">
                                      {p.bullets
                                        .split("\n")
                                        .map((b) => b.trim())
                                        .filter(Boolean)
                                        .map((b, j) => (
                                          <li key={j}>{b}</li>
                                        ))}
                                    </ul>
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      }
                      if (id === "skills") {
                        const list = skills
                          .split(/\n|,/)
                          .map((s) => s.trim())
                          .filter(Boolean);
                        if (!list.length) return null;
                        return (
                          <div key={id}>
                            <Separator className="my-4" />
                            <p className="text-sm font-semibold">Skills</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {list.map((s, i) => (
                                <span key={i} className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      if (id === "languages") {
                        const list = languages
                          .split(/\n|,/)
                          .map((s) => s.trim())
                          .filter(Boolean);
                        if (!list.length) return null;
                        return (
                          <div key={id}>
                            <Separator className="my-4" />
                            <p className="text-sm font-semibold">Languages</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {list.map((lang, i) => (
                                <span key={i} className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      if (id === "achievements") {
                        const list = achievements
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        if (!list.length) return null;
                        return (
                          <div key={id}>
                            <Separator className="my-4" />
                            <p className="text-sm font-semibold">Achievements</p>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                              {list.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      if (id === "experience") {
                        return (
                          <div key={id}>
                            <Separator className="my-4" />
                            <p className="text-sm font-semibold">Experience</p>
                            <div className="mt-2 grid gap-3">
                              {experience
                                .filter((e) => e.company || e.role || e.bullets)
                                .map((e, i) => (
                                  <div key={i}>
                                    <p className="text-sm font-medium">{[e.role, e.company].filter(Boolean).join(" — ") || "Role — Company"}</p>
                                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-600">
                                      {e.bullets
                                        .split("\n")
                                        .map((b) => b.trim())
                                        .filter(Boolean)
                                        .map((b, j) => (
                                          <li key={j}>{b}</li>
                                        ))}
                                    </ul>
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={id}>
                          <Separator className="my-4" />
                          <p className="text-sm font-semibold">Certifications</p>
                          <div className="mt-2 grid gap-2">
                            {certs
                              .filter((c) => c.name || c.org || c.year)
                              .map((c, i) => (
                                <div key={i} className="text-sm text-slate-600">
                                  <p className="font-medium text-slate-900">{c.name || "Certification"}</p>
                                  <p>{[c.org, c.year].filter(Boolean).join(" — ")}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
