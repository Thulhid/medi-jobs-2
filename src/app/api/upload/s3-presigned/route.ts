import { NextRequest, NextResponse } from "next/server";
import { S3 } from "aws-sdk";

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType, folder } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "Missing fileName or fileType" }, { status: 400 });
    }

    // Use server-only env variables
    const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
    const region = process.env.NEXT_PUBLIC_AWS_REGION;
    const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

    if (!accessKeyId || !secretAccessKey || !region || !bucket) {
      return NextResponse.json(
        { error: "S3 is not configured properly" },
        { status: 500 },
      );
    }

    const s3 = new S3({ accessKeyId, secretAccessKey, region });

    const folderPath = folder ? `${folder}/` : "uploads/";
    const key = `${folderPath}${Date.now()}-${fileName}`;

    const uploadUrl = await s3.getSignedUrlPromise("putObject", {
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
      Expires: 300, // 5 minutes
    });

    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return NextResponse.json({ presignedUrl: uploadUrl, fileUrl, key });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
