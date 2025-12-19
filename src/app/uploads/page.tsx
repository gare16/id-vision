"use client";

import { useState, useTransition } from "react";

import OCRUploader from "@/components/ocr/new-ocr";
import { Button } from "@/components/ui/button";
import { createVisitor } from "@/lib/action/visitor";
import { parseKTPText, KTPData } from "@/utils/parse-ktp";

export default function Home() {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<KTPData | null>(null);

  const handleExtractedText = (rawText: string) => {
    const data = parseKTPText(rawText);
    setFormData(data);
  };

  const handleCreateVisitor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nik = formData.get("nik") as string;
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const birthInfo = formData.get("birthInfo") as string;
    const data = { nik, name, address, birthInfo };

    startTransition(async () => {
      await createVisitor(data).then((res) => {
        if (!res.success) {
          console.error(res.error);
        } else {
          console.log("Updated:", res.data);
          window.location.reload();
        }
      });
    });
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">KTP OCR</h1>

      <OCRUploader onTextExtracted={handleExtractedText} />
      <form onSubmit={handleCreateVisitor} className="space-y-4 mt-6">
        {formData && (
          <>
            <input
              name="nik"
              className="w-full border p-2"
              defaultValue={formData.nik}
              placeholder="NIK"
            />
            <input
              name="name"
              className="w-full border p-2"
              defaultValue={formData.name}
              placeholder="Name"
            />
            <input
              name="address"
              className="w-full border p-2"
              defaultValue={formData.address}
              placeholder="Address"
            />
            <input
              name="birthInfo"
              className="w-full border p-2"
              defaultValue={formData.birthInfo}
              placeholder="Birth Info"
            />
            <Button type="submit">
              {isPending ? "Creating..." : "Create"}
            </Button>
          </>
        )}
      </form>
    </main>
  );
}
