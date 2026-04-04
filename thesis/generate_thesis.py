#!/usr/bin/env python3
"""
AI Resume Studio — Complete University-Level Thesis Generator
Generates ~80 page PDF with Times New Roman, proper formatting, diagrams
"""

import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.colors import HexColor, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    Preformatted, KeepTogether, ListFlowable, ListItem
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Try to register Times New Roman
FONT_NAME = "Times-Roman"
FONT_BOLD = "Times-Bold"
FONT_ITALIC = "Times-Italic"
FONT_BI = "Times-BoldItalic"

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "AI_Resume_Studio_Thesis.pdf")

WIDTH, HEIGHT = A4
MARGIN = 1 * inch

# ─── Styles ───
def get_styles():
    styles = getSampleStyleSheet()
    
    styles.add(ParagraphStyle(
        'ThesisTitle', fontName=FONT_BOLD, fontSize=22,
        leading=28, alignment=TA_CENTER, spaceAfter=12
    ))
    styles.add(ParagraphStyle(
        'ThesisSubtitle', fontName=FONT_ITALIC, fontSize=14,
        leading=20, alignment=TA_CENTER, spaceAfter=8
    ))
    styles.add(ParagraphStyle(
        'CenterNormal', fontName=FONT_NAME, fontSize=13,
        leading=20, alignment=TA_CENTER, spaceAfter=6
    ))
    styles.add(ParagraphStyle(
        'CenterBold', fontName=FONT_BOLD, fontSize=13,
        leading=20, alignment=TA_CENTER, spaceAfter=6
    ))
    styles.add(ParagraphStyle(
        'ChapterTitle', fontName=FONT_BOLD, fontSize=16,
        leading=22, spaceAfter=14, spaceBefore=20,
        textColor=HexColor('#1a1a2e')
    ))
    styles.add(ParagraphStyle(
        'SectionTitle', fontName=FONT_BOLD, fontSize=14,
        leading=18, spaceAfter=10, spaceBefore=14,
        textColor=HexColor('#16213e')
    ))
    styles.add(ParagraphStyle(
        'SubSection', fontName=FONT_BOLD, fontSize=12,
        leading=16, spaceAfter=8, spaceBefore=10
    ))
    styles.add(ParagraphStyle(
        'Body', fontName=FONT_NAME, fontSize=12,
        leading=18, alignment=TA_JUSTIFY, spaceAfter=6
    ))
    styles.add(ParagraphStyle(
        'BodyIndent', fontName=FONT_NAME, fontSize=12,
        leading=18, alignment=TA_JUSTIFY, spaceAfter=6,
        leftIndent=24
    ))
    styles.add(ParagraphStyle(
        'ThesisBullet', fontName=FONT_NAME, fontSize=12,
        leading=18, alignment=TA_JUSTIFY, spaceAfter=4,
        leftIndent=36, bulletIndent=18
    ))
    styles.add(ParagraphStyle(
        'CodeBlock', fontName='Courier', fontSize=9,
        leading=12, spaceAfter=8, spaceBefore=6,
        leftIndent=24, rightIndent=12,
        backColor=HexColor('#f5f5f5')
    ))
    styles.add(ParagraphStyle(
        'Caption', fontName=FONT_ITALIC, fontSize=10,
        leading=14, alignment=TA_CENTER, spaceAfter=12
    ))
    styles.add(ParagraphStyle(
        'Reference', fontName=FONT_NAME, fontSize=11,
        leading=16, spaceAfter=8, leftIndent=36,
        firstLineIndent=-36
    ))
    styles.add(ParagraphStyle(
        'TOCEntry', fontName=FONT_NAME, fontSize=12,
        leading=20, spaceAfter=2
    ))
    styles.add(ParagraphStyle(
        'TOCChapter', fontName=FONT_BOLD, fontSize=12,
        leading=22, spaceAfter=2
    ))
    return styles

def add_page_number(canvas, doc):
    page_num = canvas.getPageNumber()
    if page_num > 6:  # Skip front matter
        canvas.saveState()
        canvas.setFont(FONT_NAME, 10)
        canvas.drawCentredString(WIDTH / 2, 30, f"— {page_num} —")
        canvas.restoreState()

# ─── Content Sections ───
from thesis_content import (
    build_front_matter, build_toc, build_chapter1,
    build_chapter2, build_chapter3, build_chapter4,
    build_chapter5, build_chapter6, build_references,
    build_appendix
)

def main():
    doc = SimpleDocTemplate(
        OUTPUT_FILE, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=0.8*inch, bottomMargin=0.8*inch,
        title="AI Resume Studio with ATS & AI Features — MCA Thesis",
        author="Vansh Khandekar"
    )
    
    styles = get_styles()
    story = []
    
    print("🔨 Building front matter...")
    story += build_front_matter(styles)
    
    print("📋 Building table of contents...")
    story += build_toc(styles)
    
    print("📖 Building Chapter 1: Introduction...")
    story += build_chapter1(styles)
    
    print("📖 Building Chapter 2: Literature Review...")
    story += build_chapter2(styles)
    
    print("📖 Building Chapter 3: System Design...")
    story += build_chapter3(styles)
    
    print("📖 Building Chapter 4: Implementation...")
    story += build_chapter4(styles)
    
    print("📖 Building Chapter 5: Results & Discussion...")
    story += build_chapter5(styles)
    
    print("📖 Building Chapter 6: Conclusion & Future Scope...")
    story += build_chapter6(styles)
    
    print("📚 Building References...")
    story += build_references(styles)
    
    print("📎 Building Appendix...")
    story += build_appendix(styles)
    
    print(f"\n📝 Generating PDF: {OUTPUT_FILE}")
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(f"✅ Thesis PDF generated successfully!")
    print(f"📄 Location: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
