import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;
    let frame = 0;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      alpha: number; radius: number;
      life: number; maxLife: number;
    }

    const particles: Particle[] = [];

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawn = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35 - 0.08,
      alpha: 0,
      radius: Math.random() * 1.2 + 0.4,
      life: 0,
      maxLife: Math.random() * 240 + 140,
    });

    for (let i = 0; i < 35; i++) {
      const p = spawn();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const draw = () => {
      animId = requestAnimationFrame(draw);
      frame++;
      if (frame % 2 !== 0) return;

      ctx.clearRect(0, 0, w, h);

      if (Math.random() < 0.07 && particles.length < 55) particles.push(spawn());

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }

        const halfLife = p.maxLife / 2;
        const t = p.life < halfLife
          ? p.life / halfLife
          : 1 - (p.life - halfLife) / halfLife;
        p.alpha = Math.max(0, Math.min(1, t)) * 0.5;

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 6.283);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ willChange: "transform" }}
    />
  );
}

function AuroraOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="aurora-orb-1" />
      <div className="aurora-orb-2" />
      <div className="aurora-orb-3" />
    </div>
  );
}

function GridLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,122,77,0.04) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

const SHOOTING_STARS = [
  { delay: 0,   dur: 1.8, startX: "15%", startY: "8%",  angle: 35 },
  { delay: 6.5, dur: 1.5, startX: "60%", startY: "4%",  angle: 30 },
  { delay: 14,  dur: 1.7, startX: "80%", startY: "14%", angle: 40 },
];

function ShootingStars() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {SHOOTING_STARS.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        const len = 160;
        const dx = Math.cos(rad) * len;
        const dy = Math.sin(rad) * len;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: s.startX, top: s.startY, willChange: "transform, opacity" }}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], x: [0, dx], y: [0, dy] }}
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Infinity,
              repeatDelay: 22 + i * 4,
              ease: "easeIn",
            }}
          >
            <div
              style={{
                width: len,
                height: 1.5,
                transform: `rotate(${s.angle}deg)`,
                transformOrigin: "left center",
                background: "linear-gradient(90deg, rgba(255,255,255,0.85), rgba(255,180,100,0.4), transparent)",
                borderRadius: 2,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <AuroraOrbs />
      <GridLayer />
      <ParticleCanvas />
      <ShootingStars />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 60% at 50% 50%, transparent 40%, #1f2626 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none bg-gradient-to-t from-[#1f2626] to-transparent" />
    </div>
  );
}
