"use client";

import { z } from "zod";
import UploadFormInput from "./UploadFormInput";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

      const res = await startUpload([file]);
      if (!res) {
        toast.error(
          <div>
            <p className="font-semibold">❌ Something went wrong</p>
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

      const result = await generatePdfSummary(res);
      const { data = null } = result || {};

      if (data) {
        let storeResult: any;
        toast(
          <div>
            <p className="font-semibold">✅ Saving PDF...</p>
            <p className="text-sm text-muted-foreground">
              Hang tight! We are saving your summary! ✨
            </p>
          </div>
        );
        if (data.summary) {
          storeResult = await storePdfSummaryAction({
            summary: Array.isArray(data.summary)
              ? data.summary.join(" ")
              : String(data.summary),
            fileUrl: res[0].ufsUrl,
            title: data.title,
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
          if (storeResult?.data?.id) {
            router.push(`/summaries/${storeResult.data.id}`);
          } else {
            console.error("storeResult.data.id tidak ditemukan:", storeResult);
            toast.error("❌ Gagal menyimpan summary ke database.");
          }
        }
      } else {
        toast.error("❌ Failed to save PDF summary.");
        formRef.current?.reset();
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
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
