import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getRequestAuth, hasAnyRole } from "@/app/api/_utils/auth";

export async function GET(req: NextRequest): Promise<Response> {
  const id = req.nextUrl.pathname.split("/").pop();
  const recruiterId = Number(id);

  if (isNaN(recruiterId)) {
    return NextResponse.json(
      { error: "Invalid recruiter ID" },
      { status: 400 },
    );
  }

  try {
    const recruiter = await prisma.recruiter.findUnique({
      where: { id: recruiterId },
      include: {
        hospital: true,
        recruiterType: true,
      },
    });

    if (!recruiter) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(recruiter);
  } catch (error) {
    console.error("", error);
    return NextResponse.json(
      { error: "Failed to fetch recruiter" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const recruiterId = Number(id);

  if (isNaN(recruiterId)) {
    return NextResponse.json(
      { error: "Invalid recruiter ID" },
      { status: 400 },
    );
  }

  const body = await req.json();

  try {
    const updateRecruiter = await prisma.recruiter.update({
      where: { id: recruiterId },
      data: {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        mobile: body.mobile,
        recruiterTypeId: Number(body.recruiterTypeId),
      },
    });

    return NextResponse.json(updateRecruiter);
  } catch (error) {
    console.error("", error);
    return NextResponse.json(
      { error: "Failed to update recruiter" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const recruiterId = Number(id);

  if (isNaN(recruiterId)) {
    return NextResponse.json(
      { error: "Invalid recruiter ID" },
      { status: 400 },
    );
  }

  try {
    const auth = await getRequestAuth(req);
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!hasAnyRole(auth.roleMetaCode, ["SUPER_ADMIN", "ADMIN"])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await prisma.recruiter.delete({
      where: { id: recruiterId },
    });

    return NextResponse.json({ message: "Recruiter deleted" });
  } catch (error) {
    console.error("Error deleting recruiter:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to delete recruiter: ${error.message}` },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: "Failed to delete recruiter due to an unknown error" },
      { status: 500 },
    );
  }
}
