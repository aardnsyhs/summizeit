"use client";

import { z } from "zod";
import UploadFormInput from "./UploadFormInput";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import {
  generatePdfSummary,
  generatePdfText,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./LoadingSkeleton";
import { formatFileNameAsTitle } from "@/utils/format-utils";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      console.error("error occurred while uploading", err);
      toast.error(
        <div>
          <p className="font-bold">Error occurred while uploading</p>
          <p className="text-sm text-muted-foreground">{err.message}</p>
        </div>
      );
      setIsLoading(false);
    },
    onUploadBegin: (fileName: string) => {
      console.log("upload has begun for", fileName);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      const validatedFields = schema.safeParse({ file });

      if (!validatedFields.success) {
        toast.error(
          <div>
            <p className="font-semibold">❌ Something went wrong</p>
            <p className="text-sm text-muted-foreground">
              {validatedFields.error.flatten().fieldErrors.file?.[0] ??
                "Invalid file"}
            </p>
          </div>
        );
        setIsLoading(false);
        return;
      }

      toast(
        <div>
          <p className="font-semibold">📄 Uploading PDF...</p>
          <p className="text-sm text-muted-foreground">
            We are uploading your PDF!
          </p>
        </div>
      );

      const uploadResponse = await startUpload([file]);
      if (!uploadResponse) {
        toast.error(
          <div>
            <p className="font-bold">Something went wrong</p>
            <p className="text-sm text-muted-foreground">
              Please use a different file
            </p>
          </div>
        );
        setIsLoading(false);
        return;
      }

      toast(
        <div>
          <p className="font-semibold">📄 Processing PDF</p>
          <p className="text-sm text-muted-foreground">
            Hang tight! Our AI is reading through your document!
          </p>
        </div>
      );
      const uploadFileUrl = uploadResponse[0].serverData.fileUrl;

      let storeResult: any;
      toast(
        <div>
          <p className="font-semibold">✅ Saving PDF...</p>
          <p className="text-sm text-muted-foreground">
            Hang tight! We are saving your summary! ✨
          </p>
        </div>
      );

      const formattedFileName = formatFileNameAsTitle(file.name);

      const result = await generatePdfText({
        fileUrl: uploadFileUrl,
      });

      toast(
        <div>
          <p className="font-semibold">📄 Generating PDF Summary</p>
          <p className="text-sm text-muted-foreground">
            Hang tight! Our AI is reading through your document!
          </p>
        </div>
      );

      const summaryResult = await generatePdfSummary({
        pdfText: result?.data?.pdfText ?? "",
        fileName: formattedFileName,
      });

      toast(
        <div>
          <p className="font-semibold">📄 Saving PDF Summary</p>
          <p className="text-sm text-muted-foreground">
            Hang tight! Our AI is reading through your document!
          </p>
        </div>
      );

      const { data = null, message = null } = summaryResult || {};

      if (data?.summary) {
        storeResult = await storePdfSummaryAction({
          summary: Array.isArray(data.summary)
            ? data.summary.join(" ")
            : String(data.summary),
          fileUrl: uploadFileUrl,
          title: formattedFileName,
          fileName: file.name,
        });
        toast.success(
          <div>
            <p className="font-semibold">✨ Summary generated!</p>
            <p className="text-sm text-muted-foreground">
              Your PDF summary has been successfully summarized and saved!
            </p>
          </div>
        );

        formRef.current?.reset();
        router.push(`/summaries/${storeResult.data.id}`);
      }
    } catch (err) {
      console.error("Error occurred", err);
      toast.error("Unexpected error occurred during upload.");
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-muted-foreground text-sm">
            Upload PDF
          </span>
        </div>
      </div>
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
      {isLoading && (
        <>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm">
                Processing
              </span>
            </div>
          </div>
          <LoadingSkeleton />
        </>
      )}
    </div>
  );
}
