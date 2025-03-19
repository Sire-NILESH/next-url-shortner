import { SiteFooter } from "@/components/footer/site-footer";
import { GridBackgroundLayout } from "@/components/backgrounds/grid-background";
import { SiteHeader } from "@/components/header/site-header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-col min-h-screen">
        <GridBackgroundLayout>
          <div className="container">{children}</div>
        </GridBackgroundLayout>
      </div>
      <SiteFooter />
    </>
  );
}
