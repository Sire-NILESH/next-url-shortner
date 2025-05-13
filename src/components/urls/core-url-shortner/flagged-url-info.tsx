import { cn } from "@/lib/utils";
import { ThreatTypeEnum } from "@/types/server/types";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import React, { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  threat: ThreatTypeEnum;
  flaggedInfo: {
    flagged: boolean;
    reason: string | null;
    message?: string;
  };
};

const FlaggedURLInfo = ({
  className,
  threat,
  flaggedInfo,
  ...props
}: Props) => {
  const isThreat = Boolean(threat);

  return (
    <div
      className={cn(
        "p-2 md:p-8 rounded-md border",
        isThreat
          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[27rem] space-y-2">
        <div className="flex flex-col items-center justify-center gap-2">
          {isThreat ? (
            <ShieldAlert className="size-10 sm:size-7 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="size-10 sm:size-7 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          )}
          <p
            className={cn(
              "text-base sm:text-lg font-semibold",
              isThreat
                ? "text-red-700 dark:text-red-500"
                : "text-yellow-800 dark:text-yellow-300"
            )}
          >
            {isThreat
              ? "This URL has been flagged"
              : "This URL has been flagged for review"}
          </p>
        </div>

        <p
          className={cn(
            "text-xs mt-1",
            isThreat
              ? "text-red-700 dark:text-red-400"
              : "text-yellow-700 dark:text-yellow-400"
          )}
        >
          {flaggedInfo.message ||
            "This URL will be reviewed by an administrator before it becomes fully active."}
        </p>

        {flaggedInfo.reason && (
          <p
            className={cn(
              "text-sm mt-2",
              isThreat
                ? "text-red-600 dark:text-red-500"
                : "text-yellow-600 dark:text-yellow-400"
            )}
          >
            <span className="font-medium">Reason:</span> {flaggedInfo.reason}
          </p>
        )}
      </div>
    </div>
  );
};

export default FlaggedURLInfo;
