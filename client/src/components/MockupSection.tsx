import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Smartphone, MessageCircle, Bell, ShieldCheck, Wallet } from "lucide-react";
import { useRef } from "react";

function Badge({ icon: Icon, label, className, delay }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ opacity: { duration: 0.6, delay }, scale: { duration: 0.6, delay } }}
      animate={{ y: [0, -6, 6, 0] }}
      className={`absolute z-20 flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${className ?? ""}`}
    >
      <Icon className="h-4 w-4 text-[#fb7246]" />
      <span className="text-[11px] font-medium text-white/70">{label}</span>
    </motion.div>
  );
}

export default function MockupSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const phoneY = useTransform(scrollYProgress, [0, 1], [120, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(cx * 15); rx.set(cy * -15);
  };

  const handleLeave = () => { rx.set(0); ry.set(0); };

  return (
    <section ref={sectionRef} className="relative bg-[#050505] py-32 md:py-48" style={{ overflowX: "hidden" }}>
      <motion.div
        className="pointer-events-none absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#fb7246]/10 blur-[160px]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-[#fb7246]/5 blur-[140px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />

      <motion.div style={{ opacity }} className="mx-auto max-w-[1400px] px-2 sm:px-6 md:px-10 lg:px-14">
        <div className="grid items-center gap-16 md:grid-cols-2 md:gap-20">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-4 inline-block rounded-full border border-[#fb7246]/30 bg-[#fb7246]/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#fb7246]"
            >
              Mobile Experience
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "var(--font-syne)" }}
              className="text-5xl font-bold uppercase leading-[0.9] tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              Commerce <br />in your <br /><span className="text-[#2bfdc8]">pocket</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-md text-base leading-relaxed text-white/50"
            >
              Full store management from anywhere. Browse bundles, confirm orders via WhatsApp,
              and pay with Whish Money, OMT, or USDT — no bank card required.
            </motion.p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { label: "WhatsApp Checkout", color: "#25d366" },
                { label: "Whish / OMT / USDT", color: "#fb7246" },
                { label: "Order Alerts", color: "#2bfdc8" },
                { label: "No Card Needed", color: "#ffd700" },
              ].map(({ label, color }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
                >
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-sm text-white/60">{label}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <a
                href={`https://wa.me/96176171003?text=${encodeURIComponent("Hi Bundly+! I'd like to place an order.")}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-mockup-whatsapp"
                className="inline-flex items-center gap-2 rounded-full bg-[#25d366] px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(37,211,102,0.3)] hover:shadow-[0_0_50px_rgba(37,211,102,0.5)] hover:scale-105 active:scale-95 transition-all"
              >
                Order via WhatsApp
              </a>
            </motion.div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#fb7246]/5 blur-[100px]" />

            <motion.div
              style={{ y: phoneY, rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
              className="relative z-10"
            >
              <div className="relative h-[540px] w-[270px] rounded-[46px] border-2 border-white/20 bg-gradient-to-b from-[#111] to-[#050505] shadow-[0_40px_120px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]">
                <div className="absolute left-1/2 top-3 h-1 w-16 -translate-x-1/2 rounded-full bg-white/20" />

                <div className="flex h-full flex-col overflow-hidden rounded-[44px] p-3">
                  <div className="flex-1 overflow-hidden rounded-[38px] bg-[#0a0a0a]">
                    <div className="flex h-12 items-center justify-between px-4">
                      <span className="text-xs font-bold text-white">9:41</span>
                      <div className="flex gap-1">
                        <div className="h-3 w-3 rounded-full bg-white/20" />
                        <div className="h-3 w-4 rounded-sm bg-white/20" />
                        <div className="h-3 w-3 rounded-sm bg-white/20" />
                      </div>
                    </div>

                    <div className="px-4 pb-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-6 w-6 rounded-full bg-[#fb7246] flex items-center justify-center">
                          <span className="text-[8px] font-bold text-black">B+</span>
                        </div>
                        <span className="text-xs font-bold text-white">Bundly+</span>
                      </div>

                      <div className="space-y-2">
                        {[
                          { name: "Netflix", price: "$3.99", tag: "Streaming" },
                          { name: "Spotify", price: "$2.49", tag: "Music" },
                          { name: "ChatGPT", price: "$6.99", tag: "AI" },
                        ].map((item) => (
                          <div key={item.name} className="flex items-center justify-between rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 py-2.5">
                            <div>
                              <p className="text-[10px] font-bold text-white">{item.name}</p>
                              <p className="text-[9px] text-white/40">{item.tag}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-[#fb7246]">{item.price}</p>
                              <div className="mt-0.5 rounded-full bg-[#fb7246]/20 px-1.5 py-0.5 text-[7px] font-bold text-[#fb7246]">HOT</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 rounded-xl bg-[#25d366]/20 border border-[#25d366]/30 px-3 py-2.5 flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="#25d366" className="h-4 w-4 shrink-0">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                        </svg>
                        <span className="text-[10px] font-semibold text-[#25d366]">Order via WhatsApp</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex h-8 items-center justify-center gap-6">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className={`rounded-full ${i === 1 ? "h-4 w-4 bg-white/30" : "h-1.5 w-1.5 bg-white/15"}`} />
                    ))}
                  </div>
                </div>
              </div>

              <Badge icon={MessageCircle} label="WhatsApp Checkout" className="-left-16 top-16" delay={0.4} />
              <Badge icon={Bell} label="+24 Orders Today" className="-right-16 top-32" delay={0.6} />
              <Badge icon={ShieldCheck} label="Verified Seller" className="-left-12 bottom-24" delay={0.8} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
