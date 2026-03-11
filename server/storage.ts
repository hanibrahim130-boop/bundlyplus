import { db } from "./db";
import { firestore } from "./firebase";
import { siteSettings, type Product, type InsertProduct } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const PRODUCTS_COLLECTION = "products";

const DEFAULT_SETTINGS: Record<string, string> = {
  site_name: "Bundly+",
  hero_title: "Stream More,\nPay Less.",
  hero_subtitle: "Premium subscriptions at unbeatable prices — delivered via WhatsApp.",
  hero_cta: "Browse All Plans",
  whatsapp_number: "96176171003",
  admin_password_hash: bcrypt.hashSync("H@ni$@minon099", 10),
};

function docToProduct(id: string, data: FirebaseFirestore.DocumentData, index = 0): Product {
  return {
    id,
    name: data.name ?? "",
    category: data.category ?? "Other",
    price: typeof data.price === "number" ? data.price : parseFloat(data.price ?? "0"),
    description: data.description ?? "",
    features: Array.isArray(data.features) ? data.features : [],
    image_url: data.image_url ?? "",
    hot: data.hot ?? false,
    account_type: data.account_type ?? "Shared",
    sort_order: typeof data.sort_order === "number" ? data.sort_order : (data.created_at ?? index),
  };
}

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getSettings(): Promise<Record<string, string>>;
  getSetting(key: string): Promise<string | undefined>;
  updateSettings(settings: Record<string, string>): Promise<void>;
}

export class DbStorage implements IStorage {
  async initialize() {
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await db.insert(siteSettings).values({ key, value }).onConflictDoNothing();
    }
  }

  async getProducts(): Promise<Product[]> {
    const snap = await firestore.collection(PRODUCTS_COLLECTION).get();
    const all = snap.docs.map((doc, i) => docToProduct(doc.id, doc.data(), i));
    return all.sort((a, b) => {
      if (typeof a.sort_order === "number" && typeof b.sort_order === "number") {
        return a.sort_order - b.sort_order;
      }
      return 0;
    });
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const doc = await firestore.collection(PRODUCTS_COLLECTION).doc(id).get();
    if (!doc.exists) return undefined;
    return docToProduct(doc.id, doc.data()!);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const snap = await firestore.collection(PRODUCTS_COLLECTION).get();
    const maxOrder = snap.docs.reduce((m, d) => {
      const so = d.data().sort_order;
      return typeof so === "number" ? Math.max(m, so) : m;
    }, 0);

    const data = {
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description ?? "",
      features: product.features ?? [],
      image_url: product.image_url ?? "",
      hot: product.hot ?? false,
      account_type: product.account_type ?? "Shared",
      sort_order: maxOrder + 1,
      created_at: Date.now(),
    };
    const ref = await firestore.collection(PRODUCTS_COLLECTION).add(data);
    return docToProduct(ref.id, data);
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const ref = firestore.collection(PRODUCTS_COLLECTION).doc(id);
    const doc = await ref.get();
    if (!doc.exists) return undefined;
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(product)) {
      if (v !== undefined) updates[k] = v;
    }
    await ref.update(updates);
    const updated = await ref.get();
    return docToProduct(updated.id, updated.data()!);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const ref = firestore.collection(PRODUCTS_COLLECTION).doc(id);
    const doc = await ref.get();
    if (!doc.exists) return false;
    await ref.delete();
    return true;
  }

  async getSettings(): Promise<Record<string, string>> {
    const rows = await db.select().from(siteSettings);
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  }

  async getSetting(key: string): Promise<string | undefined> {
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return rows[0]?.value;
  }

  async updateSettings(settings: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(settings)) {
      await db.insert(siteSettings).values({ key, value }).onConflictDoUpdate({ target: siteSettings.key, set: { value } });
    }
  }
}

export const storage = new DbStorage();
