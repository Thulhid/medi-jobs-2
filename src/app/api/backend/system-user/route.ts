import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  try {
    const systemUser = await prisma.systemUser.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
            role: {
              select: { id: true, name: true, metaCode: true },
            },
          },
        },
      },
    });
    return NextResponse.json(systemUser);
  } catch (error) {
    console.error("Error fetching system users:", error);
    return NextResponse.json(
      { error: "Failed to fetch system users" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const newSystemUser = await prisma.systemUser.create({
      data: {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        mobile: body.mobile,
        userId: Number(body.userId),
      },
    });

    return NextResponse.json(newSystemUser);
  } catch (error) {
    console.error("Error creating system user:", error);

    return NextResponse.json(
      { error: "Failed to create system user" },
      { status: 500 },
    );
  }
}
