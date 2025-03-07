import { GridBackgroundLayout } from "@/components/grid-background";
import { SiteHeader } from "@/components/header/site-header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <SiteHeader />
      <div className="flex flex-col min-h-screen items-center justify-center">
        <GridBackgroundLayout>
          <div className="container px-2 pt-16 md:pt-24">{children}</div>
        </GridBackgroundLayout>
      </div>
    </div>
  );
}
