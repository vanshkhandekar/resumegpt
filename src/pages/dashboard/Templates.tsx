import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isTemplateVisible } from "@/lib/demoStorage";

export default function Templates() {
  const templates = useMemo(
    () =>
      [
        // Normal (neutral)
        { id: "classic", name: "Clean", kind: "normal" as const, note: "Traditional, ATS-safe" },
        { id: "minimal", name: "Professional", kind: "normal" as const, note: "Clean spacing, simple type" },
        { id: "atspro", name: "ATS-friendly", kind: "normal" as const, note: "Extra readable + scannable" },
        { id: "modern", name: "Modern", kind: "normal" as const, note: "Balanced headings + sections" },
        { id: "twocol", name: "Two-column", kind: "normal" as const, note: "Skills sidebar layout" },
        { id: "executive", name: "Executive", kind: "normal" as const, note: "Strong hierarchy" },
        { id: "compact", name: "Compact", kind: "normal" as const, note: "Fits more on one page" },
        { id: "slate", name: "Slate", kind: "normal" as const, note: "Soft contrast, calm look" },
        { id: "nimbus", name: "Nimbus", kind: "normal" as const, note: "Light separators" },
        { id: "vertex", name: "Vertex", kind: "normal" as const, note: "Sharp section blocks" },

        // Color (accent)
        { id: "aurora", name: "Aurora", kind: "color" as const, note: "Accent header bar" },
        { id: "metro", name: "Metro", kind: "color" as const, note: "Color section markers" },
        { id: "nova", name: "Nova", kind: "color" as const, note: "Accent sidebar" },
        { id: "pulse", name: "Pulse", kind: "color" as const, note: "Highlight skills chips" },
        { id: "orbit", name: "Orbit", kind: "color" as const, note: "Subtle accent dividers" },
        { id: "colorpop", name: "Color Pop", kind: "color" as const, note: "Bold but professional" },
        { id: "elegant", name: "Elegant", kind: "color" as const, note: "Accent lines + spacing" },
        { id: "creative", name: "Creative", kind: "color" as const, note: "Modern accent layout" },
        { id: "bold", name: "Bold", kind: "color" as const, note: "High-contrast headings" },
        { id: "professional", name: "Professional", kind: "color" as const, note: "Accent tags + header" },
      ],
    []
  );

  const [selected, setSelected] = useState<string>(templates[0]?.id ?? "classic");
  const visibleTemplates = useMemo(() => templates.filter((t) => isTemplateVisible(t.id)), [templates]);

  const selectedTemplate = visibleTemplates.find((t) => t.id === selected) ?? visibleTemplates[0] ?? templates[0];

  const TemplateMiniPreview = ({ kind }: { kind: "normal" | "color" }) => {
    return (
      <div className="relative overflow-hidden rounded-md border bg-card">
        <div className={kind === "color" ? "h-3 bg-primary" : "h-3 bg-muted"} />
        <div className="p-3">
          <div className="h-2 w-2/3 rounded bg-muted" />
          <div className="mt-2 grid grid-cols-12 gap-2">
            <div className={kind === "color" ? "col-span-4 space-y-2" : "col-span-12 space-y-2"}>
              <div className="h-2 w-full rounded bg-muted" />
              <div className="h-2 w-4/5 rounded bg-muted" />
              <div className="h-2 w-3/5 rounded bg-muted" />
            </div>
            {kind === "color" && (
              <div className="col-span-8 space-y-2">
                <div className="h-2 w-full rounded bg-muted" />
                <div className="h-2 w-11/12 rounded bg-muted" />
                <div className="h-2 w-9/12 rounded bg-muted" />
              </div>
            )}
          </div>
          {kind === "color" && (
            <div className="mt-3 flex gap-2">
              <div className="h-5 w-14 rounded bg-primary/15" />
              <div className="h-5 w-10 rounded bg-primary/10" />
              <div className="h-5 w-12 rounded bg-primary/15" />
            </div>
          )}
        </div>
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
                  <TemplateMiniPreview kind={t.kind} />
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
