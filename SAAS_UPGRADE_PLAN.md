# AI Resume Studio — SaaS Upgrade: Complete System Design

> Production-grade architecture plan to convert AI Resume Studio from a demo project into a deployable SaaS product.

---

## 1. CURRENT CODEBASE AUDIT

### ❌ Critical Gaps Identified

| Area | Current State | Problem |
|------|--------------|---------|
| **Auth** | No auth system. Anyone can access `/dashboard`, `/create`, `/admin` | Zero access control — admin panel is open |
| **Data Persistence** | All data in `localStorage` only | Refresh = data survives, but clear cache = total loss. No cloud backup. No multi-device. |
| **Multi-Resume** | Single resume stored as `resumeData` in localStorage | Cannot save, name, or manage multiple resumes |
| **User Flow** | Landing → Dashboard → Create (no login required) | No signup/login gate. No user identity. |
| **AI Assistant** | Sends raw user text to Supabase edge function, no conversation memory | No context-aware follow-ups. No dynamic question flow. |
| **Resume Score** | Rule-based + optional AI blend. Reads from `localStorage` | Score is disconnected from builder. Not auto-triggered. |
| **Export** | jsPDF direct generation. Manual vs AI choice. | PDF quality is basic (no multi-column templates in PDF). No DOCX export. |
| **Rate Limiting** | Check `rate_limit` / `quota_exceeded` from edge function response | No client-side enforcement. No usage quota per user. |
| **Templates** | 20 templates defined, but only the live preview renders them — PDF uses one universal layout | Template selection doesn't affect PDF output significantly |
| **Landing Page** | Has `LandingHero` but includes "Project Report" section (academic) | Not SaaS-ready. Mentions "Janaprabha College, Ramtek" |
| **Dashboard.tsx** | Exists at `/pages/Dashboard.tsx` but is unused (old tab-based layout) | Dead code |
| **Admin** | Open route at `/admin` with local password check | No real auth. Stores `admin_logged_in` in localStorage |

### ✅ Working Features (Solid Foundation)
- Multi-step resume builder (10 steps) with live A4 preview
- AI content generation via Supabase edge function → Google Gemini
- 20 resume templates (10 classic + 10 color-accented)
- Section reordering & toggling
- Photo upload (data URL)
- Rule-based ATS scoring with detailed section analysis
- PDF export with jsPDF
- Floating AI assistant (draggable, chat UI)
- Dark/light theme toggle
- Responsive sidebar layout (`DashboardLayout` + `AppSidebar`)

---

## 2. COMPLETE USER FLOW (Target State)

```
Landing Page (/)
  │
  ├── "Get Started" CTA
  │
  ▼
Auth Gate (/auth)
  ├── Sign Up (email/password via Supabase Auth)
  ├── Login
  ├── Google OAuth (optional)
  └── Forgot Password
  │
  ▼
Dashboard (/dashboard)  ← PROTECTED ROUTE
  ├── "My Resumes" grid (create / view / edit / duplicate / delete)
  ├── Usage stats card (resumes created / AI calls used / plan tier)
  ├── Quick actions: "Create New Resume", "Browse Templates"
  │
  ▼
Resume Builder (/create/:id)  ← PROTECTED ROUTE
  ├── Load existing resume by ID (or blank for new)
  ├── Multi-step form (Profile → Education → ... → Preview)
  ├── Auto-save to Supabase every 10 seconds
  ├── AI buttons per section
  ├── Live preview panel (right side)
  │
  ▼
Templates (/templates)  ← PROTECTED ROUTE
  ├── Browse all templates
  ├── Premium-locked templates (visible but grayed)
  ├── "Apply" button → updates selectedTemplate in current resume
  │
  ▼
Resume Score (/score/:id)  ← PROTECTED ROUTE
  ├── Auto-loads from Supabase resume data
  ├── Rule-based score + AI deep analysis
  ├── Actionable improvement checklist
  │
  ▼
Export (/export/:id)  ← PROTECTED ROUTE
  ├── Manual vs AI Enhanced preview cards
  ├── Download as PDF
  ├── (Future: DOCX, share link)
```

---

## 3. DATABASE SCHEMA (Supabase — New Tables)

### 3a. `profiles` table
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free'          -- 'free' | 'pro' | 'enterprise'
  CHECK (plan IN ('free', 'pro', 'enterprise')),
  ai_calls_used INT NOT NULL DEFAULT 0,
  resumes_created INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3b. `resumes` table
```sql
CREATE TABLE public.resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,      -- full resume form data
  template_id TEXT NOT NULL DEFAULT 'classic',
  section_order TEXT[] DEFAULT ARRAY['education','projects','skills','languages','achievements','experience','certs'],
  section_enabled JSONB DEFAULT '{"education":true,"projects":true,"skills":true,"languages":true,"achievements":true,"experience":true,"certs":true}'::jsonb,
  last_score INT,                                -- cached overall score
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own resumes"
  ON public.resumes FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_resumes_user ON public.resumes (user_id, is_archived, updated_at DESC);

CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### 3c. `usage_logs` table
```sql
CREATE TABLE public.usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,                 -- 'ai_generate' | 'pdf_export' | 'resume_create' | 'ai_score'
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs"
  ON public.usage_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs"
  ON public.usage_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

---

## 4. SUBSCRIPTION & USAGE LIMITS (Logic Only)

### Tier Definitions
```typescript
const PLAN_LIMITS = {
  free: {
    maxResumes: 3,
    maxAiCallsPerDay: 10,
    maxPdfExportsPerDay: 5,
    premiumTemplates: false,
    aiScoreAccess: false,
    coverLetterAccess: false,
  },
  pro: {
    maxResumes: 25,
    maxAiCallsPerDay: 100,
    maxPdfExportsPerDay: 50,
    premiumTemplates: true,
    aiScoreAccess: true,
    coverLetterAccess: true,
  },
  enterprise: {
    maxResumes: Infinity,
    maxAiCallsPerDay: Infinity,
    maxPdfExportsPerDay: Infinity,
    premiumTemplates: true,
    aiScoreAccess: true,
    coverLetterAccess: true,
  },
} as const;
```

### Enforcement Flow
```
User triggers action (e.g., "AI Generate")
  │
  ├── 1. Read user plan from profiles table
  ├── 2. Count today's usage from usage_logs WHERE action = 'ai_generate' AND created_at >= today
  ├── 3. Compare count vs PLAN_LIMITS[plan].maxAiCallsPerDay
  │
  ├── IF under limit → Execute action → Insert usage_log
  └── IF over limit → Show upgrade modal with:
        "You've used 10/10 AI calls today. Upgrade to Pro for 100/day."
```

---

## 5. AI ASSISTANT SYSTEM (Upgraded)

### Current Problem
- User sends free-form text → AI gives generic response
- No context about the resume being built
- No multi-turn conversation memory

### Target: Smart Resume Copilot

```
Phase 1: User opens AI Assistant on /create
  │
  ├── System auto-injects current resume state into prompt context
  │   (name, headline, skills, experience — from active form state)
  │
  ├── AI greeting: "Hi [Name]! I see you're building a [headline] resume.
  │                  Would you like me to help with your summary, skills, or experience bullets?"
  │
  ▼
Phase 2: Smart Follow-Up Questions
  │
  ├── User: "Help me write experience bullets for my internship"
  ├── AI: "Sure! To write strong bullets, I need a few details:
  │         1. What company/team?
  │         2. What was your main responsibility?
  │         3. Any measurable results (numbers, %)?
  │         Type your answers and I'll craft ATS-optimized bullets."
  │
  ▼
Phase 3: Structured Output
  │
  ├── AI returns JSON-structured response:
  │   {
  │     "type": "experience_bullets",
  │     "content": [
  │       "Led frontend development of customer portal, reducing load time by 35%",
  │       "Integrated REST APIs serving 10K+ daily requests with 99.9% uptime",
  │       "Collaborated with 4-person agile team using Git and Jira workflows"
  │     ],
  │     "suggestion": "Consider adding a projects section to showcase personal work."
  │   }
  │
  ├── UI shows "Apply to Resume" button next to each suggestion
  └── One-click → Inserts directly into the correct form field
```

### Implementation (Prompt Engineering)

```typescript
const buildSystemPrompt = (resumeState: ResumeData) => `
You are an expert resume consultant working inside AI Resume Studio.

CURRENT RESUME CONTEXT:
- Name: ${resumeState.name || 'Not set'}
- Target Role: ${resumeState.headline || 'Not specified'}
- Skills: ${resumeState.skills || 'None added yet'}
- Education entries: ${resumeState.education.length}
- Experience entries: ${resumeState.experience.length}
- Projects: ${resumeState.projects.length}

STRICT RULES:
1. Be concise — max 4 bullet points per response.
2. Use action verbs: Led, Built, Designed, Improved, Reduced, etc.
3. Include quantifiable metrics where possible.
4. Format for ATS parsers — no special characters, no emojis.
5. If user asks something off-topic, redirect: "I'm focused on resume help. Try asking about [skills/summary/experience]."
6. Always ask clarifying questions before generating content.
`;
```

---

## 6. AUTO-SAVE & RESUME MANAGEMENT SYSTEM

### Auto-Save Logic (Client-Side)
```typescript
// Inside ResumeBuilder component
const AUTOSAVE_INTERVAL = 10_000; // 10 seconds

useEffect(() => {
  const timer = setInterval(() => {
    if (!hasUnsavedChanges) return;
    
    saveResumeToSupabase({
      id: resumeId,
      data: currentFormState,
      template_id: selectedTemplate,
      section_order: order,
      section_enabled: sectionEnabled,
    });
    
    setHasUnsavedChanges(false);
    setLastSavedAt(new Date());
  }, AUTOSAVE_INTERVAL);

  return () => clearInterval(timer);
}, [hasUnsavedChanges, currentFormState]);
```

### Save Status Indicator
```tsx
// Top-right corner of builder
<div className="flex items-center gap-2 text-xs text-muted-foreground">
  {isSaving ? (
    <><Loader2 className="h-3 w-3 animate-spin" /> Saving...</>
  ) : lastSavedAt ? (
    <><Check className="h-3 w-3 text-green-500" /> Saved {formatDistanceToNow(lastSavedAt)} ago</>
  ) : (
    <><Cloud className="h-3 w-3" /> Not saved yet</>
  )}
</div>
```

### Dashboard Resume Grid
```tsx
// /dashboard — My Resumes section
{resumes.map(resume => (
  <Card key={resume.id} className="group hover:border-primary/50 transition-all">
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{resume.title}</h3>
          <p className="text-xs text-muted-foreground">
            Updated {formatDistanceToNow(resume.updated_at)} ago
          </p>
          <Badge variant="outline" className="mt-2">{resume.template_id}</Badge>
          {resume.last_score && (
            <Badge className="ml-2">Score: {resume.last_score}%</Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigate(`/create/${resume.id}`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => duplicateResume(resume.id)}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/export/${resume.id}`)}>
              Export PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => deleteResume(resume.id)} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardContent>
  </Card>
))}
```

---

## 7. AUTH SYSTEM (Supabase Auth)

### New Files Needed

```
src/
├── contexts/
│   └── AuthContext.tsx          # Auth state provider
├── components/
│   └── auth/
│       ├── AuthPage.tsx         # Login/Signup page
│       ├── ProtectedRoute.tsx   # Route wrapper
│       └── UserMenu.tsx         # Avatar dropdown (profile, logout)
├── hooks/
│   └── useAuth.ts              # Auth hook
```

### ProtectedRoute Component
```tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  
  return <>{children}</>;
}
```

### Updated App.tsx Routes
```tsx
<Routes>
  {/* Public */}
  <Route path="/" element={<Index />} />
  <Route path="/auth" element={<AuthPage />} />

  {/* Protected */}
  <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
    <Route path="/dashboard" element={<DashboardHome />} />
    <Route path="/create" element={<ResumeBuilder />} />          {/* new resume */}
    <Route path="/create/:id" element={<ResumeBuilder />} />      {/* edit resume */}
    <Route path="/templates" element={<Templates />} />
    <Route path="/score/:id" element={<ResumeScore />} />
    <Route path="/export/:id" element={<ExportResume />} />
  </Route>

  {/* Admin — requires admin role */}
  <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 8. EDGE CASES & VALIDATION

### Input Validation (Zod Schemas)
```typescript
import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  headline: z.string().max(120, "Headline too long").optional(),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^[+\d\s()-]{7,20}$/, "Invalid phone format").optional(),
  summary: z.string().max(1000, "Summary too long").optional(),
});

export const educationSchema = z.object({
  school: z.string().min(2, "Institution name required"),
  degree: z.string().min(2, "Degree required"),
  year: z.string().regex(/^\d{4}(\s*[-–]\s*\d{4})?$/, "Format: 2020 or 2020-2024"),
});

export const experienceSchema = z.object({
  company: z.string().min(2, "Company name required"),
  role: z.string().min(2, "Role title required"),
  bullets: z.string().min(20, "Add at least 2 bullet points"),
});
```

### Error States Handling
```typescript
// API Error Boundary
const errorMessages: Record<string, string> = {
  rate_limit: "You've hit the rate limit. Please wait a moment and try again.",
  quota_exceeded: "Your daily AI quota is exhausted. Upgrade to Pro for more.",
  network_error: "Network connection lost. Your work is saved locally.",
  auth_expired: "Your session expired. Please log in again.",
  invalid_input: "Please check your inputs and try again.",
  server_error: "Something went wrong on our end. Please try again.",
};
```

### Loading States
```typescript
// Every async operation should have 3 states
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string; retryFn: () => void };
```

### Retry Logic
```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Unreachable');
}
```

---

## 9. FOLDER STRUCTURE (Target)

```
src/
├── App.tsx
├── main.tsx
├── index.css
│
├── contexts/
│   └── AuthContext.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useResumes.ts           # CRUD operations for resumes
│   ├── useAutoSave.ts          # Auto-save logic
│   ├── useUsageLimits.ts       # Plan enforcement
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── lib/
│   ├── utils.ts
│   ├── planLimits.ts           # PLAN_LIMITS config
│   ├── validation.ts           # Zod schemas
│   ├── retry.ts                # withRetry utility
│   └── demoStorage.ts          # Keep for backward compat
│
├── integrations/
│   └── supabase/
│       ├── client.ts
│       └── types.ts
│
├── components/
│   ├── auth/
│   │   ├── AuthPage.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── UserMenu.tsx
│   ├── ai/
│   │   └── FloatingAiAssistant.tsx
│   ├── app/
│   │   ├── AppSidebar.tsx
│   │   └── DashboardLayout.tsx
│   ├── resume/
│   │   ├── EmptyStateCard.tsx
│   │   ├── StepProgressHeader.tsx
│   │   ├── ResumeCard.tsx      # Dashboard resume grid card
│   │   └── SaveIndicator.tsx   # Auto-save status
│   ├── dashboard/
│   │   ├── UsageStats.tsx      # Usage card for dashboard
│   │   └── UpgradeModal.tsx    # Plan limit exceeded modal
│   ├── theme/
│   │   ├── ThemeProvider.tsx
│   │   └── ModeToggle.tsx
│   ├── admin/
│   │   ├── AdminAuthCard.tsx
│   │   ├── AdminSettingsCard.tsx
│   │   └── GeminiKeysCard.tsx
│   └── ui/                     # shadcn/ui components (keep as-is)
│
├── pages/
│   ├── Index.tsx               # Landing page (public)
│   ├── Auth.tsx                # Login/signup
│   ├── Admin.tsx
│   ├── NotFound.tsx
│   ├── landing/
│   │   ├── LandingHero.tsx
│   │   └── LandingFeatures.tsx # Replace LandingReportAccordion
│   └── dashboard/
│       ├── DashboardHome.tsx
│       ├── ResumeBuilder.tsx
│       ├── Templates.tsx
│       ├── ResumeScore.tsx
│       └── ExportResume.tsx
│
└── test/
    └── ...
```

---

## 10. UI/UX IMPROVEMENTS

### A. Landing Page Redesign
```
REMOVE:
  - "Janaprabha College, Ramtek • BCA 3rd Year" (footer)
  - "Project Report" accordion section
  - Admin link in navbar

ADD:
  - Feature grid (6 cards): AI Writing | ATS Score | 20+ Templates | PDF Export | Cloud Sync | Free
  - Social proof section: "Join 10,000+ job seekers" (placeholder stat)
  - Pricing section (Free vs Pro comparison table)
  - CTA: "Start Building Free" → /auth
```

### B. Dashboard Home Redesign
```
Current: Static cards with links
Target:
  ┌──────────────────────────────────────────────────────┐
  │  Welcome back, Vansh!                                │
  │  [■■■■■░░░] 3/10 AI calls today (Free plan)         │
  │                                    [Upgrade to Pro →] │
  └──────────────────────────────────────────────────────┘

  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
  │  My Resume #1   │ │  My Resume #2   │ │  + Create New   │
  │  "Frontend Dev" │ │  "Full Stack"   │ │                 │
  │  Score: 78%     │ │  Score: 92%     │ │    [+ icon]     │
  │  Updated 2h ago │ │  Updated 1d ago │ │                 │
  │  [Edit] [...]   │ │  [Edit] [...]   │ │                 │
  └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### C. Builder UX
```
ADD:
  - Auto-save indicator (top-right)
  - "Unsaved changes" warning on navigation
  - Form validation red borders on empty required fields
  - Character count on summary (target: 200-400 chars)
  - Skeleton loading state while AI generates
  - Progress bar updates in real-time as sections are filled
```

---

## 11. IMPLEMENTATION PRIORITY

### Phase 1 — Core (Week 1-2)
1. ✅ Supabase Auth integration (signup/login/protected routes)
2. ✅ `profiles` + `resumes` tables migration
3. ✅ Resume CRUD (create/read/update/delete via Supabase)
4. ✅ Auto-save with conflict resolution
5. ✅ Dashboard with resume grid

### Phase 2 — Polish (Week 3)
6. ✅ Usage tracking (`usage_logs` table)
7. ✅ Plan limits enforcement (free vs pro logic)
8. ✅ Upgrade modal UI
9. ✅ Landing page redesign (remove academic references)
10. ✅ Input validation (Zod)

### Phase 3 — AI & Quality (Week 4)
11. ✅ Context-aware AI assistant (injects resume state)
12. ✅ "Apply to resume" one-click from AI chat
13. ✅ Auto-trigger score after builder completion
14. ✅ Error boundaries + retry logic
15. ✅ Loading skeletons everywhere

---

## 12. SUMMARY

### What changes from current:
| Before | After |
|--------|-------|
| localStorage only | Supabase database |
| No auth | Supabase Auth (email + OAuth) |
| 1 resume per user | Unlimited resumes (plan-based) |
| Open admin | Role-based admin access |
| Generic AI chat | Context-aware resume copilot |
| Manual save | Auto-save every 10s |
| No usage limits | Free/Pro/Enterprise tiers |
| Academic landing page | SaaS landing page |
| Dead Dashboard.tsx | Active resume management hub |

### Files to Create (New):
- `src/contexts/AuthContext.tsx`
- `src/hooks/useAuth.ts`
- `src/hooks/useResumes.ts`
- `src/hooks/useAutoSave.ts`
- `src/hooks/useUsageLimits.ts`
- `src/lib/planLimits.ts`
- `src/lib/validation.ts`
- `src/lib/retry.ts`
- `src/components/auth/AuthPage.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/UserMenu.tsx`
- `src/components/resume/ResumeCard.tsx`
- `src/components/resume/SaveIndicator.tsx`
- `src/components/dashboard/UsageStats.tsx`
- `src/components/dashboard/UpgradeModal.tsx`
- `src/pages/Auth.tsx`
- `supabase/migrations/002_saas_tables.sql`

### Files to Modify (Existing):
- `src/App.tsx` — Add auth wrapper + protected routes
- `src/pages/Index.tsx` — Remove academic content, add SaaS sections
- `src/pages/dashboard/DashboardHome.tsx` — Resume grid + usage stats
- `src/pages/dashboard/ResumeBuilder.tsx` — Load from DB, auto-save, validation
- `src/pages/dashboard/ResumeScore.tsx` — Load by resume ID, not localStorage
- `src/pages/dashboard/ExportResume.tsx` — Load by resume ID, usage tracking
- `src/components/ai/FloatingAiAssistant.tsx` — Inject resume context
- `src/components/app/AppSidebar.tsx` — Add user menu, plan badge
- `src/components/app/DashboardLayout.tsx` — Wrap with auth check

---

*This document serves as the complete technical blueprint. Each section contains implementation-ready code, schemas, and flow diagrams. No vague ideas — every piece is practical and deployable.*
