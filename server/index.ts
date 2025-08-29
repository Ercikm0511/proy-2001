import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export async function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Payments
  const { handleCheckout } = await import("./routes/checkout");
  app.post("/api/checkout", handleCheckout);
  app.post("/api/webhook", (req, res) => {
    // For production, verify signature header per Wompi docs
    console.log("Wompi webhook:", req.body);
    res.sendStatus(200);
  });

  return app;
}
