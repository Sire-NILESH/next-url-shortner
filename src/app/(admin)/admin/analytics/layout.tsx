import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { adminModules } from "../page";
import AdminPageHeader from "@/components/admin/admin-page-header";

type Props = {
  children: ReactNode;
  sectionCards: ReactNode;
  urlCreationChart: ReactNode;
  clicksInfoChart: ReactNode;
  userByProviderChart: ReactNode;
  userGrowthChart: ReactNode;
};

const [adminAnalyticsPageModule] = adminModules.filter(
  (module) => module.id === "admin-analytics"
);

const AdminAnalyticsParallelRoutesLayout = ({
  children,
  sectionCards,
  urlCreationChart,
  clicksInfoChart,
  userGrowthChart,
  userByProviderChart,
}: Props) => {
  return (
    <>
      <AdminPageHeader className="mb-6" module={adminAnalyticsPageModule} />
      <div className="">
        <Card className="bg-transparent border-transparent shadow-none sm:bg-card sm:border-border sm:shadow-sm">
          <CardContent className="px-0 sm:px-6">
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {sectionCards}

                  <div className="min-h-98">{urlCreationChart}</div>

                  <div className="@6xl/main:grid-cols-3 @3xl/main:grid-cols-2 grid grid-cols-1 gap-4">
                    <div className="flex-1 min-h-108">{clicksInfoChart}</div>
                    <div className="flex-1 min-h-108">
                      {userByProviderChart}
                    </div>
                    <div className="@6xl/main:col-span-1 @3xl/main:col-span-2 col-span-1 min-h-108">
                      {userGrowthChart}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {children}
      </div>
    </>
  );
};

export default AdminAnalyticsParallelRoutesLayout;
