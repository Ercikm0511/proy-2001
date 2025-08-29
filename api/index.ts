import express from "express";
import cors from "cors";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.get("/api/ping", (_req, res) => {
  const ping = process.env.PING_MESSAGE ?? "ping";
  res.json({ message: ping });
});

app.get("/api/demo", (_req, res) => {
  res.json({ message: "Demo endpoint working!" });
});

app.post("/api/webhook", (req, res) => {
  console.log("Webhook received:", req.body);
  res.sendStatus(200);
});

// Serve static files for non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  try {
    const indexPath = path.join(process.cwd(), 'dist', 'spa', 'index.html');
    
    if (fs.existsSync(indexPath)) {
      const html = fs.readFileSync(indexPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    } else {
      // Fallback for development or if build files don't exist
      res.setHeader('Content-Type', 'text/html');
      return res.send(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>M'E Store — Premium Tech Care</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="/client/App.tsx"></script>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Error serving frontend:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default app; 