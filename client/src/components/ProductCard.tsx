import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCartStore } from "../store/cartStore";
import { useState, useRef } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category: string;
  features: string[];
  hot?: boolean;
  account_type?: "Shared" | "Private";
};

const DURATIONS = [
  { label: "1mo", months: 1, discount: 0 },
  { label: "3mo", months: 3, discount: 5 },
  { label: "6mo", months: 6, discount: 10 },
  { label: "12mo", months: 12, discount: 15 },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  "Streaming": { bg: "bg-[#E50914]/15", text: "text-[#ff8585]" },
  "Gaming": { bg: "bg-[#107C10]/15", text: "text-[#7ed97e]" },
  "Software & AI": { bg: "bg-[#0057FF]/15", text: "text-[#8DB1FF]" },
  "Music & Others": { bg: "bg-[#1DB954]/15", text: "text-[#7ed9a8]" },
};

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);
  const [duration, setDuration] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 220, damping: 28 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const glowX = useTransform(mouseX, [-0.5, 0.5], ["15%", "85%"]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ["15%", "85%"]);

  const selectedDuration = DURATIONS[duration];
  const discountedPrice = product.price * (1 - selectedDuration.discount / 100);
  const initials = product.name.slice(0, 2).toUpperCase();
  const colors = categoryColors[product.category] ?? { bg: "bg-white/5", text: "text-white/50" };
  const accountType = product.account_type ?? "Shared";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCardClick = () => {
    window.location.href = `/product/${product.id}`;
  };

  const handleAdd = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    addToCart({
      id: `${product.id}-${selectedDuration.months}mo`,
      name: `${product.name} (${selectedDuration.label})`,
      price: discountedPrice,
      image_url: product.image_url,
      description: product.description,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    window.dispatchEvent(new CustomEvent("bundlyplus:cart", { detail: true }));
  };

  return (
    <div
      ref={cardRef}
      style={{ perspective: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        onClick={handleCardClick}
        style={{ rotateX, rotateY, display: "flex", flexDirection: "column" }}
        className="group relative rounded-xl sm:rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,122,77,0.08)] cursor-pointer"
        data-testid={`card-product-${product.id}`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glowX}px ${glowY}px, rgba(255,122,77,0.07), transparent 60%)`,
          }}
        />

        {product.hot && (
          <div className="absolute right-3 top-3 z-10 rounded-full bg-[#ff7a4d] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
            Hot
          </div>
        )}

        <div className="relative flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-white/[0.04] to-transparent min-h-[80px] sm:min-h-[100px]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-12 w-auto max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff7a4d]/20 to-[#ff7a4d]/5 text-xl font-bold text-[#ff7a4d]">
              {initials}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white leading-tight truncate" data-testid={`text-product-name-${product.id}`}>
                {product.name}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${colors.bg} ${colors.text}`}>
                  {product.category}
                </span>
                <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium bg-white/5 text-white/30">
                  {accountType}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-lg font-black text-white" data-testid={`text-price-${product.id}`}>
                ${discountedPrice.toFixed(2)}
              </div>
              <div className="text-[10px] text-white/30">
                {selectedDuration.discount > 0 ? (
                  <span className="text-[#39efd0]">-{selectedDuration.discount}%</span>
                ) : "USD"}
              </div>
            </div>
          </div>

          <div
            className="mb-3 flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {DURATIONS.map((d, i) => (
              <button
                key={d.label}
                onClick={(e) => { e.stopPropagation(); setDuration(i); }}
                onTouchStart={(e) => e.stopPropagation()}
                data-testid={`button-duration-${product.id}-${d.label}`}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${
                  duration === i
                    ? "bg-[#ff7a4d] text-black"
                    : "border border-white/10 text-white/40 hover:border-white/25 hover:text-white/70"
                }`}
              >
                {d.label}{d.discount > 0 && <span className="ml-0.5 opacity-70">-{d.discount}%</span>}
              </button>
            ))}
          </div>

          {product.features && product.features.length > 0 && (
            <ul className="mb-4 space-y-1.5">
              {product.features.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff7a4d]/60" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div
            className="mt-auto flex gap-2"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <a
              href={`/product/${product.id}`}
              data-testid={`link-product-${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white/50 group-hover:border-white/25 group-hover:text-white transition-all"
            >
              View Details
            </a>
            <button
              onClick={handleAdd}
              onTouchStart={(e) => e.stopPropagation()}
              data-testid={`button-add-${product.id}`}
              className={`flex-1 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                added
                  ? "bg-[#39efd0]/20 text-[#39efd0] border border-[#39efd0]/30"
                  : "bg-white/5 border border-white/10 text-white hover:bg-[#ff7a4d] hover:border-[#ff7a4d] hover:text-black hover:shadow-[0_0_20px_rgba(255,122,77,0.3)]"
              }`}
            >
              {added ? "✓" : "Add"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
