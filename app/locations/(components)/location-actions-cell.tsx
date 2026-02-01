"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deleteLocation } from "../(actions)/location";
import { EditLocationDialog } from "../(components)/edit-location";

type ActionsCellProps = {
  location: {
    id: number;
    name: string;
  };
};

export function LocationActionsCell({ location }: ActionsCellProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this location?")) {
      try {
        await deleteLocation(id);
        // Refresh the data after deletion
        window.location.reload(); // Simple refresh - in a real app you'd update state
      } catch (error) {
        console.error("Error deleting location:", error);
        alert("Failed to delete location: " + (error as Error).message);
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(location.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditLocationDialog
        location={location}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSaved={() => window.location.reload()}
      />
    </>
  );
}
