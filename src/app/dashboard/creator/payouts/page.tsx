"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PayoutsPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [accountName, setAccountName] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName || !ifsc || !accountNo) return;
    setLoading(true);
    // Simulated setup — in production this would call Razorpay Route API
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="max-w-[700px] mx-auto w-full pb-32 text-[#1a1c1c]">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-[12px] uppercase font-bold text-on-surface-variant hover:text-primary mb-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Dashboard
        </Link>
        <h2 className="font-display-lg text-[28px] md:text-[32px] font-bold text-primary tracking-tight">
          Razorpay Payouts Setup
        </h2>
        <p className="font-body-md text-on-surface-variant text-[14px] mt-1.5">
          Connect your bank account to receive escrow releases from brand campaigns.
        </p>
      </div>

      {success ? (
        /* Success State */
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-700 text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <div>
            <h3 className="font-bold text-[20px] text-primary">Route Account Linked!</h3>
            <p className="text-on-surface-variant text-[14px] mt-2 max-w-sm leading-relaxed">
              Your bank account has been registered with Razorpay Route. Brands can now deposit funds directly to your escrow account.
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <Link href="/dashboard">
              <Button variant="primary" size="sm">Go to Dashboard</Button>
            </Link>
            <Link href="/dashboard/sponsor/matches">
              <Button variant="outline" size="sm">Browse Campaigns</Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Setup Form */
        <div className="bg-white border border-[#E5E5E5] rounded-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Progress Steps */}
          <div className="flex border-b border-[#E5E5E5]">
            {[
              { n: 1, label: "Account Details" },
              { n: 2, label: "Verify KYC" },
              { n: 3, label: "Confirm Route" },
            ].map((s) => (
              <button
                key={s.n}
                onClick={() => setStep(s.n as 1 | 2 | 3)}
                className={`flex-1 px-4 py-4 text-center transition-colors ${
                  step === s.n
                    ? "bg-[#fb7800]/5 border-b-2 border-[#fb7800] text-[#fb7800] font-bold"
                    : step > s.n
                    ? "bg-green-50 text-green-700 font-semibold"
                    : "text-on-surface-variant/60"
                }`}
              >
                <span className="font-data-label text-[11px] uppercase tracking-wider">
                  {step > s.n ? "✓ " : ""}{s.label}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSetup} className="p-8 space-y-6">
            {step === 1 && (
              <>
                <div className="bg-[#fb7800]/5 border border-[#fb7800]/20 rounded-xl p-4 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#fb7800] text-[20px] shrink-0">info</span>
                  <p className="text-[13px] text-on-surface-variant leading-relaxed">
                    CreatorOS uses <strong>Razorpay Route</strong> to manage escrow payments. Your bank details are securely processed by Razorpay and never stored on our servers.
                  </p>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-primary uppercase tracking-wider mb-2">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Full legal name as on bank account"
                    className="w-full bg-[#f3f3f3]/60 border border-[#E5E5E5] rounded-xl text-[14px] p-3 focus:outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-primary uppercase tracking-wider mb-2">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    placeholder="e.g. HDFC0001234"
                    className="w-full bg-[#f3f3f3]/60 border border-[#E5E5E5] rounded-xl text-[14px] p-3 focus:outline-none focus:bg-white focus:border-primary transition-all font-mono tracking-widest"
                    maxLength={11}
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-primary uppercase tracking-wider mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter your bank account number"
                    className="w-full bg-[#f3f3f3]/60 border border-[#E5E5E5] rounded-xl text-[14px] p-3 focus:outline-none focus:bg-white focus:border-primary transition-all font-mono tracking-widest"
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    if (!accountName || !ifsc || !accountNo) return;
                    setStep(2);
                  }}
                  className="w-full bg-[#fb7800] hover:bg-[#fb7800]/95 text-white py-3.5 rounded-xl font-bold text-[14px] uppercase tracking-wider"
                  disabled={!accountName || !ifsc || !accountNo}
                >
                  Continue to KYC Verification
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-[#f3f3f3] flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-[36px] text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>
                      badge
                    </span>
                  </div>
                  <h3 className="font-bold text-[18px] text-primary mb-2">KYC Verification</h3>
                  <p className="text-on-surface-variant text-[13px] leading-relaxed max-w-sm mx-auto">
                    In production, this step would redirect to Razorpay&apos;s KYC verification flow where you upload your PAN card, Aadhaar, and a selfie.
                  </p>
                </div>

                <div className="bg-[#f3f3f3] rounded-xl p-4 space-y-3">
                  {["PAN Card verification", "Aadhaar number linked", "Bank statement upload", "Selfie verification"].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-green-700 text-[14px]">check</span>
                      </span>
                      <span className="text-[13px] font-semibold text-primary">{item}</span>
                      <span className="ml-auto text-[10px] uppercase font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Demo ✓</span>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full bg-[#fb7800] hover:bg-[#fb7800]/95 text-white py-3.5 rounded-xl font-bold text-[14px] uppercase tracking-wider"
                >
                  Verification Passed → Continue
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="text-center py-4">
                  <h3 className="font-bold text-[18px] text-primary mb-1">Confirm Route Account</h3>
                  <p className="text-on-surface-variant text-[13px]">Review your details before activating payouts.</p>
                </div>

                <div className="border border-[#E5E5E5] rounded-xl divide-y divide-[#E5E5E5]/60">
                  <div className="flex justify-between p-4 text-[13px]">
                    <span className="text-on-surface-variant font-semibold">Account Name</span>
                    <span className="font-bold text-primary">{accountName}</span>
                  </div>
                  <div className="flex justify-between p-4 text-[13px]">
                    <span className="text-on-surface-variant font-semibold">IFSC</span>
                    <span className="font-bold text-primary font-mono">{ifsc}</span>
                  </div>
                  <div className="flex justify-between p-4 text-[13px]">
                    <span className="text-on-surface-variant font-semibold">Account No.</span>
                    <span className="font-bold text-primary font-mono">
                      {"*".repeat(Math.max(0, accountNo.length - 4))}{accountNo.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between p-4 text-[13px]">
                    <span className="text-on-surface-variant font-semibold">Provider</span>
                    <span className="font-bold text-[#fb7800]">Razorpay Route</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-black/90 text-white py-3.5 rounded-xl font-bold text-[14px] uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Activating Account...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">account_balance</span>
                      Activate Razorpay Route
                    </>
                  )}
                </Button>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
