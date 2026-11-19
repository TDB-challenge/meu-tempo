// =================================================================
// FUNÇÕES PROFISSIONAIS
// =================================================================

// guarda as funções disponíveis em cada instituição
const funcoesInstituicoes = {
  metro: ["Agente de transporte", "Coordenador"],

  cptm: ["Agente de transporte", "Coordenador"],

  viaquatro: ["Agente de transporte", "Coordenador"],

  viamobilidade: ["Agente de transporte", "Coordenador"],

  cet: ["Operador CET", "Coordenador"],
};

// =================================================================
// LINHAS DAS OPERADORAS
// =================================================================

// guarda as linhas atendidas por cada operadora no projeto
const linhasInstituicoes = {
  metro: ["Linha 1 - Azul", "Linha 2 - Verde", "Linha 3 - Vermelha"],

  cptm: ["Linha 10 - Turquesa"],

  viaquatro: ["Linha 4 - Amarela"],

  viamobilidade: [
    "Linha 5 - Lilás",
    "Linha 8 - Diamante",
    "Linha 9 - Esmeralda",
  ],
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
    "Tucuruvi",
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
    "Vila Madalena",
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
    "Palmeiras-Barra Funda",
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
    "Vila Sônia",
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
    "Chácara Klabin",
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
    "Amador Bueno",
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
    "Varginha",
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
    "Rio Grande da Serra",
  ],
};

// =================================================================
// CONTAS ADMINISTRATIVAS DEMONSTRATIVAS
// =================================================================

// lista de profissionais fictícios autorizados para testes
const usuariosAdministrativos = [
  {
    nome: "Mariana Silva",
    matricula: "1001",
    email: "agente@meutempo.org.br",
    senha: "MeuTempo123!",
    orgao: "metro",
    funcao: "Agente de transporte",
    linha: "Linha 2 - Verde",
    estacao: "Consolação",
    status: "aprovado",
  },

  {
    nome: "Pedro Santos",
    matricula: "2001",
    email: "operador@meutempo.org.br",
    senha: "MeuTempo123!",
    orgao: "cet",
    funcao: "Operador CET",
    regiao: "Zona Norte",
    status: "aprovado",
  },

  {
    nome: "Ana Oliveira",
    matricula: "3001",
    email: "coordenacao@meutempo.org.br",
    senha: "MeuTempo123!",
    orgao: "metro",
    funcao: "Coordenador",
    regiao: "Unidade central",
    status: "aprovado",
  },
];

// =================================================================
// SOLICITAÇÕES ADMINISTRATIVAS
// =================================================================

// função que recupera as solicitações cadastradas
function buscarSolicitacoes() {
  // recupera os dados do navegador
  const dados = localStorage.getItem("admin-solicitacoes");

  // verifica se existem solicitações
  if (dados !== null) {
    // retorna a lista de solicitações
    return JSON.parse(dados);
  }

  // retorna uma lista vazia caso não existam solicitações
  return [];
}

// função que salva a lista atualizada de solicitações
function salvarSolicitacoes(solicitacoes) {
  // transforma a lista em texto e salva no navegador
  localStorage.setItem("admin-solicitacoes", JSON.stringify(solicitacoes));
}

// =================================================================
// APROVAÇÃO DE CADASTROS
// =================================================================

// função que altera a situação de uma solicitação
function alterarSituacaoCadastro(protocolo, situacao) {
  // recupera as solicitações existentes
  const solicitacoes = buscarSolicitacoes();

  // percorre a lista de solicitações
  for (let i = 0; i < solicitacoes.length; i++) {
    // verifica se encontrou o protocolo
    if (solicitacoes[i].protocolo === protocolo) {
      // altera a situação do cadastro
      solicitacoes[i].status = situacao;

      // verifica se o cadastro foi aprovado
      if (situacao === "aprovado") {
        // cria o e-mail administrativo demonstrativo
        solicitacoes[i].emailAdministrativo =
          protocolo.toLowerCase() + "@meutempo.org.br";
      } else {
        // remove a credencial caso não seja aprovado
        solicitacoes[i].emailAdministrativo = "";
      }

      // salva as informações atualizadas
      salvarSolicitacoes(solicitacoes);

      // encerra a função
      return;
    }
  }
}

// =================================================================
// USUÁRIOS AUTORIZADOS
// =================================================================

// função que reúne as contas autorizadas
function buscarUsuariosAutorizados() {
  // cria uma lista de usuários
  const usuarios = [];

  // adiciona as contas demonstrativas existentes
  for (let i = 0; i < usuariosAdministrativos.length; i++) {
    usuarios.push(usuariosAdministrativos[i]);
  }

  // recupera as solicitações de cadastro
  const solicitacoes = buscarSolicitacoes();

  // percorre as solicitações
  for (let i = 0; i < solicitacoes.length; i++) {
    // recupera a solicitação atual
    const cadastro = solicitacoes[i];

    // verifica se o cadastro foi aprovado
    if (cadastro.status === "aprovado") {
      // adiciona o profissional à lista de usuários
      usuarios.push({
        nome: cadastro.nome,
        matricula: cadastro.matricula,
        email: cadastro.emailAdministrativo,
        senha: "MeuTempo123!",
        orgao: cadastro.orgao,
        funcao: cadastro.funcao,
        linha: cadastro.linha,
        estacao: cadastro.estacao,
        regiao: cadastro.regiao,
        status: cadastro.status,
      });
    }
  }

  // retorna todos os usuários autorizados
  return usuarios;
}

// =================================================================
// DADOS COMPARTILHADOS DO TRANSPORTE
// =================================================================

// recupera uma lista local e mantém o painel utilizável se o texto estiver inválido
// chave identifica o registro que será consultado no navegador
function lerListaOperacional(chave) {
  // recupera o conteúdo salvo
  const texto = localStorage.getItem(chave);
  // verifica se existe conteúdo para interpretar
  if (texto !== null) {
    try {
      // transforma o conteúdo em uma lista
      const lista = JSON.parse(texto);
      // aceita somente o formato utilizado pelos painéis
      if (Array.isArray(lista)) {
        // conserva apenas os objetos utilizados pelos registros operacionais
        const registros = [];
        for (let i = 0; i < lista.length; i++) {
          // ignora entradas incompletas que não representam registros
          if (lista[i] !== null && typeof lista[i] === "object") registros.push(lista[i]);
        }
        return registros;
      }
    } catch (erro) {
      // erro indica um conteúdo que não pode ser interpretado
      return [];
    }
  }
  return [];
}

// cria horários iniciais anteriores ao momento de abrir a simulação
// hora e minuto representam a posição do atendimento na sequência inicial
function horarioInicialMetro(hora, minuto) {
  // prepara a data do exemplo
  const data = new Date();
  // calcula a diferença em minutos para manter a ordem dos exemplos
  const minutosAnteriores = 14 * 60 + 40 - (hora * 60 + minuto);
  data.setMinutes(data.getMinutes() - minutosAnteriores);
  return data.toLocaleString("pt-BR");
}

// cria os dados básicos de um pedido vinculado à estação consolação
// protocolo identifica o pedido, nome identifica o passageiro e tipo descreve o apoio
// horario registra a solicitação, encontro define o ponto e origem informa o canal
function criarChamadoTransporte(protocolo, nome, tipo, horario, encontro, origem) {
  return {
    protocolo: protocolo,
    nome: nome,
    tipo: tipo,
    horarioSolicitacao: horario,
    dataSolicitacao: new Date().toISOString(),
    origem: origem,
    orgao: "metro",
    linha: "Linha 2 - Verde",
    estacao: "Consolação",
    encontro: encontro,
    local: "Consolação - " + encontro,
    credencial: "Credencial de acessibilidade informada pelo passageiro",
    situacao: "Pedido recebido",
    etapas: [{titulo: "Pedido recebido", horario: horario}]
  };
}

// recupera a mesma lista utilizada pelo metrô, coordenação e relatórios
function buscarChamadosMetro() {
  // prepara os exemplos iniciais e seus protocolos exclusivos
  const iniciais = [
    criarChamadoTransporte("MT-1042", "Ana Souza", "Apoio no embarque", horarioInicialMetro(14, 32), "Bloqueio sul", "Aplicativo Meu Tempo"),
    criarChamadoTransporte("MT-1041", "João Lima", "Apoio com elevador", horarioInicialMetro(14, 20), "Mezanino", "IARA"),
    criarChamadoTransporte("MT-1040", "Beatriz Santos", "Acompanhamento no desembarque", horarioInicialMetro(9, 10), "Plataforma", "Aplicativo Meu Tempo")
  ];
  // mantém a data da solicitação igual ao horário inicial apresentado
  iniciais[0].dataSolicitacao = new Date(Date.now() - 8 * 60000).toISOString();
  iniciais[1].dataSolicitacao = new Date(Date.now() - 20 * 60000).toISOString();
  // mantém o atendimento inicial em andamento com etapas coerentes
  iniciais[1].situacao = "Em atendimento";
  iniciais[1].etapas.push({titulo: "Aprovado", horario: horarioInicialMetro(14, 21)});
  iniciais[1].etapas.push({titulo: "Funcionário a caminho", horario: horarioInicialMetro(14, 21)});
  iniciais[1].etapas.push({titulo: "Em atendimento", horario: horarioInicialMetro(14, 24)});
  // mantém o histórico inicial como parte da mesma lista
  iniciais[2].situacao = "Concluído";
  iniciais[2].dataConclusao = "18/11/2026, 09:20:00";
  iniciais[2].horarioSolicitacao = "Horário não registrado";
  iniciais[2].dataSolicitacao = "2026-11-18T12:20:00.000Z";
  // conserva a data conhecida sem inventar os horários anteriores
  iniciais[2].etapas = [{titulo: "Pedido recebido", horario: "Horário não registrado"}];
  iniciais[2].etapas.push({titulo: "Aprovado", horario: "Horário não registrado"});
  iniciais[2].etapas.push({titulo: "Funcionário a caminho", horario: "Horário não registrado"});
  iniciais[2].etapas.push({titulo: "Em atendimento", horario: "Horário não registrado"});
  iniciais[2].etapas.push({titulo: "Concluído", horario: iniciais[2].dataConclusao});
  // recupera os pedidos já registrados
  const registros = lerListaOperacional("metro-chamados");
  // prepara uma lista sem protocolos ausentes ou repetidos
  const salvos = [];
  for (let i = 0; i < registros.length; i++) {
    // aceita somente pedidos com protocolo identificado
    if (typeof registros[i].protocolo === "string" && registros[i].protocolo !== "") {
      let repetido = false;
      // verifica se o protocolo já foi recuperado
      for (let j = 0; j < salvos.length; j++) {
        if (salvos[j].protocolo === registros[i].protocolo) {
          salvos[j] = registros[i];
          repetido = true;
        }
      }
      // acrescenta somente protocolos que ainda não existem
      if (repetido === false) salvos.push(registros[i]);
    }
  }
  // utiliza os exemplos somente quando não existe uma lista válida
  if (salvos.length === 0) {
    // fixa os exemplos uma vez para que os horários não mudem entre páginas
    localStorage.setItem("metro-chamados", JSON.stringify(iniciais));
    return iniciais;
  }
  // percorre os pedidos para completar o formato das versões anteriores
  for (let i = 0; i < salvos.length; i++) {
    // recupera o pedido salvo
    const chamado = salvos[i];
    // utiliza dados básicos apenas quando faltam informações antigas
    if (!chamado.nome) chamado.nome = "Passageiro";
    if (!chamado.origem) chamado.origem = "Aplicativo Meu Tempo";
    if (!chamado.orgao) chamado.orgao = "metro";
    if (!chamado.linha) chamado.linha = "Linha 2 - Verde";
    if (!chamado.estacao) chamado.estacao = "Consolação";
    if (!chamado.tipo) chamado.tipo = "Apoio ao passageiro";
    if (!chamado.situacao) chamado.situacao = "Pedido recebido";
    if (!chamado.encontro) chamado.encontro = chamado.local || "Ponto de encontro não informado";
    if (!chamado.local) chamado.local = chamado.estacao + " - " + chamado.encontro;
    if (chamado.situacao === "Concluído" && !chamado.dataConclusao) chamado.dataConclusao = "Horário não registrado";
    if (!chamado.credencial) chamado.credencial = "Credencial não informada";
    if (!chamado.horarioSolicitacao) chamado.horarioSolicitacao = "Horário não registrado";
    // preserva a situação anterior sem apresentar horários que não foram registrados
    if (!Array.isArray(chamado.etapas)) {
      chamado.etapas = [{titulo: "Pedido recebido", horario: chamado.horarioSolicitacao}];
      // mantém a conclusão que já estava armazenada
      if (chamado.situacao === "Concluído") {
        chamado.etapas.push({titulo: "Concluído", horario: chamado.dataConclusao || "Horário não registrado"});
      } else if (chamado.situacao !== "Aguardando agente" && chamado.situacao !== "Pedido recebido") {
        // conserva a etapa conhecida sem inventar seu horário
        chamado.etapas.push({titulo: chamado.situacao, horario: "Horário não registrado"});
      }
    }
    // converte o nome antigo da situação pendente
    if (chamado.situacao === "Aguardando agente") chamado.situacao = "Pedido recebido";
    // recupera os dados dos exemplos que já existiam no protótipo
    for (let j = 0; j < iniciais.length; j++) {
      // compara o protocolo sem alterar a situação salva
      if (chamado.protocolo === iniciais[j].protocolo && chamado.nome === "Passageiro") {
        chamado.nome = iniciais[j].nome;
        chamado.encontro = iniciais[j].encontro;
      }
    }
  }
  // verifica se o atendimento histórico inicial já está na lista
  let possuiHistoricoInicial = false;
  // percorre os protocolos para evitar duplicação do histórico
  for (let i = 0; i < salvos.length; i++) {
    // identifica o registro que já era apresentado no histórico
    if (salvos[i].protocolo === "MT-1040") possuiHistoricoInicial = true;
  }
  // preserva o atendimento histórico do protótipo anterior
  if (possuiHistoricoInicial === false) salvos.push(iniciais[2]);
  return salvos;
}
