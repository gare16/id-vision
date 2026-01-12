"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SimplePaginationState {
  page: number; // 1-based
  pageSize: number;
  total: number;
}

interface TablePaginationProps<TData> {
  // For TanStack tables
  table?: Table<TData>;
  // For simple pagination (arrays, server-side)
  pagination?: SimplePaginationState;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  // Common
  isLoading?: boolean;
  className?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function TablePagination<TData>({
  table,
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  isLoading = false,
  className,
}: TablePaginationProps<TData>) {
  // Derive pagination state from either TanStack table or simple pagination
  const isTableMode = !!table;

  // For TanStack table
  const tablePageIndex = table?.getState().pagination.pageIndex ?? 0;
  const tablePageSize = table?.getState().pagination.pageSize ?? 10;
  const tableRowCount = table?.getFilteredRowModel().rows.length ?? 0;
  const tableTotalPages = table?.getPageCount() ?? 0;

  // For simple pagination
  const simplePage = pagination?.page ?? 1;
  const simplePageSize = pagination?.pageSize ?? 10;
  const simpleTotal = pagination?.total ?? 0;
  const simpleTotalPages = Math.ceil(simpleTotal / simplePageSize);

  // Unified values (convert to 1-based for display)
  const currentPage = isTableMode ? tablePageIndex + 1 : simplePage;
  const pageSize = isTableMode ? tablePageSize : simplePageSize;
  const total = isTableMode ? tableRowCount : simpleTotal;
  const totalPages = isTableMode ? tableTotalPages : simpleTotalPages;

  const startItem = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, total);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Navigation handlers
  const goToPage = (page: number) => {
    if (isTableMode && table) {
      table.setPageIndex(page - 1); // Convert to 0-based
    } else if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (isTableMode && table) {
      table.setPageSize(size);
    } else if (onPageSizeChange) {
      onPageSizeChange(size);
    }
  };

  // Generate page numbers to show
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const showPages = 5;

    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4",
        className,
      )}
    >
      {/* Results info */}
      <p className="text-sm text-muted-foreground whitespace-nowrap">
        {total > 0 ? (
          <>
            Showing{" "}
            <span className="font-medium">
              {startItem}-{endItem}
            </span>{" "}
            of <span className="font-medium">{total}</span> result(s)
          </>
        ) : (
          "No results"
        )}
      </p>

      {/* Page Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Page */}
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => goToPage(currentPage - 1)}
          disabled={!canGoPrevious || isLoading}
        >
          <ChevronLeft className="size-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-1 mx-1">
          {getPageNumbers().map((pageNum, idx) =>
            pageNum === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                className="size-8 flex items-center justify-center border border-input rounded-md text-muted-foreground text-sm"
              >
                ···
              </span>
            ) : (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "default" : "outline"}
                size="icon"
                className="size-8"
                onClick={() => goToPage(pageNum)}
                disabled={isLoading}
              >
                {pageNum}
              </Button>
            ),
          )}
        </div>

        {/* Mobile Page Indicator */}
        <span className="sm:hidden px-3 text-sm text-muted-foreground">
          Page {currentPage} of {totalPages || 1}
        </span>

        {/* Next Page */}
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => goToPage(currentPage + 1)}
          disabled={!canGoNext || isLoading}
        >
          <ChevronRight className="size-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>

      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Rows per page:
        </span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => handlePageSizeChange(Number(value))}
          disabled={isLoading}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
