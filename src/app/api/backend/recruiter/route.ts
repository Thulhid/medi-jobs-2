import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(): Promise<Response> {
  const recruiters = await prisma.recruiter.findMany({
    include: {
      hospital: true,
      recruiterType: true,
    },
  });
  return NextResponse.json(recruiters);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "email",
      "password",
      "roleId",
      "firstname",
      "lastname",
      "mobile",
      "hospitalId",
      "recruiterTypeId",
    ];

    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        hashedPassword: hashedPassword,
        roleId: Number(body.roleId),
      },
    });

    const newRecruiter = await prisma.recruiter.create({
      data: {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        mobile: body.mobile,
        hospitalId: Number(body.hospitalId),
        recruiterTypeId: Number(body.recruiterTypeId),
        userId: newUser.id,
      },
    });

    const recruiterWithRelations = await prisma.recruiter.findUnique({
      where: { id: newRecruiter.id },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recruiterType: true,
      },
    });

    return NextResponse.json(recruiterWithRelations);
  } catch (err) {
    console.error("Error creating recruiter:", err);
    
    // Handle specific Prisma errors
    if (err instanceof Error) {
      if (err.message.includes("Unique constraint failed")) {
        if (err.message.includes("email")) {
          return NextResponse.json(
            { error: "Email address is already registered" },
            { status: 400 },
          );
        }
        return NextResponse.json(
          { error: "A recruiter with this information already exists" },
          { status: 400 },
        );
      }
      
      return NextResponse.json(
        { error: `Failed to create recruiter: ${err.message}` },
        { status: 500 },
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create recruiter due to an unknown error" },
      { status: 500 },
    );
  }
}
