import type { IncomingMessage, ServerResponse } from "http";

function json(res: ServerResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(body);
}

async function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    if ((req as any).body) return resolve((req as any).body);
    let data = "";
    req.on("data", (chunk: string) => (data += chunk));
    req.on("end", () => {
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
  });
}

let _storage: any = null;
async function getStorage() {
  if (!_storage) {
    const mod = await import("../server/storage");
    _storage = mod.storage;
  }
  return _storage;
}

let _jwt: any = null;
async function getJwt() {
  if (!_jwt) _jwt = (await import("jsonwebtoken")).default;
  return _jwt;
}

let _bcrypt: any = null;
async function getBcrypt() {
  if (!_bcrypt) _bcrypt = (await import("bcryptjs")).default;
  return _bcrypt;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = (req.url ?? "").split("?")[0].replace(/\/$/, "") || "/";
  const method = req.method ?? "GET";

  if (method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    if (method === "GET" && url === "/api/health") {
      return json(res, 200, {
        ok: true,
        firebase_project: process.env.FIREBASE_PROJECT_ID ?? "NOT SET",
        firebase_email: process.env.FIREBASE_CLIENT_EMAIL ? "SET" : "NOT SET",
        firebase_key: process.env.FIREBASE_PRIVATE_KEY ? `SET (${process.env.FIREBASE_PRIVATE_KEY.length} chars)` : "NOT SET",
        session: process.env.SESSION_SECRET ? "SET" : "NOT SET",
        node_env: process.env.NODE_ENV ?? "NOT SET",
      });
    }

    const JWT_SECRET = process.env.SESSION_SECRET || "bundlyplus-secret-key";
    const storage = await getStorage();

    if (method === "GET" && url === "/api/products") {
      return json(res, 200, await storage.getProducts());
    }

    const productMatch = url.match(/^\/api\/products\/([^/]+)$/);
    if (method === "GET" && productMatch) {
      const product = await storage.getProduct(productMatch[1]);
      return product ? json(res, 200, product) : json(res, 404, { error: "Product not found" });
    }

    if (method === "GET" && url === "/api/settings") {
      const all = await storage.getSettings();
      const { admin_password_hash: _pw, ...pub } = all;
      return json(res, 200, pub);
    }

    if (method === "POST" && url === "/api/admin/login") {
      const bcrypt = await getBcrypt();
      const jwtLib = await getJwt();
      const body = await readBody(req);
      const { password } = body ?? {};
      if (!password) return json(res, 400, { error: "Password required" });
      const hash = await storage.getSetting("admin_password_hash");
      const valid = hash ? bcrypt.compareSync(password, hash) : password === "admin123";
      if (!valid) return json(res, 401, { error: "Invalid password" });
      const token = jwtLib.sign({ admin: true }, JWT_SECRET, { expiresIn: "7d" });
      return json(res, 200, { token });
    }

    const requireAdmin = async () => {
      const jwtLib = await getJwt();
      const auth = req.headers.authorization;
      if (!auth?.startsWith("Bearer ")) { json(res, 401, { error: "Unauthorized" }); return false; }
      try { jwtLib.verify(auth.slice(7), JWT_SECRET); return true; } catch { json(res, 401, { error: "Invalid or expired token" }); return false; }
    };

    if (method === "GET" && url === "/api/admin/verify") {
      if (!(await requireAdmin())) return;
      return json(res, 200, { ok: true });
    }

    if (method === "GET" && url === "/api/admin/products") {
      if (!(await requireAdmin())) return;
      return json(res, 200, await storage.getProducts());
    }

    if (method === "POST" && url === "/api/admin/products") {
      if (!(await requireAdmin())) return;
      const body = await readBody(req);
      const product = await storage.createProduct(body);
      return json(res, 200, product);
    }

    const adminProductMatch = url.match(/^\/api\/admin\/products\/([^/]+)$/);
    if (method === "PUT" && adminProductMatch) {
      if (!(await requireAdmin())) return;
      const body = await readBody(req);
      const product = await storage.updateProduct(adminProductMatch[1], body);
      return product ? json(res, 200, product) : json(res, 404, { error: "Product not found" });
    }

    if (method === "DELETE" && adminProductMatch) {
      if (!(await requireAdmin())) return;
      const ok = await storage.deleteProduct(adminProductMatch[1]);
      return ok ? json(res, 200, { success: true }) : json(res, 404, { error: "Product not found" });
    }

    if (method === "GET" && url === "/api/admin/settings") {
      if (!(await requireAdmin())) return;
      return json(res, 200, await storage.getSettings());
    }

    if (method === "PUT" && url === "/api/admin/settings") {
      if (!(await requireAdmin())) return;
      const bcrypt = await getBcrypt();
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
