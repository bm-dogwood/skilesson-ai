import { prisma } from "@/lib/prisma";

// ─── All stats in ONE raw SQL query ──────────────────────────────────────────
export async function getDashboardStats() {
  type StatsRow = {
    total_users: bigint;
    new_users_this_month: bigint;
    new_users_last_month: bigint;
    total_lessons: bigint;
    active_subs: bigint;
    new_subs_this_month: bigint;
    new_subs_last_month: bigint;
    canceled_this_month: bigint;
  };

  const [stats] = await prisma.$queryRaw<StatsRow[]>`
    SELECT
      (SELECT COUNT(*) FROM "User")                                                          AS total_users,
      (SELECT COUNT(*) FROM "User"   WHERE "createdAt" >= DATE_TRUNC('month', NOW()))        AS new_users_this_month,
      (SELECT COUNT(*) FROM "User"   WHERE "createdAt" >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
                                       AND "createdAt" <  DATE_TRUNC('month', NOW()))        AS new_users_last_month,
      (SELECT COUNT(*) FROM "Lesson")                                                        AS total_lessons,
      (SELECT COUNT(*) FROM "Subscription" WHERE status = 'active')                         AS active_subs,
      (SELECT COUNT(*) FROM "Subscription" WHERE "createdAt" >= DATE_TRUNC('month', NOW())) AS new_subs_this_month,
      (SELECT COUNT(*) FROM "Subscription" WHERE "createdAt" >= DATE_TRUNC('month', NOW() - INTERVAL '1 month')
                                             AND "createdAt" <  DATE_TRUNC('month', NOW())) AS new_subs_last_month,
      (SELECT COUNT(*) FROM "Subscription" WHERE status = 'canceled'
                                             AND "updatedAt" >= DATE_TRUNC('month', NOW())) AS canceled_this_month
  `;

  // Revenue — fetch only active subs + their package prices
  const revRows = await prisma.$queryRaw<
    {
      billing_cycle: string;
      price_monthly: number;
      price_yearly: number | null;
    }[]
  >`
    SELECT s."billingCycle" AS billing_cycle, p."priceMonthly" AS price_monthly, p."priceYearly" AS price_yearly
    FROM "Subscription" s
    JOIN "Package" p ON p.id = s."packageId"
    WHERE s.status = 'active'
  `;

  let monthlyRevenue = 0;
  let yearlyRevenue = 0;
  for (const r of revRows) {
    if (r.billing_cycle === "monthly") monthlyRevenue += r.price_monthly || 0;
    if (r.billing_cycle === "annual") yearlyRevenue += r.price_yearly || 0;
  }

  const n = (v: bigint) => Number(v);
  const newUsersThisMonth = n(stats.new_users_this_month);
  const newUsersLastMonth = n(stats.new_users_last_month);
  const newSubsThisMonth = n(stats.new_subs_this_month);
  const newSubsLastMonth = n(stats.new_subs_last_month);

  const userGrowthPct =
    newUsersLastMonth === 0
      ? 100
      : Math.round(
          ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
        );

  const subGrowthPct =
    newSubsLastMonth === 0
      ? 100
      : Math.round(
          ((newSubsThisMonth - newSubsLastMonth) / newSubsLastMonth) * 100
        );

  return {
    totalUsers: n(stats.total_users),
    totalLessons: n(stats.total_lessons),
    activeSubscriptions: n(stats.active_subs),
    monthlyRevenue,
    yearlyRevenue,
    newUsersThisMonth,
    userGrowthPct,
    canceledThisMonth: n(stats.canceled_this_month),
    newSubsThisMonth,
    subGrowthPct,
  };
}

// ─── Recent users ─────────────────────────────────────────────────────────────
export async function getRecentUsers() {
  return prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { subscription: { include: { package: true } } },
  });
}

// ─── Plan distribution — 1 raw query ─────────────────────────────────────────
export async function getPlanDistribution() {
  const rows = await prisma.$queryRaw<{ plan: string; count: bigint }[]>`
    SELECT plan, COUNT(*) AS count
    FROM "Subscription"
    WHERE status = 'active'
    GROUP BY plan
  `;

  const total = rows.reduce((s, r) => s + Number(r.count), 0);
  return rows.map((r) => ({
    plan: r.plan,
    count: Number(r.count),
    pct: total > 0 ? Math.round((Number(r.count) / total) * 100) : 0,
  }));
}

// ─── Revenue by month — 1 raw query ──────────────────────────────────────────
export async function getRevenueByMonth() {
  const rows = await prisma.$queryRaw<{ month: string; value: number }[]>`
    SELECT
      TO_CHAR(DATE_TRUNC('month', s."createdAt"), 'Mon') AS month,
      DATE_TRUNC('month', s."createdAt")                 AS month_start,
      SUM(
        CASE
          WHEN s."billingCycle" = 'annual'  THEN COALESCE(p."priceYearly",  0) / 12.0
          ELSE                                   COALESCE(p."priceMonthly", 0)
        END
      ) AS value
    FROM "Subscription" s
    JOIN "Package" p ON p.id = s."packageId"
    WHERE s."createdAt" >= DATE_TRUNC('month', NOW() - INTERVAL '5 months')
    GROUP BY DATE_TRUNC('month', s."createdAt"), TO_CHAR(DATE_TRUNC('month', s."createdAt"), 'Mon')
    ORDER BY month_start ASC
  `;

  // Build a guaranteed 6-slot array even if some months have no data
  const map = new Map<string, number>();
  for (const r of rows) map.set(r.month, Math.round(Number(r.value)));

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString("default", { month: "short" });
  });

  const results = months.map((month) => ({
    month,
    value: map.get(month) ?? 0,
  }));
  const max = Math.max(...results.map((r) => r.value), 1);
  return results.map((r) => ({ ...r, pct: Math.round((r.value / max) * 100) }));
}

// ─── Signups by day — 1 raw query ────────────────────────────────────────────
export async function getSignupsByDay() {
  const rows = await prisma.$queryRaw<{ date: string; count: bigint }[]>`
    SELECT DATE("createdAt")::text AS date, COUNT(*) AS count
    FROM "User"
    WHERE "createdAt" >= NOW() - INTERVAL '30 days'
    GROUP BY DATE("createdAt")
    ORDER BY DATE("createdAt") ASC
  `;

  const map = new Map(rows.map((r) => [r.date, Number(r.count)]));

  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().split("T")[0];
    return {
      date: d.toLocaleDateString("default", { month: "short", day: "numeric" }),
      count: map.get(key) ?? 0,
    };
  });
}

// ─── Churn by month — 2 raw queries ──────────────────────────────────────────
export async function getChurnByMonth() {
  const [newRows, cancelRows] = await Promise.all([
    prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month, COUNT(*) AS count
      FROM "Subscription"
      WHERE "createdAt" >= DATE_TRUNC('month', NOW() - INTERVAL '5 months')
      GROUP BY DATE_TRUNC('month', "createdAt"), TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon')
    `,
    prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT TO_CHAR(DATE_TRUNC('month', "updatedAt"), 'Mon') AS month, COUNT(*) AS count
      FROM "Subscription"
      WHERE status = 'canceled'
        AND "updatedAt" >= DATE_TRUNC('month', NOW() - INTERVAL '5 months')
      GROUP BY DATE_TRUNC('month', "updatedAt"), TO_CHAR(DATE_TRUNC('month', "updatedAt"), 'Mon')
    `,
  ]);

  const newMap = new Map(newRows.map((r) => [r.month, Number(r.count)]));
  const cancelMap = new Map(cancelRows.map((r) => [r.month, Number(r.count)]));

  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleString("default", { month: "short" });
    return {
      month,
      newSubs: newMap.get(month) ?? 0,
      canceled: cancelMap.get(month) ?? 0,
    };
  });
}
