import React, { createContext, useContext, useEffect, useState } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: "móviles" | "accesorios";
  image: string;
  stock: number;
};

type InventoryContextValue = {
  products: Product[];
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, patch: Partial<Omit<Product, "id">>) => void;
  updateStock: (id: string, qty: number) => void;
  decrementStock: (id: string, by?: number) => void;
  removeProduct: (id: string) => void;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

const SEED_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "iPhone 13 Pro",
    price: 16999,
    category: "móviles",
    image: "https://images.unsplash.com/photo-1631380739856-c5b32b67fb7f?q=80&w=1200&auto=format&fit=crop",
    stock: 5,
  },
  {
    id: "p2",
    name: "Samsung Galaxy S23",
    price: 15999,
    category: "móviles",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1200&auto=format&fit=crop",
    stock: 3,
  },
  {
    id: "p3",
    name: "Cargador 20W USB‑C",
    price: 499,
    category: "accesorios",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=1200&auto=format&fit=crop",
    stock: 12,
  },
  {
    id: "p4",
    name: "Cable Lightning trenzado",
    price: 349,
    category: "accesorios",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1200&auto=format&fit=crop",
    stock: 8,
  },
  {
    id: "p7",
    name: "Case MagSafe",
    price: 699,
    category: "accesorios",
    image: "https://images.unsplash.com/photo-1601435119439-c1f5f950b35e?q=80&w=1200&auto=format&fit=crop",
    stock: 6,
  },
  {
    id: "p8",
    name: "Pixel 8 Pro",
    price: 17499,
    category: "móviles",
    image: "https://images.unsplash.com/photo-1603808033070-24bb34d4a703?q=80&w=1200&auto=format&fit=crop",
    stock: 4,
  },
];

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem("inventory_products");
      if (raw) return JSON.parse(raw) as Product[];
    } catch (e) {}
    return SEED_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("inventory_products", JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  const addProduct = (p: Omit<Product, "id">) => {
    const prod: Product = { ...p, id: `p_${Date.now()}` };
    setProducts((s) => [prod, ...s]);
  };

  const updateStock = (id: string, qty: number) => {
    setProducts((s) => s.map((x) => (x.id === id ? { ...x, stock: qty } : x)));
  };

  const decrementStock = (id: string, by = 1) => {
    setProducts((s) =>
      s.map((x) => (x.id === id ? { ...x, stock: Math.max(0, x.stock - by) } : x)),
    );
  };

  const removeProduct = (id: string) => setProducts((s) => s.filter((p) => p.id !== id));

  return (
    <InventoryContext.Provider value={{ products, addProduct, updateStock, decrementStock, removeProduct }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
