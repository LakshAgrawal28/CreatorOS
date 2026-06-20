"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [creatorName, setCreatorName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleOAuthSignIn = async () => {
    setIsLoading("oauth");
    try {
      await signIn("facebook", { callbackUrl });
    } catch (err) {
      console.error(err);
      setIsLoading(null);
    }
  };

  const handleDemoSignIn = async (role: "CREATOR" | "SPONSOR") => {
    setIsLoading(role.toLowerCase());
    const username = role === "CREATOR" ? creatorName || "Guest Creator" : brandName || "Guest Sponsor";
    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        role,
        callbackUrl,
      });
      if (res?.error) {
        console.error("Sign-in failed:", res.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col justify-center items-center py-12 px-6 font-sans selection:bg-[#FB7800]/20 text-[#1a1c1c]">
      <div className="w-full max-w-md bg-white border border-[#E5E5E5] rounded-[20px] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-[12px] bg-black flex items-center justify-center text-white">
            <span className="material-symbols-outlined font-semibold text-[24px]">hexagon</span>
          </div>
          <div>
            <h1 className="font-display-lg text-[24px] font-extrabold tracking-tight leading-tight text-[#1a1c1c]">
              Welcome to CreatorOS
            </h1>
            <p className="font-data-label text-[11px] uppercase tracking-wider font-semibold text-[#fb7800] mt-1">
              Sponsorship Operating System
            </p>
          </div>
        </div>

        {errorParam && (
          <div className="p-4 rounded-[12px] bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-[13px] font-medium leading-normal flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
            <div>
              <p className="font-bold">Authentication Notice</p>
              <p className="text-[12px] opacity-90 mt-0.5">
                {errorParam === "Configuration"
                  ? "Meta credentials not set up. Please link using Guest/Demo mode below."
                  : "We couldn't verify your credentials. Please try another method."}
              </p>
            </div>
          </div>
        )}

        {/* OAuth Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[11px] uppercase tracking-widest font-bold text-[#444748]">
            Production Authentication
          </h2>
          <button
            onClick={handleOAuthSignIn}
            disabled={isLoading !== null}
            className="w-full h-12 bg-black hover:bg-black/90 text-white font-semibold rounded-[12px] flex items-center justify-center gap-3 transition-transform duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-[14px]"
          >
            {isLoading === "oauth" ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook / Instagram
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[#E5E5E5]"></div>
          <span className="flex-shrink mx-4 text-[#444748] text-[12px] font-medium uppercase tracking-wider">OR</span>
          <div className="flex-grow border-t border-[#E5E5E5]"></div>
        </div>

        {/* Guest Demo Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[11px] uppercase tracking-widest font-bold text-[#444748]">
            Immediate Access (Demo Mode)
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {/* Creator Sandbox */}
            <div className="border border-[#E5E5E5] hover:border-[#fb7800]/50 rounded-[16px] p-4 bg-[#F9F9F9]/50 flex flex-col gap-3 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-[#1a1c1c] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#fb7800]">video_camera_back</span>
                  Creator Dashboard
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fb7800]/10 text-[#fb7800] font-bold">CREATOR</span>
              </div>
              <input
                type="text"
                placeholder="Instagram handle (e.g. @wanderlust)"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="w-full h-10 px-3 bg-white rounded-[8px] border border-[#E5E5E5] text-[13px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200"
              />
              <button
                onClick={() => handleDemoSignIn("CREATOR")}
                disabled={isLoading !== null}
                className="w-full h-10 bg-[#fb7800] hover:bg-[#fb7800]/95 text-white font-semibold rounded-[10px] text-[13px] flex items-center justify-center transition-transform duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading === "creator" ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Explore as Creator"
                )}
              </button>
            </div>

            {/* Sponsor Sandbox */}
            <div className="border border-[#E5E5E5] hover:border-black/30 rounded-[16px] p-4 bg-[#F9F9F9]/50 flex flex-col gap-3 transition-colors duration-200">
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-[#1a1c1c] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#1a1c1c]">handshake</span>
                  Sponsor Portal
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 text-[#1a1c1c] font-bold">SPONSOR</span>
              </div>
              <input
                type="text"
                placeholder="Brand / Sponsor name (e.g. RedBull)"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full h-10 px-3 bg-white rounded-[8px] border border-[#E5E5E5] text-[13px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200"
              />
              <button
                onClick={() => handleDemoSignIn("SPONSOR")}
                disabled={isLoading !== null}
                className="w-full h-10 bg-black hover:bg-black/90 text-white font-semibold rounded-[10px] text-[13px] flex items-center justify-center transition-transform duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading === "sponsor" ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Explore as Sponsor"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col justify-center items-center font-sans">
        <div className="w-6 h-6 border-2 border-[#fb7800] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
