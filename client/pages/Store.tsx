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
          <h1 className="text-2xl font-semibold sr-only">Tienda</h1>
          <div className="flex items-center gap-2">
          </div>
        </header>
        <main>
          <Inventory cartTargetRef={cartBtnRef} />
        </main>
      </div>
    </div>
  );
}
