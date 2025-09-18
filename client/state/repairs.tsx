import React, { createContext, useContext, useEffect, useState } from "react";

export type Repair = {
  id: string;
  clientId?: string;
  device?: string;
  description?: string;
  parts?: string[];
  price?: number;
  status: "pendiente" | "en proceso" | "finalizado";
  receivedAt: string;
  deliveredAt?: string | null;
};

type RepairsContextValue = {
  repairs: Repair[];
  addRepair: (r: Omit<Repair, "id" | "receivedAt" | "status">) => void;
  updateRepair: (id: string, patch: Partial<Omit<Repair, "id" | "receivedAt">>) => void;
  removeRepair: (id: string) => void;
};

const RepairsContext = createContext<RepairsContextValue | null>(null);

export function RepairsProvider({ children }: { children: React.ReactNode }) {
  const [repairs, setRepairs] = useState<Repair[]>(() => {
    try {
      const raw = localStorage.getItem("repairs_data");
      if (raw) return JSON.parse(raw) as Repair[];
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("repairs_data", JSON.stringify(repairs));
    } catch (e) {}
  }, [repairs]);

  const addRepair = (r: Omit<Repair, "id" | "receivedAt" | "status">) => {
    const rep: Repair = {
      ...r,
      id: `r_${Date.now()}`,
      receivedAt: new Date().toISOString(),
      status: "pendiente",
    };
    setRepairs((s) => [rep, ...s]);
  };

  const updateRepair = (id: string, patch: Partial<Omit<Repair, "id" | "receivedAt">>) => {
    setRepairs((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const removeRepair = (id: string) => setRepairs((s) => s.filter((r) => r.id !== id));

  return <RepairsContext.Provider value={{ repairs, addRepair, updateRepair, removeRepair }}>{children}</RepairsContext.Provider>;
}

export function useRepairs() {
  const ctx = useContext(RepairsContext);
  if (!ctx) throw new Error("useRepairs must be used within RepairsProvider");
  return ctx;
}
