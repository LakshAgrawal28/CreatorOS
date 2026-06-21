require('dotenv').config();

async function listEmbedModels() {
  const geminiApiKey = process.env.GEMINI_API_KEY || "";
  if (!geminiApiKey) {
    console.error("GEMINI_API_KEY is not defined.");
    return;
  }

  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
      const filtered = data.models
        .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("embedContent"))
        .map(m => ({ name: m.name, displayName: m.displayName, inputTokenLimit: m.inputTokenLimit }));
      console.log("Filtered embedContent models:", JSON.stringify(filtered, null, 2));
    } else {
      console.log("No models returned:", data);
    }
  } catch (error) {
    console.error("❌ REST call failed:", error);
  }
}

listEmbedModels();
