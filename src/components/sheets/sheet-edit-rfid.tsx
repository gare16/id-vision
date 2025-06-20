"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { z } from "zod";
import { RFIDTagSchema } from "@/schema/rfid-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { visitorSchema } from "@/schema/visitors-schema";
import { useEffect, useState, useTransition } from "react";
import { updateRfidTag } from "@/lib/action/rfid";

export function SheetEditRFIDTag({
  item,
}: {
  item: z.infer<typeof RFIDTagSchema>;
}) {
  const [isPending, startTransition] = useTransition();
  const [visitors, setVisitors] = useState<z.infer<typeof visitorSchema>[]>([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      const res = await fetch("/api/visitors");
      const data = await res.json();
      setVisitors(data);
    };
    fetchVisitors();
  }, []);

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nik = formData.get("visitorNIK") as string;
    const s = formData.get("status");
    const rfid_tag = formData.get("rfid_tag") as string;
    const status = s === "active";
    console.log({ nik, rfid_tag, status });

    startTransition(async () => {
      await updateRfidTag({ nik, rfid_tag, status }).then((res) => {
        if (!res.success) {
          console.error(res.error);
        } else {
          console.log("Created: ", res.data);
          window.location.reload();
        }
      });
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-full hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          Edit
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="px-4 flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{item.Visitor?.name ?? "Unknown Visitor"}</SheetTitle>
          <SheetDescription>Showing RFID Tag to Edit</SheetDescription>
        </SheetHeader>
        <div className="w-full flex justify-center items-center">
          <div className="w-full flex flex-col gap-4 overflow-y-auto py-4 text-sm md:w-1/5">
            <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
              <div className="flex flex-col gap-3">
                <Label htmlFor="visitorNIK">Name</Label>
                {visitors.length > 0 && (
                  <Select
                    name="visitorNIK"
                    defaultValue={item.Visitor?.name ?? ""}
                  >
                    <SelectTrigger className="flex w-40">
                      <SelectValue placeholder="Select a visitor" />
                    </SelectTrigger>
                    <SelectContent>
                      {visitors.map((v) => (
                        <SelectItem key={v.nik} value={v.nik}>
                          {v.name}
                        </SelectItem>
                      ))}
                      <SelectItem value={" "}>None</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="rfid_tag">RFID Tag</Label>
                  <Input name="rfid_tag" value={item.rfid_tag} readOnly />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label>Status</Label>
                  <Select
                    name="status"
                    defaultValue={item.status ? "active" : "inactive"}
                  >
                    <SelectTrigger
                      className="flex w-40"
                      aria-label="Select status"
                    >
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SheetFooter className="w-full mt-auto flex justify-center items-center">
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
