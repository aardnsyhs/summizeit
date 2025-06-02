import { createCheckoutSession } from "@/lib/payments/checkout-sessions";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId, userEmail } = await request.json();

    const session = await createCheckoutSession({
      priceId,
      userId,
      userEmail: userEmail || sessionClaims?.email || "",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
