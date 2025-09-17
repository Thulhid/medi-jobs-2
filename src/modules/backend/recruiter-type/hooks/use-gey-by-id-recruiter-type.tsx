import { useEffect, useState } from "react";
import { RecruiterType } from "@/modules/backend/recruiter-type/types/types";

export const useGetRecruiterTypeById = (id: string) => {
  const [recruiterType, setRecruiterType] = useState<RecruiterType | null>(
    null,
  );
  const [recruiterTypeLoading, setRecruiterTypeLoading] =
    useState<boolean>(true);

  useEffect(() => {
    const fetchRecruiterType = async () => {
      if (!id) {
        setRecruiterTypeLoading(false);
        return;
      }

      try {
        setRecruiterTypeLoading(true);
        const response = await fetch(`/api/backend/recruiter-type/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch RecruiterType with ID ${id}`);
        }

        const data = await response.json();
        setRecruiterType(data);
      } catch (err) {
        console.error(`Error fetching RecruiterType with ID ${id}:`, err);
      } finally {
        setRecruiterTypeLoading(false);
      }
    };

    fetchRecruiterType();
  }, [id]);

  return { recruiterType, recruiterTypeLoading };
};
