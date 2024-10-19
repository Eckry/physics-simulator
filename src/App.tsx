import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Dot } from "./types.d";
import {
  calculateCollision,
  drawDots,
  manageBoundaryCollision,
} from "./utils/functions";
import { CANVAS_HEIGHT as CH, CANVAS_WIDTH as CW } from "./utils/consts.d";

const initialDots: Dot[] = [
  {
    x: 50,
    y: 100,
    vx: 0,
    vy: 0,
    radius: 20,
    color: "GREEN",
    mass: 50,
    isDragging: false,
  },
  {
    x: 130,
    y: 150,
    vx: 6,
    vy: -4,
    radius: 20,
    color: "RED",
    mass: 5,
    isDragging: false,
  },
  {
    x: 80,
    y: 150,
    vx: 5,
    vy: -4,
    radius: 20,
    color: "BLUE",
    mass: 5,
    isDragging: false,
  },
  {
    x: 170,
    y: 150,
    vx: 4,
    vy: -4,
    radius: 20,
    color: "GOLDENROD",
    mass: 5,
    isDragging: false,
  },
];

function App() {
  const [play, setPlay] = useState(false);
  const dots = useRef<Dot[]>(initialDots);
  const isDragging = useRef(false);
  const ref = useRef<HTMLCanvasElement>(null);

  function switchPlay() {
    setPlay(!play);
  }

  useEffect(() => {
    let requestId: number;

    function animate() {
      if (!ref.current) return;
      dots.current = dots.current.map((dot) => {
        return { ...dot, x: dot.x + dot.vx, y: dot.y + dot.vy };
      });

      drawDots(dots.current, ref.current);

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

      requestId = requestAnimationFrame(animate);
    }

    if (play) animate();

    return () => cancelAnimationFrame(requestId);
  }, [play]);

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault();
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    dots.current.forEach((dot) => {
      const distance = Math.hypot(dot.x - x, dot.y - y);
      if (distance < dot.radius) {
        dot.isDragging = true;
        isDragging.current = true;
      }
    });
  }

  function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault();
    isDragging.current = false;

    dots.current.forEach((dot) => {
      dot.isDragging = false;
    });
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const mx = e.movementX;
    const my = e.movementY;

    dots.current.forEach((dot) => {
      if (dot.isDragging) {
        dot.y += my;
        dot.x += mx;
      }
    });
    if (!ref.current) return;
    drawDots(dots.current, ref.current);
  }

  return (
    <main>
      <button onClick={switchPlay}>Play</button>
      <canvas
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        height={CH}
        width={CW}
        ref={ref}
      ></canvas>
    </main>
  );
}

export default App;
