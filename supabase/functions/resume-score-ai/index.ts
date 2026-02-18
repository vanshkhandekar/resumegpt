import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const safeNumber = (value: unknown, fallback = 0) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
};

const parseJsonFromModel = (raw: string) => {
  const text = String(raw || "").trim();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      try {
        return JSON.parse(fenced[1]);
      } catch (_) {
        return null;
      }
    }
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch (_) {
        return null;
      }
    }
    return null;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeData, baseline, apiKey } = await req.json();
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY") || Deno.env.get("GEMINI_API_KEY");
    const ACTIVE_KEY = String(apiKey || GOOGLE_API_KEY || "").trim();

    if (!ACTIVE_KEY) {
      throw new Error("GOOGLE_API_KEY is not configured. Please add your Gemini API key in settings or backend env.");
    }

    const systemPrompt = `You are an expert ATS resume reviewer.
    
    You must evaluate the full resume and return ONLY VALID JSON (no markdown, no prose outside JSON).
    Use consistent scoring, not random scoring.
    Follow this exact schema:
    {
      "overallScore": number, // 0-100
      "atsScore": number, // 0-100
      "summary": "string, max 220 chars",
      "sections": [
        {"id":"profile","score":number,"reason":"string"},
        {"id":"education","score":number,"reason":"string"},
        {"id":"skills","score":number,"reason":"string"},
        {"id":"experience","score":number,"reason":"string"},
        {"id":"projects","score":number,"reason":"string"},
        {"id":"certifications","score":number,"reason":"string"}
      ],
      "improvements": ["string", "string", "string", "string"]
    }
    
    Rules:
    - Analyze realism, ATS keywords, structure, action verbs, measurable outcomes.
    - Keep reasons and improvements short and actionable.
    - No hallucinations.
    - Keep score differences realistic relative to provided baseline.
    - Never return fields outside the schema.`;

    const userPayload = {
      baseline,
      resumeData,
      instruction: "Review this resume completely and return schema-compliant JSON only.",
    };

    // Construct the prompt for Gemini
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `System Instruction: ${systemPrompt}\n\nTask: Analyze the following resume data and return ONLY JSON.\n\n${JSON.stringify(userPayload)}` }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.2,
        responseMimeType: "application/json" // Gemini 1.5 JSON mode
      }
    };

    let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${ACTIVE_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "rate_limit",
            message: "AI scoring is busy. Please try again shortly.",
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ error: "ai_error", message: "Failed to communicate with AI service." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse the JSON
    let parsed = parseJsonFromModel(rawContent);
    // Explicit clean-up for common markdown issues if JSON mode fails or adds wrappers
    if (!parsed) {
      const cleaned = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
      try { parsed = JSON.parse(cleaned); } catch { /* ignore */ }
    }

    if (!parsed || typeof parsed !== "object") {
      return new Response(
        JSON.stringify({ error: "invalid_ai_payload", message: "AI returned invalid score format." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const sections = Array.isArray((parsed as { sections?: unknown[] }).sections)
      ? (parsed as { sections: Array<{ id?: string; score?: number; reason?: string }> }).sections
      : [];

    const normalized = {
      overallScore: safeNumber((parsed as { overallScore?: number }).overallScore, safeNumber((baseline || {}).overallScore, 60)),
      atsScore: safeNumber((parsed as { atsScore?: number }).atsScore, safeNumber((baseline || {}).atsScore, 55)),
      summary: String((parsed as { summary?: string }).summary || "AI analysis completed."),
      sections: sections.map((s) => ({
        id: String(s.id || "").toLowerCase(),
        score: safeNumber(s.score, 50),
        reason: String(s.reason || "Section can be improved."),
      })),
      improvements: Array.isArray((parsed as { improvements?: unknown[] }).improvements)
        ? (parsed as { improvements: unknown[] }).improvements.map((x) => String(x).trim()).filter(Boolean).slice(0, 6)
        : [],
    };

    return new Response(JSON.stringify(normalized), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Resume AI score error:", e);
    return new Response(
      JSON.stringify({
        error: "server_error",
        message: e instanceof Error ? e.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
