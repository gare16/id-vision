import dynamic from "next/dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRfidTag } from "@/lib/action/rfid";

import { getAllLocations } from "../locations/(actions)/location";

// Dynamically import the client component with SSR disabled
const VisitorForm = dynamic(() => import("@/components/visitor-form"), {
  ssr: true,
});

export default async function Home() {
  const listActiveRFID = await getRfidTag();
  const listLocations = await getAllLocations();
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
          <VisitorForm locations={listLocations} activeRfid={listActiveRFID} />
        </CardContent>
      </Card>
    </main>
  );
}
