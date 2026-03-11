import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);

let initError: Error | null = null;
const ready = registerRoutes(httpServer, app).catch((err) => {
  console.error("API init error:", err);
  initError = err;
});

export default async function handler(req: any, res: any) {
  await ready;
  if (initError) {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: "Server initialization failed",
      detail: initError.message,
    });
  }
  app(req, res);
}
