"use client";

import { cn, formatCurrency } from "@/lib/utils";
import { ArrowRight, CheckIcon } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { MotionDiv, MotionSection } from "../common/MotionWrapper";
import {
  containerVariants,
  itemVariants,
  listVariants,
} from "@/utils/constants";

type PricingPlan = {
  id: string;
  name: string;
  price: number;
  description: string;
  items: string[];
  paymentLink: string;
  priceId: string;
};

type PricingCardProps = {
  plan: PricingPlan;
  isPro: boolean;
};

const usePaymentRedirect = (paymentLink: string) => {
  const { isSignedIn, isLoaded } = useUser();
  const { redirectToSignIn } = useClerk();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const redirectUrl = sessionStorage.getItem("postLoginRedirect");
      if (redirectUrl) {
        sessionStorage.removeItem("postLoginRedirect");
        window.location.href = redirectUrl;
      }
    }
  }, [isLoaded, isSignedIn]);

  const handlePayment = async () => {
    if (!isSignedIn) {
      sessionStorage.setItem("postLoginRedirect", paymentLink);
      await redirectToSignIn({
        afterSignInUrl: window.location.href,
        afterSignUpUrl: window.location.href,
      });
      return;
    }
    window.location.href = paymentLink;
  };

  return { handlePayment };
};

const PricingCard = ({ plan, isPro }: PricingCardProps) => {
  const { handlePayment } = usePaymentRedirect(plan.paymentLink);

  return (
    <MotionDiv
      variants={listVariants}
      whileHover={{ scale: 1.02 }}
      className="relative w-full max-w-lg hover:scale-105 hover:transition-all duration-300"
    >
      <div
        className={cn(
          "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border-[1px] border-gray-500/20 rounded-2xl",
          isPro && "border-rose-500 gap-5 border-2"
        )}
      >
        <MotionDiv
          variants={listVariants}
          className="flex justify-between items-center gap-4"
        >
          <div>
            <h3 className="text-lg lg:text-xl font-bold capitalize">
              {plan.name}
            </h3>
            <p className="text-base-content/80 mt-2">{plan.description}</p>
          </div>
        </MotionDiv>
        <div className="flex gap-2">
          <p className="text-5xl tracking-tight font-extrabold">
            {formatCurrency(plan.price)}
          </p>
          <div className="flex flex-col justify-end mb-[4px]">
            <span className="text-xs uppercase font-semibold">rupiah</span>
            <span className="text-xs">/month</span>
          </div>
        </div>
        <MotionDiv
          variants={listVariants}
          className="space-y-2.5 leading-relaxed text-base flex-1"
        >
          <ul>
            {plan.items.map((item, idx) => (
              <li
                key={`${plan.id}-feature-${idx}`}
                className="flex items-center gap-2"
              >
                <CheckIcon size={18} className="text-rose-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </MotionDiv>
        <MotionDiv
          variants={listVariants}
          className="space-y-2 flex justify-center w-full"
        >
          <Button
            onClick={handlePayment}
            className={cn(
              "w-full rounded-full flex items-center justify-center gap-2",
              "bg-gradient-to-r from-rose-800 to-rose-500 hover:from-rose-500 hover:to-rose-800",
              "text-white border-2 py-2",
              isPro
                ? "border-rose-900"
                : "border-rose-100 from-rose-400 to-rose-500"
            )}
            aria-label={`Buy ${plan.name} plan`}
          >
            Buy Now <ArrowRight size={18} />
          </Button>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
};

export default function PricingSection({ plans }: { plans: PricingPlan[] }) {
  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden"
      id="pricing"
    >
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <MotionDiv
          variants={itemVariants}
          className="flex items-center justify-center w-full pb-12"
        >
          <h2 className="uppercase font-bold text-xl mb-8 text-rose-500">
            Pricing
          </h2>
        </MotionDiv>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} isPro={plan.id === "pro"} />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
