"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  Copy,
  DownloadIcon,
  Edit,
  ExternalLink,
  MoreHorizontal,
  QrCode,
  Search,
  ShieldAlert,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// shadcn components
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useMyUrls from "@/hooks/useMyUrls";
import { formatNumber } from "@/lib/formatNum";
import { getShrinkifyUrl, stripHttp } from "@/lib/utils";
import { deleteUrl } from "@/server/actions/urls/delete-url";
import { UserUrl } from "@/types/client/types";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { DataTableColumnHeader } from "../../data-table/column-header";
import { DataTableViewOptions } from "../../data-table/column-toggle";
import { EditUrlModal } from "../../modals/edit-url-modal";
import { QRCodeModal } from "../../modals/qr-code-modal";
import { Badge } from "../../ui/badge";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

export default function UserUrlTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [qrCodeShortCode, setQrCodeShortCode] = useState<string>("");
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState<{
    id: number;
    shortCode: string;
    name: string | null;
  } | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const queryClient = useQueryClient();

  const { data: urls, isLoading } = useMyUrls();

  // Delete URL mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUrl(id),
    onSuccess: (response, id) => {
      if (response.success) {
        queryClient.setQueryData(
          ["my-urls"],
          (oldData: UserUrl[] | undefined) =>
            oldData ? oldData.filter((url) => url.id !== id) : []
        );
        toast.success("URL deleted successfully", {
          description: "The URL has been deleted successfully",
        });
      } else {
        toast.error("Failed to delete URL", {
          description: response.error || "An error occurred",
        });
      }
    },
    onError: (error) => {
      console.error("Failed to delete URL", error);
      toast.error("Failed to delete URL", {
        description: "An error occurred",
      });
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard", {
        description: "The URL has been copied to your clipboard",
      });
    } catch (error) {
      console.error("Failed to copy to clipboard", error);
    }
  };

  const showQrCode = (shortCode: string) => {
    const shortUrl = getShrinkifyUrl(shortCode);
    setQrCodeUrl(shortUrl);
    setQrCodeShortCode(shortCode);
    setIsQrCodeModalOpen(true);
  };

  const handleEdit = (id: number, shortCode: string, name: string | null) => {
    setUrlToEdit({ id, shortCode, name });
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (newShortCode: string, name?: string) => {
    if (!urlToEdit) return;

    // Update the data in the cache
    queryClient.setQueryData(["my-urls"], (oldData: UserUrl[] | undefined) =>
      oldData
        ? oldData.map((url) =>
            url.id === urlToEdit.id
              ? { ...url, shortCode: newShortCode, name: name || url.name }
              : url
          )
        : []
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleExportCSV = (data: any[]) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  function RowActions({ url }: { url: UserUrl }) {
    const isDeleting =
      deleteMutation.isPending && deleteMutation.variables === url.id;

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2"
              onSelect={() => showQrCode(url.shortCode)}
            >
              <QrCode className="h-4 w-4 text-muted-foreground" />
              Show QR Code
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onSelect={() => handleEdit(url.id, url.shortCode, url.name)}
            >
              <Edit className="h-4 w-4 text-muted-foreground" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 text-destructive"
              onSelect={() => deleteMutation.mutate(url.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Trash2Icon className="h-4 w-4" />
              )}
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }

  // Table columns definition
  const columns: ColumnDef<UserUrl>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div
          className="truncate max-w-xs"
          title={row.original.name ?? "Unnamed"}
        >
          {row.original.name ?? (
            <span className="italic text-muted-foreground">Unnamed</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "originalUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Original URL" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center max-w-xs">
          <div className="truncate" title={row.original.originalUrl}>
            {stripHttp(row.original.originalUrl)}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(row.original.originalUrl)}
                  className="ml-2 h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy original URL</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <a
            href={row.original.originalUrl}
            target="_blank"
            className="ml-1 text-blue-500 hover:text-blue-600"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      ),
    },
    {
      accessorKey: "shortCode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Shrinkify Code" />
      ),
      cell: ({ row }) => {
        const shortUrl = getShrinkifyUrl(row.original.shortCode);
        return (
          <div className="flex items-center">
            <Badge
              variant="secondary"
              className="truncate rounded-sm"
              title={row.original.shortCode}
            >
              {row.original.shortCode}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(shortUrl)}
                    className="ml-2 h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy shrinkify URL</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <a
              href={shortUrl}
              target="_blank"
              className="ml-1 text-blue-500 hover:text-blue-600"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "flagged",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Flagged" />
      ),
      cell: ({ row }) => (
        <div className="">
          {row.original.flagged && row.original.threat ? (
            <ShieldAlert className="size-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
          ) : row.original.flagged ? (
            <AlertTriangle className="size-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          ) : (
            <span className="italic text-muted-foreground">None</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "disabled",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Disabled" />
      ),
      cell: ({ row }) => (
        <>
          {row.original.disabled ? (
            <Badge variant="outline" className="rounded-sm">
              {String(row.original.disabled).toUpperCase()}
            </Badge>
          ) : (
            <span className="italic text-muted-foreground">None</span>
          )}
        </>
      ),
    },
    {
      accessorKey: "clicks",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Clicks" />
      ),
      cell: ({ row }) => (
        <p className="text-md rounded-lg bg-secondary/50 p-2 text-center font-medium">
          {formatNumber(row.original.clicks)}
        </p>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.createdAt), {
            addSuffix: true,
          })}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => <RowActions url={row.original} />,
    },
  ];

  // Set up the table
  const table = useReactTable({
    data: urls,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const safeValue = String(row.getValue(columnId) ?? "").toLowerCase();
      return safeValue.includes(filterValue.toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-184 space-y-2 rounded-xl text-center py-8 bg-muted">
        <p className="text-2xl !font-bold boldText">
          No url data available yet
        </p>

        <p className="text-base text-muted-foreground">
          Create some shrinkify URLs to see the table
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full border rounded-lg p-4 space-y-6 md:space-y-0 bg-secondary/40">
      <div className="flex flex-wrap items-end justify-between gap-4 py-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search URLs..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8 lg:flex"
            onClick={() => {
              const data = table.getFilteredRowModel().rows.map((row) => ({
                index: row.index + 1,
                originalUrl: row.original.originalUrl,
                shortUrl: getShrinkifyUrl(row.original.shortCode),
                clicks: row.original.clicks,
                createdAt: new Date(
                  row.original.createdAt
                ).toLocaleDateString(),
              }));
              handleExportCSV(data);
            }}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>

      <SkeletonWrapper isLoading={isLoading}>
        <div className="rounded-md border flex-1 overflow-hidden">
          <Table className="font-mono">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between flex-wrap-reverse">
          <p className="text-muted-foreground text-xs">
            {`Showing ${table.getRowModel().rows.length} of ${
              table.getFilteredRowModel().rows.length
            } URLs`}
          </p>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </SkeletonWrapper>

      {/* Modals */}
      <QRCodeModal
        isOpen={isQrCodeModalOpen}
        onOpenChange={setIsQrCodeModalOpen}
        url={qrCodeUrl}
        shortCode={qrCodeShortCode}
      />

      {urlToEdit && (
        <EditUrlModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          urlId={urlToEdit.id}
          urlName={urlToEdit.name}
          currentShortCode={urlToEdit.shortCode}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
