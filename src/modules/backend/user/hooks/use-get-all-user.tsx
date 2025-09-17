import useSWR from "swr";

const fetchUser = async () => {
  const res = await fetch("/api/backend/user");
  if (!res.ok) throw new Error("Failed to fetch User");
  return res.json();
};

export const useGetAllUser = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/user",
    fetchUser,
  );

  return {
    user: data ?? [],
    userLoading: isLoading,
    mutate,
    error,
  };
};
