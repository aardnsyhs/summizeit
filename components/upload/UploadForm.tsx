"use client";

import { z } from "zod";
import UploadFormInput from "./UploadFormInput";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-actions";

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

    const summary = await generatePdfSummary(res);
    console.log({ summary });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}
