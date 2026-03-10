import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { useRef } from "react";

const REVIEWS = [
  {
    initials: "LH",
    name: "Layla Hassan",
    role: "Digital Creator",
    color: "#ff7a4d",
    text: "Bundly+ saves me $180/month on subscriptions. The bundles are perfectly curated and delivery is instant!",
    stars: 5,
  },
  {
    initials: "KK",
    name: "Karim Khalil",
    role: "Software Developer",
    color: "#39efd0",
    text: "Finally, a one-stop shop for all my subscriptions. ChatGPT, Adobe, and Spotify in one place. Game changer.",
    stars: 5,
  },
  {
    initials: "NM",
    name: "Nadia Mansour",
    role: "Freelance Designer",
    color: "#ffd700",
    text: "The savings on the Ultimate bundle is insane. Got everything I need instantly. Highly recommend!",
    stars: 5,
  },
  {
    initials: "JT",
    name: "Joe Tannous",
    role: "Entrepreneur",
    color: "#ff7a4d",
    text: "The WhatsApp checkout is so simple. Placed my order and received credentials in under 5 minutes. Brilliant.",
    stars: 5,
  },
  {
    initials: "SR",
    name: "Sara Rizk",
    role: "Student",
    color: "#39efd0",
    text: "As a student on a budget, Bundly+ is a lifesaver. Netflix and Spotify for under $7 combined? Unreal.",
    stars: 5,
  },
  {
    initials: "MH",
    name: "Marc Habib",
    role: "Content Creator",
    color: "#ffd700",
    text: "Been using Bundly+ for 6 months. Never had an issue. Support is fast and the prices are unbeatable.",
    stars: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const headingRotateX = useTransform(scrollYProgress, [0, 0.2], [22, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.18], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  const stripLeft = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const stripRight = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={sectionRef} className="relative bg-[#050505] py-24 md:py-36" style={{ overflowX: "hidden" }}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#39efd0]/5 blur-[140px]" />

      <div className="mx-auto max-w-[1400px] px-2 sm:px-6 md:px-10 lg:px-14">
        <div style={{ perspective: "1000px" }}>
          <motion.div
            style={{ rotateX: headingRotateX, opacity: headingOpacity, y: headingY }}
            className="mb-14 text-center"
            >
            <div style={{ transformOrigin: "top center" }}>
              <span className="mb-4 inline-block rounded-full border border-[#39efd0]/30 bg-[#39efd0]/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#39efd0]">
                Customer Love
              </span>
              <h2
                style={{ fontFamily: "var(--font-syne)" }}
                className="text-4xl font-bold uppercase leading-[0.9] tracking-tight text-white md:text-6xl"
              >
                Trusted by <br />
                <span className="text-[#39efd0]">thousands</span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/45">
                Real stories from real users who switched to smarter subscriptions.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1200px" }}>
          {REVIEWS.map((review, i) => {
            const col = i % 3;
            const rotateYInit = col === 0 ? -18 : col === 2 ? 18 : 0;
            const xInit = col === 0 ? -60 : col === 2 ? 60 : 0;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, rotateY: rotateYInit, x: xInit, z: -80, scale: 0.88 }}
                whileInView={{ opacity: 1, rotateY: 0, x: 0, z: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.85, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.03, rotateY: 2, z: 20, transition: { duration: 0.2 } }}
                className="flex flex-col gap-4 rounded-xl sm:rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-6 backdrop-blur-xl cursor-default"
                style={{ transformStyle: "preserve-3d" }}
                data-testid={`card-review-${i}`}
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.stars }).map((_, si) => (
                    <Star key={si} className="h-3.5 w-3.5 fill-[#ffd700] text-[#ffd700]" />
                  ))}
                </div>

                <p className="flex-1 text-sm leading-relaxed text-white/60">
                  "{review.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black"
                    style={{ background: review.color }}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{review.name}</p>
                    <p className="text-xs text-white/40">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 grid grid-cols-3 divide-x divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-white/[0.02]"
        >
          {[
            { value: "1200+", label: "Happy Users" },
            { value: "4.9/5", label: "Avg Rating" },
            { value: "3500+", label: "Instant Deliveries" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 py-6 px-4 text-center">
              <span style={{ fontFamily: "var(--font-syne)" }} className="text-2xl md:text-3xl font-black text-white">{value}</span>
              <span className="text-xs text-white/40">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
