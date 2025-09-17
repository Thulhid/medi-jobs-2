"use client";

import { useMemo, useState } from "react";
import { useGetAllVacancies } from "@/modules/backend/vacancy/hooks/use-get-all-vacancy";
import {
  DataTable,
  Column,
  TableLink,
  EditIcon,
  ViewIcon,
  TableActions,
} from "@/modules/shared/components/data-table";
import { isEditableStatus } from "@/modules/shared/utils/status";
import { SearchFilters } from "@/modules/shared/components/search-filters";
import { PageHeader } from "@/modules/shared/components/page-header";
import { StatusBadge } from "@/modules/shared/components/status-badge";


type VacancyRow = {
  id: number;
  hospitalId: number;
  corporateTitleId: number;
  designation: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  hospital: { name: string };
  corporateTitle: { name: string };
  sbu: { name: string };
  employmentType: { name: string };
  status: { name: string };
};

export const VacanciesList = () => {
  const { vacancies, vacanciesLoading } = useGetAllVacancies();

  const [search, setSearch] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [titleId, setTitleId] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (vacancies ?? [])
      .filter((v: VacancyRow) =>
        hospitalId ? String(v.hospitalId) === hospitalId : true,
      )
      .filter((v: VacancyRow) =>
        titleId ? String(v.corporateTitleId) === titleId : true,
      )
      .filter((v: VacancyRow) =>
        !q
          ? true
          : v.designation?.toLowerCase().includes(q) ||
            v.hospital?.name?.toLowerCase().includes(q) ||
            v.corporateTitle?.name?.toLowerCase().includes(q),
      );
  }, [vacancies, hospitalId, titleId, search]);

  const handleClearFilters = () => {
    setSearch("");
    setHospitalId("");
    setTitleId("");
  };

  const columns: Column<VacancyRow>[] = [
    {
      key: "index",
      header: "#",
      render: (_, __, index) => index + 1,
    },
    {
      key: "hospital",
      header: "Hospital",
      render: (_, row) => (
        <TableLink href={`/admin-dashboard/vacancies/${row.id}`}>
          {row.hospital?.name}
        </TableLink>
      ),
    },
    {
      key: "corporateTitle",
      header: "Title",
      render: (_, row) => row.corporateTitle?.name || "-",
    },
    {
      key: "sbu",
      header: "SBU",
      render: (_, row) => row.sbu?.name || "-",
    },
    { key: "designation", header: "Designation" },
    {
      key: "location",
      header: "Location",
      render: (_, row) => `${row.city}, ${row.country}`,
    },
    {
      key: "employmentType",
      header: "Employment Type",
      render: (_, row) => row.employmentType?.name || "-",
    },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <StatusBadge status={row.status?.name || "Unknown"} />
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (_, row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      key: "endDate",
      header: "End Date",
      render: (_, row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Options",
      render: (_, row) => (
        <TableActions>
          <ViewIcon href={`/admin-dashboard/vacancies/${row.id}`} />
          {isEditableStatus(row.status?.name) && (
            <EditIcon href={`/admin-dashboard/vacancies/${row.id}/edit`} />
          )}
        </TableActions>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="VACANCIES" description="Manage vacancies here." />

      <SearchFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search designation"
        onClearFilters={handleClearFilters}
      />

      <DataTable
        data={filtered}
        columns={columns}
        loading={vacanciesLoading}
        emptyMessage="No vacancies found"
      />
    </div>
  );
};
