"""Shared helpers for thesis content generation."""
import os
import textwrap
from reportlab.platypus import Spacer, PageBreak, Paragraph, Table, TableStyle, Preformatted, Image, KeepTogether
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.enums import TA_CENTER

def spacer(h=30): return Spacer(1, h) # Increased default spacer

def page_break():
    return PageBreak()

def get_code_snippet(file_path, start_line, end_line, styles):
    """Reads a snippet from a source file, wraps long lines, and returns a Preformatted block."""
    full_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), file_path)
    try:
        if not os.path.exists(full_path):
            return Paragraph(f"[Source file {file_path} not found]", styles['Body'])
        
        with open(full_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            snippet_lines = lines[start_line-1:end_line]
            
            wrapped_lines = []
            max_width = 60 # Safer width for 11pt Courier with 1.5" left margin
            
            for line in snippet_lines:
                clean_line = line.replace('\t', '    ').rstrip()
                if len(clean_line) > max_width:
                    # Wrap long lines but keep indentation
                    indent_match = clean_line[:len(clean_line)-len(clean_line.lstrip())]
                    wrapped = textwrap.fill(clean_line, width=max_width, initial_indent='', subsequent_indent=indent_match + '    ')
                    wrapped_lines.append(wrapped + '\n')
                else:
                    wrapped_lines.append(clean_line + '\n')
            
            snippet = "".join(wrapped_lines)
            return Preformatted(snippet, styles['CodeBlock'])
    except Exception as e:
        return Paragraph(f"[Error reading code: {str(e)}]", styles['Body'])

def img(name, width=5.0*inch): # Reduced default width
    """Return an Image flowable for the named diagram, or None if not found."""
    THESIS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DIAG_DIR = os.path.join(THESIS_DIR, 'thesis_diagrams')
    path = os.path.join(DIAG_DIR, f'{name}.png')
    if not os.path.exists(path):
        return None
    from PIL import Image as PILImage
    try:
        pil = PILImage.open(path)
        w_px, h_px = pil.size
        aspect = h_px / w_px
        height = width * aspect
        if height > 4.5 * inch: # Reduced max height to avoid page jumps
            height = 4.5 * inch
            width = height / aspect
        return Image(path, width=width, height=height)
    except: return None

def img_cap(name, cap, styles, width=5.0*inch):
    """Returns Image + Caption as a list of flowables."""
    i = img(name, width)
    if not i:
        return [Paragraph(f"[Diagram: {name}.png not found]", styles['Caption'])]
    return [spacer(4), i, Paragraph(f"<i>Figure: {cap}</i>", styles['Caption']), spacer(4)]

def code_cap(file_path, start, end, cap, styles):
    """Returns Code + Caption as a list, splitting long code into chunks."""
    story = []
    chunk_size = 45 
    
    current = start
    while current <= end:
        chunk_end = min(current + chunk_size - 1, end)
        story.append(spacer(4))
        story.append(get_code_snippet(file_path, current, chunk_end, styles))
        current += chunk_size
        
    story.append(Paragraph(f"<i>Source: {cap}</i>", styles['Caption']))
    story.append(spacer(8))
    return story

def add_image(path, width=5.5*inch, height=None, caption=None, styles=None):
    """Inserts a screenshot image with an optional caption."""
    try:
        from reportlab.lib.utils import ImageReader
        if not os.path.isabs(path):
             path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), path)

        if not os.path.exists(path):
            return [Paragraph(f"[Image Missing: {path}]", styles['Caption'])]
            
        reader = ImageReader(path)
        img_w, img_h = reader.getSize()
        aspect = img_h / img_w
        if not height: height = width * aspect
        if height > 4.5 * inch:
            height = 4.5 * inch
            width = height / aspect

        i = Image(path, width=width, height=height)
        content = [spacer(8), i]
        if caption and styles:
            content.append(spacer(4))
            content.append(Paragraph(f"<i>{caption}</i>", styles['Caption']))
        content.append(spacer(8))
        return content
    except Exception as e:
        return [Paragraph(f"[Error loading image: {str(e)}]", styles['Caption'])]

def ascii_diagram(text, styles):
    """Returns a Preformatted block, with a simple manual wrap for long lines."""
    import textwrap
    wrapped_lines = []
    max_w = 72
    for line in text.splitlines():
        if len(line) > max_w:
            wrapped_lines.append(textwrap.fill(line, width=max_w))
        else:
            wrapped_lines.append(line)
    return Preformatted("\n".join(wrapped_lines), styles['CodeBlock'])

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
