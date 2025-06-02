"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPayment } from "@/lib/payments/payment-verification";
import { LoadingSpinner } from "@/components/ui/spinner";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyAndRedirect = async () => {
      if (!sessionId) {
        router.push("/pricing");
        return;
      }

      try {
        const isPaymentValid = await verifyPayment(sessionId);

        if (isPaymentValid) {
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          router.push("/payment-failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        router.push("/payment-error");
      }
    };

    verifyAndRedirect();
  }, [sessionId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <LoadingSpinner size="lg" />
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
