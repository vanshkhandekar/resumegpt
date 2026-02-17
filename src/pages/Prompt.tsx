import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function PromptPage() {
  const prompt = useMemo(
    () =>
      `Create a web application called “ResumeGPT — AI Resume Builder” with these requirements.

GOAL
Build a resume builder with a dashboard experience and an admin panel that controls global AI behavior and API key management.

TECH STACK
- React + Vite + TypeScript
- Tailwind + shadcn-ui
- Routing with react-router-dom
- Backend via Lovable Cloud (database, auth, server functions)

BRANDING + BASIC INFO (MUST BE VISIBLE AT TOP)
- App name everywhere: ResumeGPT
- Landing page and header must clearly show (immediately, not hidden):
  - College: Janaprabha College, Ramtek
  - Class: BCA 3rd Year
  - Group Members: Vansh Khandekar, Shubham Chandekar, Pranay Mende

ROUTES
- / → Public landing page (academic project report style)
- /dashboard → Dashboard home
- /create → Resume Builder (multi-step)
- /templates → Template picker
- /score → Resume Score (demo)
- /export → Export/Download page
- /admin → Admin Panel (protected)
- /prompt → A page that shows THIS prompt and provides a one-click Copy button

PUBLIC LANDING PAGE (/)
- Design the landing page like a professional academic report.
- Hero must show ResumeGPT + short subtitle.
- Show the basic info strip (college/class/members) near the top (always visible).
- Include “Build Resume” CTA linking to /create.
- Include an accordion report section:
  - Sections: Project Details, Abstract, Introduction, Objectives, Process/Workflow, Development Tools, Conclusion
  - Only one section opens at a time
  - Smooth animations and clear expand/collapse affordance

DASHBOARD LAYOUT
- Collapsible sidebar with nav links: Dashboard, Create Resume, Templates, Resume Score, Export, Admin Panel, Copy Prompt
- Sticky top bar with app name + theme toggle
- Main area renders routed pages
- Optional floating AI assistant only inside dashboard

FEATURE: RESUME BUILDER (/create)
- Multi-step flow: profile, education, projects, skills, experience, certifications, preview.
- Each step has:
  - Clear header with current step label + progress bar
  - Add/edit/remove cards per section
  - Validation + friendly toasts
- Live preview panel updates as user edits.
- Allow enabling/disabling sections and reordering them.
- Support optional photo upload preview (client-side).

FEATURE: TEMPLATES (/templates)
- Templates UI only (do not connect templates to resume preview yet).
- Show a grid of 20 templates with clear visual preview thumbnails (normal + color styles).
- Selecting a template highlights it and updates a “Selected Template” card.
- Provide a Reset action to return to default.
- Templates list to include a mix like:
  Classic, Minimal, ATS Pro, Modern, Executive, Serif, Compact, Mono, Timeline, Split
  Aurora, Nova, Pulse, Coral, Emerald, Sunset, Indigo, Citrus, Ocean, Rose

FEATURE: RESUME SCORE (/score)
- Show demo scoring widgets (overall + ATS compatibility) with progress bars.

FEATURE: EXPORT (/export)
- Let user choose Manual vs AI Enhanced preview.
- Provide a single “Download PDF (A4)” action that downloads a PDF directly.
- CRITICAL: Do NOT open the browser print dialog. Do NOT use window.print().
- The user experience must be: click download → file saves as .pdf immediately.

AI ASSISTANT (USER-FACING)
- Provide an assistant UI (floating) where user types a prompt and receives a short ATS-friendly suggestion.
- Must call a backend function (server function) to generate text.
- Error handling:
  - rate limit → show toast
  - quota exceeded → show toast
  - generic error → show toast

STRICT AI OUTPUT RULES (ENFORCE SERVER-SIDE)
- Output must be 6–10 short lines.
- No bullet points, numbering, markdown, emojis.
- Sanitize and strip problematic characters and normalize whitespace.
- Keep it ATS-friendly and professional.

ADMIN PANEL (/admin)
- Email/password authentication.
- Protect access via RBAC:
  - Store roles in database table user_roles.
  - Provide server-side RPC/function is_admin() to verify.
- Include a one-time “Admin Bootstrap” action:
  - If no admin exists yet, the logged-in user can call a backend function to become the first admin.
  - If an admin already exists, bootstrap must be blocked.

ADMIN: AI SETTINGS
- Database table admin_settings (single row id=1) containing:
  - ai_enabled (boolean)
  - ai_model (string)
  - max_lines (number)
- Admin UI lets you toggle AI, pick model, and set max lines.

ADMIN: API KEYS MANAGEMENT
- Database table gemini_api_keys containing:
  - label, api_key, priority, is_active
- Admin can add keys, toggle active, and delete keys.

SECURITY
- Enable row-level security for admin tables.
- Only admins can read/update admin_settings and gemini_api_keys.
- Never expose secret keys to non-admin users.

UX
- Modern clean dashboard UI.
- Consistent spacing, cards, and helpful empty states.
- Theme toggle (light/dark).

DELIVERABLE
Implement the full UI, routes, backend tables, RLS policies, server functions, and error handling described above.

IMPORTANT CONSTRAINTS
- The /prompt page must only show this plain-text prompt and a one-click Copy button. Do not show code on /prompt.
- Do not include any source code in the /prompt page content.
`,
    [],
  );

  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight">Copy Prompt</h1>
      <p className="mt-1 text-muted-foreground">One-click copy karke kisi ko bhi bhej do.</p>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="grid gap-1">
            <CardTitle>Master Prompt</CardTitle>
            <CardDescription>Is prompt ko as-is use karo to same type ki website recreate hogi.</CardDescription>
          </div>
          <Button onClick={copy} className="shrink-0">
            {copied ? "Copied" : "Copy"}
          </Button>
        </CardHeader>
        <CardContent>
          <Textarea value={prompt} readOnly className="min-h-[520px] font-mono text-xs" />
        </CardContent>
      </Card>
    </div>
  );
}
