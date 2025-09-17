"use client";

import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useGetAllVacancies } from "@/modules/backend/vacancy/hooks/use-get-all-vacancy";
import { isEditableStatus } from "@/modules/shared/utils/status";
import { useGetAllCorporateTitle } from "@/modules/backend/corporate-title/hooks/use-get-all-corporate-title";
import { useGetAllRecruiter } from "@/modules/backend/recruiter/hooks/use-get-all-recruiter";

interface UserRole {
  metaCode?: string;
}
interface User {
  id?: string | number;
  role?: UserRole;
}
interface Session {
  user?: User;
}

interface Hospital {
  id: string | number;
  name: string;
}
interface CorporateTitle {
  id: string | number;
  name: string;
}

interface Status {
  name?: string;
}
interface Recruiter {
  userId?: string | number;
}
interface Click {
  id: string | number;
}

interface VacancyRow {
  id: string | number;
  designation?: string;
  hospitalId?: string | number;
  corporateTitleId?: string | number;
  status?: Status;
  startDate?: string;
  endDate?: string;
  hospital?: Hospital;
  recruiter?: Recruiter;
  clicks?: Click[];
}

export default function RecruiterVacanciesList() {
  const { data: session } = useSession() as { data: Session | null };
  const userId = session?.user?.id;
  const role = session?.user?.role?.metaCode?.toUpperCase?.();
  const isRecruiter = role === "RECRUITER" || role === "LEAD_RECRUITER";
  const isLead = !!role?.includes("LEAD");

  const { vacancies, vacanciesLoading } = useGetAllVacancies();
  const { corporateTitle } = useGetAllCorporateTitle();
  const { recruiter } = useGetAllRecruiter();

  const [selectedHospitalId] = useState<string>("");
  const [selectedTitleId, setSelectedTitleId] = useState<string>("");
  const [availableOnly, setAvailableOnly] = useState<boolean>(true);
  const [viewScope, setViewScope] = useState<"mine" | "all">("all");
  const [currentRecruiterHospitalId, setCurrentRecruiterHospitalId] = useState<number | null>(null);

  // Get current recruiter's hospital ID
  useEffect(() => {
    if (session?.user?.id && recruiter && !vacanciesLoading) {
      const currentRecruiter = (recruiter as Array<{ userId: number; hospitalId: number }>)
        .find(r => String(r.userId) === String(session?.user?.id));
      if (currentRecruiter?.hospitalId) {
        setCurrentRecruiterHospitalId(currentRecruiter.hospitalId);
      }
    }
  }, [session?.user?.id, recruiter, vacanciesLoading]);

  const myVacancies = useMemo(() => {
    return ((vacancies as VacancyRow[]) ?? []).filter(
      (v) => String(v.recruiter?.userId) === String(userId),
    );
  }, [vacancies, userId]);

  // Filter all vacancies to only show from current recruiter's hospital
  const hospitalVacancies = useMemo(() => {
    if (!currentRecruiterHospitalId) return [];
    return ((vacancies as VacancyRow[]) ?? []).filter(
      (v) => String(v.hospitalId) === String(currentRecruiterHospitalId),
    );
  }, [vacancies, currentRecruiterHospitalId]);

  const filteredVacancies = useMemo(() => {
    const today = new Date();
    const isAvailable = (v: VacancyRow) => {
      const approved = v.status?.name === "Approved";
      const notEnded =
        !v.endDate || new Date(v.endDate) >= new Date(today.toDateString());
      return approved && notEnded;
    };

    // Lead recruiter scopes: mine | all (but all is limited to their hospital)
    let pool: VacancyRow[] = myVacancies;
    if (isLead && viewScope === "all") {
      pool = hospitalVacancies; // Only show vacancies from their hospital
    }

    return (
      pool
        ?.filter((v) =>
          selectedHospitalId
            ? String(v.hospitalId) === selectedHospitalId
            : true,
        )
        ?.filter((v) =>
          selectedTitleId
            ? String(v.corporateTitleId) === selectedTitleId
            : true,
        )
        ?.filter((v) => (availableOnly ? isAvailable(v) : true)) ?? []
    );
  }, [
    myVacancies,
    hospitalVacancies,
    recruiter,
    userId,
    isLead,
    viewScope,
    selectedHospitalId,
    selectedTitleId,
    availableOnly,
  ]);

  function getHeaderTitle(
    isLeadRecruiter: boolean,
    scope: "mine" | "all",
  ): string {
    if (isLeadRecruiter && scope !== "mine") {
      return "All Vacancies";
    }
    return "My Vacancies";
  }

  function getHeaderSubtitle(
    isLeadRecruiter: boolean,
    scope: "mine" | "all",
  ): string {
    if (isLeadRecruiter && scope !== "mine") {
      return "All vacancies from your hospital (Lead Recruiter view).";
    }
    return "Manage and track your assigned vacancies.";
  }

  function getStatusBadgeClass(name: string): string {
    const lower = String(name || "").toLowerCase();
    if (lower === "approved")
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700";
    if (lower === "rejected")
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700";
    if (lower === "pending")
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700";
    return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700";
  }

  if (!session) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">My Vacancies</h1>
        <p className="text-gray-600">Please sign in to view your vacancies.</p>
      </div>
    );
  }

  if (!isRecruiter) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">My Vacancies</h1>
        <p className="text-rose-600">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            {getHeaderTitle(isLead, viewScope)}
          </h1>
          <p className="text-gray-600">
            {getHeaderSubtitle(isLead, viewScope)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/recruiter-dashboard/vacancies/new"
            className="px-4 py-2 border text-white rounded bg-[#007F4E] hover:bg-[#1E4A28]"
          >
            Add Vacancy
          </Link>
        </div>
      </div>

      {isLead && (
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-2 border rounded ${viewScope === "mine" ? "bg-gray-100" : "hover:bg-gray-50"}`}
            onClick={() => setViewScope("mine")}
          >
            My Vacancies
          </button>
          <button
            className={`px-3 py-2 border rounded ${viewScope === "all" ? "bg-gray-100" : "hover:bg-gray-50"}`}
            onClick={() => setViewScope("all")}
          >
            All Vacancies
          </button>
          <div className="flex gap-3 flex-wrap items-center">
            <select
              className="border rounded px-3 py-2"
              value={selectedTitleId}
              onChange={(e) => setSelectedTitleId(e.target.value)}
            >
              <option value="" hidden>Select Designation</option>
              {((corporateTitle as CorporateTitle[]) ?? []).map((t) => (
                <option key={String(t.id)} value={String(t.id)}>
                  {t.name}
                </option>
              ))}
            </select>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              Available only
            </label>
          </div>
        </div>
      )}



      <div className="rounded border overflow-x-auto">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
          <div className="font-medium">Results</div>
          <div className="text-sm text-gray-500">
            {vacanciesLoading
              ? "Loading..."
              : `${filteredVacancies.length} item(s)`}
          </div>
        </div>
        {filteredVacancies.length === 0 ? (
          <div className="px-4 py-6 text-sm text-gray-600">
            {vacanciesLoading
              ? "Loading vacancies..."
              : "No vacancies match your filters."}
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2">Designation</th>
                {/* <th className="text-left px-4 py-2">Hospital</th> */}
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Start</th>
                <th className="text-left px-4 py-2">End</th>
                {/* <th className="text-left px-4 py-2">Clicks</th> */}
                <th className="text-left px-4 py-2">Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredVacancies.map((v) => (
                <tr key={String(v.id)} className="border-t">
                  <td className="px-4 py-2">{v.designation}</td>
                  {/* <td className="px-4 py-2">{v.hospital?.name}</td> */}
                  <td className="px-4 py-2">
                    {(() => {
                      const statusName = String(v.status?.name ?? "-");
                      const cls = getStatusBadgeClass(statusName);
                      return <span className={cls}>{statusName}</span>;
                    })()}
                  </td>
                  <td className="px-4 py-2">
                    {v.startDate
                      ? new Date(v.startDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {v.endDate ? new Date(v.endDate).toLocaleDateString() : "-"}
                  </td>
                  {/* <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      <span className="text-blue-600 font-medium">{v.clicks?.length ?? 0}</span>
                      <span className="text-gray-400 text-xs">views</span>
                    </div>
                  </td> */}
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/recruiter-dashboard/vacancies/${v.id}`}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="View"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                      {isEditableStatus(v.status?.name) && (
                        <Link
                          href={`/recruiter-dashboard/vacancies/${v.id}/edit`}
                          className="text-gray-400 hover:text-gray-600"
                          aria-label="Edit"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
