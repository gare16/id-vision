import { ReactNode } from "react";

import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { TableToolbar } from "./table-toolbar";

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
