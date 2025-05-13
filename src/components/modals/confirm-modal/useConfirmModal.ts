import { useState } from "react";

export function useConfirmaModal() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const toggleConfirmModal = () => {
    setIsConfirmModalOpen((prev) => !prev);
  };

  return {
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    toggleConfirmModal,
  };
}
