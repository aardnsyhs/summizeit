"use client";

import { z } from "zod";
import UploadFormInput from "./UploadFormInput";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-actions";
import { useRef, useState } from "react";

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
    onUploadBegin: ({ file }) => {
      console.log("upload has begun for", file);
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
        toast(
          <div>
            <p className="font-semibold">✅ Summary saved</p>
            <p className="text-sm text-muted-foreground">
              Your PDF summary has been successfully saved!
            </p>
          </div>
        );
        formRef.current?.reset();
      } else {
        toast.error("❌ Failed to save PDF summary.");
      }
    } catch (err) {
      console.error("Error occurred", err);
      toast.error("Unexpected error occurred during upload.");
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
