import { useState } from "react";
import { Recruiter } from "@/modules/backend/recruiter/types/types";

interface UpdateRecruiterData {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  recruiterTypeId: number | string;
}

export const useUpdateRecruiter = () => {
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [recruiterLoading, setRecruiterLoading] = useState<boolean>(false);

  const updateRecruiter = async (id: string, data: UpdateRecruiterData) => {
    try {
      setRecruiterLoading(true);
      const response = await fetch(`/api/backend/recruiter/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update Recruiter with ID ${id}`);
      }

      const updatedRecruiter = await response.json();
      setRecruiter(updatedRecruiter);
      return updatedRecruiter;
    } catch (err) {
      console.error(`Error updating Recruiter with ID ${id}:`, err);
      return null;
    } finally {
      setRecruiterLoading(false);
    }
  };

  return { updateRecruiter, recruiter, recruiterLoading };
};
