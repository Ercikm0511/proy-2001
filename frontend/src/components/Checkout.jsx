import React from "react";

export default function Checkout() {
  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h3 className="font-bold mb-2">Checkout</h3>
      <p>
        El backend expone POST /api/checkout si deseas integrar Wompi; aquí
        puedes redirigir con el payment_link_url.
      </p>
    </div>
  );
}
