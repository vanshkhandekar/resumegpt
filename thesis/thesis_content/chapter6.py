from reportlab.platypus import Paragraph
from .helpers import spacer, page_break, img_cap, code_cap

def build_chapter6(S):
    story = []
    
    # ── 6. CHAPTER TITLE ──
    story.append(Paragraph("Chapter 6: Conclusion and Future Scope", S['ChapterTitle']))
    story.append(spacer(18))
    
    # ── 6.1 SUMMARY ──
    story.append(Paragraph("6.1 Project Summary and Key Contributions", S['SectionTitle']))
    story.append(Paragraph(
        "AI Resume Studio has successfully met its core objectives by providing "
        "a robust, AI-powered platform for resume building. We have "
        "bridged the gap between modern recruiter expectations and candidate "
        "capabilities through a unique blend of UI and AI.", S['Body']))
    
    story.extend(img_cap("key_contributions_summary", "Summary of the platform's architectural and UX innovation", S))
    
    story.append(Paragraph(
        "Our contribution includes a novel 'ATS Scoring Heuristic' that identifies "
        "keyword density gaps and provides real-time feedback. This provides "
        "users with a tangible 'Improvement Path' for their career applications.", S['Body']))
    story.append(spacer(12))

    # ── 6.2 FUTURE SCOPE ──
    story.append(Paragraph("6.2 Future Scope and Roadmap for AI Resume Studio", S['SectionTitle']))
    story.append(Paragraph(
        "The project is just the beginning of a larger 'Career Assistant' vision. "
        "Future enhancements will include 'Direct Apply' modules and "
        "AI-simulated interview preparation tools.", S['Body']))
    
    story.extend(img_cap("future_roadmap_expanded", "Strategic future roadmap for expanding the platform into a career suite", S))
    
    story.append(Paragraph(
        "By integrating 'Job Matching' algorithms, we can eventually suggest "
        "specific roles to users based on their newly-generated AI resumes. "
        "This creates a full-circle career management platform.", S['Body']))
    story.append(spacer(12))

    # ── 6.3 LIMITATIONS ──
    story.append(Paragraph("6.3 Technical Limitations and Challenges", S['SectionTitle']))
    story.append(Paragraph(
        "While the platform is robust, it has a few constraints. 'API Latency' "
        "can occasionally be an issue during peak hours, and 'Model Hallucinations' "
        "require the user to always review AI-generated content.", S['Body']))
    
    story.extend(img_cap("limitation_flow", "A summary of known technical constraints and risk management", S))
    
    story.append(Paragraph(
        "Addressing these will require implementing more 'Asynchronous' UI patterns "
        "and potentially fine-tuning our own 'Resume-Specific' LLM in the "
        "future to replace reliance on large general-purpose models.", S['Body']))
    story.append(spacer(12))

    # ── 6.4 SYSTEM DEPLOYMENT ──
    story.append(Paragraph("6.4 Final System Deployment and Distribution", S['SectionTitle']))
    story.append(Paragraph(
        "The final platform is a production-hardened SaaS product. It is deployed "
        "using a 'Serverless-First' mindset on Vercel and Supabase, ensuring "
        "high availability and low maintenance costs.", S['Body']))
    
    story.extend(img_cap("system_deployment", "The cloud distribution and asset delivery network architecture", S))
    
    story.append(Paragraph(
        "Distribution via a global Content Delivery Network means that users in "
        "any part of the world experience the same fast 'Initial Load' "
        "and 'Live Preview' performance metrics.", S['Body']))
    story.append(spacer(12))

    # ── 6.5 AI EXPERT FLOW ──
    story.append(Paragraph("6.5 AI Expert Interaction Loop Summary", S['SectionTitle']))
    story.append(Paragraph(
        "The 'AI Assistant' is more than just a chatbot. It's a context-injected "
        "career expert that works within the user's workflow to provide "
        "tangible content improvements in seconds.", S['Body']))
    
    story.extend(img_cap("ai_expert_flow", "The reactive AI expert loop that drives user content improvement", S))
    
    story.append(Paragraph(
        "This architectural pattern of 'Context Inbound -> AI Processing -> Content Outbound' "
        "is a scalable way to build any AI-powered SaaS product.", S['Body']))
    story.append(spacer(12))

    # ── 6.6 FINAL WORDS ──
    story.append(Paragraph("6.6 Conclusion and Final Thoughts", S['SectionTitle']))
    story.append(Paragraph(
        "To summarize, AI Resume Studio is a testament to what 'Modern Web Tech' "
        "can achieve when combined with 'Generative AI'. It's not just a "
        "document builder; it's a strategic career tool.", S['Body']))
    
    story.extend(img_cap("final_thank_you", "Final concluding graphic and acknowledgement", S))
    
    story.append(Paragraph(
        "We are excited about the potential of this project to help millions "
        "of job seekers navigate the increasingly automated hiring landscape.", S['Body']))
    story.append(spacer(30))

    # ── 6.7 FINAL CODE: AUTO-SAVE HOOK ──
    story.append(Paragraph("6.7 Final Technical Detail: The Auto-Save Hook", S['SectionTitle']))
    story.append(Paragraph(
        "This critical piece of logic handles the 'Seamless Persistence' which "
        "was a major implementation milestone.", S['Body']))
    story.extend(code_cap("src/hooks/useAutoSave.ts", 1, 60, "The useAutoSave debounced hook implementation", S))

    return story
