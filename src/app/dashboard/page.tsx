import { ChartAreaInteractive } from "@/components/chart/chart-area-interactive";
import { SectionCards } from "@/components/dnd-card/dnd-section-card";
import { DataTableProvider } from "@/components/table/data-table";
import { DailyTableLogVisitors } from "@/components/table/log-visitors.tsx/log-visitors-table";
import {
  getChartLogPengunjung,
  getDailyTableLogVisitor,
} from "@/lib/action/log-pengunjung";
import { getDataSummaryCard } from "@/lib/action/rfid";

export default async function Dashboard() {
  const { chart } = await getChartLogPengunjung();
  const dataCard = await getDataSummaryCard();
  const log = await getDailyTableLogVisitor();
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 ">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards data={dataCard} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={chart} />
          </div>
          <DataTableProvider
            defaultValue="daily_log"
            tableToolbarDesc="Daily Log"
          >
            <DailyTableLogVisitors data={log} contentValue="daily_log" />
          </DataTableProvider>
        </div>
      </div>
    </div>
  );
}
