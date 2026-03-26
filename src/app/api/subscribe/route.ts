import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { userId, userEmail, packageId, billingCycle, trialEnabled } = body;

    // ✅ Validate
    if (!userId || !packageId || !userEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "userId, userEmail and packageId are required.",
        },
        { status: 400 }
      );
    }

    const cycle = billingCycle || "monthly";

    // ✅ Fetch package from DB
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    // ✅ Get Stripe priceId dynamically
    const priceId =
      cycle === "annual" ? pkg.stripePriceIdYearly : pkg.stripePriceIdMonthly;

    if (!priceId) {
      return NextResponse.json(
        { success: false, error: "Stripe price not configured" },
        { status: 400 }
      );
    }

    // ✅ Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId,
          packageId,
          billingCycle: cycle,
        },
        trial_period_days: trialEnabled ? 7 : undefined,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    });
    console.log(userEmail);
    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (err) {
    console.error("❌ Subscribe error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
