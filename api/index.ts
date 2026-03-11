import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);

const ready = registerRoutes(httpServer, app).catch((err) => {
  console.error("Admin API init error:", err);
});

export default async function handler(req: any, res: any) {
  await ready;
  app(req, res);
}
