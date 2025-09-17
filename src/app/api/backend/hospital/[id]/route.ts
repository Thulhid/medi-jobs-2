import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const hospitalId = Number(id);

  if (isNaN(hospitalId)) {
    return NextResponse.json({ error: "Invalid Hospital ID" }, { status: 400 });
  }

  try {
    const hospital = await prisma.hospital.findUnique({
      where: { 
        id: hospitalId
      },
      include: {
        vacancy: true,
      },
    });

    if (!hospital) {
      return NextResponse.json(
        { error: "Hospital not found or not available" },
        { status: 404 },
      );
    }

    return NextResponse.json(hospital);
  } catch (error) {
    console.error("", error);
    return NextResponse.json(
      { error: "Failed to fetch hospital" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const hospitalId = Number(id);

  if (isNaN(hospitalId)) {
    return NextResponse.json({ error: "Invalid hospital ID" }, { status: 400 });
  }

  const body = await req.json();

  try {
    const payload: {name:string,email:string,logo:string,banner:string,description:string,city:string,updatedAt:string} = {
      name: body.name,
      email: body.email,
      logo: body.logo,
      banner: body.banner,
      description: body.description,
      city: body.city ?? null,
      updatedAt: body.updatedAt,
    };

    const updatehospital = await prisma.hospital.update({
      where: { id: hospitalId },
      data: payload,
    });

    return NextResponse.json(updatehospital);
  } catch (error) {
    console.error("", error);
    return NextResponse.json(
      { error: "Failed to update hospital" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const hospitalId = Number(id);

  if (isNaN(hospitalId)) {
    return NextResponse.json({ error: "Invalid hospital ID" }, { status: 400 });
  }

  try {
    await prisma.hospital.delete({
      where: { id: hospitalId },
    });

    return NextResponse.json({ message: "hospital deleted" });
  } catch (error) {
    console.error("", error);
    return NextResponse.json(
      { error: "Failed to delete hospital" },
      { status: 500 },
    );
  }
}
