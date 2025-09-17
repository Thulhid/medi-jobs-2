"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGetAllStystemUser } from "@/modules/backend/systemuser/hooks/use-get-all-ststemuser";

type SystemUserRow = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  user: {
    id: number;
    email: string;
    createdAt: string | Date;
    role: { metaCode: string };
  };
};

export const AdminsList = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role?.metaCode?.toUpperCase?.();
  const isSuper = (role || "").includes("SUPER");

  useEffect(() => {
    if (status === "authenticated" && !isSuper) {
      router.replace("/admin-dashboard");
    }
  }, [status, isSuper, router]);

  const { systemusers, systemusersLoading } = useGetAllStystemUser();

  if (status === "loading")
    return <div className="p-4 text-sm text-gray-500">Loading...</div>;
  if (!isSuper)
    return <div className="p-4 text-sm text-rose-600">Unauthorized</div>;

  const admins = ((systemusers as SystemUserRow[]) ?? []).filter((su) => {
    const meta = String(su?.user?.role?.metaCode || "").toUpperCase();
    return meta === "ADMIN";
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">System Users</h1>
        <p className="text-gray-600">Manage admin users.</p>
        <div className="mt-2 items-end justify-end  flex ">
          <a
            href="/admin-dashboard/admins/add"
            className="inline-block px-4 py-2 border rounded hover:[#007f4e] bg-[#007f4e] text-white justify-end  items-end "
          >
            Add Admin
          </a>
        </div>
      </div>
      <div className="rounded border overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Mobile</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {systemusersLoading ? (
              <tr>
                <td className="px-4 py-4" colSpan={6}>
                  Loading...
                </td>
              </tr>
            ) : (
              admins.map((u: SystemUserRow, idx: number) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{u.user?.email}</td>
                  <td className="px-4 py-2">{u.mobile}</td>
                  <td className="px-4 py-2">{u.user?.role?.metaCode}</td>
                  <td className="px-4 py-2">
                    {[u.firstname, u.lastname].filter(Boolean).join(" ")}
                  </td>
                  <td className="px-4 py-2">
                    {u.user?.createdAt
                      ? new Date(u.user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
