import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; size: number; speedX: number; speedY: number;
  opacity: number; rotation: number; rotSpeed: number;
}

const EFFECTS: Record<string, { color: string; shape: "circle" | "star" | "heart" | "snow"; count: number }> = {
  hearts: { color: "#e74c3c", shape: "heart", count: 25 },
  stars: { color: "#f1c40f", shape: "star", count: 30 },
  snow: { color: "#ffffff", shape: "snow", count: 40 },
  confetti: { color: "#multi", shape: "circle", count: 50 },
};

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  const s = size * 0.6;
  ctx.moveTo(x, y + s / 4);
  ctx.quadraticCurveTo(x, y, x + s / 4, y);
  ctx.quadraticCurveTo(x + s / 2, y, x + s / 2, y + s / 4);
  ctx.quadraticCurveTo(x + s / 2, y, x + s * 3 / 4, y);
  ctx.quadraticCurveTo(x + s, y, x + s, y + s / 4);
  ctx.quadraticCurveTo(x + s, y + s / 2, x + s / 2, y + s * 3 / 4);
  ctx.quadraticCurveTo(x, y + s / 2, x, y + s / 4);
  ctx.fill();
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const spikes = 5, outerR = size * 0.5, innerR = size * 0.2;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / spikes) * i - Math.PI / 2;
    const method = i === 0 ? "moveTo" : "lineTo";
    ctx[method](x + r * Math.cos(angle), y + r * Math.sin(angle));
  }
  ctx.closePath();
  ctx.fill();
}

export function ParticleCanvas({ effect }: { effect: string | null | undefined }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!effect || !EFFECTS[effect]) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = EFFECTS[effect];
    let animId: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const confettiColors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#e67e22"];

    const particles: Particle[] = Array.from({ length: config.count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: 4 + Math.random() * 8,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: 0.3 + Math.random() * 1,
      opacity: 0.3 + Math.random() * 0.7,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = effect === "confetti" ? confettiColors[i % confettiColors.length] : config.color;

        if (config.shape === "heart") drawHeart(ctx, -p.size / 2, -p.size / 2, p.size);
        else if (config.shape === "star") drawStar(ctx, 0, 0, p.size);
        else if (config.shape === "snow") { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); }

        ctx.restore();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [effect]);

  if (!effect || !EFFECTS[effect]) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 z-40 pointer-events-none" />;
}
