import {
  ChartSpline,
  DatabaseIcon,
  House,
  LayoutDashboard,
  LayoutDashboardIcon,
  Link,
  Link2Icon,
  LinkIcon,
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
    icon: <LayoutDashboardIcon />,
    exact: true,
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
    icon: <ChartSpline />,
    exact: true,
  },
  {
    label: "URLs",
    path: "/admin/urls",
    icon: <Link2Icon />,
    exact: true,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: <UsersIcon />,
    exact: true,
  },
  {
    label: "Database",
    path: "/admin/database",
    icon: <DatabaseIcon />,
    exact: true,
  },
];

export const adminDashboardPlatformNavItems: AdminDashboardNavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboardIcon />,
    exact: true,
  },
  {
    label: "My URLs",
    path: "/my-urls",
    icon: <LinkIcon />,
    exact: true,
  },
];
