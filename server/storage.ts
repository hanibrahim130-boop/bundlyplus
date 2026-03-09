export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  description: string;
  features: string[];
  hot?: boolean;
  account_type?: "Shared" | "Private";
}

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
}

const SEED_PRODUCTS: Product[] = [
  { id: "netflix", name: "Netflix Premium", category: "Streaming", price: 3.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", description: "Stream thousands of award-winning TV shows, movies, anime, and more.", features: ["4K Ultra HD streaming", "4 simultaneous screens", "Download for offline viewing"], hot: true, account_type: "Shared" },
  { id: "spotify", name: "Spotify Premium", category: "Music & Others", price: 2.49, image_url: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg", description: "Ad-free music listening with unlimited skips and offline mode.", features: ["Ad-free listening", "Offline downloads", "High-quality audio"], hot: true, account_type: "Shared" },
  { id: "chatgpt", name: "ChatGPT Plus", category: "Software & AI", price: 6.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", description: "GPT-4o access, faster responses, priority during peak times.", features: ["GPT-4o access", "DALL-E image generation", "Advanced data analysis"], hot: true, account_type: "Shared" },
  { id: "disney", name: "Disney+ Premium", category: "Streaming", price: 4.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg", description: "Marvel, Star Wars, Pixar, Disney and National Geographic all in one place.", features: ["4K + HDR content", "Unlimited downloads", "Disney originals"], hot: false, account_type: "Shared" },
  { id: "youtube", name: "YouTube Premium", category: "Streaming", price: 1.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg", description: "Ad-free browsing and background play with YouTube Music included.", features: ["Ad-free browsing", "Background play", "YouTube Music included"], hot: true, account_type: "Shared" },
  { id: "xbox", name: "Xbox Game Pass Ultimate", category: "Gaming", price: 5.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg", description: "Hundreds of high-quality games on console, PC and cloud.", features: ["300+ games library", "Day-one releases", "EA Play included"], hot: false, account_type: "Shared" },
  { id: "adobe", name: "Adobe Creative Cloud", category: "Software & AI", price: 9.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg", description: "All 20+ Creative Cloud apps including Photoshop, Illustrator and Premiere.", features: ["20+ apps included", "100GB cloud storage", "Adobe Fonts"], hot: false, account_type: "Private" },
  { id: "notion", name: "Notion AI", category: "Software & AI", price: 3.49, image_url: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", description: "AI-powered notes, docs, and project management all in one.", features: ["AI writing + summarizing", "Unlimited blocks", "Team collaboration"], hot: true, account_type: "Private" },
  { id: "microsoft", name: "Microsoft 365 Personal", category: "Software & AI", price: 6.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/MicrosoftOffice365.svg", description: "Word, Excel, PowerPoint and 1TB OneDrive storage.", features: ["All Office apps", "1TB cloud storage", "Advanced editing"], hot: false, account_type: "Private" },
  { id: "perplexity", name: "Perplexity AI", category: "Software & AI", price: 4.99, image_url: "", description: "Real-time AI search with verified sources and multimodal capabilities.", features: ["Real-time web search", "Source citations", "Multimodal search"], hot: true, account_type: "Shared" },
  { id: "figma", name: "Figma Professional", category: "Software & AI", price: 4.99, image_url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", description: "Collaborative interface design tool for modern product teams.", features: ["Unlimited shared projects", "Version history", "Advanced sharing"], hot: true, account_type: "Shared" },
  { id: "peacock", name: "Peacock Premium", category: "Streaming", price: 2.49, image_url: "", description: "Live sports, news, WWE Network and NBC originals.", features: ["Live sports & news", "WWE Network included", "Originals"], hot: true, account_type: "Shared" },
  { id: "loom", name: "Loom Pro", category: "Software & AI", price: 3.99, image_url: "", description: "Record, share and communicate with async video messages.", features: ["Unlimited recordings", "Advanced customization", "Transcripts & summaries"], hot: true, account_type: "Shared" },
  { id: "crunchyroll", name: "Crunchyroll Premium", category: "Streaming", price: 3.49, image_url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.png", description: "The world's largest anime streaming library.", features: ["Simulcast episodes", "Ad-free streaming", "Offline downloads"], hot: false, account_type: "Shared" },
  { id: "discord", name: "Discord Nitro", category: "Music & Others", price: 2.99, image_url: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png", description: "Level up your Discord experience with animated avatars and custom emoji.", features: ["Animated avatar", "Custom emoji anywhere", "2x server boost"], hot: false, account_type: "Shared" },
  { id: "canva", name: "Canva Pro", category: "Software & AI", price: 4.49, image_url: "", description: "Design anything with premium templates, assets, and collaboration tools.", features: ["Premium templates", "Brand Kit", "Background remover"], hot: true, account_type: "Shared" },
  { id: "midjourney", name: "Midjourney Standard", category: "Software & AI", price: 7.99, image_url: "", description: "Generate stunning AI art with Midjourney's powerful image model.", features: ["15hr fast GPU/mo", "Unlimited relaxed", "General commercial terms"], hot: true, account_type: "Shared" },
  { id: "nordvpn", name: "NordVPN Premium", category: "Software & AI", price: 2.99, image_url: "", description: "Secure your internet with the world's leading VPN service.", features: ["6 devices simultaneously", "Threat Protection", "Dark Web Monitor"], hot: false, account_type: "Private" },
  { id: "expressvpn", name: "ExpressVPN", category: "Software & AI", price: 3.49, image_url: "", description: "Fast, secure VPN trusted by millions worldwide.", features: ["5 simultaneous devices", "24/7 support", "No-log policy"], hot: false, account_type: "Private" },
  { id: "duolingo", name: "Duolingo Plus", category: "Music & Others", price: 2.49, image_url: "", description: "Learn languages without ads, with offline mode and unlimited hearts.", features: ["Ad-free learning", "Unlimited hearts", "Offline mode"], hot: false, account_type: "Shared" },
  { id: "grammarly", name: "Grammarly Premium", category: "Software & AI", price: 4.99, image_url: "", description: "Advanced AI writing assistance with full-document rewrites.", features: ["Full-sentence rewrites", "Tone detector", "Plagiarism checker"], hot: true, account_type: "Private" },
  { id: "ps-plus", name: "PlayStation Plus Extra", category: "Gaming", price: 6.99, image_url: "", description: "Hundreds of PS4 and PS5 games available to download and play.", features: ["400+ games", "Online multiplayer", "Monthly free games"], hot: true, account_type: "Private" },
  { id: "ea-play", name: "EA Play Pro", category: "Gaming", price: 3.99, image_url: "", description: "Play new EA titles before release and unlimited access to vault games.", features: ["EA Vault access", "Early access trials", "10% discounts"], hot: false, account_type: "Shared" },
  { id: "apple-tv", name: "Apple TV+", category: "Streaming", price: 2.99, image_url: "", description: "Award-winning Apple Originals — series, films, documentaries.", features: ["Apple Originals", "Shareable with family", "4K HDR Dolby Vision"], hot: false, account_type: "Shared" },
  { id: "hbo-max", name: "HBO Max", category: "Streaming", price: 4.99, image_url: "", description: "HBO blockbusters, DC, Warner Bros, and Max Originals.", features: ["HBO content", "DC universe", "Ultra HD streaming"], hot: true, account_type: "Shared" },
  { id: "paramount", name: "Paramount+ Essential", category: "Streaming", price: 2.49, image_url: "", description: "Streaming home of CBS, BET, Comedy Central, Nickelodeon, and more.", features: ["Live CBS news", "Sports streaming", "Originals"], hot: false, account_type: "Shared" },
  { id: "prime-video", name: "Amazon Prime Video", category: "Streaming", price: 2.99, image_url: "", description: "Thousands of movies and TV shows including Amazon Originals.", features: ["Prime Originals", "4K streaming", "Download for offline"], hot: false, account_type: "Shared" },
  { id: "osn", name: "OSN+", category: "Streaming", price: 3.99, image_url: "", description: "HBO & Warner content, Arabic series, and OSN Originals.", features: ["HBO & Warner content", "Arabic series", "OSN Originals"], hot: true, account_type: "Shared" },
  { id: "watchit", name: "Watchit", category: "Streaming", price: 1.99, image_url: "", description: "Egyptian originals, Arabic movies and Live TV channels.", features: ["Egyptian originals", "Arabic movies", "Live TV channels"], hot: true, account_type: "Shared" },
  { id: "linear", name: "Linear Plus", category: "Software & AI", price: 4.99, image_url: "", description: "The issue tracker built for high-performance software teams.", features: ["Unlimited members", "Priority support", "Advanced integrations"], hot: false, account_type: "Shared" },
  { id: "vercel-pro", name: "Vercel Pro", category: "Software & AI", price: 5.99, image_url: "", description: "Ship web projects with unlimited deployments and edge functions.", features: ["Unlimited deployments", "Edge functions", "Advanced analytics"], hot: false, account_type: "Shared" },
  { id: "github-copilot", name: "GitHub Copilot", category: "Software & AI", price: 4.99, image_url: "", description: "AI pair programmer that helps you write code faster.", features: ["Code completions", "Chat assistance", "Multi-language support"], hot: true, account_type: "Private" },
  { id: "1password", name: "1Password Families", category: "Software & AI", price: 2.49, image_url: "", description: "The world's most-loved password manager for families.", features: ["Unlimited passwords", "5 family members", "Travel mode"], hot: false, account_type: "Private" },
  { id: "claude", name: "Claude Pro", category: "Software & AI", price: 5.99, image_url: "", description: "Anthropic's advanced AI assistant with extended context window.", features: ["Priority access", "5x more usage", "Early feature access"], hot: true, account_type: "Shared" },
  { id: "apple-music", name: "Apple Music", category: "Music & Others", price: 2.49, image_url: "", description: "100 million songs with lossless audio and spatial sound.", features: ["100M+ songs", "Lossless audio", "Spatial audio"], hot: false, account_type: "Shared" },
  { id: "tidal", name: "Tidal HiFi", category: "Music & Others", price: 2.99, image_url: "", description: "High-fidelity music streaming with Master Quality recordings.", features: ["HiFi quality", "Dolby Atmos", "Exclusive content"], hot: false, account_type: "Shared" },
  { id: "roblox", name: "Roblox Premium", category: "Gaming", price: 2.99, image_url: "", description: "Get monthly Robux allowance and access to Premium perks.", features: ["1000 Robux/mo", "Trading privileges", "Premium-only items"], hot: true, account_type: "Private" },
  { id: "steam", name: "Steam Gift Card $20", category: "Gaming", price: 16.99, image_url: "", description: "Add funds to your Steam Wallet and buy any game on the platform.", features: ["Instant delivery", "Any Steam game", "No expiry"], hot: false, account_type: "Private" },
  { id: "minecraft", name: "Minecraft Java Edition", category: "Gaming", price: 7.99, image_url: "", description: "The original block-building survival game. Lifetime license.", features: ["Lifetime access", "Multiplayer servers", "Mod support"], hot: true, account_type: "Private" },
  { id: "office365-family", name: "Microsoft 365 Family", category: "Software & AI", price: 9.99, image_url: "", description: "Office apps + 1TB OneDrive each for up to 6 people.", features: ["Up to 6 users", "1TB each", "Premium features"], hot: false, account_type: "Shared" },
  { id: "skillshare", name: "Skillshare Premium", category: "Music & Others", price: 3.49, image_url: "", description: "Unlimited access to 40,000+ online classes across creative fields.", features: ["40k+ classes", "Offline access", "No ads"], hot: false, account_type: "Shared" },
];

export class MemStorage implements IStorage {
  private products: Map<string, Product>;

  constructor() {
    this.products = new Map();
    SEED_PRODUCTS.forEach((p) => this.products.set(p.id, p));
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }
}

export const storage = new MemStorage();
