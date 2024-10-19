import { Dot } from "../types.d";
import {
  CANVAS_HEIGHT as CH,
  CANVAS_WIDTH as CW,
  COEFFICIENT_OF_RESTITUTION as restitution,
} from "./consts.d";

export function calculateCollision(dot: Dot, dot2: Dot) {
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

  const newDpNorm1 = (dpNorm1 * (m1 - m2) + 2 * m2 * dpNorm2) / (m1 + m2);
  const newDpNorm2 = (dpNorm2 * (m2 - m1) + 2 * m1 * dpNorm1) / (m1 + m2);

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

export function manageBoundaryCollision(dot: Dot) {
  if (dot.x - dot.radius < 0 || dot.x + dot.radius > CW) dot.vx *= -1;
  if (dot.x - dot.radius < 0) dot.x = dot.radius;
  if (dot.x + dot.radius > CW) dot.x = CW - dot.radius;
  if (dot.y - dot.radius < 0 || dot.y + dot.radius > CH) {
    dot.vy *= -1;
    if (dot.y - dot.radius < 0) dot.y = dot.radius;
    if (dot.y + dot.radius > CH) dot.y = CH - dot.radius;
  }
}
