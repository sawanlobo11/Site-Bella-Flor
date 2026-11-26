# Controle de estoque

Sistema interno da Floricultura Bela para controlar o estoque, separado em duas seções:

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

## Onde ficam os dados

O **código** do sistema está aqui (`index.html`). Os **dados** ficam no banco de dados do Claude, ligado ao link acima:

- Funcionam em qualquer aparelho e atualizam em tempo real para todos.
- Continuam salvos quando o sistema é atualizado.
- São apagados se o sistema for **excluído** no claude.ai. Não exclua o link.
- Limite de 25.000 registros (cada item e cada movimentação conta como um).

### Estrutura do banco

| Caminho | Conteúdo |
| --- | --- |
| `itens/<id>` | `nome`, `secao` (`fisicos` ou `organicos`), `categoria`, `quantidade`, `unidade`, `minimo`, `validade` (AAAA-MM-DD), `custo`, `preco`, `obs`, `criadoEm`, `atualizadoEm`, `atualizadoPor` |
| `movimentos/<id>` | `itemId`, `itemNome`, `unidade`, `tipo` (`entrada`, `saida`, `perda`, `ajuste`), `qtd`, `saldoApos`, `motivo`, `em` (data e hora), `por` |
| `config/categorias` | `fisicos: [...]`, `organicos: [...]` |

`atualizadoPor` e `por` guardam só o código da pessoa, nunca o nome. O nome aparece na tela na hora de mostrar.

## Como atualizar o sistema

1. Altere `estoque/index.html` (a página inteira está nesse arquivo: estilo, estrutura e código).
2. Rode o teste local, que usa um banco falso e não mexe nos dados reais:
   ```
   node estoque/testes/teste-local.js
   ```
   As capturas de tela ficam em `estoque/testes/saida/`.
3. Publique de novo no mesmo link pelo Claude (ferramenta Artifact, com a pasta `estoque/` como raiz e `img/logo-bela.png` junto). Os dados continuam intactos.
