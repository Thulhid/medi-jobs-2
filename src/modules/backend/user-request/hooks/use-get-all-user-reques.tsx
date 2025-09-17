import useSWR from "swr";

const fetchUserRequest = async () => {
  const res = await fetch("/api/backend/user-request");
  if (!res.ok) throw new Error("Failed to fetch UserRequest");
  return res.json();
};

export const useGetAllUserRequest = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/user-request",
    fetchUserRequest,
  );

  return {
    userRequest: data ?? [],
    userRequestLoading: isLoading,
    mutate,
    error,
  };
};
