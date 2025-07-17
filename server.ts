// server.ts
import { serve, file } from "bun";

console.log("Starting server...");

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const filepath = url.pathname === "/" ? "./dist/index.html" : `./dist${url.pathname}`;
    
    try {
      const f = file(filepath);
      const headers = new Headers();
      if (filepath.endsWith(".css")) {
        headers.set("Content-Type", "text/css");
      } else {
        headers.set("Content-Type", "text/html");
      }
      return new Response(f, { headers });
    } catch (e) {
      return new Response("Not Found", { status: 404 });
    }
  },
  error() {
    return new Response(null, { status: 404 });
  }
});

console.log("Server running at http://localhost:3000");
