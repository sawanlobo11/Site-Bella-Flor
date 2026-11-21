/*
 * Catálogo da Bella Flor
 * ----------------------
 * Para adicionar, remover ou editar produtos, altere a lista abaixo.
 *
 * Campos:
 *   id         -> identificador único (texto sem espaços)
 *   nome       -> nome do produto
 *   categoria  -> uma das chaves de CATEGORIAS
 *   preco      -> preço em reais (número)
 *   descricao  -> texto curto exibido no card
 *   cores      -> cores das flores na ilustração (quando não houver imagem)
 *   imagem     -> (opcional) caminho de uma foto, ex: "assets/img/buque-rosas.jpg"
 *   destaque   -> (opcional) etiqueta exibida no card, ex: "Mais vendido"
 */

const CATEGORIAS = {
  buques: "Buquês",
  arranjos: "Arranjos",
  plantas: "Plantas",
  cestas: "Cestas & Presentes",
  casamento: "Casamentos",
};

const PRODUTOS = [
  {
    id: "buque-rosas-vermelhas",
    nome: "Buquê Paixão",
    categoria: "buques",
    preco: 189.9,
    descricao: "12 rosas vermelhas colombianas com folhagens nobres e papel kraft.",
    cores: ["#c8102e", "#e0243f", "#a00d26"],
    destaque: "Mais vendido",
  },
  {
    id: "buque-campo",
    nome: "Buquê do Campo",
    categoria: "buques",
    preco: 129.9,
    descricao: "Mix de flores do campo: margaridas, lisianthus e astromélias.",
    cores: ["#f6d860", "#ffffff", "#c49bd8"],
  },
  {
    id: "buque-girassois",
    nome: "Buquê Sol de Verão",
    categoria: "buques",
    preco: 149.9,
    descricao: "Girassóis radiantes com eucalipto, perfeitos para alegrar o dia.",
    cores: ["#f7b500", "#ffc93c", "#f59e0b"],
  },
  {
    id: "buque-tulipas",
    nome: "Buquê Tulipas Rosé",
    categoria: "buques",
    preco: 219.9,
    descricao: "10 tulipas holandesas em tons de rosa com acabamento em seda.",
    cores: ["#f4a6c0", "#ec7aa0", "#f8c8d8"],
    destaque: "Novidade",
  },
  {
    id: "arranjo-orquidea",
    nome: "Orquídea Phalaenopsis",
    categoria: "arranjos",
    preco: 159.9,
    descricao: "Orquídea branca com duas hastes em cachepô de cerâmica.",
    cores: ["#ffffff", "#f3e8ff", "#e9d5ff"],
  },
  {
    id: "arranjo-mesa",
    nome: "Arranjo Jardim Secreto",
    categoria: "arranjos",
    preco: 239.9,
    descricao: "Arranjo baixo para mesa com rosas, hortênsias e folhagens.",
    cores: ["#9ec5f0", "#f4a6c0", "#ffffff"],
  },
  {
    id: "arranjo-lirios",
    nome: "Arranjo Lírios Brancos",
    categoria: "arranjos",
    preco: 179.9,
    descricao: "Lírios perfumados em vaso de vidro, elegância e serenidade.",
    cores: ["#ffffff", "#fff7ed", "#fde68a"],
  },
  {
    id: "planta-suculentas",
    nome: "Trio de Suculentas",
    categoria: "plantas",
    preco: 69.9,
    descricao: "Três suculentas em vasinhos de cimento. Fáceis de cuidar.",
    cores: ["#6fae7a", "#8cc59a", "#4f8f5c"],
  },
  {
    id: "planta-costela",
    nome: "Costela-de-Adão",
    categoria: "plantas",
    preco: 119.9,
    descricao: "Monstera deliciosa em vaso de 21 cm, ideal para interiores.",
    cores: ["#2f7d4a", "#3d9a5c", "#256b3d"],
  },
  {
    id: "planta-anturio",
    nome: "Antúrio Vermelho",
    categoria: "plantas",
    preco: 89.9,
    descricao: "Planta de flores duradouras que traz cor a qualquer ambiente.",
    cores: ["#d62839", "#e63946", "#b81d2c"],
  },
  {
    id: "cesta-cafe",
    nome: "Cesta Café com Flores",
    categoria: "cestas",
    preco: 279.9,
    descricao: "Café da manhã completo acompanhado de mini buquê de rosas.",
    cores: ["#f4a6c0", "#ffffff", "#f6d860"],
    destaque: "Presente ideal",
  },
  {
    id: "cesta-chocolate",
    nome: "Rosas & Chocolates",
    categoria: "cestas",
    preco: 199.9,
    descricao: "6 rosas com caixa de bombons artesanais e cartão personalizado.",
    cores: ["#c8102e", "#f4a6c0", "#e0243f"],
  },
  {
    id: "casamento-noiva",
    nome: "Buquê de Noiva Clássico",
    categoria: "casamento",
    preco: 389.9,
    descricao: "Rosas brancas e peônias, montado à mão sob encomenda.",
    cores: ["#ffffff", "#fdf2f8", "#fce7f3"],
  },
  {
    id: "casamento-centro",
    nome: "Centro de Mesa Romântico",
    categoria: "casamento",
    preco: 149.9,
    descricao: "Arranjo para mesas de convidados. Valor por unidade.",
    cores: ["#f8c8d8", "#ffffff", "#e9d5ff"],
  },
];

/* Número do WhatsApp da loja (somente dígitos, com DDI e DDD) */
const WHATSAPP_LOJA = "5573999745122";
