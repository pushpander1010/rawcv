// In-memory user store (stateless per design — no persistent DB)
// In production this would be replaced with a real database.

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  hashedPassword?: string;
  emailVerified: boolean;
  verificationToken?: string;
  creditBalance: number;
}

export type TransactionType = "purchase" | "ai_operation";

export interface CreditTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;          // positive = credit added, negative = credit deducted
  description: string;     // e.g. "ATS analysis" or "Starter Pack (100 credits)"
  stripePaymentIntentId?: string;
  createdAt: string;       // ISO timestamp
}

// Module-level maps persist across requests within the same serverless instance
const users = new Map<string, StoredUser>();
const transactions = new Map<string, CreditTransaction[]>(); // keyed by userId

const INITIAL_CREDITS = 10; // free credits on sign-up

export function getUserByEmail(email: string): StoredUser | undefined {
  return users.get(email.toLowerCase());
}

export function getUserById(id: string): StoredUser | undefined {
  for (const user of Array.from(users.values())) {
    if (user.id === id) return user;
  }
  return undefined;
}

export function getUserByVerificationToken(token: string): StoredUser | undefined {
  for (const user of Array.from(users.values())) {
    if (user.verificationToken === token) return user;
  }
  return undefined;
}

export function createUser(user: Omit<StoredUser, "creditBalance"> & { creditBalance?: number }): void {
  const stored: StoredUser = { ...user, creditBalance: user.creditBalance ?? INITIAL_CREDITS };
  users.set(user.email.toLowerCase(), stored);
}

export function updateUser(email: string, updates: Partial<StoredUser>): void {
  const existing = users.get(email.toLowerCase());
  if (existing) {
    users.set(email.toLowerCase(), { ...existing, ...updates });
  }
}

// ─── Credit operations ────────────────────────────────────────────────────────

/** Returns false if the user has insufficient credits. */
export function deductCredits(
  userId: string,
  amount: number,
  description: string
): boolean {
  const user = getUserById(userId);
  if (!user) return false;
  if (user.creditBalance < amount) return false;

  updateUser(user.email, { creditBalance: user.creditBalance - amount });
  addTransaction(userId, {
    type: "ai_operation",
    amount: -amount,
    description,
  });
  return true;
}

export function addCredits(
  userId: string,
  amount: number,
  description: string,
  stripePaymentIntentId?: string
): void {
  const user = getUserById(userId);
  if (!user) return;

  updateUser(user.email, { creditBalance: user.creditBalance + amount });
  addTransaction(userId, {
    type: "purchase",
    amount,
    description,
    stripePaymentIntentId,
  });
}

function addTransaction(
  userId: string,
  tx: Omit<CreditTransaction, "id" | "userId" | "createdAt">
): void {
  const list = transactions.get(userId) ?? [];
  list.unshift({
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
    ...tx,
  });
  transactions.set(userId, list);
}

export function getTransactions(userId: string): CreditTransaction[] {
  return transactions.get(userId) ?? [];
}
