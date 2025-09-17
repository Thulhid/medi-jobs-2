import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const userRoles = await prisma.userRole.findMany();
  return NextResponse.json(userRoles);
}
