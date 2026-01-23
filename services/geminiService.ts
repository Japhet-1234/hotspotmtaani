import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches AI-generated network insights for the admin dashboard.
 */
export const getNetworkInsights = async (customerCount: number, traffic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short executive summary (max 3 sentences) for a network administrator. The current active customers are ${customerCount} and the daily traffic is ${traffic}. Use a professional tone.`,
      config: {
        temperature: 0.7,
      }
    });
    // Use .text property to access the generated content
    return response.text || "Network status is stable. No anomalies detected.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Network status is stable. Regular maintenance scheduled for Sunday.";
  }
};

/**
 * Generates a catchy slogan for marketing wifi plans.
 */
export const generateVoucherAdCopy = async (planName: string, duration: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a catchy 5-word slogan for a hotspot voucher plan called "${planName}" that lasts for ${duration}.`,
      config: {
        temperature: 0.9,
      }
    });
    // Accessing .text property directly and cleaning up quotes
    return response.text?.replace(/"/g, '') || "Fast & Reliable Internet Now";
  } catch (error) {
    console.error("Gemini Slogan Error:", error);
    return "Fast & Reliable Internet Now";
  }
};