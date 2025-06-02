import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

type WebhookHandler = (event: Stripe.Event) => Promise<void>;

export const handleCheckoutSessionCompleted: WebhookHandler = async (event) => {
  const session = event.data.object as Stripe.Checkout.Session;

  try {
    const expandedSession = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["line_items", "customer"],
      }
    );

    console.log("Payment succeeded for session:", expandedSession.id);
  } catch (err) {
    console.error("Error handling checkout session:", err);
    throw err;
  }
};

export const handleSubscriptionDeleted: WebhookHandler = async (event) => {
  const subscription = event.data.object as Stripe.Subscription;

  try {
    console.log("Subscription canceled:", subscription.id);
  } catch (err) {
    console.error("Error handling subscription deletion:", err);
    throw err;
  }
};
