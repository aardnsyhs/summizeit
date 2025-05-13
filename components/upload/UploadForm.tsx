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

  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      console.error("error occurred while uploading", err);
      toast.error(
        <div>
          <p className="font-bold">Error occured while uploading</p>
          <p className="text-sm text-muted-foreground">{err.message}</p>
        </div>
      );
    },
    onUploadBegin: ({ file }) => {
      console.log("upload has begun for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      const validatedFields = schema.safeParse({ file });

      console.log(validatedFields);

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

      const { data = null, message = null } = result || {};

      if (data) {
        toast(
          <div>
            <p className="font-semibold">📄 Saving PDF...</p>
            <p className="text-sm text-muted-foreground">
              Hang tight! We are saving your summary!
            </p>
          </div>
        );
        formRef.current?.reset();
        if (data.summary) {
          // save the summary to the database
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Error occured", err);
      formRef.current?.reset();
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
