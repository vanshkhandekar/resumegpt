from reportlab.platypus import Paragraph
from .helpers import spacer, page_break, img_cap, code_cap

def build_chapter3(S):
    story = []
    
    # ── 3. CHAPTER TITLE ──
    story.append(Paragraph("Chapter 3: System Design", S['ChapterTitle']))
    story.append(spacer(18))
    
    # ── 3.1 INTERACTION MODELS ──
    story.append(Paragraph("3.1 Unified Interaction Models (Use Case)", S['SectionTitle']))
    story.append(Paragraph(
        "The system's interaction model is designed to facilitate a smooth, goal-oriented "
        "user experience. By analyzing the primary 'Use Cases' for both job seekers "
        "and administrative users, we created a streamlined navigation flow.", S['Body']))
    
    story.extend(img_cap("use_case_main", "The core use case diagram highlighting user and administrator interaction", S))
    
    story.append(Paragraph(
        "For the job seeker, the 'Critical Path' involves initialization, editing, "
        "AI-assisted auditing, and final export. This 'four-step' journey is "
        "reinforced by the platform's intuitive UI layout and real-time feedback. "
        "We also account for 'Error States' where a user might lose connectivity, "
        "ensuring that the interaction model remains resilient under all conditions.", S['Body']))
    story.append(Paragraph(
        "Administrative interactions are focused on high-level oversight. The admin dashboard "
        "provides tools for managing global templates, monitoring system health, and "
        "viewing aggregate user engagement metrics. This dual-actor model ensures that "
        "the platform remains both user-friendly and administratively robust.", S['Body']))
    story.append(spacer(12))

    # ── 3.2 AUTH FLOW ──
    story.append(Paragraph("3.2 Authentication Flow and JWT Strategy", S['SectionTitle']))
    story.append(Paragraph(
        "Secure access is a non-negotiable requirement. We implemented a 'Passwordless' "
        "authentication system using 'Supabase' Auth. This ensures that users do not "
        "have to remember yet another password, reducing friction and improving security.", S['Body']))
    
    story.extend(img_cap("sequence_auth", "The passwordless authentication sequence using JWT-based session management", S))
    
    story.append(Paragraph(
        "Upon successful verification, the platform issues a JSON Web Token (JWT) "
        "that remains valid across browser reloads. This 'persistent' session is "
        "crucial for professional users who may work on their resumes over several days. "
        "The token is stored securely in the browser's local storage and is automatically "
        "attached to every outgoing API request for seamless authorization.", S['Body']))
    story.append(Paragraph(
        "We also implement 'Refresh Token' logic to maintain long-lived sessions without "
        "compromising security. If a user's session expires, the client transparently "
        "requests a new token from Supabase, ensuring that the user's creative flow "
        "is never interrupted by a login prompt during a critical editing phase.", S['Body']))
    story.append(spacer(12))

    # ── 3.3 DATABASE STRUCTURE ──
    story.append(Paragraph("3.3 Relational Database Structure (ER Diagram)", S['SectionTitle']))
    story.append(Paragraph(
        "The relational schema is optimized for 'High-Read' performance. We separate "
        "ephemeral user profile data from the core resume documents, allowing for "
        "efficient scaling as the user base grows.", S['Body']))
    
    story.extend(img_cap("er_diagram_simple", "Entity-Relationship diagram showing core table dependencies", S))
    
    story.append(Paragraph(
        "The 'Resumes' table is the central hub, containing a foreign key to the 'Users' "
        "table and a large 'JSONB' field for the resume content. This design choice "
        "allows us to modify the resume structure without performing costly DB migrations. "
        "Every time a new section like 'Certificates' or 'Projects' is added to the UI, "
        "the database schema remains unchanged, significantly reducing maintenance overhead.", S['Body']))
    story.append(Paragraph(
        "Furthermore, the 'Profiles' table stores non-document metadata such as the user's "
        "subscription tier and preferred language. This separation ensures that the core "
        "resume document remains 'lean' and focused purely on professional content, while "
        "system-level preferences are handled by a dedicated metadata layer.", S['Body']))
    story.append(spacer(12))

    # ── 3.4 PROCESS DECOMPOSITION ──
    story.append(Paragraph("3.4 Functional Process Decomposition (DFD Level 2)", S['SectionTitle']))
    story.append(Paragraph(
        "To understand the data transformations within the 'Resume Builder', we "
        "decomposed the primary process into three sub-processes: Input Capture, "
        "JSON Validation, and Template Mapping.", S['Body']))
    
    story.extend(img_cap("dfd_level2_builder", "Detailed Data Flow Diagram (DFD Level 2) for the resume builder sub-system", S))
    
    story.append(Paragraph(
        "Validation is particularly important to ensure that the AI-generated "
        "content remains 'sanitizable' and doesn't break the PDF generation "
        "logic. We use 'Zod' schema validation on the client-side for immediate feedback.", S['Body']))
    story.append(spacer(12))

    # ── 3.5 UI CLASS DESIGN ──
    story.append(Paragraph("3.5 Component Class Hierarchy and UI Design", S['SectionTitle']))
    story.append(Paragraph(
        "The UI follows a strict 'Atomic Design' pattern. Small components (atoms) "
        "like buttons and inputs are grouped into larger molecules (form fields) "
        "and eventually organisms (resume sections).", S['Body']))
    
    story.extend(img_cap("class_diagram_ui", "React component hierarchy and structural dependencies", S))
    
    story.append(Paragraph(
        "This hierarchy promotes code reuse and ensures that once a bug is fixed in an atom, "
        "the fix propagates to every page in the application. It also allows for "
        "the easy addition of 'Theming' and 'Dark Mode' in the future.", S['Body']))
    story.append(spacer(12))

    # ── 3.6 PERSISTENCE STRATEGIES ──
    story.append(Paragraph("3.6 Data Persistence and DB Indexing", S['SectionTitle']))
    story.append(Paragraph(
        "To maintain responsiveness with thousands of resumes, we utilize 'GIN' "
        "indexing in PostgreSQL. This specializes in indexing the internal "
        "key-value pairs of our JSONB data, allowing for lightning-fast queries.", S['Body']))
    
    story.extend(img_cap("db_indexing", "PostgreSQL GIN indexing strategy for high-performance JSONB querying", S))
    
    story.append(Paragraph(
        "Indexing strategy combined with 'Row Level Security' (RLS) ensures that "
        "every query is both fast and inherently secure, as the database itself "
        "filters data based on the authenticated user's ID.", S['Body']))
    story.append(spacer(12))

    # ── 3.7 SECURITY ARCHITECTURE ──
    story.append(Paragraph("3.7 End-to-End Security Architecture", S['SectionTitle']))
    story.append(Paragraph(
        "The platform implements security at four layers: Transport (SSL), Authentication (JWT), "
        "Authorization (RLS), and Application (Input Sanitization). This multi-layered "
        "approach is critical for a SaaS product.", S['Body']))
    
    story.extend(img_cap("security_layers", "A comprehensive view of the four-layered security architecture", S))
    
    story.append(Paragraph(
        "By offloading auth to Supabase, we ensure that the platform follows "
        "industry-standard security protocols without maintaining bulky infra. "
        "This allows our team to focus purely on the resume engineering logic.", S['Body']))
    story.append(spacer(12))

    # ── 3.8 UNIFIED SYSTEM ARCHITECTURE ──
    story.append(Paragraph("3.8 Unified System Infrastructure (Final Design)", S['SectionTitle']))
    story.append(Paragraph(
        "The final architecture is a reactive 'Cloud-Native' system. The frontend handles "
        "rendering and exports, while the backend handles persistence and auth. "
        "The AI gateway provides the final layer of intelligent enrichment.", S['Body']))
    
    story.extend(img_cap("architecture", "Complete system architecture overview highlighting frontend-backend integration", S))
    
    story.append(Paragraph(
        "This 'distribute-everything' approach means that no single component is a bottleneck, "
        "and scaling up only requires increasing the capacity of the corresponding "
        "cloud service.", S['Body']))
    story.append(spacer(30))

    # ── 3.9 CODE PREVIEW: SYSTEM PROMPTS ──
    story.append(Paragraph("3.9 Design Implementation: AI System Prompts", S['SectionTitle']))
    story.append(Paragraph(
        "The system prompt is the core 'Expertise' of our AI. It defines the persona, "
        "the constraints, and the output format that the AI must follow.", S['Body']))
    story.extend(code_cap("src/components/ai/FloatingAiAssistant.tsx", 150, 200, "System Prompt Design for Contextual AI Responses", S))

    return story
