# Projeto Floricultura Bela

Sistemas da Floricultura Bela (floricultura e paisagismo, Teixeira de Freitas, BA). Leia o `README.md` para a estrutura.

## Como falar com o dono

- Sempre em português do Brasil, simples e direto. O dono não programa: resolva a parte técnica e explique só o que ajuda a decidir.
- Nada de travessão nos textos do site, do estoque ou das mensagens.

## Pastas

- `site/`: site estático (HTML, CSS e JS puros, sem build). Produtos e preços em `site/assets/js/produtos.js`.
- `estoque/`: controle de estoque, uma página só (`estoque/index.html`) publicada como Artifact do claude.ai em https://claude.ai/artifact/DH811DcYxuoDPiueBXgVyi, com as capacidades `db` e `user` (scope `profile`). Ao republicar, use a pasta `estoque/` como raiz e inclua `img/logo-bela.png`. Os dados vivem no banco do Artifact, não no repositório: nunca exclua esse Artifact.
- `docs/`: identidade visual e créditos das fotos.

## Regras

- Siga `docs/identidade-visual.md` em qualquer tela nova.
- Antes de publicar o estoque, rode `node estoque/testes/teste-local.js` (banco falso; não mexe nos dados reais).
- Dados de exemplo nunca entram no banco real do estoque. Só cadastre o que o dono passar.
- Fotos atuais do site são do Unsplash, não da loja. Se o dono mandar fotos reais, substitua e atualize `docs/creditos-das-fotos.md`.
- A skill `site-de-10k` serve para sites de vitrine com vídeo; para o estoque, aplique só a direção de design, o piso de qualidade, a revisão de texto e o autoteste.
