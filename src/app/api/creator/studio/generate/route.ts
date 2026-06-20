import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * POST /api/creator/studio/generate
 * Calls the Google Gemini API to generate social hooks, caption variations,
 * and a full content script based on campaign guidelines and product details.
 */
export async function POST(req: NextRequest) {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY || "";
    
    if (!geminiApiKey) {
      console.warn("GEMINI_API_KEY is not defined. Returning mock script data.");
      return NextResponse.json(getMockScriptResponse());
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const body = await req.json();
    const { productName, coreMessage, styleTone, length } = body;

    if (!productName || !coreMessage) {
      return NextResponse.json({ error: "Missing productName or coreMessage" }, { status: 400 });
    }

    const prompt = `
      You are an elite Instagram content strategist and copywriter.
      Generate a premium social media package for the following product:
      Product/Brand Name: ${productName}
      Core Message to Deliver: ${coreMessage}
      Tone of Style: ${styleTone || "energetic"}
      Video Length Target: ${length || "30s"}

      Your response MUST be valid JSON conforming exactly to this schema:
      {
        "hooks": [
          "An attention-grabbing first 3-second hook option 1",
          "An attention-grabbing first 3-second hook option 2",
          "An attention-grabbing first 3-second hook option 3"
        ],
        "caption": "A high-conversion Instagram caption with relevant hashtags",
        "script": "A detailed video script split into visual cues, action directions, and voiceover text."
      }

      Do NOT add any markdown formatting blocks like \`\`\`json or text wrapping outside the JSON. Return only the raw JSON.
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Remove markdown json block if Gemini mistakenly adds it
    if (text.startsWith("\`\`\`json")) {
      text = text.substring(7);
    } else if (text.startsWith("\`\`\`")) {
      text = text.substring(3);
    }
    if (text.endsWith("\`\`\`")) {
      text = text.substring(0, text.length - 3);
    }
    text = text.trim();

    try {
      const parsedData = JSON.parse(text);
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON. Raw text:", text);
      // Fallback in case Gemini returns raw text instead of strictly formatted JSON
      return NextResponse.json({
        hooks: [
          `Stop scrolling! If you are using ${productName}, you need to watch this.`,
          `This one secret about ${productName} will save you hours.`,
          `Why is everyone talking about ${productName} right now?`
        ],
        caption: `Finally, a solution that actually works. Here is why ${productName} is changing the game: ${coreMessage} #instagramtrends #creatorlife`,
        script: text,
      });
    }
  } catch (error: any) {
    console.error("Error in AI Content Generation:", error);
    return NextResponse.json({ error: error.message || "Failed to generate script" }, { status: 500 });
  }
}

function getMockScriptResponse() {
  return {
    hooks: [
      "Stop scrolling! If you are a creator, this one tool is about to change everything.",
      "Honestly, I didn't think it was possible to automate brand sponsorships... until I found this.",
      "The secret is out: here is how micro-creators are landing sponsorships without a manager."
    ],
    caption: "Stop wasting hours managing emails and spreadsheets. CreatorOS integrates your entire stack, links your Instagram Graph metrics, and secures your payments in escrow via Razorpay. 🚀 #microcreator #contentcreator #influencermarketing #creator economy",
    script: `
[0:00 - 0:03]
Visual: Creator sits at desk, looking stressed, pointing at a chaotic spreadsheet.
Audio (Voiceover): "Are you still trying to pitch brands manually and track everything in messy spreadsheets?"

[0:03 - 0:10]
Visual: Cut to Creator typing on a sleek, glassmorphic dashboard interface. Points to follower graphs and matching sponsor lists.
Audio (Voiceover): "Introducing CreatorOS. It pulls your Instagram Graph analytics and uses pgvector similarity to match you with matching sponsors in seconds."

[0:10 - 0:20]
Visual: Zoom in on a Razorpay Escrow deposit confirmation popup showing funds locked.
Audio (Voiceover): "The best part? Payments are secured instantly in escrow using Razorpay Route, so you get paid the moment your reel goes live."

[0:20 - 0:30]
Visual: Creator smiling, closing laptop, and walking off-camera holding a cup of coffee.
Audio (Voiceover): "Consolidate your stack. Automate your workflow. Get started on CreatorOS today."
    `.trim(),
  };
}
