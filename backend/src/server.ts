import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import { addMinutes, parseISO } from "date-fns";

dotenv.config();
const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = Number(process.env.PORT || 4000);
const SLOT_MINUTES = 30;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

function computeEnd(startIso: string) {
  const start = parseISO(startIso);
  const end = addMinutes(start, SLOT_MINUTES);
  return end.toISOString();
}

app.get("/api/appointments/occupied", async (req, res) => {
  try {
    const date = req.query.date as string;
    if (!date) return res.status(400).json({ error: "date required (YYYY-MM-DD)" });
    const startDay = new Date(`${date}T00:00:00.000Z`);
    const endDay = new Date(`${date}T23:59:59.999Z`);
    const appointments = await prisma.appointment.findMany({
      where: { startAt: { gte: startDay, lte: endDay } },
      select: { id: true, startAt: true, endAt: true },
    });
    return res.json({ occupied: appointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

app.post("/api/appointments", async (req, res) => {
  const {
    name,
    documentNumber,
    phone,
    email,
    phoneBrand,
    phoneModel,
    message,
    startAt,
    sendWhatsapp = false,
    sendEmail = false,
  } = req.body as {
    name: string;
    documentNumber: string;
    phone: string;
    email: string;
    phoneBrand: string;
    phoneModel: string;
    message: string;
    startAt: string;
    sendWhatsapp?: boolean;
    sendEmail?: boolean;
  };

  if (!name || !documentNumber || !phone || !email || !phoneBrand || !phoneModel || !message || !startAt) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const endAt = computeEnd(startAt);

  const overlapping = await prisma.appointment.findFirst({
    where: {
      AND: [
        { startAt: { lt: new Date(endAt) } },
        { endAt: { gt: new Date(startAt) } },
        { status: "SCHEDULED" },
      ],
    },
  });

  if (overlapping) {
    return res.status(409).json({ error: "Slot already booked", overlapping });
  }

  let client = await prisma.client.findUnique({ where: { documentNumber } });
  if (!client) {
    client = await prisma.client.create({ data: { name, documentNumber, phone, email } });
  } else {
    client = await prisma.client.update({ where: { id: client.id }, data: { phone, email, name } });
  }

  const appointment = await prisma.appointment.create({
    data: {
      clientId: client.id,
      phoneBrand,
      phoneModel,
      message,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      status: "SCHEDULED",
    },
    include: { client: true },
  });

  const whatsappMessage = encodeURIComponent(
    `Hola, soy ${client.name}%0ADocumento: ${client.documentNumber}%0ATeléfono: ${client.phone}%0AEmail: ${client.email}%0AMarca: ${phoneBrand}%0AModelo: ${phoneModel}%0AFecha: ${new Date(startAt).toLocaleString()}%0ADetalle: ${message}`,
  );
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${process.env.WHATSAPP_PHONE}&text=${whatsappMessage}`;

  if (sendEmail) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: `Nueva cita M'E Store - ${client.name}`,
        text: `Nueva cita programada:\n\nCliente: ${client.name}\nDocumento: ${client.documentNumber}\nTel: ${client.phone}\nEmail: ${client.email}\nMarca: ${phoneBrand}\nModelo: ${phoneModel}\nFecha: ${new Date(startAt).toString()}\nMensaje: ${message}\n\nID cita: ${appointment.id}`,
      });
    } catch (err) {
      console.error("Email send error:", err);
    }
  }

  return res.json({ appointment, links: { whatsapp: whatsappUrl } });
});

app.get("/api/appointments", async (req, res) => {
  try {
    const date = req.query.date as string | undefined;
    let where: any = {};
    if (date) {
      const startDay = new Date(`${date}T00:00:00.000Z`);
      const endDay = new Date(`${date}T23:59:59.999Z`);
      where.startAt = { gte: startDay, lte: endDay };
    }
    const appts = await prisma.appointment.findMany({ where, orderBy: { startAt: "asc" }, include: { client: true } });
    return res.json({ appointments: appts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
