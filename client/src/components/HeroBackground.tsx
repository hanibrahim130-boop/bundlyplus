import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  radius: number;
  life: number;
  maxLife: number;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;
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
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.1,
      alpha: 0,
      radius: Math.random() * 1.5 + 0.4,
      life: 0,
      maxLife: Math.random() * 280 + 160,
    });

    for (let i = 0; i < 70; i++) {
      const p = spawn();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const CONNECTION_DIST = 100;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      if (Math.random() < 0.25) particles.push(spawn());
      if (particles.length > 120) particles.splice(0, 1);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const halfLife = p.maxLife / 2;
        p.alpha = p.life < halfLife
          ? (p.life / halfLife)
          : (1 - (p.life - halfLife) / halfLife);
        p.alpha = Math.max(0, Math.min(1, p.alpha)) * 0.55;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const lineAlpha = (1 - dist / CONNECTION_DIST) * Math.min(p.alpha, q.alpha) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255,122,77,${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
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
    />
  );
}

const ORBS = [
  { color: "#ff7a4d", size: 560, x: "28%", y: "35%", dur: 14, xRange: 80, yRange: 60, blur: 140, opacity: 0.09 },
  { color: "#ff4d4d", size: 380, x: "68%", y: "20%", dur: 19, xRange: 60, yRange: 80, blur: 120, opacity: 0.07 },
  { color: "#39efd0", size: 300, x: "80%", y: "70%", dur: 16, xRange: 100, yRange: 50, blur: 130, opacity: 0.06 },
  { color: "#5865F2", size: 260, x: "12%", y: "72%", dur: 22, xRange: 70, yRange: 90, blur: 110, opacity: 0.07 },
  { color: "#ffb347", size: 200, x: "50%", y: "8%",  dur: 18, xRange: 120, yRange: 40, blur: 100, opacity: 0.05 },
];

function AuroraOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            translateX: "-50%",
            translateY: "-50%",
            background: orb.color,
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity,
          }}
          animate={{
            x: [0, orb.xRange, -orb.xRange * 0.5, orb.xRange * 0.3, 0],
            y: [0, -orb.yRange * 0.6, orb.yRange, -orb.yRange * 0.3, 0],
            scale: [1, 1.15, 0.9, 1.1, 1],
            opacity: [orb.opacity, orb.opacity * 1.6, orb.opacity * 0.7, orb.opacity * 1.3, orb.opacity],
          }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.8,
          }}
        />
      ))}
    </div>
  );
}

function GridPulse() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
        animate={{ opacity: [0.5, 1, 0.6, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,122,77,0.04) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.12, 0.95, 1.08, 1], opacity: [0.5, 1, 0.6, 1, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

const SHOOTING_STARS = [
  { delay: 0,    dur: 1.8, startX: "10%",  startY: "8%",  angle: 35 },
  { delay: 2.5,  dur: 1.4, startX: "55%",  startY: "3%",  angle: 28 },
  { delay: 5.1,  dur: 2.0, startX: "75%",  startY: "12%", angle: 42 },
  { delay: 8.3,  dur: 1.6, startX: "30%",  startY: "5%",  angle: 30 },
  { delay: 11.7, dur: 1.5, startX: "85%",  startY: "18%", angle: 38 },
  { delay: 14.2, dur: 1.9, startX: "5%",   startY: "20%", angle: 25 },
  { delay: 17.6, dur: 1.3, startX: "62%",  startY: "2%",  angle: 45 },
];

function ShootingStars() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {SHOOTING_STARS.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        const len = 180;
        const dx = Math.cos(rad) * len;
        const dy = Math.sin(rad) * len;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: s.startX, top: s.startY }}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0.7, 0],
              x: [0, dx * 0.3, dx],
              y: [0, dy * 0.3, dy],
            }}
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Infinity,
              repeatDelay: 18 + i * 1.5,
              ease: "easeIn",
            }}
          >
            <div
              style={{
                width: len,
                height: 1.5,
                transform: `rotate(${s.angle}deg)`,
                transformOrigin: "left center",
                background: "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,180,100,0.5), transparent)",
                borderRadius: 2,
                boxShadow: "0 0 6px rgba(255,200,120,0.6)",
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
      <GridPulse />
      <ParticleCanvas />
      <ShootingStars />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 60% at 50% 50%, transparent 40%, #050505 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none bg-gradient-to-t from-[#050505] to-transparent" />
    </div>
  );
}
