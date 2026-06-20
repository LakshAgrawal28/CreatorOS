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
        // Simple demo login fallback
        const role = (credentials?.role || "CREATOR").toUpperCase();
        return {
          id: "guest-user-id",
          name: credentials?.username || "Guest Creator",
          email: "guest@creatoros.com",
          role: role === "SPONSOR" ? "SPONSOR" : "CREATOR",
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
