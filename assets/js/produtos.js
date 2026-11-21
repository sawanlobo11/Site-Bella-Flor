/*
 * Catálogo da Floricultura Bela
 * -----------------------------
 * Para adicionar, remover ou editar produtos, altere a lista abaixo.
 *
 * Campos:
 *   id         -> identificador único (texto sem espaços e sem acentos)
 *   nome       -> nome do produto
 *   categoria  -> uma das chaves de CATEGORIAS
 *   preco      -> preço em reais (número). Use null para "Sob consulta".
 *   descricao  -> texto curto exibido no card
 *   imagem     -> caminho da foto, ex: "assets/img/produtos/buque-rose.jpg"
 *   destaque   -> (opcional) etiqueta exibida no card, ex: "Mais vendido"
 *
 * Observação: as fotos atuais são do banco de imagens gratuito Unsplash
 * (unsplash.com/license). Troque pelas fotos reais da loja quando quiser.
 */

const CATEGORIAS = {
  buques: { nome: "Buquês", capa: "assets/img/produtos/buque-campestre.jpg" },
  noiva: { nome: "Buquê de Noiva", capa: "assets/img/produtos/noiva-classico.jpg" },
  arranjos: { nome: "Arranjos", capa: "assets/img/produtos/arranjo-rosas.jpg" },
  plantas: { nome: "Plantas", capa: "assets/img/produtos/orquidea.jpg" },
  presentes: { nome: "Cestas & Presentes", capa: "assets/img/produtos/coracao-flores.jpg" },
  jardinagem: { nome: "Adubos & Defensivos", capa: "assets/img/produtos/kit-adubo.jpg" },
};

const PRODUTOS = [
  // Buquês
  {
    id: "buque-campestre",
    nome: "Buquê Campestre",
    categoria: "buques",
    preco: 189.9,
    descricao: "Rosas, astilbes, lisianthus e folhagens em um mix volumoso e cheio de textura.",
    imagem: "assets/img/produtos/buque-campestre.jpg",
    destaque: "Mais vendido",
  },
  {
    id: "buque-rose",
    nome: "Buquê Rosé",
    categoria: "buques",
    preco: 159.9,
    descricao: "Rosas e flores em tons de rosa claro, embaladas em papel kraft com laço.",
    imagem: "assets/img/produtos/buque-rose.jpg",
  },
  {
    id: "buque-girassol",
    nome: "Buquê Girassol & Campo",
    categoria: "buques",
    preco: 129.9,
    descricao: "Girassol com flores do campo e eucalipto. Alegria em forma de buquê.",
    imagem: "assets/img/produtos/buque-girassol.jpg",
  },
  {
    id: "buque-rosas-coloridas",
    nome: "Buquê Rosas Coloridas",
    categoria: "buques",
    preco: 219.9,
    descricao: "Rosas tingidas em cores vibrantes para quem gosta de surpreender.",
    imagem: "assets/img/produtos/buque-rosas-coloridas.jpg",
    destaque: "Especial",
  },
  {
    id: "rosa-vermelha",
    nome: "Rosa Vermelha Unitária",
    categoria: "buques",
    preco: 19.9,
    descricao: "Rosa vermelha embalada com celofane e fita. Gesto simples, efeito enorme.",
    imagem: "assets/img/produtos/rosa-vermelha.jpg",
  },

  // Buquê de noiva
  {
    id: "noiva-classico",
    nome: "Buquê de Noiva Clássico",
    categoria: "noiva",
    preco: null,
    descricao: "Rosas brancas e salmão com mosquitinho. Montado sob encomenda para o seu dia.",
    imagem: "assets/img/produtos/noiva-classico.jpg",
  },
  {
    id: "noiva-boho",
    nome: "Buquê de Noiva Boho",
    categoria: "noiva",
    preco: null,
    descricao: "Estilo campestre com rosas, eucalipto e fitas. Feito sob medida.",
    imagem: "assets/img/produtos/noiva-boho.jpg",
  },

  // Arranjos
  {
    id: "arranjo-rosas",
    nome: "Arranjo Jardim de Rosas",
    categoria: "arranjos",
    preco: 239.9,
    descricao: "Rosas e garden roses em vaso de vidro. Perfeito para presentear ou decorar.",
    imagem: "assets/img/produtos/arranjo-rosas.jpg",
  },
  {
    id: "arranjo-peonias",
    nome: "Arranjo Peônias",
    categoria: "arranjos",
    preco: 289.9,
    descricao: "Peônias rosadas em arranjo volumoso. Disponibilidade conforme a estação.",
    imagem: "assets/img/produtos/arranjo-peonias.jpg",
    destaque: "Sazonal",
  },
  {
    id: "arranjo-tulipas",
    nome: "Arranjo de Tulipas",
    categoria: "arranjos",
    preco: 179.9,
    descricao: "Tulipas rosas em vaso de vidro com laço de juta.",
    imagem: "assets/img/produtos/arranjo-tulipas.jpg",
  },
  {
    id: "arranjo-vidro",
    nome: "Arranjo Pôr do Sol",
    categoria: "arranjos",
    preco: 199.9,
    descricao: "Rosas laranja, boca-de-leão e folhagens em vidro. Tons quentes e marcantes.",
    imagem: "assets/img/produtos/arranjo-vidro.jpg",
  },

  // Plantas
  {
    id: "orquidea",
    nome: "Orquídea Phalaenopsis",
    categoria: "plantas",
    preco: 129.9,
    descricao: "Orquídea pink com hastes floridas. A flor que é a cara da Bela.",
    imagem: "assets/img/produtos/orquidea.jpg",
    destaque: "Favorita",
  },
  {
    id: "anturio",
    nome: "Antúrio",
    categoria: "plantas",
    preco: 89.9,
    descricao: "Flores vermelhas duradouras que trazem cor a qualquer ambiente.",
    imagem: "assets/img/produtos/anturio.jpg",
  },
  {
    id: "costela-de-adao",
    nome: "Costela-de-Adão",
    categoria: "plantas",
    preco: 119.9,
    descricao: "Monstera em vaso, ideal para salas e ambientes com luz indireta.",
    imagem: "assets/img/produtos/costela-de-adao.jpg",
  },
  {
    id: "ficus",
    nome: "Fícus Elástica",
    categoria: "plantas",
    preco: 99.9,
    descricao: "Planta de folhas largas e brilhantes, resistente e fácil de cuidar.",
    imagem: "assets/img/produtos/ficus.jpg",
  },
  {
    id: "suculenta",
    nome: "Suculenta Haworthia",
    categoria: "plantas",
    preco: 29.9,
    descricao: "Pequena, charmosa e de baixa manutenção. Ótima para mesas de trabalho.",
    imagem: "assets/img/produtos/suculenta.jpg",
  },
  {
    id: "cacto",
    nome: "Cacto Florido",
    categoria: "plantas",
    preco: 34.9,
    descricao: "Cacto com flor em vaso branco. Pede pouca água e muito sol.",
    imagem: "assets/img/produtos/cacto.jpg",
  },

  // Cestas & Presentes
  {
    id: "coracao-flores",
    nome: "Coração de Flores",
    categoria: "presentes",
    preco: 249.9,
    descricao: "Arranjo em formato de coração com rosas, gérberas e flores do campo.",
    imagem: "assets/img/produtos/coracao-flores.jpg",
    destaque: "Presente ideal",
  },
  {
    id: "rosa-vaso",
    nome: "Rosa no Vaso + Cartão",
    categoria: "presentes",
    preco: 49.9,
    descricao: "Rosa em vaso de vidro com cartão escrito à mão com a sua mensagem.",
    imagem: "assets/img/produtos/rosa-vaso.jpg",
  },

  // Adubos & Defensivos
  {
    id: "kit-adubo",
    nome: "Kit Substrato & Adubo",
    categoria: "jardinagem",
    preco: 39.9,
    descricao: "Substrato, adubo e orientação de uso para manter suas plantas saudáveis.",
    imagem: "assets/img/produtos/kit-adubo.jpg",
  },
];

/* Dados da loja */
const LOJA = {
  whatsapp: "5573999745122", // somente dígitos: 55 + DDD + número
  instagram: "https://www.instagram.com/floriculturabelatx/",
};
