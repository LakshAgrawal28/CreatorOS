// Load .env only in local dev - Vercel injects env vars automatically
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
