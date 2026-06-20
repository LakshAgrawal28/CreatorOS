"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  format: string;
  status: "Idea" | "Production" | "Review" | "Scheduled";
  scheduledAt: string; // "yyyy-mm-dd" format
}

export default function ContentCalendarPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newPlatform, setNewPlatform] = useState<string>("Instagram");
  const [newFormat, setNewFormat] = useState<string>("Reel");
  const [newStatus, setNewStatus] = useState<"Idea" | "Production" | "Review" | "Scheduled">("Idea");
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState<boolean>(false);

  // Calendar navigation state (defaulting to October 2023 for mockup parity or current month)
  const [navDate, setNavDate] = useState<Date>(new Date(2023, 9, 1)); // October 2023

  // High-fidelity Mock Content Items for Fallback Demo
  const mockItems: ContentItem[] = [
    {
      id: "item-1",
      title: "Weekly VLOG tour and setups",
      platform: "YouTube",
      format: "Video",
      status: "Production",
      scheduledAt: "2023-10-02",
    },
    {
      id: "item-2",
      title: "Tech Review: Wireless Audio Buds",
      platform: "Instagram",
      format: "Reel",
      status: "Scheduled",
      scheduledAt: "2023-10-04",
    },
    {
      id: "item-3",
      title: "Design System Setup (Part 1)",
      platform: "Instagram",
      format: "Reel",
      status: "Scheduled",
      scheduledAt: "2023-10-11",
    },
    {
      id: "item-4",
      title: "Design System Newsletter",
      platform: "Instagram",
      format: "Post",
      status: "Review",
      scheduledAt: "2023-10-11",
    },
    {
      id: "item-5",
      title: "My new desk setup tour 2024",
      platform: "YouTube",
      format: "Video",
      status: "Idea",
      scheduledAt: "2023-10-18",
    },
    {
      id: "item-6",
      title: "Top 5 Productivity Apps",
      platform: "Instagram",
      format: "Reel",
      status: "Production",
      scheduledAt: "2023-10-15",
    },
  ];

  useEffect(() => {
    // Load content items from database or fallback to mock
    async function loadItems() {
      setLoading(true);
      try {
        const res = await fetch("/api/creator/content");
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            // Map ISO dates back to YYYY-MM-DD
            const formatted = data.items.map((i: any) => ({
              ...i,
              status: ["Idea", "Production", "Review", "Scheduled"].includes(i.status) ? i.status : "Idea",
              scheduledAt: i.scheduledAt ? i.scheduledAt.split("T")[0] : new Date().toISOString().split("T")[0]
            }));
            setItems(formatted);
            return;
          }
        }
        setItems(mockItems);
      } catch (err) {
        setItems(mockItems);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, []);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem: ContentItem = {
      id: `item-${Date.now()}`,
      title: newTitle,
      platform: newPlatform,
      format: newFormat,
      status: newStatus,
      scheduledAt: newDate,
    };

    // Update state locally
    setItems((prev) => [...prev, newItem]);
    setNewTitle("");

    // POST to DB
    try {
      await fetch("/api/creator/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newItem,
          scheduledAt: new Date(newItem.scheduledAt).toISOString()
        }),
      });
    } catch (e) {
      console.warn("Prisma sync skipped (offline or database sandbox mode).");
    }
  };

  const moveStatus = (itemId: string, nextStatus: "Idea" | "Production" | "Review" | "Scheduled") => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: nextStatus } : item))
    );
  };

  // Helper to generate calendar grids
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysCount };
  };

  const { firstDay, daysCount } = getDaysInMonth(navDate);
  const calendarCells = [];

  // Blank padding cells for start of month
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push({ day: null, dateStr: null });
  }

  // Days cells
  for (let i = 1; i <= daysCount; i++) {
    const year = navDate.getFullYear();
    const month = String(navDate.getMonth() + 1).padStart(2, "0");
    const day = String(i).padStart(2, "0");
    calendarCells.push({
      day: i,
      dateStr: `${year}-${month}-${day}`
    });
  }

  // Month navigation helpers
  const prevMonth = () => {
    setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() + 1, 1));
  };
  const setToday = () => {
    setNavDate(new Date(2023, 9, 1)); // October 2023 default, or new Date()
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto w-full pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="font-display-lg text-[28px] md:text-[32px] font-bold text-primary tracking-tight leading-tight">
            Content Pipeline
          </h2>
          <p className="font-body-sm text-[14px] text-on-surface-variant mt-1">
            Plan, script, and schedule campaign deliverables.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 border border-[#E5E5E5] rounded-xl text-primary font-data-label text-[12px] font-bold hover:bg-[#f3f3f3]/40 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
          </button>
        </div>
      </div>

      {/* Main Grid: Left is Calendar & Kanban; Right is Quick Add Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Calendar & Kanban */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Calendar Section Card */}
          <section className="bg-white rounded-[20px] border border-[#E5E5E5] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col gap-6">
            
            {/* Calendar Controls */}
            <div className="flex justify-between items-center">
              <h3 className="font-headline-lg text-[20px] font-bold text-primary">
                {monthNames[navDate.getMonth()]} {navDate.getFullYear()}
              </h3>
              <div className="flex items-center gap-1.5 bg-[#f3f3f3] rounded-lg p-1">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-on-surface-variant cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] block">chevron_left</span>
                </button>
                <button
                  onClick={setToday}
                  className="px-3.5 py-1 font-data-label text-[11px] text-primary font-bold hover:bg-white hover:shadow-sm rounded-md transition-all cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-on-surface-variant cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] block">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Calendar Month Grid */}
            <div className="grid grid-cols-7 gap-px bg-[#E5E5E5]/40 rounded-xl overflow-hidden border border-[#E5E5E5]/40">
              
              {/* Day names */}
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div key={day} className="bg-[#f9f9f9] py-3 text-center font-data-label text-[10px] font-bold text-on-surface-variant/60 tracking-wider">
                  {day}
                </div>
              ))}

              {/* Date cells */}
              {calendarCells.map((cell, idx) => {
                const cellItems = cell.dateStr ? items.filter((i) => i.scheduledAt === cell.dateStr) : [];
                return (
                  <div
                    key={idx}
                    className={`bg-white min-h-[90px] p-2.5 flex flex-col gap-1 border-t border-r border-[#E5E5E5]/20 ${
                      cell.day ? "" : "bg-[#f9f9f9]/20"
                    }`}
                  >
                    {cell.day && (
                      <span className={`font-data-value text-[12px] font-bold ${
                        cell.dateStr === new Date().toISOString().split("T")[0]
                          ? "text-[#fb7800]"
                          : "text-on-surface-variant/60"
                      }`}>
                        {cell.day}
                      </span>
                    )}

                    {/* Render Deliverables on cell */}
                    {cellItems.map((item) => {
                      const isScheduled = item.status === "Scheduled";
                      const isReview = item.status === "Review";
                      return (
                        <div
                          key={item.id}
                          className={`text-[9.5px] px-2 py-0.5 rounded border font-data-label truncate flex items-center gap-1 ${
                            isScheduled
                              ? "bg-green-50 text-green-700 border-green-100"
                              : isReview
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : "bg-[#fb7800]/5 text-[#fb7800] border-[#fb7800]/10"
                          }`}
                          title={item.title}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isScheduled ? "bg-green-600" : isReview ? "bg-blue-600" : "bg-[#fb7800]"
                          }`}></span>
                          {item.title}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Kanban Section */}
          <section className="flex flex-col gap-4">
            <h3 className="font-headline-lg text-[22px] font-bold text-primary">Workflow Pipeline</h3>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              
              {/* Kanban Columns */}
              {(["Idea", "Production", "Review", "Scheduled"] as const).map((colStatus) => {
                const colItems = items.filter((i) => i.status === colStatus);
                const colHeaderNames = {
                  Idea: "Ideas",
                  Production: "Writing & Production",
                  Review: "Under Review",
                  Scheduled: "Scheduled & Active"
                };

                return (
                  <div key={colStatus} className="min-w-[270px] flex-1 flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5]/60">
                      <span className="font-data-label text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-wider">
                        {colHeaderNames[colStatus]}
                      </span>
                      <span className="bg-[#f3f3f3] text-primary text-[10px] px-2 py-0.5 rounded-full font-data-value font-bold border border-[#E5E5E5]/30">
                        {colItems.length}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3 min-h-[220px]">
                      {colItems.map((item) => {
                        const statusColors = {
                          Idea: "bg-[#f3f3f3] text-on-surface-variant border-[#E5E5E5]/40",
                          Production: "bg-[#fb7800]/10 text-[#fb7800] border-[#fb7800]/20",
                          Review: "bg-blue-50 text-blue-700 border-blue-100",
                          Scheduled: "bg-green-50 text-green-700 border-green-100"
                        };
                        const platformIcons = {
                          Instagram: "play_circle",
                          YouTube: "video_library",
                          TikTok: "music_note",
                          Twitter: "alternate_email"
                        };

                        return (
                          <div
                            key={item.id}
                            className="bg-white p-4 rounded-xl border border-[#E5E5E5] shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-3 hover:border-primary/30 transition-colors cursor-pointer group"
                          >
                            <div className="flex justify-between items-start">
                              <span className={`text-[9.5px] px-2 py-0.5 rounded font-data-label uppercase tracking-wider border ${
                                statusColors[colStatus]
                              }`}>
                                {colStatus === "Production" ? "In Progress" : colStatus}
                              </span>
                              <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40 hover:text-primary transition-colors">
                                more_horiz
                              </span>
                            </div>

                            <h4 className="font-body-sm text-[13px] font-medium text-primary leading-snug">
                              {item.title}
                            </h4>

                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E5E5]/30">
                              <div className="flex items-center gap-1.5">
                                <span className="w-6 h-6 rounded-full bg-[#f9f9f9] border border-[#E5E5E5]/50 flex items-center justify-center text-primary/60">
                                  <span className="material-symbols-outlined text-[13px]">
                                    {(platformIcons as any)[item.platform] || "article"}
                                  </span>
                                </span>
                                <span className="font-data-label text-[10.5px] text-on-surface-variant font-bold">
                                  {item.platform}
                                </span>
                              </div>
                              <span className="text-[11px] text-on-surface-variant/50 font-semibold font-data-label">
                                {item.scheduledAt}
                              </span>
                            </div>

                            {/* Chevron Controls to shift status */}
                            <div className="flex items-center justify-between border-t border-[#E5E5E5]/20 pt-2.5 mt-1">
                              {colStatus !== "Idea" && (
                                <button
                                  onClick={() => {
                                    const steps: Record<string, "Idea" | "Production" | "Review" | "Scheduled"> = {
                                      Production: "Idea",
                                      Review: "Production",
                                      Scheduled: "Review",
                                    };
                                    moveStatus(item.id, steps[colStatus]);
                                  }}
                                  className="p-1 hover:bg-[#f3f3f3] rounded transition-colors text-on-surface-variant/65 flex items-center justify-center cursor-pointer"
                                  title="Move Left"
                                >
                                  <span className="material-symbols-outlined text-[15px] font-bold">chevron_left</span>
                                </button>
                              )}
                              <div className="flex-1"></div>
                              {colStatus !== "Scheduled" && (
                                <button
                                  onClick={() => {
                                    const steps: Record<string, "Idea" | "Production" | "Review" | "Scheduled"> = {
                                      Idea: "Production",
                                      Production: "Review",
                                      Review: "Scheduled",
                                    };
                                    moveStatus(item.id, steps[colStatus]);
                                  }}
                                  className="p-1 hover:bg-[#f3f3f3] rounded transition-colors text-on-surface-variant/65 flex items-center justify-center cursor-pointer"
                                  title="Move Right"
                                >
                                  <span className="material-symbols-outlined text-[15px] font-bold">chevron_right</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {colItems.length === 0 && (
                        <div className="h-24 rounded-xl border border-dashed border-[#E5E5E5] flex items-center justify-center text-on-surface-variant/40 font-body-sm text-[12px]">
                          Drop items here
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Action Form */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-[15px] font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[#fb7800]">add_task</span> Add Schedule
            </h3>
            
            <form onSubmit={handleCreateItem} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 mb-1 font-data-label">
                  Deliverable Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Setup tour Reels video"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#EDEDED] border-transparent focus:bg-white focus:border-primary focus:ring-0 rounded-xl font-body-sm text-[13px] text-primary transition-colors outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 mb-1 font-data-label">
                    Platform
                  </label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#EDEDED] border-transparent focus:bg-white focus:border-primary focus:ring-0 rounded-xl font-body-sm text-[13px] text-primary cursor-pointer transition-colors outline-none"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Twitter">Twitter/X</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 mb-1 font-data-label">
                    Format
                  </label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#EDEDED] border-transparent focus:bg-white focus:border-primary focus:ring-0 rounded-xl font-body-sm text-[13px] text-primary cursor-pointer transition-colors outline-none"
                  >
                    <option value="Reel">Reel</option>
                    <option value="Video">Video</option>
                    <option value="Story">Story</option>
                    <option value="Post">Post</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 mb-1 font-data-label">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#EDEDED] border-transparent focus:bg-white focus:border-primary focus:ring-0 rounded-xl font-body-sm text-[13px] text-primary transition-colors outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60 mb-1 font-data-label">
                  Initial Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#EDEDED] border-transparent focus:bg-white focus:border-primary focus:ring-0 rounded-xl font-body-sm text-[13px] text-primary cursor-pointer transition-colors outline-none"
                >
                  <option value="Idea">Idea</option>
                  <option value="Production">In Production</option>
                  <option value="Review">Under Review</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              <Button type="submit" variant="secondary" className="w-full h-10 mt-2 font-data-label font-bold text-[12px] uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px] mr-1">add</span> Schedule Item
              </Button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
