"""Appendix: Code Snippets and Glossary"""
from reportlab.platypus import Paragraph, Preformatted
from .helpers import spacer, page_break, make_table, ascii_diagram

def build_appendix(S):
    story = []
    
    story.append(Paragraph("APPENDIX A", S['ChapterTitle']))
    story.append(Paragraph("CODE SNIPPETS", S['ChapterTitle']))
    story.append(spacer(16))
    
    # Snippet 1: ATS Score Calculation
    story.append(Paragraph("<b>A.1 ATS Score Calculation — Skills Scoring Logic</b>", S['SubSection']))
    story.append(spacer(4))
    
    code1 = """
    // File: src/pages/dashboard/ResumeScore.tsx
    // Skills Score Calculation (Rule-Based Engine)
    
    const skillsList = resume.skills
      .split(/[\\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const skillsScore = clamp(
      (skillsList.length === 0 ? 0 : 20) +       // Base: skills exist
      Math.min(skillsList.length * 7, 42) +        // 7 pts per skill (max 42)
      (skillsList.length >= 8 ? 18 : 0) +          // Bonus: 8+ skills
      (skillsList.length >= 12 ? 10 : 0),          // Bonus: 12+ skills
    );
    // Maximum possible: 20 + 42 + 18 + 10 = 90 → clamped to 100
    """
    story.append(ascii_diagram(code1, S))
    story.append(spacer(12))
    
    # Snippet 2: AI Generate Function
    story.append(Paragraph("<b>A.2 AI Content Generation — Core Function</b>", S['SubSection']))
    story.append(spacer(4))
    
    code2 = """
    // File: src/pages/dashboard/ResumeBuilder.tsx
    // AI Generate Function (Simplified)
    
    const aiGenerate = async ({ key, prompt, onApply }) => {
      setAiBusy(key);
      try {
        const payload = {
          model: "anthropic/claude-3-opus",
          messages: [
            { role: "system", content: ATS_EXPERT_SYSTEM_PROMPT },
            { role: "user", content: prompt }
          ],
          max_tokens: 250,
          temperature: 0.5,
        };

        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          { method: "POST", headers: authHeaders, body: JSON.stringify(payload) }
        );

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        if (content) {
          onApply(content);  // Insert AI text into form field
          bumpAiUsageMetric();
        }
      } catch (e) {
        toast({ variant: "destructive", title: "AI error" });
      } finally {
        setAiBusy(null);
      }
    };
    """
    story.append(ascii_diagram(code2, S))
    story.append(spacer(12))
    
    # Snippet 3: Overall Score Weighted Calculation
    story.append(Paragraph("<b>A.3 Overall Score — Weighted Aggregation</b>", S['SubSection']))
    story.append(spacer(4))
    
    code3 = """
    // Weighted Overall Score Calculation
    
    const overallScore = clamp(
      profileScore     * 0.20 +    // Profile: 20%
      educationScore   * 0.15 +    // Education: 15%
      skillsScore      * 0.20 +    // Skills: 20%
      experienceScore  * 0.20 +    // Experience: 20%
      projectsScore    * 0.17 +    // Projects: 17%
      certificationsScore * 0.08,  // Certifications: 8%
    );
    // Total weights: 0.20 + 0.15 + 0.20 + 0.20 + 0.17 + 0.08 = 1.00
    """
    story.append(ascii_diagram(code3, S))
    story.append(spacer(12))
    
    # Snippet 4: Blended Scoring
    story.append(Paragraph("<b>A.4 Blended Scoring — Rule-Based + AI Merge</b>", S['SubSection']))
    story.append(spacer(4))
    
    code4 = """
    // AI-Enhanced Blended Score Calculation
    
    const mergedOverall = Number.isFinite(aiOverall)
      ? clamp(baseline.overallScore * 0.65 + aiOverall * 0.35)
      : baseline.overallScore;

    const mergedAts = Number.isFinite(aiAts)
      ? clamp(baseline.atsScore * 0.65 + aiAts * 0.35)
      : baseline.atsScore;

    // Per-section blending
    const blendedScore = Number.isFinite(aiScore)
      ? clamp(section.score * 0.6 + aiScore * 0.4)
      : section.score;
    """
    story.append(ascii_diagram(code4, S))
    story.append(spacer(12))
    
    # Snippet 5: Auto-Save Hook
    story.append(Paragraph("<b>A.5 Auto-Save Hook — Debounced Cloud Sync</b>", S['SubSection']))
    story.append(spacer(4))
    
    code5 = """
    // File: src/hooks/useAutoSave.ts
    // Auto-save to Supabase every 10 seconds
    
    const AUTOSAVE_INTERVAL = 10_000; // 10 seconds

    useEffect(() => {
      const timer = setInterval(() => {
        if (!hasUnsavedChanges) return;
        saveResumeToSupabase({
          id: resumeId,
          data: currentFormState,
          template_id: selectedTemplate,
          section_order: order,
          section_enabled: sectionEnabled,
        });
        setHasUnsavedChanges(false);
        setLastSavedAt(new Date());
      }, AUTOSAVE_INTERVAL);

      return () => clearInterval(timer);
    }, [hasUnsavedChanges, currentFormState]);
    """
    story.append(ascii_diagram(code5, S))
    story.append(spacer(12))
    
    # Snippet 6: Context-Aware AI Prompt
    story.append(Paragraph("<b>A.6 Context-Aware AI System Prompt</b>", S['SubSection']))
    story.append(spacer(4))
    
    code6 = """
    // File: src/components/ai/FloatingAiAssistant.tsx
    // Context-Injected System Prompt
    
    const systemPrompt = `You are an expert resume consultant.
    STRICT RULES - BE EXTREMELY CONCISE:
    1. Output EXACTLY 2-3 short bullet points MAX.
    2. Each bullet must be under 10 words.
    3. No intro, no outro, no fluff.
    4. Be specific and actionable.
    5. Focus ONLY on the exact question asked.`;
    
    // Context injection with resume state
    const userMessage = `Context: ${context}\\n\\nQuery: ${userText}`;
    // 'context' contains: name, headline, skills, education count, etc.
    """
    story.append(ascii_diagram(code6, S))
    
    story.append(page_break())
    
    # APPENDIX B: Glossary
    story.append(Paragraph("APPENDIX B", S['ChapterTitle']))
    story.append(Paragraph("GLOSSARY", S['ChapterTitle']))
    story.append(spacer(16))
    
    glossary = [
        ["Term", "Definition"],
        ["ATS", "Applicant Tracking System — Software used by employers to filter and rank resumes"],
        ["API", "Application Programming Interface — Protocol for software components to communicate"],
        ["BaaS", "Backend as a Service — Cloud service providing backend functionality (e.g., Supabase)"],
        ["CRUD", "Create, Read, Update, Delete — Four basic database operations"],
        ["CSS", "Cascading Style Sheets — Language for styling web documents"],
        ["DFD", "Data Flow Diagram — Visual representation of data movement through a system"],
        ["DOM", "Document Object Model — Programming interface for web documents"],
        ["ER Diagram", "Entity-Relationship Diagram — Visual model of database structure"],
        ["HMR", "Hot Module Replacement — Development feature for instant code update preview"],
        ["HTML", "HyperText Markup Language — Standard language for creating web pages"],
        ["JSON", "JavaScript Object Notation — Lightweight data interchange format"],
        ["JSONB", "JSON Binary — PostgreSQL binary JSON type with indexing support"],
        ["JWT", "JSON Web Token — Compact URL-safe token for authentication claims"],
        ["LLM", "Large Language Model — AI model trained on vast text data for language tasks"],
        ["NER", "Named Entity Recognition — NLP technique to identify entities in text"],
        ["NLP", "Natural Language Processing — AI field dealing with human language understanding"],
        ["OAuth", "Open Authorization — Standard for access delegation"],
        ["PDF", "Portable Document Format — File format for document presentation"],
        ["RLS", "Row Level Security — Database policy restricting access per row"],
        ["SaaS", "Software as a Service — Cloud-based software delivery model"],
        ["SPA", "Single Page Application — Web app loading a single HTML page dynamically"],
        ["SQL", "Structured Query Language — Language for managing relational databases"],
        ["TF-IDF", "Term Frequency–Inverse Document Frequency — Text importance measure"],
        ["TSX", "TypeScript JSX — TypeScript files containing JSX syntax for React"],
        ["UI/UX", "User Interface / User Experience — Design of user interaction"],
        ["UUID", "Universally Unique Identifier — 128-bit identifier for resources"],
    ]
    story.append(make_table(glossary, col_widths=[80, 370]))
    
    story.append(spacer(30))
    story.append(Paragraph("— END OF THESIS —", S['CenterBold']))
    story.append(spacer(20))
    story.append(Paragraph(
        "<i>This thesis was prepared as part of the MCA program at Janaprabha Institute of Engineering "
        "and Technology, Ramtek, affiliated to Rashtrasant Tukadoji Maharaj Nagpur University, Nagpur. "
        "Academic Year 2025–2026.</i>", S['Caption']))
    
    return story
