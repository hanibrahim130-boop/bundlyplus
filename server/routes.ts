import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/checkout_sessions", async (req, res) => {
    const { items } = req.body ?? {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing required field: items (must be a non-empty array)" });
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.id || typeof item.id !== "string") {
        return res.status(400).json({ error: `Item at index ${i} is missing required field: id` });
      }
      if (item.quantity == null || typeof item.quantity !== "number" || item.quantity < 1) {
        return res.status(400).json({ error: `Item at index ${i} is missing or has invalid field: quantity (must be a positive number)` });
      }
    }

    res.json({ message: "Card checkout coming soon. Please use WhatsApp checkout." });
  });

  return httpServer;
}
