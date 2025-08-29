import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function generateTimeSlots(
  date,
  slotMinutes = 30,
  startHour = 9,
  endHour = 18,
) {
  const slots = [];
  const base = new Date(date);
  base.setHours(startHour, 0, 0, 0);
  while (
    base.getHours() < endHour ||
    (base.getHours() === endHour && base.getMinutes() === 0)
  ) {
    slots.push(new Date(base));
    base.setMinutes(base.getMinutes() + slotMinutes);
  }
  return slots;
}

export default function ContactScheduler() {
  const [form, setForm] = useState({
    name: "",
    documentNumber: "",
    phone: "",
    email: "",
    phoneBrand: "",
    phoneModel: "",
    message: "",
  });
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [occupied, setOccupied] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const s = generateTimeSlots(date, 30, 9, 18);
    setSlots(s);
    const yyyy = date.toISOString().slice(0, 10);
    fetch(`/api/appointments/occupied?date=${yyyy}`)
      .then((r) => r.json())
      .then((j) => {
        const occ = j.occupied.map((o) => new Date(o.startAt).toISOString());
        setOccupied(occ);
      })
      .catch(() => setOccupied([]));
  }, [date]);

  const onSubmit = async (sendVia = "whatsapp") => {
    const required = [
      "name",
      "documentNumber",
      "phone",
      "email",
      "phoneBrand",
      "phoneModel",
      "message",
    ];
    for (const k of required)
      if (!form[k]) return alert("Complete todos los campos requeridos");
    if (!selectedSlot) return alert("Seleccione una hora disponible");
    setSending(true);
    const payload = {
      ...form,
      startAt: selectedSlot.toISOString(),
      sendWhatsapp: sendVia === "whatsapp",
      sendEmail: sendVia === "email",
    };
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.status === 201 || res.status === 200)
        alert("Cita agendada con éxito");
      else if (res.status === 409) alert("Horario ocupado, elige otro slot");
      if (json?.links?.whatsapp && sendVia === "whatsapp")
        window.open(json.links.whatsapp, "_blank");
    } catch (err) {
      console.error(err);
      alert("Error al agendar");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h3 className="text-xl font-bold mb-4">
        Contacto rápido - Agenda tu cita
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          placeholder="Nombre completo"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          placeholder="Número de documento"
          value={form.documentNumber}
          onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          placeholder="Teléfono"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          placeholder="Marca del teléfono"
          value={form.phoneBrand}
          onChange={(e) => setForm({ ...form, phoneBrand: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          placeholder="Modelo"
          value={form.phoneModel}
          onChange={(e) => setForm({ ...form, phoneModel: e.target.value })}
          className="p-2 border rounded"
        />
      </div>
      <textarea
        placeholder="Describe la falla"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full mt-3 p-2 border rounded"
        rows={4}
      />
      <div className="mt-4">
        <label className="block mb-2 font-semibold">Selecciona fecha</label>
        <DatePicker
          selected={date}
          onChange={(d) => setDate(d)}
          dateFormat="yyyy-MM-dd"
          className="p-2 border rounded"
        />
      </div>
      <div className="mt-3">
        <label className="block mb-2 font-semibold">Horas disponibles</label>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot) => {
            const label = slot.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const occupiedFlag = occupied.includes(slot.toISOString());
            return (
              <button
                key={slot.toISOString()}
                disabled={occupiedFlag}
                onClick={() => setSelectedSlot(slot)}
                className={`p-2 rounded ${occupiedFlag ? "bg-gray-200 text-gray-500" : selectedSlot?.toISOString() === slot.toISOString() ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => onSubmit("whatsapp")}
          disabled={sending}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Enviar por WhatsApp
        </button>
        <button
          onClick={() => onSubmit("email")}
          disabled={sending}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Enviar por Email
        </button>
      </div>
    </div>
  );
}
