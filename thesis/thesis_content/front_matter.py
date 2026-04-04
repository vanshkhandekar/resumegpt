"""Front matter pages: Title, Certificate, Declaration, Acknowledgement, Abstract, TOC."""
from reportlab.platypus import Paragraph, Spacer, PageBreak
from .helpers import spacer, page_break

def build_front_matter(S):
    story = []
    
    # ── TITLE PAGE ──
    story.append(spacer(40))
    story.append(Paragraph("RASHTRASANT TUKADOJI MAHARAJ<br/>NAGPUR UNIVERSITY, NAGPUR", S['CenterBold']))
    story.append(spacer(20))
    story.append(Paragraph("A PROJECT REPORT ON", S['CenterNormal']))
    story.append(spacer(12))
    story.append(Paragraph("<b>AI RESUME STUDIO</b><br/><i>Resume Maker with ATS Scoring &amp; AI-Powered Features</i>", S['ThesisTitle']))
    story.append(spacer(16))
    story.append(Paragraph("Submitted in partial fulfillment of the requirements for the degree of", S['CenterNormal']))
    story.append(Paragraph("<b>Master of Computer Applications (MCA)</b>", S['CenterBold']))
    story.append(spacer(16))
    story.append(Paragraph("<b>Submitted By:</b>", S['CenterNormal']))
    story.append(Paragraph("Vansh Khandekar", S['CenterBold']))
    story.append(Paragraph("MCA — Final Year (Semester IV)", S['CenterNormal']))
    story.append(spacer(16))
    story.append(Paragraph("<b>Under the Guidance of:</b>", S['CenterNormal']))
    story.append(Paragraph("Prof. [Guide Name]", S['CenterBold']))
    story.append(Paragraph("Department of Computer Applications", S['CenterNormal']))
    story.append(spacer(24))
    story.append(Paragraph("<b>Department of Computer Applications</b>", S['CenterBold']))
    story.append(Paragraph("Janaprabha Institute of Engineering and Technology, Ramtek", S['CenterNormal']))
    story.append(Paragraph("Affiliated to Rashtrasant Tukadoji Maharaj Nagpur University", S['CenterNormal']))
    story.append(spacer(12))
    story.append(Paragraph("<b>Academic Year: 2025–2026</b>", S['CenterBold']))
    story.append(page_break())
    
    # ── CERTIFICATE ──
    story.append(spacer(30))
    story.append(Paragraph("<b>CERTIFICATE</b>", S['ThesisTitle']))
    story.append(spacer(20))
    story.append(Paragraph(
        "This is to certify that the project report entitled <b>\"AI Resume Studio — Resume Maker with "
        "ATS Scoring &amp; AI-Powered Features\"</b> submitted by <b>Vansh Khandekar</b> in partial "
        "fulfillment of the requirements for the award of the degree of <b>Master of Computer Applications "
        "(MCA)</b> from Rashtrasant Tukadoji Maharaj Nagpur University, Nagpur, is a bonafide record of "
        "work carried out under my supervision and guidance.", S['Body']))
    story.append(spacer(12))
    story.append(Paragraph(
        "The content of this project report, in full or in parts, has not been submitted to any other "
        "institution for the award of any degree or diploma. The work presented in this report is original "
        "and has been carried out during the academic year 2025–2026.", S['Body']))
    story.append(spacer(40))
    story.append(Paragraph("<b>Date:</b> April 2026", S['Body']))
    story.append(Paragraph("<b>Place:</b> Ramtek, Nagpur", S['Body']))
    story.append(spacer(40))
    story.append(Paragraph("<b>Prof. [Guide Name]</b>", S['Body']))
    story.append(Paragraph("Project Guide", S['Body']))
    story.append(Paragraph("Department of Computer Applications", S['Body']))
    story.append(spacer(20))
    story.append(Paragraph("<b>Dr. [HOD Name]</b>", S['Body']))
    story.append(Paragraph("Head of Department", S['Body']))
    story.append(Paragraph("Department of Computer Applications", S['Body']))
    story.append(spacer(20))
    story.append(Paragraph("<b>Dr. [Principal Name]</b>", S['Body']))
    story.append(Paragraph("Principal", S['Body']))
    story.append(Paragraph("Janaprabha Institute of Engineering and Technology, Ramtek", S['Body']))
    story.append(page_break())
    
    # ── DECLARATION ──
    story.append(spacer(30))
    story.append(Paragraph("<b>DECLARATION</b>", S['ThesisTitle']))
    story.append(spacer(20))
    story.append(Paragraph(
        "I, <b>Vansh Khandekar</b>, hereby declare that the project work entitled <b>\"AI Resume Studio "
        "— Resume Maker with ATS Scoring &amp; AI-Powered Features\"</b> submitted to the Department of "
        "Computer Applications, Janaprabha Institute of Engineering and Technology, Ramtek, affiliated to "
        "Rashtrasant Tukadoji Maharaj Nagpur University, Nagpur, is a record of original work done by me "
        "under the guidance of <b>Prof. [Guide Name]</b>.", S['Body']))
    story.append(spacer(10))
    story.append(Paragraph(
        "I further declare that this project work has not been submitted to any other university or "
        "institution for the award of any degree, diploma, or other academic qualification. The information "
        "compiled in this report is correct to the best of my knowledge and belief.", S['Body']))
    story.append(spacer(10))
    story.append(Paragraph(
        "I understand that in the event of any inaccuracy or misrepresentation being found in this report, "
        "the degree awarded to me may be withdrawn by the university.", S['Body']))
    story.append(spacer(50))
    story.append(Paragraph("<b>Date:</b> April 2026", S['Body']))
    story.append(Paragraph("<b>Place:</b> Ramtek, Nagpur", S['Body']))
    story.append(spacer(30))
    story.append(Paragraph("<b>Vansh Khandekar</b>", S['Body']))
    story.append(Paragraph("MCA — Final Year", S['Body']))
    story.append(page_break())
    
    # ── ACKNOWLEDGEMENT ──
    story.append(spacer(30))
    story.append(Paragraph("<b>ACKNOWLEDGEMENT</b>", S['ThesisTitle']))
    story.append(spacer(20))
    story.append(Paragraph(
        "I would like to express my sincere gratitude to all those who have contributed to the successful "
        "completion of this project. This work would not have been possible without their continuous "
        "support, guidance, and encouragement.", S['Body']))
    story.append(spacer(8))
    story.append(Paragraph(
        "First and foremost, I am deeply grateful to my project guide, <b>Prof. [Guide Name]</b>, for "
        "their invaluable guidance, constructive criticism, and constant motivation throughout the "
        "development of this project. Their vast knowledge of software engineering principles and emerging "
        "technologies has been instrumental in shaping this work.", S['Body']))
    story.append(spacer(8))
    story.append(Paragraph(
        "I extend my heartfelt thanks to <b>Dr. [HOD Name]</b>, Head of the Department of Computer "
        "Applications, for providing the necessary infrastructure and a conducive learning environment. "
        "I also wish to thank the Principal, <b>Dr. [Principal Name]</b>, for granting permission to "
        "undertake this project.", S['Body']))
    story.append(spacer(8))
    story.append(Paragraph(
        "I am thankful to all the faculty members of the Department of Computer Applications who have "
        "imparted knowledge and skills that formed the foundation for this project. Special thanks to the "
        "entire teaching and non-teaching staff for their cooperation.", S['Body']))
    story.append(spacer(8))
    story.append(Paragraph(
        "I would also like to acknowledge the open-source community, the developers of React, Vite, "
        "Tailwind CSS, Supabase, and OpenRouter for their remarkable tools that made this project "
        "technically feasible. The documentation and community forums were invaluable resources.", S['Body']))
    story.append(spacer(8))
    story.append(Paragraph(
        "Last but not least, I express my profound gratitude to my family and friends for their unwavering "
        "support, patience, and encouragement during the entire course of this project.", S['Body']))
    story.append(spacer(30))
    story.append(Paragraph("<b>Vansh Khandekar</b>", S['Body']))
    story.append(page_break())
    
    # ── ABSTRACT ──
    story.append(spacer(30))
    story.append(Paragraph("<b>ABSTRACT</b>", S['ThesisTitle']))
    story.append(spacer(20))
    story.append(Paragraph(
        "The modern job market has become increasingly competitive, with employers relying heavily on "
        "Applicant Tracking Systems (ATS) to filter and rank resumes before they reach human recruiters. "
        "Studies indicate that over 75% of resumes are rejected by ATS software before a human ever reads "
        "them. This creates a significant challenge for job seekers who lack awareness of ATS-compliant "
        "formatting, keyword optimization, and content structuring techniques.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "This thesis presents the design, development, and evaluation of <b>AI Resume Studio</b>, a "
        "cloud-native, AI-powered resume building platform that addresses these challenges comprehensively. "
        "The system integrates a sophisticated ATS scoring engine with weighted evaluation across five "
        "critical dimensions: keyword relevance (40%), skill alignment (20%), experience evaluation (20%), "
        "formatting compliance (10%), and section completeness (10%). This multi-dimensional scoring "
        "approach provides users with actionable, granular feedback to improve their resume\'s ATS "
        "compatibility.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "The platform leverages advanced Large Language Models (LLMs) — specifically Claude 3 Opus via the "
        "OpenRouter API — to provide intelligent content generation, professional description writing, "
        "missing section detection, and keyword optimization. The AI assistant operates in a context-aware "
        "mode, receiving the current resume state as structured context to deliver highly personalized and "
        "relevant suggestions.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "Built using a modern technology stack comprising React 18, Vite, TypeScript, Tailwind CSS, "
        "Shadcn/UI, Supabase for backend services, and jsPDF for document generation, the system "
        "demonstrates enterprise-grade architecture with features including 20 professional templates, "
        "dual-pane live preview, auto-save functionality, and high-fidelity A4 PDF export.", S['Body']))
    story.append(spacer(6))
    story.append(Paragraph(
        "<b>Keywords:</b> Resume Builder, Applicant Tracking System, ATS Scoring, Artificial Intelligence, "
        "Natural Language Processing, React, Cloud-Native, SaaS, PDF Generation, Keyword Optimization",
        S['Body']))
    story.append(page_break())
    
    return story


def build_toc(S):
    story = []
    story.append(spacer(30))
    story.append(Paragraph("<b>TABLE OF CONTENTS</b>", S['ThesisTitle']))
    story.append(spacer(20))
    
    toc = [
        ("", "Certificate", "ii"),
        ("", "Declaration", "iii"),
        ("", "Acknowledgement", "iv"),
        ("", "Abstract", "v"),
        ("", "Table of Contents", "vi"),
        ("", "List of Figures", "viii"),
        ("", "List of Tables", "ix"),
        ("", "", ""),
        ("1", "INTRODUCTION", "1"),
        ("1.1", "Background and Motivation", "1"),
        ("1.2", "Problem Statement", "3"),
        ("1.3", "Objectives of the Study", "5"),
        ("1.4", "Scope of the Project", "6"),
        ("1.5", "Significance of the Study", "7"),
        ("1.6", "Organization of the Thesis", "8"),
        ("", "", ""),
        ("2", "LITERATURE REVIEW", "10"),
        ("2.1", "Overview of Resume Building Tools", "10"),
        ("2.2", "Applicant Tracking Systems (ATS)", "13"),
        ("2.3", "AI and NLP in Resume Optimization", "16"),
        ("2.4", "Technology Stack Comparison", "19"),
        ("2.5", "Existing System Limitations", "22"),
        ("2.6", "Research Gap and Contribution", "24"),
        ("", "", ""),
        ("3", "SYSTEM DESIGN", "26"),
        ("3.1", "System Architecture", "26"),
        ("3.2", "Data Flow Diagrams (DFD)", "29"),
        ("3.3", "Use Case Diagrams", "33"),
        ("3.4", "Entity-Relationship Diagram", "36"),
        ("3.5", "Technology Stack Selection", "38"),
        ("3.6", "Database Schema Design", "40"),
        ("3.7", "API Architecture", "42"),
        ("", "", ""),
        ("4", "IMPLEMENTATION", "44"),
        ("4.1", "Development Environment Setup", "44"),
        ("4.2", "Folder Structure and Code Organization", "45"),
        ("4.3", "Frontend Implementation", "47"),
        ("4.4", "Backend and Database Implementation", "52"),
        ("4.5", "ATS Scoring Engine Implementation", "55"),
        ("4.6", "AI Integration System", "59"),
        ("4.7", "Skill and Language Proficiency System", "62"),
        ("4.8", "PDF Export Engine", "64"),
        ("", "", ""),
        ("5", "RESULTS AND DISCUSSION", "67"),
        ("5.1", "System Output and Demonstration", "67"),
        ("5.2", "ATS Score Testing and Validation", "70"),
        ("5.3", "AI Feature Testing", "73"),
        ("5.4", "Performance Analysis", "75"),
        ("5.5", "User Interface Showcase", "77"),
        ("5.6", "Comparative Analysis", "78"),
        ("", "", ""),
        ("6", "CONCLUSION AND FUTURE SCOPE", "80"),
        ("6.1", "Conclusion", "80"),
        ("6.2", "Key Contributions", "81"),
        ("6.3", "Limitations", "82"),
        ("6.4", "Future Scope", "82"),
        ("", "", ""),
        ("", "REFERENCES", "84"),
        ("", "APPENDIX A — Code Snippets", "87"),
        ("", "APPENDIX B — Glossary", "90"),
    ]
    
    for num, title, page in toc:
        if not title:
            story.append(spacer(6))
            continue
        if num and '.' not in num:
            story.append(Paragraph(f"<b>{num}. {title} {'.' * 40} {page}</b>", S['TOCChapter']))
        elif num:
            story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;{num} {title} {'.' * 35} {page}", S['TOCEntry']))
        else:
            story.append(Paragraph(f"<b>{title} {'.' * 45} {page}</b>", S['TOCEntry']))
    
    story.append(page_break())
    return story
