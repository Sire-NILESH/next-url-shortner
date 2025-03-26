import AdminLayoutBreadCrumb from "@/components/admin/admin-layout-breadcrum";
import { AppSidebar } from "@/components/admin/admin-sidebar";
import FooterCompact from "@/components/footer/footer-compact";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default async function AdminLayout({ children }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            <AdminLayoutBreadCrumb />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        <FooterCompact />
      </SidebarInset>
    </SidebarProvider>
  );
}
