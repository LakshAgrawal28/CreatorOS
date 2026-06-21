"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface CreatorMatch {
  id: string;
  instagramHandle: string;
  creatorName: string;
  bio: string;
  niche: string;
  followerCount: number;
  engagementRate: number;
  averageLikes: number;
  averageViews: number;
  score: number;
}

interface Campaign {
  id: string;
  title: string;
  industry: string;
  budget: number;
}

export default function MatchesCRMPage() {
  // Immediately read role from demo_role cookie to avoid SPONSOR flash for CREATOR users
  const getCookieRole = (): "CREATOR" | "SPONSOR" => {
    if (typeof document === "undefined") return "SPONSOR";
    const cookie = document.cookie.split(";").find((c) => c.trim().startsWith("demo_role="));
    const val = cookie?.split("=")?.[1]?.trim();
    return val === "CREATOR" ? "CREATOR" : "SPONSOR";
  };

  const [role, setRole] = useState<"CREATOR" | "SPONSOR">(getCookieRole);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [matches, setMatches] = useState<CreatorMatch[]>([]);
  const [creatorBrands, setCreatorBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Simulated Mock Campaigns
  const mockCampaigns: Campaign[] = [
    { id: "mock-1", title: "Wireless Over-Ear ANC Headphones Launch", industry: "Tech & Gadgets", budget: 500 },
    { id: "mock-2", title: "Organic Green Teas Campaign", industry: "Health & Food", budget: 200 },
    { id: "mock-3", title: "Summer Gym Wear Lookbook", industry: "Fitness & Apparel", budget: 300 },
  ];

  // Dynamic creator matching lists based on campaign selected
  const mockMatches: Record<string, CreatorMatch[]> = {
    "mock-1": [
      {
        id: "c-1",
        instagramHandle: "tech_review_guy",
        creatorName: "Rahul Sharma",
        bio: "Reviewing the latest tech gadgets and mobile gear. Daily tech reels and stories.",
        niche: "Tech & Gadgets",
        followerCount: 4890,
        engagementRate: 0.089,
        averageLikes: 435,
        averageViews: 1740,
        score: 0.942,
      },
      {
        id: "c-2",
        instagramHandle: "gadget_hacks",
        creatorName: "Amit Patel",
        bio: "Smart home reviews and daily life productivity hacks. Making tech accessible.",
        niche: "Tech & Gadgets",
        followerCount: 3120,
        engagementRate: 0.076,
        averageLikes: 237,
        averageViews: 950,
        score: 0.865,
      },
    ],
    "mock-2": [
      {
        id: "c-3",
        instagramHandle: "healthy_eats_in",
        creatorName: "Pooja Roy",
        bio: "Registered nutritionist sharing quick, healthy vegan recipes and tea reviews.",
        niche: "Health & Food",
        followerCount: 4210,
        engagementRate: 0.092,
        averageLikes: 387,
        averageViews: 1540,
        score: 0.915,
      },
    ],
    "mock-3": [
      {
        id: "c-4",
        instagramHandle: "priya_fitlife",
        creatorName: "Priya Das",
        bio: "Fitness trainer sharing daily workouts, gym clothing reviews, and meal prep tips.",
        niche: "Fitness & Apparel",
        followerCount: 3200,
        engagementRate: 0.084,
        averageLikes: 268,
        averageViews: 1070,
        score: 0.893,
      },
    ],
  };

  // Mock Brands data for the CREATOR matching view
  const creatorBrandMatches = [
    { id: "b1", brandName: "Boat", industry: "Consumer Audio", score: 92, logo: "B", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMf3D7T8dWNOagRHiwapsOQvOTuAs9wSAaIOJp1chO_nzvRfsTX2i-3cho7ZiA2BPUZ7xAgLJdlQOfQo71iXfPNzXFy6N_O5kUwkmt_TQA42tQKjwW4Md81UROgWhkOW7Pu01AmXCvk0yYTb2AadyC6rep4BqK6lQiP7YG7o1egLhRahx7ov7gCa9mQv_ybAqknyRl7wPK0LeRe0_4sp0gNz9gav__QybYzp7WlAYXZrkKUSN3J95C9tqCjR_IAfjCbG2xvWJXSfc" },
    { id: "b2", brandName: "Noise", industry: "Wearables", score: 88, logo: "N", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2cec2vdS52vNiougobe1HC6PwBzH7QhOocPiADY9A966KKA_9mQou0RvDytdz1kzuJvXDlsgRak5tHZblEwpQa1ZFBxCYTJFAU27s2zJdNkG3e-QIIKqEUKc2ExunfE-gya_Oak9-q7qwo89M_3kEOFejppiFKb6sdSrhL-Sf7thbolKY7Tmdc4IEv7fT3Orgkcx8oFeJ32kXokMlIPksjm57MrpCiOlBu1qo7UImT8RbsQ1VwmiFfJsN3cVqCW-bI_bhGlhYnA4" },
    { id: "b3", brandName: "Skillshare", industry: "EdTech", score: 75, logo: "S", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0rQAxBdEVvNjxAl-tTnjFlVgP9X_26pGbim4B7sX6e9iUglHNch-mv2Ck0yS2rDxcI3SJLr4kA3l0ytGOyayXpyyhyMsIvvMaRWLFLVLIOmON1lV54x0eF5bp302SzSCf_iS7wXpWaOm3k02HeEtNsJDflCpy2Ow_bzz9mNGe8k00SyUcZaOymkJlI7YrUPLeWyCpBeyVmM8YjtOQ2H4mq7EaAeq8flUI2b8-rwBrSfR8Cp3DyhkN738Fmt60vJs1M1nrolrR70k" },
  ];

  // Mock CRM data for the CREATOR status pipeline
  const creatorCRMDeals = [
    { id: "d1", brandName: "Red Bull", score: 85, status: "Negotiating", statusColor: "bg-blue-100 text-blue-800 border-blue-200", lastContact: "2 days ago", action: "Update", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDRJtPi1hw5P5AKYzVvEy2ekITofM2heD-oREf40yYDiJlDr0BWXc6r9l5IQLEi_3t4Yl0Y7CV6mWs8zXzdC7l0Er68VErNaoHokHXGbuet1mGYltTFOmiNQO4otumfNXDbTfWoqAwTP34K6FjojR3PUSBoYpZ4QTiGDWmQzzHPVJPNDGFyQ85CPB3i58co3ob-RyKHuB5n1tX2kN56VlLy3JlnQPFryABkAHEtnzMDnf6zfTtxPdtTHPeW62GC_6u7SDEHeE8bwo" },
    { id: "d2", brandName: "Notion", score: 95, status: "Closed", statusColor: "bg-green-100 text-green-800 border-green-200", lastContact: "1 week ago", action: "View Deal", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlPdwWU25hd1-fuFTR9eNFQBTzNfGMmzhuvCTWoMvLA9TktUiPoAVXs48BnEkzoQDa8QACNBUJaUlSUAKvP9ulqKGKWHh2gGbSHdI-AwOrznJTBF9gDuEyJnd19tfYmdTO3nbnd2CgYEt2pKGY1nKDsaEjIFwV_iYbD1wN59lOC9uZrfb3aLhjmtZIRcdFVAn2uhDtXlT_da-VkVfBVHHJuPYV0mizoTX0-hLJlWAsLVjqWmOYYsEmohsDCrz6BI4EeO4DSAHhxbw" },
    { id: "d3", brandName: "Casper", score: 60, status: "Contacted", statusColor: "bg-gray-100 text-gray-800 border-gray-200", lastContact: "Today", action: "Follow Up", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBxlCUPt-E5l6fHYa8sltuRGLl70FIX9yRWfUEafmJbU-9ZrHP-Lnio1s9ToFxWhpICqw5g3ZRQq5wtebFClWaJTUIh1RWQ8xHbGkqdoMFz2dzqyUHKBU7sBeTuGOm25HOfCMpgwagxciNhHwin7reXYbqME6mMAL5K8_5qm_HLn4WEEl1vlgY3qXGU-ogQsPM-sax8LNpfC6xEqFMKspuoAQoNCPppT5Bkw-Le1grqU16PWDr74pP1nvJCtXtmOqX3cov6zh80aI" },
    { id: "d4", brandName: "NordVPN", score: 82, status: "Waiting", statusColor: "bg-amber-100 text-amber-800 border-amber-200", lastContact: "5 days ago", action: "Nudge", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_qAJuv8_fdVnjMpa9DHgDumGRcj3_obsPpUyDvhMZtGlFD3MT4uWfXI6PuOPph2qlbJUSr9M6oFnog9GkoDeN2ahfZIErPwhzzJOETpsQUKu7lzD_Tq1PRWmVM27sgz0_nEejMrIhhzrkG5C-RntQ58XRCtAnb2YTaCeEX9s5jSy_Ecc1fyf6uKfbtFOQuMblUS1_bPV4amR4Ra7xOWiOhnuDv6UdzWKiwv2KQ5-us-iVSGiHNVJKNcITo2CMv11LBuv2MYuWe0I" }
  ];

  // Determine user role and load initial data
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        // Fetch current NextAuth session role
        const sessionRes = await fetch("/api/auth/session");
        if (sessionRes.ok) {
          const session = await sessionRes.json();
          if (session?.user?.role) {
            setRole(session.user.role.toUpperCase() === "CREATOR" ? "CREATOR" : "SPONSOR");
          }
        }

        // Fetch campaigns if database connection is available
        const campaignsRes = await fetch("/api/sponsors/campaigns");
        if (campaignsRes.ok) {
          const data = await campaignsRes.json();
          if (data.campaigns && data.campaigns.length > 0) {
            setCampaigns(data.campaigns);
            setSelectedCampaignId(data.campaigns[0].id);
            return;
          }
        }
        setCampaigns(mockCampaigns);
        setSelectedCampaignId(mockCampaigns[0].id);
      } catch (err) {
        setCampaigns(mockCampaigns);
        setSelectedCampaignId(mockCampaigns[0].id);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Fetch creator matches based on profile embedding (For Creator View)
  useEffect(() => {
    if (role !== "CREATOR") return;
    async function loadCreatorMatches() {
      try {
        const res = await fetch("/api/creator/matches");
        if (res.ok) {
          const data = await res.json();
          if (data.matches && data.matches.length > 0) {
            setCreatorBrands(data.matches);
            return;
          }
        }
        setCreatorBrands(creatorBrandMatches);
      } catch (err) {
        setCreatorBrands(creatorBrandMatches);
      }
    }
    loadCreatorMatches();
  }, [role]);

  // Fetch creator matches based on selected campaign (For Sponsor View)
  useEffect(() => {
    if (!selectedCampaignId || role !== "SPONSOR") return;

    async function loadMatches() {
      setLoading(true);
      setError("");
      try {
        if (selectedCampaignId.startsWith("mock-")) {
          setTimeout(() => {
            setMatches(mockMatches[selectedCampaignId] || []);
            setLoading(false);
          }, 300);
          return;
        }

        const res = await fetch(`/api/sponsors/matches?campaignId=${selectedCampaignId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (err) {
        // Fallback to mock matches if database call fails
        setMatches(mockMatches["mock-1"]);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, [selectedCampaignId, role]);

  // Circular Score Indicator component
  const CircularScore = ({ score }: { score: number }) => (
    <svg className="w-24 h-24" viewBox="0 0 36 36">
      <path
        stroke="#E5E5E5"
        strokeWidth="2.5"
        fill="none"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      ></path>
      <path
        stroke="#fb7800"
        strokeWidth="2.5"
        strokeDasharray={`${score}, 100`}
        strokeLinecap="round"
        fill="none"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      ></path>
      <text x="18" y="20.35" fontFamily="Space Grotesk" fontWeight="700" fontSize="7px" textAnchor="middle" fill="#000">
        {score}%
      </text>
    </svg>
  );

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto w-full pb-32 select-none relative">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="font-display-lg text-[28px] md:text-[32px] font-bold text-primary tracking-tight mb-2">
            {role === "CREATOR" ? "Brand Match Engine" : "Creator Match Engine"}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            {role === "CREATOR"
              ? "AI-driven sponsorship discovery and outreach management designed for high-conversion creator partnerships."
              : "Discover and secure contracts with high-engagement micro-creators matching your campaign specifications."}
          </p>
        </div>

        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-[#EDEDED] border-transparent focus:bg-white focus:border-primary focus:ring-0 rounded-lg font-body-sm text-[13px] text-primary transition-colors placeholder:text-on-surface-variant/50 outline-none"
              placeholder={role === "CREATOR" ? "Search brands..." : "Search niches..."}
              type="text"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <select className="w-full appearance-none pl-4 pr-10 py-2.5 bg-[#EDEDED] border-transparent focus:bg-white focus:border-primary focus:ring-0 rounded-lg font-body-sm text-[13px] text-primary cursor-pointer outline-none">
              <option>All Niche Focuses</option>
              <option>Tech & Gadgets</option>
              <option>Health & Food</option>
              <option>Fitness & Apparel</option>
              <option>Lifestyle</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">expand_more</span>
          </div>
        </div>
      </div>

      {/* DUAL PORTAL RENDER: CREATOR VIEW */}
      {role === "CREATOR" ? (
        <>
          {/* Section: Recommended Brands */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-lg text-[20px] font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fb7800]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                Recommended Brands
              </h3>
              <button className="text-secondary-container font-data-label text-[12px] hover:underline flex items-center gap-1">
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Horizontal Scroll List */}
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
              {(creatorBrands.length > 0 ? creatorBrands : creatorBrandMatches).map((brand) => (
                <div key={brand.id} className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 min-w-[280px] flex-shrink-0 hover:shadow-[0_4px_25px_rgba(0,0,0,0.015)] transition-shadow flex flex-col justify-between gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#f3f3f3] flex items-center justify-center overflow-hidden border border-[#E5E5E5]">
                        <img alt={brand.brandName} className="w-full h-full object-cover" src={brand.img} />
                      </div>
                      <div>
                        <h4 className="font-data-value text-[15px] text-primary font-bold">{brand.brandName}</h4>
                        <span className="font-data-label text-[11px] text-on-surface-variant/60 font-semibold">{brand.industry}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant/40 cursor-pointer hover:text-primary transition-colors">more_horiz</span>
                  </div>

                  <div className="flex flex-col items-center justify-center relative">
                    <CircularScore score={brand.score} />
                    <span className="font-data-label text-[10px] text-on-surface-variant/50 uppercase font-bold tracking-wider mt-2.5">Match Score</span>
                  </div>

                  <button className="w-full bg-transparent border border-[#E5E5E5] text-primary font-body-sm text-[12.5px] font-bold py-2.5 rounded-xl hover:border-primary hover:bg-[#f9f9f9]/20 transition-all">
                    Generate Proposal
                  </button>
                </div>
              ))}

              {/* Discover More Card */}
              <div className="bg-[#f9f9f9] rounded-[20px] p-6 min-w-[200px] flex-shrink-0 border-dashed border-2 border-[#E5E5E5] hover:border-primary cursor-pointer transition-colors flex flex-col justify-center items-center group">
                <div className="w-12 h-12 rounded-full bg-[#f3f3f3] flex items-center justify-center mb-3 group-hover:bg-[#e8e8e8] transition-colors border border-[#E5E5E5]">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">add</span>
                </div>
                <span className="font-data-label text-[12px] text-on-surface-variant group-hover:text-primary font-bold uppercase tracking-wider">Discover More</span>
              </div>
            </div>
          </section>

          {/* Section: Outreach CRM Deals */}
          <section className="space-y-6 mt-12">
            <h3 className="font-headline-lg text-[20px] font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>table_chart</span>
              Outreach Pipeline
            </h3>
            
            <div className="bg-white border border-[#E5E5E5] rounded-[20px] overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f9f9f9]/80 border-b border-[#E5E5E5]/50">
                      <th className="px-6 py-4 font-data-label text-[11px] text-on-surface-variant/50 uppercase tracking-wider font-bold">Brand Partner</th>
                      <th className="px-6 py-4 font-data-label text-[11px] text-on-surface-variant/50 uppercase tracking-wider font-bold">Match Score</th>
                      <th className="px-6 py-4 font-data-label text-[11px] text-on-surface-variant/50 uppercase tracking-wider font-bold">Pipeline Status</th>
                      <th className="px-6 py-4 font-data-label text-[11px] text-on-surface-variant/50 uppercase tracking-wider font-bold">Last Contacted</th>
                      <th className="px-6 py-4 font-data-label text-[11px] text-on-surface-variant/50 uppercase tracking-wider font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-[13px] divide-y divide-[#E5E5E5]/20">
                    {creatorCRMDeals.map((deal) => (
                      <tr key={deal.id} className="hover:bg-[#f9f9f9]/40 transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[#f3f3f3] overflow-hidden border border-[#E5E5E5]/60 shrink-0">
                            <img alt="logo" className="w-full h-full object-cover" src={deal.img} />
                          </div>
                          <span className="font-bold text-primary">{deal.brandName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-data-label text-[12px] font-bold text-primary">{deal.score}%</span>
                            <div className="w-16 h-1.5 bg-[#f3f3f3] rounded-full overflow-hidden border border-[#E5E5E5]/30">
                              <div
                                className="h-full bg-[#fb7800] rounded-full"
                                style={{ width: `${deal.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${deal.statusColor}`}>
                            {deal.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant/60 font-semibold">{deal.lastContact}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-secondary-container hover:text-secondary hover:underline font-bold text-[12.5px] cursor-pointer">
                            {deal.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-[#E5E5E5]/30 flex justify-between items-center text-[12px] text-on-surface-variant/40 font-semibold">
                <span>Showing {creatorCRMDeals.length} deals in pipeline</span>
                <div className="flex gap-2">
                  <button className="p-1 hover:text-primary disabled:opacity-30" disabled>
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button className="p-1 hover:text-primary disabled:opacity-30" disabled>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions Floating buttons (Creator perspective) */}
          <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-30 pointer-events-auto">
            <button className="bg-white border border-[#E5E5E5] text-primary font-bold text-[12px] uppercase tracking-wider px-5 py-3 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-transform flex items-center gap-2 group cursor-pointer">
              <span className="material-symbols-outlined text-[#fb7800] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>track_changes</span>
              Track Deal
            </button>
            <button className="bg-primary text-white font-bold text-[12px] uppercase tracking-wider px-5 py-3 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.12)] hover:scale-[1.02] hover:bg-black/90 transition-all flex items-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">mail</span>
              Generate Pitch Email
            </button>
          </div>
        </>
      ) : (
        /* DUAL PORTAL RENDER: SPONSOR VIEW */
        <>
          {/* Campaign Selector Card */}
          <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/60 mb-2 font-data-label">
              Select Active Campaign Niche
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#EDEDED] border-transparent focus:bg-white focus:border-primary focus:ring-0 rounded-xl font-body-sm text-[13px] text-primary transition-colors cursor-pointer outline-none"
              >
                {campaigns.map((camp) => (
                  <option key={camp.id} value={camp.id}>
                    {camp.title} ({camp.industry} • Budget: ${camp.budget})
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                className="h-10 font-data-label font-bold text-[12px] uppercase tracking-wider"
                onClick={() => setSelectedCampaignId(selectedCampaignId)}
              >
                <span className="material-symbols-outlined text-[18px] mr-1.5">refresh</span> Re-calculate Matches
              </Button>
            </div>
          </div>

          {/* Section: Recommended Creators */}
          <section className="space-y-6 mt-8">
            <div className="flex items-center gap-2 border-b border-[#E5E5E5]/50 pb-3">
              <span className="material-symbols-outlined text-[#fb7800]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              <h3 className="font-headline-lg text-[20px] font-bold text-primary">
                AI pgvector Creator Recommendations ({matches.length})
              </h3>
            </div>

            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 bg-white border border-[#E5E5E5] rounded-[20px]">
                <span className="material-symbols-outlined text-[36px] text-[#fb7800] animate-spin">
                  progress_activity
                </span>
                <span className="text-[13px] text-on-surface-variant font-bold uppercase tracking-wider">Calculating similarity embeddings...</span>
              </div>
            ) : matches.length === 0 ? (
              <div className="py-16 text-center text-on-surface-variant/40 bg-white border border-[#E5E5E5] rounded-[20px] font-semibold text-[14px]">
                No matching creator profiles found for this campaign's target niche.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((creator) => {
                  const scorePercent = Math.round(creator.score * 100);
                  return (
                    <div key={creator.id} className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 flex flex-col justify-between gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-[16px] font-bold text-primary leading-tight">
                            {creator.creatorName}
                          </h4>
                          <a
                            href={`https://instagram.com/${creator.instagramHandle}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[12.5px] text-[#fb7800] font-bold hover:underline mt-1 block"
                          >
                            @{creator.instagramHandle}
                          </a>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#fb7800]/10 text-[#fb7800] text-[11px] font-extrabold tracking-wider border border-[#fb7800]/20">
                            {scorePercent}% Match
                          </span>
                        </div>
                      </div>

                      <div className="inline-flex px-3 py-1 rounded-full bg-[#f3f3f3] border border-[#E5E5E5]/60 text-[11px] font-bold text-on-surface-variant/75 w-fit">
                        Niche Nook: {creator.niche}
                      </div>

                      <p className="text-[13px] text-on-surface-variant/80 leading-relaxed min-h-[40px]">
                        {creator.bio || "No bio details provided by creator."}
                      </p>

                      <div className="grid grid-cols-3 gap-2 bg-[#f3f3f3]/40 p-3.5 rounded-xl border border-[#E5E5E5]/30 text-center">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-on-surface-variant/40 tracking-wider font-data-label">Followers</span>
                          <p className="font-data-label text-[14px] font-bold text-primary mt-0.5">
                            {creator.followerCount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-on-surface-variant/40 tracking-wider font-data-label">Engagement</span>
                          <p className="font-data-label text-[14px] font-bold text-[#fb7800] mt-0.5">
                            {(creator.engagementRate * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-on-surface-variant/40 tracking-wider font-data-label">Avg Views</span>
                          <p className="font-data-label text-[14px] font-bold text-primary mt-0.5">
                            {creator.averageViews.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 border-t border-[#E5E5E5]/30 pt-4 mt-2">
                        <button className="flex-1 py-2 bg-transparent border border-[#E5E5E5] text-primary font-bold text-[12.5px] rounded-xl hover:bg-[#f9f9f9]/20 transition-all flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">close</span> Pass
                        </button>
                        <button className="flex-1 py-2 bg-primary text-white font-bold text-[12.5px] rounded-xl hover:bg-black/90 transition-all flex items-center justify-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-[18px]">handshake</span> Lock Payout Escrow
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
