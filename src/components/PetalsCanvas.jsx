import { useEffect, useRef } from "react";

/**
 * Soft marigold petals drifting down the page.
 * Canvas based, pauses off-screen, and keeps the particle count low on
 * phones so scrolling stays smooth.
 */
function PetalsCanvas({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const colors = [
      "#f6e3c3", // marigold cream
      "#e8a24a", // marigold gold
      "#d98b3a", // marigold amber
      "#c2653f", // terracotta
      "#c2a878", // antique zari
      "#7d9a72", // mango leaf green
    ];

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const count = window.innerWidth < 600 ? 14 : 26;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    class Petal {
      constructor(init) {
        this.reset(init);
      }

      reset(init) {
        this.x = Math.random() * window.innerWidth;
        this.y = init
          ? Math.random() * window.innerHeight * 2 - window.innerHeight
          : -24;
        this.r = 3.5 + Math.random() * 4.5;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = 0.45 + Math.random() * 0.85;
        this.rot = Math.random() * Math.PI * 2;
        this.drot = (Math.random() - 0.5) * 0.035;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 0.35 + Math.random() * 0.35;
      }

      update() {
        this.x += this.vx + Math.sin(this.y * 0.012) * 0.3;
        this.y += this.vy;
        this.rot += this.drot;
        if (this.y > window.innerHeight + 24) this.reset(false);
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.r * 0.55, this.r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    resize();
    const petals = Array.from({ length: count }, () => new Petal(true));

    let raf = 0;
    let running = false;

    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      petals.forEach((petal) => {
        petal.update();
        petal.draw();
      });
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || prefersReduced || !active) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    start();

    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  return (
    <canvas
      id="petals-canvas"
      ref={canvasRef}
      className={active ? "active" : ""}
      aria-hidden="true"
    />
  );
}

export default PetalsCanvas;