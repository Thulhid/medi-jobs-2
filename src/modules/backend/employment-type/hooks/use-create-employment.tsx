import { useState } from "react";
import { EmploymentType } from "@/modules/backend/employment-type/types/types";

interface CreateEmploymentTypeData {
  name: string;
  metaCode: string;
}

export const useCreateEmploymentTitle = () => {
  const [employmentTitle, setEmploymentTitle] = useState<EmploymentType | null>(
    null,
  );
  const [employmentTitleLoading, setEmploymentTitleLoading] =
    useState<boolean>(false);

  const createEmploymentTitle = async (data: CreateEmploymentTypeData) => {
    try {
      setEmploymentTitleLoading(true);
      const response = await fetch("/api/backend/employment-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create EmploymentTitle");
      }

      const createdEmploymentTitle = await response.json();
      setEmploymentTitle(createdEmploymentTitle);
      return createdEmploymentTitle;
    } catch (err) {
      console.error("Error creating EmploymentTitle:", err);
      return null;
    } finally {
      setEmploymentTitleLoading(false);
    }
  };

  return { createEmploymentTitle, employmentTitle, employmentTitleLoading };
};
