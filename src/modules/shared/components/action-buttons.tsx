"use client";

import Link from "next/link";
import { ReactNode } from "react";

// Common action button styles
const actionButtonClass = "text-gray-400 hover:text-gray-600 transition-colors";

export interface ActionButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  label: string;
  className?: string;
}

export function ActionButton({
  href,
  onClick,
  children,
  label,
  className = "",
}: ActionButtonProps) {
  const baseClass = `${actionButtonClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClass} aria-label={label}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClass} aria-label={label}>
      {children}
    </button>
  );
}

// Pre-built action icons
export const ActionIcons = {
  View: () => (
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
  ),
  Edit: () => (
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
  ),
  Delete: () => (
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
        d="M6 7h12"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 11v6m4-6v6"
      />
    </svg>
  ),
  Download: () => (
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
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  ),
  Share: () => (
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
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
      />
    </svg>
  ),
};

// Specialized action buttons
export interface ViewButtonProps {
  href: string;
  label?: string;
}

export function ViewButton({ href, label = "View" }: ViewButtonProps) {
  return (
    <ActionButton href={href} label={label}>
      <ActionIcons.View />
    </ActionButton>
  );
}

export interface EditButtonProps {
  href: string;
  label?: string;
}

export function EditButton({ href, label = "Edit" }: EditButtonProps) {
  return (
    <ActionButton href={href} label={label}>
      <ActionIcons.Edit />
    </ActionButton>
  );
}

export interface DeleteButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function DeleteButton({
  onClick,
  label = "Delete",
  className = "",
}: DeleteButtonProps) {
  return (
    <ActionButton
      onClick={onClick}
      label={label}
      className={`hover:text-red-600 ${className}`}
    >
      <ActionIcons.Delete />
    </ActionButton>
  );
}

// Action button group
export interface ActionButtonGroupProps {
  children: ReactNode;
  className?: string;
}

export function ActionButtonGroup({
  children,
  className = "",
}: ActionButtonGroupProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>{children}</div>
  );
}
