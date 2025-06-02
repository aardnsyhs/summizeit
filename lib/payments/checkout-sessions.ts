import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

interface CreateCheckoutSessionParams {
  priceId: string;
  userId: string;
  userEmail?: string;
}

export async function createCheckoutSession({
  priceId,
  userId,
  userEmail,
}: CreateCheckoutSessionParams) {
  try {
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_BASE_URL;
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    return session;
  } catch (err) {
    console.error("Error creating checkout session:", err);
    throw err;
  }
}
