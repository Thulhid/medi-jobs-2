"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface TablePageHeaderProps {
  header: string;
  link?: string;
}

export const CustomTableBackHeader = ({
  header,
  link,
}: TablePageHeaderProps) => {
  return (
    <div className="mb-12 border-b flex w-full items-start justify-between pb-2">
      {link && (
        <Link href={`/admin-dashboard/${header}`}>
          <div className="flex gap-1 group">
            <ChevronLeft className="group-hover:text-green-500 transition-colors w-4 h-4" />
            <h1 className="font-semibold text-xs uppercase tracking-wide group-hover:text-green-500 transition-colors">
              Back to {header}
            </h1>
          </div>
        </Link>
      )}
    </div>
  );
};
