# Floricultura Bela — Site

Site estático (HTML, CSS e JavaScript puros) com catálogo de produtos, filtros por categoria, busca, ordenação, sacola de compras e envio do pedido pelo WhatsApp.

## Como abrir
Basta abrir o arquivo `index.html` no navegador. Para publicar, envie a pasta para qualquer hospedagem estática (GitHub Pages, Netlify, Vercel etc.).

## Como editar o catálogo
Todos os produtos ficam em `assets/js/produtos.js`:

- **Adicionar produto:** copie um bloco `{ ... }` da lista `PRODUTOS` e altere nome, preço, descrição e categoria.
- **Fotos:** coloque a imagem em `assets/img/produtos/` e preencha o campo `imagem`. As fotos atuais são do banco gratuito Unsplash (licença livre para uso comercial); troque pelas fotos reais da loja quando quiser.
- **Preço sob consulta:** use `preco: null`.
- **Categorias:** edite o objeto `CATEGORIAS` (nome e foto de capa do círculo).
- **WhatsApp e Instagram:** altere o objeto `LOJA`.

Endereço e textos das seções estão diretamente no `index.html`. A logo fica em `assets/img/logo-bela.png`.
