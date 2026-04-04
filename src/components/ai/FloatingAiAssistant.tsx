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

    const systemPrompt = `You are a highly intelligent, friendly, and adaptive AI assistant integrated inside a Resume Builder platform.

Your personality:
- Talk like a real human, not robotic.
- Be friendly, chill, and conversational when the user is casual.
- Be professional, structured, and helpful when the user asks about resume, jobs, career, ATS, or interviews.
- You can switch tone automatically based on user message.

Conversation modes:
1. Casual Mode: Friendly, fun, engaging. (Use simple Hinglish or English depending on user).
   Example: User "bhai kya chal raha hai" -> AI "Bas mast 😄 tu bata kya scene hai?"
2. Resume / Career Mode: Structured, professional, useful, bullet points when needed.

Special Handling for Skills & Languages:
- Help users add Skills and Languages along with their proficiency level in a smart and user-friendly way.
- Ask them about their proficiency: Beginner/Average, Intermediate/Good, Advanced/Excellent (or star ratings).
- Suggest level automatically based on context if possible.
- Convert skills into an ATS-friendly format. Example: "Python (Advanced)".
- Suggest improvements and missing skills for their role.
- If they are confused, give them a conversational prompt to determine their level (like: "Bhai honestly bata, tu kitna comfortable hai isme 😄 Daily use karta hai → Advanced, Thoda bahut aata hai → Intermediate, Bas basics pata hai → Beginner").

General Rules:
- Automatically detect user intent.
- Respond naturally to ANY topic. Don't restrict yourself only to resumes.
- Always try to add value (like ChatGPT premium level).
- Tone matches user (Hinglish -> Reply Hinglish, English -> Reply English).
- Never sound confused. Always guide the user clearly.`;

    const sanitize = (raw: string) => {
      return String(raw || "").trim();
    };

    try {
      const activeKey = "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";
      let aiText = "";

      // Direct call to OpenRouter / Claude Opus
      const payload = {
        model: "anthropic/claude-3-opus",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Context: ${context || "None"}\n\nQuery: ${userText}` }
        ],
        max_tokens: 150,
        temperature: 0.5,
      };

      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${activeKey}`,
            "HTTP-Referer": "https://ai-resume-studio.com",
            "X-Title": "AI Resume Studio",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`OpenRouter Error: ${response.status}`);
        }

        const data = await response.json();
        aiText = sanitize(data.choices?.[0]?.message?.content || "No response generated.");
      } catch (err) {
        console.warn("AI Assistant API failed, using intelligent mock fallback:", err);
        const resumeKeywords = /\b(resume|cv|summary|experience|project|skills|education|achievement|certification|internship|job|role|bullet|description|profile|work|career|qualification|objective|professional|action|verb)\b/i;
        const isResumeRelated = resumeKeywords.test(userText.toLowerCase());

        if (isResumeRelated) {
          aiText = sanitize(
            "Bhai resume me hamesha strong action verbs (jaise 'Developed' ya 'Managed') use karo. Aur numbers/metrics zaroor include karo (e.g. 'improved by 20%'). Kuch aur help chahiye?"
          );
        } else {
          aiText = sanitize("Yaar abhi external AI service me thoda delay hai. Koi baat nahi, aap apna sawal puchho main yahi help karunga! 😄");
        }
      }

      setMessages((prev) => [...prev, { role: "ai", content: aiText }]);
      bumpAiUsageMetric();
      setInput("");
    } catch (err) {
      console.error("AI error:", err);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to connect to Claude 4.6 via OpenRouter. Please check the API key limits.",
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
          className="h-[3.25rem] w-[3.25rem] rounded-full border-0 bg-[#3b82f6] text-white shadow-lg hover:bg-[#2563eb] transition-all hover:scale-105"
          size="icon"
          aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        >
          {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6 stroke-[1.5]" />}
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
                <div className="relative h-11 w-11 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 animate-pulse" />
                  <div className="relative h-10 w-10 bg-[#3b82f6] rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-105">
                    <MessageCircle className="h-5 w-5 text-white stroke-[1.5]" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">AI Resume Assistant</CardTitle>
                  <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Active (Opus 4.6)
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
