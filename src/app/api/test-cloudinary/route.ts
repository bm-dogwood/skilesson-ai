import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    console.log({
      cloud: process.env.CLOUDINARY_CLOUD_NAME,
      key: process.env.CLOUDINARY_API_KEY,
      secretLength: process.env.CLOUDINARY_API_SECRET?.length,
    });
    const res = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    );

    return NextResponse.json({ success: true, res });
  } catch (err) {
    console.error("Cloudinary test error:", err);
    return NextResponse.json({ success: false, err });
  }
}
