import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import React, { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  flaggedInfo: {
    flagged: boolean;
    reason: string | null;
    message: string | undefined;
  };
};

const FlaggedURLInfo = ({ className, flaggedInfo, ...props }: Props) => {
  return (
    <div
      className={cn(
        "p-2 md:p-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[27rem] space-y-2">
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-center gap-2">
          <AlertTriangle className="size-10 sm:size-7 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-base sm:text-lg font-semibold text-yellow-800 dark:text-yellow-300">
            This URL has been flagged for review
          </p>
        </div>

        <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
          {flaggedInfo.message ||
            "This URL will be reviewed by an administrator before it becomes fully active."}
        </p>
        {flaggedInfo.reason && (
          <p className="text-sm mt-2 text-yellow-600 dark:text-yellow-400">
            <span className="font-medium">Reason:</span>{" "}
            {flaggedInfo.reason || "Unknown reason"}
          </p>
        )}
      </div>
    </div>
  );
};

export default FlaggedURLInfo;
