import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ROW1 = [
  "WhatsApp Checkout",
  "Subscription Bundles",
  "Whish Money",
  "Cash-Friendly",
  "OMT Transfer",
  "Instant Delivery",
  "USDT Accepted",
  "Lebanon-First",
];

const ROW2 = [
  "Premium Support",
  "Secure Payments",
  "Fast Shipping",
  "Bundle & Save",
  "Crypto Ready",
  "Local Pickup",
  "Gift Cards",
  "Exclusive Deals",
];

function TickerRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const row = items.map((item, i) => (
    <span key={i} className="flex items-center gap-6 whitespace-nowrap">
      <span
        style={{ fontFamily: "var(--font-syne)" }}
        className="text-3xl font-bold uppercase tracking-tight text-white/10 transition-colors duration-300 hover:text-[#ff7a4d]/60 md:text-5xl"
      >
        {item}
      </span>
      <span className="text-xl text-[#ff7a4d]/35">+</span>
    </span>
  ));

  return (
    <div className="relative flex gap-6 overflow-hidden">
      <motion.div
        className="flex shrink-0 gap-6"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {row}
        {row}
      </motion.div>
    </div>
  );
}

export default function MarqueeTicker() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const skewY = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [3, 0, 0, -3]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.94, 1, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ skewY, scale, opacity, overflowX: "hidden" }}
      className="relative bg-[#050505] py-8 md:py-12"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="space-y-4">
        <TickerRow items={ROW1} reverse={false} />
        <TickerRow items={ROW2} reverse={true} />
      </div>
    </motion.section>
  );
}
