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
    setInput("");

    const systemPrompt = `You are a human-like AI assistant inside a Resume Builder app.

CRITICAL RULE:
You must NEVER sound like an AI. You must sound like a real person chatting naturally.

PERSONALITY:
- Talk like a friendly Indian user (Hinglish allowed)
- Be chill, casual, and natural
- Use emotions, small reactions, and conversational fillers (like: "arey", "bhai", "acha", "hmm", "sahi hai", "got it")
- Keep responses SHORT unless user asks for detail
- Avoid robotic, formal, or structured replies unless required

TONE SWITCHING (VERY IMPORTANT):

1. Casual Conversation Mode:
If user says anything normal like "hello", "kya kar raha hai", "kaisa hai"
Response style: Friendly, human, chill
Example: "Bas mast 😄 tu bata kya scene hai?"

2. Resume / Career Mode:
If user asks about resume, jobs, ATS, skills
Switch tone slightly professional BUT still human.
Example: "Achha resume bana lete hain 💼 Tu fresher hai ya experience hai?"

3. Mixed Mode:
If user mixes both like "Bhai resume bana de na"
Response: "Ha bhai bana dete hain 😄 Kis role ke liye chahiye?"

ANTI-AI RULES (MOST IMPORTANT):
- NEVER say "As an AI...", "I can help you with...", "Here are the steps..."
- NEVER sound robotic or give lecture-style answers
- NEVER use too much structure unless necessary
- INSTEAD: Talk like WhatsApp chat, use short lines, ask questions back, keep flow natural

SMART BEHAVIOR:
- If user unclear: "Thoda clear bata na bhai 😅"
- If user stuck: "Chal main help karta hu, tension mat le"
- If resume needed: Ask 2-3 quick questions instead of dumping info

MEMORY STYLE:
- Refer previous messages if possible
- Feel like ongoing chat, not new answer every time

EXAMPLES (STRICTLY FOLLOW STYLE):
User: "kya kar raha hai" → AI: "Bas yaar chill 😄 tu bata kya chal raha hai?"
User: "resume bana" → AI: "Chal bana dete hain 💼 Kis role ke liye chahiye?"
User: "python add karu?" → AI: "Haan kar sakta hai 👍 Kitna aata hai tujhe — basic ya strong?"
User: "thanks" → AI: "Anytime bhai 😄"

FINAL GOAL: User should feel like chatting with a smart friend, NOT a tool.`;

    const sanitize = (raw: string) => {
      return String(raw || "").trim();
    };

    try {
      const activeKey = getActiveApiKey();
      let aiText = "";

      // Build full conversation history for context
      const chatHistory = messages.map((m) => ({
        role: m.role === "ai" ? "assistant" as const : "user" as const,
        content: m.content,
      }));

      const payload = {
        model: "anthropic/claude-3-opus",
        messages: [
          { role: "system" as const, content: systemPrompt },
          ...chatHistory,
          { role: "user" as const, content: userText }
        ],
        max_tokens: 300,
        temperature: 0.8,
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
        aiText = sanitize(data.choices?.[0]?.message?.content || "Arey yaar kuch dikkat aa gayi 😅 ek baar phir try kar");
      } catch (err) {
        console.warn("AI Assistant API failed, using fallback:", err);
        const resumeKeywords = /\b(resume|cv|summary|experience|project|skills|education|achievement|certification|internship|job|role|bullet|description|profile|work|career|qualification|objective|professional|action|verb)\b/i;
        const casualKeywords = /\b(hi|hello|hey|kya|kaise|kaisa|bhai|yaar|bro|sup|thanks|thankyou|haan|nahi|ok|theek|chal)\b/i;
        const isResumeRelated = resumeKeywords.test(userText.toLowerCase());
        const isCasual = casualKeywords.test(userText.toLowerCase());

        if (isCasual && !isResumeRelated) {
          const casualReplies = [
            "Bas yaar mast 😄 tu bata kya chal rha?",
            "Arey bhai! Bol na kya scene hai 😎",
            "Haan bhai sun rha hu, bol! 👋",
            "Kya baat hai bro, kaise ho? 😄",
            "Anytime bhai 😄 kuch aur chahiye toh bol",
          ];
          aiText = casualReplies[Math.floor(Math.random() * casualReplies.length)];
        } else if (isResumeRelated) {
          const resumeReplies = [
            "Chal resume pe kaam karte hain 💼 Bata kis role ke liye chahiye?",
            "Resume me strong action verbs use kar bhai — like 'Developed', 'Managed'. Aur numbers daal 📊",
            "Achha bata — fresher hai ya experience hai? Usse template decide hoga 👍",
          ];
          aiText = resumeReplies[Math.floor(Math.random() * resumeReplies.length)];
        } else {
          aiText = "Yaar abhi network me thoda issue hai 😅 Ek baar phir try kar, main yahi hu!";
        }
      }

      setMessages((prev) => [...prev, { role: "ai", content: aiText }]);
      bumpAiUsageMetric();
    } catch (err) {
      console.error("AI error:", err);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "AI se connect nahi ho paya. API key check karo admin panel me.",
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
          {open ? <X className="h-5 w-5" /> : <Sparkles className="h-6 w-6 stroke-[1.5]" />}
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
                    <Sparkles className="h-5 w-5 text-white stroke-[1.5]" />
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
              className="chat-scroll relative flex-1 overflow-y-auto p-4 cursor-grab"
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
                    <div className="typing-bubble mt-2">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={endRef} className="h-2" />
              </div>
            </div>
            
            <div className="relative shrink-0 p-3 pt-0">
              <div className="rounded-[1.5rem] border border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-2 py-1.5 shadow-[0_-4px_24px_-12px_rgba(0,0,0,0.1)]">
                <div className="flex items-end gap-2">
                  <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-slate-500 hover:text-slate-700 transition-colors">
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
                    className="min-h-[36px] max-h-24 flex-1 resize-none border-0 bg-transparent p-2 text-[13px] leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:ring-0"
                  />
                  <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-slate-500 hover:text-slate-700 transition-colors">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleSend} disabled={!enabled || loading} size="icon" className="h-9 w-9 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-all hover:scale-105 shadow-md">
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-slate-500 hover:text-slate-700 transition-colors">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
