"use client";

import { ReactNode } from "react";

export interface SearchFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  onClearFilters?: () => void;
  showClearButton?: boolean;
  className?: string;
}

export function SearchFilters({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  actions,
  onClearFilters,
  showClearButton = true,
  className = "",
}: SearchFiltersProps) {
  const hasActiveFilters = searchValue.trim().length > 0;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-80 bg-white"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {filters}
        {showClearButton && (hasActiveFilters || onClearFilters) && (
          <button
            className="px-3 py-2 border rounded-lg hover:bg-gray-50"
            onClick={onClearFilters}
          >
            Clear filters
          </button>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ id: string | number; name: string }>;
  placeholder: string;
  className?: string;
}

export function SelectFilter({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: SelectFilterProps) {
  return (
    <select
      className={`border rounded-lg px-3 py-2 bg-white ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
