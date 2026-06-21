import { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/server/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "creatoros_nextauth_dev_secret_123456789",
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "dummy_fb_client_id",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "dummy_fb_client_secret",
      authorization: {
        params: {
          scope: "email,public_profile,instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement",
        },
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Demo Mode",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Guest Creator" },
        role: { label: "Role", type: "text", placeholder: "CREATOR" }
      },
      async authorize(credentials) {
        const role = (credentials?.role || "CREATOR").toUpperCase();
        const rawUsername = credentials?.username || (role === "SPONSOR" ? "Guest Sponsor" : "Guest Creator");
        const cleanUsername = rawUsername.replace(/[^a-zA-Z0-9_]/g, "");
        const email = `${cleanUsername.toLowerCase()}@creatoros.com`;

        // 1. Seed database with defaults if empty
        const { seedDatabase } = await import("@/server/seed");
        await seedDatabase(db);

        // 2. Query database for user
        let user = await db.user.findUnique({
          where: { email },
          include: { creatorProfile: true, sponsorProfile: true },
        });

        // 3. Create user if doesn't exist
        if (!user) {
          user = await db.user.create({
            data: {
              email,
              name: rawUsername,
              role: role === "SPONSOR" ? "SPONSOR" : "CREATOR",
            },
            include: { creatorProfile: true, sponsorProfile: true },
          });
        }

        // 4. Create profile if doesn't exist
        if (role === "CREATOR" && !user.creatorProfile) {
          await db.creatorProfile.create({
            data: {
              userId: user.id,
              instagramHandle: cleanUsername.toLowerCase(),
              bio: "Creative storyteller, tech enthusiast, and micro-influencer based in India.",
              niche: "Tech & Gadgets",
              followerCount: 4250,
              engagementRate: 0.087,
              averageViews: 1420,
              averageLikes: 356,
              audienceDemo: {
                countries: { IN: 0.65, US: 0.15, UK: 0.08, Other: 0.12 },
                gender: { male: 0.58, female: 0.42 },
                age: { "18-24": 0.45, "25-34": 0.35, "35-44": 0.12, "Other": 0.08 }
              }
            }
          });
        } else if (role === "SPONSOR" && !user.sponsorProfile) {
          await db.sponsorProfile.create({
            data: {
              userId: user.id,
              companyName: rawUsername,
              industry: "Tech & Gadgets",
              website: "https://example.com",
            }
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = (token as any).role || "CREATOR";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role || "CREATOR";
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
