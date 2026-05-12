/**
 * Utility functions for credit management
 */

/**
 * Dispatch a custom event to notify components that credits have been updated
 * This allows all credit-related components to update in real-time
 */
export function dispatchCreditUpdate(newBalance: number) {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("creditUpdated", {
      detail: { newBalance },
    });
    window.dispatchEvent(event);
  }
}

/**
 * Refresh credits from the API and dispatch update event
 */
export async function refreshCredits() {
  try {
    const res = await fetch("/api/credits");
    if (res.ok) {
      const data = await res.json();
      dispatchCreditUpdate(data.balance);
      return data.balance;
    }
  } catch (err) {
    console.error("Failed to refresh credits:", err);
  }
  return null;
}

/**
 * Format credit amount for display
 */
export function formatCredits(amount: number): string {
  return `${amount} credit${amount !== 1 ? "s" : ""}`;
}

/**
 * Get credit status (low, medium, high)
 */
export function getCreditStatus(balance: number): "low" | "medium" | "high" {
  if (balance <= 5) return "low";
  if (balance <= 20) return "medium";
  return "high";
}
