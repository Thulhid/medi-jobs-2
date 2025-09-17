"use client";

import { useMemo, useState } from "react";
import { useGetAllRecruiter } from "@/modules/backend/recruiter/hooks/use-get-all-recruiter";
import { useGetAllHospital } from "@/modules/backend/hospital/hooks/use-get-all-hospital";
import Link from "next/link";

import {
  DataTable,
  Column,
  TableLink,
  EditIcon,
  TableActions,
} from "@/modules/shared/components/data-table";
import {
  SearchFilters,
  SelectFilter,
} from "@/modules/shared/components/search-filters";
import { PageHeader } from "@/modules/shared/components/page-header";
import { Pagination } from "@/modules/shared/components/pagination";

type RecruiterRow = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  hospitalId: number;
  hospital?: { name?: string } | null;
  recruiterType?: { name?: string } | null;
};

export const RecruitersList = () => {
  const { recruiter, recruiterLoading } = useGetAllRecruiter();
  const { hospital } = useGetAllHospital();

  const [search, setSearch] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (recruiter || [])
      .filter((r: RecruiterRow) =>
        hospitalId ? String(r.hospitalId) === hospitalId : true,
      )
      .filter((r: RecruiterRow) =>
        !q
          ? true
          : `${r.firstname} ${r.lastname}`.toLowerCase().includes(q) ||
            r.email?.toLowerCase().includes(q) ||
            r.recruiterType?.name?.toLowerCase().includes(q) ||
            r.hospital?.name?.toLowerCase().includes(q),
      );
  }, [recruiter, hospitalId, search]);

  const handleClearFilters = () => {
    setSearch("");
    setHospitalId("");
    setCurrentPage(1);
  };

  const columns: Column<RecruiterRow>[] = [
    {
      key: "index",
      header: "#",
      render: (_, __, index) => index + 1,
    },
    {
      key: "name",
      header: "Name",
      render: (_, row) => (
        <TableLink href={`/admin-dashboard/recruiters/${row.id}/edit`}>
          {row.firstname} {row.lastname}
        </TableLink>
      ),
    },
    { key: "email", header: "Email" },
    { key: "mobile", header: "Mobile" },
    {
      key: "hospital",
      header: "Hospital",
      render: (_, row) => row.hospital?.name || "-",
    },
    {
      key: "recruiterType",
      header: "Type",
      render: (_, row) => row.recruiterType?.name || "-",
    },
    {
      key: "actions",
      header: "Options",
      render: (_, row) => (
        <TableActions>
          <EditIcon href={`/admin-dashboard/recruiters/${row.id}/edit`} />
        </TableActions>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <PageHeader
        title="RECRUITERS"
        description="Manage recruiters here."
        actions={
          <Link
            href="/admin-dashboard/recruiters/add-new-recruiter"
            className="px-4 py-2 bg-[#1e4a28] text-white hover:bg-[#007f4e] rounded"
          >
            Add New Recruiter
          </Link>
        }
      />

      <SearchFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name/email/type/hospital"
        onClearFilters={handleClearFilters}
        filters={
          <SelectFilter
            value={hospitalId}
            onChange={setHospitalId}
            options={
              (hospital as { id: number; name: string }[] | undefined) || []
            }
            placeholder="All Hospitals"
            className="rounded"
          />
        }
      />

      <DataTable
        data={filtered}
        columns={columns}
        loading={recruiterLoading}
        emptyMessage="No recruiters found"
      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(1, Math.ceil(filtered.length / 10))}
        totalItems={filtered.length}
        itemsPerPage={10}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
