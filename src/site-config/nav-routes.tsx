import { House, LayoutDashboard, LogIn, UserPlus } from "lucide-react";

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
