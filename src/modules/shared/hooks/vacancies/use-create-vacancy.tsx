import { useState } from "react";
import { Vacancy } from "@/modules/backend/vacancy/types/types";

interface CreateVacanciesData {
  city: string;
  corporateTitleId: string;
  country: string;
  designation: string;
  email: string;
  employmentTypeId: string;
  endDate: string;
  noOfPositions: string;
  sbuId: string;
  startDate: string;
  summary: string;
  workPlaceTypeId: string;
  hospitalId: string;
  recruiterId?: string;
  banner: string;
  contactPerson: string;
  portalUrl: string;
  readStatus: string;
  statusId: string;
  vacancyOption: string;
}

export const useCreateVacancies = () => {
  const [vacancies, setVacancies] = useState<Vacancy | null>(null);
  const [vacanciesLoading, setVacanciesLoading] = useState<boolean>(false);

  const createVacancies = async (data: CreateVacanciesData) => {
    try {
      setVacanciesLoading(true);
      const response = await fetch("/api/backend/vacancy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let details: { status?: number; details?: string } | null = null;
        try {
          details = await response.json();
        } catch {}
        console.error("Create vacancy failed", {
          status: response.status,
          details,
        });
        throw new Error("Failed to create Vacancies");
      }

      const createdSbu = await response.json();
      setVacancies(createdSbu);
      return createdSbu;
    } catch (err) {
      console.error("Error creating Vacancies:", err);
      return null;
    } finally {
      setVacanciesLoading(false);
    }
  };

  return { createVacancies, vacancies, vacanciesLoading };
};
