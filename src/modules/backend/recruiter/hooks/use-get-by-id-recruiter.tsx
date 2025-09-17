import { useEffect, useState } from "react";
import { Recruiter } from "@/modules/backend/recruiter/types/types";

export const useGetHospitalById = (id: string) => {
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [recruiterLoading, setRecruiterLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecruiter = async () => {
      if (!id) {
        setRecruiterLoading(false);
        return;
      }

      try {
        setRecruiterLoading(true);
        const response = await fetch(`/api/backend/recruiter/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch Recruiter with ID ${id}`);
        }

        const data = await response.json();
        setRecruiter(data);
      } catch (err) {
        console.error(`Error fetching Recruiter with ID ${id}:`, err);
      } finally {
        setRecruiterLoading(false);
      }
    };

    fetchRecruiter();
  }, [id]);

  return { recruiter, recruiterLoading };
};
