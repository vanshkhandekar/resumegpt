import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Loader2, RefreshCw, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { bumpAiUsageMetric, getActiveApiKey } from "@/lib/demoStorage";

type ResumeData = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  summary: string;
  photoDataUrl: string;
  skills: string;
  languages: string;
  achievements: string;
  education: { school: string; degree: string; year: string }[];
  projects: { name: string; bullets: string }[];
  experience: { company: string; role: string; bullets: string }[];
  certs: { name: string; org: string; year: string }[];
  selectedTemplate: string;
  order: string[];
  sectionEnabled: Record<string, boolean>;
};

type SectionId = "profile" | "education" | "skills" | "experience" | "projects" | "certifications";
type SectionStatus = "good" | "medium" | "missing";

type SectionResult = {
  id: SectionId;
  name: string;
  score: number;
  status: SectionStatus;
  reason: string;
};

type ScoreResult = {
  overallScore: number;
  atsScore: number;
  sections: SectionResult[];
  improvements: string[];
  summary: string;
  source: "rule" | "ai";
};

type AiSection = {
  id?: string;
  score?: number;
  reason?: string;
};

type AiScorePayload = {
  overallScore?: number;
  atsScore?: number;
  summary?: string;
  improvements?: string[];
  sections?: AiSection[];
};

const emptyResume: ResumeData = {
  name: "",
  headline: "",
  email: "",
  phone: "",
  summary: "",
  photoDataUrl: "",
  skills: "",
  languages: "",
  achievements: "",
  education: [],
  projects: [],
  experience: [],
  certs: [],
  selectedTemplate: "classic",
  order: ["education", "projects", "skills", "experience", "certs"],
  sectionEnabled: { education: true, projects: true, skills: true, experience: true, certs: true },
};

const scoreToStatus = (score: number): SectionStatus => {
  if (score <= 10) return "missing";
  if (score < 70) return "medium";
  return "good";
};

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));

function computeRuleBasedScore(resume: ResumeData): ScoreResult {
  const skillsList = resume.skills
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const experienceLines = resume.experience
    .flatMap((x) => x.bullets.split("\n"))
    .map((b) => b.trim())
    .filter(Boolean);

  const projectLines = resume.projects
    .flatMap((x) => x.bullets.split("\n"))
    .map((b) => b.trim())
    .filter(Boolean);
  const achievementLines = (resume.achievements || "")
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);

  const allAchievementLines = [...experienceLines, ...projectLines, ...achievementLines];
  const numberMentions = allAchievementLines.filter((line) => /\b\d+(\+|%|x)?\b/i.test(line)).length;
  const actionVerbMentions = allAchievementLines.filter((line) =>
    /^(built|developed|implemented|created|designed|improved|optimized|led|managed|delivered|reduced|increased|automated)\b/i.test(
      line,
    ),
  ).length;

  const profileScore = clamp(
    (resume.name ? 25 : 0) +
      (resume.headline ? 25 : 0) +
      (resume.email ? 20 : 0) +
      (resume.phone ? 20 : 0) +
      (resume.summary.length >= 60 ? 10 : 0),
  );

  const educationScore = clamp(
    resume.education.length === 0
      ? 0
      : 30 +
          resume.education.reduce((acc, edu) => {
            const complete = Number(Boolean(edu.school)) + Number(Boolean(edu.degree)) + Number(Boolean(edu.year));
            return acc + complete * 8;
          }, 0),
  );

  const skillsScore = clamp(
    (skillsList.length === 0 ? 0 : 20) +
      Math.min(skillsList.length * 7, 42) +
      (skillsList.length >= 8 ? 18 : 0) +
      (skillsList.length >= 12 ? 10 : 0),
  );

  const experienceScore = clamp(
    (resume.experience.length === 0 ? 0 : 24) +
      Math.min(resume.experience.length * 12, 24) +
      Math.min(experienceLines.length * 3, 24) +
      Math.min(numberMentions * 4, 16) +
      Math.min(actionVerbMentions * 2, 12),
  );

  const projectsScore = clamp(
    (resume.projects.length === 0 ? 0 : 20) +
      Math.min(resume.projects.length * 12, 24) +
      Math.min(projectLines.length * 3, 28) +
      Math.min(projectLines.filter((line) => /\b(react|node|python|sql|api|typescript|tailwind|vite|java)\b/i.test(line)).length * 4, 20),
  );

  const certificationsScore = clamp(
    (resume.certs.length === 0 ? 0 : 25) +
      resume.certs.reduce((acc, cert) => {
        const complete = Number(Boolean(cert.name)) + Number(Boolean(cert.org)) + Number(Boolean(cert.year));
        return acc + complete * 10;
      }, 0),
  );

  const sections: SectionResult[] = [
    {
      id: "profile",
      name: "Profile",
      score: profileScore,
      status: scoreToStatus(profileScore),
      reason: profileScore >= 75 ? "Profile details look complete." : "Add complete contact details and a stronger headline.",
    },
    {
      id: "education",
      name: "Education",
      score: educationScore,
      status: scoreToStatus(educationScore),
      reason: educationScore >= 75 ? "Education section is properly filled." : "Add school, degree and year for each education entry.",
    },
    {
      id: "skills",
      name: "Skills",
      score: skillsScore,
      status: scoreToStatus(skillsScore),
      reason: skillsScore >= 75 ? "Skills list is relevant and detailed." : "Add more role-specific technical skills.",
    },
    {
      id: "experience",
      name: "Experience",
      score: experienceScore,
      status: scoreToStatus(experienceScore),
      reason:
        experienceScore >= 75
          ? "Experience has good depth and impact."
          : "Add measurable achievements and action-oriented bullets in experience.",
    },
    {
      id: "projects",
      name: "Projects",
      score: projectsScore,
      status: scoreToStatus(projectsScore),
      reason: projectsScore >= 75 ? "Projects demonstrate strong practical work." : "Add project outcomes, tech stack, and contribution details.",
    },
    {
      id: "certifications",
      name: "Certifications",
      score: certificationsScore,
      status: scoreToStatus(certificationsScore),
      reason: certificationsScore >= 75 ? "Certifications add strong credibility." : "Add relevant certifications to improve trust and ATS strength.",
    },
  ];

  const overallScore = clamp(
    profileScore * 0.2 +
      educationScore * 0.15 +
      skillsScore * 0.2 +
      experienceScore * 0.2 +
      projectsScore * 0.17 +
      certificationsScore * 0.08,
  );

  const atsScore = clamp(
    30 +
      Math.min(skillsList.length * 3, 20) +
      Math.min(numberMentions * 5, 20) +
      Math.min(actionVerbMentions * 2, 12) +
      (resume.summary.length >= 80 ? 8 : 0) +
      (resume.experience.length > 0 ? 6 : 0) +
      (resume.projects.length > 0 ? 4 : 0),
  );

  const improvements: string[] = [];
  if (profileScore < 75) improvements.push("Complete profile with headline, email, phone, and a concise professional summary.");
  if (skillsScore < 75) improvements.push("Add 8 to 12 role-specific skills including tools and technologies.");
  if (experienceScore < 75) improvements.push("Write experience bullets with action verbs and measurable outcomes.");
  if (projectsScore < 75) improvements.push("Mention project impact and stack used for each project.");
  if (certificationsScore < 50) improvements.push("Include certifications relevant to your target role.");
  if (improvements.length === 0) improvements.push("Resume structure is strong; now tailor keywords to each job description.");

  return {
    overallScore,
    atsScore,
    sections,
    improvements: improvements.slice(0, 5),
    summary:
      overallScore >= 80
        ? "Your resume is strong and close to recruiter-ready."
        : overallScore >= 60
          ? "Your resume is good but needs a few targeted improvements."
          : "Your resume needs stronger content depth to compete effectively.",
    source: "rule",
  };
}

export default function ResumeScore() {
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume);
  const [scoreResult, setScoreResult] = useState<ScoreResult>(() => computeRuleBasedScore(emptyResume));
  const [aiLoading, setAiLoading] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const raw = localStorage.getItem("resumeData");
    if (!raw) {
      setHasResume(false);
      setScoreResult(computeRuleBasedScore(emptyResume));
      return;
    }

    try {
      const parsed = JSON.parse(raw) as ResumeData;
      setResumeData(parsed);
      setHasResume(true);
      setScoreResult(computeRuleBasedScore(parsed));
    } catch (error) {
      console.error("Resume data parse error:", error);
      setHasResume(false);
      setScoreResult(computeRuleBasedScore(emptyResume));
    }
  }, []);

  const statusIcon = (status: SectionStatus) => {
    if (status === "good") return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    if (status === "medium") return <AlertCircle className="h-4 w-4 text-amber-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const statusClasses = (status: SectionStatus) => {
    if (status === "good") return "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20";
    if (status === "medium") return "border-amber-200 bg-amber-50 dark:bg-amber-950/20";
    return "border-red-200 bg-red-50 dark:bg-red-950/20";
  };

  const scoreMessage = useMemo(() => {
    const score = scoreResult.overallScore;
    if (score >= 85) return "Excellent resume quality. Minor refinements can make it outstanding.";
    if (score >= 70) return "Good resume quality. Improve weak sections for stronger impact.";
    if (score >= 55) return "Average quality. Focus on achievements and project depth.";
    return "Needs strong improvement. Build complete sections with measurable outcomes.";
  }, [scoreResult.overallScore]);

  const runAiAnalysis = async () => {
    if (!hasResume) {
      toast({
        variant: "destructive",
        title: "No resume data found",
        description: "Please fill your resume in Create Resume first.",
      });
      return;
    }

    setAiLoading(true);
    const baseline = computeRuleBasedScore(resumeData);

    try {
      const activeKey = "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";
      const payload = {
        model: "anthropic/claude-3-opus",
        messages: [
          { 
            role: "system", 
            content: `You are an expert resume grader. Analyze the provided resume JSON and baseline score. Return a JSON object with: 
            - overallScore (0-100)
            - atsScore (0-100)
            - summary (brief overview)
            - improvements (array of 4-6 strings)
            - sections (array of {id: string, score: number, reason: string} for profile, education, skills, experience, projects, certifications). 
            Output ONLY the valid JSON.` 
          },
          { role: "user", content: `Resume Data: ${JSON.stringify(resumeData)}\nBaseline: ${JSON.stringify(baseline)}` }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        temperature: 0.1,
      };

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeKey}`,
          "HTTP-Referer": "http://localhost:8080",
          "X-Title": "AI Resume Studio",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`OpenRouter Error: ${response.status}`);
      const rawRes = await response.json();
      const data = JSON.parse(rawRes.choices?.[0]?.message?.content || "{}");
      if (data?.error === "rate_limit") {
        toast({ variant: "destructive", title: "Rate Limit", description: data.message });
        setScoreResult(baseline);
        return;
      }
      if (data?.error === "quota_exceeded") {
        toast({ variant: "destructive", title: "Quota Exhausted", description: data.message });
        setScoreResult(baseline);
        return;
      }

      const aiData = (data || {}) as AiScorePayload;
      const aiSections = Array.isArray(aiData.sections) ? aiData.sections : [];
      const byId = new Map(aiSections.map((x) => [String(x.id || "").toLowerCase(), x]));

      const mergedSections: SectionResult[] = baseline.sections.map((section) => {
        const aiSection = byId.get(section.id);
        const aiScore = Number(aiSection?.score);
        const blendedScore = Number.isFinite(aiScore) ? clamp(section.score * 0.6 + aiScore * 0.4) : section.score;
        return {
          ...section,
          score: blendedScore,
          status: scoreToStatus(blendedScore),
          reason:
            typeof aiSection?.reason === "string" && aiSection.reason.trim().length > 0
              ? aiSection.reason.trim()
              : section.reason,
        };
      });

      const aiOverall = Number(aiData.overallScore);
      const aiAts = Number(aiData.atsScore);
      const mergedOverall = Number.isFinite(aiOverall) ? clamp(baseline.overallScore * 0.65 + aiOverall * 0.35) : baseline.overallScore;
      const mergedAts = Number.isFinite(aiAts) ? clamp(baseline.atsScore * 0.65 + aiAts * 0.35) : baseline.atsScore;

      const improvements = Array.isArray(aiData.improvements)
        ? aiData.improvements.map((tip) => String(tip).trim()).filter(Boolean).slice(0, 6)
        : baseline.improvements;

      const summary = typeof aiData.summary === "string" && aiData.summary.trim() ? aiData.summary.trim() : baseline.summary;

      setScoreResult({
        overallScore: mergedOverall,
        atsScore: mergedAts,
        sections: mergedSections,
        improvements: improvements.length ? improvements : baseline.improvements,
        summary,
        source: "ai",
      });
      setLastAnalyzedAt(new Date().toLocaleString());
      bumpAiUsageMetric();
      toast({
        title: "AI analysis complete",
        description: "Your resume has been scored with full-content review.",
      });
    } catch (err) {
      console.error("AI score error:", err);
      setScoreResult(baseline);
      toast({
        variant: "destructive",
        title: "AI analysis failed",
        description: "Showing deterministic score based on your resume content.",
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Resume Score</h1>
          <p className="mt-1 text-muted-foreground">AI + rubric analysis of your complete resume.</p>
        </div>
        <Button onClick={runAiAnalysis} disabled={aiLoading} className="gap-2">
          {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {aiLoading ? "Analyzing..." : "Analyze with AI"}
        </Button>
      </div>

      {!hasResume && (
        <Card className="mt-6 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6 text-sm text-amber-900 dark:text-amber-200">
            No saved resume found. Create your resume first, then come back for full AI scoring.
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-2 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <span className="text-2xl">📊</span> Overall Score
            </CardTitle>
            <CardDescription className="text-muted-foreground">Quality and completeness score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <p className="text-6xl font-bold text-emerald-600">{scoreResult.overallScore}</p>
              <p className="mb-2 text-lg text-muted-foreground">/ 100</p>
            </div>
            <Progress value={scoreResult.overallScore} className="mt-4 h-3" />
            <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">{scoreMessage}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-2 border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <span className="text-2xl">🤖</span> ATS Compatibility
            </CardTitle>
            <CardDescription className="text-muted-foreground">Parsing and keyword readiness score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <p className="text-6xl font-bold text-blue-600">{scoreResult.atsScore}</p>
              <p className="mb-2 text-lg text-muted-foreground">/ 100</p>
            </div>
            <Progress value={scoreResult.atsScore} className="mt-4 h-3" />
            <p className="mt-2 text-sm font-medium text-blue-700 dark:text-blue-400">{scoreResult.summary}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <span className="text-xl">📋</span> Section Strength Analysis
          </CardTitle>
          <CardDescription className="text-muted-foreground">Detailed score per section with feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {scoreResult.sections.map((section) => (
              <div key={section.id} className={`rounded-lg border p-4 ${statusClasses(section.status)}`}>
                <div className="flex items-center gap-3">
                  {statusIcon(section.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{section.name}</span>
                      <Badge
                        variant={
                          section.status === "good" ? "default" : section.status === "medium" ? "outline" : "destructive"
                        }
                      >
                        {section.score}%
                      </Badge>
                    </div>
                    <Progress value={section.score} className="mt-2 h-2" />
                    <p className="mt-2 text-xs text-muted-foreground">{section.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 border-blue-200 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <span className="text-xl">💡</span> Improvements to Apply
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {scoreResult.source === "ai" ? "AI-validated suggestions" : "Rule-based suggestions"}
            {lastAnalyzedAt ? ` • Last analyzed: ${lastAnalyzedAt}` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-foreground">
          {scoreResult.improvements.map((tip, idx) => (
            <p key={`${tip}-${idx}`} className="text-sm">
              - {tip}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
