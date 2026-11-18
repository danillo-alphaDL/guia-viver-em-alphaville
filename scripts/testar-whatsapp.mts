/** Testes do texto da barra e da mensagem do WhatsApp por página (src/lib/contexto-whatsapp.ts). */
import { chamadaPara, type MapaContextos } from "../src/lib/contexto-whatsapp.ts";

let falhas = 0;
const ok = (c: boolean, msg: string) => {
  if (!c) falhas++;
  console.log(`${c ? "ok   " : "FALHA"} ${msg}`);
};

const mapa: MapaContextos = {
  "/condominios/genesis-ii": { tipo: "residencial", nome: "Gênesis II" },
  "/comprar/casas-com-5-quartos-em-alphaville": { tipo: "artigo", titulo: "Casas com 5 quartos em Alphaville", pilar: "comprar" },
};

const home = chamadaPara("/", mapa);
ok(home.tipo === "home" && home.mensagem.includes("Guia Viver em Alphaville"), "home: mensagem geral diz a origem");

const res = chamadaPara("/condominios/genesis-ii/", mapa);
ok(res.tipo === "residencial" && res.titulo.includes("Gênesis II") && res.mensagem.includes("Gênesis II"), "residencial: barra e mensagem citam o residencial (barra final tolerada)");

const art = chamadaPara("/comprar/casas-com-5-quartos-em-alphaville?utm_source=x", mapa);
ok(art.tipo === "artigo" && art.mensagem.includes('"Casas com 5 quartos em Alphaville"'), "artigo: mensagem cita o título (query ignorada)");

for (const p of ["comprar", "alugar", "condominios", "viver", "mercado"]) {
  const c = chamadaPara(`/${p}`, mapa);
  ok(c.tipo === `pilar-${p}` && c.mensagem.includes("Guia Viver em Alphaville"), `pilar ${p}: texto próprio`);
}
ok(chamadaPara("/alugar").botao !== chamadaPara("/comprar").botao, "comprar e alugar têm chamadas diferentes");

const fer = chamadaPara("/ferramentas/custo-de-morar", mapa);
ok(fer.tipo === "ferramenta-custo-de-morar" && fer.mensagem.includes("Custo de morar"), "ferramenta: mensagem cita a ferramenta");

ok(chamadaPara("/selecao-personalizada").semBarra === true, "seleção personalizada: sem barra (o formulário já é o contato)");
ok(chamadaPara("/condominios/inexistente", mapa).mensagem === home.mensagem, "página sem contexto cai na mensagem geral");

// Sem pressão: o guia promete critério.
const proibidas = /últimas|corra|só hoje|imperdível|garant|oportunidade única|agora mesmo|vagas limitadas/i;
const todas = ["/", "/comprar", "/alugar", "/condominios", "/viver", "/mercado", "/ferramentas", "/ferramentas/comparador", "/sobre", "/condominios/genesis-ii", "/comprar/casas-com-5-quartos-em-alphaville"].map((c) => chamadaPara(c, mapa));
ok(todas.every((c) => !proibidas.test(`${c.titulo} ${c.apoio} ${c.botao} ${c.mensagem}`)), "nenhuma chamada com urgência falsa");
ok(todas.every((c) => c.botao.length <= 28), "botões curtos (cabem no celular)");

console.log(falhas ? `\n${falhas} falha(s).` : "\nTodas as verificações passaram.");
process.exit(falhas ? 1 : 0);
