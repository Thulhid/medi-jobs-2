import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(): Promise<Response> {
  const corporateTitles = await prisma.corporateTitle.findMany();
  return NextResponse.json(corporateTitles);
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();

    const newCorporateTitle = await prisma.corporateTitle.create({
      data: {
        name: body.name,
        metaCode: body.metaCode,
      },
    });

    return NextResponse.json(newCorporateTitle);
  } catch {
    return NextResponse.json(
      { error: "Failed to insert status" },
      { status: 500 },
    );
  }
}
