import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp, Github, Twitter, Linkedin } from "lucide-react";
import { useRef } from "react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#products" },
  { label: "Docs", href: "#" },
  { label: "Changelog", href: "#" },
];

const SOCIAL = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

function BundlyLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4h8c4.4 0 8 3.6 8 8s-3.6 8-8 8h-8V4z" stroke="white" strokeWidth="1.8" fill="none" />
      <path d="M12 20h9c4.4 0 8 3.6 8 8s-3.6 8-8 8h-9V20z" stroke="white" strokeWidth="1.8" fill="none" />
      <rect x="1" y="3" width="4" height="4" rx="0.6" fill="#ff7a4d" />
      <rect x="6" y="3" width="4" height="4" rx="0.6" fill="#ff7a4d" opacity="0.6" />
      <rect x="1" y="8" width="4" height="4" rx="0.6" fill="#ff7a4d" opacity="0.7" />
      <rect x="6" y="8" width="4" height="4" rx="0.6" fill="#ff7a4d" opacity="0.4" />
      <rect x="1" y="13" width="4" height="4" rx="0.6" fill="#ff7a4d" opacity="0.5" />
    </svg>
  );
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer ref={ref} className="relative bg-[#050505] pb-10 pt-32 md:pt-48" style={{ overflowX: "hidden" }}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff7a4d]/5 blur-[200px]" />

      <motion.div style={{ y, opacity }} className="mx-auto max-w-[1400px] px-2 sm:px-6 md:px-10 lg:px-14">
        <div className="mb-20">
          <h2
            style={{ fontFamily: "var(--font-syne)" }}
            className="text-5xl font-bold uppercase leading-[0.85] tracking-tight text-white md:text-7xl lg:text-[8rem]"
          >
            Ready to
            <br />
            <span className="text-[#ff7a4d]">bundle?</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/40">
            Brutalist subscriptions for modern commerce. Built with obsessive attention to speed and craft.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-footer-shop"
              className="flex items-center gap-2 rounded-full bg-[#ff7a4d] px-8 py-4 text-sm font-bold text-black shadow-[0_0_40px_rgba(255,122,77,0.4)] hover:shadow-[0_0_60px_rgba(255,122,77,0.6)] hover:scale-105 active:scale-95 transition-all"
            >
              Get Started Now
            </button>
            <a
              href={`https://wa.me/96176171003?text=${encodeURIComponent("Hi Bundly+! I'd like to learn more about your subscriptions.")}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-footer-whatsapp"
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#25d366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              Contact us
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <BundlyLogo size={28} />
              <span style={{ fontFamily: "var(--font-syne)" }} className="font-bold text-white">
                Bundly<span className="text-[#ff7a4d]">+</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/40 hover:text-white transition-colors"
                  data-testid={`link-footer-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 text-white/40 hover:bg-white/10 hover:text-white transition-all"
                  data-testid={`link-social-${label.toLowerCase()}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}

              <button
                onClick={scrollToTop}
                data-testid="button-scroll-top"
                className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 text-white/40 hover:bg-white/10 hover:text-white transition-all"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/25">© 2026 Bundly+. All rights reserved. Built for Lebanon.</p>
            <div className="flex gap-4">
              <a href="#" className="text-xs text-white/25 hover:text-white/50 transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-white/25 hover:text-white/50 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
