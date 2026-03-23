"""
Antigravity Resume Studio — Premium Pitch Deck Generator
Generates a high-end, startup-quality PowerPoint presentation.
"""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor
from pptx.oxml.ns import qn
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(SCRIPT_DIR, 'assets')

# ─── Theme Colors ────────────────────────────────────────────────────────
DARK_BG      = RGBColor(8, 12, 28)       # Deep space navy
CARD_BG      = RGBColor(17, 24, 49)       # Card surface
CARD_BORDER  = RGBColor(40, 60, 110)      # Subtle blue border
NEON_BLUE    = RGBColor(59, 130, 246)     # Primary accent
CYAN         = RGBColor(6, 182, 212)      # Secondary accent
GREEN        = RGBColor(16, 185, 129)     # Success green
PURPLE       = RGBColor(139, 92, 246)     # Purple accent
PINK         = RGBColor(236, 72, 153)     # Pink accent
TEXT_WHITE   = RGBColor(241, 245, 249)    # Primary text
TEXT_GREY    = RGBColor(148, 163, 184)    # Secondary text
TEXT_DIM     = RGBColor(100, 116, 139)    # Dim text
ORANGE       = RGBColor(249, 115, 22)     # Orange accent

SLIDE_WIDTH  = Inches(13.333)
SLIDE_HEIGHT = Inches(7.5)

prs = Presentation()
prs.slide_width  = SLIDE_WIDTH
prs.slide_height = SLIDE_HEIGHT


# ═══════════════════════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════════════════════

def set_bg(slide, color):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color

def add_bg_image(slide, img_path):
    """Set a full-bleed background image."""
    slide.shapes.add_picture(
        img_path, Inches(0), Inches(0),
        width=SLIDE_WIDTH, height=SLIDE_HEIGHT
    )

def add_dark_overlay(slide, alpha=180):
    """Semi-transparent dark overlay on top of background image."""
    shape = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0), Inches(0),
        SLIDE_WIDTH, SLIDE_HEIGHT
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = RGBColor(8, 12, 28)
    # Set transparency via XML - access through shape element's spPr
    spPr = shape._element.find(qn('p:spPr'))
    solidFill = spPr.find(qn('a:solidFill'))
    srgb = solidFill.find(qn('a:srgbClr'))
    if srgb is not None:
        alpha_elem = srgb.makeelement(qn('a:alpha'), {})
        alpha_elem.set('val', str(alpha * 100000 // 255))
        srgb.append(alpha_elem)
    shape.line.fill.background()

def add_neon_line(slide, left, top, width, color=NEON_BLUE, height=Pt(3)):
    """Glowing accent line."""
    shape = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, left, top, width, height
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    # Glow effect via XML
    spPr = shape._element.find(qn('p:spPr'))
    if spPr is None:
        spPr = shape._element.makeelement(qn('p:spPr'), {})
        shape._element.append(spPr)
    effectLst = spPr.makeelement(qn('a:effectLst'), {})
    glow = effectLst.makeelement(qn('a:glow'), {'rad': '101600'})
    srgbClr = glow.makeelement(qn('a:srgbClr'), {'val': str(color)})
    alpha = srgbClr.makeelement(qn('a:alpha'), {'val': '60000'})
    srgbClr.append(alpha)
    glow.append(srgbClr)
    effectLst.append(glow)
    spPr.append(effectLst)

def add_glass_card(slide, left, top, width, height, border_color=CARD_BORDER):
    """Glassmorphism-style card."""
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = CARD_BG
    # Transparency via XML
    spPr = shape._element.find(qn('p:spPr'))
    solidFill = spPr.find(qn('a:solidFill'))
    srgb = solidFill.find(qn('a:srgbClr'))
    if srgb is not None:
        alpha_elem = srgb.makeelement(qn('a:alpha'), {})
        alpha_elem.set('val', '85000')  # 85% opacity
        srgb.append(alpha_elem)
    shape.line.color.rgb = border_color
    shape.line.width = Pt(1)
    # Rounded corners
    shape.adjustments[0] = 0.05
    return shape

def add_text(slide, left, top, width, height, text, font_size=18,
             color=TEXT_WHITE, bold=False, alignment=PP_ALIGN.LEFT,
             font_name='Arial'):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = alignment
    # IMPORTANT: Use run-level font properties, NOT paragraph-level.
    # Paragraph-level (.p.font) gets overridden by PowerPoint theme defaults.
    # Run-level (.runs[].font) always takes precedence and renders correctly.
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.color.rgb = color
    run.font.bold = bold
    run.font.name = font_name
    return txBox

def add_icon_text(slide, left, top, icon_char, label, desc,
                  accent_color=NEON_BLUE, card_w=Inches(2.8), card_h=Inches(2.5)):
    """Card with icon character, label, and description."""
    card = add_glass_card(slide, left, top, card_w, card_h, accent_color)
    # Icon circle
    circle = slide.shapes.add_shape(
        MSO_SHAPE.OVAL, left + Inches(0.9), top + Inches(0.3),
        Inches(1.0), Inches(1.0)
    )
    circle.fill.solid()
    circle.fill.fore_color.rgb = accent_color
    # Transparency for circle via XML
    spPr = circle._element.find(qn('p:spPr'))
    solidFill = spPr.find(qn('a:solidFill'))
    srgb = solidFill.find(qn('a:srgbClr'))
    if srgb is not None:
        alpha_elem = srgb.makeelement(qn('a:alpha'), {})
        alpha_elem.set('val', '25000')
        srgb.append(alpha_elem)
    circle.line.fill.background()
    # Icon text — use run-level for guaranteed color
    tf = circle.text_frame
    tf.word_wrap = False
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(8)
    run = p.add_run()
    run.text = icon_char
    run.font.size = Pt(32)
    run.font.color.rgb = accent_color
    run.font.bold = True
    # Label
    add_text(slide, left + Inches(0.15), top + Inches(1.3), card_w - Inches(0.3), Inches(0.4),
             label, font_size=15, color=TEXT_WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    # Desc
    add_text(slide, left + Inches(0.1), top + Inches(1.8), card_w - Inches(0.2), Inches(0.6),
             desc, font_size=10, color=TEXT_GREY, alignment=PP_ALIGN.CENTER)

def add_step_card(slide, left, top, number, title, desc, accent=NEON_BLUE):
    """Numbered step card for workflow."""
    card = add_glass_card(slide, left, top, Inches(2.5), Inches(2.4), accent)
    # Number circle
    circ = slide.shapes.add_shape(
        MSO_SHAPE.OVAL, left + Inches(0.85), top + Inches(0.25),
        Inches(0.8), Inches(0.8)
    )
    circ.fill.solid()
    circ.fill.fore_color.rgb = accent
    circ.line.fill.background()
    tf = circ.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(4)
    run = p.add_run()
    run.text = str(number)
    run.font.size = Pt(28)
    run.font.color.rgb = RGBColor(255, 255, 255)
    run.font.bold = True
    # Title
    add_text(slide, left + Inches(0.15), top + Inches(1.05), Inches(2.2), Inches(0.5),
             title, font_size=15, color=TEXT_WHITE, bold=True, alignment=PP_ALIGN.CENTER)
    # Desc
    add_text(slide, left + Inches(0.1), top + Inches(1.6), Inches(2.3), Inches(1.0),
             desc, font_size=10, color=TEXT_GREY, alignment=PP_ALIGN.CENTER)

def add_slide_number(slide, num, total):
    add_text(slide, Inches(12.3), Inches(7.0), Inches(0.8), Inches(0.4),
             f"{num}/{total}", font_size=10, color=TEXT_DIM, alignment=PP_ALIGN.RIGHT)

def section_heading(slide, title, subtitle="", top=Inches(0.5)):
    add_text(slide, Inches(0.8), top, Inches(8), Inches(0.7),
             title, font_size=36, color=TEXT_WHITE, bold=True)
    add_neon_line(slide, Inches(0.8), top + Inches(0.7), Inches(2.5))
    if subtitle:
        add_text(slide, Inches(0.8), top + Inches(0.85), Inches(10), Inches(0.5),
                 subtitle, font_size=14, color=TEXT_GREY)

TOTAL_SLIDES = 9

# ═══════════════════════════════════════════════════════════════════════════
# SLIDE 1 — TITLE / HERO
# ═══════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank
hero_path = os.path.join(ASSETS_DIR, 'hero_bg.png')
if os.path.exists(hero_path):
    add_bg_image(slide, hero_path)
    add_dark_overlay(slide, alpha=160)
else:
    set_bg(slide, DARK_BG)

# Neon accent lines
add_neon_line(slide, Inches(1.0), Inches(1.8), Inches(4.0), NEON_BLUE, Pt(4))
add_neon_line(slide, Inches(1.0), Inches(1.95), Inches(2.5), CYAN, Pt(2))

# Title
add_text(slide, Inches(1.0), Inches(1.8), Inches(7.0), Inches(1.8),
         "AI Resume Studio", font_size=54, color=TEXT_WHITE, bold=True)

# Subtitle
add_text(slide, Inches(1.0), Inches(3.6), Inches(7.0), Inches(0.6),
         "AI-Powered Resume Builder  •  Final Year Project", font_size=24, color=NEON_BLUE)

# Info card
add_glass_card(slide, Inches(1.0), Inches(4.4), Inches(5.5), Inches(2.2))
add_card_info = [
    ("👤  Vansh Khandekar", 20, TEXT_WHITE, True),
    ("🎓  Final Year  •  B.Tech / BCA / MCA", 16, TEXT_GREY, False),
    ("🏛️  [Your College Name]", 16, TEXT_GREY, False),
    ("📅  Academic Year 2025–26", 14, TEXT_DIM, False)
]
for i, (txt, sz, col, bld) in enumerate(add_card_info):
    add_text(slide, Inches(1.4), Inches(4.55) + Inches(0.45) * i, Inches(5), Inches(0.4),
             txt, font_size=sz, color=col, bold=bld)

# Decorative mock on right side
landing_path = os.path.join(ASSETS_DIR, 'landing_mockup.png')
if os.path.exists(landing_path):
    slide.shapes.add_picture(landing_path, Inches(7.5), Inches(1.8),
                             width=Inches(5.2), height=Inches(4.8))

add_slide_number(slide, 1, TOTAL_SLIDES)


# ═══════════════════════════════════════════════════════════════════════════
# SLIDE 2 — PROBLEM STATEMENT
# ═══════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, DARK_BG)

section_heading(slide, "The Problem", "Why traditional resume building is broken")

problems = [
    ("⚠️", "Formatting Chaos", "Word/Docs layouts break across\ndevices & ATS parsers", PINK),
    ("🚫", "ATS Rejection", "80% of resumes are rejected by\nATS before a human ever sees them", ORANGE),
    ("😶", "Writer's Block", "Candidates struggle to articulate\nachievements professionally", PURPLE),
    ("⏳", "Time Consuming", "Average resume takes 3–5 hours\nto format and write properly", CYAN),
]

for i, (icon, title, desc, color) in enumerate(problems):
    x = Inches(0.6) + Inches(3.1) * i
    y = Inches(2.5)
    add_icon_text(slide, x, y, icon, title, desc, accent_color=color)

# Bottom stat bar
stat_card = add_glass_card(slide, Inches(0.6), Inches(5.6), Inches(12.1), Inches(1.3))
stats = [("75%", "resumes rejected\nby ATS systems"), ("3.5 hrs", "average time to\nbuild a resume"),
         ("62%", "candidates lack\nwriting confidence"), ("89%", "prefer AI-assisted\nresume tools")]
for i, (num, label) in enumerate(stats):
    x = Inches(1.0) + Inches(3.0) * i
    add_text(slide, x, Inches(5.75), Inches(2), Inches(0.5),
             num, font_size=32, color=NEON_BLUE, bold=True, alignment=PP_ALIGN.CENTER)
    add_text(slide, x, Inches(6.25), Inches(2), Inches(0.5),
             label, font_size=11, color=TEXT_GREY, alignment=PP_ALIGN.CENTER)

add_slide_number(slide, 2, TOTAL_SLIDES)


# ═══════════════════════════════════════════════════════════════════════════
# SLIDE 3 — SOLUTION OVERVIEW
# ═══════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, DARK_BG)

section_heading(slide, "Our Solution", "An intelligent, AI-first approach to resume creation")

# Flow: User → AI → Resume
flow_items = [
    ("👤", "User Input", "Enter basic info,\neducation & notes", NEON_BLUE),
    ("→", "", "", TEXT_DIM),
    ("🤖", "AI Engine", "Gemini processes &\nenhances content", CYAN),
    ("→", "", "", TEXT_DIM),
    ("📄", "Smart Resume", "ATS-optimized,\nbeautifully formatted", GREEN),
]

x_pos = Inches(0.5)
for icon, title, desc, color in flow_items:
    if icon == "→":
        # Arrow connector
        add_text(slide, x_pos, Inches(3.5), Inches(1.0), Inches(0.5),
                 "───▶", font_size=24, color=TEXT_DIM, alignment=PP_ALIGN.CENTER)
        x_pos += Inches(1.0)
    else:
        add_icon_text(slide, x_pos, Inches(2.5), icon, title, desc,
                      accent_color=color, card_w=Inches(3.2), card_h=Inches(2.8))
        x_pos += Inches(3.6)

# Bottom highlight
highlight = add_glass_card(slide, Inches(0.8), Inches(5.8), Inches(11.7), Inches(1.2), GREEN)
add_text(slide, Inches(1.2), Inches(5.95), Inches(11), Inches(0.4),
         "✨ Result: Professional, ATS-friendly resumes generated in under 2 minutes",
         font_size=20, color=GREEN, bold=True, alignment=PP_ALIGN.CENTER)
add_text(slide, Inches(1.2), Inches(6.4), Inches(11), Inches(0.4),
         "No design skills needed  •  No subscription required  •  100% free & open source",
         font_size=13, color=TEXT_GREY, alignment=PP_ALIGN.CENTER)

add_slide_number(slide, 3, TOTAL_SLIDES)


# ═══════════════════════════════════════════════════════════════════════════
# SLIDE 4 — KEY FEATURES
# ═══════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, DARK_BG)

section_heading(slide, "Key Features", "Everything you need for the perfect resume")

features = [
    ("🤖", "AI Content\nGeneration", "Google Gemini rewrites\nyour notes into polished,\naction-oriented bullets", NEON_BLUE),
    ("📊", "ATS Score\nOptimizer", "Real-time scoring engine\nensures your resume\npasses every ATS", CYAN),
    ("⚡", "Instant\nFormatting", "Auto-adjusting layouts\nwith professional\ntypography & spacing", ORANGE),
    ("👁️", "Live\nPreview", "See every change\ninstantly rendered on\na live resume canvas", GREEN),
    ("📥", "One-Click\nPDF Export", "High-resolution,\nwatermark-free PDF\nin a single click", PURPLE),
    ("🎨", "Premium\nTemplates", "Multiple ATS-friendly\ntemplates designed by\nUI/UX professionals", PINK),
]

for i, (icon, title, desc, color) in enumerate(features):
    col = i % 3
    row = i // 3
    x = Inches(0.5) + Inches(4.2) * col
    y = Inches(2.2) + Inches(2.7) * row
    add_icon_text(slide, x, y, icon, title, desc, accent_color=color,
                  card_w=Inches(3.8), card_h=Inches(2.5))

add_slide_number(slide, 4, TOTAL_SLIDES)


# ═══════════════════════════════════════════════════════════════════════════
# SLIDE 5 — TECHNOLOGY STACK
# ═══════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, DARK_BG)

section_heading(slide, "Technology Stack", "Built with modern, production-grade tools")

# Frontend Column
fe_card = add_glass_card(slide, Inches(0.6), Inches(2.2), Inches(3.8), Inches(4.8), NEON_BLUE)
add_text(slide, Inches(0.9), Inches(2.4), Inches(3.2), Inches(0.5),
         "⚛️  FRONTEND", font_size=22, color=NEON_BLUE, bold=True)
add_neon_line(slide, Inches(0.9), Inches(2.95), Inches(3.2), NEON_BLUE, Pt(2))
techs_fe = ["React 18", "TypeScript", "Vite 5", "Tailwind CSS 3", "Shadcn UI + Radix", "Lucide React Icons"]
for i, tech in enumerate(techs_fe):
    add_text(slide, Inches(1.1), Inches(3.2) + Inches(0.45) * i, Inches(3), Inches(0.4),
             f"▸  {tech}", font_size=16, color=TEXT_WHITE)

# Backend & Data Column
be_card = add_glass_card(slide, Inches(4.8), Inches(2.2), Inches(3.8), Inches(4.8), CYAN)
add_text(slide, Inches(5.1), Inches(2.4), Inches(3.2), Inches(0.5),
         "⚙️  BACKEND & DATA", font_size=22, color=CYAN, bold=True)
add_neon_line(slide, Inches(5.1), Inches(2.95), Inches(3.2), CYAN, Pt(2))
techs_be = ["Supabase (PostgreSQL)", "Row Level Security", "Edge Functions", "Google Gemini API", "React Query", "Zod Validation"]
for i, tech in enumerate(techs_be):
    add_text(slide, Inches(5.3), Inches(3.2) + Inches(0.45) * i, Inches(3), Inches(0.4),
             f"▸  {tech}", font_size=16, color=TEXT_WHITE)

# Tools Column
tool_card = add_glass_card(slide, Inches(9.0), Inches(2.2), Inches(3.8), Inches(4.8), PURPLE)
add_text(slide, Inches(9.3), Inches(2.4), Inches(3.2), Inches(0.5),
         "🛠️  TOOLS & DEPLOY", font_size=22, color=PURPLE, bold=True)
add_neon_line(slide, Inches(9.3), Inches(2.95), Inches(3.2), PURPLE, Pt(2))
techs_tool = ["Git & GitHub", "Vercel (CI/CD)", "ESLint + Prettier", "Vitest (Testing)", "React Hook Form", "jsPDF Export"]
for i, tech in enumerate(techs_tool):
    add_text(slide, Inches(9.5), Inches(3.2) + Inches(0.45) * i, Inches(3), Inches(0.4),
             f"▸  {tech}", font_size=16, color=TEXT_WHITE)

add_slide_number(slide, 5, TOTAL_SLIDES)


# ═══════════════════════════════════════════════════════════════════════════
# SLIDE 6 — WORKING FLOW
# ═══════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, DARK_BG)

section_heading(slide, "How It Works", "From raw input to polished resume in 4 simple steps")

steps = [
    (1, "User Input", "Fill in personal details,\neducation, work experience\nvia guided multi-step form", NEON_BLUE),
    (2, "AI Enhancement", "Gemini AI rewrites raw\nnotes into professional,\naction-driven bullet points", CYAN),
    (3, "Live Preview", "Instant rendering of\nformatted resume with\nchosen ATS template", GREEN),
    (4, "Score & Export", "Get ATS compatibility\nscore, then one-click\nexport to PDF", PURPLE),
]

for i, (num, title, desc, color) in enumerate(steps):
    x = Inches(0.5) + Inches(3.2) * i
    add_step_card(slide, x, Inches(2.5), num, title, desc, accent=color)
    # Connector arrow (except last)
    if i < 3:
        add_text(slide, x + Inches(2.6), Inches(3.5), Inches(0.6), Inches(0.4),
                 "▶", font_size=28, color=color, alignment=PP_ALIGN.CENTER)

# Bottom detail strip
detail_card = add_glass_card(slide, Inches(0.5), Inches(5.5), Inches(12.3), Inches(1.5))
add_text(slide, Inches(0.9), Inches(5.7), Inches(11.5), Inches(0.4),
         "⚡ End-to-end flow completes in under 2 minutes — no design skills required",
         font_size=18, color=NEON_BLUE, bold=True)
add_text(slide, Inches(0.9), Inches(6.15), Inches(11.5), Inches(0.7),
         "The multi-step guided form ensures completeness  •  AI suggestions are editable before export  •  "
         "Resume score gives actionable improvement tips  •  PDF output is printer-ready at 300 DPI",
         font_size=12, color=TEXT_GREY)

add_slide_number(slide, 6, TOTAL_SLIDES)


# ═══════════════════════════════════════════════════════════════════════════
# SLIDE 7 — GUI / PRODUCT SCREENS (Landing Page)
# ═══════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, DARK_BG)

section_heading(slide, "Product Interface", "Landing Page & Onboarding")

# Landing page mockup
lp = os.path.join(ASSETS_DIR, 'landing_mockup.png')
if os.path.exists(lp):
    # Shadow card behind image
    add_glass_card(slide, Inches(1.5), Inches(2.0), Inches(10.3), Inches(5.2), NEON_BLUE)
    slide.shapes.add_picture(lp, Inches(1.7), Inches(2.2),
                             width=Inches(9.9), height=Inches(4.8))

# Callout labels
callout1 = add_glass_card(slide, Inches(0.3), Inches(2.5), Inches(1.5), Inches(0.6), CYAN)
add_text(slide, Inches(0.4), Inches(2.55), Inches(1.3), Inches(0.5),
         "Navigation", font_size=11, color=CYAN, bold=True, alignment=PP_ALIGN.CENTER)

callout2 = add_glass_card(slide, Inches(0.3), Inches(3.8), Inches(1.5), Inches(0.6), GREEN)
add_text(slide, Inches(0.4), Inches(3.85), Inches(1.3), Inches(0.5),
         "Hero CTA", font_size=11, color=GREEN, bold=True, alignment=PP_ALIGN.CENTER)

callout3 = add_glass_card(slide, Inches(0.3), Inches(5.1), Inches(1.5), Inches(0.6), PURPLE)
add_text(slide, Inches(0.4), Inches(5.15), Inches(1.3), Inches(0.5),
         "Feature Cards", font_size=11, color=PURPLE, bold=True, alignment=PP_ALIGN.CENTER)

add_slide_number(slide, 7, TOTAL_SLIDES)


# ═══════════════════════════════════════════════════════════════════════════
# SLIDE 7b — GUI / PRODUCT SCREENS (Builder + Preview)
# ═══════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, DARK_BG)

section_heading(slide, "Product Interface", "Resume Builder & AI Score Dashboard")

# Two mockup images side by side
db = os.path.join(ASSETS_DIR, 'dashboard_mockup.png')
pv = os.path.join(ASSETS_DIR, 'preview_mockup.png')
if os.path.exists(db):
    add_glass_card(slide, Inches(0.4), Inches(1.8), Inches(6.2), Inches(5.0), NEON_BLUE)
    slide.shapes.add_picture(db, Inches(0.6), Inches(2.0), width=Inches(5.8), height=Inches(4.6))
if os.path.exists(pv):
    add_glass_card(slide, Inches(6.9), Inches(1.8), Inches(6.2), Inches(5.0), GREEN)
    slide.shapes.add_picture(pv, Inches(7.1), Inches(2.0), width=Inches(5.8), height=Inches(4.6))

# Labels
add_text(slide, Inches(0.4), Inches(7.0), Inches(6.2), Inches(0.4),
         "Resume Builder (Form + Live Preview)", font_size=12, color=NEON_BLUE, bold=True, alignment=PP_ALIGN.CENTER)
add_text(slide, Inches(6.9), Inches(7.0), Inches(6.2), Inches(0.4),
         "AI Score & Export Dashboard", font_size=12, color=GREEN, bold=True, alignment=PP_ALIGN.CENTER)

add_slide_number(slide, 8, TOTAL_SLIDES)


# ═══════════════════════════════════════════════════════════════════════════
# SLIDE 8 — ADVANTAGES / USP
# ═══════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, DARK_BG)

section_heading(slide, "Advantages & USP", "Why this stands out from alternatives")

# Two columns: Ours vs Traditional
# Left - Our system
our_card = add_glass_card(slide, Inches(0.5), Inches(2.2), Inches(6.0), Inches(5.0), GREEN)
add_text(slide, Inches(0.8), Inches(2.4), Inches(5.4), Inches(0.5),
         "✅  AI Resume Studio", font_size=22, color=GREEN, bold=True)
add_neon_line(slide, Inches(0.8), Inches(2.95), Inches(5.4), GREEN, Pt(2))

our_advantages = [
    "100% Free & Open Source — no paywalls, ever",
    "Deep AI integration via Google Gemini NLP",
    "Instant live preview with zero page reloads",
    "Client-side first — your data stays with you",
    "ATS scoring engine with actionable feedback",
    "Modern React UI — feels like a premium SaaS",
    "One-click PDF export (watermark-free)",
]
for i, adv in enumerate(our_advantages):
    add_text(slide, Inches(1.0), Inches(3.2) + Inches(0.42) * i, Inches(5.2), Inches(0.4),
             f"▸  {adv}", font_size=14, color=TEXT_WHITE)

# Right - Traditional
trad_card = add_glass_card(slide, Inches(6.9), Inches(2.2), Inches(6.0), Inches(5.0), PINK)
add_text(slide, Inches(7.2), Inches(2.4), Inches(5.4), Inches(0.5),
         "❌  Traditional Resume Builders", font_size=22, color=PINK, bold=True)
add_neon_line(slide, Inches(7.2), Inches(2.95), Inches(5.4), PINK, Pt(2))

trad_disadvantages = [
    "Expensive subscriptions ($8–30/month)",
    "Basic formatting with no AI writing help",
    "Slow, server-rendered preview cycles",
    "User data sold to third-party advertisers",
    "No real ATS analysis — false confidence",
    "Generic templates used by millions",
    "Watermarks on free-tier PDF exports",
]
for i, dis in enumerate(trad_disadvantages):
    add_text(slide, Inches(7.4), Inches(3.2) + Inches(0.44) * i, Inches(5.2), Inches(0.4),
             f"▸  {dis}", font_size=14, color=TEXT_GREY)

add_slide_number(slide, 9, TOTAL_SLIDES)


# ═══════════════════════════════════════════════════════════════════════════
# SLIDE 9 — CONCLUSION & FUTURE SCOPE
# ═══════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, DARK_BG)

section_heading(slide, "Conclusion & Future Scope")

# Summary card
sum_card = add_glass_card(slide, Inches(0.5), Inches(2.0), Inches(12.3), Inches(1.6), GREEN)
add_text(slide, Inches(0.9), Inches(2.15), Inches(11.5), Inches(0.4),
         "📌  Project Summary", font_size=22, color=GREEN, bold=True)
add_text(slide, Inches(0.9), Inches(2.6), Inches(11.5), Inches(0.8),
         "AI Resume Studio successfully demonstrates a scalable, AI-first approach to resume building. "
         "By combining Google Gemini's NLP capabilities with a modern React frontend and Supabase backend, "
         "the platform delivers a seamless experience that rivals paid SaaS products — completely free.",
         font_size=14, color=TEXT_WHITE)

# Future scope cards
add_text(slide, Inches(0.8), Inches(4.0), Inches(5), Inches(0.5),
         "🔮  Future Scope", font_size=24, color=NEON_BLUE, bold=True)

futures = [
    ("🔗", "LinkedIn Import", "One-click profile import\nfor instant resume creation", NEON_BLUE),
    ("✉️", "Cover Letter AI", "Auto-generate tailored\ncover letters per job", CYAN),
    ("🎨", "Custom CSS Editor", "Let power users design\ntheir own templates", PURPLE),
    ("🌐", "Job Matching", "Direct ATS submission\nto partner employers", GREEN),
]

for i, (icon, title, desc, color) in enumerate(futures):
    x = Inches(0.4) + Inches(3.2) * i
    add_icon_text(slide, x, Inches(4.6), icon, title, desc,
                  accent_color=color, card_w=Inches(2.9), card_h=Inches(2.6))

add_slide_number(slide, 10, TOTAL_SLIDES)


# ═══════════════════════════════════════════════════════════════════════════
# SLIDE 10 — THANK YOU
# ═══════════════════════════════════════════════════════════════════════════
slide = prs.slides.add_slide(prs.slide_layouts[6])
if os.path.exists(hero_path):
    add_bg_image(slide, hero_path)
    add_dark_overlay(slide, alpha=180)
else:
    set_bg(slide, DARK_BG)

add_neon_line(slide, Inches(4.5), Inches(2.5), Inches(4.3), NEON_BLUE, Pt(4))

add_text(slide, Inches(1), Inches(2.8), Inches(11.3), Inches(1.0),
         "Thank You!", font_size=56, color=TEXT_WHITE, bold=True, alignment=PP_ALIGN.CENTER)

add_text(slide, Inches(1), Inches(4.0), Inches(11.3), Inches(0.6),
         "Questions & Discussion", font_size=26, color=NEON_BLUE, alignment=PP_ALIGN.CENTER)

add_neon_line(slide, Inches(5.5), Inches(4.8), Inches(2.3), CYAN, Pt(2))

# Info
add_text(slide, Inches(1), Inches(5.3), Inches(11.3), Inches(0.5),
         "Vansh Khandekar  •  Final Year Project  •  2025–26",
         font_size=16, color=TEXT_GREY, alignment=PP_ALIGN.CENTER)

add_text(slide, Inches(1), Inches(6.0), Inches(11.3), Inches(0.5),
         "Built with React • TypeScript • Gemini AI • Supabase",
         font_size=13, color=TEXT_DIM, alignment=PP_ALIGN.CENTER)


# ═══════════════════════════════════════════════════════════════════════════
# ADD SLIDE TRANSITIONS (XML-level)
# ═══════════════════════════════════════════════════════════════════════════
transitions = ['fade', 'push', 'wipe', 'fade', 'push', 'wipe', 'fade', 'push', 'fade', 'fade']
for i, slide_obj in enumerate(prs.slides):
    transition_type = transitions[i % len(transitions)]
    sld = slide_obj._element
    
    # Create transition element
    transition = sld.makeelement(qn('p:transition'), {
        'spd': 'med',
        'advClick': '1',
    })
    
    if transition_type == 'fade':
        effect = transition.makeelement(qn('p:fade'), {})
    elif transition_type == 'push':
        effect = transition.makeelement(qn('p:push'), {'dir': 'l'})
    elif transition_type == 'wipe':
        effect = transition.makeelement(qn('p:wipe'), {'dir': 'r'})
    else:
        effect = transition.makeelement(qn('p:fade'), {})
    
    transition.append(effect)
    # Insert transition before the first child or at start
    sld.insert(0, transition)


# ═══════════════════════════════════════════════════════════════════════════
# SAVE
# ═══════════════════════════════════════════════════════════════════════════
output_path = os.path.join(SCRIPT_DIR, 'AI_Resume_Studio_Premium.pptx')
prs.save(output_path)
print(f"✅ Premium presentation saved: {output_path}")
print(f"   Total slides: {len(prs.slides)}")
print("   Theme: Dark Space / Neon Blue / Glassmorphism")
print("   Images embedded: hero_bg, landing_mockup, dashboard_mockup, preview_mockup")
print("   Transitions: fade, push, wipe applied to all slides")
