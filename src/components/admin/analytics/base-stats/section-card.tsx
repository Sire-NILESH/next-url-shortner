import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ComponentProps, JSX, Suspense } from "react";
import SectionCardStatValueSkeleton from "./section-card-stat-value-skeleton";

export type SectionCardData = {
  title: string;
  valueElement: JSX.Element;
  description?: string;
  badgeText?: string;
  footer?: {
    mainText?: string;
    subText?: string;
  };
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
};

type Props = ComponentProps<"div"> & {
  data: SectionCardData;
};

const SectionCard = ({
  className,
  data: {
    title,
    valueElement,
    badgeText,
    footer,
    icon: Icon,
    iconPosition = "right",
  },
  ...props
}: Props) => {
  return (
    <Card className={cn("@container/card", className)} {...props}>
      <CardHeader className="relative">
        {title && (
          <CardDescription className="text-card-foreground">
            {title}
          </CardDescription>
        )}
        <div className="flex items-center gap-2">
          {Icon && iconPosition === "left" && (
            <Icon className="size-6 text-muted-foreground" />
          )}

          <Suspense fallback={<SectionCardStatValueSkeleton />}>
            {valueElement}
          </Suspense>

          {Icon && iconPosition === "right" && (
            <Icon className="size-6 text-muted-foreground" />
          )}
        </div>
        {badgeText && (
          <div className="absolute -right-0.5">
            <Badge
              variant={"outline"}
              className="flex gap-1 rounded-lg rounded-r-none text-xs bg-card"
            >
              {badgeText}
            </Badge>
          </div>
        )}
      </CardHeader>
      {footer && (
        <CardFooter className="flex-col items-start gap-1 text-sm">
          {footer.mainText && (
            <div className="line-clamp-1 flex gap-2 font-medium">
              {footer.mainText}
            </div>
          )}
          {footer.subText && (
            <div className="text-muted-foreground">{footer.subText}</div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default SectionCard;
