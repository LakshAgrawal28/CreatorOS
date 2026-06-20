"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

interface PlatformTrend {
  id: string;
  platform: string;
  icon: string;
  score: number;
  growth: string;
  difficulty: string;
  competition: string;
  topic: string;
  category: string;
}

export default function TrendsPage() {
  const trends: PlatformTrend[] = [
    {
      id: "tr-1",
      platform: "Instagram",
      icon: "camera_alt",
      score: 94,
      growth: "+342%",
      difficulty: "Medium",
      competition: "High",
      topic: "Minimalist Desk Setup Aesthetics",
      category: "Tech & Workspace",
    },
    {
      id: "tr-2",
      platform: "YouTube",
      icon: "smart_display",
      score: 88,
      growth: "+215%",
      difficulty: "Hard",
      competition: "Extreme",
      topic: "Healthy Meal Prep under 30 Minutes",
      category: "Health & Food",
    },
    {
      id: "tr-3",
      platform: "TikTok",
      icon: "music_note",
      score: 98,
      growth: "+845%",
      difficulty: "Easy",
      competition: "High",
      topic: "Cyberpunk Tech Unboxing Reels",
      category: "Gadgets & Tech",
    },
    {
      id: "tr-4",
      platform: "Twitter / X",
      icon: "chat_bubble",
      score: 76,
      growth: "+112%",
      difficulty: "Medium",
      competition: "Medium",
      topic: "B2B SaaS Growth Hacks for Solopreneurs",
      category: "Business & Marketing",
    },
  ];

  return (
    <div className="space-y-8 text-[#1a1c1c]">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E5E5E5]/50 pb-6">
        <div>
          <h2 className="font-display-lg text-[28px] sm:text-[32px] font-bold text-primary tracking-tight leading-tight">
            Trend Pulse
          </h2>
          <p className="font-body-md text-on-surface-variant text-[14px] mt-1">
            Discover viral topics and hashtags before they peak to optimize your sponsorships.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#E5E5E5] text-primary hover:bg-[#f3f3f3] transition-colors font-body-sm text-[13px] font-semibold">
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#E5E5E5] text-primary hover:bg-[#f3f3f3] transition-colors font-body-sm text-[13px] font-semibold">
            <span className="material-symbols-outlined text-[16px]">sort</span>
            Sort
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trends.map((trend) => (
          <article
            key={trend.id}
            className="bg-white rounded-[20px] border border-[#E5E5E5] p-8 flex flex-col gap-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-shadow duration-300 group relative overflow-hidden"
          >
            {/* Background Decorative Icon */}
            <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
              <span className="material-symbols-outlined text-[120px]">
                {trend.icon}
              </span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f3f3f3] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">{trend.icon}</span>
                </div>
                <h3 className="font-display-lg text-[20px] font-bold text-primary">{trend.platform}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-data-label text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Trend Score</span>
                <span className="font-data-value text-[24px] font-extrabold text-primary">{trend.score}/100</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#E5E5E5]/60 relative z-10">
              <div>
                <span className="font-data-label text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-1">Growth</span>
                <span className="font-data-value text-[15px] font-extrabold text-[#10B981] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> {trend.growth}
                </span>
              </div>
              <div>
                <span className="font-data-label text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-1">Difficulty</span>
                <span className={`font-data-value text-[15px] font-bold ${
                  trend.difficulty === "Easy" ? "text-green-700" : trend.difficulty === "Medium" ? "text-primary" : "text-[#fb7800]"
                }`}>
                  {trend.difficulty}
                </span>
              </div>
              <div>
                <span className="font-data-label text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-1">Competition</span>
                <span className="font-data-value text-[15px] font-bold text-primary">{trend.competition}</span>
              </div>
            </div>

            {/* Topic recommendation */}
            <div className="relative z-10 flex flex-col gap-1">
              <span className="font-data-label text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Recommended Topic</span>
              <p className="text-[14px] font-bold text-primary">{trend.topic}</p>
              <span className="text-[11px] text-on-surface-variant/80 font-medium">Niche: {trend.category}</span>
            </div>

            {/* Actions */}
            <div className="relative z-10 mt-auto flex gap-3 pt-2">
              <Link
                href={`/dashboard/creator/studio?topic=${encodeURIComponent(trend.topic)}&niche=${encodeURIComponent(trend.category)}`}
                className="flex-1"
              >
                <button className="w-full bg-[#fb7800] hover:bg-[#fb7800]/95 text-white py-3 rounded-xl font-data-label text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">magic_button</span>
                  Generate Script
                </button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
