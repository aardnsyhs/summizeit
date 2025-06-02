import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function verifyPayment(sessionId: string): Promise<boolean> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid" && session.status === "complete";
  } catch (error) {
    console.error("Error verifying payment:", error);
    return false;
  }
}
