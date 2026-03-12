let _db = null;
async function getFirestore() {
  if (_db) return _db;
  try {
    const admin = (await import("firebase-admin")).default;
    if (!admin.apps.length) {
      const pk = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: pk,
        }),
      });
    }
    _db = admin.firestore();
    return _db;
  } catch (e) {
    console.error("Firebase init error:", e);
    throw new Error("Firebase initialization failed: " + e.message);
  }
}

async function getProducts() {
  const db = await getFirestore();
  const snap = await db.collection("products").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function getProduct(id) {
  const db = await getFirestore();
  const doc = await db.collection("products").doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function createProduct(data) {
  const db = await getFirestore();
  const ref = await db.collection("products").add(data);
  return { id: ref.id, ...data };
}

async function updateProduct(id, data) {
  const db = await getFirestore();
  const ref = db.collection("products").doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update(data);
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
}

async function deleteProduct(id) {
  const db = await getFirestore();
  const ref = db.collection("products").doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.delete();
  return true;
}

async function getSettings() {
  const db = await getFirestore();
  const doc = await db.collection("settings").doc("site").get();
  return doc.exists ? doc.data() : {};
}

async function getSetting(key) {
  const s = await getSettings();
  return s[key] ?? null;
}

async function updateSettings(data) {
  const db = await getFirestore();
  await db.collection("settings").doc("site").set(data, { merge: true });
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    if (req.body) return resolve(req.body);
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try { resolve(JSON.parse(data)); } catch { resolve({}); }
    });
  });
}

export default async function handler(req, res) {
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
        firebase_key: process.env.FIREBASE_PRIVATE_KEY ? "SET (" + process.env.FIREBASE_PRIVATE_KEY.length + " chars)" : "NOT SET",
        session: process.env.SESSION_SECRET ? "SET" : "NOT SET",
        node_env: process.env.NODE_ENV ?? "NOT SET",
      });
    }

    const JWT_SECRET = process.env.SESSION_SECRET || "bundlyplus-secret-key";

    if (method === "GET" && url === "/api/products") {
      return json(res, 200, await getProducts());
    }

    const productMatch = url.match(/^\/api\/products\/([^/]+)$/);
    if (method === "GET" && productMatch) {
      const product = await getProduct(productMatch[1]);
      return product ? json(res, 200, product) : json(res, 404, { error: "Product not found" });
    }

    if (method === "GET" && url === "/api/settings") {
      const all = await getSettings();
      const { admin_password_hash: _pw, ...pub } = all;
      return json(res, 200, pub);
    }

    if (method === "POST" && url === "/api/admin/login") {
      const bcrypt = (await import("bcryptjs")).default;
      const jwtLib = (await import("jsonwebtoken")).default;
      const body = await readBody(req);
      const { password } = body ?? {};
      if (!password) return json(res, 400, { error: "Password required" });
      const hash = await getSetting("admin_password_hash");
      const valid = hash ? bcrypt.compareSync(password, hash) : password === "admin123";
      if (!valid) return json(res, 401, { error: "Invalid password" });
      const token = jwtLib.sign({ admin: true }, JWT_SECRET, { expiresIn: "7d" });
      return json(res, 200, { token });
    }

    const requireAdmin = async () => {
      const jwtLib = (await import("jsonwebtoken")).default;
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
      return json(res, 200, await getProducts());
    }

    if (method === "POST" && url === "/api/admin/products") {
      if (!(await requireAdmin())) return;
      const body = await readBody(req);
      const product = await createProduct(body);
      return json(res, 200, product);
    }

    const adminProductMatch = url.match(/^\/api\/admin\/products\/([^/]+)$/);
    if (method === "PUT" && adminProductMatch) {
      if (!(await requireAdmin())) return;
      const body = await readBody(req);
      const product = await updateProduct(adminProductMatch[1], body);
      return product ? json(res, 200, product) : json(res, 404, { error: "Product not found" });
    }

    if (method === "DELETE" && adminProductMatch) {
      if (!(await requireAdmin())) return;
      const ok = await deleteProduct(adminProductMatch[1]);
      return ok ? json(res, 200, { success: true }) : json(res, 404, { error: "Product not found" });
    }

    if (method === "GET" && url === "/api/admin/settings") {
      if (!(await requireAdmin())) return;
      return json(res, 200, await getSettings());
    }

    if (method === "PUT" && url === "/api/admin/settings") {
      if (!(await requireAdmin())) return;
      const bcrypt = (await import("bcryptjs")).default;
      const body = await readBody(req);
      if (body.new_password) {
        if (!body.current_password) return json(res, 400, { error: "Current password required" });
        const hash = await getSetting("admin_password_hash");
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
      await updateSettings(body);
      return json(res, 200, { success: true });
    }

    return json(res, 404, { error: "Not found" });
  } catch (err) {
    console.error("API error:", err);
    return json(res, 500, { error: err?.message ?? "Internal server error" });
  }
}
