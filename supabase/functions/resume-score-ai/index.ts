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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const ACTIVE_KEY = String(apiKey || LOVABLE_API_KEY || "").trim();

    if (!ACTIVE_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert ATS resume reviewer.

You must evaluate the full resume and return ONLY JSON (no markdown, no prose outside JSON).
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

    let response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACTIVE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(userPayload) },
        ],
      }),
    });

    if (!response.ok && apiKey && LOVABLE_API_KEY && String(apiKey).trim() !== String(LOVABLE_API_KEY).trim()) {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          temperature: 0.2,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: JSON.stringify(userPayload) },
          ],
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "rate_limit",
            message: "AI scoring is temporarily unavailable due to high usage. Please try again shortly.",
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "quota_exceeded",
            message: "AI scoring quota exhausted. Please use rule-based scoring for now.",
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({ error: "ai_error", message: "AI scoring is currently unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    const parsed = parseJsonFromModel(rawContent);

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
