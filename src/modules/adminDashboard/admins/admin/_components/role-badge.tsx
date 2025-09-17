"use client";

import { useSession } from "next-auth/react";

export function RoleBadge() {
  const { data: session } = useSession();
  const role = session?.user?.role?.metaCode;
  let label = "";
  if (role === "SUPER_ADMIN") label = "Super Admin";
  else if (role === "ADMIN") label = "Admin";
  if (!label) return null;
  return (
    <div className="text-xs px-2 py-1 rounded bg-gray-900 text-white">
      {label}
    </div>
  );
}
