# Estoque, vendas e faturamento

Sistema interno da Floricultura Bela com três áreas (abas no topo):

- **Estoque:** itens separados em físicos e orgânicos.
- **Vendas:** registra vendas e já desconta do estoque.
- **Faturamento:** quanto entrou hoje, na semana e no mês.

O estoque é separado em duas seções:

- **Físicos:** Adubo, Fertilizante, Vasos, Ferramentas de jardinagem, Cachepôs.
- **Orgânicos:** flores, plantas e mudas (categorias a definir).

## Onde usar

O mesmo arquivo (`index.html`) funciona de dois jeitos:

- **No celular ou navegador, sem conta do Claude (principal):** https://sawanlobo11.github.io/Site-Bella-Flor/estoque/
  Login por e-mail e senha, dados no Firebase. O dono libera cada funcionário em **Minha conta**, **Equipe**. Configuração inicial em [`firebase/COMO-CONFIGURAR.md`](firebase/COMO-CONFIGURAR.md).
- **Dentro do claude.ai:** https://claude.ai/artifact/DH811DcYxuoDPiueBXgVyi
  Usa o banco do próprio Claude e pede conta do Claude. Os dados das duas versões são separados.

Para virar ícone na tela do celular: no iPhone (Safari), Compartilhar, **Adicionar à Tela de Início**; no Android (Chrome), três pontinhos, **Adicionar à tela inicial**.

## O que dá para fazer

- Cadastrar itens com categoria, quantidade, unidade, estoque mínimo, validade, custo, preço e observações.
- Movimentar: **Entrada**, **Saída**, **Perda** (flor que murchou, vaso quebrado) e **Contagem** (corrige o número depois de contar a prateleira). Os botões **−** e **+** tiram ou põem 1 unidade.
- Ver a situação de cada item: em estoque, baixo (chegou no mínimo) ou zerado, com um medidor que marca o ponto do mínimo.
- Ver avisos de validade: "Vence em X dias" a partir de 7 dias antes, e "Vencido".
- Ver o resumo: total de itens, zerados, abaixo do mínimo e valor em estoque pelo preço de custo.
- Ver o histórico das últimas 40 movimentações, com quem fez e quando.
- Criar e remover categorias pela própria página.

Uma saída ou perda nunca deixa o estoque negativo. Os botões **−** e **+** mostram um aviso com **Desfazer** por 5 segundos, para corrigir um toque errado.

Os campos de número aceitam vírgula (5,90) e ponto (5.90). Os blocos **Zerados** e **Abaixo do mínimo** do resumo filtram a lista. No computador, a tabela ordena por item, quantidade ou situação, e a tecla **/** leva direto para a busca.

### Celular, tablet e computador
O mesmo link se reorganiza sozinho:
- **Celular:** abas na barra de baixo (com o número de itens em falta), botão flutuante "Novo item", venda atual numa gaveta que sobe de baixo (fecha com o X, tocando fora ou arrastando para baixo) e janelas que sobem da parte de baixo.
- **Celular deitado:** abas no topo, para sobrar altura.
- **Tablet:** abas no topo e venda atual na gaveta.
- **Computador:** barra lateral, tabela completa e venda atual ao lado dos produtos.

### Planilhas
"Baixar planilha" gera um arquivo CSV (abre no Excel e no Google Planilhas): o estoque inteiro, ou as vendas do período escolhido no Faturamento.

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

O **código** do sistema está aqui (`index.html`). Os **dados** ficam no **Firebase** (versão do celular) ou no banco do Claude (versão do claude.ai). No Firebase, as regras de segurança estão em `firebase/firestore.rules`; a estrutura abaixo vale para os dois. No Firebase existem ainda `config/dono` (quem é o dono), `equipe/<e-mail>` (quem foi liberado) e `pessoas/<id>` (nome de quem fez cada coisa).

No banco do Claude:

- Funcionam em qualquer aparelho e atualizam em tempo real para todos.
- Continuam salvos quando o sistema é atualizado.
- São apagados se o sistema for **excluído** no claude.ai. Não exclua o link.
- Limite de 25.000 registros (cada item, venda e movimentação conta como um).

### Estrutura do banco

| Caminho | Conteúdo |
| --- | --- |
| `itens/<id>` | `nome`, `secao` (`fisicos` ou `organicos`), `categoria`, `quantidade`, `unidade`, `minimo`, `validade` (AAAA-MM-DD), `custo`, `preco`, `obs`, `criadoEm`, `atualizadoEm`, `atualizadoPor` |
| `movimentos/<id>` | `itemId`, `itemNome`, `unidade`, `tipo` (`entrada`, `saida`, `perda`, `ajuste`), `qtd`, `saldoApos`, `motivo`, `em` (data e hora), `por` |
| `vendas/<id>` | `em`, `itens` (lista com `itemId` ou nulo para avulso, `nome`, `unidade`, `qtd`, `preco`, `custo`, `subtotal`), `subtotal`, `desconto`, `total`, `custoTotal`, `pagamento` (`pix`, `dinheiro`, `debito`, `credito`), `cliente`, `por`, `cancelada`, `canceladaEm`, `canceladaPor`, `estoqueBaixado`, `pendentes` (itens cujo estoque não baixou) |
| `config/categorias` | `fisicos: [...]`, `organicos: [...]` |

`atualizadoPor`, `por` e `canceladaPor` guardam só o código da pessoa, nunca o nome. O nome aparece na tela na hora de mostrar.

O código da venda (ex.: #9SGS) são os 4 últimos caracteres do `<id>`. A tela de faturamento lê as 1.000 vendas mais recentes, o que cobre o mês atual e o anterior com folga para uma loja deste porte.

## Como atualizar o sistema

1. Altere `estoque/index.html` (a página inteira está nesse arquivo: estilo, estrutura e código).
2. Rode os testes locais, que usam um banco falso e não mexem nos dados reais:
   ```
   node estoque/testes/teste-local.js
   node estoque/testes/teste-vendas.js
   node estoque/testes/teste-extras.js
   node estoque/testes/teste-firebase.js
   node estoque/testes/capturas.js
   ```
   O teste de vendas roda em computador, iPhone, Android, tablet e celular deitado.
   As capturas de tela ficam em `estoque/testes/saida/`.
3. Salve no GitHub: a versão do celular publica sozinha pelo GitHub Pages. Para a versão do claude.ai, publique de novo no mesmo link pelo Claude (ferramenta Artifact, com a pasta `estoque/` como raiz, `img/logo-bela.png` junto e as permissões `db`, `user` com perfil e `downloads`). Os dados continuam intactos.

A revisão de UI/UX que guiou esta versão está em [`docs/auditoria-ui-ux.md`](../docs/auditoria-ui-ux.md).
