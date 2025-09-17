"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { HospitalVacancies } from "@/modules/backend/hospital/types/types";
import { useGetHospitalById } from "@/modules/backend/hospital/hooks/use-gey-by-id-hospital";
import { CustomTableBackHeader } from "@/modules/shared/components/custom-table-back-header";

export const HospitalDetail = () => {
  const { id: routeId } = useParams<{ id: string }>();
  const id = String(routeId ?? "");
  const { hospital, hospitalLoading } = useGetHospitalById(id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <CustomTableBackHeader header="hospitals" link="true" />
        <h1 className="text-3xl font-bold text-black">Hospital Details</h1>
        <p className="text-gray-600">View full hospital information.</p>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        {hospitalLoading ? (
          <div className="p-6 text-sm text-gray-600">Loading...</div>
        ) : !hospital ? (
          <div className="p-6 text-sm text-rose-600">Hospital not found.</div>
        ) : (
          <div>
            {/* Banner */}
            <div className="w-full h-40 bg-gray-100 relative">
              {hospital.banner ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hospital.banner}
                  alt={`${hospital.name} banner`}
                  className="w-full h-40 object-cover"
                />
              ) : null}
              {/* Logo */}
              <div className="absolute -bottom-8 left-6 w-20 h-20 rounded bg-white border flex items-center justify-center overflow-hidden">
                {hospital.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hospital.logo}
                    alt={hospital.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
            </div>

            <div className="p-6 pt-12 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-semibold text-gray-900">
                    {hospital.name}
                  </div>
                  <div className="text-gray-600">{hospital.email}</div>
                </div>
                <Link
                  href={`/admin-dashboard/hospitals/${hospital.id}/edit`}
                  className="px-4 py-2 rounded bg-[#1e4a28] text-white hover:bg-[#007f4e]"
                >
                  Edit
                </Link>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Description
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">
                  {hospital.description || "-"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-gray-500">Active</div>
                  <div className="text-sm">
                    {hospital.activeStatus ? "Yes" : "No"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Created At</div>
                  <div className="text-sm">
                    {hospital.createdAt
                      ? new Date(hospital.createdAt).toLocaleString()
                      : "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Updated At</div>
                  <div className="text-sm">
                    {hospital.updatedAt
                      ? new Date(hospital.updatedAt).toLocaleString()
                      : "-"}
                  </div>
                </div>
              </div>

              {Array.isArray(hospital.vacancy) &&
                hospital.vacancy.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      Vacancies ({hospital.vacancy.length})
                    </div>
                    <div className="rounded border">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-3 py-2">Designation</th>
                            <th className="text-left px-3 py-2">End Date</th>
                            <th className="text-left px-3 py-2">Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hospital.vacancy.map(
                            (v: HospitalVacancies["vacancy"][number]) => (
                              <tr key={v.id} className="border-t">
                                <td className="px-3 py-2">{v.designation}</td>
                                <td className="px-3 py-2">
                                  {v.endDate
                                    ? new Date(v.endDate).toLocaleDateString()
                                    : "-"}
                                </td>
                                <td className="px-3 py-2">
                                  {v.city}
                                  {v.country ? `, ${v.country}` : ""}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
