import type { IncomingMessage, ServerResponse } from "http";
import { storage } from "../../server/storage";

export default async function handler(req: IncomingMessage & { query?: Record<string, string> }, res: ServerResponse) {
  try {
    const url = req.url ?? "";
    const id = url.split("/").filter(Boolean).pop() ?? "";
    const product = await storage.getProduct(id);
    if (!product) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Product not found" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.end(JSON.stringify(product));
  } catch {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Failed to fetch product" }));
  }
}
