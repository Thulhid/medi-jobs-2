import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const sbuId = Number(id);

  if (isNaN(sbuId)) {
    return NextResponse.json({ error: "Invalid SBU ID" }, { status: 400 });
  }

  try {
    const sbu = await prisma.sbu.findUnique({
      where: { id: sbuId },
      include: {
        hospital: true,
      },
    });

    if (!sbu) {
      return NextResponse.json({ error: "SBU not found" }, { status: 404 });
    }

    return NextResponse.json(sbu);
  } catch (error) {
    console.error("", error);
    return NextResponse.json({ error: "Failed to fetch SBU" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const sbuId = Number(id);

  if (isNaN(sbuId)) {
    return NextResponse.json({ error: "Invalid SBU ID" }, { status: 400 });
  }

  const body = await req.json();

  try {
    const updateSbu = await prisma.sbu.update({
      where: { id: sbuId },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(updateSbu);
  } catch (error) {
    console.error("", error);
    return NextResponse.json(
      { error: "Failed to update SBU" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest): Promise<Response> {
  const id = req.nextUrl.pathname.split("/").pop();
  const sbuId = Number(id);

  if (isNaN(sbuId)) {
    return NextResponse.json({ error: "Invalid SBU ID" }, { status: 400 });
  }

  try {
    await prisma.sbu.delete({
      where: { id: sbuId },
    });

    return NextResponse.json({ message: "SBU deleted" });
  } catch (error) {
    console.error("", error);
    return NextResponse.json(
      { error: "Failed to delete SBU" },
      { status: 500 },
    );
  }
}
