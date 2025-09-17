import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(): Promise<Response> {
  const EmploymentType = await prisma.employmentType.findMany();
  return NextResponse.json(EmploymentType);
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();

    const newEmploymentType = await prisma.employmentType.create({
      data: {
        name: body.name,
        metaCode: body.metaCode,
      },
    });

    return NextResponse.json(newEmploymentType);
  } catch (err) {
    console.error("", err);
    return NextResponse.json(
      { error: "Failed to insert status" },
      { status: 500 },
    );
  }
}
