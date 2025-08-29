import { createServer } from "../server";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import path from 'path';
import fs from 'fs';

const app = createServer();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle API routes
  if (req.url?.startsWith('/api/')) {
    return app(req, res);
  }

  // For non-API routes, serve the built SPA
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
    res.status(500).send('Internal Server Error');
  }
} 