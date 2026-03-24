import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "instructor") {
    return NextResponse.json({ success: false }, { status: 403 });
  }

  const { submissionId, feedback } = await req.json();

  const updated = await prisma.aISubmission.update({
    where: { id: submissionId },
    data: {
      instructorFeedback: feedback,
      status: "reviewed",
    },
  });

  return NextResponse.json({ success: true, data: updated });
}
