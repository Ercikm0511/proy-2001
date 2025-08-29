import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsappFab from "@/components/sections/WhatsappFab";
import { useEffect, useMemo, useState } from "react";

const queryClient = new QueryClient();

function applyTheme(mode: "light" | "dark") {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  window.setTimeout(() => root.classList.remove("theme-transition"), 600);
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  localStorage.setItem("theme", mode);
}

const App = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark" | null);
    let initial: "light" | "dark";
    const now = new Date();
    const h = now.getHours();
    if (saved) initial = saved;
    else initial = h >= 6 && h <= 18 ? "light" : "dark";

    setTheme(initial);
    applyTheme(initial);

    const scheduleNext = () => {
      const current = new Date();
      let next = new Date(current);
      if (h >= 6 && h <= 18) {
        // next boundary: 18:01 today
        next.setHours(18, 1, 0, 0);
        if (next <= current) next.setDate(next.getDate() + 1);
      } else {
        // next boundary: 06:00 next day
        next.setHours(6, 0, 0, 0);
        if (next <= current) next.setDate(next.getDate() + 1);
      }
      const ms = next.getTime() - current.getTime();
      return window.setTimeout(() => {
        setTheme((prev) => {
          const nextMode = prev === "light" ? "dark" : "light";
          applyTheme(nextMode);
          return nextMode;
        });
      }, ms);
    };

    const timeout = scheduleNext();
    return () => window.clearTimeout(timeout);
  }, []);

  const toggleTheme = useMemo(
    () => () => {
      setTheme((prev) => {
        const next = prev === "light" ? "dark" : "light";
        applyTheme(next);
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
          <div className="min-h-screen bg-background text-foreground">
            <Header theme={theme} onToggleTheme={toggleTheme} />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <WhatsappFab />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
