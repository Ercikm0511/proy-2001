import { Smartphone, Wrench, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  {
    icon: Wrench,
    title: "Reparación Profesional",
    desc: "Rápida y garantizada con repuestos originales o de la más alta calidad.",
  },
  {
    icon: Smartphone,
    title: "Móviles Certificados",
    desc: "Nuevos y usados con inspección de 50+ puntos.",
  },
  {
    icon: Headphones,
    title: "Accesorios Premium",
    desc: "Originales y compatibles de alta calidad.",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <it.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
