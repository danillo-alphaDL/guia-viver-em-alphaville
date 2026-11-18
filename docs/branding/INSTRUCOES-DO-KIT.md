# Kit de identidade visual — Guia Viver em Alphaville

Use os arquivos fornecidos sem recriar o desenho e sem inserir AlphaDL.

- `logo-principal.png`: logo completo para seções amplas e rodapé.
- `logo-1200px.png`, `logo-800px.png`, `logo-480px.png`: versões responsivas.
- `logo-horizontal-mobile.png`: recorte horizontal com título e slogan, fundo escuro.
- `logo-texto-transparente.png`: versão simplificada de texto com transparência aproximada; inspecionar em fundos claros antes de usar.
- `og-image-1200x630.png`: imagem de compartilhamento Open Graph.
- `icone-512x512.png`, `icone-192x192.png`: ícones PWA.
- `icone-180x180.png`: Apple touch icon.
- `icone-64x64.png`, `icone-48x48.png`, `icone-32x32.png`, `icone-16x16.png`: tamanhos pequenos.
- `favicon.ico`: favicon.

## Implementação
1. Copiar os assets para `public/branding/` no projeto Next.js.
2. Configurar metadata.icons, metadata.openGraph.images e metadata.twitter.images.
3. Usar `next/image` com `alt="Guia Viver em Alphaville"`, dimensões adequadas e layout responsivo.
4. Evitar esticar, distorcer ou recortar letras. Preservar o fundo escuro do logo principal.
5. Testar em desktop e mobile, e conferir legibilidade do favicon (arte detalhada perde definição em 16 px).
6. Não modificar textos nem acrescentar menção à AlphaDL.

Nota: o ícone foi recortado da arte original, não é uma marca vetorial redesenhada. A versão transparente é uma remoção aproximada do fundo da faixa de texto, não um SVG vetorial.
