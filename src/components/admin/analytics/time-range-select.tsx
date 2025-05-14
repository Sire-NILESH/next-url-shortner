import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  value?: string | undefined;
  onValueChange?(value: string): void;
  selectTriggerClassName?: string;
};

const TimeRangeSelect = ({
  className,
  selectTriggerClassName,
  value,
  onValueChange,
  ...props
}: Props) => {
  return (
    <div className={cn("", className)} {...props}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            "@[767px]/card:hidden flex w-30",
            selectTriggerClassName
          )}
          aria-label="Select a value"
        >
          <SelectValue placeholder="Past 6M" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="24H" className="rounded-lg">
            Past 24H
          </SelectItem>
          <SelectItem value="7D" className="rounded-lg">
            Past 7D
          </SelectItem>
          <SelectItem value="30D" className="rounded-lg">
            Past 30D
          </SelectItem>
          <SelectItem value="3M" className="rounded-lg">
            Past 3M
          </SelectItem>
          <SelectItem value="6M" className="rounded-lg">
            Past 6M
          </SelectItem>
          <SelectItem value="1Y" className="rounded-lg">
            Past 1Y
          </SelectItem>
          <SelectItem value="all time" className="rounded-lg">
            All Time
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeRangeSelect;
