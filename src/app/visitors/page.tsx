import { DataTableProvider } from "@/components/table/data-table";
import { TableVisitors } from "@/components/table/visitors/visitors-table";
import { getVisitor } from "@/lib/action/visitor";

export default async function Page() {
  const data = await getVisitor();
  return (
    <DataTableProvider
      defaultValue="visitors"
      tableToolbarDesc="Visitors"
      className="mt-5"
    >
      <TableVisitors valueContent="visitors" data={data} />
    </DataTableProvider>
  );
}
