"use server";

import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromGroq } from "@/lib/groq";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { auth } from "@clerk/nextjs/server";
import { getDbConnection } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface PdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function generatePdfText({ fileUrl }: { fileUrl: string }) {
  if (!fileUrl) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(fileUrl);
    console.log(pdfText);

    if (!pdfText) {
      return {
        success: false,
        message: "Failed to fetch and extract PDF text",
        data: null,
      };
    }

    return {
      success: true,
      message: "PDF text generated successfully",
      data: {
        pdfText,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: "File to fetch and extract PDF text",
      data: null,
    };
  }
}

export async function generatePdfSummary({
  pdfText,
  fileName,
}: {
  pdfText: string;
  fileName: string;
}) {
  try {
    let summary;
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
      return {
        success: false,
        message: "Failed to generate summary",
        data: null,
      };
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
        title: fileName,
        summary,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to generate summary",
      data: null,
    };
  }
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  try {
    const sql = await getDbConnection();
    const [savedSummary] = await sql`INSERT INTO pdf_summaries (
      user_id,
      original_file_url,
      summary_text,
      title,
      file_name
    ) VALUES (
      ${userId},
      ${fileUrl},
      ${summary},
      ${title},
      ${fileName}
    ) RETURNING id, summary_text`;
    return savedSummary;
  } catch (err) {
    console.error("Error saving PDF summary", err);
    throw err;
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  let savedSummary: any;
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }
    savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });
    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary, please try again...",
      };
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Error saving PDF summary",
    };
  }

  revalidatePath(`/summaries/${savedSummary.id}`);

  return {
    success: true,
    message: "PDF summary saved successfully",
    data: {
      id: savedSummary.id,
    },
  };
}
