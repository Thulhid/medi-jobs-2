import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pathSegments = req.nextUrl.pathname.split("/");
  const id = pathSegments[pathSegments.indexOf("hospital") + 1];
  const hospitalId = Number(id);

  if (isNaN(hospitalId)) {
    return NextResponse.json({ error: "Invalid Hospital ID" }, { status: 400 });
  }

  try {
    // This endpoint returns hospital regardless of activeStatus for admin access
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      include: {
        vacancy: true,
      },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(hospital);
  } catch (error) {
    console.error("Error fetching hospital for admin:", error);
    return NextResponse.json(
      { error: "Failed to fetch hospital" },
      { status: 500 },
    );
  }
}