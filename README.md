# Floricultura Bela

Sistemas da **Floricultura Bela**, floricultura e paisagismo em Teixeira de Freitas (BA).

- WhatsApp: (73) 99974-5122
- Endereço: Rua Águas Claras, 375, Bela Vista, Teixeira de Freitas (BA)
- Instagram: [@floriculturabelatx](https://www.instagram.com/floriculturabelatx/)

## O que tem aqui

| Pasta | O que é |
| --- | --- |
| [`site/`](site/) | Site da loja: banners, catálogo de produtos, sacola e pedido pelo WhatsApp. |
| [`estoque/`](estoque/) | Sistema interno: estoque (físicos e orgânicos), vendas com baixa automática e faturamento por dia, semana e mês. |
| [`docs/`](docs/) | Identidade visual (cores, fontes, logo) e créditos das fotos. |
| `.claude/skills/` | Skill de design `site-de-10k`, usada pelo Claude ao trabalhar neste projeto. |

```
.
├── site/
│   ├── index.html
│   └── assets/
│       ├── css/style.css
│       ├── js/produtos.js     ← catálogo: edite aqui produtos e preços
│       ├── js/main.js
│       └── img/               ← logo, banners e fotos dos produtos
├── estoque/
│   ├── index.html             ← o sistema inteiro em um arquivo
│   ├── img/logo-bela.png
│   └── testes/                ← testes com banco falso (estoque e vendas)
├── docs/
│   ├── identidade-visual.md
│   └── creditos-das-fotos.md
├── .claude/skills/site-de-10k/
├── CLAUDE.md                  ← instruções para o Claude neste projeto
└── README.md
```

## Onde ficam os dados

- **Site:** não guarda dados. Os produtos ficam no arquivo `site/assets/js/produtos.js` e o pedido vai direto para o WhatsApp da loja.
- **Estoque e vendas:** itens, categorias, movimentações e vendas ficam no banco de dados do Claude, ligado ao link do sistema no claude.ai. O código está aqui no GitHub; os dados não. Detalhes em [`estoque/README.md`](estoque/README.md).

## Como pedir mudanças

Fale com o Claude em português simples, por exemplo: "muda o preço do Buquê Rosé para 169,90" ou "cria a categoria Orquídeas no estoque". Ele altera os arquivos, testa e salva aqui.
