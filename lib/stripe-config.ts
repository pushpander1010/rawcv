export interface CreditBundle {
  id: string;
  name: string;
  credits: number;
  priceUsd: number; // in cents
  description: string;
}

export const CREDIT_BUNDLES: CreditBundle[] = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 50,
    priceUsd: 499,
    description: "50 credits - great for a few analyses",
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 150,
    priceUsd: 999,
    description: "150 credits - best value for active job seekers",
  },
  {
    id: "power",
    name: "Power Pack",
    credits: 400,
    priceUsd: 1999,
    description: "400 credits - for power users and career coaches",
  },
];
