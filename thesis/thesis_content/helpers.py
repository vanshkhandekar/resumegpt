"""Shared helpers for thesis content generation."""
import os
from reportlab.platypus import Spacer, PageBreak, Paragraph, Table, TableStyle, Preformatted, Image, KeepTogether
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.enums import TA_CENTER

def add_image(path, width=5.5*inch, height=None, caption=None, styles=None):
    """Inserts an image with an optional caption."""
    try:
        from reportlab.platypus import Image
        from reportlab.lib.utils import ImageReader
        
        if not os.path.exists(path):
            return [Paragraph(f"[Image Missing: {os.path.basename(path)}]", styles['Caption'])]
            
        reader = ImageReader(path)
        img_w, img_h = reader.getSize()
        aspect = img_h / img_w
        
        if not height:
            height = width * aspect
            
        img = Image(path, width=width, height=height)
        story = [spacer(8), img]
        if caption and styles:
            story.append(spacer(4))
            story.append(Paragraph(f"<i>{caption}</i>", styles['Caption']))
        story.append(spacer(8))
        return story
    except Exception as e:
        print(f"Error adding image {path}: {e}")
        return [Paragraph(f"[Image Missing: {path}]", styles['Caption'])]

def spacer(h=8):
    return Spacer(1, h)

def page_break():
    return PageBreak()

def ascii_diagram(text, styles):
    return Preformatted(text, styles['CodeBlock'])

def make_table(data, col_widths=None):
    """Creates a styled thesis table."""
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, 0), 'Times-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Times-Roman'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, HexColor('#f8f9fa')]),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    return t
