import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY || "";
    
    if (!geminiApiKey) {
      console.warn("GEMINI_API_KEY is not defined.");
      return NextResponse.json({ reply: "I'm sorry, my AI backend is not configured correctly. Please add the GEMINI_API_KEY environment variable." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const body = await req.json();
    const { message, chatHistory } = body;

    if (!message) {
      return NextResponse.json({ error: "Missing message parameter" }, { status: 400 });
    }

    // 1. Resolve Session
    let session: any = await getServerSession(authOptions);
    if (!session || !session.user) {
      const demoRole = req.cookies.get("demo_role")?.value;
      const demoName = req.cookies.get("demo_name")?.value;
      if (demoRole && demoName) {
        const email = `${decodeURIComponent(demoName).toLowerCase().replace(/[^a-z0-9_]/g, "")}@creatoros.com`;
        const dbUser = await db.user.findUnique({
          where: { email },
        });
        if (dbUser) {
          session = { user: { id: dbUser.id, role: dbUser.role, name: dbUser.name, email: dbUser.email } };
        }
      }
    }

    let contextPrompt = "";
    if (session && session.user) {
      const user = session.user;
      const role = user.role || "CREATOR";

      if (role === "CREATOR") {
        const profile = await db.creatorProfile.findUnique({
          where: { userId: user.id },
        });
        if (profile) {
          contextPrompt = `
Here is context about the content creator you are helping:
- Name: ${user.name || "Guest Creator"}
- Instagram Handle: @${profile.instagramHandle}
- Niche: ${profile.niche}
- Bio: ${profile.bio || "None"}
- Follower Count: ${profile.followerCount.toLocaleString()}
- Engagement Rate: ${(profile.engagementRate * 100).toFixed(2)}%
- Avg Views: ${profile.averageViews.toLocaleString()}
- Avg Likes: ${profile.averageLikes.toLocaleString()}
- Demographics: ${profile.audienceDemo ? JSON.stringify(profile.audienceDemo) : "Not connected"}
          `;
        }
      } else if (role === "SPONSOR") {
        const profile = await db.sponsorProfile.findUnique({
          where: { userId: user.id },
          include: { campaigns: true }
        });
        if (profile) {
          contextPrompt = `
Here is context about the brand sponsor you are helping:
- Company Name: ${profile.companyName}
- Industry: ${profile.industry}
- Website: ${profile.website}
- Active Campaigns: ${profile.campaigns.map(c => `"${c.title}" (Budget: $${c.budget})`).join(", ") || "None"}
          `;
        }
      }
    }

    const prompt = `
You are CreatorOS AI, a helpful, elite assistant for content creators and brand sponsors.
Your job is to provide actionable advice on Instagram growth, monetization, and sponsorships based on the user's specific context.

${contextPrompt}

Keep your answers professional, concise, and helpful. Use formatting (like markdown bullet points or bold text) where appropriate to make it readable.
Do not use technical jargon unless explaining it simply. Refer to the user's statistics or details where relevant to give personalized advice.

User's message: "${message}"
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Error in Assistant AI:", error);
    return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
  }
}
