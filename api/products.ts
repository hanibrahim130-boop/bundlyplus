import type { IncomingMessage, ServerResponse } from "http";
import { storage } from "../server/storage";

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  try {
    const products = await storage.getProducts();
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.end(JSON.stringify(products));
  } catch {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Failed to fetch products" }));
  }
}
