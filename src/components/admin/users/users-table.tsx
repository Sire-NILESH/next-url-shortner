"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { formatNumber } from "@/lib/formatNum";
import {
  getAllUsers,
  GetAllUsersOptions,
} from "@/server/actions/admin/users/get-all-users";
import { updateUserRole } from "@/server/actions/admin/users/update-user-role";
import { updateUserStatus } from "@/server/actions/admin/users/update-user-status";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Loader2,
  MoreHorizontalIcon,
  ShieldIcon,
  User,
  UserRoundPen,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UsersTableSkeleton from "./users-table-skeleton";
import UsersTableErrorFallback from "./users-table-error-fallback";
import RefreshUsersButton from "./refresh-users-button";
import { UserFilter } from "./user-filter";
import {
  UserProviderTypeEnum,
  UserRoleTypeEnum,
  UserStatusTypeEnum,
} from "@/types/server/types";
import { cn, collectSearchParam } from "@/lib/utils";

type SortBy = GetAllUsersOptions["sortBy"];
type SortOrder = "asc" | "desc";

type UserStatus = "active" | "suspended" | "inactive";

const USER_STATUS_OPTIONS = [
  { status: "active", label: "Active" },
  { status: "suspended", label: "Suspended" },
  { status: "inactive", label: "Inactive" },
];

interface AdminUsersTableProps {
  initialPage?: number;
  initialSearch?: string;
  initialSortBy?: SortBy;
  initialSortOrder?: string;
  initialRoles?: UserRoleTypeEnum[];
  initialStatuses?: UserStatusTypeEnum[];
  initialProviders?: UserProviderTypeEnum[];
}

export function UsersTable({
  initialPage = 1,
  initialSearch = "",
  initialSortBy = "createdAt",
  initialSortOrder = "desc",
  initialRoles = undefined,
  initialStatuses = undefined,
  initialProviders = undefined,
}: AdminUsersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Track whether initial load has completed
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Parse URL params or use initial values
  const currentPage = Number(searchParams.get("page") ?? initialPage);
  const currentSearch = searchParams.get("search") ?? initialSearch;
  const currentSortBy = (searchParams.get("sortBy") as SortBy) ?? initialSortBy;
  const currentSortOrder = searchParams.get("sortOrder") ?? initialSortOrder;
  const currentRoles =
    collectSearchParam("roles", searchParams) ?? initialRoles;
  const currentStatuses =
    collectSearchParam("statuses", searchParams) ?? initialStatuses;
  const currentProviders =
    collectSearchParam("providers", searchParams) ?? initialProviders;

  const limit = 10;

  // Data fetching with TanStack Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "admin-users",
      {
        currentPage,
        currentSearch,
        currentSortBy,
        currentSortOrder,
        currentRoles,
        currentStatuses,
        currentProviders,
      },
    ],
    queryFn: async () => {
      const response = await getAllUsers({
        page: currentPage,
        search: currentSearch,
        sortBy: currentSortBy,
        sortOrder: currentSortOrder as SortOrder,
        roles: currentRoles as UserRoleTypeEnum[],
        statuses: currentStatuses as UserStatusTypeEnum[],
        providers: currentProviders as UserProviderTypeEnum[],
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

  const users = data?.success && data?.data ? data.data.users : [];
  const total = data?.success && data?.data ? data.data.total : 0;
  const totalPages = Math.ceil(total / limit);

  const updateUrlWithParams = (params: Partial<GetAllUsersOptions>) => {
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
    let newSortOrder: GetAllUsersOptions["sortOrder"] = "asc";
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

  const getUserInitials = (name: string | null) => {
    if (!name) return "U";

    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const {
    mutate: handleRoleToggle,
    variables: roleActionParams,
    isPending: isRoleActionPending,
  } = useMutation({
    mutationFn: async ({
      userId,
      currentRole,
    }: {
      userId: string;
      currentRole: string;
    }) => {
      const newRole = currentRole === "admin" ? "user" : "admin";

      return await updateUserRole({ userId, role: newRole });
    },
    onSuccess: (data, { currentRole }) => {
      if (data.success) {
        const newRole = currentRole === "admin" ? "user" : "admin";
        toast.success("User role updated successfully", {
          description: `User role has been updated to ${newRole}`,
        });

        // Invalidate the query to refetch the latest data
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      } else {
        toast.error("Failed to update user role", {
          description: data.error || "An error occurred",
        });
      }
    },
    onError: () => {
      console.error("Error updating user role");
      toast.error("Failed to update user role", {
        description: "An error occurred",
      });
    },
  });

  const {
    mutate: handleUserStatus,
    variables: statusActionParams,
    isPending: isUserStatusActionPending,
  } = useMutation({
    mutationFn: async ({
      userId,
      newUserStatus,
    }: {
      userId: string;
      newUserStatus: UserStatus;
    }) => {
      return await updateUserStatus({ userId, status: newUserStatus });
    },
    onSuccess: (data, { newUserStatus }) => {
      if (data.success) {
        toast.success("User status updated successfully", {
          description: `User status has been updated to ${newUserStatus}`,
        });

        // Invalidate the query to refetch the latest data
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      } else {
        toast.error("Failed to update user status", {
          description: data.error || "An error occurred",
        });
      }
    },
    onError: () => {
      console.error("Error updating user status");
      toast.error("Failed to update user status", {
        description: "An error occurred",
      });
    },
  });

  function isCurrentRowPerformingAction(userId: string) {
    return (
      (isRoleActionPending && roleActionParams?.userId === userId) ||
      (isUserStatusActionPending && statusActionParams?.userId === userId)
    );
  }

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];

    // Always show first page
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
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue;

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

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key={"ellipsis-2"}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={"last"}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
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
      <div className="flex flex-wrap gap-2">
        <UserFilter />
        <RefreshUsersButton onClickHandler={refreshQueryHandler} />
      </div>

      {isLoading && !initialLoadComplete ? (
        <UsersTableSkeleton />
      ) : isError ? (
        <UsersTableErrorFallback error={error} />
      ) : (
        <>
          <div className="rounded-md border">
            <Table className="font-mono">
              <TableHeader className="bg-secondary text-secondary-foreground">
                <TableRow>
                  <TableHead className="w-[250px]">
                    <Button
                      variant={"ghost"}
                      onClick={() => handleSort("name")}
                      className="-ml-2"
                      disabled={isLoading}
                    >
                      User
                      {getSortIcon("name")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant={"ghost"}
                      onClick={() => handleSort("email")}
                      className="-ml-2"
                      disabled={isLoading}
                    >
                      Email
                      {getSortIcon("email")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center font-medium">Id</div>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant={"ghost"}
                      onClick={() => handleSort("urlCount")}
                      className="-ml-2"
                      disabled={isLoading}
                    >
                      Urls
                      {getSortIcon("urlCount")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant={"ghost"}
                      onClick={() => handleSort("flaggedUrlCount")}
                      className="-ml-2"
                      disabled={isLoading}
                    >
                      Flagged
                      {getSortIcon("flaggedUrlCount")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant={"ghost"}
                      onClick={() => handleSort("providerType")}
                      className="-ml-2"
                      disabled={isLoading}
                    >
                      Provider
                      {getSortIcon("providerType")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant={"ghost"}
                      onClick={() => handleSort("status")}
                      className="-ml-2"
                      disabled={isLoading}
                    >
                      Status
                      {getSortIcon("status")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <Button
                      variant={"ghost"}
                      onClick={() => handleSort("role")}
                      className="-ml-2"
                      disabled={isLoading}
                    >
                      Role
                      {getSortIcon("role")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[150px]">
                    <Button
                      variant={"ghost"}
                      onClick={() => handleSort("createdAt")}
                      className="-ml-2"
                      disabled={isLoading}
                    >
                      Joined
                      {getSortIcon("createdAt")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      {isLoading && initialLoadComplete ? (
                        <div className="flex justify-center items-center py-2">
                          <Loader2 className="size-4 animate-spin text-primary mr-2" />
                          <p>Loading users...</p>
                        </div>
                      ) : currentSearch ? (
                        "No users found with the search term."
                      ) : (
                        "No users found."
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  // Display users with loading indicator when fetching new data
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      className={
                        isLoading && initialLoadComplete ? "opacity-60" : ""
                      }
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={user.image || undefined}
                              alt={user.name || "User"}
                            />
                            <AvatarFallback>
                              {getUserInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">
                            <p
                              className="truncate"
                              title={user.name || "Unknown User"}
                            >
                              {user.name || "Unknown User"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="truncate" title={user.email}>
                          {user.email}
                        </p>
                      </TableCell>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <p className="text-md rounded-lg bg-secondary p-2 text-center font-medium">
                          {formatNumber(user.urlCount)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-md rounded-lg bg-secondary p-2 text-center font-medium">
                          {formatNumber(user.flaggedUrlCount)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-md">{user.providerType}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-md">
                          <Badge
                            className="rounded-sm"
                            variant={
                              user.status === "active"
                                ? "secondary"
                                : user.status === "suspended"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {user.status}
                          </Badge>
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                          className="flex items-center justify-center gap-1 py-1.5"
                        >
                          {user.role === "admin" ? (
                            <ShieldIcon className="size-3.5" />
                          ) : (
                            <User className="size-3.5" />
                          )}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p>{new Date(user.createdAt).toLocaleString()}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant={"outline"}
                              size={"icon"}
                              disabled={
                                isCurrentRowPerformingAction(user.id) ||
                                isLoading
                              }
                            >
                              {isCurrentRowPerformingAction(user.id) ? (
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
                              className={cn(
                                "text-blue-600",
                                user.role === "admin" ? "text-destructive" : ""
                              )}
                              onClick={() =>
                                handleRoleToggle({
                                  userId: user.id,
                                  currentRole: user.role,
                                })
                              }
                              // currently, this feature is under review and hence is disabled.
                              disabled={true}
                              // disabled={isCurrentRowPerformingAction(user.id)}
                            >
                              {user.role === "user" ? (
                                <ShieldIcon className="mr-2 size-3.5 text-blue-600" />
                              ) : (
                                <User className="mr-2 size-3.5 text-destructive" />
                              )}
                              {`${
                                user.role === "admin" ? "Demote" : "Promote"
                              } to ${user.role === "admin" ? "User" : "Admin"}`}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="gap-2">
                                <UserRoundPen className="size-4 text-muted-foreground" />
                                <span>User Status</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuRadioGroup
                                    value={user.status}
                                    onValueChange={(status) => {
                                      handleUserStatus({
                                        userId: user.id,
                                        newUserStatus: status as UserStatus,
                                      });
                                    }}
                                  >
                                    {USER_STATUS_OPTIONS.map((statusOption) => (
                                      <DropdownMenuRadioItem
                                        key={statusOption.status}
                                        disabled={isCurrentRowPerformingAction(
                                          user.id
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

          {totalPages > 1 && (
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
                        handlePageChange(Math.min(totalPages, currentPage + 1));
                      }
                    }}
                    className={
                      isLoading ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          <div className="text-xs text-muted-foreground flex items-center gap-2">
            {isLoading && initialLoadComplete ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                <span>Refreshing data...</span>
              </>
            ) : (
              <>
                Showing {users.length} of {total} users.
                {currentSearch && ` Search results for "${currentSearch}".`}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
