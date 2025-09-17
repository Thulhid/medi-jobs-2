import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const sbus = await prisma.sbu.findMany({
    include: {
      hospital: true,
    },
  });

  return NextResponse.json(sbus);
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();

    if (!body.name || !body.hospitalId || !body.city) {
      return NextResponse.json(
        { error: "Name, hospital Id and city are required" },
        { status: 400 },
      );
    }

    const addSbu = await prisma.sbu.create({
      data: {
        name: body.name,
        hospitalId: Number(body.hospitalId),
        city: body.city,
      },
      include: {
        hospital: true,
      },
    });

    return NextResponse.json(addSbu);
  } catch (error) {
    console.error("Error creating SBU:", error);
    return NextResponse.json(
      { error: "Failed to create SBU" },
      { status: 500 },
    );
  }
}
