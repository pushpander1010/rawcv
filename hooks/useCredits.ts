import { useCallback } from "react";
import { refreshCredits } from "@/lib/credit-utils";

/**
 * Hook to manage credit operations and refresh
 * Provides a function to refresh credits after API calls
 */
export function useCredits() {
  const refresh = useCallback(async () => {
    return await refreshCredits();
  }, []);

  return { refresh };
}
