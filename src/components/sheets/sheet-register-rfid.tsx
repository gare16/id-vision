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
import { RegisterRFIDSchema } from "@/schema/rfid-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createRfidTag } from "@/lib/action/rfid";
import { useTransition } from "react";

export function SheetRegisterRFID({
  item,
}: {
  item: z.infer<typeof RegisterRFIDSchema>;
}) {
  const [isPending, startTransition] = useTransition();
  const handleCreateRFID = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rfid_tag = formData.get("rfid_tag") as string;
    const s = formData.get("status");
    const status = s === "active";

    console.log({ rfid_tag, status });
    startTransition(async () => {
      await createRfidTag({ rfid_tag, status }).then((res) => {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default">Register</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className=" px-4 flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>Register New RFID</SheetTitle>
          <SheetDescription>
            Adding new RFID Tag to increase more RFID
          </SheetDescription>
        </SheetHeader>
        <div className="w-full flex justify-center items-center">
          <div className="w-full flex flex-col gap-4 overflow-y-auto py-4 text-sm md:w-2/5">
            <form className="flex flex-col gap-4" onSubmit={handleCreateRFID}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="address">RFID Tag</Label>
                  <Input
                    name="rfid_tag"
                    defaultValue={item.rfid_tag}
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <Label>Status</Label>
                    <Select
                      name="status"
                      defaultValue={
                        item.status === "denied" ? "inactive" : "active"
                      }
                    >
                      <SelectTrigger
                        className="@[767px]/card:hidden flex w-40"
                        aria-label="Select a value"
                      >
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="active" className="rounded-lg">
                          Active
                        </SelectItem>
                        <SelectItem value="inactive" className="rounded-lg">
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <SheetFooter className="w-full mt-auto  flex gap-2 justify-center items-center sm:space-x-0">
                <Button type="submit" className="w-2/5">
                  {isPending ? "Creating..." : "Create"}
                </Button>
              </SheetFooter>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
