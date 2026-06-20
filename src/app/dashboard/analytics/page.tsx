"use client";

import React, { useState } from "react";

export default function AnalyticsHubPage() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");

  // Dynamic values depending on timeframe selection
  const metrics = {
    "7d": {
      followers: "121.2K",
      followersChange: "+2.1%",
      followersIsUp: true,
      reach: "480K",
      reachChange: "+4.2%",
      reachIsUp: true,
      impressions: "1.1M",
      impressionsChange: "+11%",
      impressionsIsUp: true,
      engagement: "5.4%",
      engagementChange: "-0.3%",
      engagementIsUp: false,
      sparklines: {
        followers: "M0,25 L20,20 L40,23 L60,18 L80,12 L100,2",
        reach: "M0,28 L20,24 L40,25 L60,12 L80,15 L100,5",
        impressions: "M0,20 L25,21 L50,14 L75,8 L100,2",
        engagement: "M0,8 L25,12 L50,15 L75,14 L100,25"
      },
      chartPath: "M0,260 C100,240 200,220 300,180 C400,150 500,190 600,140 C700,90 800,100 900,60 C950,45 980,30 1000,10",
      xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      yLabels: ["122k", "121k", "120k", "119k", "0"]
    },
    "30d": {
      followers: "124.5K",
      followersChange: "+12%",
      followersIsUp: true,
      reach: "2.1M",
      reachChange: "+8.4%",
      reachIsUp: true,
      impressions: "4.8M",
      impressionsChange: "+24%",
      impressionsIsUp: true,
      engagement: "5.2%",
      engagementChange: "-1.2%",
      engagementIsUp: false,
      sparklines: {
        followers: "M0,25 L10,22 L20,24 L30,18 L40,20 L50,12 L60,15 L70,8 L80,10 L90,2 L100,5",
        reach: "M0,28 L15,25 L30,26 L45,15 L60,18 L75,5 L90,8 L100,2",
        impressions: "M0,20 L20,22 L40,10 L60,15 L80,2 L100,5",
        engagement: "M0,5 L25,8 L50,15 L75,12 L100,25"
      },
      chartPath: "M0,280 C100,270 200,290 300,200 C400,110 500,180 600,120 C700,60 800,90 900,40 C950,15 980,10 1000,0",
      xLabels: ["Oct 1", "Oct 8", "Oct 15", "Oct 22", "Oct 29"],
      yLabels: ["130k", "125k", "120k", "115k", "0"]
    },
    "90d": {
      followers: "135.8K",
      followersChange: "+28%",
      followersIsUp: true,
      reach: "6.8M",
      reachChange: "+19.2%",
      reachIsUp: true,
      impressions: "15.4M",
      impressionsChange: "+45%",
      impressionsIsUp: true,
      engagement: "4.9%",
      engagementChange: "-2.1%",
      engagementIsUp: false,
      sparklines: {
        followers: "M0,28 L10,27 L20,29 L30,22 L40,25 L50,18 L60,20 L70,12 L80,15 L90,4 L100,1",
        reach: "M0,29 L15,28 L30,27 L45,20 L60,22 L75,10 L90,12 L100,3",
        impressions: "M0,25 L20,24 L40,18 L60,20 L80,8 L100,2",
        engagement: "M0,2 L25,5 L50,12 L75,18 L100,28"
      },
      chartPath: "M0,290 C100,285 200,270 300,240 C400,180 500,220 600,150 C700,80 800,100 900,50 C950,25 980,15 1000,2",
      xLabels: ["Month 1", "Month 2", "Month 3"],
      yLabels: ["140k", "130k", "120k", "110k", "0"]
    }
  };

  const selectedData = metrics[timeframe];

  const platformDemographics = [
    { label: "Male (18-24)", percentage: 38 },
    { label: "Female (18-24)", percentage: 42 },
    { label: "Male (25-34)", percentage: 12 },
    { label: "Female (25-34)", percentage: 8 },
  ];

  const geographicalReach = [
    { city: "Mumbai", share: 32 },
    { city: "Delhi", share: 24 },
    { city: "Bengaluru", share: 18 },
    { city: "Pune", share: 10 },
    { city: "Others", share: 16 },
  ];

  const topPosts = [
    {
      title: "10 UI Design Principles for 2024",
      date: "Oct 12, 2023",
      format: "Carousel",
      icon: "view_carousel",
      views: "45.2K",
      engagement: "8.4%",
      trending: "up",
      imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfh0aFIk_s0dA0fr5D-ADSY4VnvAcGBVW8zzdR-5KIkKJBHimNJCE3ThNcpu1WhwzyyUDPAjF9tNhKD4tJ45AOwvAuZ3lkhoPq8Cq5xf0vcdTI3Z2scW3eqK_0gxYpkURES2duZIzXSPwpPERA9MpFA3m0YRss_WMuMWHdIK5mOUFCOoNFUWEFl_1_vabj31QP_FctHpHo3VQB1NnYQYD6f0PU1sk9gicmVtZ3BsCFz3PKSbn2LrejbwE3ZpUh8tjXP9_6AEuJBxg"
    },
    {
      title: "My setup for deep work sessions",
      date: "Oct 05, 2023",
      format: "Image",
      icon: "image",
      views: "32.1K",
      engagement: "6.1%",
      trending: "flat",
      imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4FCbHU0ju1Ww-hvkmiiu9Qj5jowht-ELwUc7XfYZDVBblVSGlmMJEZamfAkHqgEU_1xAlpKYweEMgZWcsTBn4_f3GOyKn_NmLGTOaBUhXfGgm9zJKRM4UjcQOnZ2QzYoygdp37k_WNdGRDyi_nLc38PoIGKffyyqyupUN6osRkj7CoPFGKFGy40X1xL-dzpCf7W3j51XxxiTPDDIVnr0OnZEXdXLi2yU71cMLWBpoZRE-oZ0AJxVk5ev9v0VxKSvDAwz21mCl9QE"
    },
    {
      title: "Figma shortcuts you didn't know",
      date: "Sep 28, 2023",
      format: "Reel",
      icon: "play_circle",
      views: "128.5K",
      engagement: "12.3%",
      trending: "up",
      imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNfWIL1C3z2MjRmqMgKLDtwDO31VU15rD6J3sV8IUCruXBdjqz_58mdJVzFjYeIhcohFivgp9_FNLWtM24IJUKxJLYHOv3lF0cmyEA58rs2P4JoNixpiHyVcxpz_dCOIA9HsqA_pFEv7ZKf7kgx8fVzUr0evxn8oPJWa5nvAa6Pmm-QJUkfI5W5KPrcbzU0tbFUjt3BoC_0n-relE9vc-y5SHpw5KIQtiWYTPUVyR70TA68pAQ0e2KO0GcuETD5OBsMWNGFQuT8Lo"
    }
  ];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto w-full pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="font-display-lg text-[28px] sm:text-[32px] text-primary font-bold tracking-tight">
            Analytics Hub
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Your performance overview synchronized with Instagram Graph Insights.
          </p>
        </div>

        {/* Timeframe Selector Dropdown */}
        <div className="relative flex items-center bg-[#EDEDED] rounded-lg p-1 border border-transparent focus-within:bg-white focus-within:border-[#111111] transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant pl-3 pr-2 text-sm">calendar_month</span>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="bg-transparent border-none font-body-sm text-body-sm text-primary focus:ring-0 py-2 pr-8 pl-0 cursor-pointer appearance-none outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <span className="material-symbols-outlined text-on-surface-variant pr-3 text-sm pointer-events-none absolute right-1">expand_more</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Followers */}
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <span className="font-data-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Total Followers</span>
            <span className="material-symbols-outlined text-[#fb7800]">group</span>
          </div>
          <div className="mt-4">
            <div className="font-data-value text-[32px] leading-tight text-primary font-bold">{selectedData.followers}</div>
            <div className="flex items-center mt-2 gap-2">
              <span className={`font-data-label text-[10px] px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                selectedData.followersIsUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                <span className="material-symbols-outlined text-[12px]">{selectedData.followersIsUp ? "arrow_upward" : "arrow_downward"}</span>
                {selectedData.followersChange}
              </span>
              <span className="font-body-sm text-[12px] text-on-surface-variant/60">vs prev</span>
            </div>
          </div>
          <div className="h-12 w-full mt-4 rounded overflow-hidden relative">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d={`${selectedData.sparklines.followers} L100,30 L0,30 Z`} fill="rgba(251, 120, 0, 0.06)"></path>
              <path d={selectedData.sparklines.followers} fill="none" stroke="#fb7800" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
            </svg>
          </div>
        </div>

        {/* Reach */}
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <span className="font-data-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Account Reach</span>
            <span className="material-symbols-outlined text-[#fb7800]">public</span>
          </div>
          <div className="mt-4">
            <div className="font-data-value text-[32px] leading-tight text-primary font-bold">{selectedData.reach}</div>
            <div className="flex items-center mt-2 gap-2">
              <span className={`font-data-label text-[10px] px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                selectedData.reachIsUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                <span className="material-symbols-outlined text-[12px]">{selectedData.reachIsUp ? "arrow_upward" : "arrow_downward"}</span>
                {selectedData.reachChange}
              </span>
              <span className="font-body-sm text-[12px] text-on-surface-variant/60">vs prev</span>
            </div>
          </div>
          <div className="h-12 w-full mt-4 rounded overflow-hidden relative">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d={`${selectedData.sparklines.reach} L100,30 L0,30 Z`} fill="rgba(251, 120, 0, 0.06)"></path>
              <path d={selectedData.sparklines.reach} fill="none" stroke="#fb7800" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
            </svg>
          </div>
        </div>

        {/* Impressions */}
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <span className="font-data-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Impressions</span>
            <span className="material-symbols-outlined text-[#fb7800]">visibility</span>
          </div>
          <div className="mt-4">
            <div className="font-data-value text-[32px] leading-tight text-primary font-bold">{selectedData.impressions}</div>
            <div className="flex items-center mt-2 gap-2">
              <span className={`font-data-label text-[10px] px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                selectedData.impressionsIsUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                <span className="material-symbols-outlined text-[12px]">{selectedData.impressionsIsUp ? "arrow_upward" : "arrow_downward"}</span>
                {selectedData.impressionsChange}
              </span>
              <span className="font-body-sm text-[12px] text-on-surface-variant/60">vs prev</span>
            </div>
          </div>
          <div className="h-12 w-full mt-4 rounded overflow-hidden relative">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d={`${selectedData.sparklines.impressions} L100,30 L0,30 Z`} fill="rgba(251, 120, 0, 0.06)"></path>
              <path d={selectedData.sparklines.impressions} fill="none" stroke="#fb7800" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
            </svg>
          </div>
        </div>

        {/* Engagement */}
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <span className="font-data-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Engagement Rate</span>
            <span className="material-symbols-outlined text-[#fb7800]">favorite</span>
          </div>
          <div className="mt-4">
            <div className="font-data-value text-[32px] leading-tight text-primary font-bold">{selectedData.engagement}</div>
            <div className="flex items-center mt-2 gap-2">
              <span className={`font-data-label text-[10px] px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                selectedData.engagementIsUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                <span className="material-symbols-outlined text-[12px]">{selectedData.engagementIsUp ? "arrow_upward" : "arrow_downward"}</span>
                {selectedData.engagementChange}
              </span>
              <span className="font-body-sm text-[12px] text-on-surface-variant/60">vs prev</span>
            </div>
          </div>
          <div className="h-12 w-full mt-4 rounded overflow-hidden relative">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d={`${selectedData.sparklines.engagement} L100,30 L0,30 Z`} fill="rgba(116, 120, 120, 0.06)"></path>
              <path d={selectedData.sparklines.engagement} fill="none" stroke="#747878" strokeWidth="1.5" vectorEffect="non-scaling-stroke"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Chart & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-[20px] p-6 flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-body-md text-body-md font-bold text-primary">Follower Growth</h3>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          {/* SVG Main Chart */}
          <div className="flex-1 w-full min-h-[300px] relative border-b border-l border-[#C4C7C7]/30 flex items-end">
            {/* Faux Y-Axis Labels */}
            <div className="absolute left-[-35px] h-full flex flex-col justify-between text-[11px] text-on-surface-variant/50 pb-6 font-data-label font-bold text-right w-6">
              {selectedData.yLabels.map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
            </div>
            {/* Faux SVG Chart */}
            <svg className="w-full h-[280px] relative z-10 pl-2" preserveAspectRatio="none" viewBox="0 0 1000 300">
              {/* Grid Lines */}
              <line stroke="#E5E5E5" strokeDasharray="4" strokeWidth="1" x1="0" x2="100%" y1="75" y2="75"></line>
              <line stroke="#E5E5E5" strokeDasharray="4" strokeWidth="1" x1="0" x2="100%" y1="150" y2="150"></line>
              <line stroke="#E5E5E5" strokeDasharray="4" strokeWidth="1" x1="0" x2="100%" y1="225" y2="225"></line>
              {/* Smooth Curve Area */}
              <path d={`${selectedData.chartPath} L1000,300 L0,300 Z`} fill="url(#orange-gradient)" opacity="0.12"></path>
              {/* Smooth Curve Line */}
              <path d={selectedData.chartPath} fill="none" stroke="#fb7800" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
              <defs>
                <linearGradient id="orange-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fb7800" stopOpacity="1"></stop>
                  <stop offset="100%" stopColor="#fb7800" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Faux X-Axis Labels */}
          <div className="flex justify-between text-[11px] text-on-surface-variant/50 mt-4 px-2 font-data-label font-bold">
            {selectedData.xLabels.map((lbl, idx) => (
              <span key={idx}>{lbl}</span>
            ))}
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-[#111111] text-white rounded-[20px] p-6 border border-transparent shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="material-symbols-outlined text-[#fb7800] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h3 className="font-body-md text-body-md font-bold">AI Insights</h3>
            </div>
            <p className="font-body-sm text-[13px] text-on-primary-fixed-variant leading-relaxed">
              We analyzed your last 30 days of media uploads. Here is what you need to know, explained simply.
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 flex items-start gap-4 hover:border-secondary-container/20 transition-all duration-200 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            <div className="bg-[#f3f3f3] p-2 rounded-full text-primary shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
            </div>
            <div>
              <h4 className="font-body-sm text-[13px] font-bold text-primary mb-1">Timing matters</h4>
              <p className="font-body-sm text-[12.5px] text-on-surface-variant leading-relaxed">Your audience is most active at <strong>7 PM EST</strong> on Thursdays. Post then for max reach.</p>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 flex items-start gap-4 hover:border-secondary-container/20 transition-all duration-200 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            <div className="bg-[#f3f3f3] p-2 rounded-full text-primary shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">view_carousel</span>
            </div>
            <div>
              <h4 className="font-body-sm text-[13px] font-bold text-primary mb-1">Format shift</h4>
              <p className="font-body-sm text-[12.5px] text-on-surface-variant leading-relaxed">Carousel posts are performing <strong>32% better</strong> than single images this month. Keep swiping!</p>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 flex items-start gap-4 hover:border-secondary-container/20 transition-all duration-200 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            <div className="bg-[#f3f3f3] p-2 rounded-full text-primary shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">campaign</span>
            </div>
            <div>
              <h4 className="font-body-sm text-[13px] font-bold text-primary mb-1">Hashtag pivot</h4>
              <p className="font-body-sm text-[12.5px] text-on-surface-variant leading-relaxed">The tag #designinspo saw a <strong>15% drop</strong> in reach. Consider pivoting to #uidesign.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Posts Bottom Grid */}
      <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-body-md text-body-md font-bold text-primary">Top Performing Posts</h3>
          <button className="text-secondary-container font-data-label text-[12px] hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E5E5E5]/50 text-on-surface-variant/50 font-data-label text-[11px] uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">Post Content</th>
                <th className="pb-3">Format</th>
                <th className="pb-3">Views</th>
                <th className="pb-3">Engagement</th>
                <th className="pb-3 pr-2 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-[13px] divide-y divide-[#E5E5E5]/30">
              {topPosts.map((post, idx) => (
                <tr key={idx} className="hover:bg-[#f3f3f3]/20 transition-colors group">
                  <td className="py-4 pl-2 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#f3f3f3] overflow-hidden shrink-0 border border-[#E5E5E5]">
                      <img className="w-full h-full object-cover" alt={post.title} src={post.imgUrl} />
                    </div>
                    <div>
                      <div className="font-medium text-primary line-clamp-1">{post.title}</div>
                      <div className="text-on-surface-variant/50 text-[11px] mt-1">{post.date}</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="bg-[#f3f3f3] text-primary font-data-label text-[10px] px-2 py-0.5 rounded-md inline-flex items-center gap-1 border border-[#E5E5E5]/40">
                      <span className="material-symbols-outlined text-[13px]">{post.icon}</span> {post.format}
                    </span>
                  </td>
                  <td className="py-4 font-data-label font-bold text-primary">{post.views}</td>
                  <td className="py-4 font-data-label font-bold text-primary">{post.engagement}</td>
                  <td className="py-4 pr-2 text-right">
                    {post.trending === "up" ? (
                      <span className="material-symbols-outlined text-green-600 font-bold">trending_up</span>
                    ) : (
                      <span className="material-symbols-outlined text-outline font-bold">trending_flat</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demographics breakdowns side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demographics */}
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <h3 className="font-body-md text-body-md font-bold text-primary border-b border-[#E5E5E5]/50 pb-4 mb-4">
            Age & Gender Demographics
          </h3>
          <div className="space-y-4">
            {platformDemographics.map((demo, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[12.5px] font-semibold text-primary font-body-sm">
                  <span>{demo.label}</span>
                  <span className="font-data-label font-bold">{demo.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f3f3f3] overflow-hidden">
                  <div
                    style={{ width: `${demo.percentage}%` }}
                    className="h-full bg-secondary-container rounded-full"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Regions */}
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <h3 className="font-body-md text-body-md font-bold text-primary border-b border-[#E5E5E5]/50 pb-4 mb-4">
            Top Audience Regions
          </h3>
          <div className="space-y-4">
            {geographicalReach.map((geo, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[12.5px] font-semibold text-primary font-body-sm">
                  <span>{geo.city}</span>
                  <span className="font-data-label font-bold">{geo.share}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f3f3f3] overflow-hidden">
                  <div
                    style={{ width: `${geo.share}%` }}
                    className="h-full bg-primary rounded-full"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
