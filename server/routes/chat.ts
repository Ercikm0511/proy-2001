import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

const DATA_DIR = path.resolve(process.cwd(), "server", "data");
const CHATS_FILE = path.join(DATA_DIR, "chats.json");
const NOTIFS_FILE = path.join(DATA_DIR, "notifications.json");

function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CHATS_FILE)) fs.writeFileSync(CHATS_FILE, "[]", "utf8");
  if (!fs.existsSync(NOTIFS_FILE)) fs.writeFileSync(NOTIFS_FILE, "[]", "utf8");
}

function readJson<T = any>(file: string): T {
  ensureFiles();
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [] as unknown as T;
  }
}

function writeJson(file: string, data: any) {
  ensureFiles();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

function businessHoursNow(date = new Date()) {
  const local = new Date(date);
  const day = local.getDay(); // 0 Sun - 6 Sat
  const hour = local.getHours();
  const openHour = Number(process.env.BIZ_OPEN_HOUR ?? 9); // 9am
  const closeHour = Number(process.env.BIZ_CLOSE_HOUR ?? 19); // 7pm
  const openDays = (process.env.BIZ_OPEN_DAYS ?? "1,2,3,4,5,6")
    .split(",")
    .map((d) => Number(d.trim()));
  const open = openDays.includes(day) && hour >= openHour && hour < closeHour;
  return { open, day, hour, openHour, closeHour, openDays };
}

async function maybeSendEmail(subject: string, text: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.NOTIFY_EMAIL || user;
  if (!host || !user || !pass || !to) return false;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  try {
    await transporter.sendMail({ from: user, to, subject, text });
    return true;
  } catch (err) {
    console.error("Email send failed:", err);
    return false;
  }
}

type Message = { role: "user" | "bot"; content: string; at: string };

type ChatSession = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  messages: Message[];
  escalated?: boolean;
};

function botReply(text: string, name: string) {
  const t = text.toLowerCase();
  const lines: string[] = [];
  if (/hola|buenas|buenos|saludo/.test(t)) {
    lines.push(`Hola ${name.split(" ")[0] || ""} 👋, ¿en qué puedo ayudarte?`);
  }
  if (/horario|horarios|abren|cierran|atenci[oó]n/.test(t)) {
    const openHour = process.env.BIZ_OPEN_HOUR ?? "9";
    const closeHour = process.env.BIZ_CLOSE_HOUR ?? "19";
    lines.push(
      `Nuestro horario de atención es de ${openHour}:00 a ${closeHour}:00, lunes a sábado.`,
    );
  }
  if (/direcci[oó]n|ubicaci[oó]n|donde|dónde|mapa/.test(t)) {
    const maps =
      "https://maps.google.com/?q=Cra.+81+%2343-72,+Local+1158+Laureles+-+Estadio,+Medell%C3%ADn";
    lines.push(
      `Estamos en Cra. 81 #43-72, Local 1158, Laureles - Estadio, Medellín. Ver mapa: ${maps}`,
    );
  }
  if (
    /servicio|servicios|reparaci[oó]n|accesorio|accesorios|celular|celulares|m[oó]viles?/.test(
      t,
    )
  ) {
    lines.push(
      "Ofrecemos: reparaciones profesionales, venta de accesorios y venta de celulares certificados.",
    );
  }
  if (/cotizaci[oó]n|cotizar|precio|presupuesto/.test(t)) {
    const url = (process.env.PUBLIC_BASE_URL || "") + "#contacto";
    lines.push(
      `Para una cotización rápida completa el formulario aquí: ${url || "#contacto"}`,
    );
  }
  if (/asesor|humano|agente|persona/.test(t)) {
    lines.push(
      "Puedo conectarte con un asesor humano. Déjame tu consulta y te contactaremos por correo a la brevedad.",
    );
  }
  if (!lines.length) {
    lines.push(
      "Puedo ayudarte con: horarios, dirección, servicios y cotización rápida. También puedo conectarte con un asesor humano.",
    );
  }
  return lines.join("\n");
}

export async function startSession(req: Request, res: Response) {
  const { name, email } = req.body as { name?: string; email?: string };
  if (!name || !email)
    return res.status(400).json({ error: "name and email required" });
  const chats = readJson<ChatSession[]>(CHATS_FILE);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const welcome =
    "👋 Hola, bienvenido a M’E Store. Soy tu asistente virtual, ¿en qué puedo ayudarte hoy?";
  const session: ChatSession = {
    id,
    name,
    email,
    createdAt: new Date().toISOString(),
    messages: [{ role: "bot", content: welcome, at: new Date().toISOString() }],
  };
  chats.push(session);
  writeJson(CHATS_FILE, chats);
  const biz = businessHoursNow();
  res
    .status(201)
    .json({
      sessionId: id,
      messages: session.messages,
      businessOpen: biz.open,
    });
}

export async function postMessage(req: Request, res: Response) {
  const { sessionId, message, escalate } = req.body as {
    sessionId?: string;
    message?: string;
    escalate?: boolean;
  };
  if (!sessionId || (!message && !escalate))
    return res
      .status(400)
      .json({ error: "sessionId and message or escalate required" });
  const chats = readJson<ChatSession[]>(CHATS_FILE);
  const session = chats.find((c) => c.id === sessionId);
  if (!session) return res.status(404).json({ error: "session not found" });

  const now = new Date().toISOString();
  if (message)
    session.messages.push({ role: "user", content: message, at: now });

  let reply = "";
  if (escalate) {
    session.escalated = true;
    reply =
      "Te conectaré con un asesor humano. Te escribiremos al correo registrado a la brevedad.";
  }
  if (message) {
    const r = botReply(message, session.name);
    reply = escalate ? reply + "\n" + r : r;
  }
  const botMsg: Message = {
    role: "bot",
    content: reply,
    at: new Date().toISOString(),
  };
  session.messages.push(botMsg);

  writeJson(CHATS_FILE, chats);

  const biz = businessHoursNow();
  if (!biz.open) {
    const note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      sessionId,
      name: session.name,
      email: session.email,
      message: message || (escalate ? "Usuario solicitó asesor humano" : ""),
      createdAt: new Date().toISOString(),
      sent: false,
    };
    const list = readJson<any[]>(NOTIFS_FILE);
    list.push(note);
    writeJson(NOTIFS_FILE, list);
    const ok = await maybeSendEmail(
      `Mensaje fuera de horario — ${session.name}`,
      `Cliente: ${session.name} <${session.email}>\nMensaje: ${note.message}\nSession: ${sessionId}`,
    );
    if (ok) {
      note.sent = true;
      writeJson(NOTIFS_FILE, list);
    }
  }

  res.json({ messages: session.messages, bot: botMsg });
}
