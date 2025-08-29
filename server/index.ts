import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
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

  // Auth
  app.post("/api/login", (await import("./routes/auth")).login);
  app.get("/api/me", (await import("./routes/auth")).me);
  app.post("/api/logout", (await import("./routes/auth")).logout);

  // Payments
  app.post("/api/checkout", (await import("./routes/checkout")).handleCheckout);
  app.post("/api/webhook", (req, res) => {
    // For production, verify signature header per Wompi docs
    console.log("Wompi webhook:", req.body);
    res.sendStatus(200);
  });

  return app;
}
