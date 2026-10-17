'use strict';

/* ------------------------------------------------------------------ *
 *  Yardımcılar
 * ------------------------------------------------------------------ */
const rnd = (a, b) => a + Math.random() * (b - a);

// Türkçe karakterleri sadeleştir: "Gül" -> "gul", "Ayçiçeği" -> "aycicegi"
const norm = (s) =>
  s.toLocaleLowerCase('tr')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z]/g, '');

// n adet yaprak üret; her biri kendi etrafında döndürülür
function P(n, fn, o = {}) {
  const off = o.off || 0, step = o.step ?? 0.04, base = o.base || 0;
  let s = '';
  for (let i = 0; i < n; i++) {
    const r = (360 / n) * i + off;
    s += `<g class="petal" style="--r:${r.toFixed(1)}deg;--d:${(base + i * step).toFixed(2)}s">${fn(i)}</g>`;
  }
  return s;
}
const core = (inner) => `<g class="core">${inner}</g>`;

/* ------------------------------------------------------------------ *
 *  Çiçek çizimleri (merkez 0,0 — yapraklar yukarı doğru çizilir)
 *  p: paleti seçmek için rastgele sayı
 * ------------------------------------------------------------------ */
function daisy(p) {
  const c = ['#ffffff', '#fff7e6', '#fdf0f5'][p % 3];
  return P(14, () => `<ellipse cx="0" cy="-17" rx="5" ry="15" fill="${c}" stroke="#e3e3ee" stroke-width=".8"/>`, { step: 0.035 }) +
    core(`<circle r="8.5" fill="#ffc933" stroke="#e5a400" stroke-width="1.2"/>`);
}

function rose(p) {
  const S = [
    ['#e63946', '#c1121f', '#8f0d17'],
    ['#ff758f', '#e5486b', '#b8264a'],
    ['#ffb3c6', '#ff8fab', '#d9577a'],
    ['#fff0e0', '#f6cfae', '#d9a077'],
  ][p % 4];
  return P(6, () => `<ellipse cx="0" cy="-15" rx="12" ry="14" fill="${S[0]}" stroke="${S[2]}" stroke-width="1"/>`, { step: 0.06 }) +
    P(5, () => `<ellipse cx="0" cy="-9" rx="8" ry="10" fill="${S[1]}" stroke="${S[2]}" stroke-width="1"/>`, { off: 20, step: 0.06, base: 0.25 }) +
    core(`<circle r="6" fill="${S[2]}"/><path d="M-4 1 Q0 -6 4 1" stroke="${S[0]}" stroke-width="1.2" fill="none"/>`);
}

function tulip(p) {
  const S = [
    ['#ff5d8f', '#e0407a'],
    ['#e63946', '#b5202c'],
    ['#ffd23f', '#e0a800'],
    ['#b983ff', '#8a52d6'],
    ['#ff9a3c', '#e07a10'],
  ][p % 5];
  const left = `<path d="M0 0 C-22 -4 -24 -34 -13 -48 C-6 -36 -2 -26 0 0Z" fill="${S[1]}"/>`;
  const right = `<path d="M0 0 C22 -4 24 -34 13 -48 C6 -36 2 -26 0 0Z" fill="${S[1]}"/>`;
  const mid = `<path d="M0 0 C-13 -6 -10 -38 0 -52 C10 -38 13 -6 0 0Z" fill="${S[0]}" stroke="${S[1]}" stroke-width=".8"/>`;
  return `<g transform="translate(0 24)">` +
    `<g class="petal" style="--r:0deg;--d:0s">${left}</g>` +
    `<g class="petal" style="--r:0deg;--d:.08s">${right}</g>` +
    `<g class="petal" style="--r:0deg;--d:.16s">${mid}</g></g>`;
}

function sunflower() {
  let dots = '';
  for (let k = 0; k < 12; k++) {
    const a = (k * 30 * Math.PI) / 180;
    dots += `<circle cx="${(7 * Math.sin(a)).toFixed(1)}" cy="${(-7 * Math.cos(a)).toFixed(1)}" r="1.6" fill="#3b2410"/>`;
  }
  return P(20, () => `<ellipse cx="0" cy="-27" rx="5.5" ry="14" fill="#f4a100" stroke="#d98500" stroke-width=".8"/>`, { step: 0.03 }) +
    P(20, () => `<ellipse cx="0" cy="-23" rx="5" ry="12" fill="#ffd23f" stroke="#e8a900" stroke-width=".6"/>`, { off: 9, step: 0.03, base: 0.3 }) +
    core(`<circle r="16" fill="#5a3a1a"/><circle r="12" fill="#7a4e22"/>${dots}`);
}

function lavender(p) {
  const S = [['#9b72cf', '#7e57c2', '#b39ddb'], ['#a98be0', '#8566c9', '#c7b3ee']][p % 2];
  let s = '';
  for (let i = 0; i < 11; i++) {
    const y = 14 - i * 6, rx = (3.6 - i * 0.13).toFixed(2), ry = (6 - i * 0.2).toFixed(2);
    s += `<g class="petal" style="--r:0deg;--d:${(i * 0.06).toFixed(2)}s">` +
      `<ellipse cx="-4" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(-25 -4 ${y})" fill="${S[i % 3]}"/>` +
      `<ellipse cx="4" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(25 4 ${y})" fill="${S[(i + 1) % 3]}"/></g>`;
  }
  return s;
}

function lily(p) {
  const S = [['#fff5f8', '#f2a6c1'], ['#ffe0ec', '#e87aa5'], ['#fff2d9', '#f0b45c']][p % 3];
  let stamens = '';
  for (let k = 0; k < 6; k++) {
    const a = (k * 60 + 15) * Math.PI / 180, x = 14 * Math.sin(a), y = -14 * Math.cos(a);
    stamens += `<line x1="0" y1="0" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#d9a441" stroke-width="1"/>` +
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.2" fill="#e8872b"/>`;
  }
  return P(6, () =>
    `<path d="M0 0 C-10 -12 -9 -30 0 -42 C9 -30 10 -12 0 0Z" fill="${S[0]}" stroke="${S[1]}" stroke-width="1"/>` +
    `<path d="M0 -4 L0 -30" stroke="${S[1]}" stroke-width="1.3" opacity=".7"/>`, { step: 0.07 }) +
    core(`${stamens}<circle r="2.5" fill="#6fa85a"/>`);
}

function violet(p) {
  const S = [['#8e5bd6', '#6a3fb3'], ['#5b6ee1', '#3f4fb0'], ['#d28ae6', '#a55cc0']][p % 3];
  return P(5, () => `<ellipse cx="0" cy="-12" rx="10" ry="13" fill="${S[0]}" stroke="${S[1]}" stroke-width=".8"/>`, { step: 0.07 }) +
    core(`<circle r="4.2" fill="#ffe066"/><circle r="1.8" fill="#f4a100"/>`);
}

function daffodil(p) {
  const S = [['#ffe14d', '#e0b400', '#ff9f1c'], ['#fff6b0', '#e8d36b', '#ffb347']][p % 2];
  return P(6, () => `<path d="M0 0 C-9 -10 -8 -26 0 -34 C8 -26 9 -10 0 0Z" fill="${S[0]}" stroke="${S[1]}" stroke-width=".9"/>`, { step: 0.06 }) +
    core(`<circle r="9" fill="${S[2]}" stroke="#e07a10" stroke-width="1"/><circle r="5.5" fill="#f08a1a"/>`);
}

/* ------------------------------------------------------------------ *
 *  Çiçek listesi — yeni çiçek eklemek için buraya bir satır ekle
 *  (anahtar: sadeleştirilmiş ad; "güller", "laleler" gibi ekler de tanınır)
 * ------------------------------------------------------------------ */
const FLOWERS = {
  papatya:  { label: 'Papatya',   emoji: '🌼', size: 1.0,  draw: daisy },
  gul:      { label: 'Gül',       emoji: '🌹', size: 1.1,  draw: rose },
  lale:     { label: 'Lale',      emoji: '🌷', size: 1.0,  draw: tulip },
  aycicegi: { label: 'Ayçiçeği',  emoji: '🌻', size: 0.85, draw: sunflower },
  lavanta:  { label: 'Lavanta',   emoji: '🪻', size: 1.0,  draw: lavender },
  zambak:   { label: 'Zambak',    emoji: '🌸', size: 0.9,  draw: lily },
  menekse:  { label: 'Menekşe',   emoji: '💜', size: 1.2,  draw: violet },
  nergis:   { label: 'Nergis',    emoji: '🏵️', size: 1.1,  draw: daffodil },
};

/* ------------------------------------------------------------------ *
 *  Yazıyı çiçeklere çevir
 * ------------------------------------------------------------------ */
const IGNORE = new Set(['ve', 'ile', 'bir', 'buket', 'buketi', 'bukete']);

function parse(text) {
  const words = text.split(/[,;+&\n]+|\s+/).map((raw) => ({ raw, n: norm(raw) })).filter((w) => w.n);
  const types = [], unknown = [];
  for (const w of words) {
    if (IGNORE.has(w.n)) continue;
    const id = Object.keys(FLOWERS).find((k) => w.n.startsWith(k));
    if (id) { if (!types.includes(id)) types.push(id); }
    else unknown.push(w.raw);
  }
  return { types, unknown };
}

/* ------------------------------------------------------------------ *
 *  Buket kompozisyonu + çizim
 * ------------------------------------------------------------------ */
function compose(types) {
  const n = Math.min(12, Math.max(5, types.length * 3));
  const spread = n > 9 ? 42 : 38;
  const items = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    items.push({
      id: types[i % types.length],
      angle: -spread + 2 * spread * t + rnd(-3, 3),
      r: (i % 2 ? 168 : 205) + rnd(-8, 8),
      scale: rnd(0.92, 1.12),
      pal: Math.floor(rnd(0, 10)),
      side: i % 2 ? 1 : -1,
    });
  }
  return items;
}

const WRAP = `
<g class="wrap">
  <path d="M105 372 L295 372 L224 505 L176 505 Z" fill="#e9c89a" stroke="#c9a46f" stroke-width="1.5"/>
  <path d="M118 376 L200 440 L282 376 L200 398 Z" fill="#f6e2bf"/>
  <path d="M176 505 L200 440 L224 505 Z" fill="#d9b682" opacity=".6"/>
  <g transform="translate(200 438)">
    <ellipse cx="-17" cy="0" rx="17" ry="9" transform="rotate(-18 -17 0)" fill="#e05a7a"/>
    <ellipse cx="17" cy="0" rx="17" ry="9" transform="rotate(18 17 0)" fill="#e05a7a"/>
    <path d="M0 4 L-12 32 L-4 28 L0 36 L4 28 L12 32 Z" fill="#c7406a"/>
    <circle r="6" fill="#c7406a"/>
  </g>
</g>`;

let lastItems = null;

function render(items) {
  lastItems = items;
  const B = { x: 200, y: 405 };
  let out = '';

  items.forEach((it, i) => {
    const f = FLOWERS[it.id];
    const a = (it.angle * Math.PI) / 180;
    const hx = B.x + Math.sin(a) * it.r;
    const hy = B.y - Math.cos(a) * it.r;
    const cx = B.x + (hx - B.x) * 0.1;
    const cy = B.y - (B.y - hy) * 0.5;
    const base = 0.15 + i * 0.28;

    // Yapraklar (gövde üzerinde, eğrinin noktaları)
    let leaves = '';
    [[0.42, it.side, 1], [0.64, -it.side, 0.8]].forEach(([t, side, sc], k) => {
      const x = (1 - t) ** 2 * B.x + 2 * (1 - t) * t * cx + t * t * hx;
      const y = (1 - t) ** 2 * B.y + 2 * (1 - t) * t * cy + t * t * hy;
      const dx = 2 * (1 - t) * (cx - B.x) + 2 * t * (hx - cx);
      const dy = 2 * (1 - t) * (cy - B.y) + 2 * t * (hy - cy);
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI + side * 42;
      leaves += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${sc})">` +
        `<path class="leaf" style="--d:${(base + 0.55 + k * 0.12).toFixed(2)}s" d="M0 0 C6 -9 20 -9 30 0 C20 9 6 9 0 0Z"/></g>`;
    });

    out += `<g class="sway" style="--sd:${(base + 2.4).toFixed(2)}s">` +
      `<path class="stem" pathLength="1" style="--d:${base.toFixed(2)}s" d="M${B.x} ${B.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)}"/>` +
      leaves +
      `<g transform="translate(${hx.toFixed(1)} ${hy.toFixed(1)}) rotate(${(it.angle * 0.5).toFixed(1)}) scale(${(f.size * it.scale).toFixed(2)})">` +
      `<g style="--base:${(base + 1.0).toFixed(2)}s">${f.draw(it.pal)}</g></g></g>`;
  });

  document.getElementById('bouquet').innerHTML = out + WRAP;
}

/* ------------------------------------------------------------------ *
 *  Arayüz
 * ------------------------------------------------------------------ */
const input = document.getElementById('input');
const msg = document.getElementById('msg');
const chips = document.getElementById('chips');
const available = Object.values(FLOWERS).map((f) => f.label).join(', ');

function build(text) {
  const { types, unknown } = parse(text);
  if (!types.length) {
    msg.textContent = `Tanıdığım bir çiçek bulamadım 🌱 Şunları deneyebilirsin: ${available}`;
    return;
  }
  render(compose(types));
  const names = types.map((id) => FLOWERS[id].label).join(', ');
  msg.textContent = unknown.length
    ? `Buketin hazır: ${names} 💐 (Tanıyamadıklarım: ${unknown.join(', ')})`
    : `Buketin hazır: ${names} 💐`;
}

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  build(input.value);
});

document.getElementById('replay').addEventListener('click', () => {
  if (lastItems) render(lastItems);
});

document.getElementById('random').addEventListener('click', () => {
  const ids = Object.keys(FLOWERS).sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 3));
  input.value = ids.map((id) => FLOWERS[id].label.toLocaleLowerCase('tr')).join(', ');
  build(input.value);
});

Object.entries(FLOWERS).forEach(([id, f]) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = `${f.emoji} ${f.label}`;
  b.addEventListener('click', () => {
    if (!parse(input.value).types.includes(id)) {
      input.value = input.value.trim() ? `${input.value.trim().replace(/,$/, '')}, ${f.label.toLocaleLowerCase('tr')}` : f.label.toLocaleLowerCase('tr');
    }
    build(input.value);
  });
  chips.appendChild(b);
});

/* ------------------------------------------------------------------ *
 *  Sağ ve sol kenarda süzülen kalpler
 * ------------------------------------------------------------------ */
const HEARTS = ['❤️', '💖', '💗', '💕', '🩷', '💘'];

function floatHearts(container, count) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    h.textContent = HEARTS[Math.floor(rnd(0, HEARTS.length))];
    const t = rnd(9, 16);
    h.style.setProperty('--x', `${rnd(5, 75).toFixed(0)}%`);
    h.style.setProperty('--s', `${rnd(14, 30).toFixed(0)}px`);
    h.style.setProperty('--t', `${t.toFixed(1)}s`);
    h.style.setProperty('--dl', `${(-rnd(0, t)).toFixed(1)}s`); // negatif gecikme: sayfa açılır açılmaz kalpler ekranda olsun
    h.style.setProperty('--sw', `${rnd(-25, 25).toFixed(0)}px`);
    h.style.setProperty('--rot', `${rnd(8, 22).toFixed(0)}deg`);
    container.appendChild(h);
  }
}
floatHearts(document.querySelector('.hearts-left'), 9);
floatHearts(document.querySelector('.hearts-right'), 9);

// İlk açılışta örnek buket
input.value = 'papatya, lale, gül';
build(input.value);
