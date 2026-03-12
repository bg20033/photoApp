// components/ui/data-table.tsx
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";

// Define GetRowIdFn locally since it's not exported from @tanstack/react-table
type GetRowIdFn<TData> = (row: TData) => string;
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderSubComponent?: (props: { row: TData }) => React.ReactNode;
  getRowId?: GetRowIdFn<TData>;
  enableExpanding?: boolean;
  expandedRowId?: string | null;
  onExpandedChange?: (id: string | null) => void;
  searchable?: boolean;
  searchColumn?: string;
  searchPlaceholder?: string;
  pageSize?: number;
}

const tableRowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export function DataTable<TData, TValue>({
  columns,
  data,
  renderSubComponent,
  getRowId,
  enableExpanding = false,
  expandedRowId,
  onExpandedChange,
  searchable = false,
  searchColumn,
  searchPlaceholder = "Search...",
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [internalExpanded, setInternalExpanded] = useState<string | null>(null);

  const isExpandedControlled = expandedRowId !== undefined;
  const currentExpanded = isExpandedControlled
    ? expandedRowId
    : internalExpanded;

  const handleToggleExpand = (id: string) => {
    const newValue = currentExpanded === id ? null : id;
    if (isExpandedControlled) {
      onExpandedChange?.(newValue);
    } else {
      setInternalExpanded(newValue);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: getRowId,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
  });

  return (
    <div className="space-y-4">
      {(searchable ||
        table.getAllColumns().some((col) => col.getCanHide())) && (
        <div className="flex items-center justify-between gap-4">
          {searchable && searchColumn && (
            <div className="flex items-center gap-2 flex-1">
              <Input
                placeholder={searchPlaceholder}
                value={
                  (table.getColumn(searchColumn)?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn(searchColumn)
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <Table className="bg-white ">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {enableExpanding && <TableHead className="w-12"></TableHead>}
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <motion.tbody
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="[&_tr:last-child]:border-0"
          >
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const rowId = getRowId ? getRowId(row.original) : row.id;
                const isExpanded = currentExpanded === rowId;

                return (
                  <AnimatePresence key={rowId} mode="wait">
                    <>
                      <motion.tr
                        variants={tableRowVariants}
                        layout
                        data-state={row.getIsSelected() && "selected"}
                        className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${
                          isExpanded ? "bg-muted/30" : ""
                        }`}
                      >
                        {enableExpanding && (
                          <TableCell className="p-2 pe-1">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleToggleExpand(rowId)}
                              className="p-1.5 hover:bg-muted rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              </motion.div>
                            </motion.button>
                          </TableCell>
                        )}
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </motion.tr>
                      {enableExpanding && renderSubComponent && (
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              initial={{ opacity: 0, scaleY: 0.95 }}
                              animate={{ opacity: 1, scaleY: 1 }}
                              exit={{ opacity: 0, scaleY: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              style={{ originY: 0 }}
                              className="bg-muted/20"
                            >
                              <td
                                colSpan={row.getVisibleCells().length + 1}
                                className="p-0"
                              >
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2, delay: 0.05 }}
                                  className="p-4"
                                >
                                  {renderSubComponent({ row: row.original })}
                                </motion.div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      )}
                    </>
                  </AnimatePresence>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableExpanding ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </motion.tbody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
