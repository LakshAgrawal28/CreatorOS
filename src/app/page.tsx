import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-secondary-container/20 overflow-x-hidden">
      {/* Top Navbar */}
      <header className="w-full py-5 px-6 sm:px-12 flex items-center justify-between border-b border-surface-variant/40 bg-surface-container-lowest/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center text-white shadow-lg shadow-secondary-container/20">
            <span className="material-symbols-outlined font-semibold text-[20px]">hub</span>
          </div>
          <div>
            <h1 className="font-display-lg font-extrabold text-[18px] tracking-tight leading-none text-primary">
              CreatorOS
            </h1>
            <span className="text-[9px] uppercase tracking-wider font-bold text-secondary-container leading-none">
              SaaS Marketplace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth/signin">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm">Enter App</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Decorative Grid Backing */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#dadada_1px,transparent_1px),linear-gradient(to_bottom,#dadada_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        {/* Small Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-surface-variant bg-surface-container-lowest text-[12px] font-semibold text-on-surface-variant mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
          <span>Connecting Instagram Micro-Creators & Brands</span>
        </div>

        {/* Title */}
        <h2 className="font-display-lg font-extrabold text-[44px] sm:text-[64px] tracking-tight leading-[1.1] text-primary max-w-4xl mb-6">
          The Operating System for <span className="text-gradient">Sponsorships</span>
        </h2>

        {/* Subtitle */}
        <p className="font-body-md text-on-surface-variant text-[18px] sm:text-[20px] max-w-2xl leading-relaxed mb-10">
          Scale your campaign match rates using Neon pgvector similarity, lock secure payouts via Razorpay Escrow, and automate Instagram data pipelines with Inngest.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mb-16">
          <Link href="/dashboard?role=CREATOR" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Find Brand Sponsorships
            </Button>
          </Link>
          <Link href="/dashboard?role=SPONSOR" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              List Sponsorships
            </Button>
          </Link>
        </div>

        {/* Hero Interactive UI Mockup */}
        <div className="w-full max-w-5xl rounded-2xl border border-surface-variant bg-surface-container-lowest/70 p-4 shadow-2xl shadow-black/10 glass-panel">
          <div className="rounded-xl overflow-hidden border border-surface-variant/75 bg-surface-container-low h-[400px] flex items-center justify-center relative">
            {/* Mock Dashboard Design */}
            <div className="absolute inset-0 grid grid-cols-12 p-6 gap-6">
              {/* Sidebar Mock */}
              <div className="col-span-3 border border-surface-variant bg-surface-container-lowest/80 rounded-xl p-4 flex flex-col gap-4 text-left">
                <div className="w-12 h-3 bg-primary/20 rounded"></div>
                <div className="space-y-2 mt-4">
                  <div className="w-full h-8 bg-surface-container rounded-lg flex items-center px-3 gap-2">
                    <div className="w-4 h-4 bg-primary/30 rounded-full"></div>
                    <div className="w-16 h-2 bg-primary/20 rounded"></div>
                  </div>
                  <div className="w-full h-8 bg-transparent rounded-lg flex items-center px-3 gap-2">
                    <div className="w-4 h-4 bg-primary/10 rounded-full"></div>
                    <div className="w-12 h-2 bg-primary/10 rounded"></div>
                  </div>
                  <div className="w-full h-8 bg-transparent rounded-lg flex items-center px-3 gap-2">
                    <div className="w-4 h-4 bg-primary/10 rounded-full"></div>
                    <div className="w-20 h-2 bg-primary/10 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Main Canvas Mock */}
              <div className="col-span-9 flex flex-col gap-6 text-left">
                {/* Header Mock */}
                <div className="flex justify-between items-center">
                  <div className="w-32 h-4 bg-primary/25 rounded"></div>
                  <div className="w-10 h-10 bg-primary/10 rounded-full"></div>
                </div>

                {/* Metrics Mock */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-surface-variant bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant/40">Total Followers</span>
                    <span className="font-data-value text-2xl font-bold text-primary">4.2K</span>
                  </div>
                  <div className="border border-surface-variant bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant/40">Engagement</span>
                    <span className="font-data-value text-2xl font-bold text-secondary-container">8.6%</span>
                  </div>
                  <div className="border border-surface-variant bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant/40">Total Earnings</span>
                    <span className="font-data-value text-2xl font-bold text-primary">₹72,400</span>
                  </div>
                </div>

                {/* Big Panel Mock */}
                <div className="flex-1 border border-surface-variant bg-surface-container-lowest/60 rounded-xl p-5 flex flex-col gap-3">
                  <div className="w-48 h-3.5 bg-primary/25 rounded"></div>
                  <div className="w-full h-2 bg-primary/10 rounded"></div>
                  <div className="w-full h-2 bg-primary/10 rounded"></div>
                  <div className="w-2/3 h-2 bg-primary/10 rounded"></div>
                </div>
              </div>
            </div>
            {/* Interactive Badge */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <Link href="/dashboard">
                <Button variant="secondary" size="lg" className="shadow-2xl">
                  Launch App Instance
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 px-6 sm:px-12 bg-surface-container-low/50 border-t border-surface-variant/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-display-lg font-bold text-[32px] sm:text-[40px] text-primary tracking-tight mb-4">
              Designed for Scale, Powered by AI
            </h3>
            <p className="font-body-md text-on-surface-variant text-[16px] max-w-xl mx-auto">
              We provide the tools needed to facilitate contracts, ingest data, and manage payouts in one clean interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-surface-variant">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </div>
              <h4 className="text-[18px] font-bold text-primary">AI-Native Matching</h4>
              <p className="text-[14px] text-on-surface-variant leading-relaxed">
                Neon pgvector similarity allows brands to scan creator profile directories, bios, and niche keywords, calculating instantaneous cosine-similarity match scores.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-surface-variant">
                <span className="material-symbols-outlined text-[24px]">shield</span>
              </div>
              <h4 className="text-[18px] font-bold text-primary">Razorpay Escrow holds</h4>
              <p className="text-[14px] text-on-surface-variant leading-relaxed">
                Protects both parties by locking funds in escrow via Razorpay Route. Payout splits are automatically transferred to linked creator banks upon submission approval.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-surface-variant">
                <span className="material-symbols-outlined text-[24px]">sync</span>
              </div>
              <h4 className="text-[18px] font-bold text-primary">Daily Cron Pipelines</h4>
              <p className="text-[14px] text-on-surface-variant leading-relaxed">
                Background synchronization triggers daily via Inngest serverless handlers to fetch Meta Graph API statistics, likes, follower counts, and demographics.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-6 sm:px-12 border-t border-surface-variant/40 bg-surface-container-lowest text-center">
        <p className="text-[12px] text-on-surface-variant/60">
          © {new Date().getFullYear()} CreatorOS. All rights reserved. Built with Lumina Prime Design Guidelines.
        </p>
      </footer>
    </div>
  );
}

