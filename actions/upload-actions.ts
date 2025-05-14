"use server";

import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromGroq } from "@/lib/groq";
import { generateSummaryFromGemini } from "@/lib/gemini";

export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          url: string;
          name: string;
        };
      };
    }
  ]
) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  let summary;
  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log(pdfText);
    try {
      summary = await generateSummaryFromGroq(pdfText);
      console.log({ summary });
    } catch (err) {
      console.error(err);
      //call gemini
      if (err instanceof Error && err.message === "RATE_LIMIT_EXCEEDED") {
        try {
          summary = await generateSummaryFromGemini(pdfText);
        } catch (geminiErr) {
          console.error(
            "Gemini API failed after Groq quote exceeded",
            geminiErr
          );
          throw new Error(
            "Failed to generate summary with available AI providers"
          );
        }
      }
    }

    if (!summary) {
      return {
        success: false,
        message: "Failed to generate summary",
        data: null,
      };
    }

    return {
      success: true,
      message: "Summary generated successfully",
      data: {
        summary,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }
}
