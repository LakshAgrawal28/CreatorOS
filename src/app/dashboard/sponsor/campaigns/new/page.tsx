"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NewCampaignPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("Tech & Gadgets");
  const [budget, setBudget] = useState("");

  // Deliverables
  const [reel, setReel] = useState(true);
  const [story, setStory] = useState(false);
  const [post, setPost] = useState(false);

  // Criteria
  const [minFollowers, setMinFollowers] = useState("1000");
  const [maxFollowers, setMaxFollowers] = useState("50000");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !budget) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const deliverables = [];
    if (reel) deliverables.push("Reel");
    if (story) deliverables.push("Story");
    if (post) deliverables.push("Post");

    try {
      const res = await fetch("/api/sponsors/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          industry,
          budget: Number(budget),
          deliverables,
          creatorCriteria: {
            minFollowers: Number(minFollowers) || 0,
            maxFollowers: Number(maxFollowers) || 10000000,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const campaignId = data.campaign?.id;
        if (campaignId) {
          // Trigger matches calculation by pre-fetching the matches CRM endpoint
          await fetch(`/api/sponsors/matches?campaignId=${campaignId}`);
        }
        router.push("/dashboard/sponsor/matches");
        router.refresh();
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to create campaign. Check your connection.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[700px] mx-auto w-full pb-32 text-[#1a1c1c]">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-[12px] uppercase font-bold text-on-surface-variant hover:text-primary mb-2 transition-colors">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Dashboard
          </Link>
          <h2 className="font-display-lg text-[28px] md:text-[32px] font-bold text-primary tracking-tight">
            Create Sponsorship Campaign
          </h2>
          <p className="font-body-md text-on-surface-variant text-[14px] mt-1.5">
            Launch a new brand brief to trigger dynamic AI creator matches.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-800 text-[13px] font-semibold leading-relaxed flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-bold text-primary uppercase tracking-wider mb-2">Campaign Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wireless ANC Earbuds Review Showcase"
              className="w-full bg-[#f3f3f3]/60 border border-[#E5E5E5] rounded-xl text-[14px] p-3 focus:outline-none focus:bg-white focus:border-primary focus:ring-0 text-[#1a1c1c] transition-all"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-primary uppercase tracking-wider mb-2">Brief & Campaign Description <span className="text-red-500">*</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe what product is being promoted, the core message, key features to showcase, and timeline requirements."
              className="w-full bg-[#f3f3f3]/60 border border-[#E5E5E5] rounded-xl text-[14px] p-3 focus:outline-none focus:bg-white focus:border-primary focus:ring-0 text-[#1a1c1c] resize-none transition-all leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] font-bold text-primary uppercase tracking-wider mb-2">Target Niche <span className="text-red-500">*</span></label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-[#f3f3f3]/60 border border-[#E5E5E5] rounded-xl text-[14px] p-3 focus:outline-none focus:bg-white focus:border-primary text-[#1a1c1c] transition-all"
              >
                <option>Tech & Gadgets</option>
                <option>Fitness & Apparel</option>
                <option>Health & Food</option>
                <option>Lifestyle</option>
                <option>Education</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-primary uppercase tracking-wider mb-2">Budget (USD) <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 font-bold">$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="500"
                  className="w-full pl-8 pr-4 bg-[#f3f3f3]/60 border border-[#E5E5E5] rounded-xl text-[14px] p-3 focus:outline-none focus:bg-white focus:border-primary focus:ring-0 text-[#1a1c1c] transition-all font-semibold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-primary uppercase tracking-wider mb-2">Deliverables Required</label>
            <div className="flex gap-6 mt-3">
              <label className="flex items-center gap-2 cursor-pointer font-body-sm text-[13.5px] font-semibold">
                <input
                  type="checkbox"
                  checked={reel}
                  onChange={(e) => setReel(e.target.checked)}
                  className="rounded text-[#fb7800] focus:ring-[#fb7800] w-4 h-4"
                />
                Instagram Reel
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-body-sm text-[13.5px] font-semibold">
                <input
                  type="checkbox"
                  checked={story}
                  onChange={(e) => setStory(e.target.checked)}
                  className="rounded text-[#fb7800] focus:ring-[#fb7800] w-4 h-4"
                />
                Instagram Story
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-body-sm text-[13.5px] font-semibold">
                <input
                  type="checkbox"
                  checked={post}
                  onChange={(e) => setPost(e.target.checked)}
                  className="rounded text-[#fb7800] focus:ring-[#fb7800] w-4 h-4"
                />
                Standard Post
              </label>
            </div>
          </div>

          <div className="border-t border-[#E5E5E5]/60 pt-6">
            <h3 className="font-data-value text-[14px] font-bold text-primary mb-4">Creator Match Criteria</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-primary uppercase tracking-wider mb-2">Min Followers</label>
                <input
                  type="number"
                  value={minFollowers}
                  onChange={(e) => setMinFollowers(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-[#f3f3f3]/60 border border-[#E5E5E5] rounded-xl text-[14px] p-3 focus:outline-none focus:bg-white focus:border-primary focus:ring-0 text-[#1a1c1c]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-primary uppercase tracking-wider mb-2">Max Followers</label>
                <input
                  type="number"
                  value={maxFollowers}
                  onChange={(e) => setMaxFollowers(e.target.value)}
                  placeholder="100000"
                  className="w-full bg-[#f3f3f3]/60 border border-[#E5E5E5] rounded-xl text-[14px] p-3 focus:outline-none focus:bg-white focus:border-primary focus:ring-0 text-[#1a1c1c]"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fb7800] hover:bg-[#fb7800]/95 text-white py-3.5 rounded-xl font-bold text-[14px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[0.99] active:scale-[0.97] transition-all"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating Campaign...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">campaign</span>
                Launch Brief
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
