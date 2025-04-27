"use server";

import Stripe from "stripe";

export async function createCustomerLinkPortal(customerId: string) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}`,
  });

  return session.url;
}
