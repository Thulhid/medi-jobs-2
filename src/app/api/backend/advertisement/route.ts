import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<Response> {
  const advertisements = await prisma.advertisement.findMany();
  return NextResponse.json(advertisements);
}
