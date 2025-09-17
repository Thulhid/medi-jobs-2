import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const status = await prisma.status.findMany();
  return NextResponse.json(status);
}
