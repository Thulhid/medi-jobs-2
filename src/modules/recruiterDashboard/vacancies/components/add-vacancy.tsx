"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCreateVacancies } from "@/modules/backend/vacancy/hooks/use-create-vacancy";
import { useGetAllHospital } from "@/modules/backend/hospital/hooks/use-get-all-hospital";
import { useGetAllCorporateTitle } from "@/modules/backend/corporate-title/hooks/use-get-all-corporate-title";
import { useGetAllStatus } from "@/modules/backend/status/hooks/use-get-all-status";
import { useGetAllEmploymentTitle } from "@/modules/backend/employment-type/hooks/use-get-all-employment";
import { useGetAllRecruiter } from "@/modules/backend/recruiter/hooks/use-get-all-recruiter";
import { useGetAllWorkPlaceType } from "@/modules/backend/work-place-type/hooks/use-get-all-work-place-type";
import { useGetAllSbu } from "@/modules/backend/sbu/hooks/use-get-all-sbu";
import { useGetAllVacancies } from "@/modules/backend/vacancy-options/hooks/use-get-all-vacancy-option";
import { LogoutButton } from "@/modules/shared/components/logout-button";
import { Form } from "@/modules/ui/components/form";
import { SecureLogobox } from "@/modules/shared/components/secure-logobox";
import { CityAutocomplete } from "@/modules/shared/components/city-autocomplete";
import { useForm } from "react-hook-form";
import { cities, getCitiesByCountry } from "@/data/cities";

export default function VacancyAdd() {
  const { data: session } = useSession();
  const router = useRouter();
  const { createVacancies, vacanciesLoading } = useCreateVacancies();
  const { hospital } = useGetAllHospital();
  const { corporateTitle } = useGetAllCorporateTitle();
  const { status } = useGetAllStatus();
  const { employmentTitle } = useGetAllEmploymentTitle();
  const { recruiter } = useGetAllRecruiter();
  const { workPlaceType } = useGetAllWorkPlaceType();
  const { sbu } = useGetAllSbu();
  const { vacanciesOptions} = useGetAllVacancies();

  const [form, setForm] = useState({
    designation: "",
    hospitalId: "",
    corporateTitleId: "",
    employmentTypeId: "",
    workPlaceTypeId: "",
    vacancyOptionId: "",
    sbuId: "",
    recruiterId: "",
    city: "",
    country: "",
    email: "",
    startDate: "",
    endDate: "",
    noOfPositions: "1",
    summary: "",
    portalUrl: "",
    banner: "",
    readStatus: "New",
  });

  const [applicationMethod, setApplicationMethod] = useState<
    "online" | "via_email"
  >("online");

  const [durationDays] = useState<string>("14");
  const [endDateTouched, setEndDateTouched] = useState<boolean>(false);

  const countries = [
    "Sri Lanka",
    "India",
    "United Arab Emirates",
    "Qatar",
    "Saudi Arabia",
    "Singapore",
    "United Kingdom",
    "United States",
    "Australia",
    "Canada",
  ];

  const pendingStatusId = useMemo(() => {
    const p = (status ?? []).find(
      (s: { name: string }) => String(s.name).toLowerCase() === "pending",
    );
    return p?.id ? String(p.id) : "";
  }, [status]);

  const currentRecruiter = useMemo(() => {
    const uid = session?.user?.id;
    if (!uid) return null;
    return (
      (recruiter ?? []).find(
        (r: { userId: number }) => String(r.userId) === String(uid),
      ) || null
    );
  }, [recruiter, session]);


  const filteredSbu = useMemo(() => {
    if (!form.hospitalId || !sbu) return [];
    return sbu.filter(
      (s: { hospitalId: number }) =>
        String(s.hospitalId) === String(form.hospitalId)
    );
  }, [sbu, form.hospitalId]);


  const availableCities = useMemo(() => {
    if (!form.country) return cities;
    return getCitiesByCountry(form.country);
  }, [form.country]);

  useEffect(() => {
    if (!currentRecruiter) return;
    setForm((f) => ({
      ...f,
      recruiterId: String(currentRecruiter.id ?? ""),
      hospitalId: String(currentRecruiter.hospitalId ?? ""),
      sbuId: "",
    }));
  }, [currentRecruiter]);

  useEffect(() => {
    const sessionEmail = session?.user?.email || "";
    if (applicationMethod === "online") {
      setForm((f) => ({ ...f, email: sessionEmail }));
    } else {
      if (!form.email) setForm((f) => ({ ...f, email: sessionEmail }));
    }
  }, [applicationMethod, session?.user?.email]);

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

  const bannerForm = useForm<{ banner: string }>({
    defaultValues: { banner: "" },
  });
  const bannerWatch = bannerForm.watch("banner");
  useEffect(() => {
    if (bannerWatch && bannerWatch !== form.banner) {
      setForm((f) => ({ ...f, banner: bannerWatch }));
    }
  }, [bannerWatch, form.banner]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      statusId: pendingStatusId,
      contactPerson: "",
      vacancyOption: vacanciesOptions?.find((vo: { id: number; name: string }) => 
        String(vo.id) === String(form.vacancyOptionId)
      )?.name || "",
    };
    const created = await createVacancies(payload);
    if (created?.id) {
      router.push(`/recruiter-dashboard/vacancies/${created.id}`);
    }
  };

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">New Vacancy</h1>
          <p className="text-gray-600">
            Post a new vacancy. As a recruiter, your profile will be assigned
            automatically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/recruiter-dashboard/vacancies"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Back
          </Link>
          <LogoutButton />
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded border border-dashed p-4 grid md:grid-cols-2 gap-4"
      >
        <div>
          <label className="text-sm text-gray-600">Hospital</label>
          <input
            value={
              hospital?.find(
                (h: { id: number; name: string }) =>
                  String(h.id) === String(form.hospitalId),
              )?.name ?? ""
            }
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-50"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">
            Strategic Business Unit
          </label>
          <select
            name="sbuId"
            value={form.sbuId}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" hidden>Select SBU</option>
            {filteredSbu?.map((s: { id: number; name: string }) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Corporate Title</label>
          <select
            name="corporateTitleId"
            value={form.corporateTitleId}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" hidden>Select Title</option>
            {corporateTitle?.map((t: { id: number; name: string }) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Designation</label>
          <input
            name="designation"
            value={form.designation}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Work Place Type</label>
          <select
            name="workPlaceTypeId"
            value={form.workPlaceTypeId}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" hidden>Select Work Place Type</option>
            {workPlaceType?.map((w: { id: number; name: string }) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Employment Type</label>
          <select
            name="employmentTypeId"
            value={form.employmentTypeId}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" hidden>Select Employment Type</option>
            {employmentTitle?.map((et: { id: number; name: string }) => (
              <option key={et.id} value={et.id}>
                {et.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Vacancy Option</label>
          <select
            name="vacancyOptionId"
            value={form.vacancyOptionId}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="" hidden>Select Vacancy Option</option>
            {vacanciesOptions?.map((vo: { id: number; name: string }) => (
              <option key={vo.id} value={vo.id}>
                {vo.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">No Of Positions</label>
          <input
            type="number"
            name="noOfPositions"
            value={form.noOfPositions}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            min={1}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            readOnly={applicationMethod === "online"}
            required={applicationMethod === "via_email"}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Job Summary</label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>

        <div className="md:col-span-2  p-4 rounded-lg border-2 border-dashed border-green-300">
          <Form {...bannerForm}>
            <SecureLogobox
              fieldName="banner"
              fieldLabel="Upload Job Advertisement"
              control={bannerForm.control}
              required={true}
              setValue={bannerForm.setValue}
            />
          </Form>
          {/*           
          {String(form.banner || "").trim() ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-green-700">Job Advertisement Uploaded Successfully!</span>
              </div>
              
              <div className="relative h-48 rounded-lg border-2 border-green-200 bg-gray-50">
                <div className="h-full w-full overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100">
           
                  <img
                    src={form.banner}
                    alt="Job Advertisement Preview"
                    className="w-full h-auto min-h-full object-contain hover:cursor-move"
                    style={{ minHeight: '100%' }}
                    onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              </div>
            
            </div>
          ) : null} */}
        </div>


        <div>
          <label className="text-sm text-gray-600">Country</label>
          <select
            name="country"
            value={form.country}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="" hidden>Select country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">City</label>
          <CityAutocomplete
            value={form.city}
            onChange={(value) => setForm((f) => ({ ...f, city: value }))}
            cities={availableCities}
            placeholder="Enter city name "
            name="city"
            required
          />
        </div>


        <div>
          <label className="text-sm text-gray-600">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
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
              placeholder="14"
            />
          </div> */}
          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={(e) => {
                setEndDateTouched(true);
                onChange(e);
              }}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>


        <div>
          <label className="text-sm text-gray-600">Submission Method</label>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                className="accent-purple-600"
                checked={applicationMethod === "online"}
                onChange={() => setApplicationMethod("online")}
              />
              <span>Online</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="radio"
                className="accent-purple-600"
                checked={applicationMethod === "via_email"}
                onChange={() => setApplicationMethod("via_email")}
              />
              <span>Via Email</span>
            </label>
          </div>
        </div>
        {applicationMethod === "online" && (
          <div>
            <label className="text-sm text-gray-600">
              Application Portal URL
            </label>
            <input
              name="portalUrl"
              value={form.portalUrl}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="https://www.example.com"
              required
            />
          </div>
        )}

        {applicationMethod === "via_email" && (
          <div>
            <label className="text-sm text-gray-600">Submission Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="recruiter@example.com"
              required
            />
          </div>
        )}


        <div className="md:col-span-2 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={
              vacanciesLoading ||
              !form.hospitalId ||
              !form.banner ||
              !form.corporateTitleId ||
              !form.employmentTypeId ||
              !form.workPlaceTypeId ||
              !form.vacancyOptionId ||
              !form.sbuId ||
              !form.designation ||
              !form.city ||
              !form.country ||
              (applicationMethod === "via_email" && !form.email) ||
              (applicationMethod === "online" && !form.portalUrl) ||
              !form.startDate ||
              !form.endDate ||
              !form.summary
            }
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {vacanciesLoading ? "Creating..." : "Add Vacancy"}
          </button>
          <Link
            href="/recruiter-dashboard/vacancies"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
