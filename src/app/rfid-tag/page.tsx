import { DataTableProvider } from "@/components/table/data-table";
import { TableRFIDTag } from "@/components/table/rfid-tag/rfid-tag-table";
import { getRfidTag } from "@/lib/action/rfid";

export default async function Page() {
  const data = await getRfidTag();
  return (
    <DataTableProvider
      className="mt-5"
      defaultValue="rfid_tag"
      tableToolbarDesc="RFID Tag"
    >
      <TableRFIDTag data={data} contentValue="rfid_tag" />
    </DataTableProvider>
  );
}
