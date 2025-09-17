import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - List all news
export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST - Create a new news item
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("POST body received:", body);

    const { title, description, image, category } = body;

    // Validate required fields
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (!image) missingFields.push("image");
    if (!category) missingFields.push("category");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const news = await prisma.news.create({
      data: { title, description, image, category },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news", details: (error as Error).message },
      { status: 500 }
    );
  }
}
