import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      roleId: true,
      createdAt: true,
      // Explicitly exclude hashedPassword for security
      role: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.email || !body.hashedPassword || !body.roleId) {
      return NextResponse.json(
        { error: "Email, password, and roleId are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        hashedPassword: body.hashedPassword,
        roleId: Number(body.roleId),
      },
    });

    const { ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword);
  } catch (err) {
    console.error("", err);
    return NextResponse.json(
      { error: "Failed to create user request" },
      { status: 500 },
    );
  }
}
