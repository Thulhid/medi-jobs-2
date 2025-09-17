import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export type RequestAuth = {
  userId: number;
  roleMetaCode: string;
};

type TokenWithRole = {
  id?: string | number;
  role?: string | { metaCode?: string; code?: string; name?: string };
};

export async function getRequestAuth(
  req: NextRequest,
): Promise<RequestAuth | null> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return null;
  let roleMetaCode = "";
  const roleVal = (token as TokenWithRole)?.role;
  if (typeof roleVal === "string") {
    roleMetaCode = roleVal;
  } else if (roleVal && typeof roleVal === "object") {
    roleMetaCode = roleVal.metaCode || roleVal.code || roleVal.name || "";
  }
  return {
    userId: Number((token as TokenWithRole).id) || 0,
    roleMetaCode: roleMetaCode.toUpperCase(),
  };
}

export function hasAnyRole(roleMetaCode: string, allowed: string[]): boolean {
  const role = roleMetaCode.toUpperCase();
  return allowed.some((r) => role === r.toUpperCase());
}

// Helpers for permissions
export function normalizeRole(roleMetaCode: string): string {
  return roleMetaCode.toUpperCase();
}

export function isRecruiterSide(roleMetaCode: string): boolean {
  const r = normalizeRole(roleMetaCode);
  return r.includes("RECRUITER"); // matches RECRUITER and LEAD_RECRUITER
}

export function isLeadRecruiter(roleMetaCode: string): boolean {
  return normalizeRole(roleMetaCode) === "LEAD_RECRUITER";
}

export function isAdminSide(roleMetaCode: string): boolean {
  const r = normalizeRole(roleMetaCode);
  return r.includes("SUPER") || r === "ADMIN" || r.includes("ADMIN");
}
