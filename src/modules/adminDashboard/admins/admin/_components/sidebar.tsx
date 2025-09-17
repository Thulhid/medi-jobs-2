"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGetAllVacancies } from "@/modules/backend/vacancy/hooks/use-get-all-vacancy";
import Image from "next/image";

function getNavItems(role?: string) {
  const base = [
    {
      href: "/admin-dashboard",
      label: "Dashboard",
      match: (p: string) => p === "/admin-dashboard",
    },
    {
      href: "/admin-dashboard/hospitals",
      label: "Hospitals",
      match: (p: string) => p.startsWith("/admin-dashboard/hospitals"),
    },
    {
      href: "/admin-dashboard/recruiters",
      label: "Recruiters",
      match: (p: string) => p.startsWith("/admin-dashboard/recruiters"),
    },
    {
      href: "/admin-dashboard/vacancies",
      label: "Vacancies",
      match: (p: string) => p.startsWith("/admin-dashboard/vacancies"),
    },
    {
      href: "/admin-dashboard/user-requests",
      label: "User Requests",
      match: (p: string) => p.startsWith("/admin-dashboard/user-requests"),
    },
    {
      href: "/admin-dashboard/sbu",
      label: "SBU",
      match: (p: string) => p.startsWith("/admin-dashboard/sbu"),
    },
    {
      href: "/admin-dashboard/news",
      label: "News",
      match: (p: string) => p.startsWith("/admin-dashboard/news"),
    },
  ];
  const meta = String(role || "").toUpperCase();
  if (meta.includes("SUPER")) {
    base.splice(7, 0, {
      href: "/admin-dashboard/admins",
      label: "System Users",
      match: (p: string) => p.startsWith("/admin-dashboard/admins"),
    });
  }
  return base;
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role?.metaCode?.toUpperCase?.();
  const navItems = getNavItems(role);
  const { vacancies } = useGetAllVacancies();
  const pendingCount = (vacancies ?? []).filter(
    (v: { status: { name: string } }) => v?.status?.name === "Pending",
  ).length;

  return (
    <aside className="w-52 border-r bg-white hidden md:block">
      <div className="p-4 font-semibold">
        <Image
          src="/images/logo/logo.png"
          alt="Logo"
          width={1920}
          height={1080}
          className="w-full h-16 object-cover"
        />
      </div>
      <nav className="  border-t pt-4 ">
        {navItems.map((item) => {
          const active = item.match(pathname);
          const base = "block px-3 py-4 rounded transition-colors";
          const activeCls = active
            ? "bg-green-100 text-[#1e4a28] font-semibold"
            : "hover:bg-gray-100";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${base} ${activeCls} flex item-center justify-between`}
            >
              {item.label}
              {item.href === "/admin-dashboard/vacancies" &&
                pendingCount > 0 && (
                  <span
                    className={`ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs rounded-full bg-green-100 text-green-900 ${active ? "bg-green-600 text-white" : ""}`}
                  >
                    {pendingCount}
                  </span>
                )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
