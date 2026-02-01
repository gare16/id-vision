"use client";

import { ColumnDef } from "@tanstack/react-table";

import { LocationActionsCell } from "../(components)/location-actions-cell";

export type Location = {
  id: number;
  name: string;
};

// Define the columns for the locations table
export const locationColumns: ColumnDef<Location>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const location = row.original;
      return <LocationActionsCell location={location} />;
    },
  },
];
