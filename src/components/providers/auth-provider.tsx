"use client";

import { isPublicPath } from "@/site-config/nav-routes";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthSession>{children}</AuthSession>
    </SessionProvider>
  );
}

function AuthSession({ children }: { children: ReactNode }) {
  const session = useSession();
  const path = usePathname();

  if (session.status === "unauthenticated" && !isPublicPath(path)) {
    window.location.replace("/login");
  }

  return <>{children}</>;
}
