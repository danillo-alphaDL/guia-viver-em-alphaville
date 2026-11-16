# Publicação: domínio na HostGator, site na Vercel

Mesmo arranjo do alphadl.com.br. A HostGator guarda o domínio e o DNS. A Vercel hospeda o site e publica sozinha a cada alteração no GitHub.

## 1. Registrar o domínio (HostGator)

1. Registre `guiaviveremalphaville.com.br` na HostGator.
2. Antes, confira no INPI o uso de "Alphaville" no nome (ver riscos em `01-analise-estrategica.md`).

## 2. Criar o projeto (Vercel)

1. Faça o merge do pull request no `main`.
2. Na Vercel: **Add New → Project** e importe o repositório `guia-viver-em-alphaville`.
3. A Vercel reconhece o Next.js sozinha. Não mude os comandos de build.
4. Em **Environment Variables**, cadastre:

| Variável | Valor | Ambiente |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.guiaviveremalphaville.com.br` | Production |
| `NEXT_PUBLIC_GA_ID` | ID do Google Analytics do guia (crie uma propriedade nova, separada da Alpha DL) | Production |
| `GUIA_MOSTRAR_RASCUNHOS` | `1` | **Só Preview** |

As demais variáveis de `.env.example` são opcionais.

Com `GUIA_MOSTRAR_RASCUNHOS=1` só no ambiente Preview, cada branch ganha um endereço de pré-visualização onde os rascunhos aparecem (com aviso e fora do Google). Em produção, eles continuam ocultos.

5. Clique em **Deploy**. O site fica disponível em um endereço `*.vercel.app`.

## 3. Ligar o domínio

1. Na Vercel: **Settings → Domains**. Adicione `www.guiaviveremalphaville.com.br` e `guiaviveremalphaville.com.br`.
2. Defina o `www` como principal e o endereço sem `www` redirecionando para ele.
3. A Vercel mostra os registros de DNS a criar. Copie os valores exatos que ela exibir.
4. Na HostGator: **Domínios → Zona DNS** do domínio. Crie os dois registros indicados pela Vercel:
   - um registro **A** para `@` (domínio sem `www`);
   - um registro **CNAME** para `www`.
5. Remova registros A ou CNAME antigos de `@` e `www` que apontem para a hospedagem da HostGator.
6. Aguarde a propagação. A Vercel emite o certificado HTTPS sozinha quando o DNS responde.

## 4. Conferir depois de publicar

- [ ] `https://guiaviveremalphaville.com.br` redireciona para `https://www.guiaviveremalphaville.com.br`.
- [ ] A seção "Casas disponíveis agora" da home mostra 3 casas. Se mostrar só o botão, o arquivo `portfolio-alphadl-60-imoveis.json` não está acessível em alphadl.com.br.
- [ ] Os botões de WhatsApp abrem a conversa com a mensagem da página de origem.
- [ ] `/sitemap.xml` e `/robots.txt` abrem.
- [ ] O aviso de cookies aparece e a medição só começa depois do aceite.
- [ ] Um endereço de rascunho, como `/comprar/mansoes-em-alphaville-o-que-avaliar`, responde "página não encontrada" em produção.

## 5. Google

1. No Search Console, adicione a propriedade do domínio. A verificação é por um registro TXT na Zona DNS da HostGator.
2. Envie `https://www.guiaviveremalphaville.com.br/sitemap.xml`.

## O que o site mostra no primeiro dia

Enquanto nenhum artigo ou ficha estiver publicado, o site no ar terá: home, vitrine da Alpha DL, as cinco seções com leituras do blog da Alpha DL, o simulador de custo, o formulário e as páginas institucionais. O comparador avisa que aguarda fichas verificadas.
