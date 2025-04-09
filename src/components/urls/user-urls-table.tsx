"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Copy,
  Edit,
  ExternalLink,
  QrCode,
  Trash2Icon,
  MoreHorizontal,
  DownloadIcon,
  Search,
} from "lucide-react";

// shadcn components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { QRCodeModal } from "../modals/qr-code-modal";
import { EditUrlModal } from "../modals/edit-url-modal";
import { deleteUrl } from "@/server/actions/urls/delete-url";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { download, generateCsv, mkConfig } from "export-to-csv";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "../data-table/column-header";
import { DataTableViewOptions } from "../data-table/column-toggle";

// Types
interface Url {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
}

interface UserUrlsTableProps {
  urls: Url[];
}

// Create a client
const queryClient = new QueryClient();

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

// Wrapper component with QueryClientProvider
export default function UserUrlsTable({ urls }: UserUrlsTableProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserUrlsDataTable urls={urls} />
    </QueryClientProvider>
  );
}

function UserUrlsDataTable({ urls: initialUrls }: UserUrlsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [qrCodeShortCode, setQrCodeShortCode] = useState<string>("");
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState<{
    id: number;
    shortCode: string;
  } | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  // Initialize the query client with the initial data
  const queryClient = useQueryClient();

  // Set the initial data if it hasn't been set yet
  if (!queryClient.getQueryData(["urls"])) {
    queryClient.setQueryData(["urls"], initialUrls);
  }

  // Get the data from the query client
  const urls = queryClient.getQueryData<Url[]>(["urls"]) || initialUrls;
  const isLoading = false; // Since we're using initialUrls directly, there's no loading state

  // Delete URL mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUrl(id),
    onSuccess: (response, id) => {
      if (response.success) {
        queryClient.setQueryData(["urls"], (oldData: Url[] | undefined) =>
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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const shortUrl = `${baseUrl}/r/${shortCode}`;
    setQrCodeUrl(shortUrl);
    setQrCodeShortCode(shortCode);
    setIsQrCodeModalOpen(true);
  };

  const handleEdit = (id: number, shortCode: string) => {
    setUrlToEdit({ id, shortCode });
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (newShortCode: string) => {
    if (!urlToEdit) return;

    // Update the data in the cache
    queryClient.setQueryData(["urls"], (oldData: Url[] | undefined) =>
      oldData
        ? oldData.map((url) =>
            url.id === urlToEdit.id ? { ...url, shortCode: newShortCode } : url
          )
        : []
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleExportCSV = (data: any[]) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  function RowActions({ url }: { url: Url }) {
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
              onSelect={() => handleEdit(url.id, url.shortCode)}
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
  const columns: ColumnDef<Url>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "originalUrl",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Original URL" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center max-w-xs">
          <div className="truncate" title={row.original.originalUrl}>
            {row.original.originalUrl}
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
        <DataTableColumnHeader column={column} title="Shrinkify URL" />
      ),
      cell: ({ row }) => {
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        const shortUrl = `${baseUrl}/r/${row.original.shortCode}`;
        return (
          <div className="flex items-center">
            <div className="truncate" title={shortUrl}>
              {shortUrl}
            </div>
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
      accessorKey: "clicks",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Clicks" />
      ),
      cell: ({ row }) => (
        <p className="text-md rounded-lg bg-secondary/50 p-2 text-center font-medium">
          {row.original.clicks}
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
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          You haven&apos;t created any short URLs yet. Click the button below to
          create your first short URL.
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
                shortUrl: `${
                  process.env.NEXT_PUBLIC_APP_URL || window.location.origin
                }/r/${row.original.shortCode}`,
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
          currentShortCode={urlToEdit.shortCode}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
