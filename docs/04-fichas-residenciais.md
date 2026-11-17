# Fichas dos residenciais: o que está pronto e o que falta

**Data:** 17/11/2026 (atualizado com a pesquisa do mesmo dia)

As fichas ficam em `content/condominios/*.json`. Todas estão como rascunho (`em-revisao-factual`) e só aparecem no ambiente de pré-visualização.

## De onde vieram os dados

- **Associação de moradores e município:** conferidos em 17/11/2026 no [Mapa das OSC do Ipea](https://mapaosc.ipea.gov.br), que reproduz o cadastro de CNPJ da Receita Federal. Trazem nome, CNPJ e data de fundação da associação. O município usado é o da sede da associação: confirmar que todos os lotes ficam nele (no Residencial Zero, por exemplo, não ficam).
- **Implantação, lotes e lazer:** vieram do registro de residenciais da Alpha DL, que cita a fonte original (associação ou material do loteador). A data desses campos (09/2026) é a do registro. **Reconfirmar na fonte antes de publicar.**
- **Pesquisa na internet (17/11/2026):** número de lotes, área e lazer só aparecem em anúncios de imobiliárias, que não servem como fonte. Exemplo: anúncios citam 702 lotes no Tamboré 1, sem documento que confirme. Esses números estão anotados nas fichas, sem publicar.

Os textos do guia foram escritos do zero, sem copiar as páginas da Alpha DL.

## Para publicar uma ficha

O código exige:
- município verificado;
- pelo menos 4 campos verificados;
- data de atualização (`atualizadoEm`).

Também é preciso escrever, com o corretor que atende o residencial, os **prós e contras** e a frase **"para quem"**.

## Situação de cada ficha

| Residencial | Campos verificados | Falta para publicar |
|---|---|---|
| Alphaville Residencial Zero | município, implantação, lotes, associação (4) | Reconfirmar dados do registro da Alpha DL |
| Gênesis II | município, lotes, associação, lazer (4) | Reconfirmar dados do registro da Alpha DL |
| Alphaville Residencial 1 | município, implantação, associação (3) | 1 campo(s) |
| Alphaville Residencial 2 | município, implantação, associação (3) | 1 campo(s) |
| Alphaville Residencial 9 | município, lotes, lazer (3) | 1 campo(s) |
| Alphaville Burle Marx | município, associação (2) | 2 campo(s) |
| Alphaville Residencial 10 | município, associação (2) | 2 campo(s) |
| Alphaville Residencial 3 | município, associação (2) | 2 campo(s) |
| Alphaville Residencial 4 | município, associação (2) | 2 campo(s) |
| Alphaville Residencial 5 | município, associação (2) | 2 campo(s) |
| Alphaville Residencial 6 | município, associação (2) | 2 campo(s) |
| Tamboré 10 | município, associação (2) | 2 campo(s) |
| Tamboré 11 | município, associação (2) | 2 campo(s) |
| Tamboré 2 | município, associação (2) | 2 campo(s) |
| Tamboré 3 | município, associação (2) | 2 campo(s) |
| Valville 1 | município, associação (2) | 2 campo(s) |
| Valville 2 | município, associação (2) | 2 campo(s) |
| Tamboré 1 | associação (1) | 3 campo(s) |

## Onde conseguir o que falta

- **Lotes, área e implantação:** a própria associação (site, secretaria ou regulamento) ou a matrícula do loteamento no cartório de registro de imóveis (Barueri ou Santana de Parnaíba).
- **Lazer:** site ou regulamento da associação.
- **Taxa condominial:** boleto de uma casa do residencial.

## Taxa e faixas de preço

Ficam em apuração em todas as fichas. O export de imóveis da Alpha DL não informa o residencial de cada casa: o residencial confirmado está no banco da Alpha DL. Quando houver esse dado, a regra é a mesma do Radar da Alpha DL:
- só casas à venda (para a faixa de venda) ou casas para alugar (para a de aluguel);
- mínimo de 5 casas no residencial;
- faixa do 25º ao 75º percentil do preço **pedido**, com a data e o número de casas;
- taxa condominial pela mediana dos anúncios, também com mínimo de 5.

## Residenciais ainda sem ficha

Alphaville Residencial 11 e 12, Cidade Tamboré e Aldeia da Serra (que reúne várias associações). Não encontrei a associação deles no Mapa das OSC.
