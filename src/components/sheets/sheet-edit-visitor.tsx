"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import { updateVisitor } from "@/lib/action/visitor";
import { visitorSchema } from "@/schema/visitors-schema";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface ActiveRfid {
  rfidTag: string;
  nik: string | null;
  status: boolean;
  visitor?: {
    name: string;
  } | null;
}

interface SheetEditVisitorProps {
  item: z.infer<typeof visitorSchema>;
  locations?: { id: number; name: string }[];
  activeRfid?: ActiveRfid[];
}

export function SheetEditVisitor({
  item,
  locations = [],
  activeRfid = [],
}: SheetEditVisitorProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedRfidTag, setSelectedRfidTag] = useState<string | null>(null);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    item.placeDestination ? item.placeDestination.split(",") : [],
  );

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      nik: formData.get("nik") as string,
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      birthInfo: formData.get("birthInfo") as string,
      nationality: formData.get("nationality") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      organization: formData.get("organization") as string,
      visitingPurpose: formData.get("visitingPurpose") as string,
      placeDestination: selectedDestinations,
      vehicleNumber: formData.get("vehicleNumber") as string,
      rfidTag: selectedRfidTag,
    };

    startTransition(async () => {
      await updateVisitor(data)
        .then((res) => {
          if (!res.success) {
            toast.error("Failed to update visitor: " + res.error);
          } else {
            toast.success("Visitor updated successfully!");
            window.location.reload();
          }
        })
        .catch((error) => {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred");
        });
    });
  };

  const activeRfids = activeRfid.filter((rfid) => rfid.status);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-full hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          Edit
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="px-4 flex flex-col h-[80vh]">
        <SheetHeader className="gap-1">
          <SheetTitle>{item.name}</SheetTitle>
          <SheetDescription>Edit visitor information</SheetDescription>
        </SheetHeader>
        <div className="w-full flex justify-center items-center">
          <div className="w-full flex flex-col gap-4 overflow-y-auto py-4 text-sm md:w-2/5">
            <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
              {/* Personal Information Section */}
              <div>
                <h2 className="text-base font-semibold mb-3 text-primary">
                  Personal Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="nik">NIK</Label>
                    <Input name="nik" defaultValue={item.nik} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" defaultValue={item.name} />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="address">Address</Label>
                  <Input name="address" defaultValue={item.address} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="birthInfo">Date of Birth</Label>
                    <Input
                      name="birthInfo"
                      type="date"
                      defaultValue={item.birthInfo}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      name="nationality"
                      defaultValue={item.nationality ?? ""}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      name="phoneNumber"
                      defaultValue={item.phoneNumber ?? ""}
                      type="tel"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      name="organization"
                      defaultValue={item.organization ?? ""}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Visit Information Section */}
              <div>
                <h2 className="text-base font-semibold mb-3 text-primary">
                  Visit Information
                </h2>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="visitingPurpose">Visiting Purpose</Label>
                  <Input
                    name="visitingPurpose"
                    defaultValue={item.visitingPurpose ?? ""}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Place Destination</Label>
                  <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={location.name}
                          value={location.name}
                          checked={selectedDestinations.includes(location.name)}
                          onCheckedChange={(checked) => {
                            setSelectedDestinations((prev) =>
                              checked
                                ? [...prev, location.name]
                                : prev.filter((d) => d !== location.name),
                            );
                          }}
                        />
                        <Label
                          htmlFor={location.name}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {location.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    name="vehicleNumber"
                    defaultValue={item.vehicleNumber ?? ""}
                  />
                </div>

                {/* RFID Card Selection */}
                {activeRfids.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="rfidTag">RFID Card</Label>
                    <select
                      name="rfidTag"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedRfidTag || ""}
                      onChange={(e) =>
                        setSelectedRfidTag(e.target.value || null)
                      }
                    >
                      <option value="">Select RFID Card</option>
                      {activeRfids.map((rfid) => (
                        <option key={rfid.rfidTag} value={rfid.rfidTag}>
                          {rfid.visitor?.name
                            ? `${rfid.rfidTag} - ${rfid.visitor.name}`
                            : rfid.rfidTag}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <SheetFooter className="w-full mt-auto flex gap-2 justify-center items-center sm:space-x-0">
                <Button type="submit" className="w-2/5">
                  {isPending ? "Updating..." : "Update"}
                </Button>
              </SheetFooter>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
