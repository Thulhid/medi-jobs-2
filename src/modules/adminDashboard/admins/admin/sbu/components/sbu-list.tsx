"use client";

import {useMemo, useState} from "react";
import {useGetAllSbu} from "@/modules/backend/sbu/hooks/use-get-all-sbu";
// import { useGetAllHospitals } from "@/modules/backend/hospital/hooks/use-get-all-hospital";
import Link from "next/link";
import {Column, DataTable, EditIcon, TableActions, TableLink,} from "@/modules/shared/components/data-table";
import {SearchFilters} from "@/modules/shared/components/search-filters";
import {PageHeader} from "@/modules/shared/components/page-header";
import {Pagination} from "@/modules/shared/components/pagination";

type SbuRow = {
  id: number;
  name: string;
  hospital: { name: string };
  city: string;
};

export const SbuList = () => {
  const { sbu, sbuLoading } = useGetAllSbu();
  // const { hospital } = useGetAllHospitals();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sbu || [];
    return (sbu || []).filter(
      (x: SbuRow) =>
        x.name?.toLowerCase().includes(q) ||
        x.hospital?.name?.toLowerCase().includes(q),
    );
  }, [sbu, search]);

  const handleClearFilters = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const columns: Column<SbuRow>[] = [
    {
      key: "index",
      header: "#",
      render: (_, __, index) => index + 1,
    },
    {
      key: "name",
      header: "Name",
      render: (_, row) => (
        <TableLink href={`/admin-dashboard/sbu/${row.id}/edit`}>
          {row.name}
        </TableLink>
      ),
    },
    {
      key: "hospital",
      header: "Hospital",
      render: (_, row) => row.hospital?.name || "-",
    },
    {
      key: "city",
      header: "City",
      render: (_, row) => row.city || "-",
    },
    {
      key: "actions",
      header: "Options",
      render: (_, row) => (
        <TableActions>
          <EditIcon href={`/admin-dashboard/sbu/${row.id}/edit`} />
        </TableActions>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="STRATEGIC BUSINESS UNITS (SBU)"
        description="Manage strategic Business Units here."
        actions={
          <Link
            href="/admin-dashboard/sbu/add-new-sbu"
            className="px-4 py-2 bg-[#1e4a28] text-white hover:bg-[#007f4e] rounded-lg"
          >
            Add New SBU
          </Link>
        }
      />

      <SearchFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search SBU or Hospital"
        onClearFilters={handleClearFilters}
      />

      <DataTable
        data={filtered}
        columns={columns}
        loading={sbuLoading}
        emptyMessage="No SBUs found"
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
