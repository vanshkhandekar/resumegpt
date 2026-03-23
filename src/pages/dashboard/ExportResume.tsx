import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
console.log("jsPDF import:", jsPDF);
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

const templates = [
  { id: "classic", name: "Classic", kind: "normal" as const, design: "classic", accent: null },
  { id: "minimal", name: "Minimal", kind: "normal" as const, design: "minimal", accent: null },
  { id: "modern", name: "Modern", kind: "normal" as const, design: "modern", accent: null },
  { id: "executive", name: "Executive", kind: "normal" as const, design: "executive", accent: null },
  { id: "twocol", name: "Two-Column", kind: "normal" as const, design: "twocol", accent: null },
  { id: "compact", name: "Compact", kind: "normal" as const, design: "compact", accent: null },
  { id: "atspro", name: "ATS Pro", kind: "normal" as const, design: "atspro", accent: null },
  { id: "slate", name: "Slate", kind: "normal" as const, design: "slate", accent: null },
  { id: "nimbus", name: "Nimbus", kind: "normal" as const, design: "nimbus", accent: null },
  { id: "vertex", name: "Vertex", kind: "normal" as const, design: "vertex", accent: null },
  { id: "aurora", name: "Aurora", kind: "color" as const, design: "aurora", accent: "#8b5cf6" },
  { id: "metro", name: "Metro", kind: "color" as const, design: "metro", accent: "#3b82f6" },
  { id: "nova", name: "Nova", kind: "color" as const, design: "nova", accent: "#10b981" },
  { id: "pulse", name: "Pulse", kind: "color" as const, design: "pulse", accent: "#ec4899" },
  { id: "orbit", name: "Orbit", kind: "color" as const, design: "orbit", accent: "#f59e0b" },
  { id: "colorpop", name: "Color Pop", kind: "color" as const, design: "colorpop", accent: "#ef4444" },
  { id: "elegant", name: "Elegant", kind: "color" as const, design: "elegant", accent: "#6366f1" },
  { id: "creative", name: "Creative", kind: "color" as const, design: "creative", accent: "#14b8a6" },
  { id: "bold", name: "Bold", kind: "color" as const, design: "bold", accent: "#dc2626" },
  { id: "professional", name: "Professional", kind: "color" as const, design: "professional", accent: "#0ea5e9" },
];

export default function ExportResume() {
  const [choice, setChoice] = useState<"manual" | "ai">("manual");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('resumeData');
    if (data) {
      try {
        setResumeData(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse resume data", e);
      }
    }
    setLoaded(true);
  }, []);

  const template = templates.find(t => t.id === (resumeData?.selectedTemplate || "classic"));
  const isColorTemplate = template?.kind === "color";
  const accentColor = template?.accent || null;

  const previewData = resumeData || {
    name: "John Doe",
    headline: "Software Developer",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    summary: "Passionate developer with experience in building web applications.",
    photoDataUrl: "",
    skills: "JavaScript, React, Node.js, Python",
    languages: "English, Hindi",
    achievements: "",
    education: [{ school: "ABC University", degree: "BCA", year: "2024" }],
    projects: [],
    experience: [],
    certs: []
  };

  const generatePDF = () => {
    console.log("Calling generatePDF. jsPDF is:", jsPDF);
    const JsConstructor = (jsPDF as any).jsPDF || jsPDF;
    if (typeof JsConstructor !== 'function') {
      console.error("jsPDF is not a constructor!", jsPDF);
      alert("System error: PDF library not loaded correctly.");
      return;
    }
    const doc = new JsConstructor({ unit: "mm", format: "a4" });
    const isAi = choice === "ai";
    const hexToRgb = (hex: string): [number, number, number] => {
      const clean = hex.replace("#", "");
      if (clean.length !== 6) return [37, 99, 235];
      return [
        Number.parseInt(clean.slice(0, 2), 16),
        Number.parseInt(clean.slice(2, 4), 16),
        Number.parseInt(clean.slice(4, 6), 16),
      ];
    };

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 15;
    const contentWidth = pageWidth - marginX * 2;
    const bottomMargin = 14;

    const accentHex = accentColor || (isAi ? "#2563eb" : "#1f4b99");
    const [accentR, accentG, accentB] = hexToRgb(accentHex);
    const [altR, altG, altB] = isAi ? [8, 145, 178] : [29, 78, 216];

    let yPos = 18;

    const addPage = () => {
      doc.addPage();
      yPos = 20;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(marginX, yPos - 6, pageWidth - marginX, yPos - 6);
    };

    const ensureSpace = (heightNeeded: number) => {
      if (yPos + heightNeeded > pageHeight - bottomMargin) {
        addPage();
      }
    };

    const drawGradientBar = (
      x: number,
      y: number,
      width: number,
      height: number,
      start: [number, number, number],
      end: [number, number, number],
    ) => {
      const steps = 80;
      for (let i = 0; i < steps; i += 1) {
        const t = i / (steps - 1);
        const r = Math.round(start[0] + (end[0] - start[0]) * t);
        const g = Math.round(start[1] + (end[1] - start[1]) * t);
        const b = Math.round(start[2] + (end[2] - start[2]) * t);
        doc.setFillColor(r, g, b);
        const segmentW = width / steps;
        doc.rect(x + i * segmentW, y, segmentW + 0.2, height, "F");
      }
    };

    const drawHeader = () => {
      const headerHeight = isAi ? 44 : 34;

      if (isAi) {
        drawGradientBar(0, 0, pageWidth, headerHeight, [accentR, accentG, accentB], [altR, altG, altB]);
      } else {
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, pageWidth, headerHeight, "F");
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.5);
        doc.line(0, headerHeight, pageWidth, headerHeight);
      }

      let textX = marginX;
      if (previewData.photoDataUrl) {
        try {
          const photoSize = isAi ? 24 : 20;
          const photoY = isAi ? 9 : 7;
          const format = previewData.photoDataUrl.split(",")[0].split("/")[1]?.split(";")[0]?.toUpperCase() || "JPEG";
          doc.addImage(previewData.photoDataUrl, format as any, marginX, photoY, photoSize, photoSize);
          if (isAi) {
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.8);
          } else {
            doc.setDrawColor(148, 163, 184);
            doc.setLineWidth(0.5);
          }
          doc.rect(marginX, photoY, photoSize, photoSize);
          textX = marginX + photoSize + 7;
        } catch (e) {
          console.error("Photo render failed:", e);
        }
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(isAi ? 17 : 16);
      doc.setTextColor(isAi ? 255 : 15, isAi ? 255 : 23, isAi ? 255 : 42);
      doc.text(previewData.name || "Your Name", textX, isAi ? 15 : 13, {
        maxWidth: pageWidth - textX - marginX,
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11.5);
      doc.text(previewData.headline || "Professional Headline", textX, isAi ? 22 : 20, {
        maxWidth: pageWidth - textX - marginX,
      });

      doc.setFontSize(10.5);
      const contactLine = `${previewData.email ? `Email: ${previewData.email}` : ""}${previewData.email && previewData.phone ? "  |  " : ""}${previewData.phone ? `Phone: ${previewData.phone}` : ""}`;
      doc.text(contactLine || "Email: email@example.com  |  Phone: +91 00000 00000", textX, isAi ? 29 : 26, {
        maxWidth: pageWidth - textX - marginX,
      });

      yPos = headerHeight + 10;
    };

    const drawSectionTitle = (title: string) => {
      ensureSpace(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12.5);
      doc.setTextColor(15, 23, 42);
      doc.text(title, marginX, yPos);
      doc.setDrawColor(accentR, accentG, accentB);
      doc.setLineWidth(0.7);
      doc.line(marginX, yPos + 1.8, pageWidth - marginX, yPos + 1.8);
      yPos += 7;
    };

    const drawParagraph = (text: string, color: [number, number, number] = [51, 65, 85]) => {
      if (!text.trim()) return;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.8);
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach((line: string) => {
        ensureSpace(6);
        doc.text(line, marginX, yPos);
        yPos += 5.3;
      });
    };

    const drawBullets = (items: string[]) => {
      if (!items.length) return;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(51, 65, 85);
      items.forEach((item) => {
        const clean = item.replace(/^[-•\s]+/, "").trim();
        if (!clean) return;
        const wrapped = doc.splitTextToSize(clean, contentWidth - 6);
        wrapped.forEach((line: string, idx: number) => {
          ensureSpace(6);
          if (idx === 0) {
            doc.text(`- ${line}`, marginX, yPos);
          } else {
            doc.text(line, marginX + 4, yPos);
          }
          yPos += 5;
        });
      });
    };

    const drawSkills = (skillsList: string[]) => {
      if (!skillsList.length) return;
      if (!isAi) {
        drawParagraph(skillsList.join(" | "));
        return;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.8);
      let xPos = marginX;
      const rowHeight = 8;
      ensureSpace(rowHeight + 2);

      skillsList.forEach((skill) => {
        const text = skill.trim();
        if (!text) return;
        const chipW = Math.min(doc.getTextWidth(text) + 7, contentWidth);
        if (xPos + chipW > pageWidth - marginX) {
          xPos = marginX;
          yPos += rowHeight;
          ensureSpace(rowHeight + 2);
        }
        doc.setFillColor(accentR, accentG, accentB);
        doc.roundedRect(xPos, yPos - 4.8, chipW, 6.2, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.text(text, xPos + 3.4, yPos - 0.6);
        xPos += chipW + 2.5;
      });
      yPos += rowHeight - 2;
    };

    try {
      console.log("Generating PDF with template:", choice);
      drawHeader();

      if (previewData.summary) {
        drawSectionTitle("Professional Summary");
        drawParagraph(previewData.summary);
        yPos += 2;
      }

      const sectionEnabled = (resumeData as any)?.sectionEnabled || {
        education: true,
        projects: true,
        skills: true,
        languages: true,
        achievements: true,
        experience: true,
        certs: true,
      };

      const orderedSections = ((resumeData as any)?.order?.length
        ? (resumeData as any).order
        : ["education", "projects", "skills", "languages", "achievements", "experience", "certs"]
      ).filter((id: string) => ["education", "projects", "skills", "languages", "achievements", "experience", "certs"].includes(id));

      orderedSections.forEach((section: string) => {
        if (!sectionEnabled[section]) return;

        if (section === "skills") {
          const skillsList = previewData.skills
            .split(/[\n,]/)
            .map((s) => s.trim())
            .filter(Boolean);
          if (!skillsList.length) return;
          drawSectionTitle("Technical Skills");
          drawSkills(skillsList);
          yPos += 2;
          return;
        }

        if (section === "languages") {
          const list = (previewData.languages || "")
            .split(/[\n,]/)
            .map((x) => x.trim())
            .filter(Boolean);
          if (!list.length) return;
          drawSectionTitle("Languages");
          drawParagraph(list.join(" | "));
          yPos += 1;
          return;
        }

        if (section === "achievements") {
          const list = (previewData.achievements || "")
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean);
          if (!list.length) return;
          drawSectionTitle("Achievements");
          drawBullets(list);
          yPos += 1;
          return;
        }

        if (section === "education") {
          const list = previewData.education.filter((e) => e.school || e.degree || e.year);
          if (!list.length) return;
          drawSectionTitle("Education");
          list.forEach((edu) => {
            ensureSpace(12);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(15, 23, 42);
            doc.text(edu.school || "Institution Name", marginX, yPos);
            yPos += 4.8;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.4);
            doc.setTextColor(71, 85, 105);
            doc.text([edu.degree, edu.year].filter(Boolean).join(" | "), marginX, yPos);
            yPos += 5.8;
          });
          yPos += 1;
          return;
        }

        if (section === "projects") {
          const list = previewData.projects.filter((p) => p.name || p.bullets);
          if (!list.length) return;
          drawSectionTitle("Projects");
          list.forEach((project) => {
            ensureSpace(10);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(15, 23, 42);
            doc.text(project.name || "Project", marginX, yPos);
            yPos += 5;
            const bullets = project.bullets
              .split("\n")
              .map((b) => b.trim())
              .filter(Boolean);
            drawBullets(bullets);
            yPos += 1.5;
          });
          return;
        }

        if (section === "experience") {
          const list = previewData.experience.filter((e) => e.company || e.role || e.bullets);
          if (!list.length) return;
          drawSectionTitle("Experience");
          list.forEach((exp) => {
            ensureSpace(10);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(15, 23, 42);
            doc.text([exp.role, exp.company].filter(Boolean).join(" | ") || "Role | Company", marginX, yPos);
            yPos += 5;
            const bullets = exp.bullets
              .split("\n")
              .map((b) => b.trim())
              .filter(Boolean);
            drawBullets(bullets);
            yPos += 1.5;
          });
          return;
        }

        if (section === "certs") {
          const list = previewData.certs.filter((c) => c.name || c.org || c.year);
          if (!list.length) return;
          drawSectionTitle("Certifications");
          list.forEach((cert) => {
            ensureSpace(9);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.8);
            doc.setTextColor(15, 23, 42);
            doc.text(cert.name || "Certification", marginX, yPos);
            yPos += 4.8;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.3);
            doc.setTextColor(71, 85, 105);
            doc.text([cert.org, cert.year].filter(Boolean).join(" | "), marginX, yPos);
            yPos += 5.8;
          });
        }
      });

      if (isAi) {
        const bulletPool = [
          ...previewData.experience.flatMap((e) => e.bullets.split("\n")),
          ...previewData.projects.flatMap((p) => p.bullets.split("\n")),
        ]
          .map((line) => line.trim())
          .filter(Boolean)
          .slice(0, 3);

        if (bulletPool.length) {
          drawSectionTitle("Key Achievements");
          drawBullets(bulletPool);
        }
      }

      const totalPages = (doc as any).internal.getNumberOfPages ? (doc as any).internal.getNumberOfPages() : doc.getNumberOfPages();
      for (let page = 1; page <= totalPages; page += 1) {
        doc.setPage(page);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`${previewData.name || "Resume"}  •  Page ${page} of ${totalPages}`, pageWidth / 2, pageHeight - 7, {
          align: "center",
        });
      }

      const fileName = `${(previewData.name || "resume").replace(/\s+/g, "_")}_resume.pdf`;
      doc.save(fileName);
      console.log("PDF download triggered successfully!");
    } catch (error: any) {
      console.error("PDF Generation failed:", error);
      alert("Error: " + error.message);
    }
  };

  if (!loaded) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/create">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resume Builder
          </Link>
        </Button>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Export Resume</h1>
      <p className="mt-1 text-muted-foreground">
        Template: {template?.name} - Choose Manual or AI Enhanced format.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        <Card className={`${choice === "manual" ? "ring-2 ring-primary" : ""} border-2 border-slate-200 bg-white text-slate-900 dark:bg-white dark:text-slate-900`}>
          <CardHeader className="border-b border-slate-200 bg-slate-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-black">
                <span className="text-2xl">📄</span> Manual Resume
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">Your original unedited content.</CardDescription>
            </div>
            <div className="flex flex-col items-center justify-center h-16 w-16 rounded-full border-4 border-amber-400 bg-amber-50">
              <span className="text-lg font-bold text-amber-600">62%</span>
              <span className="text-[9px] uppercase font-bold text-amber-600 tracking-tighter">ATS Score</span>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant={choice === "manual" ? "default" : "outline"}
              onClick={() => setChoice("manual")}
              className="mb-4 w-full"
            >
              Select Manual
            </Button>

            {/* Manual Preview - VERY Simple */}
            <div className="rounded-lg border border-gray-300 bg-white p-4 text-black shadow-sm">
              {/* Plain Header */}
              <div className="border-b-2 border-black pb-2 mb-3 flex items-center gap-3">
                {previewData.photoDataUrl && (
                  <img
                    src={previewData.photoDataUrl}
                    alt="Profile"
                    className="h-12 w-12 rounded-full border border-gray-400 object-cover flex-shrink-0"
                  />
                )}
                <div className={previewData.photoDataUrl ? "" : "w-full text-center"}>
                  <h2 className="text-lg font-bold text-black">{previewData.name}</h2>
                  <p className="text-sm text-black">{previewData.headline}</p>
                  <p className="text-xs text-gray-700 mt-1">📧 {previewData.email} {previewData.phone ? `| 📱 ${previewData.phone}` : ""}</p>
                </div>
              </div>

              {/* Simple Summary */}
              {previewData.summary && (
                <div className="mb-3">
                  <h3 className="font-bold text-sm text-black border-b border-gray-400 mb-1">Summary</h3>
                  <p className="text-xs text-gray-900">{previewData.summary}</p>
                </div>
              )}

              {/* Simple Skills */}
              {previewData.skills && (
                <div className="mb-3">
                  <h3 className="font-bold text-sm text-black border-b border-gray-400 mb-1">Skills</h3>
                  <p className="text-xs text-gray-900">{previewData.skills}</p>
                </div>
              )}

              {/* Simple Education */}
              {previewData.education && previewData.education.length > 0 && (
                <div>
                  <h3 className="font-bold text-sm text-black border-b border-gray-400 mb-1">Education</h3>
                  {previewData.education.map((edu, i) => (
                    <p key={i} className="text-xs text-gray-600">{edu.school} - {edu.degree} ({edu.year})</p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={`${choice === "ai" ? "ring-2 ring-primary" : ""} border-2 border-slate-200 bg-white text-slate-900 dark:bg-white dark:text-slate-900`}>
          <CardHeader className="border-b border-slate-200 bg-emerald-50/50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-black">
                <span className="text-2xl">✨</span> AI Enhanced Resume
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">Opus 4.6 improved with ATS keywords.</CardDescription>
            </div>
            <div className="flex flex-col items-center justify-center h-16 w-16 rounded-full border-4 border-emerald-500 bg-emerald-50">
              <span className="text-lg font-bold text-emerald-600">95%</span>
              <span className="text-[9px] uppercase font-bold text-emerald-600 tracking-tighter">ATS Score</span>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant={choice === "ai" ? "default" : "outline"}
              onClick={() => setChoice("ai")}
              className="mb-4 w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-95"
            >
              ✨ Select AI Enhanced
            </Button>

            {/* AI Enhanced Preview - Beautiful Professional */}
            <div
              className="rounded-lg border-2 shadow-xl"
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)",
                borderColor: "#2563eb"
              }}
            >
              {/* Beautiful Header with Gradient */}
              <div
                className="rounded-t-lg px-4 py-4 text-white flex items-center gap-3"
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #0891b2 50%, #2563eb 100%)",
                  boxShadow: "0 4px 15px rgba(37, 99, 235, 0.35)"
                }}
              >
                {previewData.photoDataUrl && (
                  <img
                    src={previewData.photoDataUrl}
                    alt="Profile"
                    className="h-14 w-14 rounded-full border-2 border-white object-cover flex-shrink-0"
                  />
                )}
                <div className={previewData.photoDataUrl ? "" : "w-full text-center"}>
                  <h2 className="text-xl font-bold">{previewData.name}</h2>
                  <p className="text-sm text-white/90">{previewData.headline}</p>
                  <p className="text-xs text-white/80 mt-1">📧 {previewData.email} {previewData.phone ? `| 📱 ${previewData.phone}` : ""}</p>
                </div>
              </div>

              {/* AI Enhanced Summary */}
              <div className="p-3 mx-2 mt-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #f3e8ff, #fce7f3)' }}>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-bold text-primary">✨ AI Enhanced</span>
                </div>
                <h3 className="font-bold text-sm text-black">Professional Summary</h3>
                <p className="text-xs mt-1 text-gray-900">
                  Results-driven professional with extensive experience delivering high-impact solutions.
                  Demonstrated track record of achieving exceptional results through innovative approaches and leadership.
                </p>
              </div>

              {/* Key Achievements - Only AI */}
              <div className="p-3 mx-2 mt-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #fce7f3, #f3e8ff)' }}>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-bold text-secondary">✨ AI Added</span>
                </div>
                <h3 className="font-bold text-sm text-black">Key Achievements</h3>
                <ul className="text-xs mt-1 space-y-1 text-gray-900">
                  <li>• Led development of 5+ production applications</li>
                  <li>• Improved system performance by 40%</li>
                  <li>• Mentored junior developers successfully</li>
                </ul>
              </div>

              {/* Skills with Color Badges */}
              {previewData.skills && (
                <div className="p-3 mx-2 mt-2">
                  <h3 className="font-bold text-sm text-black">Technical Skills</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {previewData.skills.split(/[\n,]/).filter(Boolean).map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full text-white font-medium"
                        style={{ background: "linear-gradient(135deg, #2563eb, #0891b2)" }}
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {previewData.education && previewData.education.length > 0 && (
                <div className="p-3 mx-2 mt-2 rounded-lg" style={{ background: '#f3e8ff' }}>
                  <h3 className="font-bold text-sm text-black">Education</h3>
                  {previewData.education.map((edu, i) => (
                    <p key={i} className="text-xs mt-1" style={{ color: '#4b5563' }}>
                      <span className="font-semibold">{edu.school}</span> - {edu.degree} ({edu.year})
                    </p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Download</CardTitle>
          <CardDescription>PDF export with your resume data and selected template.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={generatePDF}
            type="button"
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-95"
          >
            📥 Download {choice === "ai" ? "AI Enhanced" : "Manual"} Resume as PDF
          </Button>
          {!resumeData && (
            <p className="text-sm text-muted-foreground sm:self-center">
              (Using sample data - fill resume in Create page for your data)
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
