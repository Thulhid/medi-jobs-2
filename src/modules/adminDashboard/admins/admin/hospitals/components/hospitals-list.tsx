"use client";

import { useMemo, useState } from "react";
import type { Hospital } from "@/modules/backend/hospital/types/types";
import { useGetAllHospital } from "@/modules/backend/hospital/hooks/use-get-all-hospital";
import { useToggleHospitalStatus } from "@/modules/backend/hospital/hooks/use-toggle-hospital-status";
import Link from "next/link";
import {
  DataTable,
  Column,
  TableLink,
  TableActions,
} from "@/modules/shared/components/data-table";
import { SearchFilters } from "@/modules/shared/components/search-filters";
import { PageHeader } from "@/modules/shared/components/page-header";
import {
  ViewButton,
  EditButton,
} from "@/modules/shared/components/action-buttons";
import { StatusBadge } from "@/modules/shared/components/status-badge";
import { Button } from "@/modules/ui/components/button";
import { ConfirmationDialog } from "@/modules/shared/components/confirmation-dialog";

export const HospitalsList = () => {
  const { hospital, hospitalLoading, mutate } = useGetAllHospital();
  const { toggleHospitalStatus, hospitalLoading: isToggling } = useToggleHospitalStatus();
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const filtered: Hospital[] = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return hospital || [];
    return (hospital as Hospital[]).filter(
      (h: Hospital) =>
        h.name?.toLowerCase().includes(q) ||
        h.email?.toLowerCase().includes(q) ||
        (h.city ?? "")?.toLowerCase().includes(q),
    );
  }, [hospital, search,isToggling ]);

  const handleClearFilters = () => {
    setSearch("");
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      const result = await toggleHospitalStatus(id, !currentStatus);
      if (result) {
        await mutate();
      }
    } catch (error) {
      console.error("Error toggling hospital status:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const columns: Column<Hospital>[] = [
    {
      key: "index",
      header: "#",
      render: (_, __, index) => index + 1,
    },
    // {
    //   key: "logo",
    //   header: "Logo",
    //   render: (_, row) => (
    //     <LogoAvatar src={row.logo} name={row.name} size="md" />
    //   ),
    // },
    {
      key: "name",
      header: "Name",
      render: (_, row) => (
        <TableLink href={`/admin-dashboard/hospitals/${row.id}`}>
          {row.name}
        </TableLink>
      ),
    },
    { key: "email", header: "Email" },
    { key: "city", header: "City" },
    { key: "country", header: "Country" },
    { key: "mobile", header: "Contact Number" },
    {
      key: "status",
      header: "Status",
      render: (_, row) => (
        <StatusBadge
          status={row.activeStatus ? "Active" : "Inactive"}
          variant={row.activeStatus ? "success" : "error"}
        />
      ),
    },
    {
      key: "actions",
      header: "Options",
      render: (_, row) => (
        <TableActions>
          <ViewButton href={`/admin-dashboard/hospitals/${row.id}`} />
          <EditButton href={`/admin-dashboard/hospitals/${row.id}/edit`} />
          <ConfirmationDialog
            title={`${row.activeStatus ? 'Deactivate' : 'Activate'} Hospital`}
            description={`Are you sure you want to ${row.activeStatus ? 'deactivate' : 'activate'} ${row.name}? ${row.activeStatus ? '' : ''}`}
            confirmText={row.activeStatus ? 'Deactivate' : 'Activate'}
            onConfirm={() => handleToggleStatus(row.id, row.activeStatus)}
            variant={row.activeStatus ? 'destructive' : 'default'}
          >
            <Button
              variant={row.activeStatus ? "destructive" : "default"}
              size="sm"
              disabled={togglingId === row.id}
              className={`h-8 px-3 ${
                row.activeStatus 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {togglingId === row.id ? (
                <span className="inline-flex items-center gap-1">
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {row.activeStatus ? 'Deactivating...' : 'Activating...'}
                </span>
              ) : (
                row.activeStatus ? 'Deactivate' : 'Activate'
              )}
            </Button>
          </ConfirmationDialog>
        </TableActions>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hospitals"
        description="Manage hospitals registered on the platform"
        actions={
          <Link
            href="/admin-dashboard/hospitals/add-new-hospitals"
            className="px-4 py-2 bg-[#007f4e] text-white hover:bg-[#1e4a28] rounded"
          >
            Add New Hospital
          </Link>
        }
      />

      <SearchFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name or email"
        onClearFilters={handleClearFilters}
      />

      <DataTable
        data={filtered}
        columns={columns}
        loading={hospitalLoading}
        emptyMessage="No hospitals found"
      />
    </div>
  );
};
