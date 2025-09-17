import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  try {
    // This endpoint returns ALL hospitals (active and inactive) for admin management
    const hospitals = await prisma.hospital.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals for admin:", error);
    return NextResponse.json(
      { error: "Failed to fetch hospitals" },
      { status: 500 }
    );
  }
}