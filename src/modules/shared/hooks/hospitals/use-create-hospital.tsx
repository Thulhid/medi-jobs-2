import { useState } from "react";
import { Hospital } from "@/modules/backend/hospital/types/types";

interface CreateHospitalData {
  name: string;
  logo: string;
  email: string;
  description: string;
  banner: string;
  city?: string | null;
  country?: string | null;
  mobile?: string | null;
}

export const useCreateHospital = () => {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [hospitalLoading, setHospitalLoading] = useState<boolean>(false);

  const createHospital = async (data: CreateHospitalData) => {
    try {
      setHospitalLoading(true);
      const response = await fetch("/api/backend/hospital", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create Hospital");
      }

      const createdHospital = await response.json();
      setHospital(createdHospital);
      return createdHospital;
    } catch (err) {
      console.error("Error creating hospital:", err);
      return null;
    } finally {
      setHospitalLoading(false);
    }
  };

  return { createHospital, hospital, hospitalLoading };
};
