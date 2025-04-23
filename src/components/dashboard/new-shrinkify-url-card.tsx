import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { CoreUrlShortner } from "../urls/core-url-shortner/core-url-shortner";

type NewShrinkifyURLCardProps = ComponentProps<"div">;

export const NewShrinkifyURLCard = ({
  className,
  ...props
}: NewShrinkifyURLCardProps) => {
  return (
    <Card className={cn("h-116 overflow-hidden", className)} {...props}>
      <CardHeader className="flex flex-row gap-3 items-center pb-2">
        <Plus className="size-10 md:size-12 items-center rounded-lg p-2 text-purple-500 bg-purple-400/10" />
        <div className="space-y-1">
          <CardTitle>Create New Shrinkify URL</CardTitle>
          <CardDescription>
            Enter a long URL to create a shrinkify link.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-0 overflow-y-scroll">
        <CoreUrlShortner className="h-full mx-auto aspect-auto p-1" />
      </CardContent>
    </Card>
  );
};
