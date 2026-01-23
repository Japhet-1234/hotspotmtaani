
// Service to interact with Google Gemini API for network analysis and marketing.
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Provides AI-driven insights about the current network status.
 * Uses gemini-3-flash-preview for efficiency and speed.
 */
export const getNetworkInsights = async (customerCount: number, traffic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an AI network administrator for "Mtaani WiFi". 
      Generate a short, encouraging status update based on these metrics: 
      Total Customers: ${customerCount}, Data Traffic Today: ${traffic}.
      Keep it professional and concise (max 20 words).`,
    });
    // Accessing .text property directly as per SDK guidelines
    return response.text || "Network status stable. All systems operational.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Surveillance systems active. Analyzing traffic patterns...";
  }
};

/**
 * Generates catchy marketing copy for WiFi vouchers in Swahili.
 */
export const generateVoucherAdCopy = async (planName: string, price: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a short, catchy Swahili marketing message for a "${planName}" WiFi voucher costing ${price} Tsh. Include emojis.`,
    });
    // Accessing .text property directly as per SDK guidelines
    return response.text || `Chagua ${planName} kwa Tsh ${price} tu!`;
  } catch (error) {
    console.error("Gemini Ad Copy Error:", error);
    return `Kifurushi cha ${planName} kinapatikana kwa Tsh ${price}.`;
  }
};
