import type { Request, Response } from "express";

const BASE = "https://api-mobilespecs.azharimm.dev/v2";

export async function getBrands(_req: Request, res: Response) {
  try {
    const r = await fetch(`${BASE}/brands`);
    if (!r.ok) return res.status(502).json({ error: "upstream error" });
    const j = await r.json();
    const brands = (j?.data || []).map((b: any) => ({ name: b.brand_name, slug: b.brand_slug, count: b.device_count }));
    res.json({ brands });
  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
}

export async function getModels(req: Request, res: Response) {
  const slug = (req.query.brand as string) || "";
  const q = ((req.query.q as string) || "").toLowerCase();
  if (!slug) return res.status(400).json({ error: "brand required" });
  try {
    let page = 1;
    const models: { name: string; slug: string }[] = [];
    while (page <= 3) { // limit pages for performance
      const r = await fetch(`${BASE}/brands/${encodeURIComponent(slug)}?page=${page}`);
      if (!r.ok) break;
      const j = await r.json();
      const phones = j?.data?.phones || [];
      for (const p of phones) models.push({ name: p.phone_name, slug: p.slug });
      if (!j?.data?.phones?.length || !j?.data?.next) break;
      page++;
    }
    const filtered = q ? models.filter((m) => m.name.toLowerCase().includes(q)) : models;
    res.json({ models: filtered });
  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
}
