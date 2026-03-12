import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import brandLogo from "@assets/bundly-logo-trimmed.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"logo" | "exit">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("exit"), 1800);
    const t2 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : null}
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: "#050505" }}
        initial={{ opacity: 1 }}
        animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 400,
              height: 400,
              left: "50%",
              top: "50%",
              x: "-50%",
              y: "-50%",
              background: "radial-gradient(circle, rgba(251,114,70,0.3) 0%, rgba(251,114,70,0) 70%)",
              filter: "blur(60px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.8, 0.5] }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />

          <motion.div
            className="absolute rounded-full"
            style={{
              width: 200,
              height: 200,
              left: "30%",
              top: "60%",
              background: "radial-gradient(circle, rgba(43,253,200,0.15) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3], opacity: [0, 0.4] }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          />
        </div>

        <div className="relative flex flex-col items-center gap-6">
          <motion.div
            className="relative"
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src={brandLogo}
              alt="Bundly Plus"
              className="h-10 w-auto sm:h-12"
              initial={{ filter: "brightness(0)" }}
              animate={{ filter: "brightness(1)" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </motion.div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.span
              className="text-xs tracking-[0.3em] uppercase text-white/40 font-light"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Lebanon's #1 Digital Marketplace
            </motion.span>
          </motion.div>

          <motion.div
            className="flex gap-1 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#fb7246" }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="h-[2px] w-24 rounded-full overflow-hidden bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#fb7246" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.6, delay: 0.2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
