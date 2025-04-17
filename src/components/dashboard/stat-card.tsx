import { ReactNode, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatNumberValue } from "@/lib/formatNum";
import CountUp from "react-countup";

function hasDecimal(num: number) {
  return !Number.isInteger(num);
}

export default function StatCard({
  value,
  title,
  description,
  icon,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  value: number;
}) {
  const formatFn = useCallback((value: number) => {
    return formatNumberValue().format(value);
  }, []);

  return (
    <Card className="shadow-sm flex flex-row items-center justify-between">
      <CardHeader className="flex flex-row gap-3 items-center pb-2">
        {icon}
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="justify-end pl-0">
        <p className="text-2xl md:text-4xl font-bold font-mono text-right">
          <CountUp
            useEasing
            preserveValue
            redraw={false}
            end={value}
            decimals={hasDecimal(value) ? 1 : 0}
            formattingFn={formatFn}
          />
        </p>
      </CardContent>
    </Card>
  );
}
