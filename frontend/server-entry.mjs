import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname } from "node:path";
import { serve } from "srvx";
import app from "./dist/server/server.js";

const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

const mimeTypes = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

serve({
  port: Number(port),
  hostname: host,
  async fetch(req) {
    const url = new URL(req.url);
    const staticPath = join("dist/client", url.pathname);

    if (existsSync(staticPath) && !staticPath.endsWith("/")) {
      const ext = extname(staticPath);
      const contentType = mimeTypes[ext] || "application/octet-stream";
      const file = await readFile(staticPath);
      return new Response(file, {
        headers: { "Content-Type": contentType },
      });
    }

    return app.fetch(req);
  },
});

console.log(`Server running at http://${host}:${port}`);