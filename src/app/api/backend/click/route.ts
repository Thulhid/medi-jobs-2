import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface ClickWithVacancy {
  id: number;
  vacancyId: number;
  createdAt: Date;
  vacancy: {
    id: number;
    hospitalId: number | null;
  } | null;
}

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const hospitalId = searchParams.get('hospitalId');

  try {
    let clicks: ClickWithVacancy[] = [];
    
    if (hospitalId) {
     
      clicks = await prisma.clicks.findMany({
        where: {
          vacancy: {
            hospitalId: Number(hospitalId)
          }
        },
        include: {
          vacancy: {
            select: {
              id: true,
              hospitalId: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      clicks = await prisma.clicks.findMany({
        include: {
          vacancy: {
            select: {
              id: true,
              hospitalId: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    return NextResponse.json(clicks);
  } catch (error) {
    console.error("Error fetching clicks:", error);
    return NextResponse.json(
      { error: "Failed to fetch clicks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const vacancyId = Number(body.vacancyId);
    if (!vacancyId || Number.isNaN(vacancyId)) {
      return NextResponse.json(
        { error: "vacancyId is required" },
        { status: 400 },
      );
    }

    const newClick = await prisma.clicks.create({
      data: { vacancyId },
      include: { vacancy: true },
    });

    return NextResponse.json(newClick);
  } catch (error) {
    console.error("Error creating click:", error);
    return NextResponse.json(
      { error: "Failed to insert click" },
      { status: 500 },
    );
  }
}
