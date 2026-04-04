"""Chapter 1: Introduction (approx. 2000-2500 words)"""
from reportlab.platypus import Paragraph, Spacer, PageBreak
from .helpers import spacer, page_break, make_table

def build_chapter1(S):
    story = []
    
    story.append(Paragraph("CHAPTER 1", S['ChapterTitle']))
    story.append(Paragraph("INTRODUCTION", S['ChapterTitle']))
    story.append(spacer(16))
    
    # 1.1 Background
    story.append(Paragraph("1.1 Background and Motivation", S['SectionTitle']))
    story.append(Paragraph(
        "The global employment landscape has undergone a dramatic transformation over the past two decades, "
        "driven by rapid digitalization, the proliferation of online job portals, and the advent of "
        "sophisticated recruitment technologies. In this era, a resume serves as the primary instrument "
        "through which job seekers present their qualifications, skills, and professional experiences to "
        "potential employers. The quality, structure, and content of a resume can significantly influence "
        "whether a candidate progresses through the initial screening stages or is eliminated from "
        "consideration entirely.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "According to a 2024 report by Jobscan, approximately 98.8% of Fortune 500 companies utilize "
        "Applicant Tracking Systems (ATS) to manage and filter incoming applications. These systems employ "
        "algorithms that parse resume content, extract structured data, and rank candidates based on "
        "keyword relevance, formatting compliance, and content completeness. Research by TopResume indicates "
        "that over 75% of resumes are rejected by ATS software before a human recruiter ever reviews them, "
        "making ATS optimization a critical skill for modern job seekers.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "Despite the critical importance of ATS compatibility, the majority of job seekers — particularly "
        "recent graduates and early-career professionals — lack awareness of how ATS systems evaluate "
        "resumes. Common mistakes include using complex formatting elements such as tables, graphics, and "
        "unusual fonts that confuse ATS parsers; failing to incorporate relevant keywords from job "
        "descriptions; omitting critical sections like professional summaries and quantifiable achievements; "
        "and using non-standard section headings that ATS algorithms cannot categorize properly.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "The emergence of Artificial Intelligence, particularly Large Language Models (LLMs) such as GPT-4, "
        "Claude 3 Opus, and Gemini, has opened new possibilities for intelligent resume optimization. These "
        "models can analyze resume content contextually, generate professional descriptions using action "
        "verbs and quantifiable metrics, suggest role-specific keywords, and provide personalized "
        "improvement recommendations. The convergence of ATS awareness and AI capabilities presents an "
        "opportunity to develop tools that democratize access to professional resume optimization.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "This project, <b>AI Resume Studio</b>, was conceptualized as a response to these challenges. It "
        "aims to bridge the gap between what job seekers know about resume writing and what modern hiring "
        "systems demand. By combining a sophisticated ATS scoring engine with AI-powered content assistance, "
        "the platform empowers users to create resumes that are not only visually professional but also "
        "algorithmically optimized for maximum visibility in modern recruitment pipelines.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "The motivation for this project stems from firsthand observations of the struggles faced by "
        "students and fresh graduates in crafting effective resumes. During campus placement drives and job "
        "application processes, it became evident that most candidates were unaware of ATS requirements and "
        "lacked access to professional resume writing assistance. Traditional resume builders offer "
        "template-based solutions without intelligent content guidance, while professional resume writing "
        "services are prohibitively expensive for most students. AI Resume Studio addresses this gap by "
        "providing an intelligent, accessible, and feature-rich platform that guides users through every "
        "aspect of resume creation and optimization.", S['Body']))
    story.append(spacer(6))

    story.append(Paragraph("<b>1.1.1 The Emerging AI Economy and Recruitment</b>", S['SubSection']))
    story.append(Paragraph(
        "The shift towards an AI-centric economy has redefined what constitutes a competitive job "
        "application. Career portals now leverage predictive analytics to match candidate profiles "
        "to high-velocity roles. This necessitates a 'Machine-First' design strategy where the "
        "resume document is treated as structured data rather than a static visual artifact. "
        "AI Resume Studio adopts this paradigm, emphasizing machine-readability without sacrificing "
        "human-centric aesthetic appeal. This architectural choice is informed by the growing "
        "demand for candidates who understand and can leverage AI-driven workflows.", S['Body']))
    story.append(spacer(6))

    story.append(Paragraph("<b>1.1.2 Academic Significance and Student Impact</b>", S['SubSection']))
    story.append(Paragraph(
        "For final-year Computer Science (BCA/MCA) students, the transition from academia to the "
        "professional workforce is a critical juncture. The lack of standardized guidance often "
        "results in 'Skill-Experience Mismatch' — where a student's technical capabilities are "
        "excellent, but their resume fails to communicate this to automated screening tools. "
        "By participating in the development of AI Resume Studio, this project contributes to "
        "creating a domain-specific expert system that alleviates this transitional friction, "
        "providing a technical solution to a socio-economic problem.", S['Body']))
    story.append(spacer(6))
    
    # 1.2 Problem Statement
    story.append(Paragraph("1.2 Problem Statement", S['SectionTitle']))
    story.append(Paragraph(
        "The current landscape of resume building tools presents several significant limitations that "
        "hinder job seekers from creating truly effective resumes. These limitations can be categorized "
        "into four key problem areas:", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "<b>Problem 1: Lack of ATS Awareness and Feedback.</b> Most existing resume builders focus "
        "exclusively on visual design and template aesthetics, completely ignoring ATS compatibility. "
        "Users create visually appealing resumes that fail to pass through automated screening systems "
        "because they contain formatting elements, graphics, or content structures that ATS parsers "
        "cannot process. There is a critical absence of real-time feedback mechanisms that inform users "
        "about how their resume would perform when processed by an ATS.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "<b>Problem 2: Generic and Unintelligent Content Assistance.</b> While some platforms offer "
        "pre-written content suggestions, these are typically generic, non-contextual, and fail to "
        "consider the user's specific background, target role, or industry. The suggestions are often "
        "outdated clichés rather than modern, impact-driven bullet points that recruiters value. There "
        "is no intelligent system that can analyze a user's existing content and provide personalized, "
        "role-specific improvement recommendations.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "<b>Problem 3: Absence of Keyword Optimization.</b> ATS systems heavily rely on keyword "
        "matching to rank candidates. Job seekers frequently fail to align their resume content with "
        "the specific terminology used in target job descriptions. Existing tools do not provide "
        "keyword analysis, job description matching, or intelligent suggestions for incorporating "
        "relevant keywords naturally into resume content.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "<b>Problem 4: Fragmented User Experience.</b> Currently, job seekers must use multiple "
        "disconnected tools — a resume builder for design, a separate ATS checker for compatibility "
        "analysis, and expensive professional services for content improvement. This fragmented "
        "approach is time-consuming, inconsistent, and often produces suboptimal results. There is "
        "a clear need for an integrated platform that combines resume building, ATS analysis, and "
        "AI-powered content optimization in a single, cohesive experience.", S['Body']))
    
    # 1.3 Objectives
    story.append(Paragraph("1.3 Objectives of the Study", S['SectionTitle']))
    story.append(Paragraph(
        "The primary objective of this project is to design, develop, and evaluate an AI-powered resume "
        "building platform that integrates ATS scoring capabilities with intelligent content assistance. "
        "The specific objectives are enumerated below:", S['Body']))
    story.append(spacer(6))
    
    objectives = [
        "To develop a comprehensive, multi-step resume builder with a dual-pane live preview system "
        "supporting 20 professionally designed templates across classic, modern, and color-accented categories.",
        
        "To design and implement a weighted ATS scoring engine that evaluates resumes across five dimensions: "
        "keyword relevance (40%), skill alignment (20%), experience depth (20%), formatting compliance (10%), "
        "and section completeness (10%), providing users with detailed, actionable improvement recommendations.",
        
        "To integrate AI-powered content generation capabilities using Large Language Models (Claude 3 Opus "
        "via OpenRouter API) for professional summary writing, experience bullet point generation, skill "
        "suggestions, and achievement descriptions.",
        
        "To implement a context-aware AI assistant that receives the user's current resume state as structured "
        "input and provides personalized, role-specific guidance throughout the resume building process.",
        
        "To develop a skill and language proficiency rating system that allows users to specify competency "
        "levels using star ratings or proficiency descriptors, enhancing the precision and ATS relevance of "
        "these critical resume sections.",
        
        "To implement a high-fidelity PDF export engine using jsPDF that preserves template design, "
        "typography, and layout across all 20 templates with precision A4 page formatting.",
        
        "To build the platform using modern, scalable web technologies including React 18, TypeScript, "
        "Vite, Tailwind CSS, Shadcn/UI component library, and Supabase backend services, demonstrating "
        "enterprise-grade software architecture.",
        
        "To evaluate the system through comprehensive testing of ATS scoring accuracy, AI response quality, "
        "and overall user experience, validating the platform's effectiveness as a resume optimization tool."
    ]
    
    for i, obj in enumerate(objectives, 1):
        story.append(Paragraph(f"<b>Objective {i}:</b> {obj}", S['BodyIndent']))
        story.append(spacer(4))
    
    # 1.4 Scope
    story.append(Paragraph("1.4 Scope of the Project", S['SectionTitle']))
    story.append(Paragraph(
        "The scope of AI Resume Studio encompasses the complete lifecycle of resume creation, from initial "
        "content entry to final PDF export, with integrated ATS analysis and AI assistance at every stage. "
        "The following delineates the boundaries of this project:", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>In Scope:</b>", S['SubSection']))
    in_scope = [
        "Multi-step resume builder with 10 configurable sections (Profile, Education, Projects, Skills, "
        "Languages, Achievements, Experience, Certifications, Templates, Preview).",
        "20 professionally designed resume templates (10 classic + 10 color-accented) with live preview.",
        "Rule-based ATS scoring engine with weighted multi-dimensional evaluation.",
        "AI-enhanced scoring with blended rule-based and LLM-based analysis.",
        "AI content generation for summaries, project descriptions, experience bullets, skills, and achievements.",
        "Context-aware floating AI assistant with resume state injection.",
        "Section reordering and toggle functionality for customizable resume layouts.",
        "Photo upload with data URL encoding for resume profiles.",
        "High-fidelity PDF export engine with template-specific rendering.",
        "Auto-save functionality with cloud persistence via Supabase.",
        "Dark/light theme toggle with persistent preferences.",
        "Responsive design optimized for desktop and tablet viewports.",
    ]
    for item in in_scope:
        story.append(Paragraph(f"• {item}", S['ThesisBullet']))
    
    story.append(spacer(8))
    story.append(Paragraph("<b>Out of Scope:</b>", S['SubSection']))
    out_scope = [
        "Job description parsing and automated keyword extraction from external job postings.",
        "Multi-language resume generation (currently English only).",
        "DOCX export format (currently PDF only).",
        "LinkedIn profile import and synchronization.",
        "Payment gateway integration for premium subscription tiers.",
        "Mobile-native application development (Android/iOS).",
    ]
    for item in out_scope:
        story.append(Paragraph(f"• {item}", S['ThesisBullet']))
    
    # 1.5 Significance
    story.append(Paragraph("1.5 Significance of the Study", S['SectionTitle']))
    story.append(Paragraph(
        "This study makes several significant contributions to the fields of web application development, "
        "AI-assisted content generation, and recruitment technology:", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "<b>Academic Contribution:</b> The project demonstrates the practical application of modern web "
        "development frameworks (React 18, TypeScript, Vite) combined with AI integration (LLM APIs) in "
        "solving real-world problems. It provides a comprehensive case study of full-stack application "
        "development following enterprise-grade architectural patterns.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "<b>Social Impact:</b> By making professional-grade resume optimization accessible to students "
        "and fresh graduates, the platform democratizes access to tools that were previously available "
        "only through expensive professional services. This has the potential to improve employment "
        "outcomes for underserved populations.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "<b>Technical Innovation:</b> The integration of a weighted ATS scoring algorithm with LLM-based "
        "content analysis represents a novel approach to resume evaluation. The blended scoring methodology "
        "(60% rule-based + 40% AI-based) provides more accurate and nuanced feedback than either approach "
        "alone.", S['Body']))
    
    # 1.5.1 Methodology Overview
    story.append(Paragraph("1.5.1 Research and Development Methodology", S['SectionTitle']))
    story.append(Paragraph(
        "The development of AI Resume Studio followed a modified Agile methodology, incorporating "
        "User-Centered Design (UCD) principles to ensure the platform meets the actual needs of "
        "job seekers. The process was divided into four primary phases:", S['Body']))
    story.append(spacer(6))
    method_data = [
        ["Phase", "Activities", "Outcomes"],
        ["Analysis", "Literature review, competitor analysis, requirements gathering", "Requirements Spec"],
        ["Design", "UI/UX wireframing, architecture design, ERD modeling", "Design Blueprints"],
        ["Implementation", "Component development, API integration, scoring engine coding", "Functional Prototype"],
        ["Evaluation", "Unit testing, system testing, performance benchmarking", "Validation Report"],
    ]
    story.append(make_table(method_data, col_widths=[80, 220, 150]))
    story.append(spacer(12))

    story.append(Paragraph("1.5.2 Project Schedule and Timeline", S['SectionTitle']))
    story.append(Paragraph(
        "The project was executed over a period of 16 weeks, following the milestones "
        "and deliverables outlined in the table below:", S['Body']))
    story.append(spacer(6))
    schedule_data = [
        ["Week", "Milestone", "Status"],
        ["1-2", "Problem Definition & Literature Review", "Completed"],
        ["3-4", "System Design & Architecture Modeling", "Completed"],
        ["5-8", "Core Frontend Development & UI Systems", "Completed"],
        ["9-10", "Backend Integration (Supabase & OpenRouter)", "Completed"],
        ["11-13", "ATS Scoring Engine & AI Prompt Tuning", "Completed"],
        ["14-16", "Testing, Debugging & Thesis Documentation", "Completed"],
    ]
    story.append(make_table(schedule_data, col_widths=[60, 310, 80]))
    story.append(spacer(12))

    # 1.6 Organization
    story.append(Paragraph("1.6 Organization of the Thesis", S['SectionTitle']))
    story.append(Paragraph(
        "This thesis is organized into six chapters, each addressing a specific aspect of the project:", S['Body']))
    story.append(spacer(6))

    org = [
        ("<b>Chapter 1 — Introduction:</b>", "Presents the background, problem statement, objectives, scope, and significance of the study."),
        ("<b>Chapter 2 — Literature Review:</b>", "Reviews existing resume building tools, ATS systems, AI in recruitment, technology comparisons, and identifies the research gap."),
        ("<b>Chapter 3 — System Design:</b>", "Details the system architecture, data flow diagrams, use case diagrams, ER diagrams, technology stack, and database schema design."),
        ("<b>Chapter 4 — Implementation:</b>", "Describes the development process, folder structure, frontend and backend implementation, ATS engine, AI integration, and PDF export system."),
        ("<b>Chapter 5 — Results and Discussion:</b>", "Presents system outputs, testing results for ATS scoring and AI features, performance analysis, and comparative evaluation."),
        ("<b>Chapter 6 — Conclusion and Future Scope:</b>", "Summarizes contributions, discusses limitations, and outlines future enhancements."),
    ]
    for title, desc in org:
        story.append(Paragraph(f"{title} {desc}", S['BodyIndent']))
        story.append(spacer(4))
    
    story.append(spacer(12))

    story.append(Paragraph("<b>1.6.1 Summary of Core Research Tools</b>", S['SubSection']))
    story.append(Paragraph(
        "The following table summarizes the primary research and development tools "
        "used during various project phases.", S['Body']))
    story.append(spacer(6))
    research_tools = [
        ["Phase", "Primary Tool", "Outcome"],
        ["Requirement Analysis", "Interview, Comparative Analysis", "User Story Matrix"],
        ["System Design", "Lucidchart, ERD tools", "Schema & DFD Diagrams"],
        ["Frontend Dev", "React 18, Vite, TS", "Production-ready UI"],
        ["Backend Dev", "Supabase (PostgreSQL)", "Secure Cloud Sync"],
        ["AI Integration", "Claude 3 Opus, OpenRouter", "Intelligent Content Engine"],
    ]
    story.append(make_table(research_tools, col_widths=[110, 150, 150]))
    story.append(spacer(12))

    story.append(page_break())
    return story
