import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Inventory from "@/components/sections/Inventory";
import { ShoppingCart } from "lucide-react";
import { useRef } from "react";
import { useCart } from "@/state/cart";

export default function StoreModal() {
  const navigate = useNavigate();
  const cartBtnRef = useRef<HTMLButtonElement | null>(null);
  const { setOpen, items } = useCart();
  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) navigate(-1);
      }}
    >
      <DialogContent className="max-w-5xl w-[95vw]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Tienda</DialogTitle>
          </div>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto pr-2">
          <Inventory cartTargetRef={cartBtnRef} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
