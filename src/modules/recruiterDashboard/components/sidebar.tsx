"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function RecruiterSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role?.metaCode?.toUpperCase?.();
  const isLead = role === "LEAD_RECRUITER";

  const navItems = [
    {
      href: "/recruiter-dashboard",
      label: "Dashboard",
      isActive: pathname === "/recruiter-dashboard",
    },
    {
      href: "/recruiter-dashboard/vacancies",
      label: "Vacancies",
      isActive: pathname.startsWith("/recruiter-dashboard/vacancies"),
    },
    {
      href: "/recruiter-dashboard/notifications",
      label: "Notifications",
      isActive: pathname.startsWith("/recruiter-dashboard/notifications"),
    },
    ...(isLead
      ? [
          {
            href: "/recruiter-dashboard/recruiters",
            label: "Recruiters",
            isActive: pathname.startsWith("/recruiter-dashboard/recruiters"),
          },
        ]
      : []),
  ];

  return (
    <aside className="w-64 border-r bg-white hidden md:block">
      <div className="p-4 font-semibold">
        <Image
          src="/images/logo/logo.png"
          alt="Logo"
          width={1920}
          height={1080}
          className="w-60 h-auto"
        />
      </div>
      <nav className="px-2 space-y-1 border-t pt-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded hover:bg-gray-100 ${
              item.isActive ? "bg-gray-100 text-blue-600" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
