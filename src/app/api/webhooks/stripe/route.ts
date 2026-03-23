import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  console.log("🔥 WEBHOOK HIT");

  const body = await req.text();

  // ✅ FIX 1: headers() is async in your setup
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Signature verification failed:", err);
    return new Response("Webhook error", { status: 400 });
  }

  try {
    switch (event.type) {
      /**
       * ✅ SUBSCRIPTION CREATED
       */
      case "customer.subscription.created": {
        // ✅ DEFINE THIS FIRST
        const subscription = event.data.object as Stripe.Subscription;

        // ✅ THEN use it
        const sub = (await stripe.subscriptions.retrieve(
          subscription.id
        )) as Stripe.Subscription & {
          current_period_end?: number;
        };

        const metadata = sub.metadata || {};

        const userId = metadata.userId;
        const packageId = metadata.packageId;
        const billingCycle = metadata.billingCycle || "monthly";

        const currentPeriodEndUnix =
          sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;

        if (!currentPeriodEndUnix) {
          console.error("❌ Missing current_period_end");
          break;
        }

        const currentPeriodEnd = new Date(currentPeriodEndUnix * 1000);

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeCustomerId: sub.customer as string,
            stripeSubscriptionId: sub.id,
            packageId,
            plan: packageId, // temp fix
            billingCycle,
            status: sub.status,
            currentPeriodEnd,
          },
          create: {
            userId,
            stripeCustomerId: sub.customer as string,
            stripeSubscriptionId: sub.id,
            packageId,
            plan: packageId,
            billingCycle,
            status: sub.status,
            currentPeriodEnd,
          },
        });

        break;
      }

      /**
       * 🔄 SUBSCRIPTION UPDATED
       */
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const sub = (await stripe.subscriptions.retrieve(
          subscription.id
        )) as Stripe.Subscription & {
          current_period_end?: number;
        };

        const metadata = sub.metadata || {};

        const userId = metadata.userId;
        const packageId = metadata.packageId;
        const billingCycle = metadata.billingCycle || "monthly";

        const currentPeriodEndUnix =
          sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;

        if (!currentPeriodEndUnix) {
          console.error("❌ Missing current_period_end");
          break;
        }

        const currentPeriodEnd = new Date(currentPeriodEndUnix * 1000);
        await prisma.subscription.updateMany({
          where: {
            stripeSubscriptionId: sub.id,
          },
          data: {
            status: sub.status,
            currentPeriodEnd,
          },
        });

        break;
      }

      /**
       * ❌ SUBSCRIPTION DELETED
       */
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        await prisma.subscription.updateMany({
          where: {
            stripeSubscriptionId: sub.id,
          },
          data: {
            status: "canceled",
          },
        });

        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return new Response("Webhook failed", { status: 500 });
  }
}
