import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const recruiterType = await prisma.recruiterType.findMany();
  return NextResponse.json(recruiterType);
}
