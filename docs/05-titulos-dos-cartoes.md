# Títulos dos cartões de imóvel (18/11/2026)

## O problema
Os cartões diziam "Casa com 5 quartos", com o mesmo título para seis casas
diferentes. Faltavam os três sinais que pesam numa busca de imóvel: o tipo com
a transação ("casa à venda"), o lugar (o residencial) e o diferencial.

## O que o Google mostrou (autocompletar, Brasil, pt-BR, 18/11/2026)
- "casa alphaville residencial" completa com: residencial 1, 2, 3, 4, 11, 5, 6, 9, 12, 10, zero, 8.
  As pessoas buscam pelo **nome do residencial**.
- "casa alphaville 4 suites" completa com: "4 quartos", "4 barueri", "4 venda".
  Digita-se **quartos**, e a cidade entra para desambiguar.
- "casa a venda alphaville" completa com Campinas, Goiânia, Nova Lima, Salvador, Fortaleza, Porto Alegre…
  Existem dezenas de Alphavilles: **a cidade precisa aparecer** (Barueri / Santana de Parnaíba).

## A fórmula
- **Rótulo (acima):** cidade, ou o código ADL na página do residencial.
- **Título (h3):** `{Tipo} à venda com {quartos} no {Residencial}`.
  - quartos = "4 suítes" quando todos são suítes; "4 quartos (2 suítes)" quando não são.
  - Na página do residencial o lugar sai do título (já está no H1) e entra a área:
    "Casa à venda com 4 suítes e 437 m²".
- **Linha de detalhes:** área construída · terreno (só quando maior) · vagas.
- **Foto (alt):** "Casa à venda no Alphaville Residencial 1, Barueri: 5 suítes, 960 m² construídos".
- **Chamada:** "Ver fotos e detalhes →" (diz o que a pessoa ganha ao clicar).

## Regras
- Cada parte sai de um campo do anúncio (`/api/vitrine`). Campo vazio não entra; nada é estimado.
- O nome do residencial é normalizado do cadastro ("Residencial 1", "Residencial Alpha 5" → "Alphaville Residencial N").
- Sem adjetivo de venda ("imperdível", "oportunidade única"): não é dado, não ajuda na busca e tira credibilidade.
- Código: `textoCartao()` em `src/lib/alphadl.ts`, fonte única dos três lugares (home, residencial, artigos).

## Custo da pesquisa
3 consultas de autocompletar no SerpApi, na conta compartilhada com a Alpha DL.
