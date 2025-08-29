# M'E Store - Paquete Entregable

Incluye frontend (React + Tailwind) y backend (Node + Express + Prisma/Postgres) para citas, carrito, checkout (Wompi) y sistema de agendamiento.

## Backend
Ubicación: `backend/`

1. Copiar `.env.example` a `.env` y completar credenciales.
2. Instalar dependencias: `npm install`.
3. Inicializar Prisma y migrar:
   - `npx prisma migrate dev --name init`
   - `npx prisma generate`
4. Ejecutar en dev: `npm run dev` (o `npm run build && npm start`).

Endpoints relevantes:
- GET `/api/appointments/occupied?date=YYYY-MM-DD` — slots ocupados.
- POST `/api/appointments` — crea cliente+cita, valida disponibilidad, retorna link de WhatsApp y envía email opcional.
- GET `/api/appointments` — lista citas (filtrable por `?date=`).

## Frontend
Ubicaci��n: `frontend/`

Se incluyen componentes clave:
- `src/components/ContactScheduler.jsx`
- `src/components/Tienda.jsx`
- `src/components/Carrito.jsx`
- `src/components/Checkout.jsx`
- `src/data/products.js`

Nota: Por políticas del proyecto actual, no se incluyen `src/main.jsx` ni `src/App.jsx`. El ingeniero debe integrarlos en su proyecto, importando los componentes provistos.

## Variables de entorno ejemplo
Ver `backend/.env.example`.

## Recomendaciones
- Usa Postgres administrado (Neon) y configura `DATABASE_URL`.
- Protege listados de citas detrás de login admin.
- Ajusta horarios/slots y lógica de solapamiento según tu operación.
