"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import OCRUploader from "@/components/ocr/new-ocr";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createVisitor } from "@/lib/action/visitor";
import { KTPData } from "@/types/ktp";
import { parseKTPText } from "@/utils/parse-ktp";

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

    // Extract all form data
    const visitorData = {
      nik: formData.get("nik") as string,
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      birthInfo: formData.get("birthInfo") as string,
      nationality: formData.get("nationality") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      organization: formData.get("organization") as string,
      visitingPurpose: formData.get("visitingPurpose") as string,
      placeDestination: formData.get("placeDestination") as string,
      vehicleNumber: formData.get("vehicleNumber") as string,
    };

    startTransition(async () => {
      await createVisitor(visitorData).then((res) => {
        if (!res.success) {
          console.error(res.error);
        } else {
          console.log("Created:", res.data);
          toast.success("Visitor registered successfully!");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    });
  };

  return (
    <main className="p-6">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Visitor Registration
          </CardTitle>
          <CardDescription>
            Fill in visitor details using KTP OCR or manual entry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4">
            <OCRUploader onTextExtracted={handleExtractedText} />

            <Separator />

            <form
              onSubmit={handleCreateVisitor}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Personal Information Section */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-3 text-primary">
                  Personal Information
                </h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nik">NIK (Card Number)</Label>
                <Input
                  id="nik"
                  name="nik"
                  defaultValue={formData?.nik || ""}
                  placeholder="Enter NIK"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Visitor Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={formData?.name || ""}
                  placeholder="Enter name"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={formData?.address || ""}
                  placeholder="Enter address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthInfo">Birth Info</Label>
                <Input
                  id="birthInfo"
                  name="birthInfo"
                  type="date"
                  defaultValue={formData?.birthInfo || ""}
                  placeholder="Enter birth info"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  defaultValue={formData?.nationality || ""}
                  placeholder="Enter nationality"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  defaultValue=""
                  placeholder="Enter phone number"
                  type="tel"
                />
              </div>

              {/* Visit Information Section */}
              <Separator className="md:col-span-2 my-4" />

              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-3 text-primary">
                  Visit Information
                </h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">
                  Organization (Asal Instansi)
                </Label>
                <Input
                  id="organization"
                  name="organization"
                  defaultValue=""
                  placeholder="Enter organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visitingPurpose">Visiting Purpose</Label>
                <Input
                  id="visitingPurpose"
                  name="visitingPurpose"
                  defaultValue=""
                  placeholder="Enter visiting purpose"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeDestination">Place Destination</Label>
                <Input
                  id="placeDestination"
                  name="placeDestination"
                  defaultValue=""
                  placeholder="Enter destination"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                <Input
                  id="vehicleNumber"
                  name="vehicleNumber"
                  defaultValue=""
                  placeholder="Enter vehicle number"
                />
              </div>

              <div className="md:col-span-2 pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full md:w-auto"
                >
                  {isPending ? "Creating..." : "Register Visitor"}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
