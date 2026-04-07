#!/usr/bin/env python3
"""
Generate all graphviz diagrams for the thesis:
- System Flow for Admin
- System Flow for User
- Activity Diagram for Admin
- Activity Diagram for User
- State Diagram for Admin
- State Diagram for User
- DFD Level 0 (Context)
- DFD Level 1
- Architecture Diagram
"""
import os
import subprocess

DIAG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'thesis_diagrams')
os.makedirs(DIAG_DIR, exist_ok=True)

def gen(name, dot_source):
    dot_file = os.path.join(DIAG_DIR, f"{name}.dot")
    png_file = os.path.join(DIAG_DIR, f"{name}.png")
    with open(dot_file, 'w') as f:
        f.write(dot_source)
    result = subprocess.run(['dot', '-Tpng', '-Gdpi=200', dot_file, '-o', png_file], capture_output=True)
    if result.returncode == 0:
        print(f"  ✅ {png_file}")
    else:
        print(f"  ❌ {name}: {result.stderr.decode()}")
    return png_file

# 1. System Flow for ADMIN
gen("sys_flow_admin", """
digraph {
  rankdir=TB;
  node [shape=box, style="rounded,filled", fillcolor="#dbeafe", fontname="Arial", fontsize=13, margin="0.2,0.1"];
  edge [fontname="Arial", fontsize=11];

  Start [shape=oval, fillcolor="#bbf7d0", label="Start"];
  Login [label="Login"];
  ManageTemplates [label="Manage Templates"];
  ViewStats [label="View Platform Statistics"];
  ManageUsers [label="Manage Users &\\nSubscriptions"];
  Stop [shape=oval, fillcolor="#fecaca", label="Stop"];

  Start -> Login -> ManageTemplates -> ViewStats -> ManageUsers -> Stop;
}
""")

# 2. System Flow for USER
gen("sys_flow_user", """
digraph {
  rankdir=TB;
  node [shape=box, style="rounded,filled", fillcolor="#dbeafe", fontname="Arial", fontsize=13, margin="0.2,0.1"];
  edge [fontname="Arial", fontsize=11];

  Start [shape=oval, fillcolor="#bbf7d0", label="Start"];
  Register [label="Register"];
  Login [label="Login"];
  CheckLogin [shape=diamond, fillcolor="#fef3c7", label="Login\\nValid?"];
  Dashboard [label="Dashboard"];
  Builder [label="Open Resume Builder"];
  FillDetails [label="Fill Resume Details\\n& Get AI Suggestions"];
  ATSCheck [label="Analyse ATS Score"];
  Download [label="Download PDF"];
  Stop [shape=oval, fillcolor="#fecaca", label="Stop"];

  Start -> Register -> Login -> CheckLogin;
  CheckLogin -> Dashboard [label="Yes"];
  CheckLogin -> Register [label="No"];
  Dashboard -> Builder -> FillDetails -> ATSCheck -> Download -> Stop;
}
""")

# 3. Activity Diagram - Admin
gen("activity_admin", """
digraph {
  rankdir=TB;
  node [fontname="Arial", fontsize=12];

  Start [shape=circle, style=filled, fillcolor=black, width=0.3, label=""];
  End   [shape=doublecircle, style=filled, fillcolor=black, width=0.3, label=""];

  Login [shape=box, style="rounded,filled", fillcolor="#dbeafe", label="Login to Admin Panel"];
  Fork  [shape=rect, width=3.5, height=0.15, style=filled, fillcolor=black, label=""];
  Join  [shape=rect, width=3.5, height=0.15, style=filled, fillcolor=black, label=""];

  A [shape=box, style="rounded,filled", fillcolor="#f0fdf4", label="Manage Users"];
  B [shape=box, style="rounded,filled", fillcolor="#f0fdf4", label="Update Templates"];
  C [shape=box, style="rounded,filled", fillcolor="#f0fdf4", label="View Analytics\\n& Reports"];

  Start -> Login -> Fork;
  Fork  -> A;
  Fork  -> B;
  Fork  -> C;

  A -> Join;
  B -> Join;
  C -> Join;

  Join -> End;
}
""")

# 4. Activity Diagram - User
gen("activity_user", """
digraph {
  rankdir=TB;
  node [fontname="Arial", fontsize=12];

  Start [shape=circle, style=filled, fillcolor=black, width=0.3, label=""];
  End   [shape=doublecircle, style=filled, fillcolor=black, width=0.3, label=""];

  Register  [shape=box, style="rounded,filled", fillcolor="#dbeafe", label="Register"];
  Login     [shape=box, style="rounded,filled", fillcolor="#dbeafe", label="Login"];
  Verify    [shape=diamond, style=filled, fillcolor="#fef3c7", label="Verify Login?"];
  Fork      [shape=rect, width=3.5, height=0.15, style=filled, fillcolor=black, label=""];
  Join      [shape=rect, width=3.5, height=0.15, style=filled, fillcolor=black, label=""];

  A [shape=box, style="rounded,filled", fillcolor="#f0fdf4", label="Create Resume"];
  B [shape=box, style="rounded,filled", fillcolor="#f0fdf4", label="Check ATS Score"];
  C [shape=box, style="rounded,filled", fillcolor="#f0fdf4", label="Download PDF"];

  Start -> Register -> Login -> Verify;
  Verify -> Fork  [label="Yes"];
  Verify -> Login [label="No"];

  Fork -> A;
  Fork -> B;
  Fork -> C;

  A -> Join;
  B -> Join;
  C -> Join;

  Join -> End;
}
""")

# 5. State Diagram - Admin
gen("state_admin", """
digraph {
  rankdir=LR;
  node [shape=box, style="rounded,filled", fillcolor="#dbeafe", fontname="Arial", fontsize=12];
  edge [fontname="Arial", fontsize=11];

  Start [shape=circle, style=filled, fillcolor=black, width=0.3, label=""];
  End   [shape=doublecircle, style=filled, fillcolor=black, width=0.3, label=""];

  Login       [label="Logged In"];
  AddTemplate [label="Add / Update\\nTemplates"];
  UpdateSubject [label="Update AI\\nSettings"];
  ViewData    [label="View User\\nAnalytics"];

  Start -> Login;
  Login -> AddTemplate    [label="Manage Content"];
  Login -> UpdateSubject  [label="AI Settings"];
  Login -> ViewData       [label="Analytics"];

  AddTemplate   -> End [label="Logout"];
  UpdateSubject -> End [label="Logout"];
  ViewData      -> End [label="Logout"];
}
""")

# 6. State Diagram - User
gen("state_user", """
digraph {
  rankdir=TB;
  node [shape=box, style="rounded,filled", fillcolor="#dbeafe", fontname="Arial", fontsize=12];
  edge [fontname="Arial", fontsize=11];

  Start     [shape=circle, style=filled, fillcolor=black, width=0.3, label=""];
  End       [shape=doublecircle, style=filled, fillcolor=black, width=0.3, label=""];

  Register  [label="Enter Details\\n& Register"];
  Login     [label="Login"];
  Dashboard [label="Select Template\\n& Open Builder"];
  Edit      [label="Edit Resume\\n& AI Suggestions"];
  Score     [shape=diamond, style=filled, fillcolor="#fef3c7", label="ATS Score\\n>= 70?"];
  Download  [label="Download PDF"];

  Start     -> Register;
  Register  -> Login;
  Login     -> Dashboard;
  Dashboard -> Edit;
  Edit      -> Score;
  Score     -> Edit     [label="No - Improve"];
  Score     -> Download [label="Yes"];
  Download  -> End;
}
""")

# 7. DFD Level 0 (Context Diagram)
gen("dfd_level0", """
digraph {
  rankdir=LR;
  node [fontname="Arial", fontsize=12];
  edge [fontname="Arial", fontsize=10];

  User     [shape=box, style="filled", fillcolor="#dbeafe", label="USER"];
  System   [shape=ellipse, style="filled", fillcolor="#bbf7d0", label="AI Resume Studio\\nSystem"];
  AIService[shape=box, style="filled", fillcolor="#fef3c7", label="OpenRouter /\\nClaude Opus"];

  User     -> System    [label="Resume Data, Job Details"];
  System   -> User      [label="ATS Score, PDF, AI Suggestions"];
  System   -> AIService [label="AI Requests (Prompt)"];
  AIService-> System    [label="AI Responses (Content)"];
}
""")

# 8. DFD Level 1
gen("dfd_level1", """
digraph {
  rankdir=TB;
  node [fontname="Arial", fontsize=11];
  edge [fontname="Arial", fontsize=10];

  User    [shape=box, style="filled", fillcolor="#dbeafe", label="USER"];
  P1      [shape=ellipse, style="filled", fillcolor="#f0fdf4", label="1.0\\nResume Builder"];
  P2      [shape=ellipse, style="filled", fillcolor="#f0fdf4", label="2.0\\nATS Scoring\\nEngine"];
  P3      [shape=ellipse, style="filled", fillcolor="#f0fdf4", label="3.0\\nAI Content\\nGenerator"];
  P4      [shape=ellipse, style="filled", fillcolor="#f0fdf4", label="4.0\\nScore Display"];
  P5      [shape=ellipse, style="filled", fillcolor="#f0fdf4", label="5.0\\nPDF Export"];
  DB      [shape=cylinder, style="filled",fillcolor="#fef3c7", label="Supabase\\nDatabase"];
  AI      [shape=box,      style="filled",fillcolor="#fecdd3", label="OpenRouter\\nAPI"];
  PDF     [shape=note,     style="filled",fillcolor="#e0e7ff", label="PDF File"];

  User -> P1 [label="Personal Info, Skills,\\nExperience, Education"];
  P1   -> P2 [label="Resume JSON"];
  P2   -> P4 [label="Score + Feedback"];
  P1   -> P3 [label="Context Data"];
  P3   -> AI [label="API Call"];
  AI   -> P3 [label="Generated Content"];
  P3   -> P1 [label="Inserted Text"];
  P1   -> DB [label="Auto-Save (10s)"];
  P1   -> P5 [label="Resume Data"];
  P5   -> PDF[label=""];
}
""")

# 9. Architecture Overview (Already exists, but let's keep it)
gen("architecture", """
digraph {
  rankdir=LR;
  compound=true;
  node [fontname="Arial", fontsize=11];

  subgraph cluster_frontend {
    label="Frontend (React 18 + Vite)";
    style="filled"; fillcolor="#eff6ff";
    Builder [label="Resume\\nBuilder"];
    Score   [label="ATS\\nScore"];
    Export  [label="PDF\\nExport"];
    AI      [label="AI\\nAssistant"];
  }

  subgraph cluster_backend {
    label="Backend (Supabase)";
    style="filled"; fillcolor="#f0fdf4";
    PG    [label="PostgreSQL\\nDatabase"];
    Auth  [label="Auth /\\nJWT"];
    Edge  [label="Edge\\nFunctions"];
  }

  subgraph cluster_ai {
    label="AI Gateway (OpenRouter)";
    style="filled"; fillcolor="#fefce8";
    Claude [label="Claude 3\\nOpus"];
  }

  Builder -> PG    [ltail=cluster_frontend, label="REST / CRUD"];
  Builder -> Claude[ltail=cluster_frontend, lhead=cluster_ai, label="AI API Calls"];
  PG -> Auth       [ltail=cluster_backend];
}
""")

# 10. Component Hierarchy
gen("component_tree", """
digraph {
  rankdir=TB;
  node [shape=box, style="rounded,filled", fillcolor="#dbeafe", fontname="Arial"];
  
  App [label="App.tsx"];
  Dashboard [label="Dashboard.tsx"];
  Builder [label="ResumeBuilder.tsx"];
  Preview [label="LivePreview.tsx"];
  Sidebar [label="BuilderSidebar.tsx"];
  Export [label="ExportResume.tsx"];
  Score [label="ResumeScore.tsx"];
  AI [label="FloatingAI.tsx"];

  App -> Dashboard;
  Dashboard -> Builder;
  Dashboard -> Score;
  Dashboard -> Export;
  Builder -> Preview;
  Builder -> Sidebar;
  Builder -> AI;
}
""")

# 11. Auth Flow
gen("auth_flow", """
digraph {
  rankdir=LR;
  node [shape=box, style="rounded,filled", fillcolor="#f0fdf4", fontname="Arial"];
  
  User [label="User Credentials"];
  SupabaseAuth [label="Supabase Auth"];
  JWT [label="JWT Token"];
  Protected [label="Protected Routes"];
  DB [label="User Profile DB"];

  User -> SupabaseAuth [label="Login/Signup"];
  SupabaseAuth -> JWT [label="Verify"];
  JWT -> Protected [label="Attach"];
  SupabaseAuth -> DB [label="Sync Profile"];
}
""")

# 12. AI Resume Flow (Sequence-like)
gen("ai_sequence", """
digraph {
  rankdir=TB;
  node [shape=note, fontname="Arial"];
  
  User [label="User Input"];
  Prompt [label="Prompt Context Builder"];
  OpenRouter [label="OpenRouter API"];
  Claude [label="Claude-3 Opus"];
  UI [label="UI Update"];

  User -> Prompt;
  Prompt -> OpenRouter [label="Payload"];
  OpenRouter -> Claude [label="Refinement"];
  Claude -> OpenRouter [label="Content"];
  OpenRouter -> UI [label="Inject"];
}
""")

# 13. Data Model 상세
gen("detailed_er", """
digraph {
  node [shape=record, style=filled, fillcolor="#fff7ed", fontname="Arial"];
  
  Users [label="{Users|id : UUID (PK)\l email : text\l created_at : timestamp\l}"];
  Resumes [label="{Resumes|id : UUID (PK)\l user_id : UUID (FK)\l title : text\l data : jsonb\l template_id : text\l updated_at : timestamp\l}"];
  Profiles [label="{Profiles|id : UUID (PK/FK)\l full_name : text\l plan : text\l avatar_url : text\l}"];

  Users -> Resumes [label="1:N"];
  Users -> Profiles [label="1:1"];
}
""")

# 14. Testing Pyramid
gen("test_pyramid", """
digraph {
  node [shape=triangle, style=filled, fillcolor="#f0f9ff", fontname="Arial"];
  Pyramid [label="E2E Tests (Cypress)\l --- \l Integration Tests (Vitest)\l --- \l Unit Tests (React Testing Lib)\l"];
}
""")

# 15. Deployment Workflow
gen("deploy_flow", """
digraph {
  rankdir=LR;
  node [shape=box, style=filled, fillcolor="#ecfdf5", fontname="Arial"];
  
  Code [label="Local Dev"];
  GitHub [label="GitHub Repo"];
  Action [label="GitHub Actions / CI"];
  Supabase [label="Supabase Edge"];
  Vercel [label="Vercel Hosting"];

  Code -> GitHub -> Action;
  Action -> Supabase [label="DB Migrations"];
  Action -> Vercel [label="UI Build"];
}
""")

print("\\n✅ All diagrams generated in:", DIAG_DIR)

