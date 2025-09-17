"use client";

import { signOut } from "next-auth/react";
import React from "react";

interface LogoutButtonProps {
  className?: string;
  label?: string;
  callbackUrl?: string;
}

export function LogoutButton({
  className = "px-4 py-2 border rounded hover:bg-gray-50",
  label = "Logout",
  callbackUrl = "/signin",
}: LogoutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl })}
      className={className}
      aria-label="Logout"
      type="button"
    >
      {label}
    </button>
  );
}
