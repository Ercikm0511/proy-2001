import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Inventory from "@/components/sections/Inventory";
import { ShoppingCart } from "lucide-react";
import { useRef } from "react";
import { useCart } from "@/state/cart";

export default function StoreModal() {
  const navigate = useNavigate();
  const cartBtnRef = useRef<HTMLButtonElement | null>(null);
  const { setOpen, items } = useCart();
  return (
    <Dialog defaultOpen onOpenChange={(open) => { if (!open) navigate(-1); }}>
      <DialogContent className="max-w-5xl w-[95vw]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Tienda</DialogTitle>
            <button ref={cartBtnRef} onClick={() => setOpen(true)} aria-label="Abrir carrito" className="relative rounded-full border p-2 text-muted-foreground hover:text-foreground">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{items.length}</span>
              )}
            </button>
          </div>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto pr-2">
          <Inventory cartTargetRef={cartBtnRef} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
