import useSWR from "swr";

const fetchStatus = async () => {
  const res = await fetch("/api/backend/status");
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
};

export const useGetAllStatus = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/status",
    fetchStatus,
  );

  return {
    status: data ?? [],
    statusLoading: isLoading,
    mutate,
    error,
  };
};
