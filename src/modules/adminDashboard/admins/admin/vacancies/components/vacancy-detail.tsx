"use client";

import { useParams } from "next/navigation";
import { useGetVacanciesById } from "@/modules/backend/vacancy/hooks/use-gey-by-id-vacancy";
import { useGetAllStatus } from "@/modules/backend/status/hooks/use-get-all-status";
import { useEffect, useState } from "react";
import type { Status } from "@/modules/backend/status/types/types";
import { CustomTableBackHeader } from "@/modules/shared/components/custom-table-back-header";

export const VacancyDetail = () => {
  const { id: routeId } = useParams<{ id: string }>();
  const id = String(routeId ?? "");
  const { vacancies, vacanciesLoading } = useGetVacanciesById(id);
  const { status } = useGetAllStatus();


  const [selectedStatusId, setSelectedStatusId] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const statuses: Status[] = (status ?? []) as Status[];

  useEffect(() => {
    if (vacancies?.statusId) setSelectedStatusId(String(vacancies.statusId));
    const existingReason =
      (vacancies as { rejectionReason?: string } | null)?.rejectionReason ?? "";
    setRejectionReason(existingReason);
  }, [vacancies?.statusId, vacancies,rejectionReason]);


  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <CustomTableBackHeader header="vacancies" link="true" />
        <h1 className="text-3xl font-bold text-black">Vacancy Details</h1>
        <p className="text-gray-600">View full vacancy information.</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        {vacanciesLoading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : !vacancies ? (
          <div className="text-sm text-rose-600">Vacancy not found.</div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-semibold text-gray-900">
                  {vacancies.designation}
                </div>
                <div className="text-gray-600">
                  {vacancies.hospital?.name ?? "-"}
                </div>
              </div>
              
            </div>

            {vacancies.banner ? (
                                                                                            
              <img
                src={vacancies.banner}
                alt="Vacancy banner"
                className="w-full h-40 object-cover rounded"
              />
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-gray-500">Corporate Title</div>
                <div className="text-sm">
                  {vacancies.corporateTitle?.name ?? "-"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Employment Type</div>
                <div className="text-sm">
                  {vacancies.employmentType?.name ?? "-"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Workplace Type</div>
                <div className="text-sm">
                  {vacancies.workPlaceType?.name ?? "-"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">SBU</div>
                <div className="text-sm">{vacancies.sbu?.name ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="text-sm">
                  {(() => {
                    const currentName = (statuses.find(
                      (s: Status) => String(s.id) === String(selectedStatusId),
                    )?.name || "-") as string;
                    const name = String(currentName || "").toLowerCase();
                    const cls =
                      name === "approved"
                        ? "bg-green-100 text-green-800"
                        : name === "rejected"
                          ? "bg-rose-100 text-rose-800"
                          : name === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800";
                    return (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}
                      >
                        {currentName}
                      </span>
                    );
                  })()}
                </div>
              </div>
              {(() => {
                const existingReason =
                  (vacancies as { rejectionReason?: string } | null)
                    ?.rejectionReason ?? "";
                if (!existingReason) return null;
                return (
                  <div className="md:col-span-2">
                    <div className="text-xs text-gray-500">
                      Rejection Reason
                    </div>
                    <div className="text-sm">{existingReason}</div>
                  </div>
                );
              })()}
              <div>
                <div className="text-xs text-gray-500">Recruiter</div>
                <div className="text-sm">
                  {(() => {
                    const r = (
                      vacancies as {
                        recruiter?: {
                          firstname?: string;
                          lastname?: string;
                          email?: string;
                        };
                      }
                    )?.recruiter;
                    if (!r) return "-";
                    const full = [r.firstname, r.lastname]
                      .filter(Boolean)
                      .join(" ")
                      .trim();
                    return full || r.email || "-";
                  })()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-sm">
                  {vacancies.city}
                  {vacancies.country ? `, ${vacancies.country}` : ""}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">No. of Positions</div>
                <div className="text-sm">{vacancies.noOfPositions}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Start Date</div>
                <div className="text-sm">
                  {vacancies.startDate
                    ? new Date(vacancies.startDate).toLocaleDateString()
                    : "-"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">End Date</div>
                <div className="text-sm">
                  {vacancies.endDate
                    ? new Date(vacancies.endDate).toLocaleDateString()
                    : "-"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-sm">{vacancies.email}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Portal URL</div>
                <div className="text-sm">
                  <a
                    href={vacancies.portalUrl || "#"}
                    className="text-[#1e4a28] hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {vacancies.portalUrl || "-"}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Summary
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">
                {vacancies.summary || "-"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
