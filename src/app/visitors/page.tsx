import { columnVisitors } from "@/components/table/visitors/column";
import { VisitorDataTable } from "@/components/table/visitors/visitors-table";
import { getVisitor } from "@/lib/action/visitor";

export default async function Page() {
  const data = await getVisitor();
  return (
    <>
      <VisitorDataTable
        columns={columnVisitors}
        data={data}
        filters={["nationality", "placeDestination"]}
      />
    </>
  );
}
