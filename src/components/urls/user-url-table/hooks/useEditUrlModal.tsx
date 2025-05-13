import { useState } from "react";

export function useEditUrlModal() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState<{
    id: number;
    shortCode: string;
    name: string | null;
  } | null>(null);

  const handleEdit = (id: number, shortCode: string, name: string | null) => {
    setUrlToEdit({ id, shortCode, name });
    setIsEditModalOpen(true);
  };

  return {
    isEditModalOpen,
    setIsEditModalOpen,
    urlToEdit,
    handleEdit,
  };
}
