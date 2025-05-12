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

export function SheetEditRFIDTag({
  item,
}: {
  item: z.infer<typeof RFIDTagSchema>;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-full hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          Edit
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className=" px-4 flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{item.Pengunjung?.nama}</SheetTitle>
          <SheetDescription>Showing RFID Tag to Edit</SheetDescription>
        </SheetHeader>
        <div className="w-full flex justify-center items-center">
          <div className="w-full flex flex-col gap-4 overflow-y-auto py-4 text-sm md:w-1/5">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const status = formData.get("status");
                const statusBoolean = status === "active";
                console.log(statusBoolean);
              }}
            >
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={item.Pengunjung?.nama ?? ""} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="rfid_tag">RFID_Tag</Label>
                  <Input id="rfid_tag" defaultValue={item.rfid_tag} disabled />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <Label>Status</Label>
                  <Select
                    name="status"
                    defaultValue={item.status === true ? "active" : "inactive"}
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

              <SheetFooter className="w-full mt-auto  flex gap-2 justify-center items-center sm:space-x-0">
                <Button type="submit" className="w-2/5">
                  Submit
                </Button>
              </SheetFooter>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
