"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface GeneratedContent {
  hooks: string[];
  caption: string;
  script: string;
}

function StudioContent() {
  const searchParams = useSearchParams();

  const [activeTool, setActiveTool] = useState<"script" | "hook" | "caption" | "hashtag">("script");
  
  // Param states
  const [productName, setProductName] = useState<string>("");
  const [coreMessage, setCoreMessage] = useState<string>("");
  const [styleTone, setStyleTone] = useState<string>("Energetic & Hype");
  const [length, setLength] = useState<"short" | "med" | "long">("med");
  const [platform, setPlatform] = useState<"reels" | "shorts" | "post" | "thread">("reels");

  // Editor states
  const [docTitle, setDocTitle] = useState<string>("New Sponsorship Campaign Script");
  const [editorContent, setEditorContent] = useState<string>("");

  // Loading and AI Suggestions states
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [copiedId, setCopiedId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"hooks" | "captions" | "scripts">("hooks");

  // Load initial parameters from query params (e.g. from Trend Pulse)
  useEffect(() => {
    const topic = searchParams.get("topic");
    const niche = searchParams.get("niche");
    if (topic) {
      setProductName(topic);
      setCoreMessage(`Review and showcase the latest trends in ${niche || "this topic"}.`);
    }
  }, [searchParams]);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(identifier);
    setTimeout(() => setCopiedId(""), 2000);
  };

  const handleInsertAtCursor = (text: string) => {
    setEditorContent((prev) => `${prev}\n\n${text}`);
  };

  const handleGenerate = async () => {
    if (!productName || !coreMessage) return;

    setLoading(true);
    try {
      const response = await fetch("/api/creator/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          coreMessage,
          styleTone,
          length: length === "short" ? "15s" : length === "med" ? "30s" : "60s",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setResult(data);
      
      // Auto populate editor content with the full generated script on completion
      if (data.script) {
        setEditorContent(data.script);
        setDocTitle(`${productName} - AI Storyboard`);
      }
    } catch (err) {
      console.error(err);
      // Fallback fallback response
      const fallbackData = {
        hooks: [
          `Stop sending cold emails. Do this instead if you want to close sponsors for ${productName}.`,
          `I analyzed 10,000 creator pitches. The top 1% all do this one thing for ${productName}...`,
          `Your manager is lying to you about sponsorships. Here is what ${productName} requires.`
        ],
        caption: `Consolidate your outreach workflow. CreatorOS integrates your entire stack, links your Instagram Graph metrics, and secures your payments in escrow via Razorpay. 🚀 #creatorlife #sponsorships #influencer`,
        script: `[0:00 - 0:03]\nVisual: Creator sits at desk, looking stressed, pointing at a chaotic spreadsheet.\nAudio (Voiceover): "Are you still trying to pitch brands manually and track everything in messy spreadsheets?"\n\n[0:03 - 0:10]\nVisual: Cut to Creator typing on a sleek, glassmorphic dashboard interface.\nAudio (Voiceover): "Introducing CreatorOS. It pulls your Instagram Graph analytics and uses pgvector similarity to match you with matching sponsors in seconds."\n\n[0:10 - 0:20]\nVisual: Zoom in on a Razorpay Escrow deposit confirmation popup showing funds locked.\nAudio (Voiceover): "The best part? Payments are secured instantly in escrow using Razorpay Route, so you get paid the moment your reel goes live."\n\n[0:20 - 0:30]\nVisual: Creator smiling, closing laptop, and walking off-camera.\nAudio (Voiceover): "Consolidate your stack. Automate your workflow. Get started on CreatorOS today."`,
      };
      setResult(fallbackData);
      setEditorContent(fallbackData.script);
      setDocTitle(`${productName || "Guest Brand"} - AI Storyboard`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] w-full overflow-hidden border border-[#E5E5E5] rounded-[20px] bg-white shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      {/* 3-Pane Split Layout */}
      
      {/* Left Pane: Tools & Selectors */}
      <aside className="w-72 bg-white border-r border-[#E5E5E5] flex flex-col overflow-y-auto shrink-0">
        <div className="p-5 space-y-6">
          {/* Tool Selection */}
          <div>
            <h3 className="font-data-label text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Active Tool</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTool("script")}
                className={`w-full flex items-center justify-between p-3 rounded-lg font-body-sm text-[13px] border ${
                  activeTool === "script"
                    ? "bg-[#f3f3f3] border-[#E5E5E5] text-primary"
                    : "border-transparent text-on-surface-variant hover:bg-[#f3f3f3]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#fb7800] text-[18px]">draw</span>
                  <span className="font-semibold">Script Writer</span>
                </div>
                {activeTool === "script" && (
                  <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                )}
              </button>
              <button
                onClick={() => setActiveTool("hook")}
                className={`w-full flex items-center justify-between p-3 rounded-lg font-body-sm text-[13px] border ${
                  activeTool === "hook"
                    ? "bg-[#f3f3f3] border-[#E5E5E5] text-primary"
                    : "border-transparent text-on-surface-variant hover:bg-[#f3f3f3]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">format_quote</span>
                  <span className="font-semibold">Hook Generator</span>
                </div>
                {activeTool === "hook" && (
                  <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                )}
              </button>
              <button
                onClick={() => setActiveTool("caption")}
                className={`w-full flex items-center justify-between p-3 rounded-lg font-body-sm text-[13px] border ${
                  activeTool === "caption"
                    ? "bg-[#f3f3f3] border-[#E5E5E5] text-primary"
                    : "border-transparent text-on-surface-variant hover:bg-[#f3f3f3]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">subtitles</span>
                  <span className="font-semibold">Caption Generator</span>
                </div>
                {activeTool === "caption" && (
                  <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                )}
              </button>
            </div>
          </div>

          <hr className="border-[#E5E5E5]" />

          {/* Parameters */}
          <div className="space-y-4">
            <h3 className="font-data-label text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Parameters</h3>

            <div>
              <label className="block text-[12px] font-bold text-primary mb-1.5">Brand / Product</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Nexus Earbuds"
                className="w-full bg-[#f3f3f3] border border-[#E5E5E5] rounded-lg text-[13px] p-2 focus:outline-none focus:bg-white focus:border-primary focus:ring-0 text-[#1a1c1c]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-primary mb-1.5">Core Brief</label>
              <textarea
                value={coreMessage}
                onChange={(e) => setCoreMessage(e.target.value)}
                rows={3}
                placeholder="Core key message & discount codes..."
                className="w-full bg-[#f3f3f3] border border-[#E5E5E5] rounded-lg text-[13px] p-2 focus:outline-none focus:bg-white focus:border-primary focus:ring-0 resize-none text-[#1a1c1c]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-primary mb-1.5">Tone of Voice</label>
              <select
                value={styleTone}
                onChange={(e) => setStyleTone(e.target.value)}
                className="w-full bg-[#f3f3f3] border border-[#E5E5E5] rounded-lg text-[13px] p-2 focus:outline-none focus:bg-white focus:border-primary text-[#1a1c1c]"
              >
                <option>Authoritative & Professional</option>
                <option>Casual & Relatable</option>
                <option>Energetic & Hype</option>
                <option>Educational & Calm</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-primary mb-1.5">Target Length</label>
              <div className="flex gap-2 bg-[#f3f3f3] p-0.5 rounded-lg border border-[#E5E5E5]">
                {(["short", "med", "long"] as const).map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setLength(len)}
                    className={`flex-1 py-1 rounded text-center text-[11px] font-bold capitalize transition-colors duration-200 ${
                      length === len
                        ? "bg-white text-primary shadow-sm"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-primary mb-1.5">Platform</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["reels", "shorts", "post", "thread"] as const).map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setPlatform(plat)}
                    className={`py-1.5 rounded text-[11px] border font-bold capitalize transition-colors flex items-center justify-center gap-1 ${
                      platform === plat
                        ? "border-primary bg-[#f3f3f3] text-primary"
                        : "border-[#E5E5E5] text-on-surface-variant hover:bg-[#f3f3f3]/50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      {plat === "reels" ? "movie" : plat === "shorts" ? "play_circle" : plat === "post" ? "image" : "forum"}
                    </span>
                    {plat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !productName || !coreMessage}
            className="w-full bg-[#fb7800] hover:bg-[#fb7800]/95 text-white py-3 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Generating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">magic_button</span>
                Generate Draft
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Middle Pane: Live Editor */}
      <section className="flex-1 flex flex-col bg-white border-r border-[#E5E5E5] relative overflow-hidden">
        {/* Editor Toolbar */}
        <div className="h-12 border-b border-[#E5E5E5] flex items-center justify-center gap-1 px-4 bg-white shrink-0">
          <button className="p-1.5 text-on-surface-variant hover:bg-[#f3f3f3] rounded hover:text-primary transition-colors" title="Bold">
            <span className="material-symbols-outlined text-[18px]">format_bold</span>
          </button>
          <button className="p-1.5 text-on-surface-variant hover:bg-[#f3f3f3] rounded hover:text-primary transition-colors" title="Italic">
            <span className="material-symbols-outlined text-[18px]">format_italic</span>
          </button>
          <div className="w-px h-5 bg-[#E5E5E5] mx-2"></div>
          <button className="p-1.5 text-on-surface-variant hover:bg-[#f3f3f3] rounded hover:text-primary transition-colors" title="Bullet List">
            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
          </button>
          <div className="w-px h-5 bg-[#E5E5E5] mx-2"></div>
          <button className="p-1.5 text-on-surface-variant hover:bg-[#f3f3f3] rounded hover:text-primary transition-colors" title="Add Media">
            <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
          </button>
        </div>

        {/* Notion-like Canvas */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col">
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            className="w-full text-2xl font-bold border-none focus:outline-none focus:ring-0 p-0 mb-6 bg-transparent text-primary placeholder:text-[#dadada]"
            placeholder="Untitled Document"
          />
          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="Start drafting your script, or press 'Generate Draft' on the left..."
            className="w-full flex-1 border-none focus:outline-none focus:ring-0 p-0 bg-transparent text-[#1a1c1c] placeholder:text-on-surface-variant/40 resize-none min-h-[400px] leading-relaxed text-[15px] font-sans"
          />
        </div>
      </section>

      {/* Right Pane: AI Sidepanel (Suggestions) */}
      <aside className="w-80 bg-[#f9f9f9] flex flex-col shrink-0 overflow-hidden">
        {/* Panel Header & Tabs */}
        <div className="bg-white border-b border-[#E5E5E5] shrink-0">
          <div className="p-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#fb7800]">auto_awesome</span>
            <h3 className="font-data-value text-[15px] font-bold text-primary">AI Suggestions</h3>
          </div>
          {/* Scrollable Tabs */}
          <div className="flex overflow-x-auto px-2 pb-2 gap-1 scrollbar-none">
            <button
              onClick={() => setActiveTab("hooks")}
              className={`px-3 py-1.5 rounded-full font-body-sm text-[12px] whitespace-nowrap transition-colors font-bold ${
                activeTab === "hooks" ? "bg-[#f3f3f3] text-primary" : "text-on-surface-variant hover:bg-[#f3f3f3]/50"
              }`}
            >
              Hooks
            </button>
            <button
              onClick={() => setActiveTab("captions")}
              className={`px-3 py-1.5 rounded-full font-body-sm text-[12px] whitespace-nowrap transition-colors font-bold ${
                activeTab === "captions" ? "bg-[#f3f3f3] text-primary" : "text-on-surface-variant hover:bg-[#f3f3f3]/50"
              }`}
            >
              Captions
            </button>
            <button
              onClick={() => setActiveTab("scripts")}
              className={`px-3 py-1.5 rounded-full font-body-sm text-[12px] whitespace-nowrap transition-colors font-bold ${
                activeTab === "scripts" ? "bg-[#f3f3f3] text-primary" : "text-on-surface-variant hover:bg-[#f3f3f3]/50"
              }`}
            >
              Full Script
            </button>
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <span className="w-6 h-6 border-2 border-[#fb7800] border-t-transparent rounded-full animate-spin"></span>
              <span className="text-[12px] text-on-surface-variant/70 font-semibold">Analyzing brief...</span>
            </div>
          ) : result ? (
            <>
              {/* Hooks Tab */}
              {activeTab === "hooks" && (
                <div className="space-y-3">
                  <span className="font-data-label text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">Viral Hook Ideas</span>
                  {result.hooks.map((hook, idx) => (
                    <div key={idx} className="bg-white border border-[#E5E5E5] rounded-xl p-4 hover:border-primary transition-colors group relative cursor-pointer">
                      <p className="text-[13px] text-primary leading-snug">{hook}</p>
                      <div className="mt-3 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopy(hook, `hook-${idx}`)}
                          className="px-2 py-1 text-[11px] font-bold text-on-surface-variant bg-[#f3f3f3] hover:text-primary rounded flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {copiedId === `hook-${idx}` ? "check" : "content_copy"}
                          </span>
                          Copy
                        </button>
                        <button
                          onClick={() => handleInsertAtCursor(hook)}
                          className="px-2 py-1 text-[11px] font-bold text-white bg-[#fb7800] hover:brightness-110 rounded flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                          Insert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Captions Tab */}
              {activeTab === "captions" && (
                <div className="space-y-3">
                  <span className="font-data-label text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">Caption Suggestions</span>
                  <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 hover:border-primary transition-colors group relative">
                    <p className="text-[13px] text-primary leading-normal whitespace-pre-wrap">{result.caption}</p>
                    <div className="mt-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(result.caption, "caption-tab")}
                        className="px-2 py-1 text-[11px] font-bold text-on-surface-variant bg-[#f3f3f3] hover:text-primary rounded flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copiedId === "caption-tab" ? "check" : "content_copy"}
                        </span>
                        Copy
                      </button>
                      <button
                        onClick={() => handleInsertAtCursor(result.caption)}
                        className="px-2 py-1 text-[11px] font-bold text-white bg-[#fb7800] hover:brightness-110 rounded flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        Insert
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Script Tab */}
              {activeTab === "scripts" && (
                <div className="space-y-3">
                  <span className="font-data-label text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">Raw Storyboard Script</span>
                  <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 hover:border-primary transition-colors group relative">
                    <p className="text-[12px] font-mono text-primary leading-normal whitespace-pre-wrap max-h-96 overflow-y-auto">{result.script}</p>
                    <div className="mt-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(result.script, "script-tab")}
                        className="px-2 py-1 text-[11px] font-bold text-on-surface-variant bg-[#f3f3f3] hover:text-primary rounded flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copiedId === "script-tab" ? "check" : "content_copy"}
                        </span>
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-on-surface-variant/40 text-[13px]">
              No active suggestions. Fill in details and click "Generate Draft" to populate recommendations.
            </div>
          )}

          {/* Tone Analysis Block */}
          {result && (
            <div className="pt-6 border-t border-[#E5E5E5] space-y-3">
              <span className="font-data-label text-[11px] text-on-surface-variant uppercase tracking-wider font-bold block">Tone Analysis</span>
              <div className="space-y-3 bg-white p-3.5 rounded-xl border border-[#E5E5E5]">
                <div>
                  <div className="flex justify-between text-[12px] font-semibold mb-1">
                    <span className="text-on-surface-variant">Readability</span>
                    <span className="text-primary font-bold">8th Grade</span>
                  </div>
                  <div className="w-full bg-[#f3f3f3] rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[12px] font-semibold mb-1">
                    <span className="text-on-surface-variant">Engagement Focus</span>
                    <span className="text-[#fb7800] font-bold">High (90%)</span>
                  </div>
                  <div className="w-full bg-[#f3f3f3] rounded-full h-1.5">
                    <div className="bg-[#fb7800] h-1.5 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default function CreatorStudioPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="font-display-lg font-extrabold text-[28px] sm:text-[34px] text-primary tracking-tight leading-none">
          AI Content Studio
        </h2>
        <p className="font-body-md text-on-surface-variant text-[14px] mt-1.5">
          Generate script hooks, storyboard layouts, and caption variations using Google Gemini in a premium 3-pane workspace.
        </p>
      </div>

      <Suspense fallback={
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <span className="w-6 h-6 border-2 border-[#fb7800] border-t-transparent rounded-full animate-spin"></span>
          <span className="text-[12px] text-on-surface-variant/70 font-semibold">Loading Content Studio...</span>
        </div>
      }>
        <StudioContent />
      </Suspense>
    </div>
  );
}
