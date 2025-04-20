"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import { formatNumber } from "@/lib/formatNum";
import { cn } from "@/lib/utils";
import {
  GetAllUrlsOptions,
  UrlWithUser,
} from "@/server/actions/admin/urls/get-all-urls";
import { manageFlaggedUrl } from "@/server/actions/admin/urls/manage-flagged-url";
import { updateUrlStatus } from "@/server/actions/admin/urls/update-url-status";
import { BASE_URL } from "@/site-config/base-url";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Loader2,
  MoreHorizontalIcon,
  PencilLine,
  ShieldIcon,
  Trash2,
  User,
  VenetianMask,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type SortBy = GetAllUrlsOptions["sortBy"];

interface UrlsTableProps {
  urls: UrlWithUser[];
  total: number;
  currentPage: number;
  currentSearch: string;
  currentSortBy: SortBy;
  currentSortOrder: string;
  highlightStyle?: "security" | "inappropriate" | "other" | "none";
}

type URLStatus = "active" | "suspended" | "inactive";

const URL_STATUS_OPTIONS = [
  { status: "active", label: "Active" },
  { status: "suspended", label: "Suspended" },
  { status: "inactive", label: "Inactive" },
];

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

  const handleSort = (column: SortBy) => {
    const params = new URLSearchParams();

    if (currentSearch) {
      params.set("search", currentSearch);
    }

    if (column !== undefined) {
      params.set("sortBy", column);
    }

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

  const getSortIcon = (column: SortBy) => {
    if (currentSortBy !== column) {
      return <ChevronsUpDown className="ml-2 size-4" />;
    }

    return currentSortOrder === "asc" ? (
      <ChevronUp className="ml-2 size-4" />
    ) : (
      <ChevronDown className="ml-2 size-4" />
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

  function isCurrentRowPerformingAction(urlId: number) {
    return (
      (isUrlApprovalActionPending &&
        urlApprovalActionParams?.urlId === urlId) ||
      (isUrlStatusActionPending && urlStatusActionParams?.urlId === urlId)
    );
  }

  const {
    mutate: handleUrlApproval,
    variables: urlApprovalActionParams,
    isPending: isUrlApprovalActionPending,
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

  const {
    mutate: handleUrlStatus,
    variables: urlStatusActionParams,
    isPending: isUrlStatusActionPending,
  } = useMutation({
    mutationFn: async ({
      urlId,
      newUrlStatus,
    }: {
      urlId: number;
      newUrlStatus: URLStatus;
    }) => {
      return await updateUrlStatus(urlId, newUrlStatus);
    },
    onSuccess: (data, { newUrlStatus }) => {
      if (data.success) {
        toast.success("URL status updated successfully", {
          description: `URL status has been updated to ${newUrlStatus}`,
        });

        router.refresh();
      } else {
        toast.error("Failed to update URL status", {
          description: data.error || "An error occurred",
        });
      }
    },
    onError: (error) => {
      console.error("Error updating URL status", error);
      toast.error("Failed to update URL status.", {
        description: "An error occurred",
      });
    },
  });

  const copyToClipboard = async (id: number, shortCode: string) => {
    try {
      setCopyingId(id);
      const shrinkifyUrl = `${BASE_URL}/r/${shortCode}`;
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
                  onClick={() => handleSort("flagCategory")}
                >
                  Category
                  {getSortIcon("flagCategory")}
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">
                <Button
                  variant={"ghost"}
                  className="-m-2 flex items-center font-medium"
                  onClick={() => handleSort("threat")}
                >
                  Threat
                  {getSortIcon("threat")}
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
              <TableHead className="w-[100px]">
                <Button
                  variant={"ghost"}
                  className="-m-2 flex items-center font-medium"
                  onClick={() => handleSort("status")}
                >
                  Status
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
              <TableHead className="min-w-[150px]">
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
                      <p
                        title={url.flagReason}
                        className="font-sans tracking-wide mt-1 text-xs text-yellow-600 dark:text-yellow-400 max-w-[450px] truncate"
                      >
                        {url.flagReason}
                      </p>
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
                    <Badge
                      variant="secondary"
                      className="mx-auto rounded-sm uppercase"
                    >
                      {url.flagCategory}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={url.threat ? "destructive" : "outline"}
                      className={cn("mx-auto rounded-sm uppercase")}
                    >
                      {url.threat ?? "none"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-md rounded-lg bg-secondary/50 p-2 text-center font-medium">
                      {formatNumber(url.clicks)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="rounded-sm text-md"
                      variant={
                        url.status === "active"
                          ? "secondary"
                          : url.status === "suspended"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {url.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {url.userId ? (
                      <div className="max-w-50">
                        <div className="flex items-center gap-2">
                          {url.userRole === "admin" ? (
                            <ShieldIcon className="text-foreground size-3.5" />
                          ) : (
                            <User className="text-foreground size-3.5" />
                          )}
                          <span
                            title={url.userName || "Unknown User"}
                            className="line-clamp-1"
                          >
                            {url.userName || "Unknown User"}
                          </span>
                        </div>
                        <span
                          title={url.userEmail || "Unknown email"}
                          className="text-muted-foreground line-clamp-1"
                        >
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
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          disabled={isCurrentRowPerformingAction(url.id)}
                        >
                          {isCurrentRowPerformingAction(url.id) ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <MoreHorizontalIcon />
                          )}
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
                          <ExternalLink />
                          <a
                            href={`${BASE_URL}/r/${url.shortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            Visit <span className="brandText">Shrinkify</span>{" "}
                            URL
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink />
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
                              href={`${BASE_URL}/admin/users?search=${encodeURIComponent(
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
                                isCurrentRowPerformingAction(url.id) &&
                                urlApprovalActionParams?.action === "approve"
                              }
                              className="text-green-600 dark:text-green-400"
                              onClick={() =>
                                handleUrlApproval({
                                  urlId: url.id,
                                  action: "approve",
                                })
                              }
                            >
                              {isCurrentRowPerformingAction(url.id) &&
                                urlApprovalActionParams?.action ===
                                  "approve" && (
                                  <Loader2 className="size-4 mr-1 animate-spin" />
                                )}
                              <CheckCircle className="size-4 mr-1 text-green-700" />
                              Approve URL
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={
                                isCurrentRowPerformingAction(url.id) &&
                                urlApprovalActionParams?.action === "delete"
                              }
                              className="text-red-600 dark:text-red-400"
                              onClick={() =>
                                handleUrlApproval({
                                  urlId: url.id,
                                  action: "delete",
                                })
                              }
                            >
                              {isCurrentRowPerformingAction(url.id) &&
                                urlApprovalActionParams?.action ===
                                  "delete" && (
                                  <Loader2 className="size-4 mr-1 animate-spin" />
                                )}
                              <Trash2 className="size-4 mr-1 text-red-700" />
                              Delete URL
                            </DropdownMenuItem>
                          </>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="gap-2">
                            <PencilLine className="size-4 text-muted-foreground" />
                            <span>URL Status</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuRadioGroup
                                value={url.status}
                                onValueChange={(status) => {
                                  handleUrlStatus({
                                    urlId: url.id,
                                    newUrlStatus: status as URLStatus,
                                  });
                                }}
                              >
                                {URL_STATUS_OPTIONS.map((statusOption) => (
                                  <DropdownMenuRadioItem
                                    key={statusOption.status}
                                    disabled={isCurrentRowPerformingAction(
                                      url.id
                                    )}
                                    value={statusOption.status}
                                  >
                                    {statusOption.label}
                                  </DropdownMenuRadioItem>
                                ))}
                              </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
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
