import useSWR from "swr";

const fetchSystemUser = async () => {
  const res = await fetch("/api/backend/system-user");
  if (!res.ok) throw new Error("Failed to fetch Ststem Users");
  return res.json();
};

export const useGetAllStystemUser = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/system-user",
    fetchSystemUser,
  );

  return {
    systemusers: data ?? [],
    systemusersLoading: isLoading,
    mutate,
    error,
  };
};
