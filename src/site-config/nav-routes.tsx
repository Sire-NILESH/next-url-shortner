import { House, LayoutDashboard, Link, LogIn, UserPlus } from "lucide-react";

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
  // "/stats": {
  //   id: "stats",
  //   path: "/stats",
  //   label: "Stats",
  //   icon: <BarChart3Icon className="size-4" />,
  // },
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
