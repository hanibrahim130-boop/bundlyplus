import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.SESSION_SECRET || "bundlyplus-secret-key";

function makeToken() {
  return jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "7d" });
}

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  await storage.initialize();

  app.get("/api/products", async (_req, res) => {
    try {
      res.json(await storage.getProducts());
    } catch {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(String(req.params.id));
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/settings", async (_req, res) => {
    try {
      const all = await storage.getSettings();
      const { admin_password_hash: _pw, ...pub } = all;
      res.json(pub);
    } catch {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body ?? {};
      if (!password) return res.status(400).json({ error: "Password required" });
      const hash = await storage.getSetting("admin_password_hash");
      const valid = hash ? bcrypt.compareSync(password, hash) : password === "admin123";
      if (!valid) return res.status(401).json({ error: "Invalid password" });
      res.json({ token: makeToken() });
    } catch {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/admin/verify", adminAuth, (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/admin/products", adminAuth, async (_req, res) => {
    try {
      res.json(await storage.getProducts());
    } catch {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/admin/products", adminAuth, async (req, res) => {
    try {
      const parsed = insertProductSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
      const product = await storage.createProduct(parsed.data);
      res.json(product);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", adminAuth, async (req, res) => {
    try {
      const partial = insertProductSchema.partial().safeParse(req.body);
      if (!partial.success) return res.status(400).json({ error: partial.error.issues });
      const product = await storage.updateProduct(String(req.params.id), partial.data);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", adminAuth, async (req, res) => {
    try {
      const ok = await storage.deleteProduct(String(req.params.id));
      if (!ok) return res.status(404).json({ error: "Product not found" });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.get("/api/admin/settings", adminAuth, async (_req, res) => {
    try {
      res.json(await storage.getSettings());
    } catch {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", adminAuth, async (req, res) => {
    try {
      const body = req.body ?? {};
      if (body.new_password) {
        if (!body.current_password) return res.status(400).json({ error: "Current password required" });
        const hash = await storage.getSetting("admin_password_hash");
        const valid = hash ? bcrypt.compareSync(body.current_password, hash) : body.current_password === "admin123";
        if (!valid) return res.status(401).json({ error: "Current password is incorrect" });
        body.admin_password_hash = bcrypt.hashSync(body.new_password, 10);
        delete body.new_password;
        delete body.current_password;
      } else {
        delete body.admin_password_hash;
        delete body.new_password;
        delete body.current_password;
      }
      await storage.updateSettings(body);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  return httpServer;
}
