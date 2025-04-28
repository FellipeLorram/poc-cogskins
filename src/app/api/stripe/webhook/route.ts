import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma-client";
import { createSession, deleteSession } from "@/api/auth/session";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`Webhook signature verification failed. ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const data = event.data;
  const eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // Retrieve session with expanded line_items
        const session = await stripe.checkout.sessions.retrieve(
          (data.object as Stripe.Checkout.Session).id,
          { expand: ["line_items"] }
        );
        const customerId = session.customer as string;
        // Retrieve customer to get email
        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = (customer as Stripe.Customer).email;

        if (!customerEmail) {
          console.error("No user email found in Stripe customer");
          throw new Error("No user email found");
        }

        let user = await prisma.user.findUnique({
          where: { email: customerEmail },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: customerEmail,
              name: (customer as Stripe.Customer).name,
              stripeCustomerId: customerId,
              stripeSubscriptionId: session.subscription as string,
              subscriptionStatus: "active",
              isEarlyAdopter: true,
            },
          });

          await createSession({
            userId: user.id,
          });
        } else {
          user = await prisma.user.update({
            where: { email: customerEmail },
            data: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: session.subscription as string,
              subscriptionStatus: "active",
              isEarlyAdopter: true,
            },
          });

          await createSession({
            userId: user.id,
          });
        }

        break;
      }

      case "customer.subscription.created": {
        const subscription = await stripe.subscriptions.retrieve(
          (data.object as Stripe.Subscription).id
        );
        const customerId = subscription.customer as string;
        const customer = await stripe.customers.retrieve(customerId);
        const customerEmail = (customer as Stripe.Customer).email;

        if (!customerEmail) {
          console.error("No user email found in Stripe customer");
          throw new Error("No user email found");
        }

        // Find user by stripeCustomerId
        const user = await prisma.user.findFirst({
          where: { email: customerEmail },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: subscription.status,
              stripeSubscriptionId: subscription.id,
              stripeCustomerId: customerId,
              isEarlyAdopter: true,
            },
          });

          await createSession({
            userId: user.id,
          });
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = await stripe.subscriptions.retrieve(
          (data.object as Stripe.Subscription).id
        );
        const customerId = subscription.customer as string;

        // Find user by stripeCustomerId
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: subscription.status,
            },
          });

          await createSession({
            userId: user.id,
          });
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = await stripe.subscriptions.retrieve(
          (data.object as Stripe.Subscription).id
        );
        const customerId = subscription.customer as string;

        // Find user by stripeCustomerId
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: "canceled",
              isEarlyAdopter: false,
            },
          });

          await deleteSession();
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
  } catch (e: unknown) {
    const error = e as Error;
    console.error(
      "stripe error: " + error.message + " | EVENT TYPE: " + eventType
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({});
}
