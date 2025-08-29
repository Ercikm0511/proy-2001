import React from "react";

export default function Tienda({ products = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <div key={p.id} className="p-4 bg-white rounded-2xl shadow">
          <img
            src={p.image}
            alt={p.name}
            className="h-48 w-full object-cover rounded"
          />
          <h3 className="mt-3 font-semibold">{p.name}</h3>
          <p className="text-blue-600 font-bold">${p.price.toLocaleString()}</p>
          <button className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-xl">
            Agregar al carrito
          </button>
        </div>
      ))}
    </div>
  );
}
