"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { UrlWithUser } from "@/server/actions/admin/urls/get-all-urls";
import { manageFlaggedUrl } from "@/server/actions/admin/urls/manage-flagged-url";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Ban,
  CheckCircle,
  Copy,
  ExternalLink,
  Loader2,
  MoreHorizontal,
  ShieldIcon,
  User,
  VenetianMask,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UrlsTableProps {
  urls: UrlWithUser[];
  total: number;
  currentPage: number;
  currentSearch: string;
  currentSortBy: string;
  currentSortOrder: string;
  highlightStyle?: "security" | "inappropriate" | "other" | "none";
}

export function AdminUrlsTable({
  urls,
  total,
  currentPage,
  currentSearch,
  currentSortBy,
  currentSortOrder,
  highlightStyle,
}: UrlsTableProps) {
  const router = useRouter();
  const [copyingId, setCopyingId] = useState<number | null>(null);
  const basePath = "/admin/urls";

  const limit = 10;
  const totalPage = Math.ceil(total / limit);

  const handleSort = (column: string) => {
    const params = new URLSearchParams();

    if (currentSearch) {
      params.set("search", currentSearch);
    }

    params.set("sortBy", column);

    if (currentSortBy === column) {
      params.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortOrder", "asc");
    }

    params.set("page", "1");

    router.push(`${basePath}?${params.toString()}`);
  };

  const getPaginationItems = () => {
    const items = [];

    // always show first page
    items.push(
      <PaginationItem key={"first"}>
        <PaginationLink
          href={`${basePath}?page=1${
            currentPage ? `&search=${currentSearch}` : ""
          }${
            currentSortBy
              ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
              : ""
          }`}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      items.push(
        <PaginationItem key={"ellipsis-1"}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPage - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPage) continue;

      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`${basePath}?page=${i}${
              currentSearch ? `&search=${currentSearch}` : ""
            }${
              currentSortBy
                ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                : ""
            }`}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPage - 2) {
      items.push(
        <PaginationItem key={"ellipsis-2"}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPage > 1) {
      items.push(
        <PaginationItem key={"last"}>
          <PaginationLink
            href={`${basePath}?page=${totalPage}${
              currentSearch ? `&search=${currentSearch}` : ""
            }${
              currentSortBy
                ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                : ""
            }`}
            isActive={currentPage === totalPage}
          >
            {totalPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const getSortIcon = (column: string) => {
    if (currentSortBy !== column) {
      return <ArrowUpDown className="ml-2 size-4" />;
    }

    return currentSortOrder === "asc" ? (
      <ArrowUp className="ml-2 size-4" />
    ) : (
      <ArrowDown className="ml-2 size-4" />
    );
  };

  const getHighlightStyles = (url: UrlWithUser) => {
    if (!url.flagged) return "";

    switch (highlightStyle) {
      case "security":
        return "bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50/80 dark:hover:bg-red-900/20";
      case "inappropriate":
        return "bg-orange-50/50 dark:bg-orange-900/10 hover:bg-orange-50/80 dark:hover:bg-orange-900/20";
      case "other":
        return "bg-yellow-50/50 dark:bg-yellow-900/10 hover:bg-yellow-50/80 dark:hover:bg-yellow-900/20";
      default:
        return url.flagged ? "bg-yellow-50/50 dark:bg-yellow-900/10" : "";
    }
  };

  // Get flag icon color based on the type
  const getFlagIconColor = () => {
    switch (highlightStyle) {
      case "security":
        return "text-red-500 dark:text-red-400";
      case "inappropriate":
        return "text-orange-500 dark:text-orange-400";
      case "other":
        return "text-yellow-500 dark:text-yellow-400";
      default:
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  const {
    mutate: handleManageFlaggedUrl,
    variables: currentActionParams,
    isPending: iscurrentActionPending,
  } = useMutation({
    mutationFn: async ({
      urlId,
      action,
    }: {
      urlId: number;
      action: "approve" | "delete";
    }) => {
      return await manageFlaggedUrl(urlId, action);
    },
    onSuccess: (data, { action }) => {
      toast.success(
        data.success
          ? action === "approve"
            ? "URL approved successfully."
            : "URL deleted successfully."
          : "Failed to manage flagged URL."
      );

      router.refresh();
    },
    onError: (error) => {
      console.error("Error managing flagged URL", error);
      toast.error("Failed to manage flagged URL.", {
        description: "Internal server error",
      });
    },
  });

  const copyToClipboard = async (id: number, shortCode: string) => {
    try {
      setCopyingId(id);
      const shrinkifyUrl = `${window.location.origin}/r/${shortCode}`;
      await navigator.clipboard.writeText(shrinkifyUrl);
      toast.success("Shrinkify URL copied to clipboard.");
    } catch (error) {
      console.error("Error copying Shrinkify URL to clipboard", error);
      toast.error("Failed to copy Shrinkify URL to clipboard.");
    } finally {
      setTimeout(() => {
        setCopyingId(null);
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border font-mono">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead className="w-[300px]">
                <Button
                  variant={"ghost"}
                  className="-m-2 flex items-center font-medium"
                  onClick={() => handleSort("originalUrl")}
                >
                  Original URL
                  {getSortIcon("originalUrl")}
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">
                <Button
                  variant={"ghost"}
                  className="-m-2 flex items-center font-medium"
                  onClick={() => handleSort("shortCode")}
                >
                  Short Code
                  {getSortIcon("shortCode")}
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">
                <Button
                  variant={"ghost"}
                  className="-m-2 flex items-center font-medium"
                  onClick={() => handleSort("clicks")}
                >
                  Clicks
                  {getSortIcon("clicks")}
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">
                <Button
                  variant={"ghost"}
                  className="-m-2 flex items-center font-medium"
                  onClick={() => handleSort("userName")}
                >
                  Created By
                  {getSortIcon("userName")}
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">
                <Button
                  variant={"ghost"}
                  className="-m-2 flex items-center font-medium"
                  onClick={() => handleSort("createdAt")}
                >
                  Created
                  {getSortIcon("createdAt")}
                </Button>
              </TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.length === 0 ? (
              <TableRow>
                <TableCell>
                  {currentSearch
                    ? "No URLs found with the search term."
                    : "No URLs found."}
                </TableCell>
              </TableRow>
            ) : (
              urls.map((url) => (
                <TableRow key={url.id} className={getHighlightStyles(url)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {url.flagged && (
                        <div
                          className={getFlagIconColor()}
                          title={url.flagReason || "Flagged By AI"}
                        >
                          <AlertTriangle className="size-4" />
                        </div>
                      )}
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate max-w-[350px] block"
                      >
                        {url.originalUrl}
                      </a>
                      <ExternalLink className="ml-1 text-blue-600 size-3.5" />
                    </div>
                    {url.flagged && url.flagReason && (
                      <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-400 max-w-[450px] truncate">
                        Reason: {url.flagReason}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="px-1 py-0.5 rounded text-sm"
                      >
                        {url.shortCode}
                      </Badge>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={"ghost"}
                              size={"icon"}
                              className="size-6"
                              onClick={() =>
                                copyToClipboard(url.id, url.shortCode)
                              }
                              disabled={copyingId === url.id}
                            >
                              {copyingId === url.id ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy Shrinkify URL</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-md rounded-lg bg-secondary/50 p-2 text-center font-medium">
                      {url.clicks}
                    </p>
                  </TableCell>
                  <TableCell>
                    {url.userId ? (
                      <div>
                        <div className="flex items-center gap-2">
                          {url.userRole === "admin" ? (
                            <ShieldIcon className="text-foreground size-3.5" />
                          ) : (
                            <User className="text-foreground size-3.5" />
                          )}
                          <span>{url.userName || "Unknown User"}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {url.userEmail || "Unknown email"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <VenetianMask className="text-foreground size-3.5" />{" "}
                        Anonymous
                        <span className="text-sm"></span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <p>{new Date(url.createdAt).toLocaleString()}</p>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} size={"icon"}>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => copyToClipboard(url.id, url.shortCode)}
                        >
                          <Copy />
                          Copy <span className="brandText">Shrinkify</span> URL
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="text-blue-600" />
                          <a
                            href={`${window.location.origin}/r/${url.shortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            Visit <span className="brandText">Shrinkify</span>{" "}
                            URL
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="text-blue-600" />
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            Visit Original URL
                          </a>
                        </DropdownMenuItem>
                        {url.userEmail ? (
                          <DropdownMenuItem>
                            <User />
                            <Link
                              href={`${
                                window.location.origin
                              }/admin/users?search=${encodeURIComponent(
                                url.userEmail
                              )}&page=1`}
                              className="w-full"
                            >
                              Go to User
                            </Link>
                          </DropdownMenuItem>
                        ) : null}
                        {url.flagged && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled={
                                iscurrentActionPending &&
                                currentActionParams?.urlId === url.id &&
                                currentActionParams?.action === "approve"
                              }
                              className="text-green-600 dark:text-green-400"
                              onClick={() =>
                                handleManageFlaggedUrl({
                                  urlId: url.id,
                                  action: "approve",
                                })
                              }
                            >
                              {iscurrentActionPending &&
                                currentActionParams?.urlId === url.id &&
                                currentActionParams?.action === "approve" && (
                                  <Loader2 className="size-4 mr-1 animate-spin" />
                                )}
                              <CheckCircle className="size-4 mr-1 text-green-700" />
                              Approve URL
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={
                                iscurrentActionPending &&
                                currentActionParams?.urlId === url.id &&
                                currentActionParams?.action === "delete"
                              }
                              className="text-red-600 dark:text-red-400"
                              onClick={() =>
                                handleManageFlaggedUrl({
                                  urlId: url.id,
                                  action: "delete",
                                })
                              }
                            >
                              {iscurrentActionPending &&
                                currentActionParams?.urlId === url.id &&
                                currentActionParams?.action === "delete" && (
                                  <Loader2 className="size-4 mr-1 animate-spin" />
                                )}
                              <Ban className="size-4 mr-1 text-red-700" />
                              Delete URL
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPage > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`${basePath}?page=${Math.max(1, currentPage - 1)}${
                  currentSearch ? `&search=${currentSearch}` : ""
                }${
                  currentSortBy
                    ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                    : ""
                }
                }`}
              />
            </PaginationItem>

            {getPaginationItems()}

            <PaginationItem>
              <PaginationNext
                href={`${basePath}?page=${Math.min(
                  totalPage,
                  currentPage + 1
                )}${currentSearch ? `&search=${currentSearch}` : ""}${
                  currentSortBy
                    ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                    : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <div className="text-xs text-muted-foreground">
        Showing {urls.length} of {total} URLs.
        {currentSearch && ` Search results for "${currentSearch}".`}
      </div>
    </div>
  );
}
