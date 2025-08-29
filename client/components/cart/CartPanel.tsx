import { Button } from "@/components/ui/button";
import { useCart } from "@/state/cart";
import { X, ShoppingCart } from "lucide-react";

export default function CartPanel() {
  const { items, total, remove, setQty, open, setOpen, clear } = useCart();

  const checkout = async () => {
    if (!items.length) return;
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: items.map(({ id, name, price, qty, image }) => ({ id, name, price, qty, image })) }),
    });
    const data = await res.json();
    if (data?.checkoutUrl) window.location.href = data.checkoutUrl as string;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative hidden md:inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-2 text-sm"
      >
        <ShoppingCart className="h-4 w-4" />
        <span>Carrito</span>
        {items.length > 0 && (
          <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
            {items.length}
          </span>
        )}
      </button>
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/30" onClick={() => setOpen(false)} />
      )}
      <aside
        className={`fixed right-0 top-0 z-[61] h-full w-full max-w-md transform bg-background shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h3 className="text-base font-semibold">Tu carrito</h3>
          </div>
          <button aria-label="Cerrar" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-4">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
          )}
          <ul className="space-y-3">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-3 rounded-xl border p-3">
                {it.image && <img src={it.image} alt={it.name} className="h-14 w-14 rounded-lg object-cover" />}
                <div className="flex-1">
                  <p className="text-sm font-medium">{it.name}</p>
                  <p className="text-xs text-muted-foreground">${it.price.toLocaleString()}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <button className="h-6 w-6 rounded border" onClick={() => setQty(it.id, it.qty - 1)}>-</button>
                    <span>{it.qty}</span>
                    <button className="h-6 w-6 rounded border" onClick={() => setQty(it.id, it.qty + 1)}>+</button>
                    <button className="ml-auto text-xs text-red-500" onClick={() => remove(it.id)}>Quitar</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center justify-between text-sm">
            <span>Total</span>
            <span className="font-semibold">${total.toLocaleString()}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <Button className="flex-1" onClick={checkout} disabled={!items.length}>Finalizar compra</Button>
            <Button variant="outline" onClick={clear}>Vaciar</Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Pago seguro con Wompi (tarjeta, PSE, Nequi, Bancolombia).</p>
        </div>
      </aside>
    </>
  );
}
