"use client";

import { useSortable } from "@dnd-kit/sortable";
import { ColumnDef } from "@tanstack/react-table";
import { GripVerticalIcon, MoreVerticalIcon } from "lucide-react";
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

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}
export const columnVisitors: ColumnDef<z.infer<typeof visitorSchema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "nik",
    header: () => <div className="w-full text-left">NIK</div>,
    cell: ({ row }) => (
      <>
        <Label htmlFor={`${row.original.id}-nik`} className="sr-only">
          NIK
        </Label>
        <p
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
          id={`${row.original.id}-nik`}
        >
          {row.original.nik}
        </p>
      </>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="w-full text-left">Nama</div>,
    cell: ({ row }) => (
      <>
        <Label htmlFor={`${row.original.id}-name`} className="sr-only">
          Nama
        </Label>
        <p
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
          id={`${row.original.id}-name`}
        >
          {row.original.name}
        </p>
      </>
    ),
  },
  {
    accessorKey: "address",
    header: () => <div className="w-full text-left">Address</div>,
    cell: ({ row }) => (
      <>
        <Label htmlFor={`${row.original.id}-address`} className="sr-only">
          Address
        </Label>
        <p
          className="h-full w-64 border-transparent text-pretty bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
          id={`${row.original.id}-address`}
        >
          {row.original.address}
        </p>
      </>
    ),
  },
  {
    accessorKey: "nationality",
    header: () => <div className="w-full text-left">Nationality</div>,
    cell: ({ row }) => (
      <>
        <Label htmlFor={`${row.original.id}-nationality`} className="sr-only">
          Nationality
        </Label>
        <p
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
          id={`${row.original.id}-nationality`}
        >
          {row.original.nationality ?? "-"}
        </p>
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
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
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
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
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
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
          id={`${row.original.id}-placeDestination`}
        >
          {row.original.placeDestination ?? "-"}
        </p>
      </>
    ),
  },
  {
    accessorKey: "personToVisit",
    header: () => <div className="w-full text-left">Person to Visit</div>,
    cell: ({ row }) => (
      <>
        <Label htmlFor={`${row.original.id}-personToVisit`} className="sr-only">
          Person to Visit
        </Label>
        <p
          className="h-8 max-w-32 wrap-break-word border-transparent bg-transparent text-left shadow-none focus-visible:border focus-visible:bg-background"
          id={`${row.original.id}-personToVisit`}
        >
          {row.original.personToVisit ?? "-"}
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
          <SheetEditVisitor item={row.original} />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
