"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useGetAllVacancies } from "@/modules/backend/vacancy/hooks/use-get-all-vacancy";
import { useGetAllHospital } from "@/modules/backend/hospital/hooks/use-get-all-hospital";
import { useGetAllCorporateTitle } from "@/modules/backend/corporate-title/hooks/use-get-all-corporate-title";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/modules/ui/components/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { LogoutButton } from "@/modules/shared/components/logout-button";
import {
  DateFilters,
  DateFilterKind,
} from "@/modules/shared/components/date-filters";

export const AdminDashboard = () => {
  const { vacancies } = useGetAllVacancies();
  const { hospital } = useGetAllHospital();
  const { corporateTitle } = useGetAllCorporateTitle();

  const [selectedHospitalId, setSelectedHospitalId] = useState<string>("");
  const [selectedTitleId, setSelectedTitleId] = useState<string>("");
  const [period] = useState<"day" | "week" | "month" | "year">("day");
  const [showHospitals, setShowHospitals] = useState(false);
  const [showTitles, setShowTitles] = useState(false);
  const hospitalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [dateFilter, setDateFilter] = useState<
    | {
      kind: DateFilterKind;
      range?: { start?: Date; end?: Date };
      single?: Date;
    }
    | undefined
  >({ kind: "day", single: new Date() });

  function clearFilters() {
    setSelectedHospitalId("");
    setSelectedTitleId("");
    setDateFilter(undefined);
    setShowHospitals(false);
    setShowTitles(false);
  }

  const handleHospitalChange = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
    setShowHospitals(false);
  };

  const handleTitleChange = (titleId: string) => {
    setSelectedTitleId(titleId);
    setShowTitles(false);
  };

  // Handle click outside to close dropdownsddfdf
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hospitalRef.current && !hospitalRef.current.contains(event.target as Node)) {
        setShowHospitals(false);
      }
      if (titleRef.current && !titleRef.current.contains(event.target as Node)) {
        setShowTitles(false);
      }
    };

    // handle right

    if (showHospitals || showTitles) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHospitals, showTitles]);

  const filteredVacancies = useMemo(() => {
    return (
      vacancies
        ?.filter((v: { hospitalId: string }) =>
          selectedHospitalId
            ? String(v?.hospitalId) === selectedHospitalId
            : true,
        )
        ?.filter((v: { corporateTitleId: string }) =>
          selectedTitleId
            ? String(v?.corporateTitleId) === selectedTitleId
            : true,
        ) ?? []
    );
  }, [vacancies, selectedHospitalId, selectedTitleId]);

  const totalJobs = filteredVacancies.length;
  const activeJobs = filteredVacancies.filter(
    (v: { status: { name: string } }) => v?.status?.name === "Approved",
  ).length;
  const interestedCandidates = useMemo(() => {
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
    let total = 0;
    (
      filteredVacancies as Array<{
        clicks?: Array<{ createdAt?: string | Date }>;
      }>
    ).forEach((v) => {
      (v.clicks ?? []).forEach((c) => {
        const dt = c?.createdAt ? new Date(c.createdAt) : null;
        if (dt && !isNaN(dt.getTime()) && inRange(dt)) total += 1;
      });
    });
    return total;
  }, [filteredVacancies, dateFilter]);

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

  const chartData = useMemo(() => {
    const clickBuckets = new Map<string, number>();

    const bucketKey = (d: Date) => {
      const agg = getAggregationFromKind(dateFilter?.kind, period);
      if (agg === "year") {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // monthly buckets for year view
      }
      // For day/week/month selections, bucket by individual day
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
      (v: { clicks?: Array<{ createdAt?: string | Date }> }) => {
        const clicks = Array.isArray(v?.clicks) ? v.clicks : [];
        clicks.forEach((c) => {
          const dt = c?.createdAt ? new Date(c.createdAt) : null;
          if (!dt || isNaN(dt.getTime())) return;
          if (!inRange(dt)) return;
          const key = bucketKey(dt);
          clickBuckets.set(key, (clickBuckets.get(key) || 0) + 1);
        });
      },
    );


    const agg = getAggregationFromKind(dateFilter?.kind, period);
    if (
      agg === "day" &&
      dateFilter?.kind === "day-range" &&
      dateFilter.range?.start &&
      dateFilter.range?.end
    ) {
      const start = new Date(dateFilter.range.start);
      const end = new Date(dateFilter.range.end);
      const series: Array<{ name: string; clicks: number }> = [];
      const cursor = new Date(start);
      while (cursor <= end) {
        const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
        series.push({ name: key, clicks: clickBuckets.get(key) || 0 });
        cursor.setDate(cursor.getDate() + 1);
      }
      return series;
    }

    if (agg === "week" && dateFilter?.kind === "week" && dateFilter.single) {
      const start = getStartOfWeek(new Date(dateFilter.single));
      const series: Array<{ name: string; clicks: number }> = [];
      const cursor = new Date(start);
      for (let i = 0; i < 7; i += 1) {
        const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
        series.push({ name: key, clicks: clickBuckets.get(key) || 0 });
        cursor.setDate(cursor.getDate() + 1);
      }
      return series;
    }

    if (agg === "month" && dateFilter?.kind === "month" && dateFilter.single) {
      const first = new Date(dateFilter.single);
      const year = first.getFullYear();
      const month = first.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const series: Array<{ name: string; clicks: number }> = [];
      for (let day = 1; day <= daysInMonth; day += 1) {
        const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        series.push({ name: key, clicks: clickBuckets.get(key) || 0 });
      }
      return series;
    }

    if (agg === "year" && dateFilter?.kind === "year" && dateFilter.single) {
      const year = new Date(dateFilter.single).getFullYear();
      const series: Array<{ name: string; clicks: number }> = [];
      for (let m = 1; m <= 12; m += 1) {
        const key = `${year}-${String(m).padStart(2, "0")}`;
        series.push({ name: key, clicks: clickBuckets.get(key) || 0 });
      }
      return series;
    }

    const keys = new Set<string>([...clickBuckets.keys()]);
    return Array.from(keys.values())
      .sort((a, b) => (a > b ? 1 : -1))
      .map((name) => ({
        name,
        clicks: clickBuckets.get(name) || 0,
      }));
  }, [filteredVacancies, period, dateFilter]);

  function getActiveAggregation(): "day" | "week" | "month" | "year" {
    if (dateFilter?.kind?.includes("week")) return "week";
    if (dateFilter?.kind?.includes("month")) return "month";
    if (dateFilter?.kind?.includes("year")) return "year";
    return "day";
  }

  function getOverviewTitle(): string {
    const agg = getActiveAggregation();
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

  return (
    <div className="space-y-4">
      <div className="">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            </div>
            <p className="text-gray-600">
              Monitor platform activity and manage data.
            </p>
          </div>
          <LogoutButton />
        </div>
        <div className="flex gap-3 flex-wrap justify-between">
          <div className="flex gap-3">
            <div className="w-full relative z-20" ref={titleRef}>
              <button
                type="button"
                onClick={() => {
                  setShowTitles(!showTitles);
                  setShowHospitals(false);
                }}
                className="flex border border-gray-300 rounded px-3 py-2 items-center justify-between w-full text-left text-sm text-black focus:outline-none cursor-pointer min-w-[200px]"
              >
                <span>
                  {selectedTitleId
                    ? corporateTitle?.find((t: { id: number }) => String(t.id) === selectedTitleId)?.name || "Select Designation"
                    : "Select Designation"}
                </span>
                <svg
                  className={`h-5 w-5 text-black transform transition-transform ${showTitles ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showTitles && (
                <div className="max-h-48 overflow-y-auto p-2 border border-gray-300 rounded mt-1 absolute z-10 bg-white w-full shadow-lg">
                  {corporateTitle?.length === 0 ? (
                    <div className="text-sm text-black py-2">No designations found</div>
                  ) : (
                    corporateTitle?.map((t: { id: number; name: string }) => (
                      <div
                        key={t.id}
                        onClick={() => handleTitleChange(String(t.id))}
                        className={`p-2 text-sm cursor-pointer hover:bg-gree-100 rounded ${selectedTitleId === String(t.id) ? 'bg-green-100 font-medium text-black' : 'text-black'}`}
                      >
                        {t.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <div className="w-full relative z-19" ref={hospitalRef}>
              <button
                type="button"
                onClick={() => {
                  setShowHospitals(!showHospitals);
                  setShowTitles(false);
                }}
                className="flex border border-gray-300 rounded px-3 py-2 items-center justify-between w-full text-left text-sm text-black focus:outline-none cursor-pointer min-w-[200px]"
              >
                <span>
                  {selectedHospitalId
                    ? hospital?.find((h: { id: number }) => String(h.id) === selectedHospitalId)?.name || "Select Hospital"
                    : "Select Hospital"}
                </span>
                <svg
                  className={`h-5 w-5 text-black transform transition-transform ${showHospitals ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showHospitals && (
                <div className="max-h-48 overflow-y-auto p-2 border border-gray-300 rounded mt-1 absolute z-10 bg-white w-full shadow-lg">
                  {hospital?.length === 0 ? (
                    <div className="text-sm text-black py-2">No hospitals found</div>
                  ) : (
                    hospital?.map((h: { id: number; name: string }) => (
                      <div
                        key={h.id}
                        onClick={() => handleHospitalChange(String(h.id))}
                        className={`p-2 text-sm cursor-pointer hover:bg-green-100 rounded ${selectedHospitalId === String(h.id) ? 'bg-green-100 font-medium text-black' : 'text-black'}`}
                      >
                        {h.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <button
              onClick={clearFilters}
              className="px-3 py-2 rounded  bg-[#007F4E] hover:bg-[#1E4A28] justify-end items-end text-white"
            >
              Clear filters
            </button>
          </div>
        </div>
        <div className="rounded py-4">
          <DateFilters onChange={setDateFilter} value={dateFilter} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <div className="rounded  p-4">
            <div className="text-xl text-black text-center font-bold ">
              No. of Interested Candidates
            </div>
            <div className="text-3xl font-semibold text-center text-blue-500">
              {interestedCandidates}
            </div>
          </div>
          <div className="rounded p-4">
            <div className="text-xl text-black text-center font-bold ">
              Active Jobs
            </div>
            <div className="text-3xl font-semibold text-green-600 text-center">
              {activeJobs}
            </div>
          </div>
          <div className="rounded p-4">
            <div className="text-xl text-black text-center font-bold ">
              Total Jobs
            </div>
            <div className="text-3xl font-semibold text-amber-600 text-center">
              {totalJobs}
            </div>
          </div>
        </div>

        <div className="rounded border p-4">
          <div className="text-sm font-medium mb-2">{getOverviewTitle()}</div>
          <ChartContainer
            style={{ aspectRatio: "auto", height: 260 }}
            config={{
              clicks: { label: "Clicks", color: "hsl(262, 83%, 57%)" },
            }}
          >
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="clicks"
                stroke="var(--color-clicks)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

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
