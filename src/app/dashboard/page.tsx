import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function DashboardPage() {
  let session: any = await getServerSession(authOptions);

  if (!session || !session.user) {
    // Fallback for Vercel NextAuth edge cookie dropping
    const { cookies } = await import("next/headers");
    const demoRole = cookies().get("demo_role")?.value;
    const demoName = cookies().get("demo_name")?.value;
    
    if (demoRole) {
      session = {
        user: { id: "guest-user-id", name: decodeURIComponent(demoName || "Guest"), email: "guest@creatoros.com", role: demoRole }
      };
    } else {
      redirect("/auth/signin");
    }
  }

  const user = session.user as any;
  const role = user.role || "CREATOR";
  const userName = user.name || "User";

  // Attempt to fetch creator specific records from database
  let creatorProfile = null;
  let activeApplications: any[] = [];
  let matchingCampaigns: any[] = [];
  let upcomingPosts: any[] = [];

  if (role === "CREATOR") {
    creatorProfile = await db.creatorProfile.findUnique({
      where: { userId: user.id },
    });

    if (creatorProfile) {
      activeApplications = await db.application.findMany({
        where: { creatorProfileId: creatorProfile.id },
        include: { campaign: true },
        take: 5,
      });

      // Retrieve cached matches order by match score
      matchingCampaigns = await db.match.findMany({
        where: { creatorProfileId: creatorProfile.id },
        include: { campaign: { include: { sponsor: true } } },
        orderBy: { matchScore: "desc" },
        take: 3,
      });

      // Retrieve content calendar items
      upcomingPosts = await db.contentItem.findMany({
        where: { creatorProfileId: creatorProfile.id },
        orderBy: { scheduledAt: "asc" },
        take: 2,
      });
    }
  }

  // Attempt to fetch sponsor specific records from database
  let sponsorProfile = null;
  let sponsorCampaigns: any[] = [];

  if (role === "SPONSOR") {
    sponsorProfile = await db.sponsorProfile.findUnique({
      where: { userId: user.id },
    });

    if (sponsorProfile) {
      sponsorCampaigns = await db.campaign.findMany({
        where: { sponsorId: sponsorProfile.id },
        include: { applications: true },
        take: 5,
      });
    }
  }

  return (
    <div className="space-y-8 animate-fade-in text-[#1a1c1c]">
      {/* Header Greeting */}
      <section className="flex flex-col gap-3 md:flex-row md:items-end justify-between border-b border-[#E5E5E5]/50 pb-6">
        <div>
          <h2 className="font-display-lg text-[28px] sm:text-[32px] font-bold text-primary tracking-tight leading-tight">
            Good Evening, {userName} 👋
          </h2>
          <p className="font-body-md text-on-surface-variant text-[14px] mt-1">
            Here is your performance snapshot and sponsorship feed for today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {role === "CREATOR" ? (
            <>
              <Link href="/dashboard/creator/studio">
                <Button variant="primary" size="sm">Generate Script</Button>
              </Link>
              <Link href="/dashboard/trends">
                <Button variant="outline" size="sm">View Trends</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard/sponsor/campaigns/new">
                <Button variant="primary" size="sm">Create Campaign</Button>
              </Link>
              <Link href="/dashboard/sponsor/matches">
                <Button variant="outline" size="sm">Match CRM</Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Render Role-Specific Views */}
      {role === "CREATOR" ? (
        <CreatorDashboardView
          profile={creatorProfile}
          applications={activeApplications}
          matches={matchingCampaigns}
          posts={upcomingPosts}
        />
      ) : (
        <SponsorDashboardView
          profile={sponsorProfile}
          campaigns={sponsorCampaigns}
        />
      )}
    </div>
  );
}

/* ==========================================================================
   CREATOR PORTAL VIEW
   ========================================================================== */
interface CreatorViewProps {
  profile: any;
  applications: any[];
  matches: any[];
  posts: any[];
}

function CreatorDashboardView({ profile, applications, matches, posts }: CreatorViewProps) {
  // Safe Fallback metrics if Instagram Graph API not connected yet
  const followerCount = profile?.followerCount || 4250;
  const engagementRate = profile?.engagementRate ? `${(profile.engagementRate * 100).toFixed(1)}%` : "8.7%";
  const averageLikes = profile?.averageLikes || 356;
  const averageViews = profile?.averageViews || 1420;
  const hasRazorpay = !!profile?.razorpayRouteId;

  // Real or mock brand matches
  const displayMatches = matches.length > 0 ? matches.map(m => ({
    id: m.campaign.id,
    title: m.campaign.title,
    sponsorName: m.campaign.sponsor.companyName,
    budget: `₹${(m.campaign.budget * 85).toLocaleString()}`,
    matchScore: `${Math.round(m.matchScore * 100)}%`,
    niche: m.campaign.industry,
  })) : [
    { id: "1", title: "Premium Wireless Earbuds Review", sponsorName: "Boat Labs", budget: "₹12,500", matchScore: "94%", niche: "Tech & Gadgets" },
    { id: "2", title: "Summer Activewear Promo", sponsorName: "Noise Fit", budget: "₹8,000", matchScore: "88%", niche: "Fitness & Lifestyle" },
    { id: "3", title: "Eco-Friendly Drinkware Campaign", sponsorName: "Skillshare", budget: "₹5,200", matchScore: "75%", niche: "Education" },
  ];

  // Active deliverables / contracts
  const displayDeliverables = applications.length > 0 ? applications.map(app => ({
    id: app.id,
    campaignTitle: app.campaign.title,
    status: app.status,
    action: app.status === "APPROVED" ? "Asset Upload Required" : "Awaiting Verification",
  })) : [
    { id: "d1", campaignTitle: "Urban Casual Wear Lookbook", status: "APPROVED", action: "Submit Reel draft" },
    { id: "d2", campaignTitle: "Proteins & Shaker Launch", status: "NEGOTIATING", action: "Negotiate budget" },
    { id: "d3", campaignTitle: "Custom Leather Phone Cases", status: "APPLIED", action: "Awaiting Brand Review" },
  ];

  // Upcoming Posts
  const displayPosts = posts.length > 0 ? posts.map(p => ({
    id: p.id,
    title: p.title,
    platform: p.platform,
    time: new Date(p.scheduledAt).toLocaleString("en-US", { weekday: 'long', hour: 'numeric', minute: '2-digit' }),
    type: p.format,
  })) : [
    { id: "post-1", title: "Setup Tour Reel", platform: "Instagram", time: "Today, 6:00 PM", type: "reels" },
    { id: "post-2", title: "Q3 Review Thread", platform: "Twitter", time: "Tomorrow, 9:00 AM", type: "article" },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Cards Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Trend Score */}
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <span className="font-data-label text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Trend Score</span>
            <span className="material-symbols-outlined text-[#fb7800] text-[20px]">local_fire_department</span>
          </div>
          <div className="mt-4">
            <div className="font-data-value text-[32px] leading-none font-bold text-primary">94.2</div>
            <div className="font-body-sm text-[12px] text-green-700 font-semibold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 12% vs last week
            </div>
          </div>
        </div>

        {/* Follower Growth */}
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <span className="font-data-label text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Followers</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">group_add</span>
          </div>
          <div className="mt-4">
            <div className="font-data-value text-[32px] leading-none font-bold text-primary">
              {followerCount >= 1000 ? `${(followerCount / 1000).toFixed(1)}k` : followerCount}
            </div>
            <div className="font-body-sm text-[12px] text-green-700 font-semibold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 4.1% MoM growth
            </div>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <span className="font-data-label text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Engagement</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">favorite</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="font-data-value text-[32px] leading-none font-bold text-primary">{engagementRate}</div>
              <div className="font-body-sm text-[12px] text-on-surface-variant/70 mt-2">Across posts</div>
            </div>
            {/* Circle loader mockup */}
            <div className="w-10 h-10 rounded-full border-4 border-[#eeeeee] border-t-[#fb7800] animate-spin-slow"></div>
          </div>
        </div>

        {/* Brand Opportunities */}
        <div className="bg-gradient-to-br from-white to-[#fb7800]/5 border border-[#E5E5E5] rounded-[20px] p-6 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <span className="font-data-label text-[12px] font-semibold text-[#fb7800] uppercase tracking-wider">Brand Opps</span>
            <span className="material-symbols-outlined text-[#fb7800] text-[20px]">campaign</span>
          </div>
          <div className="mt-4">
            <div className="font-data-value text-[32px] leading-none font-bold text-primary">
              {displayMatches.length}
            </div>
            <div className="font-body-sm text-[12px] text-on-surface-variant/70 mt-2">Pending matches</div>
          </div>
          <Link href="/dashboard/sponsor/matches" className="mt-4 w-full">
            <button className="w-full bg-[#f3f3f3] hover:bg-[#e8e8e8] text-primary py-2 rounded-lg font-data-label text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200">
              Review Matches
            </button>
          </Link>
        </div>
      </section>

      {/* Main Grid: Weekly Performance & Best posting time */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Performance Graph */}
        <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-[20px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-data-value text-[16px] font-bold text-primary">Weekly Performance</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded bg-[#fb7800]/10 text-[#fb7800] font-data-label text-[9px] uppercase font-bold">Views</span>
              <span className="px-2 py-1 rounded bg-[#f3f3f3] text-on-surface-variant font-data-label text-[9px] uppercase font-bold">Likes</span>
            </div>
          </div>
          <div className="flex-1 w-full h-48 relative border-b border-l border-[#c4c7c7]/30">
            {/* Simulated Spline Graph using SVG */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fb7800" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,80 Q10,70 20,85 T40,60 T60,75 T80,30 T100,45 L100,100 L0,100 Z" fill="url(#chartGrad)"></path>
              <path d="M0,80 Q10,70 20,85 T40,60 T60,75 T80,30 T100,45" fill="none" stroke="#fb7800" strokeWidth="2.5" vectorEffect="non-scaling-stroke"></path>
            </svg>
          </div>
        </div>

        {/* Best Posting Times Heatmap */}
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col">
          <h3 className="font-data-value text-[16px] font-bold text-primary mb-4">Best Posting Times</h3>
          <div className="grid grid-cols-4 gap-2 flex-1 min-h-[190px]">
            <div className="bg-[#f3f3f3] rounded flex items-center justify-center font-data-label text-[10px] text-on-surface-variant font-semibold">9 AM</div>
            <div className="bg-[#fb7800]/20 rounded flex items-center justify-center font-data-label text-[10px] text-[#fb7800] font-bold">12 PM</div>
            <div className="bg-[#f3f3f3] rounded flex items-center justify-center font-data-label text-[10px] text-on-surface-variant font-semibold">3 PM</div>
            <div className="bg-[#fb7800]/80 rounded flex items-center justify-center font-data-label text-[10px] text-white font-bold">6 PM</div>
            <div className="bg-[#f3f3f3] rounded flex items-center justify-center font-data-label text-[10px] text-on-surface-variant font-semibold">Mon</div>
            <div className="bg-[#fb7800]/40 rounded flex items-center justify-center font-data-label text-[10px] text-[#fb7800] font-bold">Tue</div>
            <div className="bg-[#f3f3f3] rounded flex items-center justify-center font-data-label text-[10px] text-on-surface-variant font-semibold">Wed</div>
            <div className="bg-[#fb7800]/60 rounded flex items-center justify-center font-data-label text-[10px] text-white font-bold">Thu</div>
            <div className="bg-[#f3f3f3] rounded flex items-center justify-center font-data-label text-[10px] text-on-surface-variant font-semibold">Fri</div>
            <div className="bg-[#fb7800]/90 rounded flex items-center justify-center font-data-label text-[10px] text-white font-bold">Sat</div>
            <div className="bg-[#fb7800]/70 rounded flex items-center justify-center font-data-label text-[10px] text-white font-bold">Sun</div>
            <div className="bg-[#f3f3f3] rounded flex items-center justify-center font-data-label text-[10px] text-on-surface-variant font-semibold">-</div>
          </div>
        </div>
      </section>

      {/* Grid: Top Reel & Upcoming Posts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top performing Reel */}
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex gap-6 items-center">
          <div className="w-28 h-36 rounded-lg overflow-hidden flex-shrink-0 bg-[#f3f3f3] relative border border-[#E5E5E5]">
            <img
              alt="Reel thumbnail"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
              <span className="material-symbols-outlined text-white text-[16px]">play_arrow</span>
            </div>
          </div>
          <div className="flex flex-col justify-center flex-1">
            <span className="font-data-label text-[10px] font-bold text-[#fb7800] uppercase mb-1 tracking-wider">Top Reel Performance</span>
            <h4 className="font-data-value text-[18px] leading-tight font-extrabold text-primary mb-2">My Top 5 Design Tools in 2024</h4>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant/70">visibility</span>
                <span className="font-data-label text-[12px] font-semibold">1.2M</span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant/70">favorite</span>
                <span className="font-data-label text-[12px] font-semibold">84K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Posts Calendar */}
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <h3 className="font-data-value text-[16px] font-bold text-primary mb-4">Upcoming Schedule</h3>
          <div className="flex flex-col gap-3">
            {displayPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f3f3f3]/50 border border-transparent hover:border-[#E5E5E5] transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">
                      {post.type === "reels" ? "movie" : post.type === "video" ? "smart_display" : "article"}
                    </span>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-primary">{post.title}</div>
                    <div className="font-data-label text-[11px] text-on-surface-variant/75 mt-0.5 uppercase tracking-wide">
                      {post.platform} • {post.time}
                    </div>
                  </div>
                </div>
                <button className="text-on-surface-variant/60 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Escrow table & setup alert */}
      <section className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-[#E5E5E5]/60 pb-4 mb-4">
            <h3 className="font-display-lg font-bold text-[18px] text-primary">Active Escrow Contracts</h3>
            <span className="text-[10px] font-bold text-[#fb7800] uppercase tracking-widest bg-[#fb7800]/10 px-2.5 py-1 rounded-full">
              Razorpay Secured
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E5E5]/60">
                  <th className="pb-3 text-[11px] uppercase tracking-wider text-on-surface-variant/50 font-bold">Campaign</th>
                  <th className="pb-3 text-[11px] uppercase tracking-wider text-on-surface-variant/50 font-bold">Status</th>
                  <th className="pb-3 text-[11px] uppercase tracking-wider text-on-surface-variant/50 font-bold text-right">Required Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]/30">
                {displayDeliverables.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f3f3f3]/20 transition-colors">
                    <td className="py-4 text-[14px] font-bold text-primary">{item.campaignTitle}</td>
                    <td className="py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        item.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : item.status === "NEGOTIATING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-[13px] text-on-surface-variant text-right font-semibold">{item.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Setup warnings */}
        {!hasRazorpay && (
          <div className="rounded-[20px] border border-[#fb7800]/20 bg-[#fb7800]/5 p-6 flex flex-col sm:flex-row items-start gap-4">
            <span className="material-symbols-outlined text-[#fb7800] text-[24px] shrink-0">info</span>
            <div>
              <h4 className="text-[15px] font-bold text-primary">Setup Razorpay Payouts Account</h4>
              <p className="text-[13px] text-on-surface-variant mt-1 leading-relaxed max-w-2xl">
                Connect your bank account to enable platform escrow releases. Brands require connected payouts accounts to initiate contract deposits.
              </p>
              <Link href="/dashboard/creator/payouts" className="mt-4 inline-block">
                <Button variant="secondary" size="sm">Setup Route Now</Button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ==========================================================================
   SPONSOR PORTAL VIEW
   ========================================================================== */
interface SponsorViewProps {
  profile: any;
  campaigns: any[];
}

function SponsorDashboardView({ profile, campaigns }: SponsorViewProps) {
  // Fallbacks if sponsor has no campaigns yet
  const totalCampaigns = campaigns.length || 3;
  const pendingEscrows = campaigns.length ? campaigns.reduce((acc, c) => acc + (c.status === "ACTIVE" ? 1 : 0), 0) : 1;
  const spentAmount = campaigns.length ? campaigns.reduce((acc, c) => acc + c.budget, 0) : 850; // In USD

  // Mock campaigns if db is empty
  const displayCampaigns = campaigns.length > 0 ? campaigns.map(c => ({
    id: c.id,
    title: c.title,
    budget: `₹${(c.budget * 85).toLocaleString()}`,
    status: c.status,
    applicationsCount: c.applications?.length || 0,
  })) : [
    { id: "sc1", title: "Wireless Over-Ear ANC Headphones Launch", budget: "₹42,500", status: "ACTIVE", applicationsCount: 4 },
    { id: "sc2", title: "Organic Green Teas Influencer Campaign", budget: "₹18,000", status: "ACTIVE", applicationsCount: 2 },
    { id: "sc3", title: "Smart Thermostat Installation Series", budget: "₹25,500", status: "DRAFT", applicationsCount: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <span className="font-data-label text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Active Campaigns</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">campaign</span>
          </div>
          <div className="mt-4">
            <span className="font-data-value text-[32px] leading-none font-bold text-primary">
              {totalCampaigns}
            </span>
            <div className="font-body-sm text-[12px] text-on-surface-variant/70 mt-2">
              Listed on platform
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <span className="font-data-label text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Total Spent (USD)</span>
            <span className="material-symbols-outlined text-[#fb7800] text-[20px]">payments</span>
          </div>
          <div className="mt-4">
            <span className="font-data-value text-[32px] leading-none font-bold text-[#fb7800]">
              ${spentAmount.toLocaleString()}
            </span>
            <div className="font-body-sm text-[12px] text-on-surface-variant/70 mt-2">
              Approx. ₹{(spentAmount * 85).toLocaleString()} INR
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-start">
            <span className="font-data-label text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Escrow Holds</span>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
          </div>
          <div className="mt-4">
            <span className="font-data-value text-[32px] leading-none font-bold text-primary">
              {pendingEscrows}
            </span>
            <div className="font-body-sm text-[12px] text-green-700 font-semibold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span> Active escrow security
            </div>
          </div>
        </Card>
      </div>

      {/* Main Panel - Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-[#E5E5E5]/60 pb-4 mb-4">
              <h3 className="font-display-lg font-bold text-[18px] text-primary">Your Listed Campaigns</h3>
              <Link href="/dashboard/sponsor/campaigns/new">
                <Button variant="outline" size="sm">New Campaign</Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E5E5]/60">
                    <th className="pb-3 text-[11px] uppercase tracking-wider text-on-surface-variant/50 font-bold">Campaign Title</th>
                    <th className="pb-3 text-[11px] uppercase tracking-wider text-on-surface-variant/50 font-bold">Agreed Budget</th>
                    <th className="pb-3 text-[11px] uppercase tracking-wider text-on-surface-variant/50 font-bold">Applicants</th>
                    <th className="pb-3 text-[11px] uppercase tracking-wider text-on-surface-variant/50 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]/30">
                  {displayCampaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-[#f3f3f3]/20 transition-colors">
                      <td className="py-4 text-[14px] font-bold text-primary">
                        <Link href={`/dashboard/sponsor/campaigns/${camp.id}`} className="hover:underline">
                          {camp.title}
                        </Link>
                      </td>
                      <td className="py-4 text-[13px] font-semibold text-primary">{camp.budget}</td>
                      <td className="py-4 text-[13px] text-on-surface-variant">{camp.applicationsCount} Creators</td>
                      <td className="py-4 text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                          camp.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-zinc-100 text-zinc-800"
                        }`}>
                          {camp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Panel - Matching recommendations */}
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between border-b border-[#E5E5E5]/60 pb-4 mb-4">
              <h3 className="font-display-lg font-bold text-[18px] text-primary">Quick Match CRM</h3>
              <span className="material-symbols-outlined text-[#fb7800]">account_circle</span>
            </div>

            {/* Quick list of recommended profiles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9]/50 hover:border-[#fb7800]/30 transition-colors">
                <div>
                  <h4 className="text-[13px] font-bold text-primary">@rahul_tech</h4>
                  <p className="text-[11px] text-on-surface-variant/75 mt-0.5">Niche: Tech | 4.8K Follows</p>
                </div>
                <Link href="/dashboard/sponsor/matches">
                  <Button variant="outline" size="sm" className="h-8 py-0 px-3">View</Button>
                </Link>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9]/50 hover:border-[#fb7800]/30 transition-colors">
                <div>
                  <h4 className="text-[13px] font-bold text-primary">@priya_fitlife</h4>
                  <p className="text-[11px] text-on-surface-variant/75 mt-0.5">Niche: Fitness | 3.2K Follows</p>
                </div>
                <Link href="/dashboard/sponsor/matches">
                  <Button variant="outline" size="sm" className="h-8 py-0 px-3">View</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
