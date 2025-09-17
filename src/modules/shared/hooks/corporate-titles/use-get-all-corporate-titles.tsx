import useSWR from "swr";

const fetchCorporateTitle = async () => {
  const res = await fetch("/api/backend/corporate-title");
  if (!res.ok) throw new Error("Failed to fetch CorporateTitle");
  return res.json();
};

export const useGetAllCorporateTitles = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/corporate-title",
    fetchCorporateTitle,
  );

  return {
    corporateTitleData: data ?? [],
    isCorporateTitleDataLoading: isLoading,
    mutate,
    error,
  };
};
