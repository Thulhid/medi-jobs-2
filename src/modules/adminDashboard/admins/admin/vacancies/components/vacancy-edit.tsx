"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useGetVacanciesById } from "@/modules/backend/vacancy/hooks/use-gey-by-id-vacancy";
import { useUpdateVacancies } from "@/modules/backend/vacancy/hooks/use-update-vacancy";
import { useGetAllStatus } from "@/modules/backend/status/hooks/use-get-all-status";
import { useGetAllCorporateTitle } from "@/modules/backend/corporate-title/hooks/use-get-all-corporate-title";
import { useGetAllEmploymentTitle } from "@/modules/backend/employment-type/hooks/use-get-all-employment";
import { useGetAllWorkPlaceType } from "@/modules/backend/work-place-type/hooks/use-get-all-work-place-type";
import { useGetAllSbu } from "@/modules/backend/sbu/hooks/use-get-all-sbu";
import { useGetAllHospital } from "@/modules/backend/hospital/hooks/use-get-all-hospital";
import { CustomTableBackHeader } from "@/modules/shared/components/custom-table-back-header";

export const VacancyEdit = () => {
  const params = useParams<{ id: string }>();
  const id = String(params?.id || "");
  const router = useRouter();

  const { vacancies, vacanciesLoading } = useGetVacanciesById(id);
  const { updateVacancies, vacanciesLoading: saving } = useUpdateVacancies();
  const { status } = useGetAllStatus();
  const { corporateTitle } = useGetAllCorporateTitle();
  const { employmentTitle } = useGetAllEmploymentTitle();
  const { workPlaceType } = useGetAllWorkPlaceType();
  const { sbu } = useGetAllSbu();
  const { hospital } = useGetAllHospital();

  const [form, setForm] = useState({
    designation: "",
    summary: "",
    banner: "",
    city: "",
    country: "",
    email: "",
    portalUrl: "",
    contactPerson: "",
    noOfPositions: "",
    startDate: "",
    endDate: "",
    corporateTitleId: "",
    employmentTypeId: "",
    workPlaceTypeId: "",
    statusId: "",
    sbuId: "",
    hospitalId: "",
    recruiterId: "",
    vacancyOption: "",
    readStatus: "",
    rejectionReason: "",
  });
  const [initial, setInitial] = useState<typeof form | null>(null);
  // UI helpers to match create form
  const [applicationMethod, setApplicationMethod] = useState<
    "online" | "via_email"
  >("online");
  const [durationDays] = useState<string>("");
  const [endDateTouched, setEndDateTouched] = useState<boolean>(false);

  // Filter SBUs to show only those belonging to the selected hospital
  const filteredSbu = useMemo(() => {
    if (!form.hospitalId || !sbu) return [];
    return sbu.filter(
      (s: { hospitalId: number }) => 
        String(s.hospitalId) === String(form.hospitalId)
    );
  }, [sbu, form.hospitalId]);

  useEffect(() => {
    if (!vacancies) return;
    const next = {
      designation: vacancies.designation || "",
      summary: vacancies.summary || "",
      banner: vacancies.banner || "",
      city: vacancies.city || "",
      country: vacancies.country || "",
      email: vacancies.email || "",
      portalUrl: vacancies.portalUrl || "",
      contactPerson: vacancies.contactPerson || "",
      noOfPositions: String(vacancies.noOfPositions ?? ""),
      startDate: vacancies.startDate
        ? new Date(vacancies.startDate).toISOString().slice(0, 10)
        : "",
      endDate: vacancies.endDate
        ? new Date(vacancies.endDate).toISOString().slice(0, 10)
        : "",
      corporateTitleId: String(vacancies.corporateTitleId ?? ""),
      employmentTypeId: String(vacancies.employmentTypeId ?? ""),
      workPlaceTypeId: String(vacancies.workPlaceTypeId ?? ""),
      statusId: String(vacancies.statusId ?? ""),
      sbuId: String(vacancies.sbuId ?? ""),
      hospitalId: String(vacancies.hospitalId ?? ""),
      recruiterId: String(vacancies.recruiterId ?? ""),
      vacancyOption: String(vacancies.vacancyOption ?? ""),
      readStatus: String(vacancies.readStatus ?? ""),
      rejectionReason: String(
        (vacancies as { rejectionReason?: string }).rejectionReason ?? "",
      ),
    };
    setForm(next);
    setInitial(next);

    const method: "online" | "via_email" = String(
      vacancies.portalUrl || "",
    ).trim()
      ? "online"
      : "via_email";
    setApplicationMethod(method);
  }, [vacancies]);

  const updateField = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!form.startDate || !durationDays || endDateTouched) return;
    const start = new Date(form.startDate);
    const days = Number(durationDays);
    if (isNaN(days) || days <= 0 || isNaN(start.getTime())) return;
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    const iso = new Date(end.getTime() - end.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    setForm((f) => ({ ...f, endDate: iso }));
  }, [form.startDate, durationDays, endDateTouched]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const entries = Object.entries(form).filter(([k, v]) => {
      const val = String(v ?? "").trim();
      if (!val) return false;
      if (!initial) return true;
      return (
        val !== String((initial as Record<string, string>)[k] ?? "").trim()
      );
    });
    const payload = Object.fromEntries(entries);
    const updated = await updateVacancies(
      id,
      payload as Record<string, string>,
    );
    if (updated) router.push(`/admin-dashboard/vacancies`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <CustomTableBackHeader header="vacancies" link="true" />
          <h1 className="text-2xl font-semibold">Edit Vacancy</h1>
          <p className="text-gray-600">Update vacancy details.</p>
        </div>
      </div>

      <div className="rounded border p-4">
        {vacanciesLoading ? (
          <div className="text-sm text-gray-600">Loading...</div>
        ) : !vacancies ? (
          <div className="text-sm text-rose-600">Vacancy not found.</div>
        ) : (
          <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Designation</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={form.designation}
                onChange={(e) => updateField("designation", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">No. of Positions</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={form.noOfPositions}
                onChange={(e) => updateField("noOfPositions", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">City</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Country</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Start Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={form.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* <div>
                <label className="text-sm text-gray-600">
                  Vacancy Duration (days)
                </label>
                <input
                  type="number"
                  min={1}
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g. 30"
                />
              </div> */}
              <div>
                <label className="text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={form.endDate}
                  onChange={(e) => {
                    setEndDateTouched(true);
                    updateField("endDate", e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Corporate Title</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.corporateTitleId}
                onChange={(e) =>
                  updateField("corporateTitleId", e.target.value)
                }
              >
                <option value="" hidden>Select Corporate Title</option>
                {corporateTitle?.map((ct: { id: number; name: string }) => (
                  <option key={ct.id} value={String(ct.id)}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Employment Type</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.employmentTypeId}
                onChange={(e) =>
                  updateField("employmentTypeId", e.target.value)
                }
              >
                {employmentTitle?.map((et: { id: number; name: string }) => (
                  <option key={et.id} value={String(et.id)}>
                    {et.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Workplace Type</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.workPlaceTypeId}
                onChange={(e) => updateField("workPlaceTypeId", e.target.value)}
              >
                <option value="" hidden>Select Workplace Type</option>
                {workPlaceType?.map((wpt: { id: number; name: string }) => (
                  <option key={wpt.id} value={String(wpt.id)}>
                    {wpt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Status</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.statusId}
                onChange={(e) => updateField("statusId", e.target.value)}
              >
                <option value="" hidden>Select Status</option>
                {status?.map((s: { id: number; name: string }) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {(() => {
              const currentName =
                (status ?? [])
                  .find(
                    (s: { id: number; name: string }) =>
                      String(s.id) === String(form.statusId),
                  )
                  ?.name?.toLowerCase() || "";
              const rejected = currentName.includes("reject");
              if (!rejected) return null;
              return (
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">
                    Rejection Reason
                  </label>
                  <textarea
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                    value={form.rejectionReason}
                    onChange={(e) =>
                      updateField("rejectionReason", e.target.value)
                    }
                    placeholder="Provide a clear reason for rejection"
                    required
                  />
                </div>
              );
            })()}

            <div>
              <label className="text-sm text-gray-600">SBU</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.sbuId}
                onChange={(e) => updateField("sbuId", e.target.value)}
              >
               
                {filteredSbu?.map((s: { id: number; name: string }) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Hospital</label>
              <input
                className="w-full border rounded px-3 py-2 bg-gray-50"
                value={
                  hospital?.find(
                    (h: { id: number; name: string }) =>
                      String(h.id) === String(form.hospitalId)
                  )?.name || "Hospital not found"
                }
                readOnly
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                className="w-full border rounded px-3 py-2 bg-gray-50"
                value={form.email}
                readOnly
              />
            </div>

            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Banner</label>
                {String(form.banner || "").trim() ? (
                  <div className="mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.banner}
                      alt="Banner preview"
                      className="h-40 w-full object-cover rounded border"
                      onError={(ev) => {
                        (ev.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-gray-500">
                    No banner image available for this vacancy.
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Summary</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={4}
                value={form.summary}
                onChange={(e) => updateField("summary", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Submission Method</label>
              <div className="flex items-center gap-4 mt-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    className="accent-green-600"
                    checked={applicationMethod === "online"}
                    onChange={() => setApplicationMethod("online")}
                  />
                  <span>Online</span>
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    className="accent-green-600"
                    checked={applicationMethod === "via_email"}
                    onChange={() => setApplicationMethod("via_email")}
                  />
                  <span>Via Email</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2 grid md:grid-cols-3 gap-4 items-end">
              {applicationMethod === "via_email" && (
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">
                    Submission Email
                  </label>
                  <input
                    type="email"
                    className="w-full border rounded px-3 py-2"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="recruiter@example.com"
                    required
                  />
                </div>
              )}

              {applicationMethod === "online" && (
                <div>
                  <label className="text-sm text-gray-600">Portal URL</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.portalUrl}
                    onChange={(e) => updateField("portalUrl", e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <button
                disabled={saving}
                type="submit"
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href={`/admin-dashboard/vacancies/${id}`}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
