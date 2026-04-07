from reportlab.platypus import Paragraph
from .helpers import spacer, page_break, img_cap, code_cap

def build_chapter4(S):
    story = []
    
    # ── 4. CHAPTER TITLE ──
    story.append(Paragraph("Chapter 4: Implementation", S['ChapterTitle']))
    story.append(spacer(18))
    
    # ── 4.1 COMPONENT COMMUNICATION ──
    story.append(Paragraph("4.1 React Component Communication Patterns", S['SectionTitle']))
    story.append(Paragraph(
        "The implementation of the 'Resume Builder' utilizes a 'One-Way Data Flow' "
        "pattern. The 'Builder' component holds the master state, and child "
        "components communicate updates via callback functions.", S['Body']))
    
    story.extend(img_cap("component_communication", "The one-way data flow and bidirectional event communication pattern", S))
    
    story.append(Paragraph(
        "By using 'Props Drilling' for shallow trees and 'React Context' for global "
        "utility states (like the selected Template ID), we achieve a balance "
        "between explicitness and performance.", S['Body']))
    story.append(spacer(12))

    # ── 4.2 AI SUGGESTION LOGIC ──
    story.append(Paragraph("4.2 AI-Driven Description Generation Logic", S['SectionTitle']))
    story.append(Paragraph(
        "The AI suggestion feature is a complex 'Request-Response-Inject' loop. "
        "Upon clicking 'AI Write', the system collects context from nearby fields "
        "and sends a structured prompt to the AI provider.", S['Body']))
    
    story.extend(img_cap("ai_suggestion_logic", "The end-to-end AI suggestion and content injection loop", S))
    
    story.append(Paragraph(
        "The response is then 'sanitized' to remove any AI preamble or chat-bot "
        "phrasing before being inserted directly into the user's input field. "
        "This feels seamless and 'integrative' rather than just a separate chat. "
        "Furthermore, the system tracks 'User Usage' metrics to prevent API abuse, "
        "ensuring that the expensive Claude-3 Opus tokens are used efficiently.", S['Body']))
    story.append(Paragraph(
        "We also implement 'Edge Functions' on Supabase to handle the AI logic. "
        "This keeps the OpenRouter API keys secure on the server-side while "
        "providing a low-latency endpoint for the React frontend to call. "
        "These functions are written in TypeScript and benefit from Deno's runtime speed, "
        "ensuring that the AI assistance feels near-instantaneous.", S['Body']))
    story.append(Paragraph(
        "For model configuration, we use a 'Temperature' setting of 0.5 to balance "
        "creativity with factual accuracy. This ensures that the professional "
        "summaries generated are both evocative and grounded in the user's "
        "actual historical data, avoiding 'Hallucinations' that are common in "
        "unconstrained LLM outputs.", S['Body']))
    story.append(spacer(12))

    # ── 4.3 TEMPLATE REGISTRY ──
    story.append(Paragraph("4.3 Dynamic Template Registry and Rendering", S['SectionTitle']))
    story.append(Paragraph(
        "The platform supports over 20 professional templates. To manage this "
        "extensibly, we use a 'Template Registry' where each template is a "
        "plain React component that receives the same 'resume' prop.", S['Body']))
    
    story.extend(img_cap("template_registry_flow", "The registry pattern used for dynamic resume template selection", S))
    
    story.append(Paragraph(
        "This allows us to add a brand-new template in minutes just by registering it "
        "in the central registry object. The 'Live Preview' then dynamically "
        "switches the rendered component based on user selection.", S['Body']))
    story.append(spacer(12))

    # ── 4.4 IMAGE HANDLING ──
    story.append(Paragraph("4.4 Multimedia and Profile Image Processing", S['SectionTitle']))
    story.append(Paragraph(
        "Processing user profile photos requires client-side optimization to avoid "
        "large network payloads. We implement an 'Image-to-Base64' converter "
        "using the HTML5 Canvas API.", S['Body']))
    
    story.extend(img_cap("image_upload_flow", "The client-side image processing and base64 resizing pipeline", S))
    
    story.append(Paragraph(
        "This ensures that even a 5MB original photo is resized and compressed to "
        "less than 100KB before being stored. This significantly improves the "
        "speed of both 'Auto-Save' and 'PDF Export'.", S['Body']))
    story.append(spacer(12))

    # ── 4.5 AUTOSAVE MACHINE ──
    story.append(Paragraph("4.5 The Auto-Save State Machine", S['SectionTitle']))
    story.append(Paragraph(
        "To provide a 'Google Docs' like experience, we implemented a state machine "
        "for auto-saving. It tracks whether the local data is 'Dirty' and triggers "
        "a cloud sync only when the user pauses typing.", S['Body']))
    
    story.extend(img_cap("autosave_state_machine", "Finite state machine diagram for the debounced auto-save engine", S))
    
    story.append(Paragraph(
        "By setting the debounce time to 10 seconds, we ensure that the user's flow "
        "is never interrupted by a network request, but their data is safely "
        "persisted every few minutes.", S['Body']))
    story.append(spacer(12))

    # ── 4.6 UX FEEDBACK (TOASTS) ──
    story.append(Paragraph("4.6 Real-time UI/UX Feedback and Error Handling", S['SectionTitle']))
    story.append(Paragraph(
        "Error handling is a critical part of implementation. We use 'Sonner' toast "
        "notifications to give the user immediate feedback if an AI request "
        "fails or if there is a network interruption.", S['Body']))
    
    story.extend(img_cap("error_toast_logic", "The logical flow of error detection and user toast notification", S))
    
    story.append(Paragraph(
        "By providing 'Retry' buttons directly in the toast, we allow the user to "
        "recover from transient errors without refreshing the whole page. This "
        "significantly improves the perception of platform reliability.", S['Body']))
    story.append(spacer(12))

    # ── 4.7 COMPONENT TREE ──
    story.append(Paragraph("4.7 Component Hierarchy and Module Organization", S['SectionTitle']))
    story.append(Paragraph(
        "The project is structured into clear modules: Pages, Components, Hooks, and Integrations. "
        "The 'Builder' is the most complex organism, which itself is broken down into "
        "Sidebar, Preview, and AI Assistant.", S['Body']))
    
    story.extend(img_cap("component_tree", "The hierarchical tree of React components in the builder module", S))
    
    story.append(Paragraph(
        "Proper file organization ensures that as the codebase grows to thousands of lines, "
        "any developer can find a specific piece of logic in seconds.", S['Body']))
    story.append(spacer(12))

    # ── 4.8 AUTH IMPLEMENTATION ──
    story.append(Paragraph("4.8 Authentication System Implementation", S['SectionTitle']))
    story.append(Paragraph(
        "The implementation of authentication uses 'Protected Routes' in React Router. "
        "This ensures that the 'Dashboard' and 'Builder' are inaccessible to "
        "unauthenticated guests.", S['Body']))
    
    story.extend(img_cap("auth_flow", "The JWT-based authentication and protected route flow", S))
    
    story.append(Paragraph(
        "By using the 'useAuth' hook in every protected page, we achieve a centralized "
        "way to check the session status before rendering any private content.", S['Body']))
    story.append(spacer(30))

    # ── 4.9 CODE PREVIEW: RESUME SCORING ──
    story.append(Paragraph("4.9 Implementation Detail: ATS Auditing Engine", S['SectionTitle']))
    story.append(Paragraph(
        "The auditing engine is a series of 'Checkers' that run over the resume JSON model. "
        "Each checker contributes to a final weighted total.", S['Body']))
    story.extend(code_cap("src/pages/dashboard/ResumeScore.tsx", 1, 100, "ATS Scoring Engine Implementation", S))

    return story
