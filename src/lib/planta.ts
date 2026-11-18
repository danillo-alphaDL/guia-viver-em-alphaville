/**
 * Capas dos residenciais: planta aérea ilustrada, no estilo de folheto de lançamento.
 * Gerada no servidor em SVG, sem JavaScript no navegador. É ilustração conceitual,
 * fora de escala e sem orientação real: o traçado não reproduz o loteamento.
 * Os parâmetros vêm dos dados conferidos da ficha (lotes, lazer, municípios).
 */

export type ParametrosPlanta = {
  semente: string;
  lotes?: number; // mais lotes, traçado mais denso
  verde?: number; // fração da área em mata (0 a 1)
  lago?: boolean;
  clube?: boolean;
  divisa?: [string, string]; // dois municípios, como no Residencial Zero
  antigo?: boolean; // arborização madura: copas maiores
};

const W = 1600;
const H = 1000;
const f = (n: number) => Math.round(n * 10) / 10;

function rng(texto: string) {
  let s = 0;
  for (const c of texto) s = (s * 31 + c.charCodeAt(0)) % 2147483647;
  s = s || 7;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Curva fechada suave (perímetro do loteamento). */
function perimetro(r: () => number) {
  const cx = W * (0.5 + (r() - 0.5) * 0.08);
  const cy = H * (0.52 + (r() - 0.5) * 0.06);
  const n = 9;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rx = W * (0.36 + r() * 0.1);
    const ry = H * (0.34 + r() * 0.1);
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  let d = `M${f((pts[0][0] + pts[n - 1][0]) / 2)} ${f((pts[0][1] + pts[n - 1][1]) / 2)}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % n];
    d += ` Q${f(p[0])} ${f(p[1])} ${f((p[0] + q[0]) / 2)} ${f((p[1] + q[1]) / 2)}`;
  }
  return { d: d + "Z", cx, cy };
}

export function svgPlanta(p: ParametrosPlanta, id: string): string {
  const r = rng(p.semente);
  const per = perimetro(r);
  const densidade = Math.min(1, Math.max(0.35, (p.lotes ?? 500) / 900));
  const verde = p.verde ?? 0.18;
  const o: string[] = [];
  const modo: "ondas" | "anel" = (p.lotes ?? 0) >= 800 || r() < 0.5 ? "ondas" : "anel";
  const giro = (r() - 0.5) * 50;

  o.push(
    `<defs>` +
      `<radialGradient id="${id}f" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#1B2220"/><stop offset="1" stop-color="#0B0D0C"/></radialGradient>` +
      `<linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3E5A63"/><stop offset="1" stop-color="#22343A"/></linearGradient>` +
      `<clipPath id="${id}c"><path d="${per.d}"/></clipPath>` +
      `<pattern id="${id}g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#C2A878" stroke-opacity=".05"/></pattern>` +
      `</defs>`,
  );
  o.push(`<rect width="${W}" height="${H}" fill="url(#${id}f)"/>`);
  o.push(`<rect width="${W}" height="${H}" fill="url(#${id}g)"/>`);

  // Entorno: vias externas e mata fora do perímetro
  let fora = "";
  for (let i = 0; i < 3; i++) {
    const y = H * (0.15 + r() * 0.7);
    fora += `<path d="M-20 ${f(y)} C${f(W * 0.3)} ${f(y + (r() - 0.5) * 300)} ${f(W * 0.7)} ${f(y + (r() - 0.5) * 300)} ${f(W + 20)} ${f(y + (r() - 0.5) * 200)}" stroke="#C2A878" stroke-opacity=".12" stroke-width="10" fill="none"/>`;
  }
  o.push(fora);

  // Área do residencial (tudo gira junto, para cada residencial ter um ângulo próprio)
  o.push(`<g transform="rotate(${f(giro)} ${f(per.cx)} ${f(per.cy)})">`);
  o.push(`<path d="${per.d}" fill="#141A18"/>`);
  const g: string[] = [];

  // Mata e lago (antes das ruas)
  const nMata = Math.round(120 + verde * 900);
  let mata = "";
  for (let i = 0; i < nMata; i++) {
    const x = r() * W;
    const y = r() * H;
    const zona = verde > 0.4 ? x < W * (0.3 + verde * 0.3) || y > H * 0.72 : r() < verde * 1.6;
    if (!zona) continue;
    const rad = (p.antigo ? 16 : 11) + r() * (p.antigo ? 22 : 14);
    mata += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="#24342C" fill-opacity="${f(0.55 + r() * 0.35)}"/>`;
  }
  g.push(mata);
  if (p.lago) {
    const lx = per.cx - W * 0.16;
    const ly = per.cy + H * 0.12;
    g.push(
      `<path d="M${f(lx - 150)} ${f(ly)} C${f(lx - 120)} ${f(ly - 110)} ${f(lx + 90)} ${f(ly - 120)} ${f(lx + 170)} ${f(ly - 30)} S${f(lx + 60)} ${f(ly + 120)} ${f(lx - 40)} ${f(ly + 90)} S${f(lx - 180)} ${f(ly + 60)} ${f(lx - 150)} ${f(ly)}Z" fill="url(#${id}l)" stroke="#C2A878" stroke-opacity=".35" stroke-width="2"/>`,
    );
  }

  const lago = p.lago ? { x: per.cx - W * 0.16, y: per.cy + H * 0.12 } : null;
  const longeDoLago = (x: number, y: number) => !lago || Math.hypot(x - lago.x, y - lago.y) > 210;
  let lotes = "";
  let vias = "";
  const passo = 34 - densidade * 10;
  /** Lotes dos dois lados de um trecho reto de rua. */
  const lotear = (x: number, y: number, ang: number) => {
    if (!longeDoLago(x, y)) return;
    for (const lado of [-1, 1]) {
      const prof = 26 + r() * 10;
      lotes += `<rect x="${f(-passo / 2 + 2)}" y="${f(lado < 0 ? -prof - 7 : 7)}" width="${f(passo - 4)}" height="${f(prof)}" transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})" fill="none" stroke="#C2A878" stroke-opacity=".24" stroke-width="1.2"/>`;
      if (r() < 0.6) lotes += `<rect x="${f(-passo / 4)}" y="${f(lado < 0 ? -prof + 2 : 13)}" width="${f(passo / 2)}" height="${f(prof * 0.45)}" transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})" fill="#C2A878" fill-opacity=".16"/>`;
    }
  };

  if (modo === "ondas") {
    const nRuas = Math.round(4 + densidade * 6);
    for (let i = 0; i < nRuas; i++) {
      const y0 = H * (0.12 + (i / (nRuas - 1)) * 0.78);
      const amp = 30 + r() * 60;
      const fase = r() * Math.PI * 2;
      const inc = (r() - 0.5) * 0.25;
      const yr = (x: number) => y0 + Math.sin(x / 260 + fase) * amp + (x - W / 2) * inc;
      for (let x = 40; x < W - 40; x += passo + r() * 6) lotear(x, yr(x), (Math.atan2(yr(x + 5) - yr(x - 5), 10) * 180) / Math.PI);
      let d = "";
      for (let x = -20; x <= W + 20; x += 40) d += `${d ? "L" : "M"}${f(x)} ${f(yr(x))}`;
      vias += `<path d="${d}" stroke="#C2A878" stroke-opacity=".55" stroke-width="2.2" fill="none"/>`;
    }
  } else {
    // Anel viário com ruas sem saída (balões de retorno), comum nos loteamentos da região
    const rx = W * (0.2 + r() * 0.05);
    const ry = H * (0.2 + r() * 0.05);
    const pt = (t: number, k = 1) => [per.cx + Math.cos(t) * rx * k, per.cy + Math.sin(t) * ry * k] as const;
    for (let t = 0; t < Math.PI * 2; t += (passo * 1.1) / ((rx + ry) / 2)) {
      const [x, y] = pt(t);
      const [x2, y2] = pt(t + 0.01);
      lotear(x, y, (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI);
    }
    vias += `<ellipse cx="${f(per.cx)}" cy="${f(per.cy)}" rx="${f(rx)}" ry="${f(ry)}" stroke="#C2A878" stroke-opacity=".7" stroke-width="3" fill="none"/>`;
    const nRad = Math.round(7 + densidade * 7);
    for (let i = 0; i < nRad; i++) {
      const t = (i / nRad) * Math.PI * 2 + r() * 0.2;
      const [x0, y0] = pt(t);
      const k = 1.55 + r() * 0.35;
      const [x1, y1] = pt(t, k);
      const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
      const comp = Math.hypot(x1 - x0, y1 - y0);
      for (let s = passo; s < comp - 20; s += passo) lotear(x0 + ((x1 - x0) * s) / comp, y0 + ((y1 - y0) * s) / comp, ang);
      vias += `<path d="M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}" stroke="#C2A878" stroke-opacity=".55" stroke-width="2.2"/><circle cx="${f(x1)}" cy="${f(y1)}" r="16" fill="#141A18" stroke="#C2A878" stroke-opacity=".6" stroke-width="2"/>`;
    }
    // miolo verde do anel
    let miolo = "";
    for (let i = 0; i < 40; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * 0.75;
      miolo += `<circle cx="${f(per.cx + Math.cos(a) * rx * d)}" cy="${f(per.cy + Math.sin(a) * ry * d)}" r="${f(12 + r() * 16)}" fill="#24342C" fill-opacity="${f(0.5 + r() * 0.4)}"/>`;
    }
    g.push(miolo);
  }
  g.push(lotes);

  // avenida de acesso, da portaria ao centro
  const ax = per.cx + (r() - 0.5) * 200;
  vias += `<path d="M${f(ax - 120)} -20 C${f(ax + 60)} ${f(H * 0.3)} ${f(ax - 80)} ${f(H * 0.65)} ${f(ax + 100)} ${f(H + 20)}" stroke="#C2A878" stroke-opacity=".8" stroke-width="5" fill="none"/>`;
  g.push(vias);

  // Clube: um quadrado com piscina, perto do centro
  if (p.clube) {
    const cx = per.cx + W * 0.08;
    const cy = per.cy - H * 0.06;
    g.push(
      `<rect x="${f(cx - 70)}" y="${f(cy - 45)}" width="140" height="90" fill="#141A18" stroke="#C2A878" stroke-width="2"/>` +
        `<rect x="${f(cx - 48)}" y="${f(cy - 22)}" width="60" height="30" fill="#3E5A63" stroke="#C2A878" stroke-opacity=".6"/>` +
        `<circle cx="${f(cx + 40)}" cy="${f(cy + 5)}" r="16" fill="none" stroke="#C2A878" stroke-opacity=".7"/>`,
    );
  }

  o.push(`<g clip-path="url(#${id}c)">${g.join("")}</g>`);
  o.push(`<path d="${per.d}" fill="none" stroke="#C2A878" stroke-width="3"/>`);
  o.push(`<path d="${per.d}" fill="none" stroke="#C2A878" stroke-opacity=".25" stroke-width="14"/>`);
  o.push(`</g>`);

  // Divisa entre municípios
  if (p.divisa) {
    const dx = per.cx + W * 0.04;
    o.push(
      `<path d="M${f(dx)} 0 C${f(dx + 40)} ${f(H * 0.35)} ${f(dx - 50)} ${f(H * 0.65)} ${f(dx + 10)} ${H}" stroke="#ECEAE4" stroke-opacity=".7" stroke-width="2.5" stroke-dasharray="14 10" fill="none"/>`,
    );
  }
  return o.join("");
}

export const VIEWBOX_PLANTA = `0 0 ${W} ${H}`;
