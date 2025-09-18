import React, { createContext, useContext, useEffect, useState } from "react";

export type Sale = {
  id: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  method?: string;
  createdAt: string;
};

type SalesContextValue = {
  sales: Sale[];
  addSale: (s: Omit<Sale, "id" | "createdAt">) => void;
  removeSale: (id: string) => void;
};

const SalesContext = createContext<SalesContextValue | null>(null);

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const raw = localStorage.getItem("sales_data");
      if (raw) return JSON.parse(raw) as Sale[];
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("sales_data", JSON.stringify(sales));
    } catch (e) {}
  }, [sales]);

  const addSale = (s: Omit<Sale, "id" | "createdAt">) => {
    const sale: Sale = { ...s, id: `s_${Date.now()}`, createdAt: new Date().toISOString() };
    setSales((p) => [sale, ...p]);
  };

  const removeSale = (id: string) => setSales((p) => p.filter((x) => x.id !== id));

  return <SalesContext.Provider value={{ sales, addSale, removeSale }}>{children}</SalesContext.Provider>;
}

export function useSales() {
  const ctx = useContext(SalesContext);
  if (!ctx) throw new Error("useSales must be used within SalesProvider");
  return ctx;
}
