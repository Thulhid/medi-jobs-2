import { useEffect, useState } from "react";
import { Vacancy } from "@/modules/backend/vacancy/types/types";

export const useGetVacanciesById = (id: string) => {
  const [vacancies, setVacancies] = useState<Vacancy | null>(null);
  const [vacanciesLoading, setVacanciesLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVacancies = async () => {
      if (!id) {
        setVacanciesLoading(false);
        return;
      }

      try {
        setVacanciesLoading(true);
        const response = await fetch(`/api/backend/vacancy/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch Vacancies with ID ${id}`);
        }

        const data = await response.json();
        setVacancies(data);
      } catch (err) {
        console.error(`Error fetching Vacancies with ID ${id}:`, err);
      } finally {
        setVacanciesLoading(false);
      }
    };

    fetchVacancies();
  }, [id]);

  return { vacancies, vacanciesLoading };
};
