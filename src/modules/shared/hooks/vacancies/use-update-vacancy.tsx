import { useState } from "react";
import { Vacancy } from "@/modules/backend/vacancy/types/types";

interface UpdateVacanciesData {
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
  recruiterId: string;
  banner: string;
  contactPerson: string;
  portalUrl: string;
  readStatus: string;
  statusId: string;
  vacancyOption: string;
  rejectionReason: string | null;
}

export const useUpdateVacancies = () => {
  const [vacancies, setVacancies] = useState<Vacancy | null>(null);
  const [vacanciesLoading, setVacanciesLoading] = useState<boolean>(false);

  const updateVacancies = async (
    id: string,
    data: Partial<UpdateVacanciesData>,
  ) => {
    try {
      setVacanciesLoading(true);
      const response = await fetch(`/api/backend/vacancy/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let serverMsg = "";
        try {
          const j = await response.json();
          serverMsg = j?.error || JSON.stringify(j);
        } catch {}
        throw new Error(
          `Failed to update Vacancies with ID ${id} (status ${response.status})${serverMsg ? `: ${serverMsg}` : ""}`,
        );
      }

      const updatedVacancies = await response.json();
      setVacancies(updatedVacancies);
      return updatedVacancies;
    } catch (err) {
      console.error(`Error updating Vacancies with ID ${id}:`, err);
      return null;
    } finally {
      setVacanciesLoading(false);
    }
  };

  return { updateVacancies, vacancies, vacanciesLoading };
};
