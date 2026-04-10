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
    credits: 30,
    priceInr: 9900,   // ₹99 in paise
    description: "30 credits - great for a few analyses",
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 200,
    priceInr: 49900,  // ₹499 in paise
    description: "200 credits - best value for active job seekers",
  },
  {
    id: "power",
    name: "Power Pack",
    credits: 350,
    priceInr: 99900,  // ₹999 in paise
    description: "350 credits - for power users and career coaches",
  },
];
