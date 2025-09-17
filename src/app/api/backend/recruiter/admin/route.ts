import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  try {
    
    const recruiters = await prisma.recruiter.findMany({
      include: {
        hospital: true,
        recruiterType: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(recruiters);
  } catch (error) {
    console.error("Error fetching recruiters for admin:", error);
    return NextResponse.json(
      { error: "Failed to fetch recruiters" },
      { status: 500 }
    );
  }
}