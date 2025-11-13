"use client";
import { createContext, useContext, useState, useEffect } from "react";

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState("USD");

  useEffect(() => {
    const storedCurrency = localStorage.getItem("currency");
    if (storedCurrency) {
      setCurrencyState(storedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency: string) => {
    localStorage.setItem("currency", newCurrency);
    setCurrencyState(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within a CurrencyProvider");
  return context;
};
