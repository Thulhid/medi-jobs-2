"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useGetAllRecruiter } from "@/modules/backend/recruiter/hooks/use-get-all-recruiter";
import { LogoutButton } from "@/modules/shared/components/logout-button";
import { useGetAllVacancies } from "@/modules/backend/vacancy/hooks/use-get-all-vacancy";
import { useGetAllCorporateTitle } from "@/modules/backend/corporate-title/hooks/use-get-all-corporate-title";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/modules/ui/components/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  DateFilters,
  DateFilterKind,
} from "@/modules/shared/components/date-filters";

// Helpers to format aggregation keys
function formatDayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default function RecruiterDashboard() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const role = session?.user?.role?.metaCode?.toUpperCase?.();
  const isRecruiter = role === "RECRUITER" || role === "LEAD_RECRUITER";

  const { vacancies } = useGetAllVacancies();
  const { corporateTitle } = useGetAllCorporateTitle();
  const { recruiterLoading } = useGetAllRecruiter();

  const [selectedTitleId, setSelectedTitleId] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<
    | {
        kind: DateFilterKind;
        range?: { start?: Date; end?: Date };
        single?: Date;
      }
    | undefined
  >({ kind: "week", single: new Date() });

  // Fixed aggregation fallback period is a constant (no state needed)
  const PERIOD = "week" as const;
  const selectedAgg = useMemo(
    () => getAggregationFromKind(dateFilter?.kind, PERIOD),
    [dateFilter],
  );

  function clearFilters() {
    setSelectedTitleId("");
    setDateFilter(undefined);
  }

  const myVacancies = useMemo(() => {
    return (vacancies ?? []).filter(
      (v: { recruiter: { userId: number } }) =>
        String(v?.recruiter?.userId) === String(userId),
    );
  }, [vacancies, userId]);

  const filteredVacancies = useMemo(() => {
    return myVacancies
      .filter((v: { corporateTitleId: number }) =>
        selectedTitleId
          ? String(v?.corporateTitleId) === selectedTitleId
          : true,
      )
      .filter(
        (v: { status: { name: string } }) => v?.status?.name !== "Pending",
      );
  }, [myVacancies, selectedTitleId, recruiterLoading]);

  const myVacancyCount = myVacancies?.length ?? 0;

  const approvedCount = useMemo(
    () =>
      myVacancies?.filter(
        (v: { status: { name: string } }) => v?.status?.name === "Approved",
      ).length ?? 0,
    [myVacancies],
  );

  const totalClicks = useMemo(
    () =>
      myVacancies?.reduce(
        (acc: number, v: { clicks: { length: number } }) =>
          acc + (v?.clicks?.length ?? 0),
        0,
      ) ?? 0,
    [myVacancies],
  );

  const chartData = useMemo(() => {
    
    const buckets = new Map<string, number>();
    const add = (date: Date) => {
      
      const key = selectedAgg === "year" ? formatMonthKey(date) : formatDayKey(date);
      buckets.set(key, (buckets.get(key) || 0) + 1);
    };

    const inRange = (d: Date) => {
      const ms = d.getTime();
      switch (dateFilter?.kind) {
        case "day-range":
        case "week-range":
        case "month-range":
        case "year-range": {
          const startMs = dateFilter?.range?.start
            ? new Date(dateFilter.range.start).getTime()
            : undefined;
          const endMs = dateFilter?.range?.end
            ? new Date(dateFilter.range.end).getTime()
            : undefined;
          const startOk = startMs === undefined || ms >= startMs;
          const endOk = endMs === undefined || ms <= endMs;
          return startOk && endOk;
        }
        case "day": {
          const s = dateFilter?.single ? new Date(dateFilter.single) : null;
          return !s || d.toDateString() === s.toDateString();
        }
        case "week": {
          const s = dateFilter?.single ? new Date(dateFilter.single) : null;
          return (
            !s ||
            (getWeek(d) === getWeek(s) && d.getFullYear() === s.getFullYear())
          );
        }
        case "month": {
          const s = dateFilter?.single ? new Date(dateFilter.single) : null;
          return (
            !s ||
            (d.getFullYear() === s.getFullYear() &&
              d.getMonth() === s.getMonth())
          );
        }
        case "year": {
          const s = dateFilter?.single ? new Date(dateFilter.single) : null;
          return !s || d.getFullYear() === s.getFullYear();
        }
        default:
          return true;
      }
    };

    filteredVacancies.forEach(
      (v: { clicks?: Array<{ createdAt: string }> }) => {
        (v.clicks ?? []).forEach((c) => {
          const d = new Date(c.createdAt);
          if (!Number.isNaN(d.getTime()) && inRange(d)) add(d);
        });
      },
    );

    
    const agg = selectedAgg;
    if (
      agg === "day" &&
      dateFilter?.kind === "day-range" &&
      dateFilter.range?.start &&
      dateFilter.range?.end
    ) {
      const start = new Date(dateFilter.range.start);
      const end = new Date(dateFilter.range.end);
      const series: Array<{ name: string; value: number }> = [];
      const cursor = new Date(start);
      while (cursor <= end) {
        const key = formatDayKey(cursor);
        series.push({ name: key, value: buckets.get(key) || 0 });
        cursor.setDate(cursor.getDate() + 1);
      }
      return series;
    }

    if (agg === "week" && dateFilter?.kind === "week" && dateFilter.single) {
      const start = getStartOfWeek(new Date(dateFilter.single));
      const series: Array<{ name: string; value: number }> = [];
      const cursor = new Date(start);
      for (let i = 0; i < 7; i += 1) {
        const key = formatDayKey(cursor);
        series.push({ name: key, value: buckets.get(key) || 0 });
        cursor.setDate(cursor.getDate() + 1);
      }
      return series;
    }

    if (agg === "month" && dateFilter?.kind === "month" && dateFilter.single) {
      const first = new Date(dateFilter.single);
      const year = first.getFullYear();
      const month = first.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const series: Array<{ name: string; value: number }> = [];
      for (let day = 1; day <= daysInMonth; day += 1) {
        const key = formatDayKey(new Date(year, month, day));
        series.push({ name: key, value: buckets.get(key) || 0 });
      }
      return series;
    }

    if (agg === "year" && dateFilter?.kind === "year" && dateFilter.single) {
      const year = new Date(dateFilter.single).getFullYear();
      const series: Array<{ name: string; value: number }> = [];
      for (let m = 1; m <= 12; m += 1) {
        const key = formatMonthKey(new Date(year, m - 1, 1));
        series.push({ name: key, value: buckets.get(key) || 0 });
      }
      return series;
    }

    return Array.from(buckets.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([name, value]) => ({ name, value }));
  }, [filteredVacancies, dateFilter, selectedAgg]);

  function getOverviewTitle(): string {
    const agg = selectedAgg;
    switch (agg) {
      case "day":
        return "Daily Overview";
      case "week":
        return "Weekly Overview";
      case "month":
        return "Monthly Overview";
      case "year":
      default:
        return "Yearly Overview";
    }
  }

  function getAggregationFromKind(
    kind: DateFilterKind | undefined,
    fallback: "day" | "week" | "month" | "year",
  ) {
    switch (kind) {
      case "week":
      case "week-range":
        return "week" as const;
      case "month":
      case "month-range":
        return "month" as const;
      case "year":
      case "year-range":
        return "year" as const;
      case "day":
      case "day-range":
        return "day" as const;
      default:
        return fallback;
    }
  }

  if (!session) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Recruiter Dashboard</h1>
        <p className="text-gray-600">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  if (!isRecruiter) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Recruiter Dashboard</h1>
        <p className="text-rose-600">
          You do not have permission to view this dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome back
              {session?.user?.email ? `, ${session.user.email}` : ""}
            </h1>
            <p className="text-gray-600">
              Track your vacancies and candidate interest.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LogoutButton />
          </div>
        </div>
        <div className="flex gap-3 flex-wrap items-center justify-between">
          <select
            className="border rounded px-3 py-2"
            value={selectedTitleId}
            onChange={(e) => setSelectedTitleId(e.target.value)}
          >
            <option value="">Select Designation</option>
            {corporateTitle?.map((t: { id: number; name: string }) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            onClick={clearFilters}
            className="ml-auto px-3 py-2 rounded border bg-green-700 hover:bg-green-600 text-white"
          >
            Clear filters
          </button>
        </div>
      </div>
      <div>
        <div className=" rounded py-2">
          <DateFilters onChange={setDateFilter} value={dateFilter} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border-2 border-gray-200 shadow-sm p-4">
          <div className="text-black text-2xl font-semibold text-center tracking-wide">
            My Vacancies
          </div>
          <div className="text-2xl font-semibold text-center text-blue-600">
            {myVacancyCount}
          </div>
        </div>
        <div className="rounded-lg border-2 border-gray-200 shadow-sm p-4">
          <div className="text-black text-2xl font-semibold text-center tracking-wide">
            Active (Approved)
          </div>
          <div className="text-2xl font-semibold text-center text-green-600">
            {approvedCount}
          </div>
        </div>
        <div className="rounded-lg border-2 border-gray-200 shadow-sm p-4">
          <div className="text-2xl text-black  font-semibold text-center tracking-wide">
            Clicks
          </div>
          <div className="text-2xl  font-semibold text-center text-amber-600">
            {totalClicks}
          </div>
        </div>
      </div>

      <div className="rounded border p-4">
        <div className="text-sm font-medium mb-2">{getOverviewTitle()}</div>
        <ChartContainer
          style={{ aspectRatio: "auto", height: 260 }}
          config={{ jobs: { label: "Jobs", color: "hsl(160, 84%, 39%)" } }}
        >
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="value"
              stroke="var(--color-jobs)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}

function getWeek(date: Date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday as first day
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
