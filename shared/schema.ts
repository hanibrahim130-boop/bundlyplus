import { sql } from "drizzle-orm";
import { pgTable, text, varchar, doublePrecision, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().default("Streaming"),
  price: doublePrecision("price").notNull().default(0),
  description: text("description").notNull().default(""),
  features: text("features").array().notNull().default(sql`'{}'::text[]`),
  image_url: text("image_url").notNull().default(""),
  hot: boolean("hot").notNull().default(false),
  account_type: text("account_type").notNull().default("Shared"),
  sort_order: integer("sort_order").notNull().default(0),
});

export const insertProductSchema = createInsertSchema(products);
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
