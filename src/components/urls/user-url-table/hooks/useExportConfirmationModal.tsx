import { useState } from "react";

export function useExportConfirmationModal() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleExportConfirmation = () => {
    setIsExportModalOpen(true);
  };

  return {
    isExportModalOpen,
    setIsExportModalOpen,
    handleExportConfirmation,
  };
}
