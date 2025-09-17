import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getRequestAuth, isAdminSide } from "@/app/api/_utils/auth";

export async function POST(req: NextRequest) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Require admin-side role (ADMIN or SUPER variants)
    if (!isAdminSide(auth.roleMetaCode)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // Find or create admin role
    let role = await prisma.userRole.findFirst({
      where: { metaCode: { equals: "ADMIN", mode: "insensitive" } },
    });
    if (!role) {
      role = await prisma.userRole.create({
        data: { name: "Admin", metaCode: "ADMIN" },
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        hashedPassword,
        roleId: role.id,
      },
    });

    const newSystemUser = await prisma.systemUser.create({
      data: {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        mobile: body.mobile || "",
        userId: newUser.id,
      },
    });

    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      systemUser: newSystemUser,
    });
  } catch (err) {
    console.error("Error creating admin:", err);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 },
    );
  }
}
