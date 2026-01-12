import { DataTableProvider } from "@/components/table/data-table";
import { DailyTableLogVisitors } from "@/components/table/log-visitors.tsx/log-visitors-table";
import { getLogPengunjung } from "@/lib/action/log-pengunjung";

interface SearchParams {
  type?: "IN" | "OUT";
}

export default async function LogsVisitors({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { type } = searchParams;
  const dataLog = await getLogPengunjung();

  // Filter data based on type if provided
  const filteredData = type
    ? dataLog.filter((log) => log.visitType === type)
    : dataLog;

  return (
    <DataTableProvider
      className="mt-5"
      defaultValue="log_visitor"
      tableToolbarDesc="Log Visitor"
    >
      <DailyTableLogVisitors
        data={filteredData}
        contentValue="log_visitor"
        initialFilterType={type || "all"}
      />
    </DataTableProvider>
  );
}
