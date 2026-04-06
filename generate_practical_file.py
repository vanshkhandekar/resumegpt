import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.colors import HexColor, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image, Flowable, KeepTogether
)

import datetime

# --- CONFIGURATION ---
FONT_NAME = "Times-Roman"
FONT_BOLD = "Times-Bold"
FONT_ITALIC = "Times-Italic"
FONT_BI = "Times-BoldItalic"

STUDENT_NAME = "Vansh Khandekar"
PRN_NO = "NMXXXXX"
ROLL_NO = "M0XXX"
BATCH = "2024 - 2026"
INSTITUTE = "SVKM's NMIMS, INDORE"
COURSE = "Master of Computer Applications (MCA) Semester - I"
SUBJECT = "Web Technologies"

PRACTICALS_DIR = "data"
OUTPUT_FILE = "Practical_File.pdf"
# ---------------------

def get_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle('CoverTitle', fontName=FONT_BOLD, fontSize=36, leading=40, alignment=TA_CENTER, spaceAfter=20))
    styles.add(ParagraphStyle('CoverSub', fontName=FONT_NAME, fontSize=18, leading=24, alignment=TA_CENTER, spaceAfter=10))
    styles.add(ParagraphStyle('CoverBold', fontName=FONT_BOLD, fontSize=16, leading=22, alignment=TA_CENTER, spaceAfter=8))
    styles.add(ParagraphStyle('CoverNormal', fontName=FONT_NAME, fontSize=16, leading=22, alignment=TA_CENTER, spaceAfter=8))
    
    styles.add(ParagraphStyle('Heading', fontName=FONT_BOLD, fontSize=24, leading=28, alignment=TA_CENTER, spaceAfter=20))
    styles.add(ParagraphStyle('Body', fontName=FONT_NAME, fontSize=14, leading=20, alignment=TA_JUSTIFY, spaceAfter=12))
    styles.add(ParagraphStyle('BodyLeft', fontName=FONT_NAME, fontSize=14, leading=20, alignment=TA_LEFT, spaceAfter=12))
    styles.add(ParagraphStyle('BodyBoldLeft', fontName=FONT_BOLD, fontSize=14, leading=20, alignment=TA_LEFT, spaceAfter=12))
    
    styles.add(ParagraphStyle('PracticalTitle', fontName=FONT_BOLD, fontSize=28, leading=32, alignment=TA_CENTER, spaceAfter=20))
    styles.add(ParagraphStyle('PracticalSection', fontName=FONT_BOLD, fontSize=18, leading=24, alignment=TA_LEFT, spaceAfter=10, spaceBefore=15))
    return styles

def spacer(h):
    return Spacer(1, h)

# Custom flowable for border
def add_border(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(black)
    canvas.setLineWidth(2)
    # Draw border with some margin
    margin = 40
    canvas.rect(margin, margin, A4[0] - 2*margin, A4[1] - 2*margin)
    canvas.restoreState()

def build_cover(S):
    story = []
    story.append(spacer(40))
    story.append(Paragraph("PRACTICAL FILE", S['CoverTitle']))
    story.append(Paragraph("of", S['CoverSub']))
    story.append(Paragraph(SUBJECT, S['CoverBold']))
    story.append(spacer(20))
    story.append(Paragraph(COURSE, S['CoverNormal']))
    story.append(Paragraph(f"Batch {BATCH}", S['CoverNormal']))
    story.append(spacer(60))
    
    story.append(Paragraph(f"Name : {STUDENT_NAME}", S['CoverBold']))
    story.append(Paragraph(f"PRN: {PRN_NO}", S['CoverBold']))
    story.append(Paragraph(f"Roll No.: {ROLL_NO}", S['CoverBold']))
    story.append(spacer(80))
    
    # Try to add a logo placeholder or actual logo if exists
    # logo_path = "logo.png"
    # if os.path.exists(logo_path):
    #     im = Image(logo_path, width=2*inch, height=2*inch)
    #     story.append(im)
    
    story.append(Paragraph(f"Institute: {INSTITUTE}", S['CoverBold']))
    story.append(PageBreak())
    return story

def build_certificate(S):
    story = []
    story.append(spacer(60))
    story.append(Paragraph("Certificate", S['Heading']))
    story.append(spacer(20))
    
    text = (
        f"This is to certify that Mr/Ms <b>{STUDENT_NAME}</b>, a student of MCA ({BATCH}), "
        f"has successfully completed the Practical file of <b>{SUBJECT}</b> for Semester I."
    )
    story.append(Paragraph(text, S['Body']))
    story.append(spacer(140))
    
    sig_data = [
        [Paragraph("Submitted To:", S['Body']), Paragraph("Signature of Faculty", S['Body'])]
    ]
    t = Table(sig_data, colWidths=[3*inch, 3*inch])
    t.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
    ]))
    story.append(t)
    story.append(PageBreak())
    return story

def build_declaration(S):
    story = []
    story.append(spacer(60))
    story.append(Paragraph("DECLARATION", S['Heading']))
    story.append(spacer(20))
    
    text = (
        f"I, <b>{STUDENT_NAME}</b>, hereby declare that the practical file is a record of authentic work "
        f"carried out by me during the academic year {BATCH} for the subject <b>{SUBJECT}</b>. "
        f"The matter embodied in this document has not been submitted earlier for the award of any "
        f"degree or diploma to the best of my knowledge and belief."
    )
    story.append(Paragraph(text, S['Body']))
    story.append(spacer(100))
    
    sig_data = [
        [Paragraph(f"Name: {STUDENT_NAME}", S['BodyLeft']), Paragraph("Student Signature", S['BodyLeft'])]
    ]
    t = Table(sig_data, colWidths=[3*inch, 3*inch])
    story.append(t)
    story.append(PageBreak())
    return story

def build_acknowledgment(S):
    story = []
    story.append(spacer(60))
    story.append(Paragraph("ACKNOWLEDGMENT", S['Heading']))
    story.append(spacer(20))
    
    text = (
        "I would like to express my special thanks of gratitude to my teacher who gave me the golden "
        f"opportunity to do this wonderful practical file on the subject <b>{SUBJECT}</b>, which also helped "
        "me in doing a lot of Research and I came to know about so many new things. I am really thankful to them."
    )
    story.append(Paragraph(text, S['Body']))
    story.append(spacer(100))
    story.append(Paragraph(f"<b>{STUDENT_NAME}</b>", S['BodyLeft']))
    story.append(PageBreak())
    return story

def build_practicals(S):
    story = []
    practicals = []
    
    if os.path.exists(PRACTICALS_DIR):
        folders = sorted([f for f in os.listdir(PRACTICALS_DIR) if os.path.isdir(os.path.join(PRACTICALS_DIR, f))])
        for idx, folder in enumerate(folders, 1):
            base = os.path.join(PRACTICALS_DIR, folder)
            
            # Read Aim
            aim_txt = ""
            aim_path = os.path.join(base, "aim.txt")
            if os.path.exists(aim_path):
                with open(aim_path, 'r', encoding='utf-8') as f:
                    aim_txt = f.read().strip()
            if not aim_txt:
                aim_txt = "Aim of the practical."
                
            # Process practical
            practicals.append({
                "no": idx,
                "title": folder.split('_', 1)[-1] if '_' in folder else folder,
                "aim": aim_txt,
                "input_img": os.path.join(base, "input.png"),
                "output_img": os.path.join(base, "output.png")
            })

    # 5. INDEX
    story.append(spacer(40))
    story.append(Paragraph("INDEX", S['Heading']))
    story.append(spacer(20))
    
    index_data = [["Sr.No.", "Name of the Practical", "Page No.", "Date", "Sign.", "Remarks"]]
    for p in practicals:
        index_data.append([str(p['no']), p['aim'][:50] + "...", "", "", "", ""])
        
    t = Table(index_data, colWidths=[0.6*inch, 2.7*inch, 0.8*inch, 0.8*inch, 0.8*inch, 1*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HexColor("#f0f0f0")),
        ('GRID', (0,0), (-1,-1), 1, black),
        ('FONTNAME', (0,0), (-1,0), FONT_BOLD),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,0), 12),
        ('TOPPADDING', (0,0), (-1,0), 12),
    ]))
    story.append(t)
    story.append(PageBreak())
    
    # 6. PRACTICAL PAGES
    for p in practicals:
        story.append(spacer(20))
        story.append(Paragraph(p['title'], S['PracticalTitle']))
        
        # Aim
        story.append(Paragraph(f"Aim: {p['aim']}", S['BodyLeft']))
        story.append(spacer(10))
        
        # Input
        story.append(Paragraph("The Input (Source Code HTML Page):", S['PracticalSection']))
        input_path = p['input_img'] if os.path.exists(p['input_img']) else p['input_img'].replace('.png', '.jpg')
        if os.path.exists(input_path):
            img = Image(input_path, width=6*inch, height=3.5*inch, kind='proportional')
            story.append(img)
        else:
            story.append(Paragraph(f"<i>[Please place input.png in {os.path.dirname(input_path)}]</i>", S['Body']))
        
        story.append(spacer(20))
        
        # Output
        story.append(Paragraph("The Output HTML Page:", S['PracticalSection']))
        output_path = p['output_img'] if os.path.exists(p['output_img']) else p['output_img'].replace('.png', '.jpg')
        if os.path.exists(output_path):
            img = Image(output_path, width=6*inch, height=3.5*inch, kind='proportional')
            story.append(img)
        else:
            story.append(Paragraph(f"<i>[Please place output.png in {os.path.dirname(output_path)}]</i>", S['Body']))
            
        story.append(PageBreak())

    return story

def main():
    doc = SimpleDocTemplate(
        OUTPUT_FILE, pagesize=A4,
        leftMargin=inch, rightMargin=inch,
        topMargin=inch, bottomMargin=inch,
        title="Web Technologies Practical File"
    )
    S = get_styles()
    story = []
    
    story += build_cover(S)
    story += build_certificate(S)
    story += build_declaration(S)
    story += build_acknowledgment(S)
    story += build_practicals(S)
    
    print(f"Generating PDF: {OUTPUT_FILE}")
    doc.build(story, onFirstPage=add_border, onLaterPages=add_border)
    print("Done!")

if __name__ == "__main__":
    if not os.path.exists(PRACTICALS_DIR):
        os.makedirs(PRACTICALS_DIR)
        print(f"Created '{PRACTICALS_DIR}' directory. Please add folders for practicals with 'aim.txt', 'input.png' and 'output.png'.")
    main()
