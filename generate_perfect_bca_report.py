import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION_START
from docx.enum.table import WD_TABLE_ALIGNMENT

def setup_header_footer(doc):
    for section in doc.sections:
        # Header
        header = section.header
        header_para = header.paragraphs[0] if header.paragraphs else header.add_paragraph()
        header_para.text = "AI Resume Studio\n" + "—" * 60
        header_para.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        header_para.runs[0].font.name = 'Times New Roman'
        header_para.runs[0].font.size = Pt(10)
        header_para.runs[0].font.bold = True
        
        # Footer
        footer = section.footer
        footer_para = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
        footer_para.text = "—" * 60 + "\nJanaprabha Institute of Engineering and Technology\t\t\t\tPg. "
        footer_para.alignment = WD_ALIGN_PARAGRAPH.LEFT
        footer_para.runs[0].font.name = 'Times New Roman'
        footer_para.runs[0].font.size = Pt(10)
        footer_para.runs[0].font.bold = True

def add_heading(doc, text, level=1, align=WD_ALIGN_PARAGRAPH.LEFT):
    h = doc.add_heading(level=level)
    run = h.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.color.rgb = RGBColor(0, 0, 0)
    run.font.bold = True
    if level == 2:
        run.font.underline = True
    h.alignment = align
    return h

def add_paragraph(doc, text, align=WD_ALIGN_PARAGRAPH.JUSTIFY):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    p.alignment = align
    return p

def add_bullet(doc, text):
    p = doc.add_paragraph(style='List Bullet')
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    return p

def add_centered_title_page(doc, title):
    doc.add_page_break()
    for _ in range(12):
        doc.add_paragraph()
    h = doc.add_heading(level=1)
    run = h.add_run(title)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(24)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0, 0, 0)
    h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_page_break()

def generate():
    doc = Document()
    setup_header_footer(doc)
    
    # --- CONTENTS ---
    add_heading(doc, 'CONTENTS', level=1, align=WD_ALIGN_PARAGRAPH.CENTER)
    doc.add_paragraph()
    
    toc_data = [
        ("Sr. No.", "CHAPTER", "Page No"),
        ("1", "BRIEF REVIEW OF THE PROJECT", ""),
        ("", "1.1 TITLE", "1"),
        ("", "1.2 INTRODUCTION / OBJECTIVE", "2"),
        ("", "1.3 PRELIMINARY INVESTIGATION", "3"),
        ("", "1.4 FLAWS IN PRESENT SYSTEM", "4"),
        ("", "1.5 NEED OF NEW SYSTEM", "5"),
        ("2", "DETAILED SYSTEM DESIGN", ""),
        ("", "2.1 SYSTEM FLOW CHART", "6"),
        ("", "2.2 DETAILS OF LOGIC DEVELOPED", "7"),
        ("", "2.3 STRUCTURE DIAGRAM OF EACH MODULE", "9"),
        ("", "2.4 DATA DICTIONARY", "10"),
        ("", "2.5 DATA FLOW DIAGRAMS", "12"),
        ("3", "SOFTWARE/ HARDWARE DETAILS", ""),
        ("", "3.1 CHOICE OF A LANGUAGE USED", "14"),
        ("", "3.2 HARDWARE/ SOFTWARE SPECIFICATION", "15"),
        ("4", "SYSTEM DESIGN", ""),
        ("", "4.1 PROGRAM LISTING", "16"),
        ("", "4.2 INPUT SCREENS", "18"),
        ("", "4.3 OUTPUT SCREENS / REPORTS", "22"),
        ("5", "USER DOCUMENTATION", ""),
        ("", "5.1 IMPLEMENTATION, PROGRAM\nEXECUTION & MAINTENANCE", "26"),
        ("6", "CONCLUSION", ""),
        ("", "6.1 LIMITATIONS OF THE SYSTEM", "28"),
        ("", "6.2 SCOPE AND FUTURE MODIFICATION", "29"),
        ("7", "REFERENCES / BIBLIOGRAPHY", "30")
    ]
    
    table = doc.add_table(rows=len(toc_data), cols=3)
    table.style = 'Table Grid'
    for i, (sr, chap, pg) in enumerate(toc_data):
        cells = table.rows[i].cells
        cells[0].text = sr
        cells[1].text = chap
        cells[2].text = pg
        for cell in cells:
            for p in cell.paragraphs:
                for r in p.runs:
                    r.font.name = 'Times New Roman'
                    if sr != "" or i == 0:
                        r.font.bold = True

    # ---------- CHAPTER 1 ----------
    add_centered_title_page(doc, "BRIEF REVIEW OF THE PROJECT")
    
    add_heading(doc, '1.1 TITLE', level=2)
    add_paragraph(doc, "AI Resume Studio — Resume Maker with ATS Scoring & AI-Powered Features")
    
    add_heading(doc, '1.2 INTRODUCTION / OBJECTIVE', level=2)
    add_paragraph(doc, "The online resume building ecosystem is a very popular platform for job seekers. Many companies are now enforcing strict Applicant Tracking System (ATS) parsing systems. Our AI Resume Studio provides facilities like smart skill and language proficiency detection, auto ATS scores, intelligent summary generation, and interactive resume dashboards. It acts similarly to modern portfolio systems but has advanced AI features making recruitment easier.")
    
    add_heading(doc, '1.3 PRELIMINARY INVESTIGATION', level=2)
    add_paragraph(doc, "A preliminary investigation of resume builders typically involves examining various aspects related to ATS functionalities. Here is a breakdown:")
    add_paragraph(doc, "1. Technology Infrastructure: Assess the technological requirements, including React interface, APIs, PDF generation limitations.")
    add_paragraph(doc, "2. Assessment and Feedback: Evaluate the mechanisms of real-time ATS feedback systems across formats.")
    add_paragraph(doc, "3. Data Privacy and Security: Investigate measures ensuring user PDF data privacy and secure authentication via Supabase.")
    
    add_heading(doc, '1.4 FLAWS IN PRESENT SYSTEM', level=2)
    add_paragraph(doc, "Current generic platforms lack structured AI suggestions and native ATS grading metrics, meaning users miss out on keyword insertions blindly.")
    
    add_heading(doc, '1.5 NEED OF NEW SYSTEM', level=2)
    add_paragraph(doc, "Our AI Resume Studio online system has significant facilities that a user or recruiter can utilize. The system intelligently detects job description overlaps and calculates an exact ATS fit percentage.")
    
    # ---------- CHAPTER 2 ----------
    add_centered_title_page(doc, "DETAILED SYSTEM DESIGN")
    
    add_heading(doc, '2.1 SYSTEM FLOW CHART', level=2)
    add_bullet(doc, "System Flow Diagram for Admin:")
    doc.add_picture('data/diagrams/system_flow_admin.png', width=Inches(4.5))
    add_bullet(doc, "System Flow Diagram for User:")
    doc.add_picture('data/diagrams/system_flow_user.png', width=Inches(3.5))

    add_heading(doc, '2.2 DETAILS OF LOGIC DEVELOPED', level=2)
    add_paragraph(doc, "The logic was developed using the React functional components state. The AI logic was built connecting an external API (Claude Opus) and processing chunks of texts into exact structural points.")

    add_heading(doc, '2.3 STRUCTURE DIAGRAM OF EACH MODULE', level=2)
    add_bullet(doc, "Activity diagram for Admin:")
    doc.add_picture('data/diagrams/activity_admin.png', width=Inches(5))
    doc.add_page_break()
    add_bullet(doc, "Activity diagram for User:")
    doc.add_picture('data/diagrams/activity_user.png', width=Inches(5))
    add_bullet(doc, "State Diagram of Admin:")
    doc.add_picture('data/diagrams/state_admin.png', width=Inches(4))
    add_bullet(doc, "State Diagram of User:")
    doc.add_picture('data/diagrams/state_user.png', width=Inches(4))

    doc.add_page_break()
    add_heading(doc, '2.4 DATA DICTIONARY', level=2)
    add_paragraph(doc, "Database: Supabase PostgreSQL. Tables include 'resumes', 'profiles', etc.")

    add_heading(doc, '2.5 DATA FLOW DIAGRAMS', level=2)
    add_paragraph(doc, "See flow diagrams indicated previously.")

    # ---------- CHAPTER 3 ----------
    add_centered_title_page(doc, "SOFTWARE/ HARDWARE DETAILS")
    add_heading(doc, '3.1 CHOICE OF A LANGUAGE USED', level=2)
    add_paragraph(doc, "TypeScript, React, Node.js, Python for scripting.")
    
    add_heading(doc, '3.2 HARDWARE/ SOFTWARE SPECIFICATION', level=2)
    add_paragraph(doc, "Any Web Browser, Minimum 4GB Ram system.")

    # ---------- CHAPTER 4 ----------
    add_centered_title_page(doc, "SYSTEM DESIGN")
    
    add_heading(doc, '4.1 PROGRAM LISTING', level=2)
    add_paragraph(doc, "Below is the execution code (src/pages/Index.tsx snippet):")
    try:
        with open('src/pages/Index.tsx', 'r') as f:
            code_snip = f.read()[:1500] + "\n... [Code Truncated]"
        p = doc.add_paragraph()
        run = p.add_run(code_snip)
        run.font.name = 'Courier New'
        run.font.size = Pt(8)
    except:
        add_paragraph(doc, "[Code execution file missing]")

    doc.add_page_break()
    add_heading(doc, '4.2 INPUT SCREENS', level=2)
    add_paragraph(doc, "Platform landing and input interfaces.")
    if os.path.exists('public/screenshots/real_landing.png'):
        doc.add_picture('public/screenshots/real_landing.png', width=Inches(6))
        add_paragraph(doc, "Fig: Landing Page Input", align=WD_ALIGN_PARAGRAPH.CENTER)
    
    doc.add_page_break()
    add_heading(doc, '4.3 OUTPUT SCREENS / REPORTS', level=2)
    add_paragraph(doc, "Builder output screens and Dashboard.")
    if os.path.exists('public/screenshots/real_builder.png'):
        doc.add_picture('public/screenshots/real_builder.png', width=Inches(6))
        add_paragraph(doc, "Fig: Builder Generation Page", align=WD_ALIGN_PARAGRAPH.CENTER)

    if os.path.exists('public/screenshots/real_dashboard.png'):
        doc.add_picture('public/screenshots/real_dashboard.png', width=Inches(6))
        add_paragraph(doc, "Fig: Dashboard Output Screen", align=WD_ALIGN_PARAGRAPH.CENTER)

    # ---------- CHAPTER 5 ----------
    add_centered_title_page(doc, "USER DOCUMENTATION")
    add_heading(doc, '5.1 IMPLEMENTATION, PROGRAM EXECUTION & MAINTENANCE', level=2)
    add_paragraph(doc, "The maintenance happens across the scalable architecture on Vercel.")

    # ---------- CHAPTER 6 & 7 ----------
    add_centered_title_page(doc, "CONCLUSION")
    add_heading(doc, '6.1 LIMITATIONS OF THE SYSTEM', level=2)
    add_paragraph(doc, "Certain heavy PDF modules may degrade UX on low end network setups.")

    add_heading(doc, '6.2 SCOPE AND FUTURE MODIFICATION', level=2)
    add_paragraph(doc, "Further improvements integrating mobile native application components.")

    doc.add_page_break()
    add_heading(doc, '7 REFERENCES / BIBLIOGRAPHY', level=2)
    add_paragraph(doc, "[1] React Documentation.\n[2] Supabase Data Management.")

    os.makedirs('data/Generated_Reports', exist_ok=True)
    doc.save('data/Generated_Reports/Student_Thesis_Report.docx')
    doc.save('data/Generated_Reports/Practical_Project_Report.docx')
    
if __name__ == '__main__':
    generate()
