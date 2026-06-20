import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import Link from "next/link";
import { db } from "@/server/db";
import Sidebar from "@/components/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const user = session.user as any;
  const role = user.role || "CREATOR";
  const userName = user.name || "User";
  const userEmail = user.email || "";

  // Get Creator/Sponsor specific information
  let profileUrl = "/dashboard/settings";
  let instagramHandle = "";
  if (role === "CREATOR") {
    const creator = await db.creatorProfile.findUnique({
      where: { userId: user.id },
    });
    if (creator) {
      instagramHandle = `@${creator.instagramHandle}`;
    }
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <Sidebar userName={userName} role={role} instagramHandle={instagramHandle} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-surface-container-low">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-surface-variant bg-surface-container-lowest/80 backdrop-blur-md relative z-10">
          {/* Search bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant/50 absolute left-3 pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search campaigns, matches, creators..."
                className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-lg border border-surface-variant text-[14px] text-primary focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container transition-all duration-200"
              />
            </div>
          </div>

          {/* Action buttons & User badge */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notification bell */}
            <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface-variant border border-surface-variant transition-colors duration-200">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>

            {/* Quick Portal Switch Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-surface-variant bg-surface/50 text-[12px] font-semibold text-primary">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
              <span className="capitalize">{role.toLowerCase()} Mode</span>
            </div>
          </div>
        </header>

        {/* Viewport Canvas scroll container */}
        <main className="flex-1 overflow-y-auto px-6 py-8 relative">
          <div className="max-w-[1200px] mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
