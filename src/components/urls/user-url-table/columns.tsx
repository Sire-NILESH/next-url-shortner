"use no memo";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatNumber } from "@/lib/formatNum";
import { getShrinkifyUrl, stripHttp } from "@/lib/utils";
import { UserUrl } from "@/types/client/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", {
      description: "The URL has been copied to your clipboard",
    });
  } catch (error) {
    toast.error("Failed copying to clipboard", {
      description: "Something went unexpectedly wrong",
    });
    console.error("Failed to copy to clipboard", error);
  }
};

export const columns: ColumnDef<UserUrl>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-xs" title={row.original.name ?? "Unnamed"}>
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
    enableHiding: false,
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
          <Badge variant={"destructive"} className="rounded-sm">
            SECURITY
          </Badge>
        ) : row.original.flagged ? (
          <Badge variant={"warn"} className="rounded-sm">
            CAUTION
          </Badge>
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
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Clicks" />
    ),
    cell: ({ row }) => (
      <p className="text-md rounded-lg bg-secondary p-2 text-center font-medium">
        {formatNumber(row.original.clicks)}
      </p>
    ),
  },
  {
    accessorKey: "createdAt",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <div
        title={new Date(row.original.createdAt).toLocaleDateString()}
        className="text-muted-foreground"
      >
        {formatDistanceToNow(new Date(row.original.createdAt), {
          addSuffix: true,
        })}
      </div>
    ),
  },
];
