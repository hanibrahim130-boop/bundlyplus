import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Search, X, Menu } from "lucide-react";
import AuthModal from "./AuthModal";
import { useCartStore } from "../store/cartStore";
import { useLocation } from "wouter";
import brandFull from "@assets/bundly-logo-trimmed.png";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "Pricing", href: "#products" },
  { label: "Features", href: "#features" },
  { label: "Blog", href: "#" },
];

export default function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const openCart = () => {
    setMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent("bundlyplus:cart", { detail: true }));
  };

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    if (href === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openSearch = () => {
    setMobileMenuOpen(false);
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
    navigate(`/?q=${encodeURIComponent(q)}`);
    setTimeout(() => {
      document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
    }, 120);
    closeSearch();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeSearch(); setMobileMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-3 py-3 sm:px-6 sm:py-4 md:px-12 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-black/60 border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "backdrop-blur-md bg-black/10"
        }`}
      >
        <button
          onClick={() => scrollTo("#")}
          className="flex items-center gap-2.5 group shrink-0"
          data-testid="link-logo"
        >
          <img src={brandFull} alt="Bundly Plus" className="h-6 w-auto object-contain" />
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
                animate={{ opacity: 1, width: "clamp(120px, 42vw, 220px)" }}
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
                  placeholder="Search..."
                  data-testid="input-search"
                  className="w-full rounded-full border border-white/15 bg-white/8 py-2 pl-8 pr-8 text-xs text-white placeholder-white/30 outline-none focus:border-[#fb7246]/50 focus:bg-white/10 transition-all"
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
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#fb7246] text-[10px] font-bold text-white shadow-[0_0_10px_rgba(255,122,77,0.5)]">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setAuthOpen(true)}
            data-testid="button-login"
            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#fb7246] text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(255,122,77,0.35)] hover:shadow-[0_0_35px_rgba(255,122,77,0.55)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap ${searchOpen ? "hidden sm:flex" : "flex"}`}
          >
            <User className="h-4 w-4" />
            <span className="hidden xs:inline">Log In</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            data-testid="button-mobile-menu"
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white transition-all"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[98] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[60px] left-3 right-3 z-[99] rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-2xl overflow-hidden md:hidden"
            >
              <div className="p-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="border-t border-white/[0.07] p-4 flex gap-3">
                <button
                  onClick={openCart}
                  data-testid="button-mobile-cart"
                  className="relative flex flex-1 items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10 transition-all"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Cart
                  {count > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#fb7246] text-[10px] font-bold text-white">
                      {count}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); setAuthOpen(true); }}
                  data-testid="button-mobile-login"
                  className="flex flex-1 items-center justify-center gap-2 py-3 rounded-xl bg-[#fb7246] text-sm font-bold text-black shadow-[0_0_20px_rgba(255,122,77,0.3)] transition-all"
                >
                  <User className="h-4 w-4" />
                  Log In
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
