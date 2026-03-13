export interface MockCard {
  id: string;
  name: string;
  type: "text" | "growth" | "payout";
  updatedAt: string;
}

export interface MockTemplate {
  id: string;
  name: string;
  description: string;
  category: "text" | "growth" | "payout";
  pro: boolean;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const MOCK_RECENT_CARDS: MockCard[] = [
  { id: "1", name: "Q4 Growth Report", type: "growth", updatedAt: "2 hours ago" },
  { id: "2", name: "Stripe Payout", type: "payout", updatedAt: "Yesterday" },
  { id: "3", name: "Launch Day Tweet", type: "text", updatedAt: "3 days ago" },
  { id: "4", name: "MRR Milestone", type: "growth", updatedAt: "5 days ago" },
  { id: "5", name: "Gumroad Revenue", type: "payout", updatedAt: "1 week ago" },
  { id: "6", name: "Weekly Update", type: "text", updatedAt: "1 week ago" },
];

export const MOCK_TEMPLATES: MockTemplate[] = [
  { id: "t1", name: "MRR Growth", description: "Show your monthly recurring revenue growth", category: "growth", pro: false },
  { id: "t2", name: "First Payout", description: "Celebrate your first platform payout", category: "payout", pro: false },
  { id: "t3", name: "Launch Metrics", description: "Share your launch day numbers", category: "text", pro: false },
  { id: "t4", name: "Follower Milestone", description: "Hit a new follower milestone", category: "growth", pro: false },
  { id: "t5", name: "Revenue Recap", description: "Monthly revenue summary card", category: "payout", pro: true },
  { id: "t6", name: "Build in Public", description: "Weekly build-in-public update", category: "text", pro: false },
  { id: "t7", name: "ARR Tracker", description: "Annual recurring revenue chart", category: "growth", pro: true },
  { id: "t8", name: "Multi-Platform", description: "Earnings across platforms", category: "payout", pro: true },
  { id: "t9", name: "Streak Card", description: "Show your shipping streak", category: "text", pro: true },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with build-in-public visuals.",
    features: [
      "Text, Growth & Payout cards",
      "Square & Portrait ratios",
      "Dark & Light themes",
      "PNG export at 2x",
      "10 exports per day",
      "MetricCard watermark",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For serious creators who post metrics regularly.",
    features: [
      "Everything in Free",
      "All 6 aspect ratios",
      "No watermark",
      "Unlimited exports",
      "Custom brand colors",
      "Priority templates",
      "Early access to new cards",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "per month",
    description: "For teams and agencies managing multiple brands.",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Shared brand kits",
      "Team template library",
      "Analytics dashboard",
      "Priority support",
      "Custom domain embeds",
    ],
    cta: "Start Team Trial",
    highlighted: false,
  },
];

export const PRICING_FAQ: FAQItem[] = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal through our payment provider Stripe.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer: "We offer a 7-day free trial for Pro. No credit card required to start. You can upgrade anytime from your settings.",
  },
  {
    question: "Can I switch between plans?",
    answer: "Absolutely. You can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    question: "Do you offer annual billing?",
    answer: "Yes! Annual billing saves you 20%. That's $115/year for Pro ($9.60/mo) and $278/year for Team ($23.20/mo).",
  },
];
