import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Inventory from "@/components/sections/Inventory";

export default function StoreModal() {
  const navigate = useNavigate();
  return (
    <Dialog defaultOpen onOpenChange={(open) => { if (!open) navigate(-1); }}>
      <DialogContent className="max-w-5xl w-[95vw]">
        <DialogHeader>
          <DialogTitle>Tienda</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto pr-2">
          <Inventory />
        </div>
      </DialogContent>
    </Dialog>
  );
}
