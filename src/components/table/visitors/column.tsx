"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreVerticalIcon } from "lucide-react";
import { z } from "zod";

import { SheetEditVisitor } from "@/components/sheets/sheet-edit-visitor";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { visitorSchema } from "@/schema/visitors-schema";

interface ActiveRfid {
  rfidTag: string;
  nik: string | null;
  status: boolean;
  visitor?: {
    name: string;
  } | null;
}

interface GetColumnVisitorsProps {
  locations?: { id: number; name: string }[];
  activeRfid?: ActiveRfid[];
}

export function getColumnVisitors({
  locations = [],
  activeRfid = [],
}: GetColumnVisitorsProps = {}): ColumnDef<z.infer<typeof visitorSchema>>[] {
  return [
  {
    accessorKey: "name",
    header: () => <div className="w-full text-left">Nama</div>,
    cell: ({ row }) => (
      <>
        <Label htmlFor={`${row.original.id}-name`} className="sr-only">
          Nama
        </Label>
        <div className="flex flex-col">
          <p
            className="max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
            id={`${row.original.id}-name`}
          >
            {row.original.name}
          </p>
          <p className="text-sm text-muted-foreground">{row.original.nik}</p>
        </div>
      </>
    ),
  },
  {
    accessorKey: "nationality",
    header: () => <div className="w-full text-left">Address</div>,
    cell: ({ row }) => (
      <>
        <Label htmlFor={`${row.original.id}-address`} className="sr-only">
          Address
        </Label>
        <div className="flex flex-col">
          <p
            className="h-full w-64 border-transparent text-pretty bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
            id={`${row.original.id}-address`}
          >
            {row.original.address}
          </p>
          <p className="font-mono font-semibold">
            {row.original.nationality ?? "-"}
          </p>
        </div>
      </>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="w-full text-left">Phone Number</div>,
    cell: ({ row }) => (
      <>
        <Label htmlFor={`${row.original.id}-phoneNumber`} className="sr-only">
          Phone Number
        </Label>
        <p
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background truncate"
          id={`${row.original.id}-phoneNumber`}
        >
          {row.original.phoneNumber ?? "-"}
        </p>
      </>
    ),
  },
  {
    accessorKey: "organization",
    header: () => <div className="w-full text-left">Organization</div>,
    cell: ({ row }) => (
      <>
        <Label htmlFor={`${row.original.id}-organization`} className="sr-only">
          Organization
        </Label>
        <p
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
          id={`${row.original.id}-organization`}
        >
          {row.original.organization ?? "-"}
        </p>
      </>
    ),
  },
  {
    accessorKey: "visitingPurpose",
    header: () => <div className="w-full text-left">Visiting Purpose</div>,
    cell: ({ row }) => (
      <>
        <Label
          htmlFor={`${row.original.id}-visitingPurpose`}
          className="sr-only"
        >
          Visiting Purpose
        </Label>
        <p
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background truncate"
          id={`${row.original.id}-visitingPurpose`}
        >
          {row.original.visitingPurpose ?? "-"}
        </p>
      </>
    ),
  },
  {
    accessorKey: "placeDestination",
    header: () => <div className="w-full text-left">Place Destination</div>,
    cell: ({ row }) => (
      <>
        <Label
          htmlFor={`${row.original.id}-placeDestination`}
          className="sr-only"
        >
          Place Destination
        </Label>
        <p
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background truncate"
          id={`${row.original.id}-placeDestination`}
        >
          {row.original.placeDestination ?? "-"}
        </p>
      </>
    ),
  },
  {
    accessorKey: "vehicleNumber",
    header: () => <div className="w-full text-left">Vehicle Number</div>,
    cell: ({ row }) => (
      <>
        <Label htmlFor={`${row.original.id}-vehicleNumber`} className="sr-only">
          Vehicle Number
        </Label>
        <p
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
          id={`${row.original.id}-vehicleNumber`}
        >
          {row.original.vehicleNumber ?? "-"}
        </p>
      </>
    ),
  },
  {
    accessorKey: "born",
    header: () => <div className="w-full text-left">Date of Birth</div>,
    cell: ({ row }) => (
      <>
        <Label htmlFor={`${row.original.id}-born`} className="sr-only">
          Date of Birth
        </Label>
        <p
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
          id={`${row.original.id}-born`}
        >
          {row.original.birthInfo}
        </p>
      </>
    ),
  },
  {
    id: "actions",
    header: () => <div className="w-full text-left">Action</div>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-32">
          <SheetEditVisitor
            item={row.original}
            locations={locations}
            activeRfid={activeRfid}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
}
