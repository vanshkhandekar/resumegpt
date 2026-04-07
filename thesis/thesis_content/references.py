from reportlab.platypus import Paragraph
from .helpers import spacer

def build_references(S):
    story = []
    
    story.append(Paragraph("Chapter 7: References and Bibliography", S['ChapterTitle']))
    story.append(spacer(18))
    
    refs = [
        "[1] Fielding, R. T. (2000). Architectural Styles and the Design of Network-based Software Architectures. University of California, Irvine.",
        "[2] Resig, J., & Bibeault, B. (2016). Secrets of the JavaScript Ninja. Manning Publications.",
        "[3] Banks, A., & Porcello, E. (2020). Learning React: Modern Patterns for Developing Real-World Applications. O'Reilly Media.",
        "[4] Vaswani, A., et al. (2017). Attention is All You Need. Advances in Neural Information Processing Systems.",
        "[5] Postel, J. (1982). Simple Mail Transfer Protocol. RFC 821, IETF.",
        "[6] Supabase Documentation. (2024). PostgreSQL Row Level Security (RLS) and Auth Guide.",
        "[7] Anthropic PBC. (2024). Claude 3 Model Family Technical Report.",
        "[8] OpenRouter API Documentation. (2024). LLM Aggregation and Routing Best Practices.",
        "[9] ReportLab Inc. (2024). ReportLab PDF Library User Guide.",
        "[10] W3C. (2023). Web Content Accessibility Guidelines (WCAG) 2.1 Overview.",
        "[11] Mozilla Developer Network (MDN). (2024). Modern Web APIs and Responsive Design.",
        "[12] Vercel Inc. (2024). Next-generation Deployment and Global Edge Caching Patterns.",
        "[13] Fowler, M. (2014). Microservices Architecture: A definition of this new architectural term.",
        "[14] Beck, K. (2003). Test-Driven Development: By Example. Addison-Wesley Professional.",
        "[15] Kleppmann, M. (2017). Designing Data-Intensive Applications. O'Reilly Media.",
        "[16] Tanenbaum, A. S., & Wetherall, D. (2011). Computer Networks. Prentice Hall.",
        "[17] Gofman, M. (2021). Building Modern Web Applications with React and TypeScript.",
        "[18] Knuth, D. E. (1997). The Art of Computer Programming. Addison-Wesley.",
        "[19] Gamma, E., et al. (1994). Design Patterns: Elements of Reusable Object-Oriented Software.",
        "[20] Spolsky, J. (2004). Joel on Software: And on Diverse and Occasionally Related Matters."
    ]
    
    for r in refs:
        story.append(Paragraph(r, S['Reference']))
        story.append(spacer(6))
        
    return story
