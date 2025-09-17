import useSWR from "swr";

const fetchRecruiterType = async () => {
  const res = await fetch("/api/backend/recruiter-type");
  if (!res.ok) throw new Error("Failed to fetch recruiter-type");
  return res.json();
};

export const useGetAllRecruiterType = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/recruiter-type",
    fetchRecruiterType,
  );

  return {
    recruiterType: data ?? [],
    recruiterTypeLoading: isLoading,
    mutate,
    error,
  };
};
