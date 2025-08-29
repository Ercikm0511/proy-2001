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
    if (saved) initial = saved;
    else {
      const h = new Date().getHours();
      initial = h >= 6 && h <= 18 ? "light" : "dark";
    }
    setTheme(initial);
    applyTheme(initial);
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
