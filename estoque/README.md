# Estoque, vendas e faturamento

Sistema interno da Floricultura Bela com três áreas (abas no topo):

- **Estoque:** itens separados em físicos e orgânicos.
- **Vendas:** registra vendas e já desconta do estoque.
- **Faturamento:** quanto entrou hoje, na semana e no mês.

O estoque é separado em duas seções:

- **Físicos:** Adubo, Fertilizante, Vasos, Ferramentas de jardinagem, Cachepôs.
- **Orgânicos:** flores, plantas e mudas (categorias a definir).

## Onde usar

O sistema está publicado no claude.ai:
**https://claude.ai/artifact/DH811DcYxuoDPiueBXgVyi**

Para a equipe usar, compartilhe pelo menu **Compartilhar** da página. Quem recebe acesso de **Colaborador** pode cadastrar e movimentar; quem tem só **Visualizador** apenas vê.

## O que dá para fazer

- Cadastrar itens com categoria, quantidade, unidade, estoque mínimo, validade, custo, preço e observações.
- Movimentar: **Entrada**, **Saída**, **Perda** (flor que murchou, vaso quebrado) e **Contagem** (corrige o número depois de contar a prateleira). Os botões **−** e **+** tiram ou põem 1 unidade.
- Ver a situação de cada item: em estoque, baixo (chegou no mínimo) ou zerado, com um medidor que marca o ponto do mínimo.
- Ver avisos de validade: "Vence em X dias" a partir de 7 dias antes, e "Vencido".
- Ver o resumo: total de itens, zerados, abaixo do mínimo e valor em estoque pelo preço de custo.
- Ver o histórico das últimas 40 movimentações, com quem fez e quando.
- Criar e remover categorias pela própria página.

Uma saída ou perda nunca deixa o estoque negativo.

### Vendas
- Toque nos produtos para montar a venda. Não dá para vender mais do que há em estoque, e produtos zerados ficam desativados.
- O preço vem do cadastro do item e pode ser ajustado na venda.
- **Item avulso** para serviços e coisas fora do estoque (entrega, montagem, paisagismo). Não mexe no estoque.
- Forma de pagamento (Pix, Dinheiro, Débito, Crédito), desconto em reais e nome do cliente (opcional).
- Ao finalizar, cada produto sai do estoque e a saída aparece no histórico como "Venda #CÓDIGO".
- **Cancelar venda** (na lista de vendas de hoje): a venda sai do faturamento e os produtos voltam ao estoque.

### Faturamento
- Períodos: Hoje, Semana (segunda a domingo) e Mês.
- Faturamento, número de vendas, ticket médio e lucro estimado (faturamento menos o custo cadastrado dos itens), com a comparação com o período anterior.
- Gráfico por hora (hoje) ou por dia (semana e mês), com a opção "Ver em tabela".
- Divisão por forma de pagamento e os 8 produtos mais vendidos.
- Vendas canceladas não entram nas contas.

## Onde ficam os dados

O **código** do sistema está aqui (`index.html`). Os **dados** ficam no banco de dados do Claude, ligado ao link acima:

- Funcionam em qualquer aparelho e atualizam em tempo real para todos.
- Continuam salvos quando o sistema é atualizado.
- São apagados se o sistema for **excluído** no claude.ai. Não exclua o link.
- Limite de 25.000 registros (cada item, venda e movimentação conta como um).

### Estrutura do banco

| Caminho | Conteúdo |
| --- | --- |
| `itens/<id>` | `nome`, `secao` (`fisicos` ou `organicos`), `categoria`, `quantidade`, `unidade`, `minimo`, `validade` (AAAA-MM-DD), `custo`, `preco`, `obs`, `criadoEm`, `atualizadoEm`, `atualizadoPor` |
| `movimentos/<id>` | `itemId`, `itemNome`, `unidade`, `tipo` (`entrada`, `saida`, `perda`, `ajuste`), `qtd`, `saldoApos`, `motivo`, `em` (data e hora), `por` |
| `vendas/<id>` | `em`, `itens` (lista com `itemId` ou nulo para avulso, `nome`, `unidade`, `qtd`, `preco`, `custo`, `subtotal`), `subtotal`, `desconto`, `total`, `custoTotal`, `pagamento` (`pix`, `dinheiro`, `debito`, `credito`), `cliente`, `por`, `cancelada`, `canceladaEm`, `canceladaPor` |
| `config/categorias` | `fisicos: [...]`, `organicos: [...]` |

`atualizadoPor`, `por` e `canceladaPor` guardam só o código da pessoa, nunca o nome. O nome aparece na tela na hora de mostrar.

O código da venda (ex.: #9SGS) são os 4 últimos caracteres do `<id>`. A tela de faturamento lê as 1.000 vendas mais recentes, o que cobre o mês atual e o anterior com folga para uma loja deste porte.

## Como atualizar o sistema

1. Altere `estoque/index.html` (a página inteira está nesse arquivo: estilo, estrutura e código).
2. Rode os testes locais, que usam um banco falso e não mexem nos dados reais:
   ```
   node estoque/testes/teste-local.js
   node estoque/testes/teste-vendas.js
   ```
   As capturas de tela ficam em `estoque/testes/saida/`.
3. Publique de novo no mesmo link pelo Claude (ferramenta Artifact, com a pasta `estoque/` como raiz e `img/logo-bela.png` junto). Os dados continuam intactos.
