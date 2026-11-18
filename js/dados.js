// =================================================================
// FUNÇÕES PROFISSIONAIS
// =================================================================

// guarda as funções disponíveis em cada instituição
const funcoesInstituicoes = {

    metro: [
        "Agente de transporte",
        "Coordenador"
    ],

    cptm: [
        "Agente de transporte",
        "Coordenador"
    ],

    viaquatro: [
        "Agente de transporte",
        "Coordenador"
    ],

    viamobilidade: [
        "Agente de transporte",
        "Coordenador"
    ],

    cet: [
        "Operador CET",
        "Coordenador"
    ]

};


// =================================================================
// LINHAS DAS OPERADORAS
// =================================================================

// guarda as linhas atendidas por cada operadora no projeto
const linhasInstituicoes = {

    metro: [
        "Linha 1 - Azul",
        "Linha 2 - Verde",
        "Linha 3 - Vermelha"
    ],

    cptm: [
        "Linha 10 - Turquesa"
    ],

    viaquatro: [
        "Linha 4 - Amarela"
    ],

    viamobilidade: [
        "Linha 5 - Lilás",
        "Linha 8 - Diamante",
        "Linha 9 - Esmeralda"
    ]

};


// =================================================================
// ESTAÇÕES DAS LINHAS
// =================================================================

// guarda uma lista de estações para cada linha
const estacoesLinhas = {

    "Linha 1 - Azul": [
        "Jabaquara",
        "Conceição",
        "São Judas",
        "Saúde",
        "Praça da Árvore",
        "Santa Cruz",
        "Vila Mariana",
        "Ana Rosa",
        "Paraíso",
        "Vergueiro",
        "São Joaquim",
        "Japão-Liberdade",
        "Sé",
        "São Bento",
        "Luz",
        "Tiradentes",
        "Armênia",
        "Portuguesa-Tietê",
        "Carandiru",
        "Santana",
        "Jardim São Paulo",
        "Parada Inglesa",
        "Tucuruvi"
    ],

    "Linha 2 - Verde": [
        "Vila Prudente",
        "Tamanduateí",
        "Sacomã",
        "Alto do Ipiranga",
        "Santos-Imigrantes",
        "Chácara Klabin",
        "Ana Rosa",
        "Paraíso",
        "Brigadeiro",
        "Trianon-Masp",
        "Consolação",
        "Clínicas",
        "Sumaré",
        "Vila Madalena"
    ],

    "Linha 3 - Vermelha": [
        "Corinthians-Itaquera",
        "Artur Alvim",
        "Patriarca",
        "Guilhermina-Esperança",
        "Vila Matilde",
        "Penha",
        "Carrão",
        "Tatuapé",
        "Belém",
        "Bresser-Mooca",
        "Brás",
        "Pedro II",
        "Sé",
        "Anhangabaú",
        "República",
        "Santa Cecília",
        "Marechal Deodoro",
        "Palmeiras-Barra Funda"
    ],

    "Linha 4 - Amarela": [
        "Luz",
        "República",
        "Higienópolis-Mackenzie",
        "Paulista",
        "Oscar Freire",
        "Fradique Coutinho",
        "Faria Lima",
        "Pinheiros",
        "Butantã",
        "São Paulo-Morumbi",
        "Vila Sônia"
    ],

    "Linha 5 - Lilás": [
        "Capão Redondo",
        "Campo Limpo",
        "Vila das Belezas",
        "Giovanni Gronchi",
        "Santo Amaro",
        "Largo Treze",
        "Adolfo Pinheiro",
        "Alto da Boa Vista",
        "Borba Gato",
        "Brooklin",
        "Campo Belo",
        "Eucaliptos",
        "Moema",
        "AACD-Servidor",
        "Hospital São Paulo",
        "Santa Cruz",
        "Chácara Klabin"
    ],

    "Linha 8 - Diamante": [
        "Júlio Prestes",
        "Palmeiras-Barra Funda",
        "Lapa",
        "Domingos de Moraes",
        "Imperatriz Leopoldina",
        "Presidente Altino",
        "Osasco",
        "Comandante Sampaio",
        "Quitaúna",
        "General Miguel Costa",
        "Carapicuíba",
        "Santa Terezinha",
        "Antônio João",
        "Barueri",
        "Jardim Belval",
        "Jardim Silveira",
        "Jandira",
        "Sagrado Coração",
        "Engenheiro Cardoso",
        "Itapevi",
        "Santa Rita",
        "Amador Bueno"
    ],

    "Linha 9 - Esmeralda": [
        "Osasco",
        "Presidente Altino",
        "Ceasa",
        "Villa Lobos-Jaguaré",
        "Cidade Universitária",
        "Pinheiros",
        "Hebraica-Rebouças",
        "Cidade Jardim",
        "Vila Olímpia",
        "Berrini",
        "Morumbi",
        "Granja Julieta",
        "João Dias",
        "Santo Amaro",
        "Socorro",
        "Jurubatuba",
        "Autódromo",
        "Primavera-Interlagos",
        "Grajaú",
        "Mendes-Vila Natal",
        "Varginha"
    ],

    "Linha 10 - Turquesa": [
        "Palmeiras-Barra Funda",
        "Luz",
        "Brás",
        "Juventus-Mooca",
        "Ipiranga",
        "Tamanduateí",
        "São Caetano do Sul",
        "Utinga",
        "Prefeito Saladino",
        "Santo André",
        "Capuava",
        "Mauá",
        "Guapituba",
        "Ribeirão Pires",
        "Rio Grande da Serra"
    ]

};