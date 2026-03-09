import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Search, X } from "lucide-react";
import AuthModal from "./AuthModal";
import { useCartStore } from "../store/cartStore";
import { useLocation } from "wouter";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Pricing", href: "#products" },
  { label: "Features", href: "#features" },
  { label: "Blog", href: "#" },
];

function BundlyLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5h12c3.3 0 6 2.7 6 6s-2.7 6-6 6H8V5z" fill="white" />
      <path d="M8 17h12.5c3.6 0 6.5 2.9 6.5 6.5S24.1 30 20.5 30H8V17z" fill="white" />
      <rect x="12" y="9" width="7.5" height="4" rx="2" fill="#050505" />
      <rect x="12" y="20" width="8.5" height="5.5" rx="2.75" fill="#050505" />
      <rect x="3" y="8" width="3.5" height="3.5" rx="0.8" fill="#ff7a4d" opacity="0.5" />
      <rect x="3" y="14" width="3.5" height="3.5" rx="0.8" fill="#ff7a4d" />
      <rect x="3" y="20" width="3.5" height="3.5" rx="0.8" fill="#ff7a4d" />
    </svg>
  );
}

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const openCart = () => {
    window.dispatchEvent(new CustomEvent("bundlyplus:cart", { detail: true }));
  };

  const scrollTo = (href: string) => {
    if (href === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 80);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    window.dispatchEvent(new CustomEvent("bundlyplus:search", { detail: q }));
    const el = document.querySelector("#products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    closeSearch();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeSearch(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4 md:px-12 backdrop-blur-md bg-black/10"
      >
        <button
          onClick={() => scrollTo("#")}
          className="flex items-center gap-2.5 group shrink-0"
          data-testid="link-logo"
        >
          <BundlyLogo size={34} />
          <span
            style={{ fontFamily: "var(--font-syne)" }}
            className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-[#ff7a4d] transition-colors"
          >
            Bundly<span className="text-[#ff7a4d]">+</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-medium text-white/50 hover:text-white transition-colors"
              data-testid={`link-nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.form
                key="search-form"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "220px" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                onSubmit={handleSearch}
                className="relative flex items-center overflow-hidden"
              >
                <Search className="absolute left-3 h-3.5 w-3.5 text-white/40 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  data-testid="input-search"
                  className="w-full rounded-full border border-white/15 bg-white/8 py-2 pl-8 pr-8 text-xs text-white placeholder-white/30 outline-none focus:border-[#ff7a4d]/50 focus:bg-white/10 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="absolute right-2.5 text-white/30 hover:text-white transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.form>
            ) : (
              <motion.button
                key="search-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={openSearch}
                data-testid="button-search"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Search className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={openCart}
            data-testid="button-cart-nav"
            className="relative hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff7a4d] text-[10px] font-bold text-white shadow-[0_0_10px_rgba(255,122,77,0.5)]">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setAuthOpen(true)}
            data-testid="button-login"
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#ff7a4d] text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(255,122,77,0.35)] hover:shadow-[0_0_35px_rgba(255,122,77,0.55)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            <User className="h-4 w-4" />
            Log In
          </button>
        </div>
      </motion.nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
