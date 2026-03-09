import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ProductGrid from "./ProductGrid";

const BUNDLE_TIERS = [
  { label: "Starter Bundle", save: 25, color: "#39efd0" },
  { label: "Popular Bundle", save: 40, color: "#ff7a4d" },
  { label: "Ultimate Bundle", save: 50, color: "#ffd700" },
];

const FEATURE_CARDS = [
  {
    title: "Easy Checkout",
    desc: "One-click purchase via WhatsApp. Fast, secure, and instant delivery.",
    logos: [
      { name: "Netflix", src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
      { name: "Spotify", src: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" },
      { name: "ChatGPT", src: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
      { name: "Disney+", src: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" },
    ],
  },
  {
    title: "Wide Selection",
    desc: "From Netflix & Spotify to ChatGPT & Adobe. Every category covered.",
    chips: ["Xbox GamePass", "Canva Pro", "Midjourney", "Adobe CC", "Notion AI", "NordVPN"],
  },
  {
    title: "Instant Delivery",
    desc: "Credentials delivered immediately. No waiting, no delays, start using today.",
    chips: ["YouTube Premium", "Steam Card", "Roblox", "ExpressVPN", "Duolingo+"],
  },
];

export default function FeatureBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headlineY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section id="features" ref={sectionRef} className="relative bg-[#050505] py-16 md:py-32 lg:py-44 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
        <motion.div style={{ y: headlineY, opacity: headlineOpacity }} className="mb-20 max-w-3xl">
          <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-4 inline-block rounded-full border border-[#ff7a4d]/30 bg-[#ff7a4d]/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#ff7a4d]">
            Platform Features
          </motion.span>
          <h2 style={{ fontFamily: "var(--font-syne)" }} className="text-4xl font-bold uppercase leading-[0.9] tracking-tight text-white md:text-6xl lg:text-7xl">
            Bundle &amp; <br /><span className="text-[#ff7a4d]">Save Big</span>
          </h2>
        </motion.div>

        <div className="grid gap-4 md:gap-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-12"
            >
              <div className="absolute right-6 top-6 flex flex-col items-end gap-1">
                <span className="text-xs uppercase tracking-widest text-white/30">Max Savings</span>
                <span style={{ fontFamily: "var(--font-syne)" }} className="text-5xl font-bold text-[#ffd700]">50%</span>
              </div>

              <div className="mt-16 space-y-4">
                {BUNDLE_TIERS.map(({ label, save, color }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-white/60">{label}</span>
                      <span className="font-bold" style={{ color }}>Save {save}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${save}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-12"
            >
              <div className="mb-6 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#39efd0] animate-pulse" />
                <span className="text-xs text-[#39efd0]/70 uppercase tracking-widest font-medium">4 Categories</span>
              </div>

              <div style={{ fontFamily: "var(--font-syne)" }} className="text-6xl font-bold text-white md:text-7xl">
                50+<br /><span className="text-[#ff7a4d]">Plans</span>
              </div>

              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
                Choose from Streaming, Gaming, Software & AI, and Music. Curated subscriptions across all your favourite services.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {["Streaming", "Gaming", "AI", "Music"].map((cat, i) => (
                  <motion.span
                    key={cat}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-xs font-semibold text-white/60"
                  >
                    {cat}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {FEATURE_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8"
              >
                <h4 style={{ fontFamily: "var(--font-syne)" }} className="mb-2 text-lg font-bold uppercase tracking-tight text-white">
                  {card.title}
                </h4>
                <p className="mb-6 text-sm leading-relaxed text-white/40">{card.desc}</p>

                {card.logos && (
                  <div className="flex flex-wrap gap-3">
                    {card.logos.map((logo) => (
                      <div key={logo.name} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] p-2">
                        <img src={logo.src} alt={logo.name} className="h-full w-auto object-contain" />
                      </div>
                    ))}
                  </div>
                )}

                {card.chips && (
                  <div className="flex flex-wrap gap-2">
                    {card.chips.map((chip) => (
                      <span key={chip} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/50">
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-10 lg:p-14"
          >
            <div className="mb-8">
              <span className="mb-3 inline-block rounded-full border border-[#ff7a4d]/30 bg-[#ff7a4d]/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#ff7a4d]">
                Marketplace
              </span>
              <h3 style={{ fontFamily: "var(--font-syne)" }} className="text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
                Browse deals
              </h3>
            </div>
            <ProductGrid />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
