import React, { createContext, useContext, useEffect, useState } from "react";

export type Client = {
  id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
};

type ClientsContextValue = {
  clients: Client[];
  addClient: (c: Omit<Client, "id" | "createdAt">) => void;
  updateClient: (id: string, patch: Partial<Omit<Client, "id" | "createdAt">>) => void;
  removeClient: (id: string) => void;
};

const ClientsContext = createContext<ClientsContextValue | null>(null);

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const raw = localStorage.getItem("clients_data");
      if (raw) return JSON.parse(raw) as Client[];
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("clients_data", JSON.stringify(clients));
    } catch (e) {}
  }, [clients]);

  const addClient = (c: Omit<Client, "id" | "createdAt">) => {
    const client: Client = { ...c, id: `c_${Date.now()}`, createdAt: new Date().toISOString() };
    setClients((s) => [client, ...s]);
  };

  const updateClient = (id: string, patch: Partial<Omit<Client, "id" | "createdAt">>) => {
    setClients((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const removeClient = (id: string) => setClients((s) => s.filter((c) => c.id !== id));

  return (
    <ClientsContext.Provider value={{ clients, addClient, updateClient, removeClient }}>{children}</ClientsContext.Provider>
  );
}

export function useClients() {
  const ctx = useContext(ClientsContext);
  if (!ctx) throw new Error("useClients must be used within ClientsProvider");
  return ctx;
}
