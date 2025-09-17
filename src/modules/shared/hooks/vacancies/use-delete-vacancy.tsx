import { useState } from "react";

export const useDeleteVacancies = () => {
  const [vacanciesLoading, setVacanciesLoading] = useState<boolean>(false);
  const [vacanciesSuccess, setVacanciesSuccess] = useState<boolean>(false);

  const deleteVacancies = async (id: string) => {
    try {
      setVacanciesLoading(true);
      setVacanciesSuccess(false);

      const response = await fetch(`/api/backend/vacancy/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete Vacancies with ID ${id}`);
      }

      setVacanciesSuccess(true);
      return true;
    } catch (err) {
      console.error(`Error deleting Vacancies with ID ${id}:`, err);
      return false;
    } finally {
      setVacanciesLoading(false);
    }
  };

  return { deleteVacancies, vacanciesLoading, vacanciesSuccess };
};
