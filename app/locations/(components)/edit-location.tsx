"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { updateLocation } from "../(actions)/location";

const formSchema = z.object({
  name: z.string().min(1, "Location name is required").max(255),
});

type FormData = z.infer<typeof formSchema>;

type EditLocationDialogProps = {
  location: {
    id: number;
    name: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export function EditLocationDialog({
  location,
  isOpen,
  onClose,
  onSaved,
}: EditLocationDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: location.name,
    },
  });

  async function onSubmit(values: FormData) {
    setLoading(true);
    try {
      await updateLocation(location.id, values);
      form.reset();
      onClose();
      onSaved();
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to update location: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>
            Update the details for the location.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Update Location"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}