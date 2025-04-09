"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  GetAllUsersOptions,
  UserWithoutPassword,
} from "@/server/actions/admin/users/get-all-users";
import { updateUserRole } from "@/server/actions/admin/users/update-user-role";
import { useMutation } from "@tanstack/react-query";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Loader2,
  MoreHorizontalIcon,
  ShieldIcon,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SortBy = GetAllUsersOptions["sortBy"];

interface UsersTableProps {
  users: UserWithoutPassword[];
  total: number;
  currentPage: number;
  currentSearch: string;
  currentSortBy: SortBy;
  currentSortOrder: string;
}

export function UsersTable({
  users,
  total,
  currentPage,
  currentSearch,
  currentSortBy,
  currentSortOrder,
}: UsersTableProps) {
  const router = useRouter();

  // Calculate pagination
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  // Handle sort change
  const handleSort = (column: SortBy) => {
    const params = new URLSearchParams();

    // Keep current search if any
    if (currentSearch) {
      params.set("search", currentSearch);
    }

    if (column !== undefined) {
      // Set sort parameters
      params.set("sortBy", column);
    }

    // Toggle sort order if clicking the same column
    if (currentSortBy === column) {
      params.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortOrder", "asc");
    }

    // Reset to page 1 when sorting
    params.set("page", "1");

    // Navigate with updated params
    router.push(`/admin/users?${params.toString()}`);
  };

  // Generate pagination links
  const getPaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          href={`/admin/users?page=1${
            currentSearch ? `&search=${currentSearch}` : ""
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

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue; // Skip first and last page as they're always shown

      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`/admin/users?page=${i}${
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

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href={`/admin/users?page=${totalPages}${
              currentSearch ? `&search=${currentSearch}` : ""
            }${
              currentSortBy
                ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                : ""
            }`}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const getSortIcon = (column: SortBy) => {
    if (currentSortBy !== column) {
      return <ArrowUpDown className="ml-2 size-4" />;
    }

    return currentSortOrder === "asc" ? (
      <ArrowUp className="ml-2 size-4" />
    ) : (
      <ArrowDown className="ml-2 size-4" />
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
    variables: currentActionParams,
    isPending: isCurrentActionPending,
  } = useMutation({
    mutationFn: async ({
      userId,
      currentRole,
    }: {
      userId: string;
      currentRole: string;
    }) => {
      const newRole = currentRole === "admin" ? "user" : "admin";

      return await updateUserRole(userId, newRole);
    },
    onSuccess: (data, { currentRole }) => {
      if (data.success) {
        const newRole = currentRole === "admin" ? "user" : "admin";
        toast.success("User role updated successfully", {
          description: `User role has been updated to ${newRole}`,
        });

        router.refresh();
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

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table className="font-mono">
          <TableHeader className="bg-secondary text-secondary-foreground">
            <TableRow>
              <TableHead className="w-[250px]">
                <Button
                  variant={"ghost"}
                  onClick={() => handleSort("name")}
                  className="-ml-2"
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
                >
                  Flagged Urls
                  {getSortIcon("flaggedUrlCount")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant={"ghost"}
                  onClick={() => handleSort("providerType")}
                  className="-ml-2"
                >
                  Provider
                  {getSortIcon("providerType")}
                </Button>
              </TableHead>

              <TableHead className="w-[120px]">
                <Button
                  variant={"ghost"}
                  onClick={() => handleSort("role")}
                  className="-ml-2"
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
                <TableCell colSpan={5} className="h-24 text-center">
                  {currentSearch
                    ? "No users found with the given search criteria"
                    : "No users found"}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
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
                        {user.name || "Unknown User"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {" "}
                    <p className="text-md rounded-lg bg-secondary/50 p-2 text-center font-medium">
                      {user.urlCount}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-md rounded-lg bg-secondary/50 p-2 text-center font-medium">
                      {user.flaggedUrlCount}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-md">{user.providerType}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
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
                            isCurrentActionPending &&
                            currentActionParams?.userId === user.id
                          }
                        >
                          {isCurrentActionPending &&
                          currentActionParams?.userId === user.id ? (
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
                          className={
                            user.role === "admin"
                              ? "text-destructive"
                              : "text-blue-600"
                          }
                          onClick={() =>
                            handleRoleToggle({
                              userId: user.id,
                              currentRole: user.role,
                            })
                          }
                          disabled={
                            isCurrentActionPending &&
                            currentActionParams?.userId === user.id
                          }
                        >
                          {user.role === "user" ? (
                            <ShieldIcon className="size-3.5 text-blue-600" />
                          ) : (
                            <User className="size-3.5 text-destructive" />
                          )}
                          {`${
                            user.role === "admin" ? "Demote" : "Promote"
                          } to ${user.role === "admin" ? "User" : "Admin"}`}
                        </DropdownMenuItem>
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
                href={`/admin/users?page=${Math.max(1, currentPage - 1)}${
                  currentSearch ? `&search=${currentSearch}` : ""
                }${
                  currentSortBy
                    ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                    : ""
                }`}
              />
            </PaginationItem>

            {getPaginationItems()}

            <PaginationItem>
              <PaginationNext
                href={`/admin/users?page=${Math.min(
                  totalPages,
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
        Showing {users.length} of {total} users
        {currentSearch && ` matching "${currentSearch}"`}
      </div>
    </div>
  );
}
