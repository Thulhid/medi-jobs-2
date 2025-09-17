import { useState } from "react";
import { Sbu } from "@/modules/backend/sbu/types/types";

interface CreateSbuData {
  name: string;
  hospitalId: string;
  city: string;
}

export const useCreateSbu = () => {
  const [hospital, setSbu] = useState<Sbu | null>(null);
  const [hospitalLoading, setSbuLoading] = useState<boolean>(false);

  const createSbu = async (data: CreateSbuData) => {
    try {
      setSbuLoading(true);
      const response = await fetch("/api/backend/sbu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create Sbu");
      }

      const createdSbu = await response.json();
      setSbu(createdSbu);
      return createdSbu;
    } catch (err) {
      console.error("Error creating Sbu:", err);
      return null;
    } finally {
      setSbuLoading(false);
    }
  };

  return { createSbu, hospital, hospitalLoading };
};
