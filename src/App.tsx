import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Dot } from "./types.d";

const initialDots: Dot[] = [{ x: 35, y: 15, vx: 1, vy: 1, radius: 10 }];

function App() {
  const dots = useRef<Dot[]>(initialDots);
  const ref = useRef<null | HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;
    function animate() {
      const canvas = ref.current;

      if (!canvas) return;
      canvas.width = 200;
      canvas.height = 200;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.beginPath();
      dots.current.forEach((dot) => {
        ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
      });
      ctx.fill();

      dots.current = dots.current.map((dot) => {
        return { ...dot, x: dot.x + dot.vx, y: dot.y + dot.vy };
      });

      dots.current.forEach((dot) => {
        if (dot.x - dot.radius < 0 || dot.x + dot.radius > canvas.width)
          dot.vx *= -1;
        if (dot.y - dot.radius < 0 || dot.y + dot.radius > canvas.height)
          dot.vy *= -1;
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
