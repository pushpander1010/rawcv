import type {
  CreditTransactionType as PrismaTxType,
  User as PrismaUser,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

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
  amount: number;
  description: string;
  stripePaymentIntentId?: string;
  createdAt: string;
}

export const INITIAL_CREDITS = 20;

function normalizeEmail(email: string): string {
  return email.toLowerCase();
}

function toStoredUser(u: PrismaUser): StoredUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    hashedPassword: u.hashedPassword ?? undefined,
    emailVerified: u.emailVerified,
    verificationToken: u.verificationToken ?? undefined,
    creditBalance: u.creditBalance,
  };
}

function prismaTypeToTxType(t: PrismaTxType): TransactionType {
  return t === "purchase" ? "purchase" : "ai_operation";
}

export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const u = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });
  return u ? toStoredUser(u) : null;
}

export async function getUserById(id: string): Promise<StoredUser | null> {
  const u = await prisma.user.findUnique({ where: { id } });
  return u ? toStoredUser(u) : null;
}

export async function getUserByVerificationToken(
  token: string
): Promise<StoredUser | null> {
  const u = await prisma.user.findFirst({
    where: { verificationToken: token },
  });
  return u ? toStoredUser(u) : null;
}

export async function createUser(user: {
  email: string;
  name: string;
  hashedPassword?: string;
  emailVerified: boolean;
  verificationToken?: string;
  creditBalance?: number;
}): Promise<StoredUser> {
  const created = await prisma.user.create({
    data: {
      email: normalizeEmail(user.email),
      name: user.name,
      hashedPassword: user.hashedPassword ?? null,
      emailVerified: user.emailVerified,
      verificationToken: user.verificationToken ?? null,
      creditBalance: user.creditBalance ?? INITIAL_CREDITS,
    },
  });
  return toStoredUser(created);
}

export async function updateUser(
  email: string,
  updates: Partial<StoredUser>
): Promise<void> {
  await prisma.user.update({
    where: { email: normalizeEmail(email) },
    data: {
      ...(updates.name !== undefined ? { name: updates.name } : {}),
      ...(updates.hashedPassword !== undefined
        ? { hashedPassword: updates.hashedPassword ?? null }
        : {}),
      ...(updates.emailVerified !== undefined
        ? { emailVerified: updates.emailVerified }
        : {}),
      ...(updates.verificationToken !== undefined
        ? { verificationToken: updates.verificationToken ?? null }
        : {}),
      ...(updates.creditBalance !== undefined
        ? { creditBalance: updates.creditBalance }
        : {}),
    },
  });
}

/** Returns false if the user has insufficient credits or does not exist. */
export async function deductCredits(
  userId: string,
  amount: number,
  description: string
): Promise<boolean> {
  try {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) return false;
      // Round to avoid float precision issues
      const balance = Math.round(user.creditBalance * 100) / 100;
      if (balance < amount) return false;

      await tx.user.update({
        where: { id: userId },
        data: { creditBalance: Math.round((user.creditBalance - amount) * 100) / 100 },
      });
      await tx.creditTransaction.create({
        data: {
          userId,
          type: "ai_operation",
          amount: -amount,
          description,
        },
      });
      return true;
    });
  } catch {
    return false;
  }
}

/**
 * Apply credits after a successful Stripe payment.
 * Uses `stripeEventId` so the same webhook delivery never credits twice.
 */
export async function addCreditsFromStripePayment(
  stripeEventId: string,
  userId: string,
  amount: number,
  description: string,
  stripePaymentIntentId?: string
): Promise<{ ok: boolean; duplicate: boolean; error?: "user_not_found" }> {
  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.processedStripeEvent.findUnique({
        where: { eventId: stripeEventId },
      });
      if (existing) {
        return { ok: true, duplicate: true };
      }

      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        return { ok: false, duplicate: false, error: "user_not_found" };
      }

      await tx.processedStripeEvent.create({ data: { eventId: stripeEventId } });
      await tx.user.update({
        where: { id: userId },
        data: { creditBalance: user.creditBalance + amount },
      });
      await tx.creditTransaction.create({
        data: {
          userId,
          type: "purchase",
          amount,
          description,
          stripePaymentIntentId: stripePaymentIntentId ?? null,
        },
      });

      return { ok: true, duplicate: false };
    });
  } catch {
    return { ok: false, duplicate: false };
  }
}

export async function getTransactions(userId: string): Promise<CreditTransaction[]> {
  const rows = await prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    type: prismaTypeToTxType(r.type),
    amount: r.amount,
    description: r.description,
    stripePaymentIntentId: r.stripePaymentIntentId ?? undefined,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function setPasswordResetToken(
  email: string,
  token: string,
  expiry: Date
): Promise<void> {
  await prisma.user.update({
    where: { email: normalizeEmail(email) },
    data: { passwordResetToken: token, passwordResetExpiry: expiry },
  });
}

export async function getUserByPasswordResetToken(
  token: string
): Promise<StoredUser | null> {
  const u = await prisma.user.findFirst({
    where: { passwordResetToken: token },
  });
  return u ? toStoredUser(u) : null;
}

/** Single atomic query: find user by token AND check expiry together */
export async function getUserByValidResetToken(
  token: string
): Promise<StoredUser | null> {
  const u = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpiry: { gt: new Date() },
    },
  });
  return u ? toStoredUser(u) : null;
}

export async function clearPasswordResetToken(email: string): Promise<void> {
  await prisma.user.update({
    where: { email: normalizeEmail(email) },
    data: { passwordResetToken: null, passwordResetExpiry: null },
  });
}
