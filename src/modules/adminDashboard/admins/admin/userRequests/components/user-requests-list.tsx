"use client";

import { useMemo, useState } from "react";
import { useGetAllUserRequest } from "@/modules/backend/user-request/hooks/use-get-all-user-reques";
import Link from "next/link";

export const UserRequestsList = () => {
  const { userRequest, userRequestLoading } = useGetAllUserRequest();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return userRequest;
    return userRequest.filter(
      (u: {
        firstname: string;
        lastname: string;
        email: string;
        hospital: string;
        designation: string;
      }) =>
        `${u.firstname} ${u.lastname}`.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.hospital?.toLowerCase().includes(q) ||
        u.designation?.toLowerCase().includes(q),
    );
  }, [userRequest, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Requests</h2>
      </div>

      <div className="flex gap-2 items-center">
        <input
          placeholder="Search email/name/hospital/designation"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-72"
        />
        <button
          className="px-3 py-2 border rounded"
          onClick={() => setSearch("")}
        >
          Clear Results
        </button>
      </div>

      <div className="rounded border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2 w-16">#</th>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Designation</th>
              <th className="text-left px-3 py-2">Email</th>
              <th className="text-left px-3 py-2">Hospital</th>
              <th className="text-left px-3 py-2">Mobile</th>
              <th className="text-left px-3 py-2">Date Submitted</th>
              <th className="text-left px-3 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {userRequestLoading ? (
              <tr>
                <td className="px-3 py-3" colSpan={8}>
                  Loading...
                </td>
              </tr>
            ) : (
              filtered?.map(
                (
                  u: {
                    id: number;
                    firstname: string;
                    lastname: string;
                    designation: string;
                    email: string;
                    hospital: string;
                    contact: string;
                    createdAt: string;
                  },
                  idx: number,
                ) => (
                  <tr key={u.id} className="border-t">
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/admin-dashboard/user-requests/${u.id}`}
                        className="text-[#1e4a28] hover:underline"
                      >
                        {u.firstname} {u.lastname}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{u.designation}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.hospital}</td>
                    <td className="px-3 py-2">{u.contact}</td>
                    <td className="px-3 py-2 text-sm text-gray-600">
                      {new Date(u.createdAt).toLocaleDateString()}<br/>
                      <span className="text-xs">
                        {new Date(u.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/admin-dashboard/user-requests/${u.id}`}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="View"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
