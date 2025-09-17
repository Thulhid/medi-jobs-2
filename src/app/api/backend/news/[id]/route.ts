import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Get news by ID
export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const newsId = Number(id);

  if (isNaN(newsId)) {
    return NextResponse.json({ error: "Invalid news ID" }, { status: 400 });
  }

  try {
    const news = await prisma.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news", details: (error as Error).message }, { status: 500 });
  }
}

// PUT - Update news by ID
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const newsId = Number(id);

  if (isNaN(newsId)) {
    return NextResponse.json({ error: "Invalid news ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { title, description, image, category } = body;

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (!image) missingFields.push("image");
    if (!category) missingFields.push("category");

    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 });
    }

    const updatedNews = await prisma.news.update({
      where: { id: newsId },
      data: { title, description, image, category },
    });

    return NextResponse.json(updatedNews);
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: "Failed to update news", details: (error as Error).message }, { status: 500 });
  }
}

// DELETE - Delete news by ID
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const newsId = Number(id);

  if (isNaN(newsId)) {
    return NextResponse.json({ error: "Invalid news ID" }, { status: 400 });
  }

  try {
    await prisma.news.delete({
      where: { id: newsId },
    });

    return NextResponse.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ error: "Failed to delete news", details: (error as Error).message }, { status: 500 });
  }
}
