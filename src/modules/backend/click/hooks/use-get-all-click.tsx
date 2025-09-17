import useSWR from "swr";

const fetchClick = async () => {
  const res = await fetch("/api/backend/click");
  if (!res.ok) throw new Error("Failed to fetch clicks");
  return res.json();
};

export const useGetAllClick = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/click",
    fetchClick,
  );

  return {
    click: data ?? [],
    clickLoading: isLoading,
    mutate,
    error,
  };
};
