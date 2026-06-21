import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Generates an embedding vector (768 dimensions) from the provided text using
 * Google Gemini's gemini-embedding-2 model, and pads or slices it to match
 * the 1536 dimensions expected by pgvector in the database schema.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  if (!geminiApiKey) {
    console.warn("GEMINI_API_KEY is not defined. Returning a mock vector of zeros.");
    return new Array(1536).fill(0);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const result = await model.embedContent(text);
    
    if (!result.embedding || !result.embedding.values) {
      throw new Error("No embedding values returned from Gemini API");
    }

    const values = result.embedding.values;
    
    // Pad the 768-dimension vector to 1536-dimension vector with zeros
    const targetDimension = 1536;
    if (values.length < targetDimension) {
      const padding = new Array(targetDimension - values.length).fill(0);
      return [...values, ...padding];
    }
    
    return values.slice(0, targetDimension);
  } catch (error) {
    console.error("Error generating embedding from Gemini API:", error);
    // Return mock vector in case of API failure so the app doesn't crash completely
    return new Array(1536).fill(0);
  }
}

/**
 * Text serializer for CreatorProfile details to build an embedding.
 */
export function getCreatorProfileText(profile: {
  bio?: string | null;
  niche: string;
  followerCount: number;
  engagementRate: number;
  averageLikes: number;
}): string {
  return `Creator Profile
Niche/Industry Focus: ${profile.niche}
Follower Count: ${profile.followerCount}
Engagement Rate: ${(profile.engagementRate * 100).toFixed(2)}%
Average Likes per Post: ${profile.averageLikes}
Bio Description: ${profile.bio || "No biography provided."}`.trim();
}

/**
 * Text serializer for Campaign details to build an embedding.
 */
export function getCampaignText(campaign: {
  title: string;
  description: string;
  industry: string;
  deliverables: string[];
}): string {
  return `Brand Campaign Details
Campaign Title: ${campaign.title}
Target Niche/Industry: ${campaign.industry}
Deliverables Required: ${campaign.deliverables.join(", ")}
Campaign Description: ${campaign.description}`.trim();
}
