import React, { createContext, useContext, useEffect, useState } from "react";

export type Device = {
  id: string;
  brand: string;
  model: string;
  category?: string;
  createdAt: string;
};

type DevicesContextValue = {
  devices: Device[];
  addDevice: (d: Omit<Device, "id" | "createdAt">) => void;
  removeDevice: (id: string) => void;
};

const DevicesContext = createContext<DevicesContextValue | null>(null);

export function DevicesProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(() => {
    try {
      const raw = localStorage.getItem("devices_data");
      if (raw) return JSON.parse(raw) as Device[];
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("devices_data", JSON.stringify(devices));
    } catch (e) {}
  }, [devices]);

  const addDevice = (d: Omit<Device, "id" | "createdAt">) => {
    const dev: Device = { ...d, id: `d_${Date.now()}`, createdAt: new Date().toISOString() };
    setDevices((s) => [dev, ...s]);
  };

  const removeDevice = (id: string) => setDevices((s) => s.filter((x) => x.id !== id));

  return <DevicesContext.Provider value={{ devices, addDevice, removeDevice }}>{children}</DevicesContext.Provider>;
}

export function useDevices() {
  const ctx = useContext(DevicesContext);
  if (!ctx) throw new Error("useDevices must be used within DevicesProvider");
  return ctx;
}
