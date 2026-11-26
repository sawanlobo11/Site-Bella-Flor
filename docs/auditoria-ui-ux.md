# Auditoria de UI/UX do sistema de estoque e vendas

Feita com a skill **UI UX Pro Max** (`.claude/skills/ui-ux-pro-max`), seguindo a ordem de prioridade dela.

## Direção recomendada pela skill

- Consulta `"inventory management small business" --domain product`: **Inventory & Stock Management** → estilo **Flat Design + Minimalismo Suíço**, painel **denso e em tempo real**, cores **neutras com semáforo de situação** (verde, âmbar, vermelho).
- Consulta `--design-system`: estilo Flat (sem gradientes e sombras, transições de 150 a 200ms, alvos de toque grandes). As cores e o padrão de página sugeridos eram genéricos e foram descartados: a identidade da Bela (`docs/identidade-visual.md`) continua valendo.
- Consulta `"inventory dashboard data dense" --domain style`: linhas destacadas ao passar o mouse e tabela com ordenação.

## Problemas encontrados e correção

| # | Prioridade | Regra da skill | Problema | Correção |
|---|---|---|---|---|
| 1 | Acessibilidade | `heading-hierarchy` | A aba Estoque não tinha título principal | Cada aba tem seu título |
| 2 | Acessibilidade | `focus-not-obscured` | Topo fixo e barra de baixo podiam cobrir o campo em foco | Margem de rolagem no topo e embaixo |
| 3 | Acessibilidade | `tooltip-keyboard`, `focusable-elements` | Gráfico só funcionava com mouse | Setas do teclado percorrem as barras; resumo em texto para leitor de tela |
| 4 | Acessibilidade | `aria-live-errors`, `error-placement` | Erros dos formulários longe do campo e sem aviso para leitor de tela | Erro embaixo do campo, ligado a ele e anunciado |
| 5 | Toque | `touch-target-size` | Botões de quantidade da venda (32px), formas de pagamento, tipos de movimentação e "Remover" abaixo de 44px | Tudo com 44px no toque |
| 6 | Toque | `tap-delay` | Atraso de toque no navegador | `touch-action: manipulation` |
| 7 | Toque | `touch-target-chart` | Barras do mês com 10px de largura no celular | O toque vale pela posição em todo o gráfico, e arrastar percorre as barras |
| 8 | Desempenho | `main-thread-budget` | Camada de fundo animada com gradientes grandes pesava no celular | Removida (estilo Flat) |
| 9 | Desempenho | `image-dimension` | Logo sem tamanho declarado | Tamanho declarado |
| 10 | Estilo | `effects-match-style` | Gradientes e sombras espalhados | Visual plano; sombra só em janelas, gaveta, aviso e botão flutuante |
| 11 | Estilo | `no-emoji-icons`, `icon-style-consistent` | Sinais de texto (−, +, ×) misturados com ícones de traços diferentes | Um único conjunto de ícones SVG, traço 2 |
| 12 | Layout | `mobile-first`, `breakpoint-consistency` | CSS feito do computador para o celular, com cortes em 700 e 1000px | Refeito a partir do celular, com cortes em 768 e 1024px |
| 13 | Layout | `scroll-behavior` | Lista dentro de lista com rolagem própria no celular (histórico) | Histórico mostra 8 e tem "Ver mais" |
| 14 | Layout | `orientation-support` | Celular deitado: a venda atual ficava maior que a tela e o "Finalizar" sumia | Venda atual em gaveta abaixo de 1024px; no computador, com altura limitada à tela |
| 15 | Navegação | `adaptive-navigation` | Computador usava abas no topo | Barra lateral no computador, abas no topo no tablet, barra de baixo no celular |
| 16 | Navegação | `nav-label-icon`, `tab-badge` | Ícones só no celular; nada avisava itens em falta | Ícone e texto em todos; contador de itens em falta na aba Estoque |
| 17 | Navegação | `state-preservation`, `focus-on-route-change` | Trocar de aba jogava a página para o topo e não movia o foco | Cada aba lembra a posição; o foco vai para o título |
| 18 | Tipografia | `readable-font-size` | Texto base de 14px e rótulos de 10 a 11px | Base de 16px no celular e mínimo de 12px |
| 19 | Animação | `motion-consistency`, `exit-faster-than-enter` | Durações soltas e iguais na entrada e na saída | Tempos padronizados; a saída é mais rápida que a entrada |
| 20 | Formulários | `forgiving-formats` | Campos numéricos recusavam vírgula ("5,90" virava vazio em vários celulares) | Aceitam vírgula e ponto |
| 21 | Formulários | `required-indicators` | Campos obrigatórios sem marca | Marcados com asterisco |
| 22 | Formulários | `sheet-dismiss-confirm` | Tocar fora da janela de item apagava o que foi digitado | Pergunta antes de descartar |
| 23 | Formulários | `undo-support` | Um toque errado em − ou + não tinha volta | Aviso com "Desfazer" |
| 24 | Formulários | `submit-not-pre-disabled` | "Finalizar venda" ficava desativado sem explicar | Fica ativo e explica o que falta |
| 25 | Formulários | `toast-dismiss` | Aviso sumia em 2,4s | 4s (5s quando tem "Desfazer") |
| 26 | Carregamento | `progressive-loading`, `loading-chart` | Gráfico dizia "sem vendas" enquanto ainda carregava | Blocos de carregamento no lugar dos números, lista e gráfico |
| 27 | Gráficos | `export-option` | Sem como tirar os dados do sistema | "Baixar planilha" (CSV) no estoque e no faturamento |
| 28 | Dados | `sortable-table` | Tabela do computador sem ordenação | Ordenar por item, quantidade ou situação |

## Erros de funcionamento corrigidos

- **Duas pessoas vendendo o mesmo item ao mesmo tempo** podiam sobrescrever a quantidade uma da outra. Agora o sistema lê a quantidade mais recente no banco logo antes de gravar.
- **Falha no meio de uma venda:** se a internet caísse depois de salvar a venda, parte do estoque podia não baixar sem aviso. Agora a venda registra se a baixa terminou e a tela diz exatamente quais itens ficaram pendentes.
- **Vírgula nos números** (item 20 acima), que fazia preços e quantidades virarem zero.

## O que ficou de fora, de propósito

- **Tema escuro:** o sistema mantém o visual único da marca (fundo creme, verde e dourado), que a página trata como escolha fixa.
