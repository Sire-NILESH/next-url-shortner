import React from "react";

type Props = {
  error: Error;
};

const DashboardClientErrorFallback = ({ error }: Props) => {
  return (
    <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/10 rounded-md text-red-600 dark:text-red-400">
      <h3 className="font-bold mb-2">Error Loading Dashboard</h3>
      <p>
        {error instanceof Error
          ? error.message + ". Please try again later"
          : "An unknown error occurred while loading your dashboard contents. Please try again later"}
      </p>
    </div>
  );
};

export default DashboardClientErrorFallback;
