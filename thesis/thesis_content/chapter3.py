"""Chapter 3: System Design (approx. 3000-4000 words)"""
from reportlab.platypus import Paragraph, Preformatted
from .helpers import spacer, page_break, make_table, ascii_diagram

def build_chapter3(S):
    story = []
    
    story.append(Paragraph("CHAPTER 3", S['ChapterTitle']))
    story.append(Paragraph("SYSTEM DESIGN", S['ChapterTitle']))
    story.append(spacer(16))
    
    # 3.1 System Architecture
    story.append(Paragraph("3.1 System Architecture", S['SectionTitle']))
    story.append(Paragraph(
        "AI Resume Studio follows a modern, layered architecture that separates concerns across the "
        "presentation layer, business logic layer, and data persistence layer. The architecture is "
        "designed for scalability, maintainability, and performance, leveraging cloud-native services "
        "where appropriate.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "The system employs a client-heavy architecture where the React frontend handles the majority "
        "of business logic, state management, and UI rendering. Backend services are provided by "
        "Supabase (PostgreSQL database, authentication, and edge functions) and OpenRouter (AI model "
        "API gateway). This approach minimizes server-side complexity while maintaining security for "
        "sensitive operations like API key management and user authentication.", S['Body']))
    story.append(spacer(8))
    
    arch_diagram = """
    +================================================================+
    |                    AI RESUME STUDIO ARCHITECTURE                |
    +================================================================+
    |                                                                  |
    |   +------------------+    +-----------------+    +------------+ |
    |   |   PRESENTATION   |    |  BUSINESS LOGIC |    |    DATA    | |
    |   |     LAYER        |    |     LAYER       |    |   LAYER    | |
    |   +------------------+    +-----------------+    +------------+ |
    |   |                  |    |                 |    |            | |
    |   | React 18 + Vite  |<-->| Custom Hooks    |<-->| Supabase  | |
    |   | Tailwind CSS     |    | useResumes      |    | PostgreSQL| |
    |   | Shadcn/UI        |    | useAutoSave     |    | Auth      | |
    |   | React Router v6  |    | useAuth         |    | Storage   | |
    |   |                  |    |                 |    |            | |
    |   | Components:      |    | Services:       |    | External: | |
    |   | - ResumeBuilder  |    | - ATS Engine    |    | - OpenRtr | |
    |   | - ResumeScore    |    | - AI Generator  |    | - Claude  | |
    |   | - ExportResume   |    | - PDF Engine    |    |   Opus    | |
    |   | - FloatingAI     |    | - Validation    |    |           | |
    |   | - DashboardHome  |    |                 |    |           | |
    |   +------------------+    +-----------------+    +------------+ |
    |                                                                  |
    |   +------------------------------------------------------------+|
    |   |              CROSS-CUTTING CONCERNS                        ||
    |   | Theme Management | Error Handling | Auto-Save | Metrics    ||
    |   +------------------------------------------------------------+|
    +================================================================+
    """
    story.append(Paragraph("<i>Figure 3.1: System Architecture Diagram</i>", S['Caption']))
    story.append(ascii_diagram(arch_diagram, S))
    story.append(spacer(12))
    
    story.append(Paragraph("<b>3.1.1 Presentation Layer</b>", S['SubSection']))
    story.append(Paragraph(
        "The presentation layer is built using React 18 with a component-based architecture. Vite serves "
        "as the build tool and development server, providing fast Hot Module Replacement (HMR) during "
        "development. Tailwind CSS provides utility-first styling, and the Shadcn/UI library supplies "
        "accessible, customizable UI primitives built on Radix UI foundations. React Router v6 handles "
        "client-side routing with protected route wrappers for authenticated pages.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>3.1.2 Business Logic Layer</b>", S['SubSection']))
    story.append(Paragraph(
        "Business logic is encapsulated in custom React hooks (useResumes, useAutoSave, useAuth) and "
        "service modules. The ATS scoring engine implements a deterministic rule-based algorithm with "
        "configurable weights. The AI generation service communicates with Claude 3 Opus via the OpenRouter "
        "API, handling prompt construction, response parsing, and error recovery. The PDF export engine "
        "uses jsPDF for programmatic document generation with pixel-level control.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>3.1.3 Data Layer</b>", S['SubSection']))
    story.append(Paragraph(
        "Data persistence is managed through a dual storage approach. Primary data (resumes, user profiles, "
        "usage logs) is stored in Supabase's PostgreSQL database with Row Level Security (RLS) policies. "
        "Supplementary data (API keys, template visibility, metrics) uses browser localStorage for "
        "performance and privacy. The auto-save mechanism synchronizes form state to the database every "
        "10 seconds, with localStorage serving as a fallback cache.", S['Body']))
    
    # 3.2 DFD
    story.append(Paragraph("3.2 Data Flow Diagrams (DFD)", S['SectionTitle']))
    story.append(Paragraph(
        "Data Flow Diagrams illustrate how information moves through the AI Resume Studio system, "
        "from user input through processing to output generation.", S['Body']))
    story.append(spacer(8))
    
    story.append(Paragraph("<b>3.2.1 Context Diagram (Level 0 DFD)</b>", S['SubSection']))
    dfd0 = """
    +===============================================================+
    |                  CONTEXT DIAGRAM (LEVEL 0)                     |
    +===============================================================+
    |                                                                 |
    |   +---------+     Resume Data      +------------------+         |
    |   |         | ------------------> |                  |         |
    |   |  USER   |     ATS Score       |  AI RESUME       |         |
    |   |         | <------------------ |  STUDIO          |         |
    |   |         |     AI Suggestions  |  SYSTEM          |         |
    |   |         | <------------------ |                  |         |
    |   |         |     PDF Document    |                  |         |
    |   |         | <------------------ |                  |         |
    |   +---------+                     +--------+---------+         |
    |                                            |                   |
    |                              AI Requests   |   AI Responses    |
    |                                            v                   |
    |                                   +-----------------+          |
    |                                   |  OPENROUTER     |          |
    |                                   |  AI SERVICE     |          |
    |                                   |  (Claude Opus)  |          |
    |                                   +-----------------+          |
    +===============================================================+
    """
    story.append(Paragraph("<i>Figure 3.2: Context Diagram (Level 0 DFD)</i>", S['Caption']))
    story.append(ascii_diagram(dfd0, S))
    story.append(spacer(12))
    
    story.append(Paragraph("<b>3.2.2 Level 1 DFD</b>", S['SubSection']))
    dfd1 = """
    +===============================================================+
    |                    LEVEL 1 DATA FLOW DIAGRAM                   |
    +===============================================================+
    |                                                                 |
    |   +--------+                                                    |
    |   |  USER  |                                                    |
    |   +---+----+                                                    |
    |       |                                                         |
    |       | Personal Info, Education, Skills, Experience             |
    |       v                                                         |
    |   +-----------+    Resume JSON    +-------------+               |
    |   | 1.0       | --------------> | 2.0         |               |
    |   | RESUME    |                  | ATS SCORING |               |
    |   | BUILDER   |                  | ENGINE      |               |
    |   +-----------+                  +------+------+               |
    |       |    ^                            |                       |
    |       |    | AI Content                 | Score + Feedback      |
    |       |    |                            v                       |
    |   +---+--------+               +---------------+               |
    |   | 3.0        |               | 4.0           |               |
    |   | AI CONTENT | <------------ | SCORE         |               |
    |   | GENERATOR  |  Context      | DISPLAY       |               |
    |   +---+--------+               +---------------+               |
    |       |                                                         |
    |       | API Calls                                               |
    |       v                                                         |
    |   +-----------+    Resume Data    +-------------+               |
    |   | OPENROUTER| <-----------     | 5.0         |               |
    |   | API       |                  | PDF EXPORT  |               |
    |   +-----------+                  | ENGINE      |               |
    |                                  +-------------+               |
    |                                       |                         |
    |                                       v                         |
    |                                  +----------+                   |
    |                                  | PDF FILE |                   |
    |                                  +----------+                   |
    +===============================================================+
    """
    story.append(Paragraph("<i>Figure 3.3: Level 1 Data Flow Diagram</i>", S['Caption']))
    story.append(ascii_diagram(dfd1, S))
    story.append(spacer(12))
    
    story.append(Paragraph(
        "The Level 1 DFD reveals five primary processes within the system. Process 1.0 (Resume Builder) "
        "captures user input through a multi-step wizard and produces a structured resume JSON object. "
        "Process 2.0 (ATS Scoring Engine) evaluates this JSON against weighted criteria to produce scores "
        "and improvement recommendations. Process 3.0 (AI Content Generator) communicates with the "
        "OpenRouter API to generate professional content based on user context. Process 4.0 (Score Display) "
        "renders the evaluation results with visual indicators. Process 5.0 (PDF Export Engine) transforms "
        "the resume data into a high-fidelity PDF document.", S['Body']))
    
    # 3.3 Use Case
    story.append(Paragraph("3.3 Use Case Diagrams", S['SectionTitle']))
    story.append(Paragraph(
        "The use case diagram identifies the primary actors and their interactions with the AI Resume "
        "Studio system. Two actors are identified: the User (primary actor) and the AI Service "
        "(secondary actor providing content generation capabilities).", S['Body']))
    story.append(spacer(8))
    
    usecase = """
    +================================================================+
    |                      USE CASE DIAGRAM                           |
    +================================================================+
    |                                                                  |
    |   +--------+                              +---------------+      |
    |   |        |--- Create Resume ---------->|               |      |
    |   |        |--- Edit Resume ------------>|               |      |
    |   |        |--- Select Template -------->|               |      |
    |   |        |--- Upload Photo ----------->|               |      |
    |   |  USER  |--- View Live Preview ------>| AI RESUME     |      |
    |   |        |--- Generate AI Content ---->| STUDIO        |      |
    |   |        |--- Run ATS Score ---------->| SYSTEM        |      |
    |   |        |--- Export as PDF ---------->|               |      |
    |   |        |--- Chat with AI ----------->|               |      |
    |   |        |--- Reorder Sections ------->|               |      |
    |   |        |--- Toggle Sections -------->|               |      |
    |   |        |--- Toggle Theme ----------->|               |      |
    |   +--------+                              +-------+-------+      |
    |                                                   |              |
    |                                                   |              |
    |                                           +-------v-------+      |
    |                                           |  AI SERVICE   |      |
    |                                           | (OpenRouter + |      |
    |                                           |  Claude Opus) |      |
    |                                           +---------------+      |
    +================================================================+
    """
    story.append(Paragraph("<i>Figure 3.4: Use Case Diagram</i>", S['Caption']))
    story.append(ascii_diagram(usecase, S))
    story.append(spacer(12))
    
    story.append(Paragraph("<b>Use Case Descriptions:</b>", S['SubSection']))
    usecases = [
        ("<b>UC-01: Create Resume</b>", "User initiates a new resume by entering personal information in "
         "step 1 of the multi-step wizard. System creates a resume entry and enables sequential navigation."),
        ("<b>UC-02: Generate AI Content</b>", "User requests AI-generated content for summaries, project "
         "descriptions, experience bullets, or skills. System sends context-enriched prompt to Claude Opus "
         "and applies the generated text to the appropriate field."),
        ("<b>UC-03: Run ATS Score</b>", "User navigates to the Resume Score page. System runs the "
         "rule-based scoring engine and optionally triggers AI-enhanced analysis for blended scoring."),
        ("<b>UC-04: Export as PDF</b>", "User selects Manual or AI Enhanced export mode. System generates "
         "a pixel-perfect A4 PDF using jsPDF with template-specific styling."),
        ("<b>UC-05: Chat with AI</b>", "User opens the floating AI assistant and asks resume-related "
         "questions. System responds with concise, actionable suggestions using Claude Opus."),
    ]
    for title, desc in usecases:
        story.append(Paragraph(f"{title}: {desc}", S['BodyIndent']))
        story.append(spacer(4))
    
    # 3.4 ER Diagram
    story.append(Paragraph("3.4 Entity-Relationship Diagram", S['SectionTitle']))
    story.append(Paragraph(
        "The Entity-Relationship diagram represents the data model underlying AI Resume Studio, "
        "showing the entities, their attributes, and the relationships between them.", S['Body']))
    story.append(spacer(8))
    
    er = """
    +================================================================+
    |                   ENTITY-RELATIONSHIP DIAGRAM                   |
    +================================================================+
    |                                                                  |
    |  +------------------+        +--------------------+              |
    |  |    AUTH.USERS     |        |     PROFILES       |              |
    |  +------------------+  1..1  +--------------------+              |
    |  | PK: id (UUID)    |------->| PK/FK: id (UUID)   |              |
    |  | email            |        | full_name           |              |
    |  | encrypted_pass   |        | avatar_url          |              |
    |  | created_at       |        | plan (free/pro/ent) |              |
    |  +--------+---------+        | ai_calls_used       |              |
    |           |                   | resumes_created     |              |
    |           |                   | created_at          |              |
    |           |  1..*             | updated_at          |              |
    |           |                   +--------------------+              |
    |           v                                                      |
    |  +------------------+                                            |
    |  |     RESUMES      |                                            |
    |  +------------------+                                            |
    |  | PK: id (UUID)    |                                            |
    |  | FK: user_id      |                                            |
    |  | title            |                                            |
    |  | data (JSONB)     |  <-- Contains: name, headline, email,      |
    |  | template_id      |      phone, summary, photo, skills,        |
    |  | section_order[]  |      languages, achievements,              |
    |  | section_enabled  |      education[], projects[],              |
    |  | last_score       |      experience[], certs[]                 |
    |  | is_archived      |                                            |
    |  | created_at       |                                            |
    |  | updated_at       |                                            |
    |  +------------------+                                            |
    |           |                                                      |
    |           |  1..*                                                 |
    |           v                                                      |
    |  +------------------+                                            |
    |  |   USAGE_LOGS     |                                            |
    |  +------------------+                                            |
    |  | PK: id (UUID)    |                                            |
    |  | FK: user_id      |                                            |
    |  | action           |  <-- ai_generate | pdf_export |            |
    |  | metadata (JSONB) |      resume_create | ai_score               |
    |  | created_at       |                                            |
    |  +------------------+                                            |
    +================================================================+
    """
    story.append(Paragraph("<i>Figure 3.5: Entity-Relationship Diagram</i>", S['Caption']))
    story.append(ascii_diagram(er, S))
    story.append(spacer(12))
    
    # 3.5 Tech Stack
    story.append(Paragraph("3.5 Technology Stack Selection", S['SectionTitle']))
    story.append(Paragraph(
        "The technology stack for AI Resume Studio was selected based on comprehensive evaluation of "
        "performance characteristics, developer experience, ecosystem maturity, and alignment with "
        "project requirements. The final stack represents a modern, production-ready combination of "
        "technologies.", S['Body']))
    story.append(spacer(8))
    
    stack_data = [
        ["Layer", "Technology", "Version", "Purpose"],
        ["Frontend Framework", "React", "18.3.1", "Component-based UI with virtual DOM"],
        ["Build Tool", "Vite", "5.4.19", "Fast HMR, optimized bundling"],
        ["Language", "TypeScript", "5.8.3", "Static typing, better DX"],
        ["Styling", "Tailwind CSS", "3.4.17", "Utility-first responsive design"],
        ["UI Components", "Shadcn/UI + Radix", "Latest", "Accessible, composable primitives"],
        ["Routing", "React Router", "6.30.1", "Client-side SPA navigation"],
        ["State Management", "React Context + Hooks", "Built-in", "Lightweight global state"],
        ["Backend (BaaS)", "Supabase", "2.91.0", "PostgreSQL, Auth, Edge Functions"],
        ["AI Model", "Claude 3 Opus", "Latest", "Advanced text generation"],
        ["AI Gateway", "OpenRouter API", "v1", "Multi-model API access"],
        ["PDF Generation", "jsPDF", "4.0.0", "Programmatic PDF creation"],
        ["Form Validation", "Zod", "3.25.76", "Schema-based validation"],
        ["Charts", "Recharts", "2.15.4", "Data visualization"],
        ["Testing", "Vitest + RTL", "3.2.4", "Unit and component testing"],
    ]
    story.append(Paragraph("<i>Table 3.1: Complete Technology Stack</i>", S['Caption']))
    story.append(make_table(stack_data, col_widths=[100, 90, 60, 180]))
    story.append(spacer(12))
    
    # 3.6 Database Schema
    story.append(Paragraph("3.6 Database Schema Design", S['SectionTitle']))
    story.append(Paragraph(
        "The database schema is designed around three primary tables in Supabase's PostgreSQL instance, "
        "with Row Level Security (RLS) policies ensuring data isolation between users.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>3.6.1 Profiles Table</b>", S['SubSection']))
    story.append(Paragraph(
        "The profiles table extends the auth.users table with application-specific data. It is automatically "
        "populated via a PostgreSQL trigger (handle_new_user) that fires after user signup. The plan column "
        "supports three tiers (free, pro, enterprise) with CHECK constraints. Usage counters (ai_calls_used, "
        "resumes_created) enable client-side enforcement of plan limits.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>3.6.2 Resumes Table</b>", S['SubSection']))
    story.append(Paragraph(
        "The resumes table stores all resume data in a JSONB column, providing schema flexibility for "
        "varying resume structures. Each resume has a template_id, section_order array, and section_enabled "
        "JSONB for layout customization. The last_score column caches the most recent ATS score for "
        "dashboard display. An index on (user_id, is_archived, updated_at DESC) optimizes the common "
        "query pattern of fetching a user's active resumes sorted by recency.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>3.6.3 Usage Logs Table</b>", S['SubSection']))
    story.append(Paragraph(
        "The usage_logs table provides an audit trail of all significant user actions, supporting "
        "plan limit enforcement and analytics. Action types include ai_generate, pdf_export, "
        "resume_create, and ai_score. The metadata JSONB column stores action-specific details such "
        "as the model used, response latency, and error information.", S['Body']))
    
    # 3.7 API Architecture
    story.append(Paragraph("3.7 API Architecture", S['SectionTitle']))
    story.append(Paragraph(
        "AI Resume Studio communicates with two external APIs: Supabase for data persistence and "
        "authentication, and OpenRouter for AI model access.", S['Body']))
    story.append(spacer(6))
    
    api_data = [
        ["Endpoint", "Method", "Purpose", "Auth Required"],
        ["OpenRouter /chat/completions", "POST", "AI content generation", "API Key"],
        ["Supabase /rest/v1/resumes", "GET", "Fetch user resumes", "JWT Token"],
        ["Supabase /rest/v1/resumes", "POST", "Create new resume", "JWT Token"],
        ["Supabase /rest/v1/resumes", "PATCH", "Update resume (auto-save)", "JWT Token"],
        ["Supabase /rest/v1/resumes", "DELETE", "Delete resume", "JWT Token"],
        ["Supabase /rest/v1/profiles", "GET", "Fetch user profile", "JWT Token"],
        ["Supabase /rest/v1/usage_logs", "POST", "Log usage action", "JWT Token"],
        ["Supabase /auth/v1/signup", "POST", "User registration", "Anon Key"],
        ["Supabase /auth/v1/token", "POST", "User login", "Anon Key"],
    ]
    story.append(Paragraph("<i>Table 3.2: API Endpoint Summary</i>", S['Caption']))
    story.append(make_table(api_data, col_widths=[130, 50, 150, 80]))
    
    story.append(page_break())
    return story
