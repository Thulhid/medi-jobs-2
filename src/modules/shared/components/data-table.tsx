"use client";

import { ReactNode } from "react";
import Link from "next/link";

export interface Column<T = Record<string, unknown>> {
  key: string;
  header: string;
  render?: (value: unknown, row: T, index: number) => ReactNode;
  className?: string;
}

export interface DataTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  /**
   * Optional function to generate a stable key for each row.
   * If not provided, the component will try `row.id` and fall back to the index.
   */
  rowKey?: (row: T, index: number) => string | number;
  striped?: boolean;
  hover?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  onRowClick,
  rowKey,
  striped = true,
  hover = true,
  className = "",
}: DataTableProps<T>) {
  return (
    <div className={`bg-white rounded-lg border overflow-hidden ${className}`}>
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left px-6 py-4 text-sm font-medium text-gray-900 ${column.className || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                className="px-6 py-8 text-center text-gray-500"
                colSpan={columns.length}
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                className="px-6 py-8 text-center text-gray-500"
                colSpan={columns.length}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={String(
                  rowKey
                    ? rowKey(row, index)
                    : ((row as Record<string, unknown>).id ?? index),
                )}
                className={`
                  ${striped && index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  ${hover ? "hover:bg-gray-100" : ""}
                  ${onRowClick ? "cursor-pointer" : ""}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 text-sm text-gray-900"
                  >
                    {
                      (column.render
                        ? column.render(row[column.key], row, index)
                        : row[column.key]) as ReactNode
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Helper components for common table cell types
export const TableActions = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-2">{children}</div>
);

export const TableLink = ({
  href,
  children,
  className = "text-[#1e4a28] hover:underline",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <Link href={href} className={className}>
    {children}
  </Link>
);

export const EditIcon = ({
  href,
  label = "Edit",
}: {
  href: string;
  label?: string;
}) => (
  <Link
    href={href}
    className="text-gray-400 hover:text-gray-600"
    aria-label={label}
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
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  </Link>
);

export const ViewIcon = ({
  href,
  label = "View",
}: {
  href: string;
  label?: string;
}) => (
  <Link
    href={href}
    className="text-gray-400 hover:text-gray-600"
    aria-label={label}
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
);
