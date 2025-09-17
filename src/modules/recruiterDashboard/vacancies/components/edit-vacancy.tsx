"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useGetVacanciesById } from "@/modules/backend/vacancy/hooks/use-gey-by-id-vacancy";
import { useUpdateVacancies } from "@/modules/backend/vacancy/hooks/use-update-vacancy";
import { useGetAllCorporateTitle } from "@/modules/backend/corporate-title/hooks/use-get-all-corporate-title";
import { useGetAllEmploymentTitle } from "@/modules/backend/employment-type/hooks/use-get-all-employment";
import { useGetAllWorkPlaceType } from "@/modules/backend/work-place-type/hooks/use-get-all-work-place-type";
import { useGetAllSbu } from "@/modules/backend/sbu/hooks/use-get-all-sbu";
import { useGetAllHospital } from "@/modules/backend/hospital/hooks/use-get-all-hospital";
import { useGetAllRecruiter } from "@/modules/backend/recruiter/hooks/use-get-all-recruiter";
import { CityAutocomplete } from "@/modules/shared/components/city-autocomplete";
import { cities, getCitiesByCountry } from "@/data/cities";

export default function RecruiterVacancyEdit() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const role = session?.user?.role?.metaCode?.toUpperCase?.();
  const isRecruiter = role === "RECRUITER" || role === "LEAD_RECRUITER";
  const isLead = role === "LEAD_RECRUITER";

  const params = useParams<{ id: string }>();
  const id = String(params?.id || "");
  const router = useRouter();

  const { vacancies, vacanciesLoading } = useGetVacanciesById(id);
  const { updateVacancies, vacanciesLoading: saving } = useUpdateVacancies();
  const { corporateTitle } = useGetAllCorporateTitle();
  const { employmentTitle } = useGetAllEmploymentTitle();
  const { workPlaceType } = useGetAllWorkPlaceType();
  const { sbu } = useGetAllSbu();
  const { hospital } = useGetAllHospital();
  const { recruiter } = useGetAllRecruiter();

  const canEdit = useMemo(() => {
    if (!session || !isRecruiter) return false;
    if (!vacancies) return true;
    const assignedUserId = (vacancies as { recruiter?: { userId?: number } })
      ?.recruiter?.userId;
    if (String(assignedUserId ?? "") === String(userId ?? "")) return true;
    if (isLead) {
      const me = (
        recruiter as Array<{ userId: number; hospitalId: number }> | undefined
      )?.find((r) => String(r.userId) === String(userId));
      if (
        me &&
        String(me.hospitalId) ===
          String((vacancies as { hospitalId?: number }).hospitalId ?? "")
      ) {
        return true;
      }
    }
    return false;
  }, [session, isRecruiter, isLead, recruiter, vacancies, userId]);

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
    sbuId: "",
    hospitalId: "",
    vacancyOption: "",
  });
  const [initial, setInitial] = useState<typeof form | null>(null);

  // Get cities based on selected country
  const availableCities = useMemo(() => {
    if (!form.country) return cities;
    return getCitiesByCountry(form.country);
  }, [form.country]);

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
      sbuId: String(vacancies.sbuId ?? ""),
      hospitalId: String(vacancies.hospitalId ?? ""),
      vacancyOption: String(vacancies.vacancyOption ?? ""),
    };
    setForm(next);
    setInitial(next);
  }, [vacancies]);

  const updateField = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const allowed: Array<keyof typeof form> = [
      "designation",
      "summary",
      "banner",
      "city",
      "country",
      "email",
      "portalUrl",
      "contactPerson",
      "noOfPositions",
      "startDate",
      "endDate",
      "corporateTitleId",
      "employmentTypeId",
      "workPlaceTypeId",
      "sbuId",
      "vacancyOption",
    ];
    const entries = Object.entries(form).filter(([k, v]) => {
      if (!allowed.includes(k as keyof typeof form)) return false;
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
    if (updated) router.push(`/recruiter-dashboard/vacancies/${id}`);
  };

  if (!session) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Edit Vacancy</h1>
        <p className="text-gray-600">Please sign in to edit this vacancy.</p>
      </div>
    );
  }

  if (!isRecruiter) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Edit Vacancy</h1>
        <p className="text-rose-600">
          You do not have permission to edit this vacancy.
        </p>
      </div>
    );
  }

  if (!vacanciesLoading && vacancies && !canEdit) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Edit Vacancy</h1>
        <p className="text-rose-600">You are not assigned to this vacancy.</p>
      </div>
    );
  }

  // Prevent editing if vacancy is expired or has invalid date range
  type VacancyFlags = { isExpired?: boolean; isDateInvalid?: boolean };
  const flags = vacancies ? (vacancies as unknown as VacancyFlags) : null;
  if (
    !vacanciesLoading &&
    vacancies &&
    (flags?.isExpired || flags?.isDateInvalid)
  ) {
    const isDateInvalid = Boolean(flags?.isDateInvalid);
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Edit Vacancy</h1>
        {isDateInvalid ? (
          <p className="text-rose-600">
            This vacancy has invalid start/end dates and cannot be edited.
          </p>
        ) : (
          <p className="text-rose-600">
            This vacancy has expired and can no longer be edited or shown
            publicly.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Edit Vacancy</h1>
          <p className="text-gray-600">
            Recruiters can edit vacancy details, except status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/recruiter-dashboard/vacancies/${id}`}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Back
          </Link>
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
              <CityAutocomplete
                value={form.city}
                onChange={(value) => updateField("city", value)}
                cities={availableCities}
                placeholder="Enter city name (min 2 characters)..."
                required
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

            <div>
              <label className="text-sm text-gray-600">End Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={form.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
              />
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
                <option value="">Select Corporate Title</option>
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
                <option value="">Select Employment Type</option>
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
                <option value="">Select Workplace Type</option>
                {workPlaceType?.map((wpt: { id: number; name: string }) => (
                  <option key={wpt.id} value={String(wpt.id)}>
                    {wpt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">SBU</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.sbuId}
                onChange={(e) => updateField("sbuId", e.target.value)}
              >
                <option value="">Select SBU</option>
                {sbu?.map((s: { id: number; name: string }) => (
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
                  (hospital ?? []).find(
                    (h: { id: number; name: string }) =>
                      String(h.id) === String(form.hospitalId),
                  )?.name ||
                  String(
                    (vacancies as { hospital?: { name?: string } })?.hospital
                      ?.name ?? "",
                  )
                }
                readOnly
              />
            </div>

            {Boolean((initial?.portalUrl || "").trim()) ? (
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Portal URL</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={form.portalUrl}
                  onChange={(e) => updateField("portalUrl", e.target.value)}
                />
              </div>
            ) : (
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Email</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
            )}

            <div className="md:col-span-2">
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
              ) : null}
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

            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <button
                disabled={saving}
                type="submit"
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href={`/recruiter-dashboard/vacancies/${id}`}
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
}
