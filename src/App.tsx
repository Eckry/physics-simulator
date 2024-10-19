import { useEffect, useRef } from "react";
import "./App.css";
import { Dot } from "./types.d";
import { calculateCollision, manageBoundaryCollision } from "./utils/functions";
import { CANVAS_HEIGHT as CH, CANVAS_WIDTH as CW } from "./utils/consts.d";

const initialDots: Dot[] = [
  { x: 50, y: 100, vx: 0, vy: -4, radius: 20, color: "GREEN", mass: 50 },
  { x: 130, y: 150, vx: 6, vy: -4, radius: 20, color: "RED", mass: 5 },
  { x: 80, y: 150, vx: 5, vy: -4, radius: 20, color: "BLUE", mass: 5 },
  { x: 170, y: 150, vx: 4, vy: -4, radius: 20, color: "GOLDENROD", mass: 5 },
];

function App() {
  const dots = useRef<Dot[]>(initialDots);
  const ref = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;
    function animate() {
      const canvas = ref.current;

      if (!canvas) return;
      canvas.width = CW;
      canvas.height = CH;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      dots.current.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
        ctx.fillStyle = dot.color;
        ctx.fill();
      });

      dots.current.forEach((dot, i) => {
        manageBoundaryCollision(dot);

        dots.current.forEach((dot2, j) => {
          if (i !== j) {
            const distance = Math.hypot(dot.x - dot2.x, dot.y - dot2.y);
            if (distance < dot.radius + dot2.radius)
              calculateCollision(dot, dot2);
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
