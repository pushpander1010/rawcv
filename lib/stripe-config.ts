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
    priceInr: 49900,
    description: "50 credits - great for a few analyses",
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 150,
    priceInr: 99900,
    description: "150 credits - best value for active job seekers",
  },
  {
    id: "power",
    name: "Power Pack",
    credits: 400,
    priceInr: 199900,
    description: "400 credits - for power users and career coaches",
  },
];
