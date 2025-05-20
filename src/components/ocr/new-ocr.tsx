"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";
import { handleSubmit } from "./ocr-action";

export function OCRPage() {
  const [image, setImage] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [formData, setFormData] = useState({
    nik: "",
    name: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const runOCR = async () => {
    if (!image) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const result = await Tesseract.recognize(reader.result as string, "ind");
      const text = result.data.text;
      setOcrText(text);
      parseKTPText(text);
      setLoading(false);
    };
    reader.readAsDataURL(image);
  };

  const parseKTPText = (text: string) => {
    const nikMatch = text.match(/\d{16}/);
    const nameMatch = text.match(/Nama\s*:\s*(.*)/i);
    const addressMatch = text.match(/Alamat\s*:\s*(.*)/i);

    setFormData({
      nik: nikMatch?.[0] ?? "",
      name: nameMatch?.[1]?.trim() ?? "",
      address: addressMatch?.[1]?.trim() ?? "",
    });
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">KTP Scanner</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button
        onClick={runOCR}
        disabled={!image || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Scan KTP"}
      </button>

      {ocrText && (
        <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
          {ocrText}
        </pre>
      )}

      <form action={handleSubmit} className="space-y-2">
        <input
          name="nik"
          value={formData.nik}
          onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
          placeholder="NIK"
          className="w-full border p-2 rounded"
        />
        <input
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nama"
          className="w-full border p-2 rounded"
        />
        <input
          name="address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          placeholder="Alamat"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Simpan ke Database
        </button>
      </form>
    </div>
  );
}
