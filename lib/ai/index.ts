
import { ChatGroq } from "@langchain/groq";

if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY is not set in environment variables.");
}

export const chatModel = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile", // Using a capable model for logic
    temperature: 0,
});
