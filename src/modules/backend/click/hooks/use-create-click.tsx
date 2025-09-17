import { useState } from "react";
import { Click } from "@/modules/backend/click/types/types";

interface CreateClickData {
  vacancyId: number;
}

export const useCreateClick = () => {
  const [click, setClick] = useState<Click | null>(null);
  const [clickLoading, setClickLoading] = useState<boolean>(false);

  const createClick = async (data: CreateClickData) => {
    try {
      setClickLoading(true);
      const response = await fetch("/api/backend/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create Click");
      }

      const createdClick = await response.json();
      setClick(createdClick);
      return createdClick;
    } catch (err) {
      console.error("Error creating Click:", err);
      return null;
    } finally {
      setClickLoading(false);
    }
  };

  return { createClick, click, clickLoading };
};
