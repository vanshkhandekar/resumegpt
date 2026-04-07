import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isTemplateVisible } from "@/lib/demoStorage";

export default function Templates() {
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
          note: "Left sidebar skills, right content",
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

  const [selected, setSelected] = useState<string>(templates[0]?.id ?? "classic");
  const visibleTemplates = useMemo(() => templates.filter((t) => isTemplateVisible(t.id)), [templates]);

  const selectedTemplate = visibleTemplates.find((t) => t.id === selected) ?? visibleTemplates[0] ?? templates[0];

  const TemplateMiniPreview = ({ template }: { template: typeof templates[0] }) => {
    const t = template;
    const isColor = t.kind === "color";
    const accent = (t as any).accent || "#2563eb";

    return (
      <div 
        className="relative h-32 w-full overflow-hidden rounded-md border border-slate-200 bg-white"
        style={isColor && (t as any).accent ? { borderLeft: `5px solid ${(t as any).accent}` } : {}}
      >
        {/* Classic / Default */}
        {(t.id === "classic" || (!["twocol", "compact", "atspro", "slate", "nimbus", "vertex"].includes(t.id) && !isColor)) && (
          <div className="h-full p-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-800 border-b pb-1 mb-1">John Doe</p>
            <p className="text-[5px] text-slate-500">Software Engineer</p>
            <p className="text-[4px] text-slate-400 mt-0.5">Experience | Skills</p>
          </div>
        )}
        
        {/* Two Column Template Preview */}
        {t.id === "twocol" && (
          <div className="h-full flex">
            <div className="w-1/3 bg-gray-200 p-2">
              <p className="text-[6px] font-bold">Skills</p>
              <p className="text-[5px] text-gray-600">JS</p>
              <p className="text-[5px] text-gray-600">React</p>
            </div>
            <div className="w-2/3 p-2">
              <p className="text-[8px] font-bold">John Doe</p>
              <p className="text-[5px] text-gray-500">Software Engineer</p>
              <p className="text-[4px] text-gray-400 mt-1 flex border-b pb-0.5">Experience</p>
            </div>
          </div>
        )}

        {/* Compact Template Preview */}
        {t.id === "compact" && (
          <div className="h-full p-2">
            <p className="text-[8px] font-bold">John Doe - Software Engineer</p>
            <p className="text-[5px] text-gray-500 mt-0.5">john@email.com</p>
            <div className="bg-slate-100 p-0.5 mt-1"><p className="text-[4px] font-bold uppercase">Skills</p></div>
            <p className="text-[4px] text-gray-500">JavaScript, React, Node</p>
          </div>
        )}

        {/* ATS Pro Template Preview */}
        {t.id === "atspro" && (
          <div className="h-full text-center p-2">
            <p className="text-[9px] font-bold uppercase tracking-wider">John Doe</p>
            <p className="text-[6px] uppercase text-slate-700 mt-0.5">Software Engineer</p>
            <p className="text-[4px] text-gray-500 mt-0.5">john@email.com</p>
            <p className="text-[5px] text-gray-800 mt-2 border-b-2 font-bold pb-0.5">SKILLS</p>
            <p className="text-[4px] text-gray-500 mt-1">JavaScript React</p>
          </div>
        )}

        {/* Slate Template Preview */}
        {t.id === "slate" && (
          <div className="h-full bg-white relative">
             <div className="bg-slate-50 p-2 border-b border-slate-200">
              <p className="text-[9px] font-semibold text-slate-800">John Doe</p>
              <p className="text-[5px] text-slate-500">Software Engineer</p>
             </div>
             <div className="p-2">
               <p className="text-[4px] font-mono text-slate-400 border-b border-dashed border-slate-300 pb-0.5">EXPERIENCE</p>
             </div>
          </div>
        )}

        {/* Nimbus Template Preview */}
        {t.id === "nimbus" && (
          <div className="h-full p-2 text-center">
            <p className="text-[9px] font-serif font-medium text-slate-800">John Doe</p>
            <p className="text-[5px] text-slate-400 mt-0.5">Software Engineer</p>
            <div className="h-[1px] bg-slate-200 w-1/2 mx-auto my-1.5"></div>
            <p className="text-[5px] font-medium uppercase tracking-widest text-slate-400 mt-2">Skills</p>
            <p className="text-[4px] text-slate-500 mt-0.5">JS, React</p>
          </div>
        )}

        {/* Vertex Template Preview */}
        {t.id === "vertex" && (
          <div className="h-full bg-white relative p-1.5 border-l-[6px] border-slate-200">
            <div className="mt-1">
              <p className="text-[10px] font-black tracking-tighter text-slate-900">JOHN DOE</p>
              <p className="text-[5px] mt-0.5 opacity-80">Software Engineer</p>
            </div>
            <div className="bg-slate-100 p-1 mt-2 border-l-2 border-slate-300">
              <p className="text-[5px] font-black uppercase text-slate-800">EXPERIENCE</p>
            </div>
          </div>
        )}

        {/* Color Templates */}
        {isColor && (
          <div className="h-full bg-white text-left p-0.5">
            <div
              className="text-white p-2 rounded-sm"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
            >
              <p className="text-[9px] font-bold">John Doe</p>
              <p className="text-[5px] opacity-90 mt-0.5">Software Engineer</p>
            </div>
            <div className="p-2">
              <p className="text-[4px] mt-1 border-b pb-0.5" style={{ color: accent, borderBottomColor: accent }}>EXPERIENCE</p>
              <p className="text-[4px] text-slate-600 mt-1">Tech Corp - Developer</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Templates</h1>
      <p className="mt-1 text-muted-foreground">All templates are free. Choose one for your resume.</p>

      <Card className="mt-6 bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Selected Template</CardTitle>
          <CardDescription className="text-muted-foreground">
            Current: {selectedTemplate?.name} - {selectedTemplate?.kind === "color" ? "Color" : "Normal"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => setSelected(visibleTemplates[0]?.id ?? "classic")}>
            Reset to Classic
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {visibleTemplates.map((t) => {
          const active = selected === t.id;
          return (
            <Card key={t.id} className={`bg-card transition-all ${active ? 'border-primary border-2' : 'border-2'}`}>
              <CardHeader>
                <div className="space-y-3">
                  <TemplateMiniPreview template={t} />
                  <div>
                    <CardTitle className="text-lg text-foreground">{t.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{t.note}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant={active ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelected(t.id)}
                >
                  {active ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
