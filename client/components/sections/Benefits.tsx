import { BadgeCheck, Clock, Handshake, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  { icon: ShieldCheck, title: "Garantía oficial" },
  { icon: BadgeCheck, title: "Repuestos originales" },
  { icon: Clock, title: "Reparación express" },
  { icon: Handshake, title: "Atención personalizada" },
];

export default function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 md:px-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border bg-card/50 p-4 text-center shadow-sm"
          >
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <b.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">{b.title}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
