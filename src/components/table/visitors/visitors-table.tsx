"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  ColumnFiltersState,
  OnChangeFn,
} from "@tanstack/react-table";
import { Building2, ChevronDown, Filter, Layers, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

import { GlobalTableSearchInput } from "@/components/search/global-table-search";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { fuzzyFilter } from "@/lib/search";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: string[];
  enableSearch?: boolean;
  storageKey?: string;
  clickable?: boolean;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

// Filter Chip component
function FilterChip({
  label,
  value,
  onRemove,
}: {
  label: string;
  value: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-action/10 text-action">
      <span className="text-muted-foreground">{label}:</span>
      {value}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-0.5 hover:bg-action/20 rounded-full p-0.5 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

// Filter Dropdown component
function FilterDropdown({
  label,
  icon: Icon,
  value,
  options,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 gap-2",
            value && "border-action text-action bg-action/5",
          )}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline max-w-30 truncate">
            {value || label}
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-45 max-h-75 overflow-y-auto"
      >
        <DropdownMenuItem
          onClick={() => onChange("")}
          className={cn(!value && "bg-muted")}
        >
          All {label}
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onChange(option)}
            className={cn(value === option && "bg-muted")}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Get label for filter column
function getFilterLabel(columnId: string) {
  const labels: Record<string, string> = {
    businessUnit: "Business Unit",
    level: "Level",
    placement: "Placement",
    division: "Division",
    location: "Location",
  };
  return (
    labels[columnId] || columnId.charAt(0).toUpperCase() + columnId.slice(1)
  );
}

// Get icon for filter column
function getFilterIcon(columnId: string) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    businessUnit: Building2,
    level: Layers,
    placement: Users,
    division: Building2,
    location: Building2,
  };
  return icons[columnId] || Filter;
}
export function VisitorDataTable<TData, TValue>({
  columns,
  data,
  pagination: serverPagination,
  filters = [],
  enableSearch = true,
  title,
  subtitle,
  headerAction,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();

  // Initialize states dengan nilai default
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Get initial pagination state - use server pagination if provided
  const [pagination, setPagination] = useState(() => {
    if (serverPagination) {
      return {
        pageIndex: serverPagination.page - 1, // Convert to 0-based index
        pageSize: serverPagination.limit,
      };
    }
    return {
      pageIndex: 0,
      pageSize: 10,
    };
  });

  // Handler untuk perubahan column filters
  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback(
    (updater) => {
      setColumnFilters((old) => {
        const newFilters =
          typeof updater === "function" ? updater(old) : updater;
        return newFilters;
      });
    },
    [],
  );

  // Handler untuk perubahan pagination
  const handlePaginationChange: OnChangeFn<{
    pageIndex: number;
    pageSize: number;
  }> = useCallback((updater) => {
    setPagination((old) => {
      return typeof updater === "function" ? updater(old) : updater;
    });
  }, []);

  // Handler untuk perubahan global filter
  const handleGlobalFilterChange: OnChangeFn<string> = useCallback(
    (updater) => {
      setGlobalFilter((old) => {
        const newValue = typeof updater === "function" ? updater(old) : updater;
        return newValue;
      });
    },
    [],
  );

  // Handler untuk search input - instant search
  const handleSearchInputChange = useCallback((value: string) => {
    setSearchValue(value);
    setGlobalFilter(value);
  }, []);

  // Initialize table hanya setelah state di-initialize
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: handleGlobalFilterChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onPaginationChange: handlePaginationChange,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: fuzzyFilter<TData>(),
    state: {
      globalFilter,
      columnFilters,
      pagination,
      columnVisibility: {
        division: false,
      },
    },
    filterFns: {
      fuzzy: fuzzyFilter<TData>(),
    },
  });

  // Get unique values for filter dropdowns
  const getFilterOptions = useCallback(
    (columnId: string) => {
      const values = table.getColumn(columnId)?.getFacetedUniqueValues();
      return values ? Array.from(values.keys()).sort() : [];
    },
    [table],
  );

  // Get active filter value
  const getFilterValue = useCallback(
    (columnId: string) => {
      const filter = columnFilters.find((f) => f.id === columnId);
      return (filter?.value as string) || "";
    },
    [columnFilters],
  );

  // Set filter value
  const setFilterValue = useCallback((columnId: string, value: string) => {
    setColumnFilters((prev) => {
      const existing = prev.filter((f) => f.id !== columnId);
      if (value) {
        return [...existing, { id: columnId, value }];
      }
      return existing;
    });
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setGlobalFilter("");
    setSearchValue("");
    setColumnFilters([]);
  }, []);

  // Computed values
  const hasActiveFilters = globalFilter || columnFilters.length > 0;
  const activeFilterCount = columnFilters.length + (globalFilter ? 1 : 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="heading-m-medium text-base">{title}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
          {headerAction}
        </div>
      )}

      {/* Search & Filters Row */}
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center">
          {/* Search Input with Toggle Animation */}
          {enableSearch && (
            <GlobalTableSearchInput
              table={table}
              placeholder="Search visitors..."
              searchValue={searchValue}
              onSearchChange={handleSearchInputChange}
            />
          )}

          {/* Desktop Filters */}
          <div className="hidden xl:flex items-center gap-2">
            {filters.map((columnId) => (
              <FilterDropdown
                key={columnId}
                label={getFilterLabel(columnId)}
                icon={getFilterIcon(columnId)}
                value={getFilterValue(columnId)}
                options={getFilterOptions(columnId)}
                onChange={(v) => setFilterValue(columnId, v)}
              />
            ))}
          </div>

          {/* Mobile Filter Button with Badge */}
          <div className="xl:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-action text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                <div className="space-y-2">
                  {filters.map((columnId) => (
                    <FilterDropdown
                      key={columnId}
                      label={getFilterLabel(columnId)}
                      icon={getFilterIcon(columnId)}
                      value={getFilterValue(columnId)}
                      options={getFilterOptions(columnId)}
                      onChange={(v) => setFilterValue(columnId, v)}
                    />
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-9 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Active:</span>
            {globalFilter && (
              <FilterChip
                label="Search"
                value={globalFilter}
                onRemove={() => handleSearchInputChange("")}
              />
            )}
            {columnFilters.map((filter) => (
              <FilterChip
                key={filter.id}
                label={getFilterLabel(filter.id)}
                value={filter.value as string}
                onRemove={() => setFilterValue(filter.id, "")}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <Table>
          <TableHeader className="bg-accent border rounded-2xl">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-8 h-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No employees found</p>
                    {hasActiveFilters && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-action"
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {serverPagination ? (
        <TablePagination
          pagination={{
            page: serverPagination.page,
            pageSize: serverPagination.limit,
            total: serverPagination.total,
          }}
          onPageChange={(page) => {
            // Handle server-side pagination change
            const params = new URLSearchParams(window.location.search);
            params.set("page", page.toString());
            params.set("limit", serverPagination.limit.toString());

            // Also preserve other filters
            if (globalFilter) params.set("search", globalFilter);
            columnFilters.forEach((filter) => {
              params.set(filter.id, filter.value as string);
            });

            router.push(`?${params.toString()}`, { scroll: false });
          }}
          onPageSizeChange={(size) => {
            // Handle server-side page size change
            const params = new URLSearchParams(window.location.search);
            params.set("page", "1"); // Reset to first page
            params.set("limit", size.toString());

            // Also preserve other filters
            if (globalFilter) params.set("search", globalFilter);
            columnFilters.forEach((filter) => {
              params.set(filter.id, filter.value as string);
            });

            router.push(`?${params.toString()}`, { scroll: false });
          }}
        />
      ) : (
        <TablePagination table={table} />
      )}
    </div>
  );
}
