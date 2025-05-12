import { DataTableProvider } from "@/components/table/data-table";
import { DailyTableLogVisitors } from "@/components/table/log-visitors.tsx/log-visitors-table";
import { getLogPengunjung } from "@/lib/action/log-pengunjung";
export default async function LogsVisitors() {
  const dataLog = await getLogPengunjung();
  return (
    <DataTableProvider
      className="mt-5"
      defaultValue="log_visitor"
      tableToolbarDesc="Log Visitor"
    >
      <DailyTableLogVisitors data={dataLog} contentValue="log_visitor" />
    </DataTableProvider>
  );
}
