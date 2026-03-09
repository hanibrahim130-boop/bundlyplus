import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const springX = useSpring(x, { stiffness: 600, damping: 35, mass: 0.15 });
  const springY = useSpring(y, { stiffness: 600, damping: 35, mass: 0.15 });

  const clickableSelector = useMemo(
    () => 'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]',
    []
  );

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    setEnabled(true);

    const handleMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as Element | null;
      setIsHovering(!!target?.closest(clickableSelector));
    };

    const onLeave = () => setEnabled(false);
    const onEnter = () => setEnabled(true);

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [clickableSelector, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[120] h-3 w-3 rounded-full bg-[#ff7a4d] mix-blend-screen"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isHovering ? 2.6 : 1, boxShadow: isHovering ? "0 0 40px 12px rgba(255,122,77,0.45)" : "0 0 16px 2px rgba(255,122,77,0.35)" }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[119] h-10 w-10 rounded-full border border-[#39efd0]/55"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isHovering ? 1.35 : 1, opacity: isHovering ? 0.9 : 0.48 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      />
    </>
  );
}
