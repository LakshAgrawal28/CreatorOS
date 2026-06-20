import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Inject WebSocket constructor for Neon database pool in Node.js environments
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

import { getEmbedding, getCreatorProfileText, getCampaignText } from "@/utils/embeddings";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

const connectionString = process.env.DATABASE_URL || "";

let basePrisma: PrismaClient;

if (typeof window === "undefined") {
  if (connectionString) {
    const adapter = new PrismaNeon({ connectionString });
    basePrisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  } else {
    // Fallback instance for compilation/build phase if env is empty
    basePrisma = new PrismaClient({
      log: ["error"],
    });
  }
} else {
  basePrisma = {} as PrismaClient;
}

// Extended client to handle automatic vector embeddings mapping
const extendedPrisma = typeof window === "undefined"
  ? basePrisma.$extends({
      query: {
        creatorProfile: {
          async create({ args, query }) {
            const result = await query(args);
            try {
              const text = getCreatorProfileText({
                bio: result.bio,
                niche: result.niche || "",
                followerCount: result.followerCount ?? 0,
                engagementRate: result.engagementRate ?? 0,
                averageLikes: result.averageLikes ?? 0,
              });
              const vector = await getEmbedding(text);
              const vectorString = `[${vector.join(",")}]`;
              await basePrisma.$executeRawUnsafe(
                `UPDATE "CreatorProfile" SET "profileEmbedding" = cast($1 as vector) WHERE id = $2`,
                vectorString,
                result.id
              );
            } catch (err) {
              console.error("Prisma Extension: Failed to create CreatorProfile embedding", err);
            }
            return result;
          },
          async update({ args, query }) {
            const result = await query(args);
            try {
              const text = getCreatorProfileText({
                bio: result.bio,
                niche: result.niche || "",
                followerCount: result.followerCount ?? 0,
                engagementRate: result.engagementRate ?? 0,
                averageLikes: result.averageLikes ?? 0,
              });
              const vector = await getEmbedding(text);
              const vectorString = `[${vector.join(",")}]`;
              await basePrisma.$executeRawUnsafe(
                `UPDATE "CreatorProfile" SET "profileEmbedding" = cast($1 as vector) WHERE id = $2`,
                vectorString,
                result.id
              );
            } catch (err) {
              console.error("Prisma Extension: Failed to update CreatorProfile embedding", err);
            }
            return result;
          },
        },
        campaign: {
          async create({ args, query }) {
            const result = await query(args);
            try {
              const text = getCampaignText({
                title: result.title || "",
                description: result.description || "",
                industry: result.industry || "",
                deliverables: result.deliverables || [],
              });
              const vector = await getEmbedding(text);
              const vectorString = `[${vector.join(",")}]`;
              await basePrisma.$executeRawUnsafe(
                `UPDATE "Campaign" SET "campaignEmbedding" = cast($1 as vector) WHERE id = $2`,
                vectorString,
                result.id
              );
            } catch (err) {
              console.error("Prisma Extension: Failed to create Campaign embedding", err);
            }
            return result;
          },
          async update({ args, query }) {
            const result = await query(args);
            try {
              const text = getCampaignText({
                title: result.title || "",
                description: result.description || "",
                industry: result.industry || "",
                deliverables: result.deliverables || [],
              });
              const vector = await getEmbedding(text);
              const vectorString = `[${vector.join(",")}]`;
              await basePrisma.$executeRawUnsafe(
                `UPDATE "Campaign" SET "campaignEmbedding" = cast($1 as vector) WHERE id = $2`,
                vectorString,
                result.id
              );
            } catch (err) {
              console.error("Prisma Extension: Failed to update Campaign embedding", err);
            }
            return result;
          },
        },
      },
    })
  : basePrisma;

export const db = (globalForPrisma.prisma ?? extendedPrisma) as unknown as PrismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
