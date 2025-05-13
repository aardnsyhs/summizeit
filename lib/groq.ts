import { ChatGroq } from "@langchain/groq";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import dotenv from "dotenv";

dotenv.config();

const chat = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  model: "llama3-70b-8192",
});

export async function generateSummaryFromGroq(pdfText: string) {
  try {
    const res = await chat.invoke([
      { role: "system", content: SUMMARY_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
      },
    ]);

    return res.content;
  } catch (err: any) {
    console.error("GROQ ERROR:", err);
    throw new Error("FAILED_TO_SUMMARIZE");
  }
}
