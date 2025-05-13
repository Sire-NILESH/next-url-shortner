"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { cn, collectSearchParam, getShrinkifyUrl } from "@/lib/utils";
import {
  getAllUrls,
  GetAllUrlsOptions,
  UrlWithUser,
} from "@/server/actions/admin/urls/get-all-urls";
import { manageFlaggedUrl } from "@/server/actions/admin/urls/manage-flagged-url";
import { updateUrlStatus } from "@/server/actions/admin/urls/update-url-status";
import { BASE_URL } from "@/site-config/base-url";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  ShieldAlert,
  ShieldIcon,
  Trash2,
  User,
  VenetianMask,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminUrlsTableSkeleton from "./admin-urls-table-skeleton";
import { UrlFilter } from "./url-filter";
import AdminUrlsTableErrorFallback from "./admin-urls-table-error-fallback";
import {
  FlagCategoryTypeEnum,
  ThreatTypeEnum,
  UrlStatusTypeEnum,
} from "@/types/server/types";

type SortBy = GetAllUrlsOptions["sortBy"];
type SortOrder = "asc" | "desc";
type FilterType = GetAllUrlsOptions["filter"];

type URLStatus = "active" | "suspended" | "inactive";

const URL_STATUS_OPTIONS = [
  { status: "active", label: "Active" },
  { status: "suspended", label: "Suspended" },
  { status: "inactive", label: "Inactive" },
];

interface UrlsTableProps {
  initialPage?: number;
  initialSearch?: string;
  initialSortBy?: SortBy;
  initialSortOrder?: string;
  initialFilter?: FilterType;
  initialThreats?: ThreatTypeEnum[];
  initialStatuses?: UrlStatusTypeEnum[];
  initialCategories?: FlagCategoryTypeEnum[];
}

const getUrlCategory = (url: UrlWithUser) => {
  if (url.threat) return "security";
  if (url.flagged && !url.threat) return "caution";
  if (url.flagged) return "flagged";
  if (!url.flagged && !url.threat) return "safe";
  return "unknown";
};

const getHighlightStyles = (url: UrlWithUser) => {
  const category = getUrlCategory(url);

  switch (category) {
    case "security":
      return "bg-red-100/70 dark:bg-red-800/15 hover:bg-red-100/90 dark:hover:bg-red-800/25";
    case "caution":
      return "bg-orange-100/25 dark:bg-orange-800/15 hover:bg-orange-100/40 dark:hover:bg-orange-800/25";
    case "safe":
      return ""; // no highlight for safe
    default:
      return "";
  }
};

const getFlagIconColor = (url: UrlWithUser) => {
  const category = getUrlCategory(url);

  switch (category) {
    case "security":
      return "text-red-500 dark:text-red-400";
    case "caution":
      return "text-orange-500 dark:text-orange-400";
    case "safe":
      return "text-green-500 dark:text-green-400"; // optional
    default:
      return "text-yellow-600 dark:text-yellow-400";
  }
};

export function AdminUrlsTable({
  initialPage = 1,
  initialSearch = "",
  initialSortBy = "createdAt",
  initialSortOrder = "desc",
  initialFilter = "all",
  initialThreats = undefined,
  initialStatuses = undefined,
  initialCategories = undefined,
}: UrlsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [copyingId, setCopyingId] = useState<number | null>(null);

  // Track whether initial load has completed
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Parse URL params or use initial values
  const currentPage = Number(searchParams.get("page") ?? initialPage);
  const currentSearch = searchParams.get("search") ?? initialSearch;
  const currentSortBy = (searchParams.get("sortBy") as SortBy) ?? initialSortBy;
  const currentSortOrder = searchParams.get("sortOrder") ?? initialSortOrder;
  const currentFilter =
    (searchParams.get("filter") as FilterType) ?? initialFilter;
  const currentThreats =
    collectSearchParam("threats", searchParams) ?? initialThreats;
  const currentStatuses =
    collectSearchParam("statuses", searchParams) ?? initialStatuses;
  const currentCategories =
    collectSearchParam("categories", searchParams) ?? initialCategories;

  const limit = 10;

  // Data fetching with TanStack Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "admin-urls",
      {
        currentPage,
        currentSearch,
        currentSortBy,
        currentSortOrder,
        currentFilter,
        currentThreats,
        currentStatuses,
        currentCategories,
      },
    ],
    queryFn: async () => {
      const response = await getAllUrls({
        page: currentPage,
        search: currentSearch,
        sortBy: currentSortBy,
        sortOrder: currentSortOrder as SortOrder,
        filter: currentFilter,
        threats: currentThreats as GetAllUrlsOptions["threats"],
        statuses: currentStatuses as GetAllUrlsOptions["statuses"],
        categories: currentCategories as GetAllUrlsOptions["categories"],
        limit,
      });
      return response;
    },
    // Use keep previous data to show old data while loading new data
    placeholderData: (prev) => prev,
    staleTime: 60000, // 1 minute
  });

  // Set initialLoadComplete to true after first successful data fetch
  useEffect(() => {
    if (!isLoading && !isError && data) {
      setInitialLoadComplete(true);
    }
  }, [isLoading, isError, data]);

  const urls = data?.success && data?.data ? data.data.urls : [];
  const total = data?.success && data?.data ? data.data.total : 0;
  const totalPage = Math.ceil(total / limit);

  const updateUrlWithParams = (params: Partial<GetAllUrlsOptions>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleSort = (column: SortBy) => {
    let newSortOrder: GetAllUrlsOptions["sortOrder"] = "asc";
    if (currentSortBy === column) {
      newSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
    }

    updateUrlWithParams({
      sortBy: column,
      sortOrder: newSortOrder,
      page: 1, // Reset to first page when sorting changes
    });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlWithParams({ page: newPage });
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
      return await manageFlaggedUrl({ urlId, action });
    },
    onSuccess: (data, { action }) => {
      toast.success(
        data.success
          ? action === "approve"
            ? "URL approved successfully."
            : "URL deleted successfully."
          : "Failed to manage flagged URL."
      );

      // Invalidate the query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ["admin-urls"] });
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
      return await updateUrlStatus({ urlId, status: newUrlStatus });
    },
    onSuccess: (data, { newUrlStatus }) => {
      if (data.success) {
        toast.success("URL status updated successfully", {
          description: `URL status has been updated to ${newUrlStatus}`,
        });

        // Invalidate the query to refetch the latest data
        queryClient.invalidateQueries({ queryKey: ["admin-urls"] });
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
      const shrinkifyUrl = getShrinkifyUrl(shortCode);
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

  const getPaginationItems = () => {
    const items = [];

    // always show first page
    items.push(
      <PaginationItem key={"first"}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(1);
          }}
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
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
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
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPage);
            }}
            isActive={currentPage === totalPage}
          >
            {totalPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  function refreshQueryHandler() {
    refetch();
  }

  return (
    <div className="space-y-4">
      <UrlFilter
        initialFilter={currentFilter}
        refreshHandler={refreshQueryHandler}
      />

      {isLoading && !initialLoadComplete ? (
        <AdminUrlsTableSkeleton />
      ) : isError ? (
        <AdminUrlsTableErrorFallback error={error} />
      ) : (
        <>
          <div className="rounded-md border font-mono overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="w-[300px]">
                    <Button
                      variant={"ghost"}
                      className="-m-2 flex items-center font-medium"
                      onClick={() => handleSort("originalUrl")}
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    >
                      Status
                      {getSortIcon("status")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[150px]">
                    <Button
                      variant={"ghost"}
                      className="-m-2 flex items-center font-medium"
                      onClick={() => handleSort("userName")}
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                  // Display no results message only if truly no data is available
                  <TableRow>
                    <TableCell colSpan={9} className="text-center h-15">
                      {isLoading && initialLoadComplete ? (
                        <div className="flex justify-center items-center py-2">
                          <Loader2 className="size-4 animate-spin text-primary mr-2" />
                          <p>Loading URLs...</p>
                        </div>
                      ) : currentSearch ? (
                        "No URLs found with the search term."
                      ) : (
                        "No URLs found."
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  // Display URLs with loading indicator when fetching new data
                  urls.map((url) => (
                    <TableRow
                      key={url.id}
                      className={cn(
                        getHighlightStyles(url),
                        isLoading && initialLoadComplete ? "opacity-60" : ""
                      )}
                    >
                      <TableCell className="font-medium h-15">
                        <div className="flex items-center gap-2">
                          {url.flagged && (
                            <div
                              className={getFlagIconColor(url)}
                              title={url.flagReason || "Flagged By AI"}
                            >
                              {url.threat ? (
                                <ShieldAlert className="size-4" />
                              ) : (
                                <AlertTriangle className="size-4" />
                              )}
                            </div>
                          )}
                          <p
                            // href={url.originalUrl}
                            // target="_blank"
                            // rel="noopener noreferrer"
                            className="hover:underline truncate max-w-[350px] block"
                          >
                            {url.originalUrl}
                          </p>
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "",
                              buttonVariants({ variant: "ghost", size: "sm" })
                            )}
                          >
                            <ExternalLink className=" text-blue-600 size-3.5" />
                          </a>
                        </div>
                        {url.flagged && url.flagReason && (
                          <p
                            title={url.flagReason}
                            className={cn(
                              "font-sans tracking-wide mt-1 text-xs text-yellow-600 dark:text-yellow-400 max-w-[450px] truncate",
                              getFlagIconColor(url)
                            )}
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
                                  disabled={copyingId === url.id || isLoading}
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
                          {url.flagCategory || "N/A"}
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
                        <p className="text-md rounded-lg bg-secondary p-2 text-center font-medium">
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
                          <div className="max-w-50 truncate">
                            <div className="flex items-center gap-2">
                              {url.userRole === "admin" ? (
                                <ShieldIcon className="text-foreground size-3.5" />
                              ) : (
                                <User className="text-foreground size-3.5" />
                              )}
                              <span
                                title={url.userName || "Unknown User"}
                                className="truncate"
                              >
                                {url.userName || "Unknown User"}
                              </span>
                            </div>
                            <div>
                              <span
                                title={url.userEmail || "Unknown email"}
                                className="truncate text-muted-foreground"
                              >
                                {url.userEmail || "Unknown email"}
                              </span>
                            </div>
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
                              disabled={
                                isCurrentRowPerformingAction(url.id) ||
                                isLoading
                              }
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
                              onClick={() =>
                                copyToClipboard(url.id, url.shortCode)
                              }
                              disabled={isLoading}
                            >
                              <Copy className="mr-2 size-4" />
                              Copy Shrinkify URL
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={isLoading}>
                              <ExternalLink className="mr-2 size-4" />
                              <a
                                href={getShrinkifyUrl(url.shortCode)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full"
                              >
                                Visit Shrinkify URL
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={isLoading}>
                              <ExternalLink className="mr-2 size-4" />
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
                              <DropdownMenuItem disabled={isLoading}>
                                <User className="mr-2 size-4" />
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

                            <DropdownMenuSeparator />

                            {url.flagged && (
                              <>
                                <DropdownMenuItem
                                  disabled={
                                    isLoading ||
                                    (isCurrentRowPerformingAction(url.id) &&
                                      urlApprovalActionParams?.action ===
                                        "approve")
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
                                    "approve" ? (
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                  ) : (
                                    <CheckCircle className="size-4 mr-2 text-green-700" />
                                  )}
                                  Approve URL
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              disabled={
                                isLoading ||
                                (isCurrentRowPerformingAction(url.id) &&
                                  urlApprovalActionParams?.action === "delete")
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
                              urlApprovalActionParams?.action === "delete" ? (
                                <Loader2 className="size-4 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="size-4 mr-2 text-red-700" />
                              )}
                              Delete URL
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger
                                className="gap-2"
                                disabled={isLoading}
                              >
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
                                        disabled={
                                          isLoading ||
                                          isCurrentRowPerformingAction(url.id)
                                        }
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
          <>
            {totalPage > 1 ? (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isLoading) {
                          handlePageChange(Math.max(1, currentPage - 1));
                        }
                      }}
                      className={
                        isLoading ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {getPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isLoading) {
                          handlePageChange(
                            Math.min(totalPage, currentPage + 1)
                          );
                        }
                      }}
                      className={
                        isLoading ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            {isLoading && initialLoadComplete ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                <span>Refreshing data...</span>
              </>
            ) : (
              <>
                Showing {urls.length} of {total} URLs.
                {currentSearch && ` Search results for "${currentSearch}".`}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
