import "./global.css";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";

// ---------- Modo Día/Noche Automático ----------
function useDayNightMode() {
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsDay(hour >= 6 && hour < 18);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    setTimeout(() => root.classList.remove("theme-transition"), 600);
    if (isDay) root.classList.remove("dark");
    else root.classList.add("dark");
  }, [isDay]);

  return isDay;
}

// ---------- Datos de tienda ----------
export type Product = { id: number; name: string; price: number };
const products: Product[] = [
  { id: 1, name: "iPhone 15 Pro", price: 6_000_000 },
  { id: 2, name: "Samsung Galaxy S24", price: 4_500_000 },
  { id: 3, name: "Xiaomi Redmi Note 13", price: 1_200_000 },
];

// ---------- Componentes de Tienda ----------
function Tienda({ addToCart }: { addToCart: (p: Product) => void }) {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3">
      {products.map((p) => (
        <div key={p.id} className="rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-800">
          <h3 className="text-lg font-bold">{p.name}</h3>
          <p className="text-gray-500">${p.price.toLocaleString()}</p>
          <button
            onClick={() => addToCart(p)}
            className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Agregar al carrito
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------- Carrito ----------
function Carrito({
  cart,
  removeFromCart,
  clearCart,
}: {
  cart: Product[];
  removeFromCart: (i: number) => void;
  clearCart: () => void;
}) {
  const total = cart.reduce((acc, item) => acc + item.price, 0);
  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <ul>
            {cart.map((item, i) => (
              <li key={`${item.id}-${i}`} className="mb-2 flex items-center justify-between">
                {item.name} - ${item.price.toLocaleString()}
                <button onClick={() => removeFromCart(i)} className="ml-2 text-red-500">
                  X
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-bold">Total: ${total.toLocaleString()}</p>
          <button onClick={clearCart} className="mt-2 rounded-xl bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
            Vaciar carrito
          </button>
          <Link to="/checkout">
            <button className="mt-2 ml-2 rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700">Ir a pagar</button>
          </Link>
        </>
      )}
    </div>
  );
}

// ---------- Checkout con Wompi (via backend seguro) ----------
function Checkout({ cart }: { cart: Product[] }) {
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const pagar = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: cart.map((c) => ({ id: String(c.id), name: c.name, price: c.price, qty: 1 })) }),
    });
    const data = await res.json();
    if (data?.checkoutUrl) window.location.href = data.checkoutUrl as string;
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">Finalizar Compra</h2>
      <p>Total a pagar: ${total.toLocaleString()}</p>
      <button onClick={pagar} className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Pagar con Wompi
      </button>
    </div>
  );
}

// ---------- Confirmación ----------
function Confirmacion() {
  return (
    <div className="p-6 text-center">
      <h2 className="mb-4 text-2xl font-bold">✅ Pago Exitoso</h2>
      <p>Gracias por tu compra en M’E Store.</p>
      <Link to="/tienda">
        <button className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-white">Volver a la tienda</button>
      </Link>
    </div>
  );
}

// ---------- Contacto con Google Maps ----------
function Contacto() {
  return (
    <div className="p-6 text-center">
      <h2 className="mb-4 text-2xl font-bold">📍 Nuestra Ubicación</h2>
      <p>Cra. 81 #43-72, Local 1158 Laureles - Estadio, Medellín, Laureles, Medellín, Antioquia</p>
      <iframe
        src="https://www.google.com/maps?q=Cra.+81+%2343-72,+Local+1158+Laureles+-+Estadio,+Medell%C3%ADn,+Laureles,+Medell%C3%ADn,+Antioquia&output=embed"
        width="100%"
        height={400}
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        title="Ubicación M’E Store"
      />
    </div>
  );
}

// ---------- App Principal ----------
function App() {
  const isDay = useDayNightMode();
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => setCart((c) => [...c, product]);
  const removeFromCart = (i: number) => setCart((c) => c.filter((_, idx) => idx !== i));
  const clearCart = () => setCart([]);

  return (
    <Router>
      <div className={isDay ? "bg-white text-black" : "bg-black text-white"}>
        <header className="flex justify-between p-4 shadow-md">
          <Link to="/tienda" className="text-xl font-bold">
            M’E Store – Tienda
          </Link>
          <nav className="space-x-4">
            <Link to="/carrito">🛒 ({cart.length})</Link>
            <Link to="/contacto">📍 Contacto</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/tienda" replace />} />
          <Route path="/tienda" element={<Tienda addToCart={addToCart} />} />
          <Route path="/carrito" element={<Carrito cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} />} />
          <Route path="/confirmacion" element={<Confirmacion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<Navigate to="/tienda" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
