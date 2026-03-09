# Bundly+ Marketplace

Lebanese digital subscription marketplace — ported from bundlyplus.vercel.app into Replit Vite+React+Express.

## Architecture

**Frontend:** React + Vite (client/)  
**Backend:** Express (server/)  
**Styling:** Tailwind CSS  
**State:** Zustand (cart, localStorage persistence)  
**Animations:** Framer Motion throughout

## Design System

- Background: `#050505` (near-black)
- Brand orange: `#ff7a4d`
- Brand cyan: `#39efd0`
- Fonts: Syne (headings via `var(--font-syne)`), Inter (body)
- Dark glassmorphism cards with `border-white/[0.08]`

## Project Structure

```
client/src/
  pages/
    home.tsx              - Main landing page (assembles all sections)
  components/
    CustomCursor.tsx      - Custom animated cursor
    Navbar.tsx            - Sticky navbar with cart counter + auth modal
    HeroSection.tsx       - Hero with 3D product cards, particle field, counters
    MarqueeTicker.tsx     - Two-row scrolling text ticker (opposite directions)
    FeatureBento.tsx      - "Bundle & Save Big" bento grid + embedded ProductGrid
    ProductGrid.tsx       - Filterable+sortable product grid with show-more
    ProductCard.tsx       - Product card with duration selector (1/3/6/12mo)
    SubscriptionSection.tsx - Bundle plans (Starter $8.99 / Popular $15.99 / Ultimate $25.99)
    Testimonials.tsx      - "Trusted by thousands" review section (6 reviews)
    MockupSection.tsx     - Phone mockup section with WhatsApp CTA
    CartDrawer.tsx        - Slide-in cart with WhatsApp + card checkout
    PaymentMethods.tsx    - Whish / OMT / USDT payment badges
    AuthModal.tsx         - Login modal (stubbed, "coming soon")
    Footer.tsx            - Footer with CTA, links, socials
  store/
    cartStore.ts          - Zustand cart store (localStorage: "bundlyplus-cart")

server/
  storage.ts    - In-memory storage with 41 seed products
  routes.ts     - GET /api/products, GET /api/products/:id, POST /api/checkout_sessions
```

## Key Features

- **Product catalog:** 41 products across Streaming, Gaming, Software & AI, Music & Others
- **Duration selector:** 1mo / 3mo (-5%) / 6mo (-10%) / 12mo (-15%) per product
- **Sort:** Default, Price Low→High, Price High→Low, Name A-Z
- **Show more:** Initially shows 12 products, "More (N)" button for rest
- **Bundle plans:** Starter 2 subs, Popular 4 subs, Ultimate 6 subs — clickable + WhatsApp order
- **Cart:** Zustand store with localStorage persistence, quantity controls
- **Checkout:** WhatsApp order (primary) + card checkout stub
- **WhatsApp number:** 96176171003

## API Endpoints

- `GET /api/products` — returns all 41 products
- `GET /api/products/:id` — single product
- `POST /api/checkout_sessions` — stub, returns WhatsApp fallback message

## Running

`npm run dev` on port 5000 (Express + Vite on same port).

## Deployment Rule

**After every successful edit, immediately push the changed files to GitHub.**  
GitHub repo: `hanibrahim130-boop/bundlyplus` (main branch)  
Vercel is connected to this repo and auto-deploys on every push.

Push workflow (using GitHub API via `@replit/connectors-sdk`):
1. Collect changed file(s) content
2. Create a new git tree on top of the latest commit tree (get latest SHA from `/repos/.../git/refs/heads/main`)
3. Create a commit pointing to the new tree
4. PATCH the `refs/heads/main` ref to the new commit SHA

Connection ID: `connection:conn_github_01KKA8X6B2F85NXZQZJJG1X31H`
