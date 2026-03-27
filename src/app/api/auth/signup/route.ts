import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { generateVerificationToken } from "@/utils/tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  const { email, password, name, level, sport } = await req.json();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      level,
      sport,
      emailVerified: null,
    },
  });
  const token = generateVerificationToken();

  await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    },
  });

  await sendVerificationEmail(email, token);

  return NextResponse.json({ user });
}
