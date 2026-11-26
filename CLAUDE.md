# Projeto Floricultura Bela

Sistemas da Floricultura Bela (floricultura e paisagismo, Teixeira de Freitas, BA). Leia o `README.md` para a estrutura.

## Como falar com o dono

- Sempre em português do Brasil, simples e direto. O dono não programa: resolva a parte técnica e explique só o que ajuda a decidir.
- Nada de travessão nos textos do site, do estoque ou das mensagens.

## Pastas

- `site/`: site estático (HTML, CSS e JS puros, sem build). Produtos e preços em `site/assets/js/produtos.js`.
- `estoque/`: estoque, vendas e faturamento (abas #estoque, #vendas, #faturamento), uma página só (`estoque/index.html`) publicada como Artifact do claude.ai em https://claude.ai/artifact/DH811DcYxuoDPiueBXgVyi, com as capacidades `db`, `user` (scope `profile`) e `downloads`. Ao republicar, use a pasta `estoque/` como raiz e inclua `img/logo-bela.png`. Os dados vivem no banco do Artifact, não no repositório: nunca exclua esse Artifact.
- O mesmo `estoque/index.html` também roda fora do Claude, em https://sawanlobo11.github.io/Site-Bella-Flor/estoque/ (GitHub Pages, `.github/workflows/publicar.yml`), com Firebase: login por e-mail e senha, dono em `config/dono`, equipe em `equipe/<e-mail>`. Configuração em `estoque/firebase-config.js`, regras em `estoque/firebase/firestore.rules` e passo a passo em `estoque/firebase/COMO-CONFIGURAR.md`. Sem `window.claude`, a página usa o Firebase.
- `docs/`: identidade visual e créditos das fotos.

## Regras

- Siga `docs/identidade-visual.md` em qualquer tela nova.
- Antes de publicar, rode `teste-local.js`, `teste-vendas.js`, `teste-extras.js` e `teste-firebase.js` em `estoque/testes/` (banco falso; não mexem nos dados reais) e confira as telas com `capturas.js`.
- O CSS do estoque é feito a partir do celular (cortes em 768 e 1024px). Campos de número são texto com `inputmode="decimal"` e passam pela função `num()`, que aceita vírgula.
- Cada `id` do HTML precisa ser único: as três abas ficam na mesma página.
- Dados de exemplo nunca entram no banco real do estoque. Só cadastre o que o dono passar.
- Fotos atuais do site são do Unsplash, não da loja. Se o dono mandar fotos reais, substitua e atualize `docs/creditos-das-fotos.md`.
- A skill `site-de-10k` serve para sites de vitrine com vídeo; para o estoque, aplique só a direção de design, o piso de qualidade, a revisão de texto e o autoteste.
- A skill `ui-ux-pro-max` (MIT, de github.com/nextlevelbuilder/ui-ux-pro-max-skill) traz regras de UI/UX e uma busca local: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<consulta>" --domain <domínio>`. Use as recomendações dela dentro da identidade visual da Bela (`docs/identidade-visual.md`), nunca no lugar dela.
