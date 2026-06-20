import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { syncInstagramMetrics } from "@/inngest/functions";

// Expose standard Inngest HTTP routes for handling requests from Inngest cloud/dev server
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncInstagramMetrics,
  ],
});
