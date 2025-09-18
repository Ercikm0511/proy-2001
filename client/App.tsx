import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Thanks from "./pages/Thanks";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Tracking from "./pages/Tracking";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsappFab from "@/components/sections/WhatsappFab";
import { useEffect, useMemo, useState } from "react";
import { CartProvider } from "@/state/cart";
import { InventoryProvider } from "@/state/inventory";
import CartPanel from "@/components/cart/CartPanel";
import Store from "./pages/Store";

const queryClient = new QueryClient();

function applyTheme(mode: "light" | "dark") {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  window.setTimeout(() => root.classList.remove("theme-transition"), 600);
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

const App = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
      return;
    }

    const hour = new Date().getHours();
    const mql = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
    const initial: "light" | "dark" =
      mql && typeof mql.matches === "boolean"
        ? mql.matches
          ? "dark"
          : hour >= 6 && hour <= 18
            ? "light"
            : "dark"
        : hour >= 6 && hour <= 18
          ? "light"
          : "dark";

    setTheme(initial);
    applyTheme(initial);

    let timeoutId: number | null = null;
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) return; // manual override exists
      const next = e.matches ? "dark" : "light";
      setTheme(next);
      applyTheme(next);
    };

    if (mql) {
      // @ts-ignore Safari
      mql.addEventListener
        ? mql.addEventListener("change", onChange)
        : mql.addListener(onChange);
    } else {
      const scheduleNext = () => {
        const current = new Date();
        let next = new Date(current);
        const h = current.getHours();
        if (h >= 6 && h <= 18) {
          next.setHours(18, 1, 0, 0);
          if (next <= current) next.setDate(next.getDate() + 1);
        } else {
          next.setHours(6, 0, 0, 0);
          if (next <= current) next.setDate(next.getDate() + 1);
        }
        const ms = next.getTime() - current.getTime();
        timeoutId = window.setTimeout(() => {
          if (localStorage.getItem("theme")) return;
          setTheme((prev) => {
            const nxt = prev === "light" ? "dark" : "light";
            applyTheme(nxt);
            return nxt;
          });
        }, ms);
      };
      scheduleNext();
    }

    return () => {
      if (mql) {
        // @ts-ignore Safari
        mql.removeEventListener
          ? mql.removeEventListener("change", onChange)
          : mql.removeListener(onChange);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  const toggleTheme = useMemo(
    () => () => {
      setTheme((prev) => {
        const next = prev === "light" ? "dark" : "light";
        applyTheme(next);
        localStorage.setItem("theme", next);
        return next;
      });
    },
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartProvider>
            <InventoryProvider>
              <ClientsProvider>
                <DevicesProvider>
                  <RepairsProvider>
                    <SalesProvider>
                      <div className="min-h-screen bg-background text-foreground">
                        <Header theme={theme} onToggleTheme={toggleTheme} />
                        <div className="fixed right-24 top-3 z-50 hidden md:block">
                          <CartPanel />
                        </div>
                        <main>
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/thanks" element={<Thanks />} />
                            <Route path="/tienda" element={<Store />} />
                            <Route path="/seguimiento" element={<Tracking />} />
                            <Route path="/admin-login" element={<AdminLogin />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                        <Footer />
                        <WhatsappFab />
                      </div>
                    </SalesProvider>
                  </RepairsProvider>
                </DevicesProvider>
              </ClientsProvider>
            </InventoryProvider>
          </CartProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const container = document.getElementById("root")!;
const existingRoot = (window as any).__app_root;
if (existingRoot) {
  existingRoot.render(<App />);
} else {
  const root = createRoot(container);
  (window as any).__app_root = root;
  root.render(<App />);
}
