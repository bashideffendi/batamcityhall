"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { convertPrice, type Currency } from "./format";

interface CurrencyCtx {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Format an IDR price-range string into the active currency. */
  fmt: (priceIdr: string) => string;
}

const Ctx = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("IDR");

  useEffect(() => {
    const stored = localStorage.getItem("bb_currency") as Currency | null;
    if (stored && ["IDR", "SGD", "MYR", "USD"].includes(stored)) {
      setCurrencyState(stored);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("bb_currency", c);
  };

  const fmt = (priceIdr: string) => convertPrice(priceIdr, currency);

  return (
    <Ctx.Provider value={{ currency, setCurrency, fmt }}>{children}</Ctx.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
