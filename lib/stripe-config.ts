export interface CreditBundle {
  id: string;
  name: string;
  credits: number;
  priceInr: number; // in paise (₹)
  description: string;
}

export const CREDIT_BUNDLES: CreditBundle[] = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 50,
    priceInr: 9900,   // ₹99 in paise
    description: "50 credits - great for a few analyses",
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 250,
    priceInr: 49900,  // ₹499 in paise
    description: "250 credits - best value for active job seekers",
  },
  {
    id: "power",
    name: "Power Pack",
    credits: 500,
    priceInr: 99900,  // ₹999 in paise
    description: "500 credits - for power users and career coaches",
  },
];
