import { z } from "zod";

import { getColumnVisitors } from "@/components/table/visitors/column";
import { VisitorDataTable } from "@/components/table/visitors/visitors-table";
import { getRfidTag } from "@/lib/action/rfid";
import { getVisitor } from "@/lib/action/visitor";
import { visitorSchema } from "@/schema/visitors-schema";

import { getAllLocations } from "../locations/(actions)/location";

export default async function Page() {
  const data = await getVisitor();
  const listLocations = await getAllLocations();
  const listActiveRFID = await getRfidTag();
  const columns = getColumnVisitors({
    locations: listLocations,
    activeRfid: listActiveRFID,
  });

  return (
    <>
      <VisitorDataTable<z.infer<typeof visitorSchema>, unknown>
        columns={columns}
        title="List of Visitors"
        subtitle="Manage and view all visitors information"
        data={data}
        filters={["nationality", "placeDestination"]}
      />
    </>
  );
}
