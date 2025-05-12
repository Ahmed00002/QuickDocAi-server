import { GoogleGenAI } from "@google/genai";

// Initializing Gemini ai with api key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default ai;
