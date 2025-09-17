import { useState } from "react";

export const useDeleteSbu = () => {
  const [systemUserLoading, setSystemUserLoading] = useState<boolean>(false);
  const [systemUserSuccess, setSystemUserSuccess] = useState<boolean>(false);

  const deleteSystemUser = async (id: string) => {
    try {
      setSystemUserLoading(true);
      setSystemUserSuccess(false);

      const response = await fetch(`/api/backend/system-user/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete SystemUser with ID ${id}`);
      }

      setSystemUserSuccess(true);
      return true;
    } catch (err) {
      console.error(`Error deleting SystemUser with ID ${id}:`, err);
      return false;
    } finally {
      setSystemUserLoading(false);
    }
  };

  return { deleteSystemUser, systemUserLoading, systemUserSuccess };
};
