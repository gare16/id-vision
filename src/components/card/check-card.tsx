import { BadgeAlert, Check, X } from "lucide-react";
import { z } from "zod";

import { RFIDCheckPayloadSchema } from "@/schema/mqtt-payload";

import { SheetRegisterRFID } from "../sheets/sheet-register-rfid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const CheckCardRFID = ({
  items,
}: {
  items: z.infer<typeof RFIDCheckPayloadSchema> | undefined;
}) => {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardDescription className="flex justify-between">
          <CardTitle className="h-full my-auto">Check RFID</CardTitle>
          {items?.status === "available" ? (
            <Check className="text-green-400" />
          ) : items?.status === "unavailable" ? (
            <BadgeAlert className="text-yellow-400" />
          ) : items?.status === "denied" ? (
            <X className="text-red-400" />
          ) : items?.status ? ( // Show a default icon if status exists but is not one of the known values
            <BadgeAlert className="text-gray-400" />
          ) : null}{" "}
          {/* Don't show an icon if status is undefined */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h1>
          {items?.status === "denied"
            ? "Card Not Registered"
            : items?.rfidTag || "Unknown Tag"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Location: {items?.location || "Unknown Location"}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        {items?.status === "Inactive" && <SheetRegisterRFID item={items} />}
      </CardFooter>
    </Card>
  );
};

export default CheckCardRFID;
