"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

interface TableSearchInputProps<TData> {
  table: Table<TData>;
  columnId: string;
  placeholder?: string;
  className?: string;
}

export function TableSearchInput<TData>({
  table,
  columnId,
  placeholder = "Search...",
  className,
}: TableSearchInputProps<TData>) {
  const [isInputVisible, setInputVisible] = useState(false);
  const column = table.getColumn(columnId);

  if (!column) return null;

  const handleSearchIconClick = () => {
    setInputVisible(!isInputVisible);
  };

  return (
    <div className="flex items-center">
      <SearchIcon
        className={`transition-all duration-500 ${
          !isInputVisible
            ? "h-5 w-5 mr-5 my-4 cursor-pointer"
            : "h-4 w-4 mr-2.5 my-4 cursor-pointer scale-90"
        }`}
        onClick={handleSearchIconClick}
      />
      <div
        className={`transition-all duration-500 fade-in-35 overflow-hidden ${
          isInputVisible
            ? "max-w-[500px] opacity-90 translate-x-0 mr-3"
            : "max-w-0 opacity-0 translate-x-4"
        }`}
      >
        {isInputVisible && (
          <Input
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder={placeholder}
            className={className}
          />
        )}
      </div>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
