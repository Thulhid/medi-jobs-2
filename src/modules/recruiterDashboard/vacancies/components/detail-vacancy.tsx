"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { useGetVacanciesById } from "@/modules/backend/vacancy/hooks/use-gey-by-id-vacancy";
import { LogoutButton } from "@/modules/shared/components/logout-button";

export default function RecruiterVacancyDetail() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const role = session?.user?.role?.metaCode?.toUpperCase?.();
  const isRecruiter = role === "RECRUITER" || role === "LEAD_RECRUITER";
  const isLead = !!role?.includes("LEAD");

  const { id: routeId } = useParams<{ id: string }>();
  const id = String(routeId ?? "");
  const { vacancies: vacancy, vacanciesLoading } = useGetVacanciesById(id);

  const canView = useMemo(() => {
    if (!session) return false;
    if (!isRecruiter) return false;
    if (isLead) return true; // Lead recruiter can view any vacancy details
    if (!vacancy) return true;
    const assignedUserId = (vacancy as { recruiter?: { userId?: number } })
      ?.recruiter?.userId;
    return String(assignedUserId ?? "") === String(userId ?? "");
  }, [session, isRecruiter, isLead, vacancy, userId]);

  if (!session) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Vacancy Details</h1>
        <p className="text-gray-600">Please sign in to view this vacancy.</p>
      </div>
    );
  }

  if (!isRecruiter) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Vacancy Details</h1>
        <p className="text-rose-600">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  if (!vacanciesLoading && vacancy && !canView) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Vacancy Details</h1>
        <p className="text-rose-600">You are not assigned to this vacancy.</p>
      </div>
    );
  }

  // Hide Pending vacancies from recruiter view until approved
  if (!vacanciesLoading && vacancy && String(vacancy.statusId) === "Pending") {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Vacancy Details</h1>
        <p className="text-gray-600">
          This vacancy is under review and not yet available.
        </p>
        <div>
          <Link
            href="/recruiter-dashboard/vacancies"
            className="text-blue-600 hover:underline"
          >
            Go back to My Vacancies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Vacancy Details</h1>
          <p className="text-gray-600">
            Review full information of the vacancy.
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

      {vacanciesLoading || !vacancy ? (
        <div className="p-4 text-sm text-gray-600">Loading...</div>
      ) : (
        <div className="rounded border divide-y">
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <Field label="Designation" value={vacancy.designation} />
            <Field label="Hospital" value={vacancy.hospital?.name ?? "-"} />
            <Field
              label="Corporate Title"
              value={vacancy.corporateTitle?.name ?? "-"}
            />
            <Field
              label="Employment Type"
              value={vacancy.employmentType?.name ?? "-"}
            />
            <Field
              label="Workplace Type"
              value={vacancy.workPlaceType?.name ?? "-"}
            />
            <Field label="SBU" value={vacancy.sbu?.name ?? "-"} />
            <Field label="Status" value={vacancy.status?.name ?? "-"} />
            <Field
              label="Recruiter"
              value={(() => {
                const r = vacancy.recruiter;
                if (!r) return "-";
                const full = [r.firstname, r.lastname]
                  .filter(Boolean)
                  .join(" ")
                  .trim();
                return full || r.email || "-";
              })()}
            />
            <Field
              label="Location"
              value={[vacancy.city, vacancy.country].filter(Boolean).join(", ")}
            />
            <Field
              label="Positions"
              value={String(vacancy.noOfPositions ?? "-")}
            />
            <Field
              label="Start Date"
              value={
                vacancy.startDate
                  ? new Date(vacancy.startDate).toLocaleDateString()
                  : "-"
              }
            />
            <Field
              label="End Date"
              value={
                vacancy.endDate
                  ? new Date(vacancy.endDate).toLocaleDateString()
                  : "-"
              }
            />
            <Field label="Email" value={vacancy.email} />
            <Field label="Portal URL" value={vacancy.portalUrl} link />
          </div>
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-1">Summary</div>
            <div className="whitespace-pre-wrap text-sm">
              {vacancy.summary || "-"}
            </div>
          </div>
          {/* <div className="p-4">
            <div className="text-sm text-gray-500 mb-1">Clicks</div>
            <div className="text-sm">{Array.isArray((vacancy as { clicks?: Array<unknown> }).clicks) ? (vacancy.clicks as Array<unknown>).length : 0}</div>
          </div> */}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  link = false,
}: {
  label: string;
  value?: string | null;
  link?: boolean;
}) {
  const content = value ?? "-";
  return (
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      {link && content && content !== "-" ? (
        <a
          href={content}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {content}
        </a>
      ) : (
        <div className="text-sm break-words">{content}</div>
      )}
    </div>
  );
}
