# Identidade visual do Guia (18/11/2026)

Kit recebido do cliente: `kit_logo_guia_viver_alphaville.zip`. Instruções originais em `INSTRUCOES-DO-KIT.md`.
Todos os arquivos estão em `public/branding/`. Os originais ficam como vieram; os derivados estão listados abaixo.

## Onde cada arquivo entra
| Arquivo | Uso |
|---|---|
| `logo-cabecalho.png` (derivado) | Cabeçalho, todas as páginas. "GUIA" + nome, sobre o fundo escuro do topo. |
| `logo-principal.png` | Rodapé, logo completo com as casas e o slogan. |
| `og-image-1200x630.jpg` (derivado) | Open Graph e Twitter Card de todas as páginas (`IMAGEM_SOCIAL` em `src/lib/marca.ts`). |
| `favicon.ico` (cópia também em `public/favicon.ico`), `icone-16/32/192` | Favicon. |
| `icone-180x180.png` | Apple Touch Icon. |
| `icone-192/512` | Manifesto PWA (`src/app/manifest.ts`). |
| `icone-512x512.png` | Logo da organização nos dados estruturados. |
| Demais (`logo-1200/800/480`, `logo-horizontal-mobile`, `logo-original`, `logo-texto-transparente`, `icone-48/64`) | Guardados para uso futuro. |

## Arquivos derivados (como foram feitos)
- `logo-texto-limpo.png`: a versão transparente do kit, com transparência total nas linhas 0 a 49 fora da faixa x 560 a 960. Ali havia sobras da remoção de fundo (pontas do arco cortado e uma mancha cinza). Letras e filetes intactos.
- `logo-cabecalho.png`: recorte de `logo-texto-limpo.png` em (40, 22, 1475, 262). Mantém "GUIA" e o nome, sem o slogan, que sairia com cerca de 4 px na altura do cabeçalho.
- `og-image-1200x630.jpg`: a mesma arte do PNG, em JPEG qualidade 88 (de 833 KB para 118 KB).

## Decisões
- **A versão transparente só serve em fundo escuro.** "Viver em" e o slogan são brancos e somem em fundo claro. O cabeçalho do site está sempre sobre fundo escuro.
- **Rodapé:** o fundo do logo (#01020E) é um pouco mais azulado que o do rodapé (#090A0A). Um esfumado de 2,2% nas bordas, que são vazias, evita a caixa aparente.
- **Carregamento:** `next/image` entrega AVIF/WebP. O cabeçalho trafega 5 a 7 KB e o rodapé 16 KB, contra 330 KB e 1,3 MB dos PNG. O logo do cabeçalho não é pré-carregado, para não disputar banda com as fontes do título (o LCP é o H1).
- **Favicon em 16 px:** a casa não se lê nesse tamanho (vira um quadrado escuro com uma mancha dourada), como o kit avisa. A partir de 32 px se lê bem. Melhorar isso pede um ícone simplificado feito pelo designer.
