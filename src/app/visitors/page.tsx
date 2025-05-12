import { DataTableProvider } from "@/components/table/data-table";
import { TableVisitors } from "@/components/table/visitors/visitors-table";
import { getPengunjung } from "@/lib/action/pengunjung";

export default async function Page() {
  const data = await getPengunjung();
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
