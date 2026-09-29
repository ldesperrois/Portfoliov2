<template>
  <div class="electric-wrapper" ref="wrapperRef">
    <canvas ref="canvasRef" class="electric-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const wrapperRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

let animationFrameId: number | null = null;

interface Point {
  x: number;
  y: number;
}

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number;
  width: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Arc {
  segments: Segment[];
  branches: Segment[];
  life: number;
  maxLife: number;
  colorCore: string;
  colorGlow: string;
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

onMounted(() => {
  const canvas = canvasRef.value;
  const wrapper = wrapperRef.value;
  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;

  const mouse = {
    x: -9999,
    y: -9999,
    active: false,
    hoverTimer: 0,
  };

  const anchors: NodePoint[] = [];
  const activeArcs: Arc[] = [];
  const sparks: Spark[] = [];

  const resize = () => {
    if (!wrapper || !canvas) return;
    width = wrapper.clientWidth;
    height = wrapper.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    initAnchors();
  };

  // Pôles électriques / générateurs d'arcs
  const initAnchors = () => {
    anchors.length = 0;
    const count = width < 768 ? 4 : 6;
    for (let i = 0; i < count; i++) {
      anchors.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 2,
      });
    }
  };

  // Algorithme fractal de déplacement de point médian pour créer un arc électrique réaliste
  const generateArcSegments = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    displace: number,
    depth: number,
    maxDepth: number,
    segments: Segment[],
    branches: Segment[]
  ) => {
    if (depth >= maxDepth) {
      segments.push({
        x1,
        y1,
        x2,
        y2,
        alpha: 1,
        width: Math.max(0.6, 2 - depth * 0.25),
      });
      return;
    }

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const normalX = -dy;
    const normalY = dx;
    const len = Math.sqrt(normalX * normalX + normalY * normalY) || 1;

    // Déplacement aléatoire perpendiculaire
    const offset = (Math.random() - 0.5) * displace;
    const nx = midX + (normalX / len) * offset;
    const ny = midY + (normalY / len) * offset;

    // Branche secondaire aléatoire
    if (depth > 1 && Math.random() < 0.28 && branches.length < 25) {
      const branchDx = (nx - x1) * 0.7 + (Math.random() - 0.5) * 35;
      const branchDy = (ny - y1) * 0.7 + (Math.random() - 0.5) * 35;
      branches.push({
        x1: nx,
        y1: ny,
        x2: nx + branchDx,
        y2: ny + branchDy,
        alpha: 0.65,
        width: 0.8,
      });
    }

    generateArcSegments(x1, y1, nx, ny, displace * 0.52, depth + 1, maxDepth, segments, branches);
    generateArcSegments(nx, ny, x2, y2, displace * 0.52, depth + 1, maxDepth, segments, branches);
  };

  const spawnArc = (x1: number, y1: number, x2: number, y2: number, intense = false) => {
    const segments: Segment[] = [];
    const branches: Segment[] = [];
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const displace = Math.min(dist * 0.35, 70);

    generateArcSegments(x1, y1, x2, y2, displace, 0, 5, segments, branches);

    activeArcs.push({
      segments,
      branches,
      life: intense ? 14 : Math.floor(Math.random() * 8 + 6),
      maxLife: intense ? 14 : 12,
      colorCore: '#ffffff',
      colorGlow: intense ? '#00f0ff' : '#0ea5e9',
    });

    // Créer des étincelles au point de contact
    for (let i = 0; i < (intense ? 6 : 3); i++) {
      sparks.push({
        x: x2,
        y: y2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        maxLife: Math.random() * 15 + 10,
        color: Math.random() > 0.4 ? '#00f0ff' : '#ffffff',
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  };

  const handleMouseLeave = () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  };

  let tick = 0;

  const animate = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    tick++;

    // Déplacement lent des pôles électriques
    for (const a of anchors) {
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 30 || a.x > width - 30) a.vx *= -1;
      if (a.y < 30 || a.y > height - 30) a.vy *= -1;

      // Halo externe du pôle
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = '#0ea5e9';
      ctx.globalAlpha = 0.2;
      ctx.fill();

      // Cœur du pôle
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.globalAlpha = 0.7;
      ctx.fill();
    }

    // Décharges spontanées entre pôles
    if (tick % 32 === 0 && anchors.length >= 2 && activeArcs.length < 4) {
      const i1 = Math.floor(Math.random() * anchors.length);
      let i2 = Math.floor(Math.random() * anchors.length);
      if (i1 === i2) i2 = (i1 + 1) % anchors.length;

      const p1 = anchors[i1];
      const p2 = anchors[i2];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

      if (dist < width * 0.65) {
        spawnArc(p1.x, p1.y, p2.x, p2.y, false);
      }
    }

    // Interaction souris : arc électrique attiré vers le curseur (effet Tesla / Plasma)
    if (mouse.active && tick % 8 === 0 && anchors.length > 0 && activeArcs.length < 5) {
      let closestAnchor = anchors[0];
      let minDist = Infinity;
      for (const a of anchors) {
        const d = Math.hypot(mouse.x - a.x, mouse.y - a.y);
        if (d < minDist) {
          minDist = d;
          closestAnchor = a;
        }
      }

      if (minDist < 450) {
        spawnArc(closestAnchor.x, closestAnchor.y, mouse.x, mouse.y, true);
      }
    }

    // Dessin des arcs électriques actifs (rendu multi-passes ultra fluide)
    for (let i = activeArcs.length - 1; i >= 0; i--) {
      const arc = activeArcs[i];
      const alphaRatio = arc.life / arc.maxLife;

      // Passe 1 : Halo lumineux électrique externe large
      ctx.beginPath();
      for (const seg of arc.segments) {
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
      }
      ctx.strokeStyle = arc.colorGlow;
      ctx.lineWidth = 5.5;
      ctx.globalAlpha = alphaRatio * 0.22;
      ctx.stroke();

      // Passe 2 : Halo moyen
      ctx.lineWidth = 2.4;
      ctx.globalAlpha = alphaRatio * 0.65;
      ctx.stroke();

      // Passe 3 : Noyau chaud blanc pur au centre de l'éclair
      ctx.strokeStyle = arc.colorCore;
      ctx.lineWidth = 1;
      ctx.globalAlpha = alphaRatio * 0.95;
      ctx.stroke();

      // Branches secondaires
      if (arc.branches.length > 0) {
        ctx.beginPath();
        for (const b of arc.branches) {
          ctx.moveTo(b.x1, b.y1);
          ctx.lineTo(b.x2, b.y2);
        }
        ctx.strokeStyle = arc.colorGlow;
        ctx.lineWidth = 1;
        ctx.globalAlpha = alphaRatio * 0.45;
        ctx.stroke();
      }

      arc.life--;
      if (arc.life <= 0) {
        activeArcs.splice(i, 1);
      }
    }

    // Dessin et mise à jour des étincelles (sparks)
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 1 / s.maxLife;

      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0, s.life);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    animationFrameId = requestAnimationFrame(animate);
  };

  resize();
  window.addEventListener('resize', resize);
  wrapper.addEventListener('mousemove', handleMouseMove);
  wrapper.addEventListener('mouseleave', handleMouseLeave);

  animationFrameId = requestAnimationFrame(animate);

  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resize);
    if (wrapper) {
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
    }
  });
});
</script>

<style scoped>
.electric-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: auto;
  z-index: 0;
  background: radial-gradient(circle at 50% 35%, #081126 0%, #040816 60%, #02040a 100%);
}

.electric-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
