import { useState } from "react";

export const useToggleHospitalStatus = () => {
  const [hospitalLoading, setHospitalLoading] = useState<boolean>(false);
  const [hospitalSuccess, setHospitalSuccess] = useState<boolean>(false);

  const toggleHospitalStatus = async (id: string | number, activeStatus: boolean) => {
    try {
      setHospitalLoading(true);
      setHospitalSuccess(false);

      const response = await fetch(`/api/backend/hospital/${id}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activeStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle Hospital status with ID ${id}`);
      }

      const result = await response.json();
      setHospitalSuccess(true);
      return result;
    } catch (err) {
      console.error(`Error toggling hospital status with ID ${id}:`, err);
      return false;
    } finally {
      setHospitalLoading(false);
    }
  };

  return { toggleHospitalStatus, hospitalLoading, hospitalSuccess };
};