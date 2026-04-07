from reportlab.platypus import Paragraph
from .helpers import spacer, page_break, img_cap, code_cap

def build_chapter1(S):
    story = []
    
    # ── 1. CHAPTER TITLE ──
    story.append(Paragraph("Chapter 1: Introduction", S['ChapterTitle']))
    story.append(spacer(18))
    
    # ── 1.1 OVERVIEW ──
    story.append(Paragraph("1.1 Project Overview", S['SectionTitle']))
    story.append(Paragraph(
        "AI Resume Studio is a comprehensive, next-generation platform designed to address the increasing "
        "complexities of the modern job market. As organizations leverage more sophisticated automated "
        "systems for candidate screening, the burden of formatting and keyword optimization has shifted "
        "squarely onto the job seeker. This project provides a robust solution by integrating high-fidelity "
        "UI rendering with state-of-the-art Large Language Models (LLMs).", S['Body']))
    
    story.extend(img_cap("problem_statement", "The structural gap between traditional resumes and modern ATS requirements", S))
    
    story.append(Paragraph(
        "The system is built on a foundation of real-time interaction, where every user modification "
        "is immediately reflected in a live preview. This 'What You See Is What You Get' (WYSIWYG) "
        "approach eliminates the guesswork typically associated with resume builders. Users can "
        "visualize their content in over 20 professional templates, ensuring their profile stands "
        "out visually while remaining technically compatible with parsing engines.", S['Body']))
    story.append(spacer(12))

    # ── 1.2 SYSTEM DEVELOPMENT LIFECYCLE ──
    story.append(Paragraph("1.2 System Development Lifecycle (SDLC)", S['SectionTitle']))
    story.append(Paragraph(
        "To ensure high quality and reliability, the project followed a hybrid V-Model SDLC approach. "
        "This allowed for rigorous testing at each stage of development, from initial requirement "
        "gathering to final deployment. The V-model emphasizes the relationship between development "
        "phases and their corresponding testing phases, ensuring that every feature is validated against "
        "the user's initial needs.", S['Body']))
    
    story.extend(img_cap("sdlc_v", "The V-Model SDLC implemented for AI Resume Studio development", S))
    
    story.append(Paragraph(
        "Detailed requirement analysis revealed three core user personas: Entry-level students "
        "needing structural guidance, Mid-career professionals seeking optimization, and Admin "
        "users managing platform content. This diversity of needs dictated a flexible, component-based "
        "architecture.", S['Body']))
    story.append(spacer(12))

    # ── 1.3 PROJECT MOTIVATION ──
    story.append(Paragraph("1.3 Project Motivation and Objectives", S['SectionTitle']))
    story.append(Paragraph(
        "The motivation behind this project stems from the observed statistics that over 75% of "
        "resumes are rejected by automated filters before reaching a recruiter. Our primary "
        "objectives were to build a system that can:", S['Body']))
    
    story.extend(img_cap("sdlc_agile", "Iterative Agile sprints used during the implementation phase", S))
    
    objectives = [
        "Simplify professional resume creation through an intuitive user interface.",
        "Provide automated suggestion engines for skills and experience descriptions.",
        "Implement a rule-based ATS scoring system for immediate feedback.",
        "Enable high-fidelity exports that maintain formatting across all platforms."
    ]
    for obj in objectives:
        story.append(Paragraph(f"• {obj}", S['BodyIndent']))
    story.append(spacer(12))

    # ── 1.4 MARKET ANALYSIS ──
    story.append(Paragraph("1.4 Market Analysis and Trends", S['SectionTitle']))
    story.append(Paragraph(
        "The HRTech industry is witnessing a seismic shift towards AI-centric tools. Traditional "
        "resume builders are becoming obsolete as they lack the intelligence to provide content "
        "critique. AI Resume Studio enters this market by offering a unique blend of visual "
        "design and semantic intelligence.", S['Body']))
    
    story.extend(img_cap("market_trends", "Current trends and growth metrics in the AI-driven recruitment sector", S))
    
    story.append(Paragraph(
        "According to industry reports, platforms that integrate LLMs see a 400% increase in "
        "user retention due to the significantly reduced 'blank page' syndrome. By providing "
        "pre-filled suggestions and role-specific descriptions, we empower users to complete "
        "their profiles 10 times faster than manual drafting.", S['Body']))
    story.append(spacer(12))

    # ── 1.5 SWOT ANALYSIS ──
    story.append(Paragraph("1.5 Strategic Position (SWOT Analysis)", S['SectionTitle']))
    story.append(Paragraph(
        "An internal audit of the platform reveals strong competitive advantages, particularly "
        "in its integration of Claude-3 Opus, which provides superior career advice compared to "
        "smaller models. The following diagram summarizes our strategic strengths and weaknesses.", S['Body']))
    
    story.extend(img_cap("swot_analysis", "SWOT Analysis of the AI Resume Studio platform", S))
    
    story.append(Paragraph(
        "Our primary strength lies in the 'ATS Scoring Logic', which is a proprietary rule-based "
        "engine that audits keyword density and section completeness. While competitors offer "
        "static templates, we provide a dynamic score that changes as you type.", S['Body']))
    story.append(spacer(12))

    # ── 1.6 PROJECT ROADMAP ──
    story.append(Paragraph("1.6 Development Roadmap", S['SectionTitle']))
    story.append(Paragraph(
        "The development was structured into four distinct phases. Phase 1 focused on the "
        "core React architecture. Phase 2 integrated the Supabase backend. Phase 3 introduced "
        "the AI layers, and Phase 4 finalized the PDF rendering engine.", S['Body']))
    
    story.extend(img_cap("project_roadmap", "Sequential project phases from initial prototype to final release", S))
    
    story.append(Paragraph(
        "This roadmap ensured that the platform had a stable 'MVP' (Minimum Viable Product) "
        "very early in the process, allowing for user feedback and iterative refinement "
        "of the AI system prompts.", S['Body']))
    story.append(spacer(12))

    # ── 1.7 CORE TECHNOLOGICAL PILLARS ──
    story.append(Paragraph("1.7 Core Technological Pillars", S['SectionTitle']))
    story.append(Paragraph(
        "The system's reliability is anchored by three technological pillars: Frontend Excellence, "
        "Backend Scalability, and AI Semantic Intelligence. Each pillar uses industry-standard "
        "protocols to ensure the platform remains future-proof.", S['Body']))
    
    story.extend(img_cap("pillar_tech", "The three technological pillars supporting the system architecture", S))
    
    story.append(Paragraph(
        "The project serves as a comprehensive tool for job seekers at all stages of their career. "
        "The scope includes a modular resume builder where users can selectively enable "
        "different sections like Certifications, Projects, and Achievements. "
        "This modularity is handled by a dynamic JSON schema that allows for "
        "infinite flexibility in section ordering and visibility.", S['Body']))
    story.append(Paragraph(
        "By focusing on 'ATS Optimisation' from day one, we ensure that every "
        "exported document follows the strict formatting rules expected by "
        "Fortune 500 companies. This includes header placement, font "
        "embeddedness, and keyword hierarchy. The scope also extends to real-time "
        "scoring, where the system provides immediate feedback on the candidate's "
        "competitiveness based on industry benchmarks.", S['Body']))
    story.append(Paragraph(
        "Furthermore, we include a 'Template Registry' that guarantees visual "
        "consistency across all designs while maintaining machine-readability. "
        "The project does not just stop at generation; it includes an 'AI Audit' "
        "feature that critiques the user's wording and suggests better alternatives "
        "using professional terminology.", S['Body']))
    story.append(spacer(12))

    # ── 1.8 VISION & MISSION ──
    story.append(Paragraph("1.8 Vision and Mission", S['SectionTitle']))
    story.append(Paragraph(
        "Our vision is to become the default career companion for job seekers worldwide, "
        "democratizing access to high-end resume consulting. Our mission is to continue "
        "innovating at the intersection of AI and document engineering.", S['Body']))
    
    story.extend(img_cap("vision_mission", "Organizational vision and mission flow", S))
    
    story.append(Paragraph(
        "Users can see their 'Baseline' score (rule-based) and then trigger the "
        "AI Audit for a deeper critique. This 'Blended' score provides a "
        "highly accurate picture of the resume's competitiveness. "
        "The auditory dashboard is implemented in 'DashboardHome.tsx', which "
        "aggregates all user-specific data into a single, high-performance view. "
        "The AI audit is particularly effective at identifying 'Passive Language' "
        "and converting it into 'Action-Oriented' metrics that recruiters love.", S['Body']))
    story.append(Paragraph(
        "Modern HR departments use sophisticated Applicant Tracking Systems (ATS) to process "
        "thousands of applications. These systems use Natural Language Processing (NLP) to "
        "rank candidates based on keyword frequency, structural parsing, and job title relevance. "
        "This shift means candidates must now optimize for machines as much as for humans, "
        "a challenge that our platform directly addresses through real-time feedback loop. "
        "We also examine the impact of 'Multi-Factor' screening where social media "
        "presence and portfolio quality are increasingly becoming part of the automated audit.", S['Body']))
    story.append(Paragraph(
        "Our research shows that most candidates struggle with 'Keyword Optimization'. By "
        "integrating AI-driven suggestions, we help users identify industry-specific terms "
        "that are most likely to be flagged as 'Relevant' by modern ATS algorithms, thereby "
        "drastically improving their chances of passing the initial automated screening. "
        "The literature suggests that a well-optimized resume is 3x more likely to "
        "secure an interview in the current tech landscape.", S['Body']))
    story.append(Paragraph(
        "Furthermore, we explore the concept of 'AI Sovereignty' where users "
        "retain control over how their data is used for model training. Our "
        "platform follows strict ethical AI guidelines, ensuring that the "
        "suggestions provided are unbiased and based purely on professional "
        "merit and industry standards.", S['Body']))
    story.append(spacer(12))

    # ── 1.9 IMPLEMENTATION PREVIEW ──
    story.append(Paragraph("1.9 Initial Implementation Preview", S['SectionTitle']))
    story.append(Paragraph(
        "The following code shows the main application entry point where routing and "
        "authentication providers are configured.", S['Body']))
    story.extend(code_cap("src/App.tsx", 1, 60, "App.tsx - Core Routing and Global Context", S))

    return story
