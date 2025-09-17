import useSWR from "swr";

const fetchVacancies = async () => {
  const res = await fetch("/api/backend/vacancy");
  if (!res.ok) throw new Error("Failed to fetch Vacancies");
  return res.json();
};

export const useGetAllVacancies = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/vacancy",
    fetchVacancies,
  );

  return {
    vacanciesData: data ?? [],
    isVacanciesDataLoading: isLoading,
    mutate,
    error,
  };
};
