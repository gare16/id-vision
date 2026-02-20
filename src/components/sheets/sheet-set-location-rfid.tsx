"use client";

import { CheckIcon, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";

import {
  getRfidTagLocations,
  setRfidTagLocations,
} from "@/lib/action/rfid-location";
import { cn } from "@/lib/utils";
import { RFIDTagSchema } from "@/schema/rfid-schema";

import { getAllLocations } from "../../../app/locations/(actions)/location";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export function SheetSetLocationRFID({
  item,
}: {
  item: z.infer<typeof RFIDTagSchema>;
}) {
  const [isPending, startTransition] = useTransition();
  const [locations, setLocations] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedLocation, setSelectedLocation] = useState<number[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Ambil semua lokasi yang tersedia
      const locationsRes = await getAllLocations();
      setLocations(locationsRes);

      // Ambil lokasi saat ini untuk RFID tag ini
      const rfidLocations = await getRfidTagLocations(item.rfidTag);
      setCurrentLocation(rfidLocations.map((loc) => loc.Location.name));
      setSelectedLocation(rfidLocations.map((loc) => loc.locationId));
    };

    fetchData();
  }, [item.rfidTag]);

  const handleLocationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await setRfidTagLocations({
        rfidTag: item.rfidTag,
        locationIds: selectedLocation,
      });

      if (!result.success) {
        console.error("Failed to set locations:", result.error);
        alert(`Error: ${result.error}`);
      } else {
        console.log("Locations set successfully:", result.data);
        window.location.reload();
      }
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-full hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          Set Location
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="px-4 flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>
            Set Location for {item.Visitor?.name ?? "Unknown Visitor"}
          </SheetTitle>
          <SheetDescription>Manage RFID Tag locations</SheetDescription>
        </SheetHeader>
        <div className="w-full flex justify-center items-center">
          <div className="w-full flex flex-col gap-4 overflow-y-auto py-4 text-sm md:w-1/5">
            <form
              className="flex flex-col gap-4"
              onSubmit={handleLocationSubmit}
            >
              <div className="flex flex-col gap-3">
                <Label htmlFor="currentLocation">Current Locations</Label>
                <div className="flex flex-wrap gap-1 rounded-md border p-2">
                  {currentLocation.length > 0 ? (
                    currentLocation.map((locName) => (
                      <Badge key={locName}>{locName}</Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">Not assigned</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="location">Select Location</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full h-auto pr-2"
                    >
                      <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                        {" "}
                        {selectedLocation.length === 0 && "Select locations..."}
                        {locations
                          .filter((location) =>
                            selectedLocation.includes(location.id),
                          )
                          .map((location) => (
                            <Badge key={location.id} variant="secondary">
                              {location.name}
                              <XIcon
                                className="ml-1 size-3 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLocation((prev) =>
                                    prev.filter((id) => id !== location.id),
                                  );
                                }}
                              />
                            </Badge>
                          ))}
                      </div>
                      <PlusIcon className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search location..." />
                      <CommandEmpty>No location found.</CommandEmpty>
                      <CommandGroup>
                        {locations.map((location) => (
                          <CommandItem
                            key={location.id}
                            onSelect={() => {
                              setSelectedLocation((prev) =>
                                prev.includes(location.id)
                                  ? prev.filter((id) => id !== location.id)
                                  : [...prev, location.id],
                              );
                            }}
                          >
                            <Checkbox
                              checked={selectedLocation.includes(location.id)}
                              onCheckedChange={() => {
                                setSelectedLocation((prev) =>
                                  prev.includes(location.id)
                                    ? prev.filter((id) => id !== location.id)
                                    : [...prev, location.id],
                                );
                              }}
                              className="mr-2"
                            />
                            {location.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto size-4",
                                selectedLocation.includes(location.id)
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <SheetFooter className="w-full mt-auto flex justify-center items-center">
                <Button type="submit" className="w-2/5">
                  {isPending ? "Setting..." : "Set Location"}
                </Button>
              </SheetFooter>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
