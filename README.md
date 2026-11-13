# Guia Viver em Alphaville

Portal editorial de **guiaviveremalphaville.com.br**, mantido pela **Alpha DL**: morar, comprar e alugar casas de alto padrão em Alphaville e Tamboré.

Next.js (App Router) + TypeScript, conteúdo em arquivos versionados no Git.

## Rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Para ver os rascunhos (com aviso e `noindex`):

```bash
GUIA_MOSTRAR_RASCUNHOS=1 npm run dev
```

`npm run build` roda antes a checagem editorial (`npm run content:check`) e falha se algo estiver fora das regras.

## Configuração (`.env.local` ou painel da Vercel)

| Variável | Para que serve | Sem ela |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública (canonical, sitemap) | usa `https://www.guiaviveremalphaville.com.br` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4, com consentimento | nenhuma medição |
| `NEXT_PUBLIC_WHATSAPP_ALPHADL` | WhatsApp do atendimento | usa o número do site da Alpha DL |
| `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_TOKEN` | CRM que recebe os leads | o formulário avisa que o envio não está ativo |
| `ALPHADL_FEED_URL` | Endereço do portfólio de imóveis da Alpha DL | usa `https://www.alphadl.com.br/portfolio-alphadl-60-imoveis.json` |

## Conteúdo

- `content/artigos/*.mdx`: artigos. A URL é `/{pilar}/{nome-do-arquivo}`.
- `content/condominios/*.json`: fichas dos residenciais. Cada dado tem estado `verificado` (com fonte e data), `estimativa` (com método) ou `a-verificar`.
- `content/autores/*.json`: autores e revisores.
- `content/inventario.csv`: registro editorial gerado pela checagem.

### Regras que o código impõe

- Só aparece no site, no sitemap e no Google o que tem `status: publicado` (ou `em-atualizacao`).
- Para publicar um artigo: `revisor`, `aprovadoPor`, `publicadoEm`, ao menos uma fonte e o registro de originalidade. Nenhum trecho `<Apurar>` pendente.
- Para publicar um residencial: município verificado e ao menos 4 campos verificados.
- Duas páginas não podem ter a mesma palavra-chave principal.
- Dado `a-verificar` nunca mostra valor ao público.
- `atualizadoEm` é preenchido à mão, só quando o conteúdo muda de fato. O sitemap usa essa data.

Fluxo de status: `ideia → em-pesquisa → em-producao → em-revisao-factual → em-originalidade → em-revisao-seo → aguardando-aprovacao → publicado → em-atualizacao`.

## Relação com o blog da Alpha DL

- A vitrine da home lê o portfólio da Alpha DL a cada hora e mostra as 3 casas de maior valor (a partir de R$ 3 milhões, em Barueri ou Santana de Parnaíba), com preço. Se a leitura falhar, a seção mostra só o link para alphadl.com.br.
- `content/leituras.json` lista artigos do blog da Alpha DL por seção. Eles aparecem como "Leituras recomendadas", com link rastreado.
- O guia pode tratar dos mesmos temas do blog, desde que cada artigo seja original. Para reduzir a disputa entre os dois sites no Google, dê ao artigo do guia um ângulo próprio e ligue um ao outro.

## Imagens

As imagens atuais são ilustrações conceituais em SVG (`src/lib/cena.ts`). Para usar fotografia licenciada, passe `foto` ao componente `Cena`.

## Documentos

- [`docs/01-analise-estrategica.md`](docs/01-analise-estrategica.md): estratégia, riscos, KPIs e plano de 90 dias.
- [`docs/02-angulos-editoriais.md`](docs/02-angulos-editoriais.md): como o guia se diferencia do blog da Alpha DL, tema por tema.
- [`docs/pesquisa/keywords.csv`](docs/pesquisa/keywords.csv): qual site responde a cada busca. Volumes ainda não verificados.
- [`docs/prototipo/proposta-visual.html`](docs/prototipo/proposta-visual.html): protótipo do visual "Noite em Alphaville".

## Antes do lançamento

- [ ] Consulta ao INPI sobre o uso de "Alphaville" no nome e registro do domínio.
- [ ] Autores e revisores reais em `content/autores` (nome, CRECI, bio).
- [ ] Dados verificados nas fichas e revisão dos 10 artigos em rascunho.
- [ ] Revisão jurídica de `/privacidade` (dados do controlador e canal do titular).
- [ ] Variáveis de ambiente configuradas e formulário testado com o CRM real.
- [ ] Fotografia profissional licenciada.
- [ ] Deploy na Vercel e envio do sitemap ao Search Console.
