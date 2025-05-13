import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  error: Error;
};

const UserUrlsErrorFallback = ({ error, className, ...props }: Props) => {
  return (
    <div
      className={cn(
        "p-4 border border-red-300 bg-red-50 dark:bg-red-900/10 rounded-md text-red-600 dark:text-red-400",
        className
      )}
      {...props}
    >
      <h3 className="font-bold mb-2">Error Loading your URLs</h3>
      <p>
        {error instanceof Error
          ? error.message + ". Please try again later"
          : "An unknown error occurred while loading all your URL contents. Please try again later"}
      </p>
    </div>
  );
};

export default UserUrlsErrorFallback;
