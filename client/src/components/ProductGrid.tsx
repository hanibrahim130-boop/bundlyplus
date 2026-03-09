import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard, { type Product } from "./ProductCard";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";

const CATEGORIES = ["All", "Streaming", "Gaming", "Software & AI", "Music & Others"];
const INITIAL_VISIBLE = 12;

type SortKey = "default" | "price-asc" | "price-desc" | "name-asc";
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name-asc", label: "Name: A-Z" },
];

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/products.json");
        if (!res.ok) throw new Error("Failed to fetch products");
        setProducts(await res.json());
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const q = (e as CustomEvent<string>).detail ?? "";
      setSearchQuery(q);
      setActiveCategory("All");
      setVisibleCount(INITIAL_VISIBLE);
    };
    window.addEventListener("bundlyplus:search", handler);
    return () => window.removeEventListener("bundlyplus:search", handler);
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activeCategory, sortKey, searchQuery]);

  const filtered = useMemo(() => {
    let list = activeCategory === "All" ? [...products] : products.filter((p) => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    switch (sortKey) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "name-asc": list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [products, activeCategory, sortKey]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-white/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-sm text-red-400">{error}</p>;

  const activeSort = SORT_OPTIONS.find((o) => o.key === sortKey)!;

  return (
    <div className="space-y-6" id="products">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1 pb-1">
          {CATEGORIES.map((cat) => {
            const count = cat === "All" ? products.length : products.filter((p) => p.category === cat).length;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? "bg-[#ff7a4d] text-black shadow-[0_0_20px_rgba(255,122,77,0.35)]"
                    : "border border-white/10 text-slate-400 hover:border-white/25 hover:text-white bg-white/[0.03]"
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-[10px] ${active ? "text-black/60" : "text-white/30"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setShowSortMenu((s) => !s)}
            data-testid="button-sort"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-white/60 hover:border-white/25 hover:text-white transition-all whitespace-nowrap"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            <ChevronDown className={`h-3 w-3 transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 z-50 w-52 rounded-2xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setSortKey(opt.key); setShowSortMenu(false); }}
                      data-testid={`sort-${opt.key}`}
                      className={`w-full px-4 py-3 text-left text-xs font-medium transition-colors border-b border-white/5 last:border-0 ${
                        sortKey === opt.key
                          ? "bg-[#ff7a4d]/15 text-[#ff7a4d]"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {searchQuery && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Results for</span>
          <span className="flex items-center gap-1.5 rounded-full border border-[#ff7a4d]/30 bg-[#ff7a4d]/10 px-3 py-1 text-xs font-bold text-[#ff7a4d]">
            "{searchQuery}"
            <button onClick={() => setSearchQuery("")} className="hover:text-white transition-colors">
              <X className="h-3 w-3" />
            </button>
          </span>
          <span className="text-xs text-white/30">{filtered.length} found</span>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500 py-10 text-center">
          {searchQuery ? `No products found for "${searchQuery}".` : "No products in this category yet."}
        </p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.4, delay: Math.min(index % INITIAL_VISIBLE, 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {remaining > 0 && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setVisibleCount((v) => v + INITIAL_VISIBLE)}
                data-testid="button-show-more"
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-8 py-3 text-sm font-bold text-white/60 hover:border-[#ff7a4d]/40 hover:text-[#ff7a4d] transition-all"
              >
                More ({remaining})
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
