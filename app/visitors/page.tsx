import { z } from "zod";

import { columnVisitors } from "@/components/table/visitors/column";
import { VisitorDataTable } from "@/components/table/visitors/visitors-table";
import { getVisitor } from "@/lib/action/visitor";
import { visitorSchema } from "@/schema/visitors-schema";

export default async function Page() {
  const data = await getVisitor();
  return (
    <>
      <VisitorDataTable<z.infer<typeof visitorSchema>, unknown>
        columns={columnVisitors}
        title="List of Visitors"
        subtitle="Manage and view all visitors information"
        data={data}
        filters={["nationality", "placeDestination"]}
      />
    </>
  );
}
