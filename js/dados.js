/*
  dados compartilhados do protótipo:
  este arquivo mantém o catálogo de instituições, os exemplos e as funções de armazenamento.
  cadastro, login, aplicativo e painéis consultam estas mesmas funções para evitar listas duplicadas.

  armazenamento utilizado:
  localstorage conserva cadastros, preferências e pedidos neste navegador entre visitas.
  sessionstorage relaciona a aba à conta conectada, separando cidadão e profissional.
  json converte as listas em texto ao salvar e recupera os objetos ao consultar.

  solicitações administrativas são aprovadas pela coordenação antes de entrar na lista de contas.
  pedidos de transporte usam metro-chamados; travessia e zeladoria usam meu-tempo-pedidos.
  os ciclos da travessia usam horários salvos, permitindo recuperar a contagem sem reiniciá-la.
  nenhum desses dados representa uma conexão com sistemas reais de transporte ou autenticação.
*/

// =================================================================
// funções profissionais
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
// linhas das operadoras
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
// estações das linhas
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
// contas administrativas demonstrativas
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
// solicitações administrativas
// =================================================================

// função que recupera as solicitações cadastradas
// as solicitações persistidas pertencem a esta origem do navegador e não são compartilhadas automaticamente entre dispositivos
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
// solicitacoes é a lista completa a persistir; a serialização json converte os objetos em texto aceito pelo armazenamento
function salvarSolicitacoes(solicitacoes) {
  // transforma a lista em texto e salva no navegador
  localStorage.setItem("admin-solicitacoes", JSON.stringify(solicitacoes));
}

// =================================================================
// aprovação de cadastros
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
// usuários autorizados
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
// dados compartilhados do transporte
// =================================================================

// recupera uma lista local e mantém o painel utilizável se o texto estiver inválido
// chave identifica o registro que será consultado no navegador
// a leitura aceita somente listas; interpretar json válido não garante por si só a validade de cada registro interno
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
// hora e minuto posicionam cada exemplo em relação ao horário de referência, mantendo a diferença entre os chamados
function horarioInicialMetro(hora, minuto) {
  // prepara a data do exemplo
  const data = new Date();
  // calcula a diferença em minutos para manter a ordem dos exemplos
  const minutosAnteriores = 14 * 60 + 40 - (hora * 60 + minuto);
  data.setMinutes(data.getMinutes() - minutosAnteriores);
  // tolocalestring formata a data e a hora segundo a convenção brasileira para apresentação na tela
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

// =================================================================
// cidadãos e solicitações compartilhadas
// =================================================================

// recupera somente os cadastros demonstrativos, sem imagens de documentos
function buscarCidadaos() {
  return lerListaOperacional("meu-tempo-cidadaos");
}

// salva os dados informados na demonstração
// cidadaos representa a lista de cadastros já conferida pelo formulário
// cidadaos contém os cadastros locais; limpar os dados do site também pode remover essa lista
function salvarCidadaos(cidadaos) {
  localStorage.setItem("meu-tempo-cidadaos", JSON.stringify(cidadaos));
}

// procura o cadastro relacionado à sessão do cidadão
// o identificador da sessão é relacionado ao cadastro salvo; o navegador não consulta um serviço de autenticação externo
function buscarCidadaoConectado() {
  // recupera a identificação da sessão sem misturar contas administrativas
  const texto = sessionStorage.getItem("cidadao-sessao");
  if (texto === null) return null;
  try {
    // recupera o identificador e a lista de cadastros
    const sessao = JSON.parse(texto);
    const cidadaos = buscarCidadaos();
    // procura somente o cidadão identificado nesta aba
    for (let i = 0; i < cidadaos.length; i++) {
      if (sessao && cidadaos[i].id === sessao.id) return cidadaos[i];
    }
  } catch (erro) {
    // erro indica uma sessão que não pode ser recuperada
    sessionStorage.removeItem("cidadao-sessao");
  }
  return null;
}

// atualiza um cadastro sem apagar os dados dos demais cidadãos
// cidadao representa os dados que o formulário de perfil permite editar
function salvarDadosCidadao(cidadao) {
  // recupera os cadastros existentes
  const cidadaos = buscarCidadaos();
  // procura o identificador que deve ser atualizado
  for (let i = 0; i < cidadaos.length; i++) {
    if (cidadaos[i].id === cidadao.id) {
      cidadaos[i] = cidadao;
      salvarCidadaos(cidadaos);
      return;
    }
  }
}

// recupera os equipamentos utilizados pelo aplicativo e pelo painel ferroviário
function buscarEquipamentosMetro() {
  // consulta o mesmo registro alterado pelo profissional
  const equipamentos = lerListaOperacional("metro-equipamentos");
  if (equipamentos.length > 0) return equipamentos;
  // mantém somente os equipamentos já apresentados no protótipo
  return [
    {codigo: "EL-01", nome: "Elevador", local: "Mezanino", estacao: "Consolação", orgao: "metro", situacao: "Disponível"},
    {codigo: "ER-02", nome: "Escada rolante", local: "Plataforma", estacao: "Consolação", orgao: "metro", situacao: "Em manutenção"}
  ];
}

// atualiza o mesmo protocolo utilizado no aplicativo e nos painéis
// pedido representa a solicitação que recebeu uma nova etapa
function salvarPedidoCidadao(pedido) {
  // seleciona a chave de acordo com o serviço existente
  let chave = "meu-tempo-pedidos";
  if (pedido.servico === "metro") chave = "metro-chamados";
  // recupera a lista sem alterar os demais protocolos
  const pedidos = lerListaOperacional(chave);
  // procura o protocolo que será atualizado
  for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].protocolo === pedido.protocolo) {
      pedidos[i] = pedido;
      localStorage.setItem(chave, JSON.stringify(pedidos));
      return;
    }
  }
  // acrescenta somente solicitações que ainda não foram registradas
  pedidos.push(pedido);
  localStorage.setItem(chave, JSON.stringify(pedidos));
}

// =================================================================
// protocolos dos serviços
// =================================================================

// gera um número anual por serviço sem modificar protocolos já registrados
// tiposervico identifica travessia, metro ou zeladoria
// o contador é local e não possui uma reserva atômica entre abas; seus números servem à demonstração
function gerarProtocoloPedido(tipoServico) {
  // relaciona o serviço à sigla apresentada ao cidadão
  let sigla = "ZU";
  if (tipoServico === "travessia") sigla = "TR";
  else if (tipoServico === "metro") sigla = "AF";
  // recupera o ano atual e o contador persistido desse serviço
  const ano = new Date().getFullYear();
  const prefixo = "MT-" + sigla + "-" + ano + "-";
  const chave = "meu-tempo-sequencia-" + sigla + "-" + ano;
  let sequencia = Number(localStorage.getItem(chave));
  // ignora somente contadores inválidos, mantendo os registros existentes
  if (!Number.isInteger(sequencia) || sequencia < 0) sequencia = 0;
  // verifica também os protocolos salvos para não reutilizar um número existente
  const listas = [lerListaOperacional("metro-chamados"), lerListaOperacional("meu-tempo-pedidos")];
  for (let i = 0; i < listas.length; i++) {
    for (let j = 0; j < listas[i].length; j++) {
      // compara somente protocolos do mesmo serviço e ano
      const protocolo = listas[i][j].protocolo || "";
      if (protocolo.indexOf(prefixo) === 0) {
        // recupera a sequência final sem mudar o identificador original
        const numero = Number(protocolo.slice(prefixo.length));
        if (Number.isInteger(numero) && numero > sequencia) sequencia = numero;
      }
    }
  }
  // reserva o próximo número mesmo quando o pedido vier a ser cancelado
  sequencia = sequencia + 1;
  localStorage.setItem(chave, String(sequencia));
  return prefixo + String(sequencia).padStart(4, "0");
}

// =================================================================
// controlador compartilhado da travessia simulada
// =================================================================

// consulta um ciclo que existe independentemente de qualquer solicitação
// cruzamento identifica o local; numero permite consultar uma reserva futura
// os horários são calculados no navegador para a simulação e não representam leitura de um controlador de trânsito real
function consultarCicloTravessia(cruzamento, numero) {
  // procura o local no catálogo já utilizado pelo aplicativo
  let indice = -1;
  for (let i = 0; i < cruzamentosMeuTempo.length; i++) {
    if (cruzamentosMeuTempo[i].id === cruzamento) indice = i;
  }
  // impede iniciar controladores para locais desconhecidos ou sem suporte
  if (indice === -1 || !cruzamentosMeuTempo[indice].suporte) return null;
  // define cenários acadêmicos fixos, sem simular medições reais de trânsito
  const cenarios = [
    {nome: "Baixo", espera: 20, base: 20},
    {nome: "Moderado", espera: 25, base: 25},
    {nome: "Alto", espera: 30, base: 30}
  ];
  // distribui os três cenários entre os locais que realmente possuem suporte
  let indiceCenario = 0;
  for (let i = 0; i < indice; i++) {
    if (cruzamentosMeuTempo[i].suporte) indiceCenario = indiceCenario + 1;
  }
  const cenario = cenarios[indiceCenario % cenarios.length];
  const controles = lerListaOperacional("meu-tempo-ciclos");
  let controle = null;
  // procura o horário inicial que será compartilhado entre as páginas
  for (let i = 0; i < controles.length; i++) {
    if (controles[i].cruzamento === cruzamento) controle = controles[i];
  }
  // inicia uma única referência temporal ao consultar o cruzamento pela primeira vez
  if (controle === null) {
    controle = {cruzamento: cruzamento, inicio: Date.now(), reservas: []};
    controles.push(controle);
    localStorage.setItem("meu-tempo-ciclos", JSON.stringify(controles));
  }
  // reserva quinze segundos no ciclo para a extensão e três para cada transição
  const duracao = (cenario.espera + 3 + cenario.base + 15 + 3) * 1000;
  let cicloNumero = Math.floor((Date.now() - controle.inicio) / duracao);
  // permite consultar uma reserva do próximo ciclo sem mudar o relógio do controlador
  if (typeof numero === "number") cicloNumero = numero;
  // recupera o total de extensões já reservado para esse ciclo
  let adicional = 0;
  for (let i = 0; i < controle.reservas.length; i++) {
    if (controle.reservas[i].numero === cicloNumero) adicional = controle.reservas[i].adicional;
  }
  // calcula as fases a partir da referência compartilhada, sem depender de temporizadores
  const inicio = controle.inicio + cicloNumero * duracao;
  const transicao = inicio + cenario.espera * 1000;
  const abertura = transicao + 3000;
  const fim = abertura + (cenario.base + adicional) * 1000;
  const agora = Date.now();
  let estado = "Aguardando abertura";
  // cada instante possui apenas um estado dentro da demonstração
  if (agora >= fim) estado = "Travessia encerrada";
  else if (agora >= fim - 8000) estado = "Tempo próximo do fim";
  else if (agora >= abertura + 1000) estado = "Travessia em andamento";
  else if (agora >= abertura) estado = "Travessia iniciada";
  else if (agora >= transicao) estado = "Fase de segurança";
  return {cruzamento: cruzamento, numero: cicloNumero, cenario: cenario.nome, inicio: inicio, transicao: transicao, abertura: abertura, fim: fim, fimCiclo: inicio + duracao, tempoBase: cenario.base, adicional: adicional, tempoTotal: cenario.base + adicional, estado: estado};
}

// analisa uma solicitação e reserva a extensão no ciclo apropriado
// cruzamento indica o local; adicional contém somente os segundos solicitados
// adicional é medido em segundos; o retorno nulo sinaliza que a solicitação não pôde ser registrada pelas regras locais
function registrarTravessiaSimulada(cruzamento, adicional) {
  // exige sessão e um valor inteiro dentro do limite acadêmico de quinze segundos
  const cidadao = buscarCidadaoConectado();
  if (cidadao === null || !Number.isInteger(adicional) || adicional < 0 || adicional > 15) return null;
  // recupera o controlador automático sem aceitar um horário enviado pelo cidadão
  let ciclo = consultarCicloTravessia(cruzamento);
  if (ciclo === null) return null;
  // impede duas travessias ativas do mesmo cidadão, inclusive em abas diferentes
  const pedidos = buscarPedidosOperacionais();
  for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].servico === "travessia" && pedidos[i].cidadaoId === cidadao.id && !pedidos[i].simulacaoEncerrada) return null;
  }
  // reserva o próximo ciclo quando restam oito segundos ou não há margem para a extensão
  if (ciclo.fim - Date.now() <= 8000 || ciclo.adicional + adicional > 15) {
    ciclo = consultarCicloTravessia(cruzamento, ciclo.numero + 1);
  }
  // informa indisponibilidade quando o próximo ciclo também atingiu o limite
  if (ciclo.adicional + adicional > 15) return null;
  // atualiza apenas a reserva do controlador escolhido
  const controles = lerListaOperacional("meu-tempo-ciclos");
  for (let i = 0; i < controles.length; i++) {
    if (controles[i].cruzamento === cruzamento) {
      // procura a reserva sem duplicar o número do ciclo
      let reserva = null;
      for (let j = 0; j < controles[i].reservas.length; j++) {
        if (controles[i].reservas[j].numero === ciclo.numero) reserva = controles[i].reservas[j];
      }
      // cria a reserva somente quando esse ciclo ainda não recebeu solicitações
      if (reserva === null) {
        reserva = {numero: ciclo.numero, adicional: 0};
        controles[i].reservas.push(reserva);
      }
      reserva.adicional = reserva.adicional + adicional;
    }
  }
  localStorage.setItem("meu-tempo-ciclos", JSON.stringify(controles));
  // recupera o horário atualizado para todos os cidadãos do mesmo ciclo
  ciclo = consultarCicloTravessia(cruzamento, ciclo.numero);
  for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].servico === "travessia" && pedidos[i].cruzamento === cruzamento && pedidos[i].cicloNumero === ciclo.numero && !pedidos[i].simulacaoEncerrada) {
      pedidos[i].fimSimulacao = ciclo.fim;
      pedidos[i].tempoTotalSimulado = ciclo.tempoTotal;
      salvarPedidoCidadao(pedidos[i]);
    }
  }
  // utiliza o nome do catálogo original, sem aceitar texto de um campo oculto
  let local = "";
  for (let i = 0; i < cruzamentosMeuTempo.length; i++) {
    if (cruzamentosMeuTempo[i].id === cruzamento) local = cruzamentosMeuTempo[i].nome;
  }
  // registra o pedido uma única vez com o mesmo protocolo em todos os painéis
  const pedido = registrarPedidoCidadao({servico: "travessia", tipo: "Travessia acessível", orgao: "cet", cruzamento: cruzamento, local: local, cicloNumero: ciclo.numero, cenario: ciclo.cenario, tempoBase: ciclo.tempoBase, tempoAdicionalSolicitado: adicional, tempoAdicionalReservado: adicional, tempoAdicionalConcedido: 0, tempoTotalSimulado: ciclo.tempoTotal, aberturaSimulacao: ciclo.abertura, fimSimulacao: ciclo.fim, simulacaoEncerrada: false});
  // registra a análise automática local, preservando o horário real do pedido
  pedido.situacao = "Aguardando abertura";
  pedido.etapas.push({titulo: "Aguardando abertura", horario: new Date().toLocaleString("pt-BR"), instante: new Date().toISOString()});
  salvarPedidoCidadao(pedido);
  // recupera imediatamente a etapa correspondente se o ciclo já estiver aberto
  const atualizados = buscarPedidosOperacionais();
  for (let i = 0; i < atualizados.length; i++) {
    if (atualizados[i].protocolo === pedido.protocolo) return atualizados[i];
  }
  return pedido;
}

// registra uma solicitação com o cidadão da sessão atual
// pedido contém somente as informações necessárias ao serviço escolhido
function registrarPedidoCidadao(pedido) {
  // identifica quem está enviando a solicitação
  const cidadao = buscarCidadaoConectado();
  if (cidadao === null) return null;
  // cria o protocolo anual apenas no registro de uma nova solicitação
  const data = new Date();
  pedido.protocolo = gerarProtocoloPedido(pedido.servico);
  pedido.cidadaoId = cidadao.id;
  pedido.nome = cidadao.nome;
  pedido.dataSolicitacao = data.toISOString();
  pedido.horarioSolicitacao = data.toLocaleString("pt-BR");
  // inicia o acompanhamento quando o serviço ainda não definiu sua primeira etapa
  if (!pedido.situacao) pedido.situacao = "Pedido recebido";
  if (!Array.isArray(pedido.etapas)) pedido.etapas = [{titulo: "Pedido recebido", horario: pedido.horarioSolicitacao, instante: data.toISOString()}];
  // compartilha somente o resumo documental necessário, sem laudos ou imagens
  if (pedido.servico === "metro") {
    pedido.origem = "Aplicativo Meu Tempo";
    pedido.credencial = "Identificação não conferida";
    if (cidadao.documentos && cidadao.documentos.identificacao) pedido.credencial = "Situação documental: " + cidadao.documentos.identificacao;
  }
  salvarPedidoCidadao(pedido);
  return pedido;
}

// recuperação da simulação ao consultar os pedidos

// recupera os pedidos e concilia somente os horários da demonstração local
function buscarPedidosOperacionais() {
  // consulta a lista compartilhada e o instante atual
  const pedidos = lerListaOperacional("meu-tempo-pedidos");
  const agora = Date.now();
  let alterou = false;
  // percorre os serviços sem interferir em pedidos encerrados pelo cidadão
  for (let i = 0; i < pedidos.length; i++) {
    // identifica somente uma simulação com horários válidos
    const pedido = pedidos[i];
    if (pedido.servico === "travessia" && !pedido.simulacaoEncerrada && pedido.aberturaSimulacao && pedido.fimSimulacao) {
      // relaciona cada etapa ao horário programado na própria simulação
      const momentos = [Math.max(Date.parse(pedido.dataSolicitacao), pedido.aberturaSimulacao - 3000), Math.max(Date.parse(pedido.dataSolicitacao), pedido.aberturaSimulacao), Math.max(Date.parse(pedido.dataSolicitacao), pedido.fimSimulacao - 8000), pedido.fimSimulacao];
      const titulos = ["Fase de segurança", "Travessia liberada na simulação", "Tempo próximo do fim", "Simulação concluída"];
      // prepara o histórico caso um registro antigo ainda não possua etapas
      if (!Array.isArray(pedido.etapas)) pedido.etapas = [];
      // guarda a última etapa alcançada para comparar apenas uma vez
      let situacaoAtual = pedido.situacao;
      // recupera apenas os eventos cujos horários já passaram
      for (let j = 0; j < momentos.length; j++) {
        if (agora >= momentos[j]) {
          // verifica se a etapa já foi registrada pelo contador da página
          let registrada = false;
          for (let k = 0; k < pedido.etapas.length; k++) {
            if (pedido.etapas[k].titulo === titulos[j]) registrada = true;
          }
          // acrescenta o horário programado sem duplicar etapas existentes
          if (!registrada) {
            const data = new Date(momentos[j]);
            pedido.etapas.push({titulo: titulos[j], horario: data.toLocaleString("pt-BR"), instante: data.toISOString()});
            alterou = true;
          }
          // atualiza a situação para a última etapa realmente alcançada
          situacaoAtual = titulos[j];
        }
      }
      // salva a situação somente quando uma nova etapa foi alcançada
      if (pedido.situacao !== situacaoAtual) {
        pedido.situacao = situacaoAtual;
        alterou = true;
      }
      // confirma a extensão somente quando a fase de pedestres realmente começa na simulação
      if (agora >= pedido.aberturaSimulacao && pedido.tempoAdicionalReservado !== undefined && pedido.tempoAdicionalConcedido !== pedido.tempoAdicionalReservado) {
        pedido.tempoAdicionalConcedido = pedido.tempoAdicionalReservado;
        alterou = true;
      }
      // encerra a demonstração mesmo quando a página da contagem foi fechada
      if (agora >= pedido.fimSimulacao) {
        pedido.simulacaoEncerrada = true;
        pedido.dataConclusao = new Date(pedido.fimSimulacao).toLocaleString("pt-BR");
        alterou = true;
      }
    }
  }
  // evita escritas e eventos de armazenamento quando nada mudou
  if (alterou) localStorage.setItem("meu-tempo-pedidos", JSON.stringify(pedidos));
  return pedidos;
}

// reúne somente as solicitações do cidadão conectado
// a seleção usa o cidadão da sessão atual para apresentar os pedidos associados ao seu cadastro demonstrativo
function buscarPedidosCidadao() {
  // recupera a sessão e inicia a lista de resultados
  const cidadao = buscarCidadaoConectado();
  const resultado = [];
  if (cidadao === null) return resultado;
  // consulta as duas listas já utilizadas pelas áreas da plataforma
  const listas = [lerListaOperacional("metro-chamados"), buscarPedidosOperacionais()];
  // percorre os serviços sem criar cópias de um mesmo atendimento
  for (let i = 0; i < listas.length; i++) {
    for (let j = 0; j < listas[i].length; j++) {
      if (listas[i][j].cidadaoId === cidadao.id) resultado.push(listas[i][j]);
    }
  }
  // ordena os registros pela data, sem alterar seus identificadores ou o armazenamento
  for (let i = 0; i < resultado.length; i++) {
    for (let j = i + 1; j < resultado.length; j++) {
      if (Date.parse(resultado[j].dataSolicitacao) > Date.parse(resultado[i].dataSolicitacao)) {
        // troca somente a posição dos dois registros na lista apresentada
        const anterior = resultado[i];
        resultado[i] = resultado[j];
        resultado[j] = anterior;
      }
    }
  }
  return resultado;
}

// guarda os cruzamentos e o suporte da proposta que já estavam no aplicativo
const cruzamentosMeuTempo = [
  {
    "id": "paulista-augusta",
    "nome": "Av. Paulista × Rua Augusta",
    "suporte": true
  },
  {
    "id": "paulista-consolacao",
    "nome": "Av. Paulista × Rua da Consolação",
    "suporte": false
  },
  {
    "id": "paulista-pamplona",
    "nome": "Av. Paulista × Rua Pamplona",
    "suporte": false
  },
  {
    "id": "paulista-campinas",
    "nome": "Av. Paulista × Alameda Campinas",
    "suporte": true
  },
  {
    "id": "paulista-brigadeiro",
    "nome": "Av. Paulista × Av. Brigadeiro Luís Antônio",
    "suporte": true
  }
];
