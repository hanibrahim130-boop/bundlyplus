import type { IncomingMessage, ServerResponse } from "http";
import { storage } from "../server/storage";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.SESSION_SECRET || "bundlyplus-secret-key";

function json(res: ServerResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(body);
}

async function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
  });
}

function getToken(req: IncomingMessage): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

function requireAdmin(req: IncomingMessage, res: ServerResponse): boolean {
  const token = getToken(req);
  if (!token) { json(res, 401, { error: "Unauthorized" }); return false; }
  try { jwt.verify(token, JWT_SECRET); return true; } catch { json(res, 401, { error: "Invalid or expired token" }); return false; }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = (req.url ?? "").split("?")[0].replace(/\/$/, "") || "/";
  const method = req.method ?? "GET";

  if (method === "OPTIONS") { res.setHeader("Access-Control-Allow-Origin", "*"); res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"); res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization"); res.statusCode = 204; res.end(); return; }

  try {
    // GET /api/health — diagnostics
    if (method === "GET" && url === "/api/health") {
      return json(res, 200, {
        ok: true,
        firebase_project: process.env.FIREBASE_PROJECT_ID ?? "NOT SET",
        firebase_email: process.env.FIREBASE_CLIENT_EMAIL ? "SET" : "NOT SET",
        firebase_key: process.env.FIREBASE_PRIVATE_KEY ? `SET (${process.env.FIREBASE_PRIVATE_KEY.length} chars)` : "NOT SET",
        session: process.env.SESSION_SECRET ? "SET" : "NOT SET",
        node_env: process.env.NODE_ENV,
      });
    }

    // GET /api/products
    if (method === "GET" && url === "/api/products") {
      return json(res, 200, await storage.getProducts());
    }

    // GET /api/products/:id
    const productMatch = url.match(/^\/api\/products\/([^/]+)$/);
    if (method === "GET" && productMatch) {
      const product = await storage.getProduct(productMatch[1]);
      return product ? json(res, 200, product) : json(res, 404, { error: "Product not found" });
    }

    // GET /api/settings (public, excludes password hash)
    if (method === "GET" && url === "/api/settings") {
      const all = await storage.getSettings();
      const { admin_password_hash: _pw, ...pub } = all;
      return json(res, 200, pub);
    }

    // POST /api/admin/login
    if (method === "POST" && url === "/api/admin/login") {
      const body = await readBody(req);
      const { password } = body ?? {};
      if (!password) return json(res, 400, { error: "Password required" });
      const hash = await storage.getSetting("admin_password_hash");
      const valid = hash ? bcrypt.compareSync(password, hash) : password === "admin123";
      if (!valid) return json(res, 401, { error: "Invalid password" });
      const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "7d" });
      return json(res, 200, { token });
    }

    // GET /api/admin/verify
    if (method === "GET" && url === "/api/admin/verify") {
      if (!requireAdmin(req, res)) return;
      return json(res, 200, { ok: true });
    }

    // GET /api/admin/products
    if (method === "GET" && url === "/api/admin/products") {
      if (!requireAdmin(req, res)) return;
      return json(res, 200, await storage.getProducts());
    }

    // POST /api/admin/products
    if (method === "POST" && url === "/api/admin/products") {
      if (!requireAdmin(req, res)) return;
      const body = await readBody(req);
      const product = await storage.createProduct(body);
      return json(res, 200, product);
    }

    // PUT /api/admin/products/:id
    const adminProductMatch = url.match(/^\/api\/admin\/products\/([^/]+)$/);
    if (method === "PUT" && adminProductMatch) {
      if (!requireAdmin(req, res)) return;
      const body = await readBody(req);
      const product = await storage.updateProduct(adminProductMatch[1], body);
      return product ? json(res, 200, product) : json(res, 404, { error: "Product not found" });
    }

    // DELETE /api/admin/products/:id
    if (method === "DELETE" && adminProductMatch) {
      if (!requireAdmin(req, res)) return;
      const ok = await storage.deleteProduct(adminProductMatch[1]);
      return ok ? json(res, 200, { success: true }) : json(res, 404, { error: "Product not found" });
    }

    // GET /api/admin/settings
    if (method === "GET" && url === "/api/admin/settings") {
      if (!requireAdmin(req, res)) return;
      return json(res, 200, await storage.getSettings());
    }

    // PUT /api/admin/settings
    if (method === "PUT" && url === "/api/admin/settings") {
      if (!requireAdmin(req, res)) return;
      const body = await readBody(req);
      if (body.new_password) {
        if (!body.current_password) return json(res, 400, { error: "Current password required" });
        const hash = await storage.getSetting("admin_password_hash");
        const valid = hash ? bcrypt.compareSync(body.current_password, hash) : body.current_password === "admin123";
        if (!valid) return json(res, 401, { error: "Current password is incorrect" });
        body.admin_password_hash = bcrypt.hashSync(body.new_password, 10);
        delete body.new_password;
        delete body.current_password;
      } else {
        delete body.admin_password_hash;
        delete body.new_password;
        delete body.current_password;
      }
      await storage.updateSettings(body);
      return json(res, 200, { success: true });
    }

    return json(res, 404, { error: "Not found" });
  } catch (err: any) {
    console.error("API error:", err);
    return json(res, 500, { error: err?.message ?? "Internal server error" });
  }
}
