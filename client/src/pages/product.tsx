import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShoppingCart, MessageCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const DURATIONS = [
  { label: "1 Month", months: 1, discount: 0 },
  { label: "3 Months", months: 3, discount: 5 },
  { label: "6 Months", months: 6, discount: 10 },
  { label: "12 Months", months: 12, discount: 15 },
];

const categoryColors: Record<string, string> = {
  "Streaming": "#E50914",
  "Gaming": "#107C10",
  "Software & AI": "#0057FF",
  "Music & Others": "#1DB954",
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [duration, setDuration] = useState(0);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);

  const { data: products = [], isLoading } = useQuery<Product[]>({ queryKey: ["/products.json"] });
  const product = products.find((p) => p.id === id);
  const related = products.filter((p) => p.id !== id && p.category === product?.category).slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1f2626] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-[#fb7246] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#1f2626] flex flex-col items-center justify-center gap-4 text-white">
        <p className="text-2xl font-bold">Product not found</p>
        <a href="/" className="text-[#fb7246] hover:underline">← Back to products</a>
      </div>
    );
  }

  const selectedDuration = DURATIONS[duration];
  const discountedPrice = product.price * selectedDuration.months * (1 - selectedDuration.discount / 100);
  const initials = product.name.slice(0, 2).toUpperCase();
  const accentColor = categoryColors[product.category] ?? "#fb7246";

  const handleAdd = () => {
    addToCart({
      id: `${product.id}-${selectedDuration.months}mo`,
      name: `${product.name} (${selectedDuration.label})`,
      price: discountedPrice,
      image_url: product.image_url,
      description: product.description,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    window.dispatchEvent(new CustomEvent("bundlyplus:cart", { detail: true }));
  };

  const waMsg = encodeURIComponent(
    `Hi Bundly+! I'd like to order ${product.name} (${selectedDuration.label}) — Total: $${discountedPrice.toFixed(2)} USD.`
  );

  return (
    <main className="min-h-screen bg-[#1f2626]">
      <Navbar />
      <CartDrawer />

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 pt-24 md:pt-32 pb-16 md:pb-24 md:px-10">
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors"
          data-testid="link-back-to-products"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </motion.a>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="mb-8 flex items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 sm:p-14"
              style={{ boxShadow: `0 0 80px ${accentColor}15` }}
            >
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-24 w-auto max-w-[200px] object-contain" />
              ) : (
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-3xl text-3xl font-black text-black"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
                >
                  {initials}
                </div>
              )}
            </div>

            {product.features && product.features.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/40">Features</h3>
                <ul className="space-y-3">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2bfdc8]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/40">
                {product.category}
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/40">
                {product.account_type ?? "Shared"}
              </span>
              {product.hot && (
                <span className="rounded-full bg-[#fb7246] px-3 py-1 text-[11px] font-bold text-black">Hot</span>
              )}
            </div>

            <h1
              style={{ fontFamily: "var(--font-syne)" }}
              className="mb-4 text-3xl sm:text-4xl font-bold leading-tight text-white"
              data-testid="heading-product-name"
            >
              {product.name}
            </h1>
            <p className="mb-8 text-base leading-relaxed text-white/50">{product.description}</p>

            <div className="mb-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/30">Duration</p>
              <div className="grid grid-cols-2 gap-2">
                {DURATIONS.map((d, i) => {
                  const totalPrice = product.price * d.months * (1 - d.discount / 100);
                  return (
                    <button
                      key={d.label}
                      onClick={() => setDuration(i)}
                      data-testid={`button-duration-${d.months}mo`}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        duration === i
                          ? "border-[#fb7246]/50 bg-[#fb7246]/10"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${duration === i ? "text-white" : "text-white/60"}`}>
                          {d.label}
                        </span>
                        {d.discount > 0 && (
                          <span className="rounded-full bg-[#2bfdc8]/15 px-2 py-0.5 text-[10px] font-bold text-[#2bfdc8]">
                            -{d.discount}%
                          </span>
                        )}
                      </div>
                      <div className={`mt-1 text-lg font-black ${duration === i ? "text-[#fb7246]" : "text-white/40"}`}>
                        ${totalPrice.toFixed(2)}<span className="text-xs font-normal opacity-60"> total</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40">
                    Total for {selectedDuration.months} month{selectedDuration.months > 1 ? "s" : ""}
                  </p>
                  <p className="text-3xl font-black text-white" data-testid="text-total-price">
                    ${discountedPrice.toFixed(2)}<span className="text-sm text-white/40 font-normal"> USD</span>
                  </p>
                  {selectedDuration.discount > 0 && (
                    <p className="text-xs text-white/30 line-through">
                      ${(product.price * selectedDuration.months).toFixed(2)} full price
                    </p>
                  )}
                </div>
                {selectedDuration.discount > 0 && (
                  <div className="rounded-2xl bg-[#2bfdc8]/10 px-4 py-2 text-center">
                    <p className="text-2xl font-black text-[#2bfdc8]">{selectedDuration.discount}%</p>
                    <p className="text-xs text-[#2bfdc8]/70">off</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleAdd}
                data-testid="button-add-to-cart"
                className={`flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase tracking-wider transition-all ${
                  added
                    ? "bg-[#2bfdc8]/20 text-[#2bfdc8] border border-[#2bfdc8]/30"
                    : "bg-[#fb7246] text-black hover:shadow-[0_0_40px_rgba(255,122,77,0.4)] hover:scale-[1.02]"
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                {added ? "Added to Cart ✓" : "Add to Cart"}
              </button>

              <a
                href={`https://wa.me/96176171003?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-whatsapp-order"
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#25d366]/30 bg-[#25d366]/10 py-4 text-sm font-black uppercase tracking-wider text-[#25d366] hover:bg-[#25d366]/20 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                Order via WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-24"
          >
            <h2 className="mb-8 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
              Related Products
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {related.map((p) => (
                <a
                  key={p.id}
                  href={`/product/${p.id}`}
                  data-testid={`link-related-${p.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 hover:border-white/20 transition-all"
                >
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-10 w-10 object-contain shrink-0" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fb7246]/15 text-xs font-bold text-[#fb7246] shrink-0">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                    <p className="text-xs text-[#fb7246] font-bold">${p.price.toFixed(2)}/mo</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
  );
}
