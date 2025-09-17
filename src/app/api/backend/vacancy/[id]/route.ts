import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  getRequestAuth,
  hasAnyRole,
  isAdminSide,
  isLeadRecruiter as isLeadFn,
} from "@/app/api/_utils/auth";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const vacancyId = Number(id);

  if (isNaN(vacancyId)) {
    return NextResponse.json({ error: "Invalid vacancy ID" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const publicOnly = searchParams.get("public") === "true";

  try {
    if (publicOnly) {
      
      const vacancy = await prisma.vacancy.findUnique({
        where: { id: vacancyId },
        include: {
          hospital: {
            select: {
              id: true,
              name: true,
              logo: true,
              description: true,
              activeStatus: true, 
            },
          },
          corporateTitle: {
            select: {
              id: true,
              name: true,
            },
          },
          employmentType: {
            select: {
              id: true,
              name: true,
            },
          },
          sbu: {
            select: {
              id: true,
              name: true,
            },
          },
          workPlaceType: {
            select: {
              id: true,
              name: true,
            },
          },
          status: {
            select: {
              id: true,
              name: true,
              metaCode: true,
            },
          },
          clicks: {
            select: {
              id: true,
              createdAt: true,
            },
          },
        },
      });

      if (!vacancy) {
        return NextResponse.json(
          { error: "Vacancy not found" },
          { status: 404 },
        );
      }

      // Check if vacancy is approved (by name or metaCode)
      const statusName = String(vacancy.status.name || "").toLowerCase();
      const statusMeta = String(
        (vacancy.status as { metaCode?: string })?.metaCode || "",
      ).toUpperCase();
      const isApproved = statusName === "approved" || statusMeta === "APPROVED";
      if (!isApproved) {
        return NextResponse.json(
          { error: "Vacancy not available" },
          { status: 404 },
        );
      }

      const isExpired = vacancy.endDate ? new Date(vacancy.endDate) < new Date() : false;
      return NextResponse.json({ ...vacancy, isExpired });
    }

    try {
      const now = new Date();
      let closed = await prisma.status.findFirst({
        where: { name: { equals: "Closed", mode: "insensitive" } },
      });
      if (!closed) {
        closed = await prisma.status.create({
          data: { name: "Closed", metaCode: "CLOSED" },
        });
      }
      await prisma.vacancy.updateMany({
        where: {
          id: vacancyId,
          endDate: { lt: now },
          statusId: { not: closed.id },
        },
        data: { statusId: closed.id },
      });
    } catch (err) {
      console.error("Failed to auto-close vacancy:", err);
    }

    const vacancy = await prisma.vacancy.findUnique({
      where: { id: vacancyId },
      include: {
        hospital: true,
        corporateTitle: true,
        employmentType: true,
        recruiter: true,
        sbu: true,
        status: true,
        workPlaceType: true,
        clicks: true,
      },
    });

    if (!vacancy) {
      return NextResponse.json({ error: "Vacancy not found" }, { status: 404 });
    }

    // Compute expiry / invalid-date flags to help clients
    const now = new Date();
    const start = vacancy.startDate ? new Date(vacancy.startDate) : null;
    const end = vacancy.endDate ? new Date(vacancy.endDate) : null;
    const isExpired = end ? end < now : false;
    const isDateInvalid = start && end ? end < start : false;

    return NextResponse.json({ ...vacancy, isExpired, isDateInvalid });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch vacancy" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const vacancyId = Number(id);

  if (isNaN(vacancyId)) {
    return NextResponse.json({ error: "Invalid vacancy ID" }, { status: 400 });
  }

  const body = await req.json();

  try {
    const auth = await getRequestAuth(req);
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const isAdmin = isAdminSide(auth.roleMetaCode);
    const isRecruiterSide = hasAnyRole(auth.roleMetaCode, [
      "LEAD_RECRUITER",
      "RECRUITER",
    ]);
    const isLeadRecruiter = isLeadFn(auth.roleMetaCode);

    if (isRecruiterSide) {
      if (isLeadRecruiter) {
        // Allow lead recruiter to edit vacancies within their hospital
        const lead = await prisma.recruiter.findFirst({
          where: { userId: auth.userId },
          select: { hospitalId: true },
        });
        const v = await prisma.vacancy.findUnique({
          where: { id: vacancyId },
          select: { hospitalId: true },
        });
        if (!lead || !v || String(lead.hospitalId) !== String(v.hospitalId)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      } else {
        const v = await prisma.vacancy.findUnique({
          where: { id: vacancyId },
          select: { recruiter: { select: { userId: true } } },
        });
        if (!v || v.recruiter?.userId !== auth.userId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }

    // Prevent non-admin edits if vacancy is expired or has invalid dates
    const existing = await prisma.vacancy.findUnique({
      where: { id: vacancyId },
      select: { startDate: true, endDate: true },
    });
    if (existing) {
      const now = new Date();
      const start = existing.startDate ? new Date(existing.startDate) : null;
      const end = existing.endDate ? new Date(existing.endDate) : null;
      const isExpired = end ? end < now : false;
      const isDateInvalid = start && end ? end < start : false;
      if ((isExpired || isDateInvalid) && !isAdmin) {
        return NextResponse.json(
          { error: "Cannot edit expired or invalid-dated vacancy" },
          { status: 409 },
        );
      }
    }

    // Build partial update data from provided fields only
    const data: Record<string, unknown> = {};
    if ("banner" in body) data.banner = body.banner ?? null;
    if ("city" in body) data.city = body.city;
    if ("contactPerson" in body) data.contactPerson = body.contactPerson;
    if (
      "corporateTitleId" in body &&
      String(body.corporateTitleId).trim() !== ""
    ) {
      const n = Number(body.corporateTitleId);
      if (!Number.isNaN(n)) data.corporateTitleId = n;
    }
    if ("country" in body) data.country = body.country;
    if ("email" in body) data.email = body.email;
    if ("designation" in body) data.designation = body.designation;
    if (
      "employmentTypeId" in body &&
      String(body.employmentTypeId).trim() !== ""
    ) {
      const n = Number(body.employmentTypeId);
      if (!Number.isNaN(n)) data.employmentTypeId = n;
    }
    if ("endDate" in body)
      data.endDate = body.endDate ? new Date(body.endDate as string) : null;
    // Only admins can change hospitalId; recruiters cannot move vacancies across hospitals
    if ("hospitalId" in body && String(body.hospitalId).trim() !== "") {
      if (!isAdmin) {
        return NextResponse.json(
          { error: "Only admin can change hospital" },
          { status: 403 },
        );
      }
      const n = Number(body.hospitalId);
      if (!Number.isNaN(n)) data.hospitalId = n;
    }
    if ("noOfPositions" in body && String(body.noOfPositions).trim() !== "") {
      const n = Number(body.noOfPositions);
      if (!Number.isNaN(n)) data.noOfPositions = n;
    }
    if ("portalUrl" in body) data.portalUrl = body.portalUrl;
    if ("readStatus" in body) data.readStatus = body.readStatus;
    // Change recruiter binding
    if ("recruiterId" in body) {
      const requestedId = String(body.recruiterId).trim();
      if (!requestedId) {
        // ignore empty
      } else {
        const n = Number(requestedId);
        if (Number.isNaN(n)) {
          return NextResponse.json(
            { error: "Invalid recruiterId" },
            { status: 400 },
          );
        }
        if (isAdmin) {
          data.recruiterId = n;
        } else if (isLeadRecruiter) {
          // Lead recruiter can reassign within their hospital only
          const [lead, vacancy, newRec] = await Promise.all([
            prisma.recruiter.findFirst({
              where: { userId: auth.userId },
              select: { hospitalId: true },
            }),
            prisma.vacancy.findUnique({
              where: { id: vacancyId },
              select: { hospitalId: true },
            }),
            prisma.recruiter.findUnique({
              where: { id: n },
              select: { hospitalId: true },
            }),
          ]);
          if (!lead || !vacancy || !newRec) {
            return NextResponse.json(
              { error: "Invalid assignment context" },
              { status: 400 },
            );
          }
          if (
            String(lead.hospitalId) !== String(vacancy.hospitalId) ||
            String(newRec.hospitalId) !== String(vacancy.hospitalId)
          ) {
            return NextResponse.json(
              { error: "Lead recruiter can assign within own hospital only" },
              { status: 403 },
            );
          }
          data.recruiterId = n;
        } else {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }
    if ("sbuId" in body && String(body.sbuId).trim() !== "") {
      const n = Number(body.sbuId);
      if (!Number.isNaN(n)) data.sbuId = n;
    }
    if ("startDate" in body)
      data.startDate = body.startDate
        ? new Date(body.startDate as string)
        : null;
    // Only Admin/Super Admin can change status
    if ("statusId" in body) {
      if (!isAdmin) {
        return NextResponse.json(
          { error: "Only admin can change status" },
          { status: 403 },
        );
      }
      if (String(body.statusId).trim() !== "") {
        const n = Number(body.statusId);
        if (!Number.isNaN(n)) {
          data.statusId = n;
          // If status is moved to Approved or Rejected, surface as a new notification for recruiter
          try {
            const status = await prisma.status.findUnique({ where: { id: n } });
            const statusName = String(status?.name || "").toLowerCase();
            const statusMeta = String(
              (status as { metaCode?: string })?.metaCode || "",
            ).toUpperCase();
            if (
              statusName === "rejected" ||
              statusName === "approved" ||
              statusMeta === "REJECTED" ||
              statusMeta === "APPROVED"
            ) {
              data.readStatus = "New";
            }
          } catch {}
        }
      }
    }
    if ("summary" in body) data.summary = body.summary;
    if ("rejectionReason" in body)
      data.rejectionReason = body.rejectionReason ?? null;
    if ("vacancyOption" in body) data.vacancyOption = body.vacancyOption;
    if ("workPlaceTypeId" in body)
      data.workPlaceTypeId = Number(body.workPlaceTypeId);

    const updateVacancy = await prisma.vacancy.update({
      where: { id: vacancyId },
      data,
    });

    return NextResponse.json(updateVacancy);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update vacancy";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const vacancyId = Number(id);

  if (isNaN(vacancyId)) {
    return NextResponse.json({ error: "Invalid vacancy ID" }, { status: 400 });
  }

  try {
    const auth = await getRequestAuth(req);
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isRecruiterSide = hasAnyRole(auth.roleMetaCode, [
      "LEAD_RECRUITER",
      "RECRUITER",
    ]);
    const isLeadRecruiter = isLeadFn(auth.roleMetaCode);

    if (isRecruiterSide) {
      if (isLeadRecruiter) {
        const lead = await prisma.recruiter.findFirst({
          where: { userId: auth.userId },
          select: { hospitalId: true },
        });
        const v = await prisma.vacancy.findUnique({
          where: { id: vacancyId },
          select: { hospitalId: true },
        });
        if (!lead || !v || String(lead.hospitalId) !== String(v.hospitalId)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      } else {
        const v = await prisma.vacancy.findUnique({
          where: { id: vacancyId },
          select: { recruiter: { select: { userId: true } } },
        });
        if (!v || v.recruiter?.userId !== auth.userId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }

    await prisma.vacancy.delete({
      where: { id: vacancyId },
    });

    return NextResponse.json({ message: "Vacancy deleted" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to delete vacancy" },
      { status: 500 },
    );
    console.log("", error);
  }
}
