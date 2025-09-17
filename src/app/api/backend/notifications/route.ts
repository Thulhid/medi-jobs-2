import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getRequestAuth } from "@/app/api/_utils/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recruiter = await prisma.recruiter.findFirst({
      where: { userId: auth.userId },
    });

    if (!recruiter) {
      return NextResponse.json(
        { error: "Recruiter profile not found" },
        { status: 404 },
      );
    }

    const items = await prisma.vacancy.findMany({
      where: {
        recruiterId: recruiter.id,
        status: {
          name: { in: ["Approved", "Rejected"], mode: "insensitive" },
        },
      },
      include: {
        status: { select: { name: true } },
        hospital: { select: { name: true, id: true, logo: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch notifications", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
