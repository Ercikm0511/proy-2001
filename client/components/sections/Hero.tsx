import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-white dark:from-black dark:to-black" />

      <div>
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="relative w-1/2 max-md:w-full">
            <div className="pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[50rem] w-[50rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>
          <div className="w-1/2 max-md:w-full" />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 md:flex-row md:gap-16 md:px-6">
        <div className="max-w-2xl text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight md:text-6xl"
          >
            Reparamos, renovamos y conectamos tu mundo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground md:text-xl"
          >
            Servicio técnico premium, dispositivos certificados y accesorios que
            elevan tu experiencia.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button size="lg" className="shine-on-hover btn-glow" asChild>
              <a href="#contacto">Agenda tu cotización</a>
            </Button>
            <Button size="lg" variant="outline" className="sm:ml-2" asChild>
              <a href="#tienda">Explora nuestros productos</a>
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative w-full max-w-md"
        >
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-primary/20 to-transparent blur-2xl" />
          <img
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop"
            alt="Smartphone premium"
            className="mx-auto h-auto w-full max-w-sm rotate-2 rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-black/5 dark:bg-zinc-900"
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
