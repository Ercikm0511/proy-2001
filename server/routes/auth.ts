import type { Request, Response } from "express";
import crypto from "node:crypto";

const sessions = new Map<string, { username: string; exp: number }>();

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

function sign(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

function makeToken(username: string, secret: string, ttlMs: number) {
  const payload = `${username}:${Date.now()}:${crypto.randomBytes(16).toString("hex")}`;
  const sig = sign(payload, secret);
  return `${payload}.${sig}`;
}

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  const parts = header.split(/; */);
  for (const p of parts) {
    const idx = p.indexOf("=");
    if (idx === -1) continue;
    const k = decodeURIComponent(p.slice(0, idx).trim());
    const v = decodeURIComponent(p.slice(idx + 1).trim());
    out[k] = v;
  }
  return out;
}

function setCookie(res: Response, name: string, value: string, opts: {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  maxAge?: number; // seconds
  path?: string;
}) {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];
  if (opts.maxAge) parts.push(`Max-Age=${opts.maxAge}`);
  if (opts.path) parts.push(`Path=${opts.path}`); else parts.push("Path=/");
  if (opts.httpOnly) parts.push("HttpOnly");
  if (opts.secure) parts.push("Secure");
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite[0].toUpperCase()}${opts.sameSite.slice(1)}`);
  res.setHeader("Set-Cookie", parts.join("; "));
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body as { username?: string; password?: string };
  const ADMIN_USER = getEnv("ADMIN_USER");
  const ADMIN_PASS = getEnv("ADMIN_PASS");
  const SESSION_SECRET = getEnv("SESSION_SECRET") ?? crypto.randomBytes(32).toString("hex");

  if (!username || !password) return res.status(400).json({ error: "Faltan credenciales" });
  if (!ADMIN_USER || !ADMIN_PASS) return res.status(500).json({ error: "Credenciales de administrador no configuradas" });

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ error: "Usuario o contraseña inválidos" });
  }

  const ttlMs = 7 * 24 * 60 * 60 * 1000; // 7 days
  const token = makeToken(username, SESSION_SECRET, ttlMs);
  const exp = Date.now() + ttlMs;
  sessions.set(token, { username, exp });

  const secure = process.env.NODE_ENV === "production";
  setCookie(res, "admin_session", token, {
    httpOnly: true,
    secure,
    sameSite: secure ? "lax" : "lax",
    maxAge: Math.floor(ttlMs / 1000),
    path: "/",
  });

  res.json({ ok: true });
}

export async function me(req: Request, res: Response) {
  const SESSION_SECRET = getEnv("SESSION_SECRET") ?? "";
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["admin_session"];
  if (!token) return res.status(401).json({ authenticated: false });
  const meta = sessions.get(token);
  if (!meta) return res.status(401).json({ authenticated: false });
  if (meta.exp < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ authenticated: false });
  }
  const [username, ts, rand, sig] = token.split(/[.:]/);
  const unsigned = `${username}:${ts}:${rand}`;
  const expected = SESSION_SECRET ? sign(unsigned, SESSION_SECRET) : sig;
  if (expected !== sig) return res.status(401).json({ authenticated: false });
  return res.json({ authenticated: true, user: { username: meta.username, role: "admin" } });
}

export async function logout(req: Request, res: Response) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["admin_session"];
  if (token) sessions.delete(token);
  const secure = process.env.NODE_ENV === "production";
  setCookie(res, "admin_session", "", { httpOnly: true, secure, sameSite: secure ? "lax" : "lax", maxAge: 0, path: "/" });
  res.json({ ok: true });
}

export function requireAdmin(req: Request, res: Response, next: () => void) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies["admin_session"];
  if (!token) return res.status(401).json({ error: "No autorizado" });
  const meta = sessions.get(token);
  if (!meta || meta.exp < Date.now()) return res.status(401).json({ error: "No autorizado" });
  (req as any).admin = { username: meta.username };
  next();
}
