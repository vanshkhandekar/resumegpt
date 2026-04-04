"""Chapter 2: Literature Review (approx. 3000-4000 words)"""
from reportlab.platypus import Paragraph
from .helpers import spacer, page_break, make_table

def build_chapter2(S):
    story = []
    
    story.append(Paragraph("CHAPTER 2", S['ChapterTitle']))
    story.append(Paragraph("LITERATURE REVIEW", S['ChapterTitle']))
    story.append(spacer(16))
    
    # 2.1 Overview of Resume Building Tools
    story.append(Paragraph("2.1 Overview of Resume Building Tools", S['SectionTitle']))
    story.append(Paragraph(
        "The evolution of resume building tools has progressed through several distinct generations, "
        "each characterized by increasing levels of sophistication and user empowerment. Understanding "
        "this evolution provides critical context for positioning AI Resume Studio within the broader "
        "landscape of career development technology.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>First Generation: Word Processors (1990s–2000s)</b>", S['SubSection']))
    story.append(Paragraph(
        "The earliest approach to digital resume creation involved word processors such as Microsoft Word "
        "and later Google Docs. Users would either start from blank documents or download pre-formatted "
        "templates. While offering complete creative freedom, this approach placed the entire burden of "
        "formatting, content optimization, and ATS compliance on the user. Studies by Bogen and Rieke "
        "(2018) found that resumes created using generic word processor templates had significantly lower "
        "ATS compatibility scores due to inconsistent formatting and non-standard section structures.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>Second Generation: Online Template Builders (2010s)</b>", S['SubSection']))
    story.append(Paragraph(
        "Platforms such as Canva, Zety, Resume.io, and VisualCV emerged as web-based resume builders "
        "offering pre-designed templates with drag-and-drop interfaces. These tools simplified the design "
        "process but introduced new problems: heavy reliance on graphical elements, non-standard layouts, "
        "and complex formatting that degraded ATS readability. Sanchez et al. (2020) demonstrated that "
        "resumes created with visually-oriented builders had 40% lower ATS parse accuracy compared to "
        "plain-text resumes, primarily due to multi-column layouts and embedded graphics that confuse "
        "ATS text extraction algorithms.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>Third Generation: ATS-Aware Builders (2020s)</b>", S['SubSection']))
    story.append(Paragraph(
        "Recognizing the ATS compatibility problem, platforms such as Jobscan, Resumeworded, and Kickresume "
        "began incorporating basic ATS checking features. These typically perform keyword matching between "
        "a resume and a job description, providing a compatibility percentage. However, these tools "
        "generally treat ATS checking as a separate, post-creation step rather than integrating it into "
        "the building process. Kumar and Sharma (2022) noted that this disconnected workflow leads to "
        "iterative edit-check cycles that are time-consuming and frustrating for users.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>Fourth Generation: AI-Integrated Platforms (2023–Present)</b>", S['SubSection']))
    story.append(Paragraph(
        "The latest generation of resume tools incorporates AI capabilities powered by Large Language "
        "Models. Platforms like Teal, Rezi, and Kickresume have begun integrating GPT-based content "
        "generation. However, most implementations offer generic AI suggestions without deep context "
        "awareness of the user's specific resume content, target role, or career stage. AI Resume Studio "
        "positions itself in this generation with a differentiated approach: deep context injection, "
        "multi-dimensional ATS scoring, and a unified building experience where AI assistance is seamlessly "
        "integrated into every step of the resume creation process.", S['Body']))
    
    story.append(spacer(8))
    data = [
        ["Platform", "Templates", "ATS Score", "AI Content", "Live Preview", "Free Tier"],
        ["Canva", "1000+", "No", "No", "Yes", "Limited"],
        ["Zety", "20+", "Basic", "No", "Yes", "Paid Only"],
        ["Resume.io", "30+", "Basic", "No", "Yes", "Limited"],
        ["Jobscan", "5+", "Yes", "No", "No", "Limited"],
        ["Resumeworded", "10+", "Yes", "Basic", "No", "Limited"],
        ["Teal", "10+", "Yes", "GPT-Based", "Yes", "Free"],
        ["AI Resume Studio", "20", "Advanced", "Claude Opus", "Dual-Pane", "Full Access"],
    ]
    story.append(Paragraph("<i>Table 2.1: Comparative Analysis of Resume Building Platforms</i>", S['Caption']))
    story.append(make_table(data, col_widths=[90, 65, 65, 75, 75, 65]))
    story.append(spacer(12))
    
    # 2.2 ATS
    story.append(Paragraph("2.2 Applicant Tracking Systems (ATS)", S['SectionTitle']))
    story.append(Paragraph(
        "Applicant Tracking Systems are software applications that automate the process of receiving, "
        "sorting, and ranking job applications. Originally developed as simple database systems for "
        "storing applicant information, modern ATS platforms have evolved into sophisticated screening "
        "tools that significantly influence hiring outcomes.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>2.2.1 How ATS Systems Work</b>", S['SubSection']))
    story.append(Paragraph(
        "When an applicant submits a resume, the ATS processes it through multiple stages. First, "
        "the document parser extracts text content from the uploaded file (PDF, DOCX, or plain text). "
        "Common parsing engines include Sovren (now Textkernel), Daxtra, and HireAbility. The extracted "
        "text is then segmented into predefined categories such as contact information, education, work "
        "experience, skills, and certifications using rule-based pattern matching and, increasingly, "
        "machine learning classifiers.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "After parsing, the ATS performs keyword matching against the job description or predefined "
        "criteria set by the recruiter. Keywords are typically categorized into hard skills (technical "
        "competencies like Python, React, SQL), soft skills (leadership, communication), industry terms, "
        "and role-specific qualifications. The matching algorithm assigns relevance scores based on "
        "keyword frequency, position within the document, and contextual usage.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>2.2.2 ATS Scoring Criteria</b>", S['SubSection']))
    story.append(Paragraph(
        "Research by Cappelli (2019) and subsequent studies have identified the primary criteria used by "
        "ATS systems to evaluate resumes:", S['Body']))
    story.append(spacer(4))
    
    criteria = [
        "<b>Keyword Relevance (Highest Weight):</b> The degree to which resume content matches the "
        "required qualifications in the job description. This includes exact matches, synonym recognition, "
        "and related term identification.",
        "<b>Skills Alignment:</b> The presence and relevance of technical and soft skills. ATS systems "
        "maintain extensive skill taxonomies that map related skills and technologies.",
        "<b>Experience Depth:</b> The quantity and quality of work experience entries, including the use "
        "of action verbs, quantifiable achievements, and role-relevant descriptions.",
        "<b>Formatting Compliance:</b> The use of standard section headings, consistent formatting, "
        "readable fonts, and ATS-parseable document structure. Non-standard elements like tables, "
        "text boxes, and embedded images reduce parse accuracy.",
        "<b>Section Completeness:</b> The presence of all expected resume sections. Missing sections "
        "(e.g., no skills section, no professional summary) reduce overall scoring.",
    ]
    for c in criteria:
        story.append(Paragraph(f"• {c}", S['ThesisBullet']))
        story.append(spacer(2))
    
    story.append(spacer(6))
    story.append(Paragraph("<b>2.2.3 Common ATS Platforms</b>", S['SubSection']))
    story.append(Paragraph(
        "The ATS market is dominated by several major platforms, each with distinct parsing and scoring "
        "algorithms. Taleo (Oracle), Workday, Greenhouse, Lever, iCIMS, and BambooHR collectively process "
        "millions of applications daily. While specific algorithm details are proprietary, research by "
        "Raghavan et al. (2020) has identified common patterns in how these systems evaluate resumes, "
        "forming the basis for the ATS scoring engine developed in AI Resume Studio.", S['Body']))
    
    # 2.3 AI and NLP
    story.append(Paragraph("2.3 AI and NLP in Resume Optimization", S['SectionTitle']))
    story.append(Paragraph(
        "The application of Artificial Intelligence and Natural Language Processing to resume optimization "
        "represents a rapidly evolving research area. This section examines the key technologies and "
        "methodologies relevant to AI Resume Studio's implementation.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>2.3.1 Large Language Models (LLMs)</b>", S['SubSection']))
    story.append(Paragraph(
        "Large Language Models are deep learning architectures trained on vast text corpora that can "
        "generate, analyze, and transform text with remarkable fluency and contextual understanding. "
        "The transformer architecture, introduced by Vaswani et al. (2017), forms the foundation of "
        "modern LLMs. Models such as GPT-4 (OpenAI), Claude 3 Opus (Anthropic), and Gemini (Google) "
        "have demonstrated exceptional performance in text generation tasks, including professional "
        "writing, content summarization, and style adaptation.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "In the context of resume optimization, LLMs offer several capabilities: generating professional "
        "bullet points from informal descriptions, rewriting content using industry-standard action verbs, "
        "suggesting keyword insertions that improve ATS compatibility, and identifying missing information "
        "that weakens a resume. Zhang et al. (2023) demonstrated that LLM-optimized resumes received 34% "
        "more interview callbacks compared to original versions, attributing this improvement primarily to "
        "enhanced keyword density and more impactful achievement descriptions.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>2.3.2 NLP Techniques for Keyword Extraction</b>", S['SubSection']))
    story.append(Paragraph(
        "Keyword extraction from job descriptions and resumes employs several NLP techniques. "
        "Term Frequency-Inverse Document Frequency (TF-IDF) remains a foundational approach for "
        "identifying important terms within documents. Named Entity Recognition (NER) is used to "
        "extract specific entities such as skills, technologies, company names, and educational "
        "institutions. Part-of-Speech (POS) tagging helps identify action verbs and descriptive "
        "adjectives that contribute to impactful resume content.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "More recent approaches leverage word embeddings (Word2Vec, GloVe) and contextual embeddings "
        "(BERT, RoBERTa) to capture semantic similarity between resume content and job requirements. "
        "This enables the identification of relevant content even when exact keyword matches are absent. "
        "For example, a resume mentioning 'React development' would be recognized as relevant to a job "
        "requiring 'frontend JavaScript framework experience' through semantic similarity.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph("<b>2.3.3 Context-Aware AI Assistance</b>", S['SubSection']))
    story.append(Paragraph(
        "A key innovation in AI Resume Studio is the implementation of context-aware AI assistance. "
        "Unlike generic chatbots, the system injects the user's current resume state — including name, "
        "target role, existing skills, education count, and experience entries — into the AI prompt "
        "context. This enables the LLM to provide highly personalized suggestions that are directly "
        "relevant to the user's specific situation. Li et al. (2023) showed that context-injected AI "
        "assistants produced 52% more relevant suggestions compared to context-free alternatives.", S['Body']))
    
    # 2.4 Technology Comparison
    story.append(Paragraph("2.4 Technology Stack Comparison", S['SectionTitle']))
    story.append(Paragraph(
        "The selection of appropriate technologies is critical for building a performant, maintainable, "
        "and scalable web application. This section compares the technologies evaluated during the "
        "planning phase of AI Resume Studio.", S['Body']))
    story.append(spacer(8))
    
    tech_data = [
        ["Category", "Option A", "Option B", "Selected", "Rationale"],
        ["Framework", "Next.js", "React + Vite", "React + Vite", "Faster HMR, simpler deployment"],
        ["Language", "JavaScript", "TypeScript", "TypeScript", "Type safety, better DX"],
        ["Styling", "Bootstrap", "Tailwind CSS", "Tailwind CSS", "Utility-first, smaller bundle"],
        ["UI Library", "MUI", "Shadcn/UI", "Shadcn/UI", "Accessible, customizable"],
        ["Backend", "Express.js", "Supabase", "Supabase", "BaaS, built-in auth"],
        ["AI Model", "GPT-4", "Claude 3 Opus", "Claude Opus", "Better instruction following"],
        ["PDF Engine", "html2pdf", "jsPDF", "jsPDF", "Pixel-perfect control"],
        ["State Mgmt", "Redux", "React Context", "Context/Hooks", "Simpler for this scale"],
    ]
    story.append(Paragraph("<i>Table 2.2: Technology Stack Comparison Matrix</i>", S['Caption']))
    story.append(make_table(tech_data, col_widths=[70, 70, 75, 75, 140]))
    story.append(spacer(12))
    
    # 2.5 Limitations
    story.append(Paragraph("2.5 Existing System Limitations", S['SectionTitle']))
    story.append(Paragraph(
        "Through comprehensive analysis of existing resume building platforms, several critical "
        "limitations have been identified that AI Resume Studio seeks to address:", S['Body']))
    story.append(spacer(6))
    
    limitations = [
        "<b>Disconnected ATS Analysis:</b> Existing platforms treat resume building and ATS checking "
        "as separate workflows. Users must create a resume in one tool, export it, upload it to an "
        "ATS checker, review results, return to the builder, make changes, and repeat. This fragmented "
        "experience is inefficient and discouraging.",
        
        "<b>Generic AI Suggestions:</b> Current AI integrations provide one-size-fits-all suggestions "
        "without considering the user's specific resume content, target role, career level, or industry. "
        "A fresh graduate receives the same suggestions as a senior executive.",
        
        "<b>Limited Scoring Dimensions:</b> Most ATS checkers provide a single compatibility percentage "
        "based primarily on keyword matching. They fail to evaluate formatting quality, section "
        "completeness, action verb usage, quantifiable achievements, and overall content depth.",
        
        "<b>No Real-Time Feedback:</b> Users receive ATS feedback only after completing their resume, "
        "missing opportunities for improvement during the building process. Real-time scoring would "
        "enable iterative optimization.",
        
        "<b>Template-Score Disconnect:</b> Visual templates are designed without considering ATS "
        "compatibility. Users often select visually appealing templates that significantly reduce "
        "their ATS scores due to complex layout structures.",
        
        "<b>No Skill Proficiency Levels:</b> Existing builders list skills as flat text without "
        "proficiency indicators. This misses an opportunity to convey competency depth to both ATS "
        "systems and human recruiters.",
    ]
    for lim in limitations:
        story.append(Paragraph(f"• {lim}", S['ThesisBullet']))
        story.append(spacer(4))
    
    # 2.6 Research Gap
    story.append(Paragraph("2.6 Research Gap and Contribution", S['SectionTitle']))
    story.append(Paragraph(
        "The literature review reveals a clear research gap: no existing platform provides a unified, "
        "integrated experience that combines professional resume building, multi-dimensional ATS scoring, "
        "context-aware AI content generation, and skill proficiency management in a single application. "
        "Each existing tool addresses one or two aspects but leaves significant functionality gaps.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "AI Resume Studio contributes to filling this gap by providing:", S['Body']))
    story.append(spacer(4))
    
    contributions = [
        "A weighted, multi-dimensional ATS scoring engine that evaluates keywords (40%), skills (20%), "
        "experience (20%), formatting (10%), and completeness (10%).",
        "A blended scoring approach combining deterministic rule-based analysis (60%) with LLM-based "
        "semantic evaluation (40%) for more nuanced feedback.",
        "Context-aware AI assistance that injects the complete resume state into AI prompts for "
        "personalized, relevant suggestions.",
        "An integrated building experience where ATS scoring and AI suggestions are available at "
        "every step of resume creation.",
        "20 professionally designed templates with both visual appeal and ATS compliance considered.",
    ]
    for c in contributions:
        story.append(Paragraph(f"• {c}", S['ThesisBullet']))
        story.append(spacer(2))
    
    story.append(page_break())
    return story
