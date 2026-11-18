# Capas das páginas principais (18/11/2026)

## Situação
As ilustrações vetoriais da home e dos cinco pilares saíram e entraram fotos. Hoje só há três fotos limpas com resolução para capa de página inteira: casa com piscina, aérea do lago e aérea da cidade. Por isso cada uma aparece em duas páginas, com enquadramento diferente. A configuração fica em `src/lib/capas-paginas.ts`.

| Página | Foto atual | Foco no computador / no celular |
|---|---|---|
| Home | casa-piscina | 62% 55% / 58% 50% |
| Comprar | aerea-lago | 50% 70% / 42% 75% |
| Alugar | casa-piscina | 50% 75% / 30% 70% |
| Condomínios | aerea-lago | 60% 40% / 70% 55% |
| Viver | aerea-cidade | 35% 60% / 22% 62% |
| Mercado | aerea-cidade | 70% 35% / 66% 35% |

## Composição
- **Computador:** foto em tela cheia, com escurecimento da esquerda para a direita. O texto fica à esquerda e o assunto da foto, à direita.
- **Celular:** a foto vira uma faixa no topo (62% da tela na home, 50% nos pilares) e se funde no fundo escuro. O texto fica abaixo, sem disputar com a imagem.
- **Crédito:** "Imagem ilustrativa" aparece em toda capa que não mostra um imóvel ou residencial específico.

## Para cada página ter a sua capa
Gere uma imagem por página (ChatGPT, Midjourney ou similar) com as especificações abaixo e salve com o nome indicado em `public/capas/`. Depois é só trocar a linha da página em `src/lib/capas-paginas.ts`.

**Especificações comuns:**
- Formato: paisagem 2:1, mínimo 2400 × 1200 px.
- Assunto principal entre 55% e 85% da largura. O terço esquerdo deve ser calmo e mais escuro, porque é onde fica o texto.
- O celular corta para retrato no ponto de foco: o assunto precisa continuar inteiro num recorte vertical do centro-direita.
- Sem texto, logo, marca d'água, placa, rosto reconhecível ou prédio real identificável.

**Estilo (cole no fim de cada prompt):**
> fotografia de arquitetura fotorrealista, lente 24mm, luz de fim de tarde dourada encontrando o azul do anoitecer, paleta preto, grafite e dourado quente, contraste profundo, acabamento de revista de arquitetura de luxo, Brasil, paisagismo tropical, sem texto, sem logotipos, sem marcas d'água, sem pessoas em primeiro plano, proporção 2:1

| Arquivo | Página | Prompt |
|---|---|---|
| `capa-home.webp` | Home | Casa contemporânea de alto padrão em condomínio fechado de Alphaville, dois pavimentos com grandes panos de vidro, pedra natural e madeira, piscina de borda reta refletindo a iluminação interna acesa, palmeiras e jardim tropical, casa à direita do quadro, céu dourado à esquerda. |
| `capa-comprar.webp` | Comprar | Fachada principal de casa moderna térrea de alto padrão vista da alameda, caminho de pedra até a porta pivotante de madeira iluminada, garagem discreta, árvores adultas na calçada, a casa ocupando a metade direita, sensação de chegada. |
| `capa-alugar.webp` | Alugar | Interior de sala de estar integrada de casa de alto padrão, pé-direito duplo, sofás claros de design, portas de vidro abertas para varanda e piscina, luz de fim de tarde entrando, ambiente pronto para morar, composição com a abertura para a piscina à direita. |
| `capa-condominios.webp` | Condomínios | Vista aérea de drone de residencial fechado de alto padrão no Brasil, alamedas curvas arborizadas, casas modernas com piscinas, lago e área verde, pôr do sol no horizonte, sem portaria nem placas visíveis. |
| `capa-viver.webp` | Viver | Alameda residencial arborizada ao entardecer com ciclovia e calçada larga, pessoas pequenas e de costas caminhando com um cachorro ao longe, quadra de tênis de clube ao fundo, sensação de rotina tranquila e segura. |
| `capa-mercado.webp` | Mercado | Vista aérea ao entardecer de bairro empresarial com torres de vidro refletindo o pôr do sol ao fundo e bairro residencial de casas de alto padrão em primeiro plano, contraste entre negócios e moradia, torres à direita. |

Depois de salvar: converter para WebP (qualidade 82, cerca de 300 KB), rodar o build e conferir em 1440 px e 390 px.
