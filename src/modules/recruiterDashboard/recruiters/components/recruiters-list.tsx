"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGetAllRecruiter } from "@/modules/backend/recruiter/hooks/use-get-all-recruiter";
import { useGetAllVacancies } from "@/modules/backend/vacancy/hooks/use-get-all-vacancy";
import { Recruiter } from "@prisma/client";

export default function LeadRecruitersList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role?.metaCode?.toUpperCase?.();
  const isLead = (role || "").includes("LEAD");
  const [currentRecruiterHospitalId, setCurrentRecruiterHospitalId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "authenticated" && !isLead) {
      router.replace("/recruiter-dashboard");
    }
  }, [status, isLead, router]);

  const { recruiter, recruiterLoading } = useGetAllRecruiter();
  const { vacancies } = useGetAllVacancies();

  // Get current lead recruiter's hospital ID
  useEffect(() => {
    if (session?.user?.id && recruiter && !recruiterLoading) {
      const currentRecruiter = (recruiter as Array<Recruiter & { hospital?: { id: number; name: string } }>)
        .find(r => r.userId === session.user.id);
      if (currentRecruiter?.hospital?.id) {
        setCurrentRecruiterHospitalId(currentRecruiter.hospital.id);
      }
    }
  }, [session?.user?.id, recruiter, recruiterLoading]);

  // Filter recruiters to show only those from the same hospital
  const filteredRecruiters = currentRecruiterHospitalId
    ? (recruiter as Array<Recruiter & { hospital?: { id: number; name: string } }> || [])
        .filter(r => r.hospital?.id === currentRecruiterHospitalId)
    : [];

  const vacancyCountsByRecruiter = new Map<string, number>();
  (
    vacancies as Array<{ recruiter?: { userId?: number } }> | undefined
  )?.forEach((v) => {
    const key = String(v?.recruiter?.userId ?? "");
    if (!key) return;
    vacancyCountsByRecruiter.set(
      key,
      (vacancyCountsByRecruiter.get(key) ?? 0) + 1,
    );
  });

  if (status === "loading" || !isLead) {
    return <div className="p-4 text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Team Stats</h1>
        <p className="text-gray-600">Recruiters from your hospital</p>
      </div>

      <div className="rounded border overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Hospital</th>
              <th className="text-left px-4 py-2">Jobs Added</th>
            </tr>
          </thead>
          <tbody>
            {recruiterLoading || !currentRecruiterHospitalId ? (
              <tr>
                <td className="px-4 py-4" colSpan={4}>
                  Loading...
                </td>
              </tr>
            ) : filteredRecruiters.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan={4}>
                  No recruiters found in your hospital
                </td>
              </tr>
            ) : (
              filteredRecruiters.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2">
                    {r.firstname} {r.lastname}
                  </td>
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2">{r.hospital?.name}</td>
                  <td className="px-4 py-2">
                    {vacancyCountsByRecruiter.get(String(r.userId)) ?? 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
