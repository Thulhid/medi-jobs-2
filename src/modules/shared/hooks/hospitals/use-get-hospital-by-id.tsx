import { useEffect, useState } from "react";
import { Hospital } from "@/modules/backend/hospital/types/types";

export const useGetHospitalById = (id: string) => {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [hospitalLoading, setHospitalLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHospital = async () => {
      if (!id) {
        setHospitalLoading(false);
        return;
      }

      try {
        setHospitalLoading(true);
        const response = await fetch(`/api/backend/hospital/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch Hospital with ID ${id}`);
        }

        const data = await response.json();
        setHospital(data);
      } catch (err) {
        console.error(`Error fetching Hospital with ID ${id}:`, err);
      } finally {
        setHospitalLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  return { hospital, hospitalLoading };
};
