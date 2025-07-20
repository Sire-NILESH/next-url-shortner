"use no memo";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserUrl } from "@/types/client/types";
import {
  Edit,
  Loader2,
  MoreHorizontal,
  QrCode,
  Trash2Icon,
} from "lucide-react";

interface RowActionsProps {
  url: UserUrl;
  onDelete: (id: number) => void;
  handleEdit: (id: number, shortCode: string, name: string | null) => void;
  showQrCode: (shortCode: string) => void;
  isDeleting: (urlId: number) => boolean;
}

export function RowActions({
  url,
  onDelete,
  handleEdit,
  showQrCode,
  isDeleting,
}: RowActionsProps) {
  const isCurrentRowDeletingUrl = isDeleting(url.id);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          disabled={isCurrentRowDeletingUrl}
        >
          {isCurrentRowDeletingUrl ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </>
          )}
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

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center gap-2 text-destructive"
          onSelect={() => onDelete(url.id)}
          disabled={isCurrentRowDeletingUrl}
        >
          {isCurrentRowDeletingUrl ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Trash2Icon className="h-4 w-4" />
          )}
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
