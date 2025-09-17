import { useState } from "react";
import { CorporateTitle } from "@/modules/backend/corporate-title/types/types";

interface CreateCorporateTitleData {
  name: string;
  metaCode: string;
}

export const useCreateCorporateTitle = () => {
  const [corporateTitle, setCorporateTitle] = useState<CorporateTitle | null>(
    null,
  );
  const [corporateTitleLoading, setCorporateTitleLoading] =
    useState<boolean>(false);

  const createCorporateTitle = async (data: CreateCorporateTitleData) => {
    try {
      setCorporateTitleLoading(true);
      const response = await fetch("/api/backend/corporate-title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create CorporateTitle");
      }

      const createdCorporateTitle = await response.json();
      setCorporateTitle(createdCorporateTitle);
      return createdCorporateTitle;
    } catch (err) {
      console.error("Error creating CorporateTitle:", err);
      return null;
    } finally {
      setCorporateTitleLoading(false);
    }
  };

  return { createCorporateTitle, corporateTitle, corporateTitleLoading };
};
