import { useState } from "react";
import { Sbu } from "@/modules/backend/sbu/types/types";

interface UpdateSbuData {
  name: string;
  hospitalId: string;
  city: string;
}

export const useUpdateSbu = () => {
  const [sbu, setSbu] = useState<Sbu | null>(null);
  const [sbuLoading, setSbuLoading] = useState<boolean>(false);

  const updateSbu = async (id: string, data: UpdateSbuData) => {
    try {
      setSbuLoading(true);
      const response = await fetch(`/api/backend/sbu/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update Sbu with ID ${id}`);
      }

      const updatedSbu = await response.json();
      setSbu(updatedSbu);
      return updatedSbu;
    } catch (err) {
      console.error(`Error updating Sbu with ID ${id}:`, err);
      return null;
    } finally {
      setSbuLoading(false);
    }
  };

  return { updateSbu, sbu, sbuLoading };
};
