import useSWR from "swr";

const fetchVacanciesOptions = async () => {
  const res = await fetch("/api/backend/vacancy-options");
  if (!res.ok) throw new Error("Failed to fetch Vacancies option");
  return res.json();
};

export const useGetAllVacancies = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/vacancy-options",
    fetchVacanciesOptions,
  );

  return {
    vacanciesOptions: data ?? [],
    vacanciesOptionsLoading: isLoading,
    mutate,
    error,
  };
};
