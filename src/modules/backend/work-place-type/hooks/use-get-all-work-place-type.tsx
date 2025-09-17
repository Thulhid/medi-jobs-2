import useSWR from "swr";

const fetchWorkPlaceType = async () => {
  const res = await fetch("/api/backend/work-place-type");
  if (!res.ok) throw new Error("Failed to fetch work-place-type");
  return res.json();
};

export const useGetAllWorkPlaceType = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/work-place-type",
    fetchWorkPlaceType,
  );

  return {
    workPlaceType: data ?? [],
    workPlaceTypeLoading: isLoading,
    mutate,
    error,
  };
};
