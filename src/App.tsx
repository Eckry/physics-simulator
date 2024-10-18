import { useEffect, useRef } from "react";
import "./App.css";
import { Dot } from "./types.d";

const initialDots: Dot[] = [
  { x: 50, y: 100, vx: 0, vy: -4, radius: 20, color: "GREEN", mass: 50 },
  { x: 130, y: 150, vx: 6, vy: -4, radius: 20, color: "RED", mass: 5 },
  { x: 80, y: 150, vx: 5, vy: -4, radius: 20, color: "BLUE", mass: 5 },
  { x: 170, y: 150, vx: 4, vy: -4, radius: 20, color: "GOLDENROD", mass: 5 },
];

const restitution = 1;

function App() {
  const dots = useRef<Dot[]>(initialDots);
  const ref = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;
    function animate() {
      const canvas = ref.current;

      if (!canvas) return;
      canvas.width = 500;
      canvas.height = 400;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      dots.current.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
        ctx.fillStyle = dot.color;
        ctx.fill();
      });

      dots.current.forEach((dot, i) => {
        if (dot.x - dot.radius < 0 || dot.x + dot.radius > canvas.width)
          dot.vx *= -1;
        if (dot.x - dot.radius < 0) dot.x = dot.radius;
        if (dot.x + dot.radius > canvas.width)
          dot.x = canvas.width - dot.radius;
        if (dot.y - dot.radius < 0 || dot.y + dot.radius > canvas.height) {
          dot.vy *= -1;
          if (dot.y - dot.radius < 0) dot.y = dot.radius;
          if (dot.y + dot.radius > canvas.height)
            dot.y = canvas.height - dot.radius;
        }

        dots.current.forEach((dot2, j) => {
          if (i !== j) {
            const distance = Math.hypot(dot.x - dot2.x, dot.y - dot2.y);
            if (distance < dot.radius + dot2.radius) {
              const m1 = dot.mass;
              const m2 = dot2.mass;

              const dx = dot2.x - dot.x;
              const dy = dot2.y - dot.y;
              const distance = Math.hypot(dx, dy);

              const nx = dx / distance;
              const ny = dy / distance;

              const tx = -ny;
              const ty = nx;

              const dpTan1 = dot.vx * tx + dot.vy * ty;
              const dpTan2 = dot2.vx * tx + dot2.vy * ty;

              const dpNorm1 = dot.vx * nx + dot.vy * ny;
              const dpNorm2 = dot2.vx * nx + dot2.vy * ny;

              const newDpNorm1 =
                (dpNorm1 * (m1 - m2) + 2 * m2 * dpNorm2) / (m1 + m2);
              const newDpNorm2 =
                (dpNorm2 * (m2 - m1) + 2 * m1 * dpNorm1) / (m1 + m2);

              const finalDpNorm1 = restitution * newDpNorm1;
              const finalDpNorm2 = restitution * newDpNorm2;

              dot.vx = tx * dpTan1 + nx * finalDpNorm1;
              dot.vy = ty * dpTan1 + ny * finalDpNorm1;
              dot2.vx = tx * dpTan2 + nx * finalDpNorm2;
              dot2.vy = ty * dpTan2 + ny * finalDpNorm2;

              const overlap = dot.radius + dot2.radius - distance;
              const adjustX = (nx * overlap) / 2;
              const adjustY = (ny * overlap) / 2;

              dot.x -= adjustX;
              dot.y -= adjustY;
              dot2.x += adjustX;
              dot2.y += adjustY;
            }
          }
        });
      });

      dots.current = dots.current.map((dot) => {
        return { ...dot, x: dot.x + dot.vx, y: dot.y + dot.vy };
      });

      requestId = requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(requestId);
  }, []);

  return (
    <main>
      <canvas ref={ref ? ref : null}></canvas>
    </main>
  );
}

export default App;
