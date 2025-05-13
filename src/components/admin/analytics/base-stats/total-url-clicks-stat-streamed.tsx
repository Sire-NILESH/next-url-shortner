import { CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/formatNum";
import { cn } from "@/lib/utils";
import { getTotalUrlClickStat } from "@/server/actions/admin/urls/get-total-url-clicks-stat";
import { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {};

export default async function TotalUrlClicksStatStreamed({
  className,
  ...props
}: Props) {
  const response = await getTotalUrlClickStat();

  return (
    <CardTitle
      className={cn(
        "@[250px]/card:text-3xl text-2xl font-semibold tabular-nums",
        className
      )}
      {...props}
    >
      {response.success ? formatNumber(response.data?.totalUrlClicks) : "Error"}
    </CardTitle>
  );
}
