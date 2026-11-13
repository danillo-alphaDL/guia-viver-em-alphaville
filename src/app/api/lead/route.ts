import { NextResponse } from "next/server";
import { leadSchema, qualificar } from "@/lib/lead";

// Limite simples por IP (memória da instância). Em produção, complementar com o firewall da Vercel.
const janela = new Map<string, number[]>();
function limitado(ip: string) {
  const agora = Date.now();
  const recentes = (janela.get(ip) || []).filter((t) => agora - t < 10 * 60_000);
  recentes.push(agora);
  janela.set(ip, recentes);
  return recentes.length > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconhecido";
  if (limitado(ip)) return NextResponse.json({ ok: false, erro: "Muitas tentativas. Tente novamente em alguns minutos." }, { status: 429 });

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false, erro: "Envio inválido." }, { status: 400 });
  }
  const r = leadSchema.safeParse(corpo);
  if (!r.success) {
    return NextResponse.json({ ok: false, erro: r.error.issues[0]?.message ?? "Dados inválidos." }, { status: 422 });
  }
  // Honeypot preenchido: responde como sucesso para não ensinar o robô, mas descarta.
  if (r.data.site) return NextResponse.json({ ok: true });

  const destino = process.env.LEAD_WEBHOOK_URL;
  if (!destino) {
    return NextResponse.json(
      { ok: false, erro: "O envio ainda não está ativo. Fale com a Alpha DL pelo WhatsApp ou pelo site alphadl.com.br." },
      { status: 503 },
    );
  }

  const { site: _hp, ...lead } = r.data;
  const payload = { ...lead, qualificacao: qualificar(r.data), fonte: "guiaviveremalphaville.com.br", recebidoEm: new Date().toISOString() };
  try {
    const resp = await fetch(destino, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEAD_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) throw new Error(`CRM respondeu ${resp.status}`);
  } catch (e) {
    // Log sem dados pessoais
    console.error("Falha ao encaminhar lead", { erro: String(e), origem: lead.origem });
    return NextResponse.json({ ok: false, erro: "Não conseguimos enviar agora. Tente de novo ou fale pelo WhatsApp." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, qualificacao: payload.qualificacao });
}
