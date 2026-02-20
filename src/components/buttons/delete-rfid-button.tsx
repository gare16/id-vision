"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteRfidTag } from "@/lib/action/rfid";
import { RFIDTagSchema } from "@/schema/rfid-schema";

export function DeleteRFIDButton({
  item,
}: {
  item: z.infer<typeof RFIDTagSchema>;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const result = await deleteRfidTag({ rfid_tag: item.rfidTag });

      if (result.success) {
        toast.success(`RFID tag ${item.rfidTag} deleted successfully`);
        setOpen(false);
        router.refresh(); // Refresh the page to update the table
      } else {
        toast.error(`Failed to delete RFID tag: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting RFID tag:", error);
      toast.error("An error occurred while deleting the RFID tag");
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="mr-2 size-4" />
        Delete
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              RFID tag <strong>{item.rfidTag}</strong> and remove its
              association with any visitor. Related log entries will have their
              RFID tag reference cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
