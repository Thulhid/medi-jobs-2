import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "SystemUser ID is required for update" },
        { status: 400 },
      );
    }

    const existingSystemUser = await prisma.systemUser.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingSystemUser) {
      return NextResponse.json(
        { error: "SystemUser not found" },
        { status: 404 },
      );
    }

    if (updateData.userId) {
      const existingUser = await prisma.user.findUnique({
        where: { id: updateData.userId },
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: "User with provided userId does not exist" },
          { status: 400 },
        );
      }

      const systemUserWithUserId = await prisma.systemUser.findUnique({
        where: { userId: updateData.userId },
      });

      if (systemUserWithUserId && systemUserWithUserId.id !== parseInt(id)) {
        return NextResponse.json(
          { error: "SystemUser with this userId already exists" },
          { status: 400 },
        );
      }
    }

    const updatedSystemUser = await prisma.systemUser.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: true,
      },
    });

    return NextResponse.json(updatedSystemUser);
  } catch (error) {
    console.error("Error updating system user:", error);
    return NextResponse.json(
      { error: "Failed to update system user" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "SystemUser ID is required for deletion" },
        { status: 400 },
      );
    }

    await prisma.systemUser.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "SystemUser deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting system user:", error);
    return NextResponse.json(
      { error: "Failed to delete system user" },
      { status: 500 },
    );
  }
}
