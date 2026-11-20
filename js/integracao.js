/*
  integração compartilhada com a iara no node-red:
  este arquivo concentra o endereço, as consultas e a adaptação dos registros do sqlite.
  os registros remotos ficam em memória; as simulações locais continuam nas listas existentes.
  nome e perfil do cadastro só acompanham a mensagem após autorização na tela da conversa.
*/

// =================================================================
// configuração e comunicação com a api
// =================================================================

// reúne as opções usadas por todas as telas, para não repetir o endereço em vários arquivos
const configuracaoIara = {
  // 127.0.0.1 indica o computador onde o navegador está aberto; 1880 é a porta do node-red
  enderecoBase: 'http://127.0.0.1:1880',
  // os intervalos recebem milissegundos: 3000 corresponde a três segundos
  intervalo: 3000,
  // a api local atual não usa cookies; mudar somente após configurar autenticação e cors
  credenciais: 'omit',
  // preencher somente depois de criar a rota individual protegida descrita no guia
  rotaPedidosCidadao: ''
};
// lista em memória dos chamados que o painel recebeu; não grava dados de outros cidadãos no navegador
let chamadosAdministrativosIara = [];
// lista separada com os pedidos recebidos pela consulta individual do cidadão
let pedidosIndividuaisIara = [];
// null indica que a lista individual ainda não está relacionada a uma sessão
let sessaoPedidosIara = null;

// caminho identifica a rota; opcoes informa método e corpo, sem chaves de serviços externos
async function consultarApiIara(caminho, opcoes) {
  // abortcontroller permite interromper a espera por uma resposta que está demorando demais
  const controle = new AbortController();
  // settimeout agenda uma única execução; depois de vinte segundos interrompe esta consulta
  const limite = setTimeout(function () { controle.abort(); }, 20000);
  // try reúne as operações que podem falhar por falta de conexão ou resposta inválida
  try {
    // fetch envia a requisição; await aguarda sua resposta sem bloquear o restante da página
    const resposta = await fetch(configuracaoIara.enderecoBase + caminho, {
      // os três pontos copiam as opções recebidas; signal liga esta requisição ao cancelamento acima
      ...opcoes, credentials: configuracaoIara.credenciais, signal: controle.signal,
      // informa que o corpo usa json e preserva cabeçalhos adicionais quando eles forem fornecidos
      headers: {'Content-Type': 'application/json', ...(opcoes && opcoes.headers)}
    });
    // ok é falso para erros http; throw encaminha a falha para quem chamou esta função
    if (!resposta.ok) throw new Error('Falha na comunicação (HTTP ' + resposta.status + ').');
    // json transforma o texto da resposta em objeto ou lista que o javascript consegue consultar
    return await resposta.json();
  // finally executa tanto no sucesso quanto na falha, para não deixar o temporizador pendente
  } finally {
    // cancela o limite de espera porque esta requisição já terminou
    clearTimeout(limite);
  }
}

// mantém uma identificação aleatória por cadastro, sem usar cpf, e-mail ou nome como sessão
function buscarSessaoIara() {
  // reutiliza o cadastro associado à aba atual, em vez de criar outra conta para o chat
  const cidadao = buscarCidadaoConectado();
  // sem cidadão conectado, interrompe a função antes de criar uma identificação de conversa
  if (!cidadao) return null;
  // cada cadastro possui sua própria chave de armazenamento e sua própria conversa
  const chave = 'iara-sessao-' + cidadao.id;
  // getitem recupera a identificação anterior para continuar a mesma conversa ao trocar de página
  let sessao = localStorage.getItem(chave);
  // a expressão regular aceita letras, números, hífen e sublinhado entre dezesseis e sessenta e quatro caracteres
  if (!sessao || !/^[a-zA-Z0-9_-]{16,64}$/.test(sessao)) {
    // randomuuid gera uma identificação aleatória; nenhum documento pessoal é usado como sessão
    sessao = 'web_' + crypto.randomUUID();
    // setitem guarda a identificação para a próxima visita deste mesmo cadastro e navegador
    localStorage.setItem(chave, sessao);
  }
  // devolve a identificação para quem vai enviar uma mensagem ou consultar notificações
  return sessao;
}

// texto é a mensagem digitada; autorizado permite usar somente nome e categoria geral
function montarMensagemIara(texto, autorizado) {
  // corpo é o objeto enviado ao servidor; começa somente com sessão, mensagem e perfil neutro
  const corpo = {session: buscarSessaoIara(), texto: texto, perfil: 'nenhum'};
  const cidadao = buscarCidadaoConectado();
  // o operador && exige as duas condições: autorização e cadastro encontrado
  if (autorizado && cidadao) {
    // acrescenta o nome apenas dentro do bloco de autorização; não copia o cadastro inteiro
    corpo.nome = cidadao.nome;
    // relaciona as categorias do site aos nomes reconhecidos pelo fluxo externo
    const perfis = {idosa: 'idoso', mobilidade: 'mobilidade_reduzida'};
    // não infere um diagnóstico a partir da categoria genérica pcd
    // os colchetes consultam a categoria no objeto; || mantém o perfil neutro quando não existe correspondência
    corpo.perfil = perfis[cidadao.categoria] || 'nenhum';
  }
  // devolve somente os campos permitidos para a mensagem
  return corpo;
}

// =================================================================
// registros confirmados pelo servidor
// =================================================================

// registro contém os campos efetivamente retornados pela consulta do sqlite
function adaptarChamadoIara(registro) {
  // relaciona os tipos do banco aos nomes de serviço já usados pelas telas
  const servicos = {TRAVESSIA: 'travessia', APOIO_METRO: 'metro', ZELADORIA: 'zeladoria'};
  // estas siglas compõem o protocolo exibido ao cidadão e aos profissionais
  const siglas = {TRAVESSIA: 'TR', APOIO_METRO: 'AF', ZELADORIA: 'ZU'};
  // guarda os nomes completos apresentados nas interfaces
  const tipos = {TRAVESSIA: 'Travessia acessível', APOIO_METRO: 'Apoio ferroviário', ZELADORIA: 'Zeladoria urbana'};
  // converte as situações conhecidas em textos legíveis, sem criar uma decisão nova
  const situacoes = {PENDENTE: 'Pedido recebido', APROVADO: 'Aprovado', RECUSADO: 'Recusado', RECUSADA: 'Recusado', ACEITA: 'Aceita pelo controlador', REGISTRADA: 'Registrada'};
  // string garante um texto para conferir a data que veio do banco
  const data = String(registro.data_hora || '');
  // descarta registros sem id positivo, serviço conhecido ou início de data no formato esperado
  if (!Number.isSafeInteger(Number(registro.id)) || Number(registro.id) <= 0 || !servicos[registro.tipo] || !/^\d{4}-\d{2}-\d{2}[ T]/.test(data)) return null;
  // o operador ? escolhe entre duas opções; troca o espaço pela letra t quando a data precisa desse ajuste
  const instante = data.includes('T') ? data : data.replace(' ', 'T');
  // date.parse tenta interpretar a data; se o resultado não for um número válido, ignora o registro
  if (!Number.isFinite(Date.parse(instante))) return null;
  // formata a data para apresentação no padrão brasileiro
  const horario = new Date(instante).toLocaleString('pt-BR');
  // mantém situações desconhecidas como foram recebidas, sem tratá-las como aprovação ou conclusão
  const situacao = situacoes[registro.status] || String(registro.status || 'Não informado');
  // a existência da linha no banco comprova o registro; etapas futuras não são preenchidas automaticamente
  const etapas = [{titulo: 'Registro recebido pelo servidor', horario: horario, instante: instante}];
  // push acrescenta a decisão ao histórico somente quando o banco informou sua data
  if (registro.data_decisao) etapas.push({titulo: situacao, horario: new Date(String(registro.data_decisao).replace(' ', 'T')).toLocaleString('pt-BR')});
  // monta um objeto no formato que os cartões e tabelas existentes já conseguem apresentar
  return {
    // preserva o id original para decisões e identifica que este pedido pertence ao servidor
    idServidor: Number(registro.id), fonte: 'node-red', statusServidor: registro.status,
    // slice recupera o ano; padstart completa ids curtos com zeros para manter o padrão do protocolo
    protocolo: 'MT-' + siglas[registro.tipo] + '-' + data.slice(0,4) + '-' + String(registro.id).padStart(4,'0'),
    servico: servicos[registro.tipo], tipo: tipos[registro.tipo], nome: registro.cidadao || 'Não informado',
    // não atribui uma instituição ferroviária quando esse dado não veio na resposta
    origem: 'IARA / Node-RED', orgao: registro.tipo === 'APOIO_METRO' ? (registro.orgao || '') : 'cet',
    // preserva linha, estação e encontro informados, sem inventar uma linha para uma estação compartilhada
    linha: registro.linha || '', estacao: registro.estacao || '', encontro: registro.ponto_encontro || 'Não informado',
    // escolhe o campo de localização disponível para o tipo de serviço
    local: registro.cruzamento || registro.local_livre || registro.estacao || 'Não informado',
    descricao: registro.descricao || '', situacao: situacao,
    dataSolicitacao: instante, horarioSolicitacao: horario, etapas: etapas,
    credencial: 'Dados documentais não consultados', funcionario: registro.funcionario || '',
    // preserva os tempos do banco; tempo concedido não é convertido em adicional nem em abertura do sinal
    tempoRestante: registro.tempo_restante, tempoConcedido: registro.tempo_concedido
  };
}

// lista é uma resposta da api; cada id do banco ocupa uma única posição
function normalizarChamadosIara(lista) {
  // array.isarray confirma que a resposta pode ser percorrida como uma lista
  if (!Array.isArray(lista)) throw new Error('A API não retornou uma lista de chamados.');
  // prepara uma nova lista, evitando alterar os dados de entrada durante a conferência
  const resultado = [];
  // o laço começa no índice zero e avança um registro por vez até o fim da lista
  for (let i = 0; i < lista.length; i++) {
    // continue pula uma entrada vazia ou inválida e segue para o próximo registro
    if (!lista[i] || typeof lista[i] !== 'object') continue;
    // converte o registro para o formato compartilhado pelas telas
    const pedido = adaptarChamadoIara(lista[i]);
    // ignora um registro que a função de adaptação não conseguiu validar
    if (!pedido) continue;
    // findindex procura um id já incluído; retorna menos um quando ainda não encontrou esse pedido
    const indice = resultado.findIndex(function (item) { return item.idServidor === pedido.idServidor; });
    // inclui o pedido apenas quando seu id ainda não está presente
    if (indice === -1) resultado.push(pedido);
    // se o id já apareceu, substitui seus dados em vez de duplicar a solicitação
    else resultado[indice] = pedido;
  }
  // devolve os registros válidos e sem repetição de id
  return resultado;
}

// tipo limita a consulta ao serviço do painel, mantendo o último resultado em caso de erro
async function consultarChamadosIara(tipo) {
  // acrescenta o filtro somente quando o painel pediu um tipo; encodeuricomponent prepara o valor para a url
  const caminho = '/api/chamados' + (tipo ? '?tipo=' + encodeURIComponent(tipo) : '');
  // aguarda a resposta e confere a lista antes de atualizar o que está em memória
  const lista = normalizarChamadosIara(await consultarApiIara(caminho));
  // só substitui os registros depois do sucesso; uma falha acima conserva a lista anterior
  chamadosAdministrativosIara = lista;
  return lista;
}

// servico seleciona os registros remotos utilizados pelos componentes administrativos existentes
function buscarChamadosIara(servico) {
  // filter cria uma seleção; sem serviço informado, mantém todos os pedidos administrativos recebidos
  return chamadosAdministrativosIara.filter(function (pedido) { return !servico || pedido.servico === servico; });
}

// chamado utiliza o id original; a tela só será atualizada depois da resposta e de uma nova consulta
async function enviarDecisaoIara(chamado, decisao, funcionario) {
  // permite apenas aprovação ou recusa de um chamado ferroviário que veio do servidor
  if (chamado.fonte !== 'node-red' || chamado.servico !== 'metro' || !['APROVADO', 'RECUSADO'].includes(decisao)) throw new Error('Decisão não disponível.');
  // usa o id do banco na rota, sem tentar extrair um id do texto do protocolo
  const resposta = await consultarApiIara('/api/chamados/' + chamado.idServidor + '/decisao', {
    // post envia a alteração; json.stringify transforma os campos da decisão em texto json
    method: 'POST', body: JSON.stringify({decisao: decisao, funcionario: funcionario})
  });
  // confere a confirmação, o id e a situação antes de permitir que a tela trate a decisão como recebida
  if (!resposta || resposta.ok !== true || Number(resposta.id) !== chamado.idServidor || resposta.status !== decisao) throw new Error('O servidor não confirmou a decisão.');
  return resposta;
}

// consulta exclusiva do cidadão; nunca utiliza a listagem administrativa como alternativa
async function consultarPedidosCidadaoIara() {
  const sessao = buscarSessaoIara();
  // ao trocar de cidadão, limpa o resultado anterior antes de qualquer consulta
  if (sessaoPedidosIara !== sessao) {
    pedidosIndividuaisIara = [];
    sessaoPedidosIara = sessao;
  }
  // não faz a consulta enquanto a rota individual não estiver configurada ou não existir cidadão conectado
  if (!configuracaoIara.rotaPedidosCidadao || !sessao) return;
  const resposta = await consultarApiIara(configuracaoIara.rotaPedidosCidadao + '?session=' + encodeURIComponent(sessao));
  // rejeita uma resposta antiga caso o cidadão tenha saído ou trocado de conta
  // uma resposta atrasada não pode ser mostrada para outra conta que entrou enquanto a consulta aguardava
  if (sessao !== buscarSessaoIara()) return;
  // exige que o servidor identifique a sessão consultada e entregue uma lista individual
  if (!resposta || resposta.session !== sessao || !Array.isArray(resposta.chamados)) throw new Error('Consulta individual não confirmada.');
  // guarda apenas a lista individual validada, sem copiar a listagem administrativa
  pedidosIndividuaisIara = normalizarChamadosIara(resposta.chamados);
}

// devolve somente os registros da sessão consultada, sem reaproveitar dados administrativos
function buscarPedidosIndividuaisIara() {
  // se a sessão mudou, devolve uma lista vazia para impedir a exibição de pedidos da conta anterior
  if (sessaoPedidosIara !== buscarSessaoIara()) return [];
  return pedidosIndividuaisIara;
}
