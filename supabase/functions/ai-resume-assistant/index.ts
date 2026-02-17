import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, context, apiKey } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const ACTIVE_KEY = String(apiKey || LOVABLE_API_KEY || "").trim();

    if (!ACTIVE_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const promptText = String(prompt || "");
    const resumeKeywords = /(resume|cv|summary|experience|project|skills|education|achievement|certification|internship|job|role|bullet|description|profile|work|career|qualification|objective|professional)/i;
    const isResumeRelated = resumeKeywords.test(promptText.toLowerCase());

    const systemPrompt = isResumeRelated
      ? `You are a professional resume writing assistant.

STRICT OUTPUT RULES:
- Write BETWEEN 6 and 8 short lines only
- Keep it simple, natural, and human-written
- Easy English, resume-ready, ATS-friendly
- No bullet points, no numbering, no emojis
- Avoid filler and repetition; keep it concise
- Stay strictly on the users topic only
- Do not add extra assumptions, stories, or unrelated points
- Keep each line brief and direct

CONTENT RULES:
- Focus on achievements, responsibilities, impact, and skills
- Prefer action verbs and measurable outcomes when possible
- If the user is a fresher/student, keep it realistic and not exaggerated

User context: ${context || "General resume assistance"}`
      : `You are a friendly, conversational AI assistant like ChatGPT or Gemini.

PERSONALITY:
- Be warm, helpful, and engaging
- Chat naturally in the user's language (English, Hindi, Hinglish, or any mix)
- Show personality and empathy
- Be knowledgeable and informative
- Use casual, friendly tone

CONVERSATION RULES:
- Answer questions directly and helpfully
- Provide useful information and insights
- Ask follow-up questions when appropriate
- Be supportive and encouraging
- Share knowledge on various topics
- Keep responses conversational (2-6 lines for simple queries, more for complex topics)
- You can use emojis occasionally to be friendly
- If asked about resumes, offer to help with that too

IMPORTANT:
- Respond naturally to greetings, questions, and conversations
- Don't always mention resumes unless the user asks
- Be a general-purpose helpful assistant
- Match the user's energy and language style

User context: ${context || "General conversation"}`;

    const sanitize = (raw: string) => {
      const cleaned = String(raw || "")
        .replace(/\r/g, "")
        .replace(/\s+\n/g, "\n")
        .replace(/\n\s+/g, "\n")
        .replace(/[ \t]+/g, " ")
        .trim();

      // For general chat, allow more natural responses
      if (!isResumeRelated) {
        // Just clean up excessive whitespace but keep the natural flow
        const maxWords = 300;
        const words = cleaned.split(/\s+/).filter(Boolean);
        if (words.length <= maxWords) return cleaned;
        return words.slice(0, maxWords).join(" ") + "...";
      }

      // For resume content, keep the strict formatting
      let lines = cleaned
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length <= 1) {
        const sentences = cleaned
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.replace(/[.!?]+$/g, "").trim())
          .filter(Boolean);
        lines = sentences.length ? sentences : lines;
      }

      const maxLines = 8;
      const maxWords = 90;
      const maxWordsPerLine = 16;

      // Hard cap: line count
      if (lines.length > maxLines) lines = lines.slice(0, maxLines);

      // Keep each line compact (avoid overly long AI output)
      lines = lines.map((line) => line.split(/\s+/).slice(0, maxWordsPerLine).join(" ").trim()).filter(Boolean);

      // Soft minimum: if model produced too many tiny fragments, merge small lines
      const merged: string[] = [];
      for (const l of lines) {
        if (!merged.length) {
          merged.push(l);
          continue;
        }
        const prev = merged[merged.length - 1] || "";
        if (prev.length < 35 && l.length < 35 && merged.length < maxLines) {
          merged[merged.length - 1] = `${prev} ${l}`.trim();
        } else {
          merged.push(l);
        }
      }

      const limited = merged.slice(0, maxLines);
      const totalWords = limited.join(" ").split(/\s+/).filter(Boolean).length;
      if (totalWords <= maxWords) return limited.join("\n");
      // If still too long, trim globally.
      const trimmed: string[] = [];
      let wordsLeft = maxWords;
      for (const line of limited) {
        if (wordsLeft <= 0) break;
        const words = line.split(/\s+/).filter(Boolean).slice(0, wordsLeft);
        if (!words.length) continue;
        trimmed.push(words.join(" "));
        wordsLeft -= words.length;
      }
      return trimmed.join("\n");
    };

    let response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACTIVE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
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
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      // Handle rate limits and quota exhaustion
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "rate_limit",
            message: "AI assistant is temporarily unavailable due to high usage. Please try again in a moment."
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "quota_exceeded",
            message: "AI assistant quota has been exhausted. The feature is now disabled. You can still write manually."
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "ai_error", message: "AI assistant is currently unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = sanitize(data.choices?.[0]?.message?.content || "");

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("AI assistant error:", e);
    return new Response(
      JSON.stringify({
        error: "server_error",
        message: e instanceof Error ? e.message : "Unknown error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
