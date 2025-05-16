import { isDev } from "./helpers";

export const pricingPlans = [
  {
    name: "Basic",
    price: 150000,
    description: "Perfect for occasional use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email support",
    ],
    id: "basic",
    paymentLink: isDev
      ? "https://buy.stripe.com/test_cNi6oJ0sG1phcZO3Zu4AU00"
      : "",
    priceId: isDev ? "price_1RP1eRQ5NxwJsKbPNpQa8zmM" : "",
  },
  {
    name: "Pro",
    price: 320000,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    id: "pro",
    paymentLink: isDev
      ? "https://buy.stripe.com/test_aFacN78Zc8RJ4ti0Ni4AU01"
      : "",
    priceId: isDev ? "price_1RP1gmQ5NxwJsKbPNZ2sTPKN" : "",
  },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 50,
      duration: 0.8,
    },
  },
};

export const buttonVariants = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 10,
  },
};
