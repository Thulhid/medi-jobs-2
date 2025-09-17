import useSWR from "swr";

const fetchUserRole = async () => {
  const res = await fetch("/api/backend/user-role");
  if (!res.ok) throw new Error("Failed to fetch UserRole");
  return res.json();
};

export const useGetAllUserRole = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/user-role",
    fetchUserRole,
  );

  return {
    userRole: data ?? [],
    userRoleLoading: isLoading,
    mutate,
    error,
  };
};
