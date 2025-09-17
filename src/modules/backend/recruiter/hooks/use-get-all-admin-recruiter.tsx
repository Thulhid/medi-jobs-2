import useSWR from "swr";

const fetchAdminRecruiters = async () => {
  const res = await fetch("/api/backend/recruiter/admin");
  if (!res.ok) throw new Error("Failed to fetch admin recruiters");
  return res.json();
};

export const useGetAllAdminRecruiter = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/recruiter/admin",
    fetchAdminRecruiters,
  );

  return {
    recruiter: data ?? [],
    recruiterLoading: isLoading,
    mutate,
    error,
  };
};