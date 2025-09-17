import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getRequestAuth, hasAnyRole } from "@/app/api/_utils/auth";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const publicParam = (searchParams.get("public") || "").toLowerCase();
  const publicOnly = publicParam === "true" || publicParam === "1" || publicParam === "yes";
  const vacancyOption = searchParams.get("vacancyOption");
  
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
        endDate: { lt: now },
        statusId: { not: closed.id },
      },
      data: {
        statusId: closed.id,
      },
    });
  } catch (err) {
    console.error("Failed to auto-close expired vacancies:", err);
  }

  if (publicOnly) {
    const now = new Date();

    const whereClause: Prisma.VacancyWhereInput = {
      status: {
        name: { equals: "Approved", mode: "insensitive" },
      },
      endDate: {
        gte: now,
      },
    };

    if (vacancyOption) {
      whereClause.vacancyOption = {
        equals: vacancyOption,
        mode: "insensitive"
      };
    }

    const approvedVacancies = await prisma.vacancy.findMany({
      where: whereClause,
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true,
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
          },
        },
        clicks: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(approvedVacancies);
  }

  const vacancies = await prisma.vacancy.findMany({
    orderBy: {
      createdAt: "desc",
    },
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
  return NextResponse.json(vacancies);
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const canPost = hasAnyRole(auth.roleMetaCode, [
      "LEAD_RECRUITER",
      "RECRUITER",
    ]);
    if (!canPost)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();

    let recruiterId = Number(body.recruiterId);
    if (hasAnyRole(auth.roleMetaCode, ["LEAD_RECRUITER", "RECRUITER"])) {
      const recruiter = await prisma.recruiter.findFirst({
        where: { userId: auth.userId },
      });
      if (!recruiter)
        return NextResponse.json(
          { error: "Recruiter profile not found" },
          { status: 400 },
        );
      recruiterId = recruiter.id;
    }

    const requiredStringFields = [
      "banner",
      "city",
      "country",
      "designation",
      "email",
      "readStatus",
      "summary",
    ] as const;

    const missingStrings = requiredStringFields.filter(
      (k) => !String(body[k] ?? "").trim(),
    );

    const numFieldMap = {
      hospitalId: Number(body.hospitalId),
      corporateTitleId: Number(body.corporateTitleId),
      employmentTypeId: Number(body.employmentTypeId),
      noOfPositions: Number(body.noOfPositions),
      sbuId: Number(body.sbuId),
      workPlaceTypeId: Number(body.workPlaceTypeId),
    } as const;

    const invalidNumbers = Object.entries(numFieldMap)
      .filter(([, v]) => Number.isNaN(v) || v <= 0)
      .map(([k]) => k);

    const start = new Date(body.startDate);
    const end = new Date(body.endDate);
    const invalidDates: string[] = [];
    if (isNaN(start.getTime())) invalidDates.push("startDate");
    if (isNaN(end.getTime())) invalidDates.push("endDate");

    if (missingStrings.length || invalidNumbers.length || invalidDates.length) {
      return NextResponse.json(
        {
          error: "Validation error",
          missing: missingStrings,
          invalidNumbers,
          invalidDates,
        },
        { status: 400 },
      );
    }

    let pending = await prisma.status.findFirst({
      where: { name: { equals: "Pending", mode: "insensitive" } },
    });
    if (!pending) {
      pending = await prisma.status.create({
        data: { name: "Pending", metaCode: "PENDING" },
      });
    }

    const newVacancy = await prisma.vacancy.create({
      data: {
        banner: body.banner,
        city: body.city,
        contactPerson: String(body.contactPerson ?? "").trim()
          ? body.contactPerson
          : "",
        country: body.country,
        designation: body.designation,
        email: body.email,
        endDate: new Date(body.endDate),
        noOfPositions: Number(body.noOfPositions),
        portalUrl: String(body.portalUrl ?? "").trim() ? body.portalUrl : null,
        readStatus: body.readStatus,
        startDate: new Date(body.startDate),
        summary: body.summary,
        vacancyOption: String(body.vacancyOption ?? "").trim()
          ? body.vacancyOption
          : null,
        corporateTitle: { connect: { id: Number(body.corporateTitleId) } },
        employmentType: { connect: { id: Number(body.employmentTypeId) } },
        sbu: { connect: { id: Number(body.sbuId) } },
        workPlaceType: { connect: { id: Number(body.workPlaceTypeId) } },
        hospital: { connect: { id: Number(body.hospitalId) } },
        recruiter: { connect: { id: recruiterId } },
        status: { connect: { id: pending.id } },
      },
    });

    return NextResponse.json(newVacancy);
  } catch (err) {
    const anyErr = err as {
      code?: string;
      name?: string;
      message?: string;
      meta?: string;
    };
    const code = anyErr?.code || anyErr?.name;
    const message = anyErr?.message || "Failed to create vacancy";
    const meta = anyErr?.meta || undefined;
    console.error("Database error:", message, code, meta);
    return NextResponse.json({ error: message, code, meta }, { status: 500 });
  }
}