import useSWR from "swr";

const fetchHospitals = async () => {
  const res = await fetch("/api/backend/hospital");
  if (!res.ok) throw new Error("Failed to fetch hospitals");
  return res.json();
};

export const useGetAllHospitals = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/backend/hospital",
    fetchHospitals,
  );

  return {
    hospitalData: data ?? [],
    isHospitalDataLoading: isLoading,
    mutate,
    error,
  };
};
