import { useState } from "react";

export const useDeleteMenuItem = () => {
  const [recruiterLoading, setRecruiterLoading] = useState<boolean>(false);
  const [recruiterSuccess, setRecruiterSuccess] = useState<boolean>(false);

  const deleteRecruiter = async (id: string) => {
    try {
      setRecruiterLoading(true);
      setRecruiterSuccess(false);

      const response = await fetch(`/api/backend/recruiter/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to delete Recruiter with ID ${id}`,
        );
      }

      setRecruiterSuccess(true);
      return { success: true };
    } catch (err) {
      console.error(`Error deleting Recruiter with ID ${id}:`, err);
      return { success: false, error: (err as Error).message };
    } finally {
      setRecruiterLoading(false);
    }
  };

  return { deleteRecruiter, recruiterLoading, recruiterSuccess };
};
