"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import { Tooltip, TooltipProvider } from "../ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import Tesseract from "tesseract.js";

export default function ComponentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textResult, setTextResult] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setTextResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      const imageURL = URL.createObjectURL(file);
      const result = await Tesseract.recognize(imageURL, "ind", {
        logger: (m) => console.log(m),
      });
      setTextResult(result.data.text);
    } catch (err) {
      console.error(err);
      setTextResult("OCR gagal");
    }
  };

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  return (
    <div className="w-full flex justify-center gap-4">
      <UploadImage
        file={file}
        fileInputRef={fileInputRef}
        handleBrowseClick={handleBrowseClick}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
      />
      <PreviewImage src={previewUrl} func={handleClearFile} file={file} />
      <pre>{textResult}</pre>
    </div>
  );
}

function UploadImage({
  handleSubmit,
  handleDrop,
  handleDragOver,
  handleBrowseClick,
  fileInputRef,
  handleFileChange,
  file,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleBrowseClick: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.Ref<HTMLInputElement>;
  file: File | null;
}) {
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div
            className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleBrowseClick}
          >
            <FileIcon className="w-12 h-12" />
            <span className="text-sm font-medium text-gray-500">
              Drag and drop a file or click to browse
            </span>
            <span className="text-xs text-gray-500">
              Only <span className="text-chart-2 font-bold">IMAGE</span>
            </span>
            {file && (
              <p className="text-xs mt-2 text-green-600">
                Selected: {file.name}
              </p>
            )}
          </div>
          <div className="space-y-2 text-sm hidden">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input
              id="file"
              ref={fileInputRef}
              type="file"
              placeholder="File"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </CardContent>
        <CardFooter className="w-full justify-evenly">
          <Button type="submit" size="lg" disabled={!file}>
            Upload
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

function PreviewImage({
  src,
  func,
  file,
}: {
  src: string | null;
  func: () => void;
  file: File | null;
}) {
  return (
    src && (
      <Card>
        <CardContent className="h-full flex flex-col justify-evenly gap-5">
          <div className="mt-2">
            <Image
              width={500}
              height={250}
              src={src}
              alt="Preview"
              className="w-full max-w-xs mx-auto rounded-md"
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={func}
                  disabled={!file}
                  hidden={!file}
                >
                  <X className="text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm pb-2">Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
    )
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
