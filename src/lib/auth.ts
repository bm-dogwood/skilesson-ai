import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireInstructor() {
  const session = await getServerSession(authOptions);

  // Not logged in → go to instructor login
  if (!session) {
    redirect("/instructor/login");
  }

  // Not instructor → block
  if ((session.user as any).role !== "instructor") {
    redirect("/"); // or /dashboard
  }

  return session;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  // Not logged in → send to admin login
  if (!session) {
    redirect("/admin/login"); // or /login
  }

  const role = (session.user as any)?.role;

  // Not admin → block
  if (role !== "admin") {
    redirect("/"); // or /dashboard
  }

  return session;
}
