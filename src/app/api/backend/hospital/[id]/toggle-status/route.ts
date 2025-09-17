import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const pathSegments = req.nextUrl.pathname.split("/");
  const id = pathSegments[pathSegments.indexOf("hospital") + 1];
  const hospitalId = Number(id);

  if (isNaN(hospitalId)) {
    return NextResponse.json({ error: "Invalid hospital ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { activeStatus } = body;

    if (typeof activeStatus !== "boolean") {
      return NextResponse.json(
        { error: "activeStatus must be a boolean" },
        { status: 400 }
      );
    }

    // Check if hospital exists
    const existingHospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!existingHospital) {
      return NextResponse.json(
        { error: "Hospital not found" },
        { status: 404 }
      );
    }

    // Update hospital status
    const updatedHospital = await prisma.hospital.update({
      where: { id: hospitalId },
      data: {
        activeStatus,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: `Hospital ${activeStatus ? "activated" : "deactivated"} successfully`,
      hospital: updatedHospital,
    });
  } catch (error) {
    console.error("Error toggling hospital status:", error);
    return NextResponse.json(
      { error: "Failed to update hospital status" },
      { status: 500 }
    );
  }
}