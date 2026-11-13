/**
 * Ilustrações conceituais em SVG, geradas no servidor (zero JavaScript no navegador).
 * Ocupam o lugar das fotografias até o ensaio profissional licenciado ficar pronto.
 * Para trocar por foto, passe `foto` ao componente <Cena>.
 */

type Hora = "crepusculo" | "noite" | "dourada";
type Config = { ceu: [string, string, string, string]; x: number; w: number; andares: 1 | 2; piscina: boolean; arvores: number; seed: number; hora: Hora };

const CRE: Config["ceu"] = ["#0b1220", "#1f2e44", "#7a634f", "#d9a56a"];
const NOI: Config["ceu"] = ["#070a10", "#111a28", "#26334a", "#46526a"];
const DOU: Config["ceu"] = ["#2a3b4f", "#71859a", "#c7ad8f", "#ebcfa3"];

export const CENAS: Record<string, Config> = {
  hero: { ceu: CRE, x: 0.7, w: 0.56, andares: 2, piscina: true, arvores: 7, seed: 3, hora: "crepusculo" },
  c1: { ceu: ["#0c1322", "#25344a", "#8a6d55", "#e0b27a"], x: 0.55, w: 0.7, andares: 2, piscina: true, arvores: 5, seed: 11, hora: "crepusculo" },
  c2: { ceu: NOI, x: 0.45, w: 0.75, andares: 1, piscina: true, arvores: 6, seed: 23, hora: "noite" },
  c3: { ceu: DOU, x: 0.5, w: 0.72, andares: 2, piscina: false, arvores: 8, seed: 37, hora: "dourada" },
  c4: { ceu: CRE, x: 0.4, w: 0.66, andares: 1, piscina: true, arvores: 6, seed: 43, hora: "crepusculo" },
  c5: { ceu: NOI, x: 0.6, w: 0.62, andares: 2, piscina: false, arvores: 7, seed: 47, hora: "noite" },
  i1: { ceu: ["#0c1322", "#2b3a50", "#9a7a5c", "#e7b77e"], x: 0.5, w: 0.95, andares: 1, piscina: true, arvores: 3, seed: 41, hora: "crepusculo" },
  i2: { ceu: NOI, x: 0.5, w: 0.9, andares: 2, piscina: false, arvores: 4, seed: 53, hora: "noite" },
  i3: { ceu: DOU, x: 0.5, w: 0.92, andares: 2, piscina: true, arvores: 3, seed: 61, hora: "dourada" },
  estilo: { ceu: ["#05070b", "#0c1420", "#1a2636", "#33404f"], x: 0.72, w: 0.5, andares: 2, piscina: true, arvores: 9, seed: 71, hora: "noite" },
  j1: { ceu: DOU, x: 0.5, w: 0.8, andares: 1, piscina: false, arvores: 6, seed: 83, hora: "dourada" },
  j2: { ceu: CRE, x: 0.5, w: 0.85, andares: 2, piscina: true, arvores: 4, seed: 97, hora: "crepusculo" },
  j3: { ceu: NOI, x: 0.5, w: 0.8, andares: 1, piscina: true, arvores: 5, seed: 101, hora: "noite" },
  art: { ceu: CRE, x: 0.62, w: 0.6, andares: 2, piscina: true, arvores: 8, seed: 113, hora: "crepusculo" },
  g1: { ceu: CRE, x: 0.5, w: 0.9, andares: 2, piscina: true, arvores: 4, seed: 127, hora: "crepusculo" },
  g2: { ceu: DOU, x: 0.5, w: 1.1, andares: 1, piscina: true, arvores: 2, seed: 131, hora: "dourada" },
  g3: { ceu: NOI, x: 0.5, w: 1.1, andares: 2, piscina: false, arvores: 2, seed: 137, hora: "noite" },
};

const W = 1600;
const H = 1000;
const f = (n: number) => Math.round(n * 10) / 10;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function svgCena(nome: string, id: string): string {
  const c = CENAS[nome] ?? CENAS.c1;
  const r = rng(c.seed);
  const noite = c.hora === "noite";
  const dourada = c.hora === "dourada";
  const hz = H * 0.64;
  const o: string[] = [];

  o.push(
    `<defs>` +
      `<linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.ceu[0]}"/><stop offset=".45" stop-color="${c.ceu[1]}"/><stop offset=".82" stop-color="${c.ceu[2]}"/><stop offset="1" stop-color="${c.ceu[3]}"/></linearGradient>` +
      `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${noite ? "#0b0f0d" : dourada ? "#3a3f33" : "#141815"}"/><stop offset="1" stop-color="${noite ? "#040605" : dourada ? "#1c1f19" : "#080a09"}"/></linearGradient>` +
      `<linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd79a"/><stop offset="1" stop-color="#f0a85a"/></linearGradient>` +
      `<linearGradient id="${id}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${noite ? "#0e3a44" : dourada ? "#5f9aa0" : "#1a4b52"}"/><stop offset="1" stop-color="${noite ? "#04161b" : dourada ? "#2f5a60" : "#092429"}"/></linearGradient>` +
      `<radialGradient id="${id}r"><stop offset="0" stop-color="#ffbe6e" stop-opacity=".24"/><stop offset="1" stop-color="#ffbe6e" stop-opacity="0"/></radialGradient>` +
      `</defs>`,
  );
  o.push(`<rect width="${W}" height="${f(hz + 2)}" fill="url(#${id}c)"/>`);

  if (noite) {
    let estrelas = "";
    for (let i = 0; i < 70; i++) estrelas += `<rect x="${f(r() * W)}" y="${f(r() * hz * 0.6)}" width="1.6" height="1.6" fill="#fff" opacity="${f(r() * 0.6)}"/>`;
    o.push(estrelas);
  }

  const serra = (passos: number, alt: number, var_: number, cor: string) => {
    let d = `M0 ${f(hz + 2)}`;
    for (let x = 0; x <= W; x += W / passos) d += ` L${f(x)} ${f(hz - H * alt - r() * H * var_)}`;
    o.push(`<path d="${d} L${W} ${f(hz + 2)}Z" fill="${cor}"/>`);
  };
  serra(24, 0.05, 0.06, noite ? "#0a0f14" : dourada ? "#4a5048" : "#1b2022");
  serra(40, 0.015, 0.035, noite ? "#070a0d" : dourada ? "#2f3530" : "#111517");
  o.push(`<rect y="${f(hz)}" width="${W}" height="${f(H - hz)}" fill="url(#${id}g)"/>`);

  // Casa
  const cw = W * c.w;
  const cx = W * c.x - cw / 2;
  const base = hz + H * 0.06;
  const andar = Math.min(H * 0.13, cw * 0.13);
  const concreto = noite ? "#16191a" : dourada ? "#d9d4c8" : "#2a2d2c";
  const madeira = noite ? "#2a1d14" : dourada ? "#7a5638" : "#3a2919";
  const vidro = dourada ? `fill="#ffe2aa" opacity=".75"` : `fill="url(#${id}l)"`;

  if (!dourada) o.push(`<ellipse cx="${f(W * c.x)}" cy="${f(base)}" rx="${f(cw * 0.6)}" ry="${f(cw * 0.25)}" fill="url(#${id}r)"/>`);
  o.push(`<rect x="${f(cx)}" y="${f(base - andar)}" width="${f(cw)}" height="${f(andar)}" fill="${concreto}"/>`);
  const nv = 6 + Math.floor(r() * 3);
  const vw = (cw * 0.82) / nv;
  for (let i = 0; i < nv; i++) {
    if (r() < 0.18) continue;
    o.push(`<rect x="${f(cx + cw * 0.09 + i * vw + 2)}" y="${f(base - andar * 0.86)}" width="${f(vw - 4)}" height="${f(andar * 0.8)}" ${vidro}/>`);
  }
  o.push(`<rect x="${f(cx - cw * 0.04)}" y="${f(base - andar * 1.12)}" width="${f(cw * 1.08)}" height="${f(andar * 0.12)}" fill="${concreto}"/>`);

  if (c.andares > 1) {
    const sx = cx + cw * (0.18 + r() * 0.12);
    const sw = cw * 0.72;
    o.push(`<rect x="${f(sx)}" y="${f(base - andar * 2.05)}" width="${f(sw)}" height="${f(andar * 0.93)}" fill="${madeira}"/>`);
    let ripas = "";
    for (let k = 0; k < sw; k += 5) ripas += `M${f(sx + k)} ${f(base - andar * 2.05)}v${f(andar * 0.93)}`;
    o.push(`<path d="${ripas}" stroke="#000" stroke-opacity=".18" stroke-width="1"/>`);
    o.push(`<rect x="${f(sx + sw * 0.08)}" y="${f(base - andar * 1.9)}" width="${f(sw * 0.5)}" height="${f(andar * 0.66)}" ${vidro}/>`);
    let mont = "";
    for (let k = 1; k < 4; k++) mont += `M${f(sx + sw * 0.08 + k * sw * 0.125)} ${f(base - andar * 1.9)}v${f(andar * 0.66)}`;
    o.push(`<path d="${mont}" stroke="#000" stroke-opacity=".35" stroke-width="2"/>`);
    o.push(`<rect x="${f(sx - cw * 0.03)}" y="${f(base - andar * 2.15)}" width="${f(sw + cw * 0.08)}" height="${f(andar * 0.12)}" fill="${concreto}"/>`);
  }

  if (c.piscina) {
    const py = base + H * 0.05;
    const ph = H * 0.11;
    const px = cx + cw * 0.05;
    const pw = cw * 0.8;
    o.push(`<rect x="${f(px - 4)}" y="${f(py - 3)}" width="${f(pw + 8)}" height="3" fill="${dourada ? "#cfc8b8" : "#2d302e"}"/>`);
    o.push(`<rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" fill="url(#${id}p)"/>`);
    // reflexo das janelas
    for (let i = 0; i < nv; i += 2) {
      o.push(`<rect x="${f(cx + cw * 0.09 + i * vw + 4)}" y="${f(py + 6)}" width="${f(Math.max(4, vw - 8))}" height="${f(ph * 0.45)}" fill="#f0b46a" opacity="${dourada ? 0.12 : 0.22}"/>`);
    }
    let brilho = "";
    for (let i = 0; i < 14; i++) brilho += `M${f(px + r() * pw)} ${f(py + r() * ph)}h${f(pw * 0.08 * r())}`;
    o.push(`<path d="${brilho}" stroke="#fff" stroke-opacity=".08" stroke-width="1.5"/>`);
  }

  // Vegetação em primeiro plano
  const sombra = noite ? "#020303" : dourada ? "#1f241c" : "#050706";
  let veg = "";
  for (let i = 0; i < c.arvores; i++) {
    const x = r() < 0.5 ? r() * W * 0.22 : W - r() * W * 0.22;
    const h = H * (0.45 + r() * 0.4);
    const b = H * (0.86 + r() * 0.14);
    if (r() < 0.45) {
      const hh = h * 0.9;
      const tx = x + hh * 0.02;
      const ty = b - hh;
      veg += `<path d="M${f(x)} ${f(b)}Q${f(x + hh * 0.06)} ${f(b - hh * 0.5)} ${f(tx)} ${f(ty)}" stroke="${sombra}" stroke-width="${f(Math.max(3, hh * 0.018))}" fill="none"/>`;
      let folhas = "";
      for (let k = 0; k < 8; k++) {
        const a = -Math.PI / 2 + (k - 3.5) * 0.42 + r() * 0.1;
        folhas += `M${f(tx)} ${f(ty)}Q${f(tx + Math.cos(a) * hh * 0.22)} ${f(ty + Math.sin(a) * hh * 0.12 - hh * 0.04)} ${f(tx + Math.cos(a) * hh * 0.3)} ${f(ty + Math.sin(a) * hh * 0.12 + hh * 0.1)}`;
      }
      veg += `<path d="${folhas}" stroke="${sombra}" stroke-width="${f(Math.max(2, hh * 0.012))}" fill="none" stroke-linecap="round"/>`;
    } else {
      const hh = h * 0.85;
      veg += `<rect x="${f(x - hh * 0.012)}" y="${f(b - hh * 0.55)}" width="${f(hh * 0.024)}" height="${f(hh * 0.55)}" fill="${sombra}"/>`;
      for (let k = 0; k < 7; k++) {
        const a = r() * Math.PI * 2;
        const d = r() * hh * 0.18;
        veg += `<ellipse cx="${f(x + Math.cos(a) * d)}" cy="${f(b - hh * 0.62 + Math.sin(a) * d * 0.7)}" rx="${f(hh * (0.12 + r() * 0.1))}" ry="${f(hh * (0.09 + r() * 0.07))}" fill="${sombra}"/>`;
      }
    }
  }
  o.push(veg);
  return o.join("");
}

export const VIEWBOX = `0 0 ${W} ${H}`;
