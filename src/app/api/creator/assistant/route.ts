import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const prompt = `
You are CreatorOS AI, a helpful, elite assistant for content creators.
Your job is to provide actionable advice on Instagram growth, monetization, and sponsorships.
Keep your answers professional, concise, and helpful. Use formatting (like markdown bullet points or bold text) where appropriate to make it readable.
Do not use technical jargon unless explaining it simply.
User's message: "${message}"
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Error in Assistant AI:", error);
    return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
  }
}
