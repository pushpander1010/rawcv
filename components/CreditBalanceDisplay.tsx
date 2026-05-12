"use client";

import { useEffect, useState } from "react";

export default function CreditBalanceDisplay() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("/api/credits");
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balance);
        }
      } catch (err) {
        console.error("Failed to fetch credits:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();

    // Set up interval to refresh credits every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  // Listen for custom credit update events
  useEffect(() => {
    const handleCreditUpdate = (event: CustomEvent) => {
      setBalance(event.detail.newBalance);
    };

    window.addEventListener("creditUpdated", handleCreditUpdate as EventListener);
    return () => window.removeEventListener("creditUpdated", handleCreditUpdate as EventListener);
  }, []);

  if (loading) {
    return <span className="text-sm font-medium text-violet-700 dark:text-violet-300 animate-pulse">--</span>;
  }

  if (balance === null) {
    return <span className="text-sm font-medium text-violet-700 dark:text-violet-300">--</span>;
  }

  const isLow = balance <= 5;

  return (
    <span className={`text-sm font-bold ${isLow ? "text-red-600 dark:text-red-400" : "text-violet-700 dark:text-violet-300"}`}>
      {balance}
      {isLow && <span className="text-xs ml-1">⚠️</span>}
    </span>
  );
}
