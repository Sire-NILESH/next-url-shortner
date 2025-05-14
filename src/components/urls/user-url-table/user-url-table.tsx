"use client";
"use no memo";

import { EditUrlModal } from "@/components/modals/edit-url-modal";
import { QRCodeModal } from "@/components/modals/qr-code-modal";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import useMyUrls from "@/hooks/useMyUrls";
import { cn, getShrinkifyUrl } from "@/lib/utils";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { ComponentProps } from "react";
import { columns } from "./columns";
import EmptyState from "./empty-state";
import { useDeleteConfirmationModal } from "./hooks/useDeleteConfirmationModal";
import { useEditUrlModal } from "./hooks/useEditUrlModal";
import { useExportConfirmationModal } from "./hooks/useExportConfirmationModal";
import { useQrCodeModal } from "./hooks/useQrCodeModal";
import { useUserUrlTableMutations } from "./hooks/useUserUrlTableMutations";
import { useUserUrlTableState } from "./hooks/useUserUrlTableState";
import { RowActions } from "./row-actions";
import TablePagination from "./table-pagination";
import TableToolbar from "./table-toolbar";
import UrlDataTable from "./url-data-table";
import UserUrlsErrorFallback from "./user-urls-error-fallback";
import { ConfirmModal } from "@/components/modals/confirm-modal/confirm-modal";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

type Props = ComponentProps<"div"> & {};

export default function UserUrlTable({ className, ...props }: Props) {
  const { data: urls, isLoading, error } = useMyUrls();

  const { deleteMutation, handleEditSuccess } = useUserUrlTableMutations();

  // State management hooks
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    globalFilter,
    setGlobalFilter,
  } = useUserUrlTableState();

  const {
    showQrCode,
    isQrCodeModalOpen,
    setIsQrCodeModalOpen,
    qrCodeUrl,
    qrCodeShortCode,
  } = useQrCodeModal();

  const { handleEdit, isEditModalOpen, setIsEditModalOpen, urlToEdit } =
    useEditUrlModal();

  const {
    confirmDelete,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    urlToDelete,
  } = useDeleteConfirmationModal();

  const { handleExportConfirmation, isExportModalOpen, setIsExportModalOpen } =
    useExportConfirmationModal();

  // Handle confirmed deletion
  const handleDeleteConfirmed = () => {
    if (urlToDelete) {
      deleteMutation.mutate(urlToDelete);
      setIsDeleteModalOpen(false);
    }
  };

  // Handle confirmed export
  const handleExportConfirmed = () => {
    if (!urls) return;

    const data = urls.map((url) => ({
      originalUrl: url.originalUrl,
      shortUrl: getShrinkifyUrl(url.shortCode),
      clicks: url.clicks,
      createdAt: new Date(url.createdAt).toLocaleDateString(),
    }));

    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
    setIsExportModalOpen(false);
  };

  // Table configuration
  const table = useReactTable({
    data: urls ? urls : [],
    columns: [
      ...columns,
      {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => (
          <RowActions
            url={row.original}
            onDelete={confirmDelete}
            handleEdit={handleEdit}
            showQrCode={showQrCode}
          />
        ),
      },
    ],
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
      columnVisibility: {
        // Hide certain columns by default
        flagged: false,
      },
    },
  });

  // Error states
  if (error && !isLoading) {
    return <UserUrlsErrorFallback error={error} />;
  }

  // Empty states
  if (urls && urls.length === 0) {
    return <EmptyState />;
  }

  return (
    <div
      className={cn(
        "w-full min-h-full border shadow-sm rounded-lg p-4 space-y-6 md:space-y-0 bg-card sm:bg-secondary/40",
        className
      )}
      {...props}
    >
      <TableToolbar
        table={table}
        isLoading={isLoading}
        error={error}
        onExport={handleExportConfirmation}
      />

      <SkeletonWrapper isLoading={isLoading} className="min-h-142">
        <UrlDataTable table={table} />
        <TablePagination table={table} />
      </SkeletonWrapper>

      {/* MODALS */}
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
          onSuccess={(newShortCode, name) =>
            handleEditSuccess(urlToEdit, newShortCode, name)
          }
        />
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
        title="Delete URL"
        description="Are you sure you want to delete this URL? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      {/* Export Confirmation Modal */}
      <ConfirmModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleExportConfirmed}
        title="Export URLs"
        description="This will export all your URLs to a CSV file. Continue?"
        confirmText="Export"
      />
    </div>
  );
}
