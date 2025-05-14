import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-70b-8192",
});

export async function generateSummaryFromGroq(pdfText: string) {
  try {
    const completion = await groq.invoke([
      new SystemMessage(SUMMARY_SYSTEM_PROMPT),
      new HumanMessage(
        `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`
      ),
    ]);

    return completion.content;
  } catch (err: any) {
    if (err?.statusCode === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw err;
  }
}
