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
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY") || Deno.env.get("GEMINI_API_KEY");
    const ACTIVE_KEY = String(apiKey || GOOGLE_API_KEY || "").trim();

    if (!ACTIVE_KEY) {
      throw new Error("GOOGLE_API_KEY is not configured. Please add your Gemini API key in settings or backend env.");
    }

    const promptText = String(prompt || "");
    const resumeKeywords = /(resume|cv|summary|experience|project|skills|education|achievement|certification|internship|job|role|bullet|description|profile|work|career|qualification|objective|professional|action|verb)/i;
    const isResumeRelated = resumeKeywords.test(promptText.toLowerCase());

    const systemInstruction = isResumeRelated
      ? `You are an expert resume consultant.
STRICT RULES - BE EXTREMELY CONCISE:
1. Output EXACTLY 2-3 short bullet points MAX.
2. Each bullet must be under 10 words.
3. No intro, no outro, no fluff.
4. Be specific and actionable.
5. Focus ONLY on the exact question asked.`
      : `You are a helpful AI assistant.
STRICT RULES - BE VERY BRIEF:
1. Answer in 1 SHORT sentence ONLY.
2. No detailed explanations.
3. Be direct and to the point.
4. If off-topic, redirect to resume help.`;

    // Construct the prompt for Gemini
    // Gemini 1.5 format
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `System Instruction: ${systemInstruction}\n\nUser Context: ${context || "None"}\n\nUser Query: ${promptText}` }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 80,
        temperature: 0.5,
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
            message: "AI assistant is busy. Please try again later."
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "ai_error", message: "Failed to communicate with AI service." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    let content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Sanitize response
    content = content
      .replace(/\*\*/g, "")
      .replace(/\*/g, "") // bullets often come as * or -
      .replace(/^[\s-]*\d+\.\s*/gm, "") // remove numbers like "1. "
      .replace(/^[\s-]*-\s*/gm, "") // remove bullets
      .trim();

    // Split lines and take max 3
    let lines = content.split("\n").map(l => l.trim()).filter(Boolean);
    const maxLines = isResumeRelated ? 3 : 1;
    if (lines.length > maxLines) lines = lines.slice(0, maxLines);
    // Further truncate each line if too long
    lines = lines.map(line => line.split(' ').slice(0, 8).join(' '));
    content = lines.join("\n");

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
