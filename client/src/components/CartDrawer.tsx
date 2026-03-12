import { useCartStore } from "../store/cartStore";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import PaymentMethods from "./PaymentMethods";

const WHATSAPP_NUMBER = "96176171003";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);

  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = totalPrice();

  useEffect(() => {
    const handler = (e: CustomEvent) => setOpen(!!e.detail);
    window.addEventListener("bundlyplus:cart", handler as EventListener);
    return () => window.removeEventListener("bundlyplus:cart", handler as EventListener);
  }, []);

  const whatsappUrl = useMemo(() => {
    if (items.length === 0) return "";
    const orderLine = items
      .map((item) => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
      .join(", ");
    const msg = `Hello BundlyPlus! I want to order: ${orderLine}. Total: $${cartTotal.toFixed(2)} USD. Payment: Whish/OMT/USDT. Please confirm.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }, [items, cartTotal]);

  function handleWhatsAppCheckout() {
    if (!whatsappUrl) return;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        data-testid="button-open-cart"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#fb7246] text-white shadow-[0_0_30px_rgba(255,122,77,0.5)] transition hover:bg-orange-500 hover:scale-110 active:scale-95"
      >
        <ShoppingCart size={22} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2bfdc8] text-[10px] font-bold text-black">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform border-l border-white/10 bg-[#0a0a0a] ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ transition: "transform 300ms cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
            <button
              onClick={() => setOpen(false)}
              data-testid="button-close-cart"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 hover:border-white/25 hover:bg-white/10 hover:text-white transition-all"
              aria-label="Back"
            >
              <ArrowLeft size={16} />
            </button>
            <h2 style={{ fontFamily: "var(--font-syne)" }} className="flex-1 text-lg font-bold text-white">
              Cart {count > 0 && <span className="text-[#fb7246]">({count})</span>}
            </h2>
            {count > 0 && (
              <span className="rounded-full bg-[#fb7246]/15 px-2.5 py-1 text-[11px] font-bold text-[#fb7246]">
                {count} item{count !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {items.length === 0 ? (
              <div className="mt-16 flex flex-col items-center text-center">
                <ShoppingCart size={36} className="mb-3 text-slate-600" />
                <p className="text-sm text-slate-500">Your cart is empty.</p>
                <p className="mt-1 text-xs text-slate-600">Add a subscription bundle to get started.</p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-4 text-xs text-[#fb7246] hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xl font-bold text-white/60">
                          {item.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                          <p className="text-xs text-slate-400">${item.price.toFixed(2)} each</p>
                          <p className="text-xs font-bold text-[#fb7246]">Total: ${lineTotal.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="space-y-3 border-t border-white/10 px-5 py-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-slate-300">Total</span>
                <span className="text-xl font-black text-white">${cartTotal.toFixed(2)} <span className="text-xs font-medium text-slate-500">USD</span></span>
              </div>

              <button
                onClick={handleWhatsAppCheckout}
                data-testid="button-whatsapp-checkout"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] py-3 text-sm font-semibold text-white transition hover:bg-[#1fba59]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                Order via WhatsApp
              </button>

              <PaymentMethods />

              <button
                onClick={clearCart}
                data-testid="button-clear-cart"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <Trash2 size={14} /> Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
