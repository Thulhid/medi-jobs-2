import { useState } from "react";
import { Hospital } from "@/modules/backend/hospital/types/types";

interface UpdateHospitalData {
  name: string;
  logo: string;
  email: string;
  description: string;
  banner: string;
  city?: string | null;
  country?: string | null;
  mobile?: string | null;
}

export const useUpdateHospital = () => {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [hospitalLoading, setHospitalLoading] = useState<boolean>(false);

  const updateHospital = async (id: string, data: UpdateHospitalData) => {
    try {
      setHospitalLoading(true);
      const response = await fetch(`/api/backend/hospital/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update hospital with ID ${id}`);
      }

      const updatedHospital = await response.json();
      setHospital(updatedHospital);
      return updatedHospital;
    } catch (err) {
      console.error(`Error updating hospital with ID ${id}:`, err);
      return null;
    } finally {
      setHospitalLoading(false);
    }
  };

  return { updateHospital, hospital, hospitalLoading };
};
