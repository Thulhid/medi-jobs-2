import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const workPlaceType = await prisma.workPlaceType.findMany();
  return NextResponse.json(workPlaceType);
}
