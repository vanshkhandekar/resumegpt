"""Chapter 6: Conclusion and Future Scope"""
from reportlab.platypus import Paragraph
from .helpers import spacer, page_break, make_table

def build_chapter6(S):
    story = []
    
    story.append(Paragraph("CHAPTER 6", S['ChapterTitle']))
    story.append(Paragraph("CONCLUSION AND FUTURE SCOPE", S['ChapterTitle']))
    story.append(spacer(16))
    
    # 6.1 Conclusion
    story.append(Paragraph("6.1 Conclusion", S['SectionTitle']))
    story.append(Paragraph(
        "This thesis presented the design, development, and evaluation of AI Resume Studio, an "
        "AI-powered, ATS-optimized resume building platform that addresses critical gaps in the "
        "existing landscape of resume creation tools. The project successfully demonstrates the "
        "integration of modern web technologies with artificial intelligence to create a professional, "
        "accessible, and highly functional career development platform.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "The primary achievement of this project is the development of a comprehensive system that "
        "unifies resume building, ATS scoring, and AI content assistance into a single, cohesive "
        "platform. Unlike existing solutions that treat these functions as separate, disconnected "
        "services, AI Resume Studio provides an integrated experience where users receive real-time "
        "feedback and intelligent suggestions throughout their resume creation journey.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "The multi-dimensional ATS scoring engine, with its weighted evaluation across keywords (40%), "
        "skills (20%), experience (20%), formatting (10%), and completeness (10%), provides more "
        "granular and actionable feedback than traditional keyword-matching approaches. The blended "
        "scoring methodology (60% rule-based + 40% AI-based) represents a novel contribution that "
        "combines the consistency of deterministic algorithms with the nuanced understanding of "
        "large language models.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "The AI integration, powered by Claude 3 Opus via the OpenRouter API, demonstrates the "
        "practical application of large language models in domain-specific content generation. The "
        "context-aware AI assistant, which receives the complete resume state as structured input, "
        "produces significantly more relevant and personalized suggestions compared to generic "
        "AI chatbots, validating the effectiveness of context injection in specialized AI applications.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "From a technical perspective, the project showcases enterprise-grade software architecture "
        "using React 18, TypeScript, Vite, Tailwind CSS, Shadcn/UI, and Supabase. The implementation "
        "demonstrates best practices in component-based UI development, state management with custom "
        "hooks, backend-as-a-service integration, and programmatic PDF generation. The codebase "
        "comprises approximately 5,000+ lines of custom code across 45 modules, organized in a "
        "maintainable, domain-driven folder structure.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "Testing results confirm that the system performs accurately across diverse resume profiles, "
        "from empty baselines to comprehensive professional resumes. AI-generated content consistently "
        "meets ATS optimization standards with appropriate action verb usage, quantifiable metrics, "
        "and industry-standard formatting. The platform achieves excellent performance metrics with "
        "sub-2-second page loads, real-time preview updates under 50ms, and PDF generation "
        "completing in 1-3 seconds.", S['Body']))
    
    # 6.2 Key Contributions
    story.append(Paragraph("6.2 Key Contributions", S['SectionTitle']))
    contributions = [
        "<b>Unified Platform:</b> First open-source platform to integrate resume building, "
        "multi-dimensional ATS scoring, and context-aware AI assistance in a single application.",
        
        "<b>Weighted ATS Scoring:</b> Novel multi-dimensional scoring algorithm evaluating five "
        "distinct criteria with configurable weights, providing more comprehensive feedback than "
        "existing keyword-only approaches.",
        
        "<b>Blended Scoring Methodology:</b> Innovative approach combining deterministic rule-based "
        "scoring (60%) with LLM-based semantic evaluation (40%) for balanced, reliable assessment.",
        
        "<b>Context-Aware AI Assistant:</b> Implementation of resume state injection into AI prompts, "
        "enabling personalized suggestions that consider the user's specific content and career stage.",
        
        "<b>20 Professional Templates:</b> Diverse template library covering classic, minimal, modern, "
        "executive, and color-accented designs with consistent ATS compatibility.",
        
        "<b>Dual-Mode PDF Export:</b> High-fidelity PDF generation supporting both traditional "
        "Manual format and visually enhanced AI mode with gradient headers and color-coded elements.",
        
        "<b>Enterprise Architecture:</b> Production-ready implementation demonstrating modern full-stack "
        "development with React 18, TypeScript, Supabase, and comprehensive state management.",
    ]
    for c in contributions:
        story.append(Paragraph(f"• {c}", S['ThesisBullet']))
        story.append(spacer(3))
    
    # 6.3 Limitations
    story.append(Paragraph("6.3 Limitations", S['SectionTitle']))
    story.append(Paragraph(
        "While AI Resume Studio achieves its stated objectives, several limitations should be "
        "acknowledged for transparency and to guide future development:", S['Body']))
    story.append(spacer(6))
    limitations = [
        "<b>External API Dependency:</b> The AI features rely entirely on the OpenRouter API for "
        "Claude 3 Opus access. API downtime, rate limiting, or pricing changes directly impact "
        "system functionality. No offline fallback exists for AI features.",
        
        "<b>Single Language Support:</b> The current system supports English-language resumes only. "
        "Resume conventions, section naming, and AI prompts are English-centric, limiting "
        "applicability in non-English-speaking markets.",
        
        "<b>Job Description Input:</b> The current ATS scoring evaluates the resume in isolation "
        "without comparing against a specific job description. True ATS keyword matching requires "
        "a target job posting for comparison.",
        
        "<b>Limited Template PDF Fidelity:</b> While the live preview renders all 20 templates "
        "distinctively, the PDF export engine uses a simplified rendering approach that does not "
        "fully replicate all visual characteristics of every template variant.",
        
        "<b>No Offline Mode:</b> The application requires an active internet connection for AI "
        "features and cloud data synchronization. Offline resume editing is not supported.",
    ]
    for lim in limitations:
        story.append(Paragraph(f"• {lim}", S['ThesisBullet']))
        story.append(spacer(3))
    
    # 6.4 Future Scope
    story.append(Paragraph("6.4 Future Scope", S['SectionTitle']))
    story.append(Paragraph(
        "AI Resume Studio has a rich roadmap of potential enhancements that would further strengthen "
        "its position as a comprehensive career development platform:", S['Body']))
    story.append(spacer(6))
    
    future = [
        ("<b>Job Description Matching:</b>", "Implement a dedicated input for target job descriptions "
        "with automated keyword extraction using TF-IDF and NER. The ATS score would then reflect "
        "the resume's alignment with specific job requirements, providing highly targeted "
        "optimization recommendations."),
        
        ("<b>Cover Letter Generator:</b>", "Extend AI capabilities to generate tailored cover letters "
        "based on the resume content and target job description. The AI would produce professional "
        "cover letters that complement and reinforce the resume narrative."),
        
        ("<b>LinkedIn Profile Sync:</b>", "Integrate LinkedIn OAuth to import profile data directly, "
        "pre-populating resume fields and reducing manual data entry. This integration would also "
        "enable LinkedIn-optimized content suggestions."),
        
        ("<b>Multi-Language Support:</b>", "Extend the platform to support resume creation in multiple "
        "languages (Hindi, Spanish, French, German, etc.) with locale-specific formatting conventions "
        "and translated AI prompts."),
        
        ("<b>DOCX Export Format:</b>", "Add Microsoft Word export as an alternative to PDF, as some "
        "ATS systems have better compatibility with DOCX format."),
        
        ("<b>Mobile Application:</b>", "Develop a React Native mobile application for iOS and Android, "
        "enabling on-the-go resume editing and management."),
        
        ("<b>Analytics Dashboard:</b>", "Implement comprehensive analytics showing resume view counts, "
        "download statistics, ATS score trends over time, and AI usage patterns."),
        
        ("<b>Collaborative Editing:</b>", "Enable resume sharing and collaborative editing, allowing "
        "mentors, career counselors, or peers to review and suggest improvements."),
        
        ("<b>AI Interview Preparation:</b>", "Leverage the resume content to generate likely interview "
        "questions and suggested answers, creating a seamless career preparation ecosystem."),
        
        ("<b>B2B Enterprise Features:</b>", "Develop institutional licensing for universities and "
        "recruitment agencies, including batch resume processing, institution-branded templates, "
        "and aggregate analytics dashboards."),
    ]
    for title, desc in future:
        story.append(Paragraph(f"{title} {desc}", S['BodyIndent']))
        story.append(spacer(4))
    
    story.append(spacer(6))
    story.append(Paragraph("<b>6.4.1 Development Priority Roadmap</b>", S['SubSection']))
    story.append(Paragraph(
        "To manage the implementation of these diverse future scope items, a phased "
        "roadmap is proposed below, prioritizing high-impact user features.", S['Body']))
    story.append(spacer(6))
    roadmap_data = [
        ["Phase", "Feature Focus", "Priority"],
        ["Next 3 Months", "Job Description Matching & AI Matching Score", "CRITICAL"],
        ["6 Months", "Cover Letter Generator & PDF-to-DOCX Conversion", "HIGH"],
        ["9 Months", "Mobile Application (PWA -> Native) & OAuth Sync", "MEDIUM"],
        ["1 Year+", "B2B Institution Dashboards & Interview Prep Engine", "STRATEGIC"],
    ]
    story.append(make_table(roadmap_data, col_widths=[100, 270, 80]))
    story.append(spacer(12))
    
    story.append(spacer(12))

    story.append(Paragraph("<b>6.5 Final Reflection: Ethical AI in Recruitment</b>", S['SectionTitle']))
    story.append(Paragraph(
        "As AI becomes deeply embedded in the recruitment lifecycle, ethical considerations "
        "surrounding algorithmic bias and data privacy become paramount. AI Resume Studio "
        "addresses these concerns through a 'Human-in-the-Loop' philosophy. The AI is a "
        "collaborator, not an arbiter. Every AI-generated bullet point or summary must be "
        "explicitly 'applied' by the user, ensuring that the final document remains a "
        "true representation of the individual's experience.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "Furthermore, by using Claude 3 Opus — a model trained with Constitutional AI "
        "principles — the system minimizes the risk of generating biased or exclusionary "
        "language. This project serves as a practical demonstration of how 'Good AI' "
        "can be used to level the playing field, giving every candidate access to the "
        "same optimization techniques previously reserved for those who could afford "
        "professional career coaching. This democratization of recruitment technology "
        "is perhaps the most significant social contribution of the project.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "In conclusion, AI Resume Studio represents a meaningful step forward in the evolution of "
        "resume building technology. By combining modern web development practices with AI-powered "
        "intelligence, the platform demonstrates that accessible, intelligent career development "
        "tools can empower job seekers at every stage of their professional journey. The foundation "
        "established in this project creates a robust launching pad for the ambitious future "
        "enhancements outlined above, with the ultimate vision of becoming a comprehensive, "
        "AI-driven career development ecosystem.", S['Body']))
    
    story.append(page_break())
    return story
