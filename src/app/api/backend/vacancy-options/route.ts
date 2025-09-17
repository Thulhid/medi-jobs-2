import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(): Promise<Response> {
  const vacancyOptions = await prisma.vacancyOptions.findMany();
  return NextResponse.json(vacancyOptions);
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();

    const newVacancyOption = await prisma.vacancyOptions.create({
      data: {
        name: body.name,
        metaCode: body.metaCode,
      },
    });

    return NextResponse.json(newVacancyOption);
  } catch (err) {
    console.error("", err);
    return NextResponse.json(
      { error: "Failed to insert vacancy option" },
      { status: 500 },
    );
  }
}
