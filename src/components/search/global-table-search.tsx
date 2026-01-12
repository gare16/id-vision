"use client";
import { Table } from "@tanstack/react-table";
import { useState } from "react";

import { Input } from "@/components/ui/input";

interface GlobalTableSearchInputProps<TData> {
  table: Table<TData>;
  placeholder?: string;
  className?: string;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

export function GlobalTableSearchInput<TData>({
  placeholder = "Search...",
  className,
  onSearchChange,
  searchValue,
}: GlobalTableSearchInputProps<TData>) {
  const [isInputVisible, setInputVisible] = useState(false);

  const handleSearchIconClick = () => {
    setInputVisible(!isInputVisible);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <div className="flex items-center">
      <SearchIcon
        className={`transition-all duration-500 ${
          !isInputVisible
            ? "h-5 w-5 mr-5 my-2 cursor-pointer"
            : "h-4 w-4 mr-2.5 my-2 cursor-pointer scale-90"
        }`}
        onClick={handleSearchIconClick}
      />
      <div
        className={`transition-all duration-500 fade-in-35 overflow-hidden ${
          isInputVisible
            ? "max-w-125 opacity-90 translate-x-0 mr-3"
            : "max-w-0 opacity-0 translate-x-4"
        }`}
      >
        {isInputVisible && (
          <Input
            value={searchValue ?? ""}
            onChange={handleInputChange}
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
