import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { RFIDPayloadSchema } from "@/schema/mqtt-payload";
import { BadgeAlert, Check, X } from "lucide-react";
import { SheetRegisterRFID } from "../sheets/sheet-register-rfid";

const CheckCardRFID = ({
  items,
}: {
  items: z.infer<typeof RFIDPayloadSchema> | undefined;
}) => {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardDescription className="flex justify-between ">
          <CardTitle className="h-full my-auto">Check RFID</CardTitle>
          {items?.status === "available" ? (
            <Check className="text-green-400" />
          ) : items?.status === "unavailable" ? (
            <BadgeAlert className="text-yellow-400" />
          ) : items?.status === "denied" ? (
            <X className="text-red-400" />
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h1>
          {items?.status === "denied" ? "Card Not Registered" : items?.rfid_tag}
        </h1>
      </CardContent>
      <CardFooter>
        <h1 className="uppercase">{items?.name}</h1>
        {items?.status === "denied" ? <SheetRegisterRFID item={items} /> : null}
      </CardFooter>
    </Card>
  );
};

export default CheckCardRFID;
