import { useEffect, useRef } from "react";

function PetalsCanvas({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const colors = [
      "#fdf5e6", // temple ivory
      "#e6d8ba", // soft ivory-gold
      "#c2a878", // antique zari gold
      "#8b0000", // kumkum crimson
      "#6f0000", // deep crimson shade
      "#043927", // emerald green accent
      "#ffffff", // highlight petal
    ];
    const count = window.innerWidth < 600 ? 22 : 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Petal {
      constructor(init) {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height * 2 - canvas.height : -20;
        this.r = 4 + Math.random() * 5;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = 0.6 + Math.random() * 1.1;
        this.rot = Math.random() * Math.PI * 2;
        this.drot = (Math.random() - 0.5) * 0.04;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 0.5 + Math.random() * 0.4;
      }

      update() {
        this.x += this.vx + Math.sin(this.y * 0.01) * 0.35;
        this.y += this.vy;
        this.rot += this.drot;
        if (this.y > canvas.height + 20) {
          this.x = Math.random() * canvas.width;
          this.y = -20;
        }
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
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((petal) => {
        petal.update();
        petal.draw();
      });
      raf = requestAnimationFrame(loop);
    };

    loop();
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      id="petals-canvas"
      ref={canvasRef}
      className={active ? "active" : ""}
    />
  );
}

export default PetalsCanvas;
