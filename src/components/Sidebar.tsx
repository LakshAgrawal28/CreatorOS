"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  userName: string;
  role: string;
  instagramHandle?: string;
}

export default function Sidebar({ userName, role, instagramHandle }: SidebarProps) {
  const pathname = usePathname();

  // Sidebar links based on role
  const creatorLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Trend Pulse", href: "/dashboard/trends", icon: "trending_up" },
    { name: "Content Studio", href: "/dashboard/creator/studio", icon: "edit_note" },
    { name: "Brand Matches", href: "/dashboard/sponsor/matches", icon: "handshake" },
    { name: "Analytics", href: "/dashboard/analytics", icon: "analytics" },
    { name: "Calendar", href: "/dashboard/creator/calendar", icon: "calendar_today" },
    { name: "AI Assistant", href: "/dashboard/assistant", icon: "smart_toy" },
    { name: "Messages", href: "/dashboard/messages", icon: "forum" },
  ];

  const sponsorLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Creator Matches", href: "/dashboard/sponsor/matches", icon: "handshake" },
    { name: "Analytics", href: "/dashboard/analytics", icon: "analytics" },
    { name: "AI Assistant", href: "/dashboard/assistant", icon: "smart_toy" },
    { name: "Messages", href: "/dashboard/messages", icon: "forum" },
  ];

  const links = role === "SPONSOR" ? sponsorLinks : creatorLinks;

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r border-[#E5E5E5] bg-white/70 backdrop-blur-xl h-full shrink-0 relative z-30 justify-between py-6">
      <div className="px-6 flex flex-col gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-lg shadow-black/10">
            <span className="material-symbols-outlined font-semibold text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>hexagon</span>
          </div>
          <div>
            <h1 className="font-display-lg font-extrabold text-[18px] tracking-tight leading-none text-primary">
              CreatorOS
            </h1>
            <span className="font-data-label text-[10px] uppercase tracking-wider font-semibold text-[#fb7800] leading-none mt-1 block">
              Premium Suite
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={role === "SPONSOR" ? "/dashboard/sponsor/matches" : "/dashboard/creator/studio"}>
          <button className="w-full bg-black text-white rounded-xl py-3 px-4 font-bold text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform duration-200 shadow-sm shadow-black/10">
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Project
          </button>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all duration-200 ${
                  active
                    ? "text-primary font-bold border-l-4 border-[#fb7800] bg-[#f3f3f3]/50 scale-[0.98]"
                    : "text-on-surface-variant hover:bg-[#f3f3f3]/30"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    active ? "text-[#fb7800]" : "text-on-surface-variant/80"
                  }`}
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {link.icon}
                </span>
                <span className="font-data-label text-[12px] uppercase tracking-wider">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile section at the bottom */}
      <div className="px-6 border-t border-[#E5E5E5] pt-4">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#f3f3f3]/30 border border-transparent hover:border-[#E5E5E5] transition-all duration-200">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white font-bold text-[13px]">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-[13px] font-bold text-primary truncate leading-tight">
              {userName}
            </h4>
            <p className="text-[10px] text-on-surface-variant/75 truncate mt-0.5 font-semibold">
              {instagramHandle || (role === "SPONSOR" ? "Sponsor" : "Creator")}
            </p>
          </div>
        </div>

        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6] hover:text-[#93000a] transition-all duration-200 mt-3"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-data-label text-[12px] uppercase tracking-wider font-bold">Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
