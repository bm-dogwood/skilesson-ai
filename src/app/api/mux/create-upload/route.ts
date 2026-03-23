import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Mux from "@mux/mux-node";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { title, description, level, sport, packageId } = await req.json();

    // 🎬 Create upload on Mux
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
      },
      cors_origin: "*",
    });

    // 💾 Save lesson
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        level,
        sport,
        packageId,
        uploadId: upload.id,
        userId: user.id,
        duration: 0,
      },
    });
    const lessonId = crypto.randomUUID();
    return NextResponse.json({
      uploadUrl: upload.url,
      lessonId,
    });
  } catch (err) {
    console.error("MUX CREATE UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create upload" },
      { status: 500 }
    );
  }
}
