"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

interface ChatPartner {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  dealTitle: string;
}

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

export default function MessagesPage() {
  const [chats, setChats] = useState<ChatPartner[]>([
    { id: "1", name: "Nexus Audio (Sponsor)", avatar: "N", lastMessage: "Let's proceed with the escrow lock", time: "02:15 PM", unread: true, dealTitle: "Wireless Earbuds Review" },
    { id: "2", name: "EarthFirst (Sponsor)", avatar: "E", lastMessage: "Reel asset looks amazing, releasing funds", time: "Yesterday", unread: false, dealTitle: "Eco Water Bottle promo" },
    { id: "3", name: "AeroFit (Sponsor)", avatar: "A", lastMessage: "Can you adjust the discount code size?", time: "2 days ago", unread: false, dealTitle: "Gymwear Lookbook" },
  ]);

  const [activeChatId, setActiveChatId] = useState<string>("1");
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      { id: "m1", sender: "them", text: "Hey! I saw your follower stats matched our requirements. Let's do a 30s Reel.", time: "11:42 AM" },
      { id: "m2", sender: "me", text: "That sounds great! I checked the budget at ₹12,500 INR. Can we confirm deliverables?", time: "11:45 AM" },
      { id: "m3", sender: "them", text: "Yes, visual cue needs to show the ANC toggle clearly. Let's proceed with the escrow lock", time: "02:15 PM" },
    ],
    "2": [
      { id: "m4", sender: "me", text: "Draft Reel link submitted to your portal.", time: "Wednesday" },
      { id: "m5", sender: "them", text: "Reel asset looks amazing, releasing funds", time: "Thursday" },
    ],
    "3": [
      { id: "m6", sender: "them", text: "Can you adjust the discount code size?", time: "Tuesday" },
    ],
  });

  const [inputText, setInputText] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: "me",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    // Update last message in sidebar
    setChats((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, lastMessage: inputText, time: "Just now", unread: false } : c))
    );

    const typedText = inputText;
    setInputText("");

    // Simulate real-time response from sponsor via websocket after 2 seconds
    setTimeout(() => {
      const responseMsg: Message = {
        id: `m-reply-${Date.now()}`,
        sender: "them",
        text: `Got your message: "${typedText}". Setting up the Razorpay Escrow order split ID now so we can lock it.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), responseMsg],
      }));

      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...c, lastMessage: responseMsg.text, time: "Just now", unread: true } : c
        )
      );
    }, 2000);
  };

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];
  const activeMessages = messages[activeChatId] || [];

  return (
    <div className="space-y-6 select-none h-[calc(100vh-100px)] flex flex-col overflow-hidden">
      
      {/* Page Header */}
      <div className="shrink-0 flex justify-between items-center border-b border-[#E5E5E5]/40 pb-4">
        <div>
          <h2 className="font-display-lg text-[28px] md:text-[32px] font-bold text-primary tracking-tight">
            Sponsorship Messages
          </h2>
          <p className="font-body-sm text-[14px] text-on-surface-variant mt-1">
            Negotiate deliverables and escrow contracts in real-time.
          </p>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden pb-4">
        
        {/* Chats Sidebar */}
        <div className="lg:col-span-4 flex flex-col h-full overflow-hidden">
          <div className="bg-white border border-[#E5E5E5] rounded-[20px] h-full flex flex-col overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            <div className="px-5 py-4 border-b border-[#E5E5E5]/40 bg-[#f9f9f9]/80 font-data-label text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Active Deal Channels
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-[#E5E5E5]/30 no-scrollbar">
              {chats.map((chat) => {
                const isActive = activeChatId === chat.id;
                return (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setChats((prev) => prev.map((c) => (c.id === chat.id ? { ...c, unread: false } : c)));
                    }}
                    className={`w-full text-left p-4 flex gap-3 hover:bg-[#f3f3f3]/30 transition-colors ${
                      isActive ? "border-l-4 border-[#fb7800] bg-[#f3f3f3]/50 font-bold" : "bg-transparent"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[14px] shrink-0">
                      {chat.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[13px] font-bold text-primary truncate">{chat.name}</span>
                        <span className="text-[10px] text-on-surface-variant/40 font-semibold font-data-label">{chat.time}</span>
                      </div>
                      <div className="text-[11px] text-[#fb7800] font-bold truncate mt-0.5 font-data-label">
                        Deal: {chat.dealTitle}
                      </div>
                      <div className={`text-[12px] truncate mt-1 ${chat.unread ? "font-bold text-primary" : "text-on-surface-variant/75"}`}>
                        {chat.lastMessage}
                      </div>
                    </div>
                    {chat.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#fb7800] mt-2 flex-shrink-0 animate-ping"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chatting Viewport Canvas */}
        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
          <div className="bg-white border border-[#E5E5E5] rounded-[20px] flex-1 flex flex-col overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            
            {/* Active Header info */}
            <div className="px-6 py-4 border-b border-[#E5E5E5]/40 bg-[#f9f9f9]/80 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[13px]">
                  {activeChat.avatar}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-primary leading-tight">{activeChat.name}</h4>
                  <span className="text-[11.5px] text-[#fb7800] font-bold font-data-label">Deal: {activeChat.dealTitle}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider font-data-label">Live Channel</span>
              </div>
            </div>

            {/* Message Stream scrollbox */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 no-scrollbar">
              {activeMessages.map((msg) => {
                const isMe = msg.sender === "me";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md rounded-[20px] px-5 py-3 text-[13px] leading-relaxed shadow-[0_2px_8px_rgba(0,0,0,0.015)] ${
                        isMe
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-[#f9f9f9] border border-[#E5E5E5] rounded-tl-none"
                      }`}
                    >
                      <p className="font-body-md font-medium">{msg.text}</p>
                      <span
                        className={`text-[9.5px] block mt-1.5 text-right font-semibold font-data-label ${
                          isMe ? "text-white/60" : "text-on-surface-variant/40"
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Box */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-[#E5E5E5]/40 bg-[#f9f9f9]/50 flex items-center gap-3 shrink-0"
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white rounded-xl border border-[#E5E5E5] text-[13.5px] text-primary focus:outline-none focus:border-[#fb7800] transition-colors outline-none"
              />
              <Button type="submit" variant="secondary" className="h-10 px-5 font-data-label font-bold text-[12px] uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px] mr-1">send</span> Send
              </Button>
            </form>
            
          </div>
        </div>

      </div>
    </div>
  );
}
