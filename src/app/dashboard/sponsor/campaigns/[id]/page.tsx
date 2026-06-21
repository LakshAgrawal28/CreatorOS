import { db } from "@/server/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch campaign from database
  const campaign = await db.campaign.findUnique({
    where: { id },
    include: {
      sponsor: true,
      applications: {
        include: {
          creator: { include: { user: true } },
        },
      },
    },
  });

  if (!campaign) {
    redirect("/dashboard");
  }

  const creatorCriteria = campaign.creatorCriteria as {
    minFollowers?: number;
    maxFollowers?: number;
  } | null;

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    DRAFT: "bg-zinc-100 text-zinc-800",
    PAUSED: "bg-amber-100 text-amber-800",
    COMPLETED: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="max-w-[900px] mx-auto w-full pb-32 text-[#1a1c1c] space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-[12px] uppercase font-bold text-on-surface-variant hover:text-primary mb-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mt-1">
          <div>
            <h2 className="font-display-lg text-[28px] md:text-[32px] font-bold text-primary tracking-tight">
              {campaign.title}
            </h2>
            <p className="text-on-surface-variant text-[14px] mt-1">{campaign.sponsor.companyName}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`inline-flex px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${statusColors[campaign.status] || "bg-zinc-100 text-zinc-800"}`}>
              {campaign.status}
            </span>
            <Link href="/dashboard/sponsor/campaigns/new">
              <Button variant="outline" size="sm">Create New</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Campaign Details Card */}
      <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] space-y-6">
        <h3 className="font-bold text-[18px] text-primary border-b border-[#E5E5E5]/60 pb-4">Campaign Brief</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <span className="font-data-label text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Budget (USD)</span>
            <span className="font-data-value text-[24px] font-bold text-[#fb7800]">${campaign.budget.toLocaleString()}</span>
            <span className="text-[12px] text-on-surface-variant/70 block mt-0.5">≈ ₹{(campaign.budget * 85).toLocaleString()} INR</span>
          </div>
          <div>
            <span className="font-data-label text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Industry</span>
            <span className="font-data-value text-[16px] font-bold text-primary">{campaign.industry}</span>
          </div>
          <div>
            <span className="font-data-label text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Applicants</span>
            <span className="font-data-value text-[24px] font-bold text-primary">{campaign.applications.length}</span>
          </div>
        </div>

        <div>
          <span className="font-data-label text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Campaign Description</span>
          <p className="text-[14px] text-on-surface-variant leading-relaxed">{campaign.description}</p>
        </div>

        {Array.isArray(campaign.deliverables) && campaign.deliverables.length > 0 && (
          <div>
            <span className="font-data-label text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Deliverables</span>
            <div className="flex gap-2 flex-wrap">
              {(campaign.deliverables as string[]).map((d) => (
                <span key={d} className="inline-flex px-3 py-1 rounded-full bg-[#fb7800]/10 text-[#fb7800] text-[11px] font-bold border border-[#fb7800]/20">
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {creatorCriteria && (
          <div>
            <span className="font-data-label text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">Creator Criteria</span>
            <div className="flex gap-4 text-[13px]">
              <div className="bg-[#f3f3f3] rounded-lg px-4 py-2">
                <span className="text-on-surface-variant/70">Min Followers:</span>{" "}
                <span className="font-bold text-primary">{(creatorCriteria.minFollowers || 0).toLocaleString()}</span>
              </div>
              <div className="bg-[#f3f3f3] rounded-lg px-4 py-2">
                <span className="text-on-surface-variant/70">Max Followers:</span>{" "}
                <span className="font-bold text-primary">{(creatorCriteria.maxFollowers || 10000000).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between border-b border-[#E5E5E5]/60 pb-4 mb-4">
          <h3 className="font-bold text-[18px] text-primary">Creator Applications ({campaign.applications.length})</h3>
          <Link href={`/dashboard/sponsor/matches`}>
            <Button variant="outline" size="sm">Find More Creators</Button>
          </Link>
        </div>

        {campaign.applications.length === 0 ? (
          <div className="py-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 block mb-3">group_add</span>
            <p className="text-[14px] text-on-surface-variant/60 font-semibold">No applications yet.</p>
            <p className="text-[12px] text-on-surface-variant/40 mt-1">Use the Match CRM to invite creators to apply.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E5E5]/60">
                  <th className="pb-3 text-[11px] uppercase tracking-wider text-on-surface-variant/50 font-bold">Creator</th>
                  <th className="pb-3 text-[11px] uppercase tracking-wider text-on-surface-variant/50 font-bold">Instagram</th>
                  <th className="pb-3 text-[11px] uppercase tracking-wider text-on-surface-variant/50 font-bold">Status</th>
                  <th className="pb-3 text-[11px] uppercase tracking-wider text-on-surface-variant/50 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]/30">
                {campaign.applications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#f3f3f3]/20 transition-colors">
                    <td className="py-4 text-[14px] font-bold text-primary">{app.creator.user?.name || "Creator"}</td>
                    <td className="py-4 text-[13px] text-[#fb7800] font-semibold">
                      @{app.creator.instagramHandle || "unknown"}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        app.status === "APPROVED" ? "bg-green-100 text-green-800"
                        : app.status === "REJECTED" ? "bg-red-100 text-red-800"
                        : app.status === "NEGOTIATING" ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-[12.5px] font-bold text-[#fb7800] hover:underline">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
