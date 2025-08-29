import { MessageCircle } from "lucide-react";

export default function WhatsappFab() {
  return (
    <a
      href={`https://wa.me/?text=${encodeURIComponent("Hola M’E Store, necesito ayuda con una reparación o compra.")}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
