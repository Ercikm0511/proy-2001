import Inventory from "@/components/sections/Inventory";
import { useCart } from "@/state/cart";
import { useRef } from "react";

export default function Store() {
  const cartBtnRef = useRef<HTMLButtonElement | null>(null);
  const { setOpen } = useCart();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Tienda</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              ref={cartBtnRef}
              className="rounded-full border bg-background/60 p-2 text-muted-foreground"
            >
              Ver carrito
            </button>
          </div>
        </header>
        <main>
          <Inventory cartTargetRef={cartBtnRef} />
        </main>
      </div>
    </div>
  );
}
