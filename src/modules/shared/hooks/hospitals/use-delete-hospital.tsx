import { useState } from "react";

export const useDeleteMenuItem = () => {
  const [hospitalLoading, setHospitalLoading] = useState<boolean>(false);
  const [hospitalSuccess, setHospitalSuccess] = useState<boolean>(false);

  const deleteHospital = async (id: string) => {
    try {
      setHospitalLoading(true);
      setHospitalSuccess(false);

      const response = await fetch(`/api/backend/hospital/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete Hospital with ID ${id}`);
      }

      setHospitalSuccess(true);
      return true;
    } catch (err) {
      console.error(`Error deleting hospital with ID ${id}:`, err);
      return false;
    } finally {
      setHospitalLoading(false);
    }
  };

  return { deleteHospital, hospitalLoading, hospitalSuccess };
};
