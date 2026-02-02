import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MY_NAME, MY_ROLE, MY_BIO, SKILLS, CERTIFICATIONS } from "../constants";
import { Project } from "../types";
import { chatRateLimiter } from "./rateLimiter";
import { analytics } from "./analytics";

// Function to construct context dynamically based on current projects
const generatePortfolioContext = (projects: Project[]) => `
You are Veek Bot, an AI assistant for ${MY_NAME}'s portfolio website. 
Your goal is to answer questions about ${MY_NAME}, their skills, data science projects, and background.
Be professional, analytical, and enthusiastic.

**Data Scientist Profile:**
Name: ${MY_NAME}
Role: ${MY_ROLE}
Bio: ${MY_BIO}
Core Skills: ${SKILLS.join(", ")}

**Certifications:**
${CERTIFICATIONS.map((c) => `- ${c.name} (${c.issuer}, ${c.date})`).join("\n")}

**Projects:**
${projects
  .map(
    (p) => `
- Title: ${p.title}
- Status: ${p.status}
- Tech Stack: ${p.technologies.join(", ")}
- Description: ${p.fullDescription}
`
  )
  .join("\n")}

**Instructions:**
- If asked about specific tools (e.g., Python, Excel, PowerBI), reference the projects where they were used.
- Highlight the business impact (e.g., cost reduction, time saved) mentioned in project descriptions.
- Keep answers under 100 words unless asked for details.
- If you don't know something, say "I don't have that information in my current context."
`;

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Missing VITE_GEMINI_API_KEY environment variable. Please set it in .env.local"
      );
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const generateChatResponse = async (
  userMessage: string,
  projects: Project[]
): Promise<string> => {
  try {
    if (!userMessage || !userMessage.trim()) {
      return "Please ask me something! 😊";
    }

    // Check rate limit
    const rateLimitCheck = chatRateLimiter.isAllowed();
    if (!rateLimitCheck.allowed) {
      const retryAfter = rateLimitCheck.retryAfter || 60;
      return `⏱️ I'm getting a lot of requests right now. Please try again in ${retryAfter} seconds.`;
    }

    // Track the chat message
    analytics.trackChatMessage(userMessage.length);

    const ai = getClient();

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: generatePortfolioContext(projects),
      },
    });

    if (!response.text) {
      console.warn("Empty response from Gemini API");
      return "I received an empty response. Could you rephrase your question?";
    }

    return response.text;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Gemini API Error:", error);

    // Provide user-friendly error messages based on error type
    if (errorMessage.includes("API_KEY") || errorMessage.includes("apiKey")) {
      return "⚠️ Veek Bot is not properly configured. Please contact the site owner.";
    }

    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      return "🌐 Network error. Please check your connection and try again.";
    }

    if (errorMessage.includes("quota") || errorMessage.includes("rate")) {
      return "⏱️ Too many requests. Please wait a moment before trying again.";
    }

    return "Sorry, I'm having trouble right now. Please try again in a moment!";
  }
};
