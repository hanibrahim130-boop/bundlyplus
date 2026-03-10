import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Check, Zap, Star, Crown } from "lucide-react";

const WHATSAPP = "96176171003";

const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    color: "#39efd0",
    colorBg: "rgba(57,239,208,0.08)",
    colorBorder: "rgba(57,239,208,0.2)",
    subs: 2,
    savePct: 25,
    price: 8.99,
    wasPrice: 10.5,
    description: "Perfect for trying out Bundly+",
    perks: ["Access to 200+ products", "Monthly refresh", "WhatsApp support", "Cancel anytime"],
    popular: false,
  },
  {
    id: "popular",
    name: "Popular",
    icon: Star,
    color: "#ff7a4d",
    colorBg: "rgba(255,122,77,0.08)",
    colorBorder: "rgba(255,122,77,0.3)",
    subs: 4,
    savePct: 40,
    price: 15.99,
    wasPrice: 21.2,
    description: "Most popular — great value",
    perks: ["Everything in Starter", "Priority picks", "Early access drops", "Dedicated support", "Free delivery"],
    popular: true,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    icon: Crown,
    color: "#ffd700",
    colorBg: "rgba(255,215,0,0.06)",
    colorBorder: "rgba(255,215,0,0.2)",
    subs: 6,
    savePct: 50,
    price: 25.99,
    wasPrice: 37.1,
    description: "For power users & resellers",
    perks: ["Everything in Popular", "VIP product selection", "Bulk pricing", "Reseller dashboard", "Account manager", "Custom bundles"],
    popular: false,
  },
];

function PlanCard({ plan, selected, onSelect, delay }: {
  plan: typeof plans[0]; selected: boolean; onSelect: () => void; delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 25 });
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const Icon = plan.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const buildWhatsApp = () => {
    const msg = `Hi Bundly+! I'd like to order the ${plan.name} Bundle (${plan.subs} subscriptions) for $${plan.price}/month.`;
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div ref={cardRef} style={isTouch ? undefined : { perspective: "800px" }} onMouseMove={handleMouseMove} onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }} className="w-full min-w-0">
      <motion.div
        initial={{ opacity: 0, y: 70, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
        style={isTouch ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        onClick={onSelect}
        className={`relative w-full flex flex-col rounded-2xl border bg-white/[0.02] backdrop-blur-xl overflow-hidden cursor-pointer transition-all duration-300 ${
          plan.popular
            ? "border-[#ff7a4d]/40 shadow-[0_0_60px_rgba(255,122,77,0.12)]"
            : selected
            ? "border-white/20"
            : "border-white/[0.08] hover:border-white/15"
        }`}
        data-testid={`card-bundle-${plan.id}`}
      >
        {plan.popular && (
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#ff7a4d]/60 to-transparent" />
        )}
        {plan.popular && (
          <div className="absolute -top-px left-1/2 -translate-x-1/2">
            <div className="rounded-b-full bg-[#ff7a4d] px-5 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
              Most Popular
            </div>
          </div>
        )}

        <div className="p-4 sm:p-7 flex-1 flex flex-col" style={isTouch ? undefined : { transform: "translateZ(10px)" }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="rounded-xl p-2.5"
                style={{ background: plan.colorBg, border: `1px solid ${plan.colorBorder}` }}
              >
                <Icon className="h-5 w-5" style={{ color: plan.color }} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-syne)" }} className="text-sm font-bold uppercase tracking-wider text-white">
                  {plan.name}
                </p>
                <p className="text-xs text-white/40">{plan.description}</p>
              </div>
            </div>
            <span className="text-xs font-bold rounded-full px-2.5 py-1" style={{ background: plan.colorBg, color: plan.color, border: `1px solid ${plan.colorBorder}` }}>
              {plan.savePct}%
            </span>
          </div>

          <div className="mb-2 rounded-xl border p-4" style={{ borderColor: plan.colorBorder, background: plan.colorBg }}>
            <div className="flex items-end gap-1">
              <span style={{ fontFamily: "var(--font-syne)", color: plan.color }} className="text-4xl font-bold">
                ${plan.price}
              </span>
              <span className="mb-1 text-sm text-white/40">/month</span>
            </div>
            <p className="mt-1 text-xs text-white/40">
              Was <span className="line-through">${plan.wasPrice.toFixed(1)}</span> · {plan.subs} Subscriptions
            </p>
          </div>

          <ul className="mb-6 flex-1 space-y-2.5 mt-4">
            {plan.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2.5 text-sm text-white/60">
                <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: plan.color }} />
                {perk}
              </li>
            ))}
          </ul>

          <a
            href={buildWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            data-testid={`button-bundle-${plan.id}`}
            className={`w-full rounded-xl py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 text-center block ${
              plan.popular
                ? "bg-[#ff7a4d] text-black shadow-[0_0_30px_rgba(255,122,77,0.3)] hover:shadow-[0_0_50px_rgba(255,122,77,0.5)] hover:opacity-90"
                : "border border-white/15 bg-white/[0.05] text-white hover:bg-white/10"
            }`}
          >
            Order via WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function SubscriptionSection() {
  const [selected, setSelected] = useState("popular");
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const headingRotateX = useTransform(scrollYProgress, [0, 0.22], [20, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.18], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.22], [50, 0]);

  const selectedPlan = plans.find((p) => p.id === selected)!;

  return (
    <section ref={sectionRef} id="subscriptions" className="relative bg-[#050505] py-24 md:py-36 overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#ff7a4d]/5 blur-[110px]" />

      <div className="mx-auto max-w-[1200px] px-2 sm:px-6 md:px-10 lg:px-14">
        <div style={{ perspective: "1000px" }}>
          <motion.div
            style={{ rotateX: headingRotateX, opacity: headingOpacity, y: headingY }}
            className="mb-14 text-center"
          >
            <div style={{ transformOrigin: "top center" }}>
              <span className="mb-4 inline-block rounded-full border border-[#ff7a4d]/30 bg-[#ff7a4d]/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#ff7a4d]">
                ⚡ Smart Bundles
              </span>
              <h2
                style={{ fontFamily: "var(--font-syne)" }}
                className="text-4xl font-bold uppercase leading-[0.9] tracking-tight text-white md:text-6xl"
              >
                Pick your <br />
                <span className="text-[#ff7a4d]">bundle</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/45">
                Combine your favourite subscriptions and unlock exclusive discounts. The more you bundle, the more you save.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selected === plan.id}
              onSelect={() => setSelected(plan.id)}
              delay={i * 0.12}
            />
          ))}
        </div>

        {selectedPlan && (
          <motion.p
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center text-sm text-white/30"
          >
            You selected: <span className="text-white/60">{selectedPlan.name} Bundle ({selectedPlan.subs} subscriptions)</span> for <span className="text-[#ff7a4d] font-bold">${selectedPlan.price}/month</span>
            {" — "}Save ${((selectedPlan.wasPrice - selectedPlan.price)).toFixed(2)} per month compared to individual subscriptions
          </motion.p>
        )}
      </div>
    </section>
  );
}
