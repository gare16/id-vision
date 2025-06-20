import { useState } from "react";
import Tesseract from "tesseract.js";
import { preprocessImage } from "@/utils/image-preprocess";
import Image from "next/image";

interface Props {
  onTextExtracted: (text: string) => void;
}

export default function OCRUploader({ onTextExtracted }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const processed = await preprocessImage(file);
    setPreview(processed);

    Tesseract.recognize(processed, "ind", {
      langPath: "/tessdata",
      logger: (m) =>
        m.status === "recognizing text" &&
        setProgress(Math.floor(m.progress * 100)),
    })
      .then(({ data }) => {
        setLoading(false);
        onTextExtracted(data.text);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <Image
          width={200}
          height={200}
          alt="Preview"
          src={preview}
          className="w-40 mt-2"
        />
      )}
      {loading && <p>Processing... {progress}%</p>}
    </div>
  );
}
