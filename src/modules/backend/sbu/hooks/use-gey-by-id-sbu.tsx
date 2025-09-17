import { useEffect, useState } from "react";
import { Sbu } from "@/modules/backend/sbu/types/types";

export const useGetSbuById = (id: string) => {
  const [sbu, setSbu] = useState<Sbu | null>(null);
  const [sbuLoading, setSbuLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSbu = async () => {
      if (!id) {
        setSbuLoading(false);
        return;
      }

      try {
        setSbuLoading(true);
        const response = await fetch(`/api/backend/sbu/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch Sbu with ID ${id}`);
        }

        const data = await response.json();
        setSbu(data);
      } catch (err) {
        console.error(`Error fetching Sbu with ID ${id}:`, err);
      } finally {
        setSbuLoading(false);
      }
    };

    fetchSbu();
  }, [id]);

  return { sbu, sbuLoading };
};
