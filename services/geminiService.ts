
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly without fallbacks or modifications
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getNetworkInsights = async (customerCount: number, traffic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short executive summary (max 3 sentences) for a network administrator. The current active customers are ${customerCount} and the daily traffic is ${traffic}. Use a professional tone.`,
      config: {
        temperature: 0.7,
      }
    });
    // .text is a property, not a method
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Network status is stable. Regular maintenance scheduled for Sunday.";
  }
};

export const generateVoucherAdCopy = async (planName: string, duration: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a catchy 5-word slogan for a hotspot voucher plan called "${planName}" that lasts for ${duration}.`,
      config: {
        temperature: 0.9,
      }
    });
    // Accessing .text property directly
    return response.text?.replace(/"/g, '');
  } catch (error) {
    return "Fast & Reliable Internet Now";
  }
};
