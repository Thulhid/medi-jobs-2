import { useState } from "react";

export const useDeleteSbu = () => {
  const [sbuLoading, setSbuLoading] = useState<boolean>(false);
  const [sbuSuccess, setSbuSuccess] = useState<boolean>(false);

  const deleteSbu = async (id: string) => {
    try {
      setSbuLoading(true);
      setSbuSuccess(false);

      const response = await fetch(`/api/backend/sbu/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete Sbu with ID ${id}`);
      }

      setSbuSuccess(true);
      return true;
    } catch (err) {
      console.error(`Error deleting sbu with ID ${id}:`, err);
      return false;
    } finally {
      setSbuLoading(false);
    }
  };

  return { deleteSbu, sbuLoading, sbuSuccess };
};
