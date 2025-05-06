import { useState } from "react";

export function useDeleteConfirmationModal() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<number | null>(null);

  const confirmDelete = (id: number) => {
    setUrlToDelete(id);
    setIsDeleteModalOpen(true);
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    urlToDelete,
    confirmDelete,
  };
}
