import express from "express";
import { storage } from "../server/storage";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.post("/api/checkout_sessions", async (_req, res) => {
  res.json({ error: "Card checkout coming soon. Please use WhatsApp checkout." });
});

export default app;
