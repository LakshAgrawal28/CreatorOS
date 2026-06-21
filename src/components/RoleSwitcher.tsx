"use client";

import React, { useState } from "react";

interface RoleSwitcherProps {
  role: string;
}

export default function RoleSwitcher({ role }: RoleSwitcherProps) {
  const [switching, setSwitching] = useState(false);

  const handleToggle = () => {
    if (switching) return;
    setSwitching(true);
    const newRole = role === "CREATOR" ? "SPONSOR" : "CREATOR";
    const newName = newRole === "SPONSOR" ? "Guest Sponsor" : "Guest Creator";

    // Update both cookies so the DB lookup works correctly
    document.cookie = `demo_role=${newRole}; path=/; max-age=86400;`;
    document.cookie = `demo_name=${encodeURIComponent(newName)}; path=/; max-age=86400;`;

    // Force a full page reload to re-run server-side session resolution
    window.location.href = "/dashboard";
  };

  return (
    <button
      onClick={handleToggle}
      disabled={switching}
      title="Click to switch between Creator and Sponsor views"
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-surface-variant bg-surface/50 text-[12px] font-semibold text-primary hover:border-[#fb7800]/50 hover:bg-[#fb7800]/5 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
    >
      <span className={`w-2 h-2 rounded-full bg-secondary-container ${switching ? "animate-ping" : "animate-pulse"}`}></span>
      <span className="capitalize">{role.toLowerCase()} Mode ⇄</span>
    </button>
  );
}
