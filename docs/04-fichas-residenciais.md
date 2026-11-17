# Fichas dos residenciais: o que está pronto e o que falta

**Data:** 17/11/2026

As fichas ficam em `content/condominios/*.json`. Todas estão como rascunho (`em-revisao-factual`) e só aparecem no ambiente de pré-visualização.

## De onde vieram os dados

Os fatos estruturais (município, implantação, lotes, associação, lazer) vieram do registro de residenciais da Alpha DL, que cita a fonte de cada informação. Os textos do guia foram escritos do zero, sem copiar as páginas da Alpha DL.

A data de verificação de cada campo (09/2026) é a do registro da Alpha DL. **Antes de publicar, alguém precisa reconfirmar cada campo na fonte indicada** e atualizar a data.

## Para publicar uma ficha

O código exige:
- município verificado;
- pelo menos 4 campos verificados;
- data de atualização (`atualizadoEm`).

Também é preciso escrever, com o corretor que atende o residencial, os **prós e contras** e a frase **"para quem"**.

## Situação de cada ficha

| Residencial | Campos verificados | Faltam para publicar | O que mais falta |
|---|---|---|---|
| Alphaville Residencial 1 | Município, implantação, associação (3) | 1 campo | Lotes, lazer, taxa, preços, prós e contras |
| Alphaville Residencial 2 | Município, implantação, associação (3) | 1 campo | Lotes, lazer, taxa, preços, prós e contras |
| Alphaville Residencial 3 | Município, associação (2) | 2 campos | Implantação, lotes, lazer, taxa, preços |
| Alphaville Residencial 4 | Município, associação (2) | 2 campos | Implantação, lotes, lazer, taxa, preços |
| Alphaville Residencial 9 | Município, lotes, lazer (3) | 1 campo | Implantação, associação, taxa, preços |
| Alphaville Residencial Zero | Município, implantação, lotes, associação (4) | Reconfirmar e datar | Lazer, taxa, preços, prós e contras |
| Gênesis II | Município, lotes, lazer (3) | 1 campo | Implantação, associação, taxa, preços |
| Tamboré 1 | Nenhum | 4 campos | Tudo |

O campo que costuma ser mais fácil de completar é **associação de moradores**: o nome e o ano de fundação estão no cadastro de CNPJ da Receita Federal.

## Taxa e faixas de preço

Ficam em apuração em todas as fichas. O export de imóveis da Alpha DL não informa o residencial de cada casa: o residencial confirmado está no banco da Alpha DL. Quando houver esse dado, a regra é a mesma do Radar da Alpha DL:
- só casas à venda (para a faixa de venda) ou casas para alugar (para a de aluguel);
- mínimo de 5 casas no residencial;
- faixa do 25º ao 75º percentil do preço **pedido**, com a data e o número de casas;
- taxa condominial pela mediana dos anúncios, também com mínimo de 5.

## Próximos residenciais

A Alpha DL também tem página para estes, ainda sem fatos registrados além do município: Alphaville Residencial 5, 10 e 12, Cidade Tamboré, Valville, Valville 2, Residencial Burle Marx e Aldeia da Serra. As fichas deles podem ser criadas quando houver ao menos município e mais três campos apurados.
