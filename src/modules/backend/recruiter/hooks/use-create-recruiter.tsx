import { useState } from "react";
import { Recruiter } from "@/modules/backend/recruiter/types/types";

interface CreateRecruiterData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  password: string;
  recruiterTypeId: string;
  hospitalId: string;
  roleId: string;
}

export const useCreateRecruiter = () => {
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [recruiterLoading, setRecruiterLoading] = useState<boolean>(false);

  const createRecruiter = async (data: CreateRecruiterData) => {
    try {
      setRecruiterLoading(true);
      const response = await fetch("/api/backend/recruiter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create Recruiter");
      }

      const createdRecruiter = await response.json();
      setRecruiter(createdRecruiter);
      return createdRecruiter;
    } catch (err) {
      console.error("Error creating Recruiter:", err);
      // Return the error message to be handled by the calling component
      return { error: (err as Error).message };
    } finally {
      setRecruiterLoading(false);
    }
  };

  return { createRecruiter, recruiter, recruiterLoading };
};
