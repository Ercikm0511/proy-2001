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

  // Phones directory
  const phones = await import("./routes/phones");
  app.get("/api/phone/brands", phones.getBrands);
  app.get("/api/phone/models", phones.getModels);

  // Testimonials
  const testimonials = await import("./routes/testimonials");
  app.get("/api/testimonials", testimonials.listTestimonials);
  app.post("/api/testimonials", testimonials.createTestimonial);

  // Chatbot
  const chat = await import("./routes/chat");
  app.post("/api/chat/start", chat.startSession);
  app.post("/api/chat/message", chat.postMessage);

  // Tracking
  const tracking = await import("./routes/tracking");
  app.post("/api/rastreo", tracking.trackLookup);

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
