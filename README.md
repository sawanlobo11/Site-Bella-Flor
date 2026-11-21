# Bella Flor — Site da floricultura

Site estático (HTML, CSS e JavaScript puros) com catálogo de produtos, filtros por categoria, busca, ordenação, sacola de compras e envio do pedido pelo WhatsApp.

## Como abrir
Basta abrir o arquivo `index.html` no navegador. Para publicar, envie a pasta para qualquer hospedagem estática (GitHub Pages, Netlify, Vercel etc.).

## Como editar o catálogo
Todos os produtos ficam em `assets/js/produtos.js`:

- **Adicionar produto:** copie um bloco `{ ... }` da lista `PRODUTOS` e altere nome, preço, descrição e categoria.
- **Usar fotos reais:** coloque a imagem em `assets/img/` e preencha o campo `imagem`, ex.: `imagem: "assets/img/buque-rosas.jpg"`. Sem foto, o site desenha uma ilustração automaticamente com as `cores` informadas.
- **Categorias:** edite o objeto `CATEGORIAS`.
- **WhatsApp:** altere `WHATSAPP_LOJA` (somente números, com 55 + DDD).

Endereço, telefone e horários estão diretamente no `index.html`, na seção "Contato".
