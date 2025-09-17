"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DatePicker, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

export type DateFilterKind =
  | "day-range"
  | "week-range"
  | "month-range"
  | "year-range"
  | "day"
  | "week"
  | "month"
  | "year";

export type DateRangeValue = { start?: Date; end?: Date };

type Mode = "single" | "range";
type Unit = "day" | "week" | "month" | "year";

export function DateFilters({
  onChange,
  value,
}: {
  onChange: (payload: {
    kind: DateFilterKind;
    range?: DateRangeValue;
    single?: Date;
  }) => void;
  value?: { kind: DateFilterKind; range?: DateRangeValue; single?: Date };
}) {
  const [mode, setMode] = useState<Mode>("single");
  const [unit, setUnit] = useState<Unit>("day");

  useEffect(() => {
    if (!value?.kind) return;
    const k = value.kind;
    if (k.endsWith("-range")) setMode("range");
    else setMode("single");
    if (k.startsWith("day")) setUnit("day");
    else if (k.startsWith("week")) setUnit("week");
    else if (k.startsWith("month")) setUnit("month");
    else if (k.startsWith("year")) setUnit("year");
  }, [value?.kind]);

  const placeholders = useMemo(() => {
    if (mode === "range") {
      switch (unit) {
        case "day":
          return ["Select from Day", "to Day"] as const;
        case "week":
          return ["Select from Week", "to Week"] as const;
        case "month":
          return ["Select from Month", "to Month"] as const;
        case "year":
        default:
          return ["Select from Year", "to Year"] as const;
      }
    }
    switch (unit) {
      case "day":
        return "Select a Day";
      case "week":
        return "Select a Week";
      case "month":
        return "Select a Month";
      case "year":
      default:
        return "Select a Year";
    }
  }, [mode, unit]);

  const toDate = (d?: Dayjs | null) => (d ? d.toDate() : undefined);

  const currentPicker = unit === "day" ? undefined : unit; // antd uses undefined for day
  const currentKind: DateFilterKind = (
    mode === "range" ? `${unit}-range` : unit
  ) as DateFilterKind;

  // Tabs UI like: Per Day | Per Week | Per Month | Per Year
  const TabButton = ({ label, val }: { label: string; val: Unit }) => (
    <button
      type="button"
      onClick={() => {
        setUnit(val);
        // Default: Day uses range, others single
        const now = new Date();
        if (val === "day") {
          setMode("range");
          onChange({ kind: "day-range", range: { start: now, end: now } });
        } else if (val === "week") {
          setMode("single");
          onChange({ kind: "week", single: now });
        } else if (val === "month") {
          setMode("single");
          onChange({ kind: "month", single: now });
        } else {
          setMode("single");
          onChange({ kind: "year", single: now });
        }
      }}
      className={`px-24 py-2 rounded h-12  ${unit === val ? "bg-green-100" : "bg-transparent hover:bg-gray-50"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex rounded  flex-col-4 h-12 shadow  justify-between">
        <TabButton label="Per Day" val="day" />
        <TabButton label="Per Week" val="week" />
        <TabButton label="Per Month" val="month" />
        <TabButton label="Per Year" val="year" />
      </div>
      <div>
        <Space direction="vertical" size={12} className="rounded-lg">
          {unit === "day" ? (
            <RangePicker
              value={
                value?.kind === "day-range" &&
                (value?.range?.start || value?.range?.end)
                  ? [
                      value?.range?.start ? dayjs(value.range.start) : null,
                      value?.range?.end ? dayjs(value.range.end) : null,
                    ]
                  : null
              }
              onChange={(vals) =>
                onChange({
                  kind: "day-range",
                  range: {
                    start: toDate(vals?.[0] || null),
                    end: toDate(vals?.[1] || null),
                  },
                })
              }
              placeholder={["Start date", "End date"]}
              allowEmpty={[true, true]}
            />
          ) : (
            <DatePicker
              picker={currentPicker}
              value={
                value?.kind === currentKind && value?.single
                  ? dayjs(value.single)
                  : null
              }
              onChange={(d) =>
                onChange({ kind: currentKind, single: toDate(d) })
              }
              placeholder={placeholders as string}
            />
          )}
        </Space>
      </div>
    </div>
  );
}
