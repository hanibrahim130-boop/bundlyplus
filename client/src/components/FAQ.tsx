import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "How fast is the delivery?",
    a: "Instant! After purchase via WhatsApp, you'll receive your account credentials immediately. No waiting, no delays.",
  },
  {
    q: "Can I mix subscriptions in a bundle?",
    a: "Our bundles come pre-curated for maximum value. Each bundle (Starter, Popular, Ultimate) includes the best combination of services.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Whish Money, OMT transfer, and USDT. No bank card needed. Just reach us via WhatsApp and our team will guide you through the process securely.",
  },
  {
    q: "Are the accounts personal or shared?",
    a: "Both! We offer private accounts (for your exclusive use) and shared accounts (more affordable). Check each product's details for the account type before ordering.",
  },
  {
    q: "What if I have issues with my subscription?",
    a: "We're here 24/7 via WhatsApp support. Any issues are resolved within minutes. Your satisfaction is guaranteed.",
  },
  {
    q: "Is my payment secure?",
    a: "Absolutely. All transactions are protected and verified through WhatsApp. We never store sensitive payment information.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative bg-[#050505] py-28 md:py-40 overflow-x-clip">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff7a4d]/4 blur-[160px]" />

      <div className="mx-auto max-w-[900px] px-2 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/50">
            Help & Support
          </span>
          <h2
            style={{ fontFamily: "var(--font-syne)" }}
            className="text-5xl font-bold uppercase leading-[0.9] tracking-tight text-white md:text-7xl"
          >
            Got <br />
            <span className="text-[#ff7a4d]">questions?</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? "border-[#ff7a4d]/30 bg-[#ff7a4d]/[0.04]" : "border-white/[0.08] bg-white/[0.02]"
                }`}
                data-testid={`faq-item-${i}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  data-testid={`faq-toggle-${i}`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      style={{ fontFamily: "var(--font-syne)" }}
                      className={`text-sm font-bold tabular-nums ${isOpen ? "text-[#ff7a4d]" : "text-white/30"}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-sm font-semibold transition-colors ${isOpen ? "text-white" : "text-white/70"}`}>
                      {faq.q}
                    </span>
                  </div>
                  <div className={`shrink-0 rounded-full border p-1.5 transition-all ${isOpen ? "border-[#ff7a4d]/40 bg-[#ff7a4d]/10 text-[#ff7a4d]" : "border-white/10 text-white/30"}`}>
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="px-6 pb-5 pl-16">
                        <p className="text-sm leading-relaxed text-white/50">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
