import useSWR from "swr";

const fetchRecruiters = async () => {
  const res = await fetch("/api/backend/recruiter");
  if (!res.ok) throw new Error("Failed to fetch recruiters");
  return res.json();
};

export const useGetAllRecruiter = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/recruiter",
    fetchRecruiters,
  );

  return {
    recruiter: data ?? [],
    recruiterLoading: isLoading,
    mutate,
    error,
  };
};
