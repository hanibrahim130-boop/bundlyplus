import { db } from "./db";
import { products, siteSettings, type Product, type InsertProduct } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const SEED_PRODUCTS: InsertProduct[] = [
  { id: "netflix", name: "Netflix Premium", category: "Streaming", price: 3.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", description: "Stream thousands of award-winning TV shows, movies, anime, and more.", features: ["4K Ultra HD streaming", "4 simultaneous screens", "Download for offline viewing"], hot: true, account_type: "Shared", sort_order: 1 },
  { id: "spotify", name: "Spotify Premium", category: "Music & Others", price: 2.49, image_url: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg", description: "Ad-free music listening with unlimited skips and offline mode.", features: ["Ad-free listening", "Offline downloads", "High-quality audio"], hot: true, account_type: "Shared", sort_order: 2 },
  { id: "chatgpt", name: "ChatGPT Plus", category: "Software & AI", price: 6.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", description: "GPT-4o access, faster responses, priority during peak times.", features: ["GPT-4o access", "DALL-E image generation", "Advanced data analysis"], hot: true, account_type: "Shared", sort_order: 3 },
  { id: "disney", name: "Disney+ Premium", category: "Streaming", price: 4.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg", description: "Marvel, Star Wars, Pixar, Disney and National Geographic all in one place.", features: ["4K + HDR content", "Unlimited downloads", "Disney originals"], hot: false, account_type: "Shared", sort_order: 4 },
  { id: "youtube", name: "YouTube Premium", category: "Streaming", price: 1.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg", description: "Ad-free browsing and background play with YouTube Music included.", features: ["Ad-free browsing", "Background play", "YouTube Music included"], hot: true, account_type: "Shared", sort_order: 5 },
  { id: "xbox", name: "Xbox Game Pass Ultimate", category: "Gaming", price: 5.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg", description: "Hundreds of high-quality games on console, PC and cloud.", features: ["300+ games library", "Day-one releases", "EA Play included"], hot: false, account_type: "Shared", sort_order: 6 },
  { id: "adobe", name: "Adobe Creative Cloud", category: "Software & AI", price: 9.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg", description: "All 20+ Creative Cloud apps including Photoshop, Illustrator and Premiere.", features: ["20+ apps included", "100GB cloud storage", "Adobe Fonts"], hot: false, account_type: "Private", sort_order: 7 },
  { id: "notion", name: "Notion AI", category: "Software & AI", price: 3.49, image_url: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", description: "AI-powered notes, docs, and project management all in one.", features: ["AI writing + summarizing", "Unlimited blocks", "Team collaboration"], hot: true, account_type: "Private", sort_order: 8 },
  { id: "microsoft", name: "Microsoft 365 Personal", category: "Software & AI", price: 6.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/MicrosoftOffice365.svg", description: "Word, Excel, PowerPoint and 1TB OneDrive storage.", features: ["All Office apps", "1TB cloud storage", "Advanced editing"], hot: false, account_type: "Private", sort_order: 9 },
  { id: "perplexity", name: "Perplexity AI", category: "Software & AI", price: 4.99, image_url: "", description: "Real-time AI search with verified sources and multimodal capabilities.", features: ["Real-time web search", "Source citations", "Multimodal search"], hot: true, account_type: "Shared", sort_order: 10 },
  { id: "figma", name: "Figma Professional", category: "Software & AI", price: 4.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", description: "Collaborative interface design tool for modern product teams.", features: ["Unlimited shared projects", "Version history", "Advanced sharing"], hot: true, account_type: "Shared", sort_order: 11 },
  { id: "peacock", name: "Peacock Premium", category: "Streaming", price: 2.49, image_url: "", description: "Live sports, news, WWE Network and NBC originals.", features: ["Live sports & news", "WWE Network included", "Originals"], hot: true, account_type: "Shared", sort_order: 12 },
  { id: "loom", name: "Loom Pro", category: "Software & AI", price: 3.99, image_url: "", description: "Record, share and communicate with async video messages.", features: ["Unlimited recordings", "Advanced customization", "Transcripts & summaries"], hot: true, account_type: "Shared", sort_order: 13 },
  { id: "crunchyroll", name: "Crunchyroll Premium", category: "Streaming", price: 3.49, image_url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.png", description: "The world's largest anime streaming library.", features: ["Simulcast episodes", "Ad-free streaming", "Offline downloads"], hot: false, account_type: "Shared", sort_order: 14 },
  { id: "discord", name: "Discord Nitro", category: "Music & Others", price: 2.99, image_url: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png", description: "Level up your Discord experience with animated avatars and custom emoji.", features: ["Animated avatar", "Custom emoji anywhere", "2x server boost"], hot: false, account_type: "Shared", sort_order: 15 },
  { id: "canva", name: "Canva Pro", category: "Software & AI", price: 4.49, image_url: "", description: "Design anything with premium templates, assets, and collaboration tools.", features: ["Premium templates", "Brand Kit", "Background remover"], hot: true, account_type: "Shared", sort_order: 16 },
  { id: "midjourney", name: "Midjourney Standard", category: "Software & AI", price: 7.99, image_url: "", description: "Generate stunning AI art with Midjourney's powerful image model.", features: ["15hr fast GPU/mo", "Unlimited relaxed", "General commercial terms"], hot: true, account_type: "Shared", sort_order: 17 },
  { id: "nordvpn", name: "NordVPN Premium", category: "Software & AI", price: 2.99, image_url: "", description: "Secure your internet with the world's leading VPN service.", features: ["6 devices simultaneously", "Threat Protection", "Dark Web Monitor"], hot: false, account_type: "Private", sort_order: 18 },
  { id: "expressvpn", name: "ExpressVPN", category: "Software & AI", price: 3.49, image_url: "", description: "Fast, secure VPN trusted by millions worldwide.", features: ["5 simultaneous devices", "24/7 support", "No-log policy"], hot: false, account_type: "Private", sort_order: 19 },
  { id: "duolingo", name: "Duolingo Plus", category: "Music & Others", price: 2.49, image_url: "", description: "Learn languages without ads, with offline mode and unlimited hearts.", features: ["Ad-free learning", "Unlimited hearts", "Offline mode"], hot: false, account_type: "Shared", sort_order: 20 },
  { id: "grammarly", name: "Grammarly Premium", category: "Software & AI", price: 4.99, image_url: "", description: "Advanced AI writing assistance with full-document rewrites.", features: ["Full-sentence rewrites", "Tone detector", "Plagiarism checker"], hot: true, account_type: "Private", sort_order: 21 },
  { id: "ps-plus", name: "PlayStation Plus Extra", category: "Gaming", price: 6.99, image_url: "", description: "Hundreds of PS4 and PS5 games available to download and play.", features: ["400+ games", "Online multiplayer", "Monthly free games"], hot: true, account_type: "Private", sort_order: 22 },
  { id: "ea-play", name: "EA Play Pro", category: "Gaming", price: 3.99, image_url: "", description: "Play new EA titles before release and unlimited access to vault games.", features: ["EA Vault access", "Early access trials", "10% discounts"], hot: false, account_type: "Shared", sort_order: 23 },
  { id: "apple-tv", name: "Apple TV+", category: "Streaming", price: 2.99, image_url: "", description: "Award-winning Apple Originals — series, films, documentaries.", features: ["Apple Originals", "Shareable with family", "4K HDR Dolby Vision"], hot: false, account_type: "Shared", sort_order: 24 },
  { id: "hbo-max", name: "HBO Max", category: "Streaming", price: 4.99, image_url: "", description: "HBO blockbusters, DC, Warner Bros, and Max Originals.", features: ["HBO content", "DC universe", "Ultra HD streaming"], hot: true, account_type: "Shared", sort_order: 25 },
  { id: "paramount", name: "Paramount+ Essential", category: "Streaming", price: 2.49, image_url: "", description: "Streaming home of CBS, BET, Comedy Central, Nickelodeon, and more.", features: ["Live CBS news", "Sports streaming", "Originals"], hot: false, account_type: "Shared", sort_order: 26 },
  { id: "prime-video", name: "Amazon Prime Video", category: "Streaming", price: 2.99, image_url: "", description: "Thousands of movies and TV shows including Amazon Originals.", features: ["Prime Originals", "4K streaming", "Download for offline"], hot: false, account_type: "Shared", sort_order: 27 },
  { id: "osn", name: "OSN+", category: "Streaming", price: 3.99, image_url: "", description: "HBO & Warner content, Arabic series, and OSN Originals.", features: ["HBO & Warner content", "Arabic series", "OSN Originals"], hot: true, account_type: "Shared", sort_order: 28 },
  { id: "watchit", name: "Watchit", category: "Streaming", price: 1.99, image_url: "", description: "Egyptian originals, Arabic movies and Live TV channels.", features: ["Egyptian originals", "Arabic movies", "Live TV channels"], hot: true, account_type: "Shared", sort_order: 29 },
  { id: "linear", name: "Linear Plus", category: "Software & AI", price: 4.99, image_url: "", description: "The issue tracker built for high-performance software teams.", features: ["Unlimited members", "Priority support", "Advanced integrations"], hot: false, account_type: "Shared", sort_order: 30 },
  { id: "vercel-pro", name: "Vercel Pro", category: "Software & AI", price: 5.99, image_url: "", description: "Ship web projects with unlimited deployments and edge functions.", features: ["Unlimited deployments", "Edge functions", "Advanced analytics"], hot: false, account_type: "Shared", sort_order: 31 },
  { id: "github-copilot", name: "GitHub Copilot", category: "Software & AI", price: 4.99, image_url: "", description: "AI pair programmer that helps you write code faster.", features: ["Code completions", "Chat assistance", "Multi-language support"], hot: true, account_type: "Private", sort_order: 32 },
  { id: "1password", name: "1Password Families", category: "Software & AI", price: 2.49, image_url: "", description: "The world's most-loved password manager for families.", features: ["Unlimited passwords", "5 family members", "Travel mode"], hot: false, account_type: "Private", sort_order: 33 },
  { id: "claude", name: "Claude Pro", category: "Software & AI", price: 5.99, image_url: "", description: "Anthropic's advanced AI assistant with extended context window.", features: ["Priority access", "5x more usage", "Early feature access"], hot: true, account_type: "Shared", sort_order: 34 },
  { id: "apple-music", name: "Apple Music", category: "Music & Others", price: 2.49, image_url: "", description: "100 million songs with lossless audio and spatial sound.", features: ["100M+ songs", "Lossless audio", "Spatial audio"], hot: false, account_type: "Shared", sort_order: 35 },
  { id: "tidal", name: "Tidal HiFi", category: "Music & Others", price: 2.99, image_url: "", description: "High-fidelity music streaming with Master Quality recordings.", features: ["HiFi quality", "Dolby Atmos", "Exclusive content"], hot: false, account_type: "Shared", sort_order: 36 },
  { id: "roblox", name: "Roblox Premium", category: "Gaming", price: 2.99, image_url: "", description: "Get monthly Robux allowance and access to Premium perks.", features: ["1000 Robux/mo", "Trading privileges", "Premium-only items"], hot: true, account_type: "Private", sort_order: 37 },
  { id: "steam", name: "Steam Gift Card $20", category: "Gaming", price: 16.99, image_url: "", description: "Add funds to your Steam Wallet and buy any game on the platform.", features: ["Instant delivery", "Any Steam game", "No expiry"], hot: false, account_type: "Private", sort_order: 38 },
  { id: "minecraft", name: "Minecraft Java Edition", category: "Gaming", price: 7.99, image_url: "", description: "The original block-building survival game. Lifetime license.", features: ["Lifetime access", "Multiplayer servers", "Mod support"], hot: true, account_type: "Private", sort_order: 39 },
  { id: "office365-family", name: "Microsoft 365 Family", category: "Software & AI", price: 9.99, image_url: "", description: "Office apps + 1TB OneDrive each for up to 6 people.", features: ["Up to 6 users", "1TB each", "Premium features"], hot: false, account_type: "Shared", sort_order: 40 },
  { id: "skillshare", name: "Skillshare Premium", category: "Music & Others", price: 3.49, image_url: "", description: "Unlimited access to 40,000+ online classes across creative fields.", features: ["40k+ classes", "Offline access", "No ads"], hot: false, account_type: "Shared", sort_order: 41 },
];

const DEFAULT_SETTINGS: Record<string, string> = {
  site_name: "Bundly+",
  hero_title: "Stream More,\nPay Less.",
  hero_subtitle: "Premium subscriptions at unbeatable prices — delivered via WhatsApp.",
  hero_cta: "Browse All Plans",
  whatsapp_number: "96176171003",
  admin_password_hash: bcrypt.hashSync("admin123", 10),
};

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
    const existing = await db.select().from(products).limit(1);
    if (existing.length === 0) {
      await db.insert(products).values(SEED_PRODUCTS);
    }
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await db.insert(siteSettings).values({ key, value }).onConflictDoNothing();
    }
  }

  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(products.sort_order);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const rows = await db.select().from(products).where(eq(products.id, id));
    return rows[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const all = await db.select().from(products).orderBy(products.sort_order);
    const maxOrder = all.reduce((m, p) => Math.max(m, p.sort_order), 0);
    const rows = await db.insert(products).values({ ...product, sort_order: maxOrder + 1 }).returning();
    return rows[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const rows = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return rows[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const rows = await db.delete(products).where(eq(products.id, id)).returning();
    return rows.length > 0;
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
