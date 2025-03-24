import {
  AlertTriangleIcon,
  DatabaseIcon,
  House,
  LayoutDashboard,
  LayoutDashboardIcon,
  Link,
  Link2Icon,
  LogIn,
  UserPlus,
  UsersIcon,
} from "lucide-react";

export const navRoutes = {
  "/": {
    id: "home",
    path: "/",
    label: "Home",
    icon: <House className="size-4" />,
  },
  "/dashboard": {
    id: "dashboard",
    path: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="size-4" />,
  },
};

export const mobileNavRoutes = {
  ...navRoutes,
  "/login": {
    id: "login",
    path: "/login",
    label: "Login",
    icon: <LogIn className="size-4" />,
  },
  "/register": {
    id: "register",
    path: "/register",
    label: "Create Account",
    icon: <UserPlus className="size-4" />,
  },
};

export const dashboardNavRoutes = {
  "/dashboard": {
    id: "dashboard",
    path: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="size-4" />,
  },
  "/my-urls": {
    id: "my-urls",
    path: "/my-urls",
    label: "My URLs",
    icon: <Link className="size-4" />,
  },
};

export type AdminDashboardNavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  exact: boolean;
};

export const adminDashboardNavItems: AdminDashboardNavItem[] = [
  {
    label: "Overview",
    path: "/admin",
    icon: <LayoutDashboardIcon className="size-4" />,
    exact: true,
  },
  {
    label: "URLs",
    path: "/admin/urls",
    icon: <Link2Icon className="size-4" />,
    exact: true,
  },
  {
    label: "Flagged URLs",
    path: "/admin/urls/flagged",
    icon: <AlertTriangleIcon className="size-4" />,
    exact: true,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: <UsersIcon className="size-4" />,
    exact: true,
  },
  {
    label: "Database",
    path: "/admin/database",
    icon: <DatabaseIcon className="size-4" />,
    exact: true,
  },
];
