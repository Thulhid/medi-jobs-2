import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const userRequestId = Number(id);

  if (isNaN(userRequestId)) {
    return NextResponse.json(
      { error: "Invalid user request ID" },
      { status: 400 },
    );
  }

  try {
    const userRequest = await prisma.userRequest.findUnique({
      where: { id: userRequestId },
    });

    if (!userRequest) {
      return NextResponse.json(
        { error: "user request not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(userRequest);
  } catch (error) {
    console.error("", error);
    return NextResponse.json(
      { error: "Failed to fetch user request" },
      { status: 500 },
    );
  }
}
