import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TableToolbar({ value, desc }: { value: string; desc: string }) {
  return (
    <div className="flex items-center justify-between px-4 lg:px-6">
      <Label htmlFor="view-selector" className="sr-only">
        View
      </Label>
      <Select defaultValue={value}>
        <SelectTrigger
          className="@4xl/main:hidden flex w-fit"
          id="view-selector"
        >
          <SelectValue placeholder="Select a view" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={value}>{desc}</SelectItem>
        </SelectContent>
      </Select>
      <TabsList className="@4xl/main:flex hidden">
        <TabsTrigger value={value} className="gap-1">
          {desc}
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
