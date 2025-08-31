import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve(process.cwd(), "server", "data");
const FILE = path.join(DATA_DIR, "testimonials.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf8");
}

function readAll(): any[] {
  ensureFile();
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return []; }
}

function writeAll(list: any[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf8");
}

async function verifyIdToken(idToken: string) {
  const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!r.ok) return null;
  const info: any = await r.json();
  const expectedAud = process.env.GOOGLE_CLIENT_ID;
  if (expectedAud && info.aud !== expectedAud) return null;
  return { email: info.email as string, name: info.name as string };
}

export async function listTestimonials(_req: Request, res: Response) {
  const list = readAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ testimonials: list });
}

export async function createTestimonial(req: Request, res: Response) {
  const { idToken, text } = req.body as { idToken?: string; text?: string };
  if (!idToken || !text) return res.status(400).json({ error: "idToken and text required" });
  const user = await verifyIdToken(idToken);
  if (!user) return res.status(401).json({ error: "invalid token" });
  const list = readAll();
  const item = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: user.name || user.email, email: user.email, text, createdAt: new Date().toISOString() };
  list.push(item);
  writeAll(list);
  res.status(201).json({ ok: true, item });
}
