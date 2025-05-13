import React from "react";

type Props = {
  error: Error;
};

const AdminUrlsTableErrorFallback = ({ error }: Props) => {
  return (
    <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/10 rounded-md text-red-600 dark:text-red-400">
      <h3 className="font-bold mb-2">Error loading URLs</h3>
      <p>
        {error instanceof Error ? error.message : "An unknown error occurred"}
      </p>
    </div>
  );
};

export default AdminUrlsTableErrorFallback;
