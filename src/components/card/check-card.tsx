import { BadgeAlert, Check, X, Info } from "lucide-react";
import { z } from "zod";

import { formatDateToLocaleString } from "@/lib/format-date";
import { RFIDCheckPayloadSchema } from "@/schema/mqtt-payload";

import { SheetRegisterRFID } from "../sheets/sheet-register-rfid";
import { Badge, BadgeVariantsType } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

const CheckCardRFID = ({
  items,
}: {
  items: z.infer<typeof RFIDCheckPayloadSchema> | undefined;
}) => {
  const getStatusDisplay = (status: string | undefined) => {
    switch (status) {
      case "available":
        return {
          icon: <Check className="h-5 w-5" />,
          title: "RFID Tag Active",
          description: "This RFID tag is active and registered.",
          badgeVariant: "success",
        };
      case "unavailable":
        return {
          icon: <BadgeAlert className="h-5 w-5" />,
          title: "RFID Tag Not Found",
          description: "This RFID tag is not recognized in the system.",
          badgeVariant: "warning",
        };
      case "denied":
        return {
          icon: <X className="h-5 w-5" />,
          title: "Access Denied",
          description: "This RFID tag is registered but access is denied.",
          badgeVariant: "destructive",
        };
      case "Inactive":
        return {
          icon: <BadgeAlert className="h-5 w-5" />,
          title: "RFID Tag Inactive",
          description: "This RFID tag is inactive. Please register it.",
          badgeVariant: "warning",
        };
      default:
        return {
          icon: <Info className="h-5 w-5" />,
          title: "Checking RFID",
          description: "Awaiting RFID tag scan...",
          badgeVariant: "secondary",
        };
    }
  };

  const { icon, title, description, badgeVariant } = getStatusDisplay(
    items?.status,
  );

  return (
    <Card className="w-96">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 pb-2">
          <Badge
            variant={badgeVariant as BadgeVariantsType}
            className="text-sm px-3 py-1.5 flex items-center space-x-2"
          >
            {icon}
            <CardTitle className="text-xl font-bold m-0 text-white">
              {title}
            </CardTitle>
          </Badge>
        </div>
        <CardDescription className="text-base text-center">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-md font-semibold mb-1">RFID Tag Details:</h4>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {items?.rfidTag || "N/A"}
          </p>
          <p className="text-xs text-gray-500">
            Last Processed: {formatDateToLocaleString(items?.processedAt)}
          </p>
        </div>

        {items?.visitor && (
          <>
            <Separator className="my-4" />
            <div>
              <h4 className="text-md font-semibold mb-2">
                Visitor Information:
              </h4>
              <div className="grid grid-cols-1 gap-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {items.visitor.name}
                </p>
                <p>
                  <span className="font-medium">NIK:</span> {items.visitor.nik}
                </p>
                {items.visitor.organization && (
                  <p>
                    <span className="font-medium">Organization:</span>{" "}
                    {items.visitor.organization}
                  </p>
                )}
                {items.visitor.phoneNumber && (
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {items.visitor.phoneNumber}
                  </p>
                )}
                {items.visitor.visitingPurpose && (
                  <p>
                    <span className="font-medium">Purpose:</span>{" "}
                    {items.visitor.visitingPurpose}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        {items?.status === "Inactive" && <SheetRegisterRFID item={items} />}
      </CardFooter>
    </Card>
  );
};

export default CheckCardRFID;
