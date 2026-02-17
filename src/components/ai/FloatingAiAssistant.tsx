import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Bot, Camera, Mic, Plus, Send, X, MessageCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { bumpAiUsageMetric, getActiveApiKey } from "@/lib/demoStorage";

type FloatingAiAssistantProps = {
  context: string;
  enabled?: boolean;
};

export function FloatingAiAssistant({ context, enabled = true }: FloatingAiAssistantProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([
    { role: "ai", content: "Hello! 👋 I'm your AI Resume Assistant. How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const endRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingScroll = useRef(false);
  const lastScrollPosition = useRef({ x: 0, y: 0 });

  const btnSize = 52;
  const margin = 20;
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    try {
      const raw = localStorage.getItem("rgpt_ai_pos");
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return { x: 0, y: 0 };
  });

  useEffect(() => {
    // Place at bottom-right on first mount if not set
    const defaultPos = { x: window.innerWidth - btnSize - margin, y: window.innerHeight - btnSize - 88 };
    if (pos.x === 0 && pos.y === 0) {
      setPos(defaultPos);
      return;
    }
    const maxX = Math.max(margin, window.innerWidth - btnSize - margin);
    const maxY = Math.max(margin, window.innerHeight - btnSize - 72);
    const outOfBounds = pos.x < margin || pos.y < margin || pos.x > maxX || pos.y > maxY;
    if (outOfBounds) {
      setPos(defaultPos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onResize = () => {
      setPos((current) => {
        const maxX = Math.max(margin, window.innerWidth - btnSize - margin);
        const maxY = Math.max(margin, window.innerHeight - btnSize - 72);
        return {
          x: Math.min(maxX, Math.max(margin, current.x)),
          y: Math.min(maxY, Math.max(margin, current.y)),
        };
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("rgpt_ai_pos", JSON.stringify(pos));
    } catch {
      // ignore
    }
  }, [pos]);

  useEffect(() => {
    const el = endRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const clamp = (next: { x: number; y: number }) => {
    const maxX = Math.max(margin, window.innerWidth - btnSize - margin);
    const maxY = Math.max(margin, window.innerHeight - btnSize - 72);
    return {
      x: Math.min(maxX, Math.max(margin, next.x)),
      y: Math.min(maxY, Math.max(margin, next.y)),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    dragOffsetRef.current = { x: startX - pos.x, y: startY - pos.y };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const next = clamp({ x: e.clientX - dragOffsetRef.current.x, y: e.clientY - dragOffsetRef.current.y });
    setPos(next);
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Mouse drag scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only enable drag scroll if clicking on the chat container, not on input/buttons
    if ((e.target as HTMLElement).closest('input, textarea, button')) return;
    isDraggingScroll.current = true;
    lastScrollPosition.current = { x: e.clientX, y: e.clientY };
    if (chatContainerRef.current) {
      chatContainerRef.current.style.cursor = 'grabbing';
      chatContainerRef.current.style.userSelect = 'none';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingScroll.current || !chatContainerRef.current) return;
    const deltaY = e.clientY - lastScrollPosition.current.y;
    chatContainerRef.current.scrollTop += deltaY;
    lastScrollPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingScroll.current = false;
    if (chatContainerRef.current) {
      chatContainerRef.current.style.cursor = 'grab';
      chatContainerRef.current.style.userSelect = 'auto';
    }
  };

  const handleMouseLeave = () => {
    isDraggingScroll.current = false;
    if (chatContainerRef.current) {
      chatContainerRef.current.style.cursor = 'grab';
      chatContainerRef.current.style.userSelect = 'auto';
    }
  };

  const placeholder = "Type a message... (Enter to send, Shift+Enter for new line)";

  const handleSend = () => {
    handleAsk();
  };

  const handleAsk = async () => {
    if (!enabled) return;
    if (!input.trim()) return;

    setLoading(true);
    const userText = input.trim();
    if (!userText) return;
    setMessages((prev) => [...prev, { role: "user", content: userText }]);

    const resumeKeywords = /\b(resume|cv|summary|experience|project|skills|education|achievement|certification|internship|job|role|bullet|description|profile|work|career|qualification|objective|professional)\b/i;
    const isResumeRelated = resumeKeywords.test(userText.toLowerCase());

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
      const cleanedText = String(raw || "")
        .replace(/\r/g, "")
        .replace(/\s+\n/g, "\n")
        .replace(/\n\s+/g, "\n")
        .replace(/[ \t]+/g, " ")
        .trim();

      // For general chat, allow more natural responses
      if (!isResumeRelated) {
        // Just clean up excessive whitespace but keep the natural flow
        const maxWords = 300;
        const words = cleanedText.split(/\s+/).filter(Boolean);
        if (words.length <= maxWords) return cleanedText;
        return words.slice(0, maxWords).join(" ") + "...";
      }

      // For resume content, keep the strict formatting
      let lines = cleanedText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length <= 1) {
        const sentences = cleanedText
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.replace(/[.!?]+$/g, "").trim())
          .filter(Boolean);
        lines = sentences.length ? sentences : lines;
      }
      const maxLines = 8;
      const maxWords = 90;
      const maxWordsPerLine = 16;
      if (lines.length > maxLines) lines = lines.slice(0, maxLines);
      lines = lines.map((line) => line.split(/\s+/).slice(0, maxWordsPerLine).join(" ").trim()).filter(Boolean);
      const limited = lines.slice(0, maxLines);
      const totalWords = limited.join(" ").split(/\s+/).filter(Boolean).length;
      if (totalWords <= maxWords) return limited.join("\n");
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

    try {
      const activeKey = getActiveApiKey();
      let aiText = "";

      if (activeKey && !aiText) {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${activeKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userText },
            ],
          }),
        });
        if (response.ok) {
          const data = await response.json();
          aiText = sanitize(data?.choices?.[0]?.message?.content || "");
        }
      }

      if (!aiText) {
        const { data, error } = await supabase.functions.invoke("ai-resume-assistant", {
          body: { prompt: userText, context, apiKey: activeKey },
        });
        if (error) throw error;

        if (data?.error === "rate_limit") {
          toast({ variant: "destructive", title: "Rate Limit", description: data.message });
          return;
        }
        if (data?.error === "quota_exceeded") {
          toast({ variant: "destructive", title: "AI Quota Exhausted", description: data.message });
          setOpen(false);
          return;
        }
        aiText = data?.content || "No response generated.";
      }

      setMessages((prev) => [...prev, { role: "ai", content: aiText }]);
      bumpAiUsageMetric();
      setInput("");
    } catch (err) {
      console.error("AI error:", err);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to get AI assistance. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed z-50"
        style={{ left: pos.x, top: pos.y }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Button
          onPointerDown={onPointerDown}
          onClick={() => setOpen((v) => !v)}
          className="h-[3.25rem] w-[3.25rem] rounded-full bg-primary text-primary-foreground shadow-[0_0_0_1px_hsl(var(--border)),0_24px_70px_-24px_hsl(var(--primary)/0.6)]"
          size="icon"
          aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        >
          {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <Card
          className="fixed z-50 flex h-[34rem] w-[24rem] flex-col overflow-hidden rounded-[1.5rem] border-0 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-2xl"
          style={{ right: margin, bottom: 96 }}
        >
          <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm pb-3 pt-4 rounded-t-[1.5rem]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">AI Resume Assistant</CardTitle>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <Button
                onClick={handleClose}
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative flex flex-1 flex-col p-0">
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-200/70 blur-2xl" />
              <div className="absolute left-6 top-20 h-56 w-56 rounded-full bg-indigo-100/60 blur-3xl" />
              <div className="absolute -bottom-10 right-6 h-44 w-44 rounded-full bg-purple-200/60 blur-2xl" />
            </div>
            <div
              ref={chatContainerRef}
              className="chat-scroll relative flex-1 overflow-y-auto pr-2 pb-20 cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex flex-col gap-3">
                {messages.map((msg, idx) => (
                  <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] px-4 py-2.5 text-sm shadow-sm transition-all hover:shadow-md ${msg.role === "user"
                        ? "rounded-2xl rounded-br-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium"
                        : "rounded-2xl rounded-bl-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50"
                        }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="typing-bubble">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </div>
            <div className="sticky bottom-0 mt-3 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
              <div className="flex items-end gap-2">
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-slate-500">
                  <Camera className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder={placeholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="min-h-[36px] max-h-20 flex-1 resize-none border-0 bg-transparent p-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0"
                />
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-slate-500">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button onClick={handleSend} disabled={!enabled || loading} size="icon" className="h-9 w-9 rounded-full bg-blue-600 text-white hover:bg-blue-700">
                  <Send className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-slate-500">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
