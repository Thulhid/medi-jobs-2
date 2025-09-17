import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const userRequest = await prisma.userRequest.findMany();
  return NextResponse.json(userRequest);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const newuserRequest = await prisma.userRequest.create({
      data: {
        firstname: body.firstname,
        lastname: body.lastname,
        contact: body.contact,
        hospital: body.hospital,
        designation: body.designation,
        email: body.email,
        message: body.message,
      },
    });

    return NextResponse.json(newuserRequest);
  } catch (err) {
    console.error("", err);
    return NextResponse.json(
      { error: "Failed to create user request" },
      { status: 500 },
    );
  }
}
