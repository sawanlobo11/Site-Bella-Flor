# Site da Floricultura Bela

Site estático (HTML, CSS e JavaScript puros) com catálogo de produtos, filtros por categoria, busca, ordenação, sacola de compras e envio do pedido pelo WhatsApp.

## Como abrir
Basta abrir o arquivo `site/index.html` no navegador. Para publicar, envie o conteúdo da pasta `site/` para qualquer hospedagem estática (GitHub Pages, Netlify, HostGator etc.).

## Como editar o catálogo
Todos os produtos ficam em `site/assets/js/produtos.js`:

- **Adicionar produto:** copie um bloco `{ ... }` da lista `PRODUTOS` e altere nome, preço, descrição e categoria.
- **Fotos:** coloque a imagem em `site/assets/img/produtos/` e preencha o campo `imagem`. As fotos atuais são do banco gratuito Unsplash (veja `docs/creditos-das-fotos.md`); troque pelas fotos reais da loja quando quiser.
- **Preço sob consulta:** use `preco: null`.
- **Categorias:** edite o objeto `CATEGORIAS` (nome e foto de capa do círculo).
- **WhatsApp e Instagram:** altere o objeto `LOJA`.

Endereço, banners e textos das seções estão em `site/index.html`. A logo fica em `site/assets/img/logo-bela.png`.
