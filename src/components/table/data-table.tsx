import { Tabs } from "@/components/ui/tabs";
import { TableToolbar } from "./table-toolbar";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export async function DataTableProvider({
  defaultValue,
  tableToolbarDesc,
  children,
  className,
}: {
  defaultValue: string;
  tableToolbarDesc: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Tabs
      defaultValue={defaultValue}
      className={cn("flex w-full flex-col justify-start gap-6", className)}
    >
      <TableToolbar value={defaultValue} desc={tableToolbarDesc} />
      {children}
    </Tabs>
  );
}
