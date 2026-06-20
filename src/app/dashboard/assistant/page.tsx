"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  time: string;
  stats?: {
    avgViewDuration: { value: string; change: string; isUp: boolean };
    ctr: { value: string; change: string; isFlat: boolean };
  };
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "assistant",
      text: "Hello! I'm your CreatorOS AI. I've been analyzing your recent performance data. How can I help you optimize your channel today?",
      time: "10:00 AM",
    },
  ]);
  const [inputText, setInputText] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { label: "Why are my views dropping?", prompt: "Why are my views dropping on my last three tech review videos?" },
    { label: "Suggest reel ideas", prompt: "Suggest 3 visual concept ideas for an Instagram Reel promoting premium gym wear. Highlight fitness transitions." },
    { label: "Write a YouTube script", prompt: "Write a high-converting sponsorship pitch script showing my tech niche and 8.9% engagement rate. Keep it short and professional." },
    { label: "Analyze my engagement", prompt: "Explain my recent metrics projection and outline three key strategies creators use to bump up audience watch times." },
    { label: "Suggest sponsorships", prompt: "Look at my tech & gadgets niche profile and recommend the top 3 sponsors that fit my audience demographics." },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, generating]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setGenerating(true);

    try {
      // Call generate endpoint
      const res = await fetch("/api/creator/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: "AI Assistant",
          coreMessage: textToSend,
          styleTone: "helpful",
          length: "short",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const responseText = data.script || data.caption || "I've processed your request. How else can I help you today?";
        
        const aiMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          sender: "assistant",
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error();
      }
    } catch (e) {
      // Simulate rich responsive fallback representing the mockup stats
      setTimeout(() => {
        let aiMsg: ChatMessage;
        
        if (textToSend.toLowerCase().includes("view") || textToSend.toLowerCase().includes("dropping")) {
          aiMsg = {
            id: `a-fallback-${Date.now()}`,
            sender: "assistant",
            text: "I've analyzed your latest tech reviews compared to your channel baseline. The primary issue appears to be a drop in early viewer retention. Your intros have extended from 15 seconds to 45 seconds on average. Try cutting straight to the product unboxing.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            stats: {
              avgViewDuration: { value: "3m 12s", change: "18%", isUp: false },
              ctr: { value: "4.2%", change: "Flat", isFlat: true }
            }
          };
        } else {
          aiMsg = {
            id: `a-fallback-${Date.now()}`,
            sender: "assistant",
            text: `Here is a custom recommendation draft for you:

1. **デスクセットアップ (Desk Setup v2)**: Focus on lo-fi audio tracks, which increase shares by 21% based on current Tech & Gadgets trends.
2. **Dynamic Transitions**: Use quick cuts in the first 3 seconds of your Gymwear or Brand Sponsor reels to capture attention immediately.
3. **Razorpay Escrow Safety**: Remember to lock agreements in Escrow prior to publication to guarantee secure platform payouts.`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
        }
        
        setMessages((prev) => [...prev, aiMsg]);
      }, 1000);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] relative w-full overflow-hidden select-none">
      {/* Page Header */}
      <div className="px-6 py-6 shrink-0 flex flex-col justify-center items-center text-center border-b border-[#E5E5E5]/40 bg-white/40 backdrop-blur-md">
        <h2 className="font-display-lg text-[28px] md:text-[34px] font-bold text-primary tracking-tight leading-tight">
          AI Assistant
        </h2>
        <p className="font-body-md text-[14px] text-on-surface-variant mt-1.5 max-w-lg leading-relaxed">
          Ask anything about your content, analytics parameters, or sponsor matches.
        </p>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-48 w-full max-w-[850px] mx-auto space-y-8 no-scrollbar scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            {msg.sender === "user" ? (
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-sm border border-[#E5E5E5]/50">
                <img
                  className="w-full h-full object-cover"
                  alt="User profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB0eDtFtud95v8U2vxLfCkQse0MMOCDTshotLtphZZOCn0Pdg-Z40eQW_D3HlEtYK3M5cISjAENNiEAXI4qTlzKGwbTyjSlHwS_SDISwmOs33bpVN396f9nHZ-tHCEeOcAwMbCYALG_qO2totFY7j_yA8VXfx4qhTNPsNlolPGcdcodKEfxBunqBqvyFj_P5CTfMTE71QaHs6J34DDOs0QOcdOavMlx-53CSkWHvpo9tcuSf1bM9ejvq5ECZYZkdKpIOMsJ19TZho"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
            )}

            {/* Bubble */}
            <div className={`bg-white border border-[#E5E5E5]/60 rounded-[20px] p-5 max-w-[80%] shadow-[0_4px_30px_rgba(0,0,0,0.02)] ${
              msg.sender === "user" ? "rounded-tr-none bg-[#f3f3f3]/40" : "rounded-tl-none"
            }`}>
              <div className="whitespace-pre-wrap font-body-md text-[14px] text-primary leading-relaxed">
                {msg.text}
              </div>

              {/* Stats Card inside AI response (if applicable) */}
              {msg.stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#E5E5E5]/40">
                  <div className="p-4 border border-[#E5E5E5] rounded-xl bg-[#f9f9f9]/50">
                    <span className="font-data-label text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold">Avg. View Duration</span>
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="font-data-value text-[20px] text-primary font-bold">{msg.stats.avgViewDuration.value}</span>
                      <span className="font-data-label text-[11px] text-red-600 font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px] font-bold">arrow_downward</span> {msg.stats.avgViewDuration.change}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border border-[#E5E5E5] rounded-xl bg-[#f9f9f9]/50">
                    <span className="font-data-label text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold">Click-Through Rate</span>
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="font-data-value text-[20px] text-primary font-bold">{msg.stats.ctr.value}</span>
                      <span className="font-data-label text-[11px] text-on-surface-variant/60 font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px] font-bold">horizontal_rule</span> {msg.stats.ctr.change}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <span className="text-[10px] text-on-surface-variant/40 block mt-3 font-semibold text-right w-full">
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Spinner Bubble */}
        {generating && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <div className="bg-white border border-[#E5E5E5]/60 rounded-[20px] rounded-tl-none px-5 py-4 max-w-[80%] shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex items-center gap-2">
              <span className="w-2 h-2 bg-[#fb7800] rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-[#fb7800] rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-[#fb7800] rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Floating Input Section fixed at bottom of viewport */}
      <div className="absolute bottom-0 left-0 right-0 w-full pt-16 pb-8 px-6 bg-gradient-to-t from-background via-background/95 to-transparent flex justify-center z-10 pointer-events-none">
        <div className="w-full max-w-[800px] flex flex-col gap-3 pointer-events-auto">
          
          {/* Predefined Suggestions Row */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {suggestedPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                className="shrink-0 px-4 py-2 bg-white border border-[#E5E5E5] rounded-full font-data-label text-[11px] font-bold text-on-surface-variant hover:text-[#fb7800] hover:border-[#fb7800] transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="relative flex items-center bg-white border border-[#E5E5E5] rounded-full p-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] focus-within:border-primary focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center rounded-full">
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>
            <input
              type="text"
              placeholder="Ask anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }
              }}
              className="flex-1 bg-transparent border-none focus:ring-0 text-primary font-body-md text-[14px] placeholder:text-on-surface-variant/40 px-2 h-10 outline-none"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-95 transition-transform duration-200 shrink-0 shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
            </button>
          </div>
          <p className="text-center font-data-label text-[10px] text-on-surface-variant/40 font-semibold uppercase tracking-wider">
            AI can make mistakes. Verify important metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
