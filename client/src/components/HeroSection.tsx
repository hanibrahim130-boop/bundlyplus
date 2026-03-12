import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Package, Users, Star } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import HeroBackground from "./HeroBackground";

const CARDS = [
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", tag: "Streaming", price: "$3.99/mo", color: "#E50914" },
  { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg", tag: "Music", price: "$2.49/mo", color: "#1DB954" },
  { name: "Disney+", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg", tag: "Streaming", price: "$4.99/mo", color: "#113CCF" },
  { name: "ChatGPT", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", tag: "AI", price: "$6.99/mo", color: "#10A37F" },
  { name: "Xbox", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg", tag: "Gaming", price: "$5.99/mo", color: "#107C10" },
  { name: "Discord", logo: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png", tag: "Social", price: "$2.99/mo", color: "#5865F2" },
  { name: "YouTube", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg", tag: "Video", price: "$1.99/mo", color: "#FF0000" },
  { name: "Crunchyroll", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Crunchyroll_Logo.png", tag: "Anime", price: "$3.49/mo", color: "#F47521" },
  { name: "Adobe CC", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg", tag: "Software", price: "$9.99/mo", color: "#FF0000" },
  { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", tag: "Design", price: "$4.99/mo", color: "#F24E1E" },
];

function VerticalScroller({ cards, reverse = false }: { cards: typeof CARDS; reverse?: boolean }) {
  const doubled = [...cards, ...cards];
  const duration = cards.length * 3.5;
  return (
    <div
      className="relative h-full overflow-hidden w-full"
      style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)" }}
    >
      <motion.div
        className="flex flex-col gap-3"
        animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((card, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 w-full shrink-0 backdrop-blur-sm">
            <div className="h-7 w-7 shrink-0 flex items-center justify-center">
              <img src={card.logo} alt={card.name} className="h-full w-auto max-w-[28px] object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-white truncate">{card.name}</p>
              <p className="text-[9px] text-white/35">{card.tag}</p>
              <p className="text-[9px] font-bold" style={{ color: card.color }}>From {card.price}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function StatCounter({ icon: Icon, value, suffix, label, color, delay }: {
  icon: React.ElementType; value: number; suffix: string; label: string; color: string; delay: number;
}) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let raf: number;
    const t0 = performance.now();
    const dur = 2000;
    const step = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    const timeout = setTimeout(() => { raf = requestAnimationFrame(step); }, delay * 1000);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [started, value, delay]);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }} className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" style={{ color }} />
        <span style={{ fontFamily: "var(--font-syne)", color }} className="text-xl md:text-2xl font-black tabular-nums">
          {val}{suffix}
        </span>
      </div>
      <p className="text-[10px] text-white/35">{label}</p>
    </motion.div>
  );
}

function RecentBuyBadge() {
  const [idx, setIdx] = useState(0);
  const items = ["Netflix Premium", "ChatGPT Plus", "Spotify Premium", "Xbox Game Pass", "Adobe CC"];
  const names = ["@alex_k", "@lara.m", "@karim.b", "@nadia.h", "@joe.t"];
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 3500);
    return () => clearInterval(id);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-sm px-3.5 py-2"
      >
        <div className="h-6 w-6 rounded-full bg-[#fb7246] flex items-center justify-center shrink-0">
          <span className="text-[8px] font-black text-black">B+</span>
        </div>
        <div>
          <p className="text-[10px] font-medium text-white/60 whitespace-nowrap">Just purchased</p>
          <p className="text-[10px] font-bold text-white whitespace-nowrap">
            {items[idx]} <span className="text-white/35 font-normal">{names[idx]}</span>
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const leftPanelRotateY = useTransform(scrollYProgress, [0, 0.5], [0, 12]);
  const leftPanelOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.3]);
  const rightPanelRotateY = useTransform(scrollYProgress, [0, 0.5], [0, -12]);
  const rightPanelOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.3]);

  const scrollToProducts = () => document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
  const scrollToSubscriptions = () => document.querySelector("#subscriptions")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={sectionRef} className="relative bg-[#050505] flex flex-col" style={{ minHeight: "100svh", overflowX: "hidden" }} data-testid="section-hero">
      <HeroBackground />

      <div className="relative z-10 flex flex-1 items-center">
        <motion.div
          style={{ rotateY: leftPanelRotateY, opacity: leftPanelOpacity, perspective: 800 }}
          className="hidden sm:flex w-28 md:w-36 lg:w-44 xl:w-52 shrink-0 h-[min(500px,70vh)] px-2 md:px-3"
        >
          <VerticalScroller cards={CARDS.slice(0, 6)} reverse={false} />
        </motion.div>

        <motion.div
          style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
          className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 lg:px-8 pt-24 pb-10 text-center min-w-0"
        >
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-4">
            <RecentBuyBadge />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/5 backdrop-blur-md px-3 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/45">Daily Active Subscribers</span>
          </motion.div>

          <div className="relative mb-4" style={{ perspective: "900px" }}>
            <div className="absolute inset-0 blur-[70px] opacity-25 pointer-events-none" style={{ background: "radial-gradient(ellipse, #fb7246 0%, transparent 65%)" }} />
            <motion.h1
              initial={{ opacity: 0, y: 36, rotateX: 18 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              className="relative font-black leading-[0.88] tracking-tight uppercase"
              style={{
                fontSize: "clamp(36px, 5.5vw, 82px)",
                fontFamily: "var(--font-syne)",
                transformStyle: "preserve-3d",
              }}
              data-testid="heading-hero"
            >
              <span className="block text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.08)]">Bundle</span>
              <span className="block relative" style={{
                background: "linear-gradient(135deg, #fb7246 0%, #ffb347 40%, #ff4d4d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 36px rgba(255,122,77,0.5))",
              }}>
                Beyond
                <motion.span
                  className="inline-block ml-1"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 280, damping: 12 }}
                  style={{ WebkitTextFillColor: "#fb7246", filter: "drop-shadow(0 0 18px rgba(255,122,77,0.9))" }}
                >+</motion.span>
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="max-w-xs sm:max-w-sm text-sm text-white/40 font-medium leading-relaxed"
          >
            All your favorite subscriptions — streaming, gaming, music, AI — bundled in one place at unbeatable prices.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6 flex w-full max-w-xs sm:max-w-none flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
          >
            <motion.button
              onClick={scrollToProducts}
              className="group relative flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-black text-xs uppercase tracking-wider text-black overflow-hidden"
              style={{ background: "linear-gradient(135deg, #fb7246, #ffb347)", boxShadow: "0 0 36px rgba(255,122,77,0.3)" }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 56px rgba(255,122,77,0.5)" }}
              whileTap={{ scale: 0.96 }}
              data-testid="button-shop-now"
            >
              <motion.div
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)" }}
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
              />
              <ShoppingBag className="h-3.5 w-3.5 relative z-10" />
              <span className="relative z-10">Shop Now</span>
              <ArrowRight className="h-3.5 w-3.5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              onClick={scrollToSubscriptions}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-black text-xs uppercase tracking-wider text-white/65 border border-white/[0.12] bg-white/5 backdrop-blur-md hover:bg-white/10 hover:text-white hover:border-white/25 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              data-testid="button-browse-bundles"
            >
              Browse Bundles
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-8 sm:mt-10 flex items-center justify-center gap-5 sm:gap-10 md:gap-14"
          >
            <StatCounter icon={Package} value={50} suffix="+" label="Products" color="#fb7246" delay={1.1} />
            <div className="h-7 w-px bg-white/10" />
            <StatCounter icon={Users} value={1000} suffix="+" label="Happy Users" color="#5865F2" delay={1.2} />
            <div className="h-7 w-px bg-white/10" />
            <StatCounter icon={Star} value={4} suffix=".8" label="Rating" color="#1DB954" delay={1.3} />
          </motion.div>
        </motion.div>

        <motion.div
          style={{ rotateY: rightPanelRotateY, opacity: rightPanelOpacity, perspective: 800 }}
          className="hidden sm:flex w-28 md:w-36 lg:w-44 xl:w-52 shrink-0 h-[min(500px,70vh)] px-2 md:px-3"
        >
          <VerticalScroller cards={CARDS.slice(4)} reverse={true} />
        </motion.div>
      </div>

      <div className="relative z-10 overflow-hidden border-t border-white/[0.04] bg-[#0a0a0a]">
        <motion.div
          className="flex gap-7 py-2.5"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...CARDS, ...CARDS].map((card, i) => (
            <div key={i} className="flex shrink-0 items-center gap-2 px-2">
              <img src={card.logo} alt={card.name} className="h-4 w-auto max-w-[60px] object-contain opacity-30" />
              <span className="text-[10px] text-white/20 font-medium">{card.tag}</span>
              <span className="text-[10px] font-bold text-white/20">From {card.price}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
