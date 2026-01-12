import Image from "next/image";
import { useState, useRef } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

import { preprocessImage } from "@/utils/image-preprocess";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Props {
  onTextExtracted: (text: string) => void;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "environment",
};

export default function OCRUploader({ onTextExtracted }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [usingWebcam, setUsingWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const processed = await preprocessImage(file);
    setPreview(processed);

    Tesseract.recognize(processed, "ind", {
      langPath: "/tessdata/",
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

  const capturePhoto = async () => {
    if (webcamRef.current) {
      const photo = webcamRef.current.getScreenshot();
      if (photo) {
        setLoading(true);

        // Convert data URL to blob for preprocessing
        const response = await fetch(photo);
        const blob = await response.blob();

        const processed = await preprocessImage(blob);
        setPreview(processed);

        Tesseract.recognize(processed, "ind", {
          langPath: "/tessdata/",
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
      }
    }
  };

  const retakePhoto = () => {
    setPreview(null);
    setUsingWebcam(true);
  };

  const switchToUpload = () => {
    setPreview(null);
    setUsingWebcam(false);
  };

  return (
    <div>
      {!preview && !usingWebcam && (
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setUsingWebcam(true)}
            className="w-full"
          >
            Use Camera
          </Button>
          <div className="relative">
            <span className="absolute inset-0 flex items-center justify-center px-2 bg-white text-xs text-gray-200">
              OR
            </span>
            <hr className="border-t border-gray-300" />
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
      )}

      {usingWebcam && !preview && (
        <div className="space-y-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full max-w-md mx-auto rounded-lg border"
          />
          <Button onClick={capturePhoto} className="w-full">
            Capture Photo
          </Button>
          <Button variant="outline" onClick={switchToUpload} className="w-full">
            Switch to Upload
          </Button>
        </div>
      )}

      {preview && (
        <div className="space-y-4">
          <Image
            width={400}
            height={300}
            alt="Preview"
            src={preview}
            className="w-full max-w-md mx-auto rounded-lg border"
          />
          <div className="flex space-x-2">
            <Button onClick={retakePhoto} variant="outline" className="flex-1">
              Retake Photo
            </Button>
            <Button
              onClick={switchToUpload}
              variant="outline"
              className="flex-1"
            >
              New Upload
            </Button>
          </div>
        </div>
      )}

      {loading && <p className="mt-2 text-center">Processing... {progress}%</p>}
    </div>
  );
}
