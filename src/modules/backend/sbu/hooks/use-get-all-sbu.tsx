import useSWR from "swr";

const fetchSbu = async () => {
  const res = await fetch("/api/backend/sbu");
  if (!res.ok) throw new Error("Failed to fetch Sbu");
  return res.json();
};

export const useGetAllSbu = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/sbu",
    fetchSbu,
  );

  return {
    sbu: data ?? [],
    sbuLoading: isLoading,
    mutate,
    error,
  };
};
