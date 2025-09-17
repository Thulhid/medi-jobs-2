import useSWR from "swr";

const fetchEmploymentTitle = async () => {
  const res = await fetch("/api/backend/employment-type");
  if (!res.ok) throw new Error("Failed to fetch CorporateTitle");
  return res.json();
};

export const useGetAllEmploymentTitle = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/employment-type",
    fetchEmploymentTitle,
  );

  return {
    employmentTitle: data ?? [],
    employmentTitleLoading: isLoading,
    mutate,
    error,
  };
};
