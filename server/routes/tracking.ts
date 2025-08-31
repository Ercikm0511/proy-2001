import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve(process.cwd(), "server", "data");
const FILE = path.join(DATA_DIR, "tracking.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf8");
}

function readAll(): any[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function trackLookup(req: Request, res: Response) {
  const { nombre, documento, guiaFactura } = req.body as {
    nombre?: string;
    documento?: string;
    guiaFactura?: string;
  };
  if (!nombre || !documento || !guiaFactura) {
    return res
      .status(400)
      .json({ error: "nombre, documento y guiaFactura requeridos" });
  }
  const norm = (s: string) => String(s).trim().toLowerCase();
  const list = readAll();
  const match = list.find(
    (r: any) =>
      norm(r.documento) === norm(documento) &&
      norm(r.guiaFactura) === norm(guiaFactura) &&
      (!r.nombre || norm(r.nombre) === norm(nombre)),
  );
  if (!match) return res.status(404).json({ error: "No encontrado" });
  res.json({
    id: match.id,
    tipo: match.tipo || match.tipoOperacion || "Reparación",
    fecha: match.fecha || match.createdAt || new Date().toISOString(),
    estado: match.estado || "En proceso",
    estimado: match.estimado || null,
  });
}
