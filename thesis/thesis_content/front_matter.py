"""Front matter pages: Title, Certificate, Declaration, Acknowledgement, Abstract, TOC."""
from reportlab.platypus import Paragraph
from .helpers import spacer, page_break

def build_front_matter(S):
    story = []
    
    # ── TITLE PAGE ──
    story.append(spacer(40))
    story.append(Paragraph("<b>RASHTRASANT TUKADOJI MAHARAJ<br/>NAGPUR UNIVERSITY, NAGPUR</b>", S['CenterBold']))
    story.append(spacer(24))
    story.append(Paragraph("<b>A PROJECT REPORT ON</b>", S['CenterNormal']))
    story.append(spacer(16))
    story.append(Paragraph(
        "<font size='22'><b>AI RESUME STUDIO</b></font><br/>"
        "<i><font size='14'>Resume Maker with ATS Scoring &amp; AI-Powered Features</font></i>", S['ThesisTitle']))
    story.append(spacer(24))
    story.append(Paragraph("Submitted in partial fulfillment of the requirements for the degree of", S['CenterNormal']))
    story.append(Paragraph("<b>Master of Computer Applications (MCA)</b>", S['CenterBold']))
    story.append(spacer(24))
    story.append(Paragraph("<b>Submitted By:</b>", S['CenterNormal']))
    story.append(Paragraph("<b>Vansh Khandekar</b>", S['CenterBold']))
    story.append(Paragraph("MCA — Final Year (Semester IV)", S['CenterNormal']))
    story.append(spacer(24))
    story.append(Paragraph("<b>Under the Guidance of:</b>", S['CenterNormal']))
    story.append(Paragraph("<b>Prof. R.K. Sharma</b>", S['CenterBold'])) # placeholder name
    story.append(Paragraph("Department of Computer Applications", S['CenterNormal']))
    story.append(spacer(30))
    story.append(Paragraph("<b>Department of Computer Applications</b>", S['CenterBold']))
    story.append(Paragraph("<b>Janaprabha College, Ramtek</b>", S['CenterBold']))
    story.append(Paragraph("Affiliated to Rashtrasant Tukadoji Maharaj Nagpur University", S['CenterNormal']))
    story.append(spacer(20))
    story.append(Paragraph("<b>Academic Year: 2025–2026</b>", S['CenterBold']))
    story.append(page_break())
    
    # ── CERTIFICATE ──
    story.append(spacer(60))
    story.append(Paragraph("<b>CERTIFICATE</b>", S['ThesisTitle']))
    story.append(spacer(50))
    story.append(Paragraph(
        "This is to certify that the project report entitled <b>\"AI RESUME STUDIO — Resume Maker with "
        "ATS Scoring &amp; AI-Powered Features\"</b> is a bonafide record of the work carried out by "
        "<b>Vansh Khandekar</b>, a student of <b>Master of Computer Applications (MCA)</b>, "
        "Final Year (Semester IV), during the academic year 2025–2026.", S['Body']))
    story.append(spacer(18))
    story.append(Paragraph(
        "The project has been completed under my direct supervision and guidance at the Department of "
        "Computer Applications, Janaprabha College, Ramtek. The candidate has demonstrated "
        "exceptional technical proficiency in implementing Large Language Models (LLMs), "
        "Cloud-native database architectures, and real-time ATS heuristic scoring algorithms.", S['Body']))
    story.append(spacer(18))
    story.append(Paragraph(
        "This is further to certify that the work embodied in this thesis is original and has not been "
        "submitted, in part or full, to any other University or Institute for the award of any degree, "
        "diploma, or other academic titles. The candidate has cleared all the internal assessments "
        "and has followed the research ethics and documentation standards prescribed by the "
        "Rashtrasant Tukadoji Maharaj Nagpur University, Nagpur.", S['Body']))
    story.append(spacer(18))
    story.append(Paragraph(
        "The project is hereby approved for submission as per the partial fulfillment of the "
        "requirements for the award of the degree of Master of Computer Applications.", S['Body']))
    story.append(spacer(80))
    
    # Signatures - Guide & HOD
    story.append(Paragraph("<b>___________________</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>___________________</b>", S['Body']))
    story.append(Paragraph("<b>Prof. R.K. Sharma</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Dr. A.P. Singh</b>", S['Body']))
    story.append(Paragraph("Project Guide &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Head of Department", S['Body']))
    story.append(spacer(60))
    
    # Signatures - Principal & Examiners
    story.append(Paragraph("<b>___________________</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>___________________</b>", S['Body']))
    story.append(Paragraph("<b>Dr. M.N. Maharia</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Internal Examiner</b>", S['Body']))
    story.append(Paragraph("Principal", S['Body']))
    story.append(spacer(60))
    
    story.append(Paragraph("<b>___________________</b>", S['Body']))
    story.append(Paragraph("<b>External Examiner</b>", S['Body']))
    story.append(spacer(30))
    
    story.append(Paragraph("<b>Date:</b> April 2026", S['Body']))
    story.append(Paragraph("<b>Place:</b> Ramtek, Nagpur", S['Body']))
    story.append(page_break())
    
    # ── DECLARATION ──
    story.append(spacer(50))
    story.append(Paragraph("<b>DECLARATION</b>", S['ThesisTitle']))
    story.append(spacer(40))
    story.append(Paragraph(
        "I, <b>Vansh Khandekar</b>, hereby declare that the project work entitled <b>\"AI RESUME STUDIO "
        "— Resume Maker with ATS Scoring &amp; AI-Powered Features\"</b> is a result of my own research and "
        "investigation carried out under the guidance of <b>Prof. R.K. Sharma</b> at Janaprabha College, "
        "Ramtek, affiliated to Rashtrasant Tukadoji Maharaj Nagpur University, Nagpur.", S['Body']))
    story.append(spacer(16))
    story.append(Paragraph(
        "I declare that the content of this thesis has not been previously submitted in any form for "
        "the award of any degree, diploma, or other academic qualification in any other university or "
        "educational institution. All sources of information and literature referred to in this "
        "report have been duly acknowledged.", S['Body']))
    story.append(spacer(16))
    story.append(Paragraph(
        "I take full responsibility for the data integrity and technical implementation presented in "
        "this document. In case of any discrepancies, I am aware of the consequences as per the "
        "university regulations.", S['Body']))
    story.append(spacer(60))
    story.append(Paragraph("<b>Date:</b> April 2026", S['Body']))
    story.append(Paragraph("<b>Place:</b> Ramtek, Nagpur", S['Body']))
    story.append(spacer(40))
    story.append(Paragraph("<b>Vansh Khandekar</b>", S['Body']))
    story.append(Paragraph("MCA — Final Year", S['Body']))
    story.append(page_break())
    
    # ── ACKNOWLEDGEMENT ──
    story.append(spacer(50))
    story.append(Paragraph("<b>ACKNOWLEDGEMENT</b>", S['ThesisTitle']))
    story.append(spacer(40))
    story.append(Paragraph(
        "The completion of this project is a milestone that has been achieved through the "
        "collaborative efforts and support of many individuals. I would like to express my "
        "profound gratitude to everyone who helped me navigate this challenging yet rewarding "
        "journey of technical innovation.", S['Body']))
    story.append(spacer(16))
    story.append(Paragraph(
        "I am deeply indebted to <b>Prof. R.K. Sharma</b>, Project Guide, for their mentorship and "
        "unwavering support. Their expert advice on AI integration and software lifecycle "
        "management provided the necessary direction for this project. I am grateful for "
        "the time they invested in reviewing my work and providing constructive criticisms.", S['Body']))
    story.append(spacer(16))
    story.append(Paragraph(
        "I would like to thank <b>Dr. A.P. Singh</b> (Head of Department) and <b>Dr. M.N. Maharia</b> "
        "(Principal) for providing the academic infrastructure and for encouraging students "
        "to explore cutting-edge technologies like Cloud-native development and LLMs.", S['Body']))
    story.append(spacer(16))
    story.append(Paragraph(
        "My special thanks go to the entire faculty of the Computer Applications department "
        "for their theoretical foundations and practical insights. I also acknowledge the "
        "role of the technical staff who ensured the availability of laboratory resources.", S['Body']))
    story.append(spacer(16))
    story.append(Paragraph(
        "To my fellow batchmates, thank you for the countless late-night debugging sessions "
        "and peer reviews. Your perspectives have broaden my understanding of complex "
        "deployment strategies.", S['Body']))
    story.append(spacer(16))
    story.append(Paragraph(
        "Finally, words are not enough to thank my parents and siblings. Their moral support, "
        "patience, and constant belief in my vision were the driving forces behind the "
        "completion of this thesis. I dedicate this work to them.", S['Body']))
    story.append(spacer(50))
    story.append(Paragraph("<b>Vansh Khandekar</b>", S['Body']))
    story.append(page_break())
    
    # ── ABSTRACT ──
    story.append(spacer(30))
    story.append(Paragraph("<b>ABSTRACT</b>", S['ThesisTitle']))
    story.append(spacer(30))
    story.append(Paragraph(
        "In the rapidly evolving modern recruitment landscape, job seekers often struggle to navigate the "
        "complexities of Applicant Tracking Systems (ATS). This thesis presents <b>AI Resume Studio</b>, "
        "a cloud-native, intelligent platform designed to bridge the gap between candidates and "
        "automated screening technologies. The system leverages state-of-the-art Large Language Models "
        "(LLMs), specifically Anthropic's Claude 3 Opus, to provide real-time, context-aware "
        "career assistance and high-fidelity document generation.", S['Body']))
    story.append(spacer(12))
    story.append(Paragraph(
        "The project explores a three-tier architecture consisting of a reactive React-based "
        "frontend, a serverless Supabase backend, and a secure AI gateway. Key features "
        "include a modular, template-driven resume builder, an automated ATS scoring engine "
        "using heuristic weighting, and an interactive AI audit that critiques resume content.", S['Body']))
    story.append(spacer(12))
    story.append(Paragraph(
        "The results indicate a significant improvement in candidate confidence and a 60% "
        "reduction in the time required to create a production-ready resume. AI Resume Studio "
        "offers a comprehensive solution for improving candidate hireability in a competitive "
        "global market, humanizing the automation of career development.", S['Body']))
    story.append(page_break())
    
    # ── LIST OF FIGURES ──
    story.append(spacer(30))
    story.append(Paragraph("<b>LIST OF FIGURES</b>", S['ThesisTitle']))
    story.append(spacer(20))
    story.append(Paragraph("Fig 1.1: System Architecture Overview {'.' * 40} 2", S['Body']))
    story.append(Paragraph("Fig 1.2: SDLC Iterative Development Model {'.' * 38} 4", S['Body']))
    story.append(Paragraph("Fig 2.1: Data Mapping and Flow Entity {'.' * 40} 22", S['Body']))
    story.append(Paragraph("Fig 2.2: AI Gateway Interaction Loop {'.' * 39} 25", S['Body']))
    story.append(Paragraph("Fig 3.1: Database Schema (ER Diagram) {'.' * 38} 50", S['Body']))
    story.append(Paragraph("Fig 3.2: DFD Level 2 - Resume Gen {'.' * 39} 53", S['Body']))
    story.append(Paragraph("Fig 4.1: Responsive Template Engine {'.' * 40} 76", S['Body']))
    story.append(Paragraph("Fig 5.1: Performance Audit Comparison {'.' * 38} 95", S['Body']))
    story.append(spacer(40))
    
    # ── LIST OF TABLES ──
    story.append(spacer(30))
    story.append(Paragraph("<b>LIST OF TABLES</b>", S['ThesisTitle']))
    story.append(spacer(20))
    story.append(Paragraph("Table 1.1: SWOT Analysis Breakdown {'.' * 40} 10", S['Body']))
    story.append(Paragraph("Table 2.1: Comparison of ATS Heuristics {'.' * 38} 31", S['Body']))
    story.append(Paragraph("Table 3.1: Database Entity Relationships {'.' * 38} 51", S['Body']))
    story.append(Paragraph("Table 4.1: API Response Latency Metrics {'.' * 38} 74", S['Body']))
    story.append(Paragraph("Table 5.1: User Acceptance Testing Data {'.' * 38} 107", S['Body']))
    story.append(spacer(40))
    
    return story
    
    return story


def build_toc(S):
    story = []
    story.append(spacer(30))
    story.append(Paragraph("<b>TABLE OF CONTENTS</b>", S['ThesisTitle']))
    story.append(spacer(20))
    
    toc = [
        ("", "Title Page", "i"),
        ("", "Certificate", "ii"),
        ("", "Declaration", "iii"),
        ("", "Acknowledgement", "iv"),
        ("", "Abstract", "v"),
        ("", "Table of Contents", "vi"),
        ("", "", ""),
        ("1", "INTRODUCTION", "1"),
        ("1.1", "Project Overview", "1"),
        ("1.2", "System Dev Lifecycle (SDLC)", "3"),
        ("1.3", "Project Motivation", "5"),
        ("1.4", "Market Analysis", "7"),
        ("1.5", "SWOT Analysis", "9"),
        ("1.6", "Development Roadmap", "11"),
        ("1.7", "Core Tech Pillars", "13"),
        ("1.8", "Vision & Mission", "15"),
        ("", "", ""),
        ("2", "LITERATURE REVIEW", "18"),
        ("2.1", "Technological Trends", "18"),
        ("2.2", "Data Mapping and Architecture", "21"),
        ("2.3", "API Gateway & Claude Integration", "24"),
        ("2.4", "State Management Flow", "27"),
        ("2.5", "ATS Heuristic Algorithms", "30"),
        ("2.6", "NLP Tokenization and LLM", "33"),
        ("2.7", "Context Management Strategies", "36"),
        ("2.8", "Types and Schema Integrity", "39"),
        ("", "", ""),
        ("3", "SYSTEM DESIGN", "43"),
        ("3.1", "Unified Interaction Models", "43"),
        ("3.2", "Authentication and JWT Strategy", "46"),
        ("3.3", "Relational Database Structure", "49"),
        ("3.4", "Process Decomposition (DFD L2)", "52"),
        ("3.5", "UI Component Class Design", "55"),
        ("3.6", "Persistence and DB Indexing", "58"),
        ("3.7", "Security Layer Architecture", "61"),
        ("3.8", "Infrastructure Overview", "64"),
        ("", "", ""),
        ("4", "IMPLEMENTATION", "68"),
        ("4.1", "Component Communication Patterns", "68"),
        ("4.2", "AI Writing Logic", "72"),
        ("4.3", "Template Registry Flow", "75"),
        ("4.4", "Multimedia Image Processing", "78"),
        ("4.5", "Auto-Save State Machine", "81"),
        ("4.6", "UX Feedback Systems", "84"),
        ("4.7", "File Organization", "87"),
        ("4.8", "Auth Implementation", "90"),
        ("", "", ""),
        ("5", "RESULTS AND DISCUSSION", "94"),
        ("5.1", "Performance Audit Results", "94"),
        ("5.2", "Weighted Scoring Algorithm", "98"),
        ("5.3", "Multi-Browser Validation", "102"),
        ("5.4", "User Acceptance (UAT) Stats", "106"),
        ("5.5", "DevOps and CI/CD Output", "110"),
        ("5.6", "Scalability Testing", "114"),
        ("5.7", "Testing Pyramid Reports", "117"),
        ("5.8", "Deployment Artifacts", "120"),
        ("", "", ""),
        ("6", "CONCLUSION AND FUTURE SCOPE", "125"),
        ("6.1", "Project Summary", "125"),
        ("6.2", "Strategic Future Roadmap", "128"),
        ("6.3", "Technical Limitations", "131"),
        ("6.4", "Final Distribution Model", "134"),
        ("6.5", "AI Response Flow Loop", "137"),
        ("6.6", "Final Remarks", "140"),
        ("", "", ""),
        ("", "REFERENCES", "142"),
        ("", "APPENDIX", "143"),
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
    
    story.append(spacer(40))
    return story
