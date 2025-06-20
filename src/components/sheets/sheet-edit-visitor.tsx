"use client";

import { visitorSchema } from "@/schema/visitors-schema";
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
import { useTransition } from "react";
import { updateVisitor } from "@/lib/action/visitor";

export function SheetEditVisitor({
  item,
}: {
  item: z.infer<typeof visitorSchema>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nik = formData.get("nik") as string;
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const birth_info = formData.get("birth_info") as string;
    const data = { nik, name, address, birth_info };
    console.log(data);
    startTransition(async () => {
      await updateVisitor(data).then((res) => {
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
        <button className="w-full hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          Edit
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className=" px-4 flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{item.name}</SheetTitle>
          <SheetDescription>
            Showing total visitors for the last 6 months
          </SheetDescription>
        </SheetHeader>
        <div className="w-full flex justify-center items-center">
          <div className="w-full flex flex-col gap-4 overflow-y-auto py-4 text-sm md:w-2/5">
            <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Name</Label>
                <Input name="name" defaultValue={item.name} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="nik">NIK</Label>
                  <Input name="nik" defaultValue={item.nik} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="address">Address</Label>
                  <Input name="address" defaultValue={item.address} />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="birth_info">Date of Birth</Label>
                  <Input name="birth_info" defaultValue={item.birth_info} />
                </div>
              </div>
              <SheetFooter className="w-full mt-auto  flex gap-2 justify-center items-center sm:space-x-0">
                <Button className="w-2/5">
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
