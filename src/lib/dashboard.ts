import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [totalUsers, totalLessons, activeSubscriptions, subscriptions] =
    await Promise.all([
      prisma.user.count(),
      prisma.lesson.count(),
      prisma.subscription.count({
        where: { status: "active" },
      }),
      prisma.subscription.findMany({
        where: { status: "active" },
        include: {
          package: true, // ✅ IMPORTANT
        },
      }),
    ]);

  // 💰 REAL revenue calculation
  let monthlyRevenue = 0;
  let yearlyRevenue = 0;

  for (const sub of subscriptions) {
    if (!sub.package) continue;

    if (sub.billingCycle === "monthly") {
      monthlyRevenue += sub.package.priceMonthly || 0;
    }

    if (sub.billingCycle === "annual") {
      yearlyRevenue += sub.package.priceYearly || 0;
    }
  }

  return {
    totalUsers,
    totalLessons,
    activeSubscriptions,
    monthlyRevenue,
    yearlyRevenue,
  };
}

export async function getRecentUsers() {
  return prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      subscription: true,
    },
  });
}

export async function getPlanDistribution() {
  const plans = await prisma.subscription.groupBy({
    by: ["plan"],
    _count: true,
  });

  return plans;
}

export async function getRevenueByMonth() {
  const subs = await prisma.subscription.findMany({
    where: { status: "active" },
    include: { package: true },
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  // simple mock grouping (you can refine later)
  return months.map((m, i) => ({
    month: m,
    value: 40 + i * 10,
  }));
}
