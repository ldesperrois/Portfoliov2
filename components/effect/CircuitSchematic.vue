<template>
  <div class="schematic-wrapper" ref="wrapperRef" aria-hidden="true">
    <canvas ref="canvasRef" class="schematic-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Fond de l'accueil : une vraie feuille de schéma (STM32 + régulateur + LED + UART + capteur I2C)
// dessinée comme dans un logiciel de CAO, avec les signaux qui circulent sur les pistes.

type Pt = [number, number];
type NetKind = 'power' | 'gnd' | 'data' | 'clock' | 'led' | 'static';

interface Geo { pts: Pt[]; cum: number[]; total: number }
interface Net { id: string; label: string; kind: NetKind; paths: Pt[][]; geo: Geo[] }
interface Pulse { g: Geo; d: number; speed: number; len: number; rgb: string; net: string }
interface Pin { n: string; num: string; at: number }
interface Item { key: number; draw: (c: CanvasRenderingContext2D, lp: number) => void }

const wrapperRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

// Espace de dessin du schéma (unités "feuille")
const DW = 1600;
const DH = 900;
const U1C: Pt = [1080, 460];

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const COL = {
  line: 'rgba(125, 165, 205, 0.30)',
  body: 'rgba(125, 165, 205, 0.40)',
  text: 'rgba(150, 185, 220, 0.50)',
  textDim: 'rgba(150, 185, 220, 0.30)',
  grid: 'rgba(125, 165, 205, 0.11)',
  frame: 'rgba(125, 165, 205, 0.20)',
  data: '125, 211, 252',
  power: '251, 191, 36',
  clock: '165, 180, 252',
  led: '255, 90, 54',
};

const buildGeo = (pts: Pt[]): Geo => {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  return { pts, cum, total: cum[cum.length - 1] };
};

const net = (id: string, label: string, kind: NetKind, paths: Pt[][]): Net => ({
  id, label, kind, paths, geo: paths.map(buildGeo),
});

// ---------------------------------------------------------------- Netlist
const NETS: Net[] = [
  net('3V3', '+3V3', 'power', [
    [[900, 250], [900, 340], [950, 340]],
    [[900, 300], [860, 300], [860, 318]],
    [[830, 720], [900, 720], [900, 690]],
    [[870, 720], [870, 738]],
    [[1460, 520], [1460, 660], [1390, 660], [1390, 700]],
    [[1460, 560], [1440, 560]],
    [[1460, 600], [1440, 600]],
    [[100, 620], [130, 620]],
  ]),
  net('5V', '+5V', 'power', [
    [[600, 690], [600, 720], [670, 720]],
    [[640, 720], [640, 738]],
  ]),
  net('GND', 'GND', 'gnd', [
    [[860, 326], [860, 345]],
    [[1420, 280], [1460, 280], [1460, 300]],
    [[1520, 460], [1500, 460], [1500, 480]],
    [[780, 448], [780, 480]],
    [[820, 488], [820, 510]],
    [[950, 540], [930, 540], [930, 560]],
    [[880, 555], [880, 580]],
    [[1350, 800], [1350, 825]],
    [[750, 760], [750, 785]],
    [[640, 746], [640, 770]],
    [[870, 746], [870, 770]],
    [[130, 710], [100, 710]],
  ]),
  net('PA5', 'LED (PA5)', 'led', [
    [[1210, 340], [1240, 340], [1240, 280], [1260, 280]],
    [[1320, 280], [1360, 280]],
  ]),
  net('TX', 'UART_TX', 'data', [[[1210, 380], [1520, 380]]]),
  net('RX', 'UART_RX', 'data', [[[1520, 420], [1210, 420]]]),
  net('SCL', 'I2C_SCL', 'data', [
    [[1210, 460], [1360, 460], [1360, 700]],
    [[1360, 560], [1380, 560]],
  ]),
  net('SDA', 'I2C_SDA', 'data', [
    [[1210, 500], [1320, 500], [1320, 700]],
    [[1320, 600], [1380, 600]],
  ]),
  net('NRST', 'NRST', 'static', [[[950, 380], [820, 380]]]),
  net('OSCI', 'OSC_IN', 'clock', [
    [[950, 420], [780, 420], [780, 440]],
    [[860, 420], [860, 428]],
  ]),
  net('OSCO', 'OSC_OUT', 'clock', [
    [[950, 460], [820, 460], [820, 480]],
    [[860, 460], [860, 452]],
  ]),
  net('BOOT0', 'BOOT0', 'static', [[[950, 500], [880, 500], [880, 515]]]),
  net('SWDIO', 'SWDIO', 'data', [[[1210, 540], [1235, 540]], [[100, 650], [130, 650]]]),
  net('SWCLK', 'SWCLK', 'data', [[[1210, 580], [1235, 580]], [[100, 680], [130, 680]]]),
];
const NET_MAP: Record<string, Net> = Object.fromEntries(NETS.map((n) => [n.id, n]));

// ---------------------------------------------------------------- Primitives de dessin
const sty = (c: CanvasRenderingContext2D, w = 1.2) => {
  c.strokeStyle = COL.body;
  c.lineWidth = w;
  c.lineCap = 'butt';
  c.lineJoin = 'miter';
};

const txt = (
  c: CanvasRenderingContext2D, str: string, x: number, y: number,
  size = 9, align: CanvasTextAlign = 'left', color = COL.text,
) => {
  c.font = `${size}px ${MONO}`;
  c.textAlign = align;
  c.textBaseline = 'middle';
  c.fillStyle = color;
  c.fillText(str, x, y);
};

const tracePartial = (c: CanvasRenderingContext2D, g: Geo, from: number, to: number) => {
  from = Math.max(0, from);
  to = Math.min(g.total, to);
  if (to <= from) return;
  let started = false;
  for (let i = 1; i < g.pts.length; i++) {
    const a = g.cum[i - 1];
    const b = g.cum[i];
    if (b < from) continue;
    if (a > to) break;
    const [x1, y1] = g.pts[i - 1];
    const [x2, y2] = g.pts[i];
    const len = b - a || 1;
    const s0 = Math.max(from, a);
    const e0 = Math.min(to, b);
    if (!started) {
      c.moveTo(x1 + ((x2 - x1) * (s0 - a)) / len, y1 + ((y2 - y1) * (s0 - a)) / len);
      started = true;
    }
    c.lineTo(x1 + ((x2 - x1) * (e0 - a)) / len, y1 + ((y2 - y1) * (e0 - a)) / len);
  }
};

const pointAt = (g: Geo, d: number): Pt => {
  d = Math.max(0, Math.min(g.total, d));
  for (let i = 1; i < g.pts.length; i++) {
    if (d <= g.cum[i]) {
      const [x1, y1] = g.pts[i - 1];
      const [x2, y2] = g.pts[i];
      const t = (d - g.cum[i - 1]) / (g.cum[i] - g.cum[i - 1] || 1);
      return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
    }
  }
  return g.pts[g.pts.length - 1];
};

const ic = (
  c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number,
  ref: string, part: string,
  pins: { left?: Pin[]; right?: Pin[]; top?: Pin[]; bottom?: Pin[] },
  labelsBelow = false,
) => {
  sty(c, 1.3);
  c.strokeRect(x, y, w, h);
  sty(c);
  c.beginPath();
  for (const p of pins.left ?? []) {
    c.moveTo(x - 30, p.at); c.lineTo(x, p.at);
    txt(c, p.n, x + 6, p.at, 8.5);
    txt(c, p.num, x - 15, p.at - 6, 7, 'center', COL.textDim);
  }
  for (const p of pins.right ?? []) {
    c.moveTo(x + w, p.at); c.lineTo(x + w + 30, p.at);
    txt(c, p.n, x + w - 6, p.at, 8.5, 'right');
    txt(c, p.num, x + w + 15, p.at - 6, 7, 'center', COL.textDim);
  }
  for (const p of pins.top ?? []) {
    c.moveTo(p.at, y - 30); c.lineTo(p.at, y);
    txt(c, p.n, p.at, y + 10, 8, 'center');
    txt(c, p.num, p.at + 4, y - 15, 7, 'left', COL.textDim);
  }
  for (const p of pins.bottom ?? []) {
    c.moveTo(p.at, y + h); c.lineTo(p.at, y + h + 30);
    txt(c, p.n, p.at, y + h - 9, 8, 'center');
    txt(c, p.num, p.at + 4, y + h + 15, 7, 'left', COL.textDim);
  }
  c.stroke();
  const ly = labelsBelow ? y + h + 14 : y - 22;
  txt(c, ref, x, ly, 11, 'left', COL.text);
  txt(c, part, x, ly + 12, 8.5, 'left', COL.textDim);
};

const resH = (c: CanvasRenderingContext2D, x: number, y: number, label: string) => {
  sty(c);
  c.beginPath();
  c.moveTo(x, y); c.lineTo(x + 10, y);
  c.moveTo(x + 50, y); c.lineTo(x + 60, y);
  c.stroke();
  c.strokeRect(x + 10, y - 6, 40, 12);
  txt(c, label, x + 30, y - 13, 8.5, 'center');
};

const resV = (c: CanvasRenderingContext2D, x: number, y: number, label: string) => {
  sty(c);
  c.beginPath();
  c.moveTo(x, y); c.lineTo(x, y + 5);
  c.moveTo(x, y + 35); c.lineTo(x, y + 40);
  c.stroke();
  c.strokeRect(x - 6, y + 5, 12, 30);
  txt(c, label, x - 12, y + 20, 8.5, 'right');
};

const capV = (c: CanvasRenderingContext2D, x: number, y: number, label: string, side: 'left' | 'right' = 'right') => {
  sty(c, 1.8);
  c.beginPath();
  c.moveTo(x - 9, y); c.lineTo(x + 9, y);
  c.moveTo(x - 9, y + 8); c.lineTo(x + 9, y + 8);
  c.stroke();
  if (side === 'right') txt(c, label, x + 14, y + 4, 8.5);
  else txt(c, label, x - 14, y + 4, 8.5, 'right');
};

const xtalV = (c: CanvasRenderingContext2D, x: number, y1: number, y2: number) => {
  sty(c, 1.6);
  c.beginPath();
  c.moveTo(x - 9, y1); c.lineTo(x + 9, y1);
  c.moveTo(x - 9, y2); c.lineTo(x + 9, y2);
  c.stroke();
  sty(c);
  c.strokeRect(x - 5, y1 + 5, 10, y2 - y1 - 10);
  txt(c, 'Y1', x + 14, y1 + 6, 8.5);
  txt(c, '8MHz', x + 14, y2 - 4, 8, 'left', COL.textDim);
};

const ledH = (c: CanvasRenderingContext2D, x: number, y: number) => {
  sty(c);
  c.beginPath();
  c.moveTo(x, y); c.lineTo(x + 18, y);
  c.moveTo(x + 36, y); c.lineTo(x + 60, y);
  c.moveTo(x + 18, y - 8); c.lineTo(x + 18, y + 8); c.lineTo(x + 36, y); c.closePath();
  c.moveTo(x + 36, y - 8); c.lineTo(x + 36, y + 8);
  for (const o of [0, 7]) {
    c.moveTo(x + 24 + o, y - 11); c.lineTo(x + 31 + o, y - 18);
    c.moveTo(x + 31 + o, y - 18); c.lineTo(x + 27 + o, y - 17);
    c.moveTo(x + 31 + o, y - 18); c.lineTo(x + 30 + o, y - 14);
  }
  c.stroke();
  txt(c, 'D1', x + 27, y + 16, 8.5, 'center');
};

const vcc = (c: CanvasRenderingContext2D, x: number, y: number, label: string) => {
  sty(c, 1.5);
  c.beginPath();
  c.moveTo(x - 9, y); c.lineTo(x + 9, y);
  c.stroke();
  txt(c, label, x, y - 8, 8.5, 'center');
};

const gnd = (c: CanvasRenderingContext2D, x: number, y: number) => {
  sty(c, 1.3);
  c.beginPath();
  c.moveTo(x - 11, y); c.lineTo(x + 11, y);
  c.moveTo(x - 7, y + 4); c.lineTo(x + 7, y + 4);
  c.moveTo(x - 3, y + 8); c.lineTo(x + 3, y + 8);
  c.stroke();
};

const junction = (c: CanvasRenderingContext2D, x: number, y: number) => {
  c.fillStyle = COL.body;
  c.beginPath();
  c.arc(x, y, 2.6, 0, Math.PI * 2);
  c.fill();
};

const flag = (c: CanvasRenderingContext2D, x: number, y: number, label: string, dir: 'left' | 'right') => {
  const w = label.length * 5.4 + 14;
  const k = dir === 'right' ? 1 : -1;
  sty(c, 1);
  c.beginPath();
  c.moveTo(x, y);
  c.lineTo(x + k * 6, y - 7);
  c.lineTo(x + k * w, y - 7);
  c.lineTo(x + k * w, y + 7);
  c.lineTo(x + k * 6, y + 7);
  c.closePath();
  c.stroke();
  txt(c, label, x + k * 10, y + 0.5, 8.5, dir === 'right' ? 'left' : 'right');
};

const header = (c: CanvasRenderingContext2D, x: number, y: number, h: number, ref: string, name: string, pins: Pin[], side: 'left' | 'right') => {
  sty(c, 1.3);
  c.strokeRect(x, y, 50, h);
  const px = side === 'left' ? x + 8 : x + 42;
  for (const p of pins) {
    c.beginPath();
    c.arc(px, p.at, 3, 0, Math.PI * 2);
    c.stroke();
    txt(c, p.n, side === 'left' ? px + 7 : px - 7, p.at, 8, side === 'left' ? 'left' : 'right');
  }
  txt(c, ref, x, y - 20, 11);
  txt(c, name, x, y - 8, 8.5, 'left', COL.textDim);
};

// ---------------------------------------------------------------- Composants du schéma
const SYMBOLS: { at: Pt; draw: (c: CanvasRenderingContext2D) => void }[] = [
  {
    at: U1C,
    draw: (c) => ic(c, 980, 300, 200, 320, 'U1', 'STM32F103C8T6', {
      left: [
        { n: 'VDD', num: '24', at: 340 }, { n: 'NRST', num: '7', at: 380 },
        { n: 'OSC_IN', num: '5', at: 420 }, { n: 'OSC_OUT', num: '6', at: 460 },
        { n: 'BOOT0', num: '44', at: 500 }, { n: 'VSS', num: '23', at: 540 },
      ],
      right: [
        { n: 'PA5', num: '15', at: 340 }, { n: 'PA9/TX', num: '30', at: 380 },
        { n: 'PA10/RX', num: '31', at: 420 }, { n: 'PB6/SCL', num: '42', at: 460 },
        { n: 'PB7/SDA', num: '43', at: 500 }, { n: 'PA13/SWDIO', num: '34', at: 540 },
        { n: 'PA14/SWCLK', num: '37', at: 580 },
      ],
    }),
  },
  {
    at: [750, 730],
    draw: (c) => ic(c, 700, 700, 100, 60, 'U2', 'AMS1117-3.3', {
      left: [{ n: 'VIN', num: '3', at: 720 }],
      right: [{ n: 'VOUT', num: '2', at: 720 }],
      bottom: [{ n: 'GND', num: '1', at: 750 }],
    }),
  },
  {
    at: [1350, 765],
    draw: (c) => ic(c, 1290, 730, 120, 70, 'U3', 'BME280', {
      top: [{ n: 'SDI', num: '3', at: 1320 }, { n: 'SCK', num: '4', at: 1360 }, { n: 'VDD', num: '8', at: 1390 }],
      bottom: [{ n: 'GND', num: '1', at: 1350 }],
    }, true),
  },
  {
    at: [1545, 420],
    draw: (c) => header(c, 1520, 360, 120, 'J1', 'UART', [
      { n: 'TX', num: '1', at: 380 }, { n: 'RX', num: '2', at: 420 }, { n: 'GND', num: '3', at: 460 },
    ], 'left'),
  },
  {
    at: [155, 665],
    draw: (c) => header(c, 130, 600, 130, 'J3', 'SWD', [
      { n: '3V3', num: '1', at: 620 }, { n: 'DIO', num: '2', at: 650 },
      { n: 'CLK', num: '3', at: 680 }, { n: 'GND', num: '4', at: 710 },
    ], 'left'),
  },
  { at: [1290, 280], draw: (c) => resH(c, 1260, 280, 'R1 330R') },
  { at: [1390, 280], draw: (c) => ledH(c, 1360, 280) },
  { at: [1410, 560], draw: (c) => resH(c, 1380, 560, 'R2 4k7') },
  { at: [1410, 600], draw: (c) => resH(c, 1380, 600, 'R3 4k7') },
  { at: [880, 535], draw: (c) => resV(c, 880, 515, 'R5 10k') },
  { at: [860, 322], draw: (c) => capV(c, 860, 318, 'C3 100n', 'left') },
  { at: [780, 444], draw: (c) => capV(c, 780, 440, 'C1 22p') },
  { at: [820, 484], draw: (c) => capV(c, 820, 480, 'C2 22p') },
  { at: [640, 742], draw: (c) => capV(c, 640, 738, 'C4 10u') },
  { at: [870, 742], draw: (c) => capV(c, 870, 738, 'C5 10u') },
  { at: [860, 440], draw: (c) => xtalV(c, 860, 428, 452) },
  { at: [900, 250], draw: (c) => vcc(c, 900, 250, '+3V3') },
  { at: [900, 690], draw: (c) => vcc(c, 900, 690, '+3V3') },
  { at: [1460, 520], draw: (c) => vcc(c, 1460, 520, '+3V3') },
  { at: [600, 690], draw: (c) => vcc(c, 600, 690, '+5V') },
  { at: [820, 380], draw: (c) => flag(c, 820, 380, 'NRST', 'left') },
  { at: [1235, 540], draw: (c) => flag(c, 1235, 540, 'SWDIO', 'right') },
  { at: [1235, 580], draw: (c) => flag(c, 1235, 580, 'SWCLK', 'right') },
  { at: [100, 620], draw: (c) => flag(c, 100, 620, '+3V3', 'left') },
  { at: [100, 650], draw: (c) => flag(c, 100, 650, 'SWDIO', 'left') },
  { at: [100, 680], draw: (c) => flag(c, 100, 680, 'SWCLK', 'left') },
  { at: [100, 710], draw: (c) => flag(c, 100, 710, 'GND', 'left') },
  ...([
    [860, 345], [1460, 300], [1500, 480], [780, 480], [820, 510], [930, 560],
    [880, 580], [1350, 825], [750, 785], [640, 770], [870, 770],
  ] as Pt[]).map((p) => ({ at: p, draw: (c: CanvasRenderingContext2D) => gnd(c, p[0], p[1]) })),
  ...([
    [900, 300], [860, 420], [860, 460], [1360, 560], [1320, 600],
    [1460, 560], [1460, 600], [640, 720], [870, 720],
  ] as Pt[]).map((p) => ({ at: p, draw: (c: CanvasRenderingContext2D) => junction(c, p[0], p[1]) })),
];

// Ordre d'apparition : le circuit se "trace" depuis le microcontrôleur vers l'extérieur
const buildItems = (): Item[] => {
  const raw: { dist: number; draw: Item['draw'] }[] = [];
  for (const n of NETS) {
    for (const g of n.geo) {
      raw.push({
        dist: Math.hypot(g.pts[0][0] - U1C[0], g.pts[0][1] - U1C[1]),
        draw: (c, lp) => {
          c.strokeStyle = COL.line;
          c.lineWidth = 1.2;
          c.lineCap = 'square';
          c.beginPath();
          tracePartial(c, g, 0, g.total * lp);
          c.stroke();
        },
      });
    }
  }
  for (const s of SYMBOLS) {
    raw.push({
      dist: Math.hypot(s.at[0] - U1C[0], s.at[1] - U1C[1]),
      draw: (c, lp) => {
        c.globalAlpha = lp;
        s.draw(c);
        c.globalAlpha = 1;
      },
    });
  }
  const max = Math.max(...raw.map((r) => r.dist)) || 1;
  return raw.map((r) => ({ key: r.dist / max, draw: r.draw }));
};
const ITEMS = buildItems();

// UART : le MCU envoie un message caractère par caractère sur TX
const UART_MSG = 'HELLO WORLD';
const WAVE_X0 = 1265;
const WAVE_W = 220;
const WAVE_HI = 355;
const WAVE_LO = 367;

onMounted(() => {
  const canvas = canvasRef.value;
  const wrapper = wrapperRef.value;
  if (!canvas || !wrapper) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let s = 1;
  let ox = 0;
  let oy = 0;

  const base = document.createElement('canvas');
  const baseCtx = base.getContext('2d')!;
  const full = document.createElement('canvas');
  const fullCtx = full.getContext('2d')!;
  let fullReady = false;

  const designT = (c: CanvasRenderingContext2D) => c.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy);
  const screenT = (c: CanvasRenderingContext2D) => c.setTransform(dpr, 0, 0, dpr, 0, 0);

  // ---------------------------------------------------------------- Couche fixe : grille, cadre, cartouche
  const renderBase = () => {
    const c = baseCtx;
    screenT(c);
    c.clearRect(0, 0, w, h);

    // Grille de points au pas du schéma
    designT(c);
    c.fillStyle = COL.grid;
    const step = 20;
    const x0 = Math.floor(-ox / s / step) * step;
    const x1 = (w - ox) / s;
    const y0 = Math.floor(-oy / s / step) * step;
    const y1 = (h - oy) / s;
    const dot = 1.3 / s;
    for (let x = x0; x <= x1; x += step) {
      for (let y = y0; y <= y1; y += step) c.fillRect(x - dot / 2, y - dot / 2, dot, dot);
    }

    // Cadre de feuille avec repères de zones
    screenT(c);
    const m = 12;
    const m2 = 28;
    c.strokeStyle = COL.frame;
    c.lineWidth = 1;
    c.strokeRect(m + 0.5, m + 0.5, w - 2 * m - 1, h - 2 * m - 1);
    c.strokeRect(m2 + 0.5, m2 + 0.5, w - 2 * m2 - 1, h - 2 * m2 - 1);
    const cols = w < 768 ? 4 : 8;
    const rows = w < 768 ? 6 : 4;
    c.beginPath();
    for (let i = 0; i < cols; i++) {
      const xa = m2 + ((w - 2 * m2) * i) / cols;
      const xm = m2 + ((w - 2 * m2) * (i + 0.5)) / cols;
      if (i > 0) {
        c.moveTo(Math.round(xa) + 0.5, m); c.lineTo(Math.round(xa) + 0.5, m2);
        c.moveTo(Math.round(xa) + 0.5, h - m2); c.lineTo(Math.round(xa) + 0.5, h - m);
      }
      txt(c, String(i + 1), xm, (m + m2) / 2, 9, 'center', COL.textDim);
      txt(c, String(i + 1), xm, h - (m + m2) / 2, 9, 'center', COL.textDim);
    }
    for (let i = 0; i < rows; i++) {
      const ya = m2 + ((h - 2 * m2) * i) / rows;
      const ym = m2 + ((h - 2 * m2) * (i + 0.5)) / rows;
      if (i > 0) {
        c.moveTo(m, Math.round(ya) + 0.5); c.lineTo(m2, Math.round(ya) + 0.5);
        c.moveTo(w - m2, Math.round(ya) + 0.5); c.lineTo(w - m, Math.round(ya) + 0.5);
      }
      const letter = String.fromCharCode(65 + i);
      txt(c, letter, (m + m2) / 2, ym, 9, 'center', COL.textDim);
      txt(c, letter, w - (m + m2) / 2, ym, 9, 'center', COL.textDim);
    }
    c.strokeStyle = COL.frame;
    c.stroke();
  };

  const renderSchematic = (c: CanvasRenderingContext2D, p: number) => {
    designT(c);
    for (const it of ITEMS) {
      const lp = Math.max(0, Math.min(1, (p - it.key * 0.65) / 0.35));
      if (lp > 0) it.draw(c, lp);
    }
  };

  const buildFull = () => {
    fullCtx.setTransform(1, 0, 0, 1, 0, 0);
    fullCtx.clearRect(0, 0, full.width, full.height);
    fullCtx.drawImage(base, 0, 0);
    renderSchematic(fullCtx, 1);
    fullReady = true;
  };

  const resize = () => {
    w = wrapper.clientWidth;
    h = wrapper.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (w < 768) {
      // Mobile : zoom sur le MCU et ses périphériques
      s = (h / DH) * 0.6;
      ox = w / 2 - 1180 * s;
    } else {
      s = Math.min(w / DW, h / 800);
      ox = (w - DW * s) / 2;
    }
    oy = (h - DH * s) / 2;
    for (const cv of [canvas, base, full]) {
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
    }
    renderBase();
    fullReady = false;
  };

  // ---------------------------------------------------------------- État animé
  const pulses: Pulse[] = [];
  let intro = reduceMotion ? 1 : 0;
  let introStart = -1;
  let time = 0;
  let ledOn = true;
  let ledT = 0;
  let powerT = 0;
  let oscT = 0;
  let i2cT = 1.5;
  let swdT = 4;
  let uartIdx = 0;
  let uartT = 0;
  let uartPhase: 'char' | 'gap' | 'end' = 'char';
  let terminal = '';
  const CHAR_T = 0.7;
  const GAP_T = 0.2;
  const END_T = 2.6;

  const spawn = (netId: string, pathIdx: number, speed: number, len: number, rgb: string, delay = 0) => {
    const g = NET_MAP[netId].geo[pathIdx];
    pulses.push({ g, d: -delay * speed, speed, len, rgb, net: netId });
  };

  const netActive = (id: string) => pulses.some((p) => p.net === id && p.d > 0 && p.d - p.len < p.g.total);

  const update = (dt: number, now: number) => {
    time += dt;
    if (intro < 1) {
      if (introStart < 0) introStart = now;
      intro = Math.min(1, (now - introStart) / 2600);
    }
    if (reduceMotion || intro < 0.6) return;

    // LED "blinky"
    ledT += dt;
    if (ledT > 0.6) {
      ledT = 0;
      ledOn = !ledOn;
      if (ledOn) {
        spawn('PA5', 0, 220, 22, COL.data);
        spawn('PA5', 1, 220, 22, COL.data, NET_MAP.PA5.geo[0].total / 220);
      }
    }

    // Alimentation : le courant part des régulateurs
    powerT += dt;
    if (powerT > 0.8) {
      powerT = 0;
      const n = Math.random() < 0.75 ? NET_MAP['3V3'] : NET_MAP['5V'];
      spawn(n.id, Math.floor(Math.random() * n.geo.length), 80, 26, COL.power);
    }

    // Quartz
    oscT += dt;
    if (oscT > 0.22) {
      oscT = 0;
      spawn(Math.random() < 0.5 ? 'OSCI' : 'OSCO', 0, 240, 12, COL.clock);
    }

    // Trame I2C vers le capteur
    i2cT += dt;
    if (i2cT > 3.4) {
      i2cT = 0;
      for (let i = 0; i < 9; i++) {
        spawn('SCL', 0, 260, 10, COL.clock, i * 0.09);
        if (Math.random() < 0.6) spawn('SDA', 0, 260, 10, COL.data, i * 0.09 + 0.04);
      }
    }

    // Débogueur SWD
    swdT += dt;
    if (swdT > 6) {
      swdT = 0;
      for (let i = 0; i < 4; i++) {
        spawn('SWCLK', 1, 90, 10, COL.clock, i * 0.25);
        spawn('SWCLK', 0, 90, 10, COL.clock, i * 0.25);
        spawn('SWDIO', 1, 90, 10, COL.data, i * 0.25 + 0.1);
        spawn('SWDIO', 0, 90, 10, COL.data, i * 0.25 + 0.1);
      }
    }

    // UART
    uartT += dt;
    if (uartPhase === 'char' && uartT >= CHAR_T) {
      terminal += UART_MSG[uartIdx];
      uartIdx++;
      uartT = 0;
      uartPhase = uartIdx >= UART_MSG.length ? 'end' : 'gap';
      if (uartPhase === 'end') spawn('RX', 0, 300, 28, COL.data, 0.4);
    } else if (uartPhase === 'gap' && uartT >= GAP_T) {
      uartT = 0;
      uartPhase = 'char';
      spawn('TX', 0, 420, 30, COL.data);
    } else if (uartPhase === 'end' && uartT >= END_T) {
      uartT = 0;
      uartIdx = 0;
      terminal = '';
      uartPhase = 'char';
      spawn('TX', 0, 420, 30, COL.data);
    }

    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.d += p.speed * dt;
      if (p.d - p.len > p.g.total) pulses.splice(i, 1);
    }
  };

  // ---------------------------------------------------------------- Sonde (souris)
  const mouse = { x: 0, y: 0, inside: false };

  const probe = () => {
    if (!mouse.inside || w < 768) return null;
    const px = (mouse.x - ox) / s;
    const py = (mouse.y - oy) / s;
    let best: { net: Net; pt: Pt; d: number } | null = null;
    for (const n of NETS) {
      for (const g of n.geo) {
        for (let i = 1; i < g.pts.length; i++) {
          const [x1, y1] = g.pts[i - 1];
          const [x2, y2] = g.pts[i];
          const dx = x2 - x1;
          const dy = y2 - y1;
          const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy || 1)));
          const qx = x1 + dx * t;
          const qy = y1 + dy * t;
          const d = Math.hypot(px - qx, py - qy);
          if (d < 12 && (!best || d < best.d)) best = { net: n, pt: [qx, qy], d };
        }
      }
    }
    return best;
  };

  const reading = (n: Net): string => {
    switch (n.id) {
      case '3V3': return `${(3.3 + 0.004 * Math.sin(time * 7) + 0.002 * Math.sin(time * 23)).toFixed(3)} V`;
      case '5V': return `${(5.02 + 0.006 * Math.sin(time * 5)).toFixed(3)} V`;
      case 'GND': return '0.000 V';
      case 'PA5': return ledOn ? '3.30 V  HIGH' : '0.00 V  LOW';
      case 'OSCI':
      case 'OSCO': return '8.000 MHz';
      case 'NRST': return '3.30 V  HIGH';
      case 'BOOT0': return '0.00 V  LOW';
      default: return netActive(n.id) ? 'ACTIVITY' : 'IDLE  3.30 V';
    }
  };

  // ---------------------------------------------------------------- Rendu
  const drawUart = (c: CanvasRenderingContext2D) => {
    const bw = WAVE_W / 10;
    let idx = uartIdx;
    let frac = 1;
    let alpha = 0.85;
    if (uartPhase === 'char') frac = uartT / CHAR_T;
    else { idx = uartIdx - 1; alpha = uartPhase === 'end' ? Math.max(0, 0.85 - uartT / 1.5) : 0.85; }
    if (reduceMotion) { idx = 0; frac = 1; alpha = 0.6; }
    if (idx < 0 || idx >= UART_MSG.length || alpha <= 0) return;

    const code = UART_MSG.charCodeAt(idx);
    const bits = [0];
    for (let b = 0; b < 8; b++) bits.push((code >> b) & 1);
    bits.push(1);

    c.strokeStyle = `rgba(${COL.data}, ${alpha})`;
    c.lineWidth = 1.2;
    c.beginPath();
    const xEnd = WAVE_X0 + WAVE_W * frac;
    let prevY = WAVE_HI;
    c.moveTo(WAVE_X0, prevY);
    for (let i = 0; i < 10; i++) {
      const xa = WAVE_X0 + i * bw;
      if (xa >= xEnd) break;
      const y = bits[i] ? WAVE_HI : WAVE_LO;
      if (y !== prevY) c.lineTo(xa, y);
      c.lineTo(Math.min(xa + bw, xEnd), y);
      prevY = y;
    }
    c.stroke();

    const ch = UART_MSG[idx] === ' ' ? 'SP' : `'${UART_MSG[idx]}'`;
    txt(c, `0x${code.toString(16).toUpperCase()} ${ch}`, WAVE_X0 + WAVE_W / 2, 343, 8.5, 'center', `rgba(${COL.data}, ${alpha * 0.9})`);
  };

  const draw = () => {
    screenT(ctx);
    ctx.clearRect(0, 0, w, h);
    if (intro < 1) {
      ctx.drawImage(base, 0, 0, w, h);
      designT(ctx);
      renderSchematic(ctx, intro);
      screenT(ctx);
    } else {
      if (!fullReady) buildFull();
      ctx.drawImage(full, 0, 0, w, h);
    }

    designT(ctx);
    const hit = intro >= 1 ? probe() : null;

    if (hit) {
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.6)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (const g of hit.net.geo) tracePartial(ctx, g, 0, g.total);
      ctx.stroke();
    }

    // LED
    if (ledOn && intro > 0.6) {
      const grd = ctx.createRadialGradient(1387, 280, 0, 1387, 280, 44);
      grd.addColorStop(0, `rgba(${COL.led}, 0.35)`);
      grd.addColorStop(1, `rgba(${COL.led}, 0)`);
      ctx.fillStyle = grd;
      ctx.fillRect(1340, 236, 94, 88);
      ctx.fillStyle = `rgba(${COL.led}, 0.85)`;
      ctx.beginPath();
      ctx.moveTo(1378, 272); ctx.lineTo(1378, 288); ctx.lineTo(1396, 280); ctx.closePath();
      ctx.fill();
    }

    // Impulsions sur les pistes
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const p of pulses) {
      if (p.d <= 0) continue;
      ctx.beginPath();
      tracePartial(ctx, p.g, p.d - p.len, p.d);
      ctx.strokeStyle = `rgba(${p.rgb}, 0.18)`;
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${p.rgb}, 0.9)`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      if (p.d <= p.g.total) {
        const [hx, hy] = pointAt(p.g, p.d);
        ctx.fillStyle = `rgba(${p.rgb}, 1)`;
        ctx.beginPath();
        ctx.arc(hx, hy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'butt';

    if (intro > 0.6) {
      drawUart(ctx);
      const cursor = Math.floor(time * 2) % 2 ? '_' : ' ';
      txt(ctx, `> ${terminal}${cursor}`, 1490, 525, 9, 'left', `rgba(${COL.data}, 0.7)`);
    }

    // Sonde
    if (hit) {
      const [qx, qy] = hit.pt;
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.9)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(qx, qy, 4.5, 0, Math.PI * 2);
      ctx.moveTo(qx - 9, qy); ctx.lineTo(qx - 6, qy);
      ctx.moveTo(qx + 6, qy); ctx.lineTo(qx + 9, qy);
      ctx.moveTo(qx, qy - 9); ctx.lineTo(qx, qy - 6);
      ctx.moveTo(qx, qy + 6); ctx.lineTo(qx, qy + 9);
      ctx.stroke();

      screenT(ctx);
      const l1 = `NET  ${hit.net.label}`;
      const l2 = reading(hit.net);
      const bw = Math.max(l1.length, l2.length) * 6.6 + 18;
      let tx = mouse.x + 16;
      let ty = mouse.y - 48;
      if (tx + bw > w - 30) tx = mouse.x - 16 - bw;
      if (ty < 30) ty = mouse.y + 16;
      ctx.fillStyle = 'rgba(6, 9, 25, 0.88)';
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
      ctx.lineWidth = 1;
      ctx.fillRect(tx, ty, bw, 36);
      ctx.strokeRect(tx + 0.5, ty + 0.5, bw - 1, 35);
      txt(ctx, l1, tx + 9, ty + 12, 10.5, 'left', 'rgba(150, 185, 220, 0.75)');
      txt(ctx, l2, tx + 9, ty + 25, 11, 'left', 'rgba(224, 242, 254, 0.95)');
    }
  };

  // ---------------------------------------------------------------- Boucle
  let raf: number | null = null;
  let last = 0;
  let visible = true;

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt, now);
    draw();
    raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (raf !== null) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
  };

  const onMouseMove = (e: MouseEvent) => {
    const r = wrapper.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.inside = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= r.width && mouse.y <= r.height;
  };
  const onMouseOut = (e: MouseEvent) => {
    if (!e.relatedTarget) mouse.inside = false;
  };
  const onVisibility = () => {
    if (document.hidden || !visible) stop();
    else start();
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    onVisibility();
  });

  resize();
  io.observe(wrapper);
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseout', onMouseOut);
  document.addEventListener('visibilitychange', onVisibility);
  start();

  onUnmounted(() => {
    stop();
    io.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseout', onMouseOut);
    document.removeEventListener('visibilitychange', onVisibility);
  });
});
</script>

<style scoped>
.schematic-wrapper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(ellipse at 70% 45%, #0a1430 0%, #060b1d 55%, #03050d 100%);
}

/* Assombrit légèrement la zone du texte pour garder la lisibilité */
.schematic-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 45% 40% at 30% 50%, rgba(6, 9, 25, 0.6) 0%, rgba(6, 9, 25, 0) 100%);
  pointer-events: none;
}

.schematic-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

@media (max-width: 768px) {
  .schematic-canvas {
    opacity: 0.6;
  }
}
</style>
