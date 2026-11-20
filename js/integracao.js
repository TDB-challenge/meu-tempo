/*
  integração compartilhada com a iara no node-red:
  este arquivo concentra o endereço, as consultas e a adaptação dos registros do sqlite.
  os registros remotos ficam em memória; as simulações locais continuam nas listas existentes.
  nome e perfil do cadastro só acompanham a mensagem após autorização na tela da conversa.
*/

// =================================================================
// configuração e comunicação com a api
// =================================================================

const configuracaoIara = {
  enderecoBase: 'http://127.0.0.1:1880',
  intervalo: 3000,
  // a api local atual não usa cookies; mudar somente após configurar autenticação e cors
  credenciais: 'omit',
  // preencher somente depois de criar a rota individual protegida descrita no guia
  rotaPedidosCidadao: ''
};
let chamadosAdministrativosIara = [];
let pedidosIndividuaisIara = [];
let sessaoPedidosIara = null;

// caminho identifica a rota; opcoes informa método e corpo, sem chaves de serviços externos
async function consultarApiIara(caminho, opcoes) {
  const controle = new AbortController();
  const limite = setTimeout(function () { controle.abort(); }, 20000);
  try {
    const resposta = await fetch(configuracaoIara.enderecoBase + caminho, {
      ...opcoes, credentials: configuracaoIara.credenciais, signal: controle.signal,
      headers: {'Content-Type': 'application/json', ...(opcoes && opcoes.headers)}
    });
    if (!resposta.ok) throw new Error('Falha na comunicação (HTTP ' + resposta.status + ').');
    return await resposta.json();
  } finally {
    clearTimeout(limite);
  }
}

// mantém uma identificação aleatória por cadastro, sem usar cpf, e-mail ou nome como sessão
function buscarSessaoIara() {
  const cidadao = buscarCidadaoConectado();
  if (!cidadao) return null;
  const chave = 'iara-sessao-' + cidadao.id;
  let sessao = localStorage.getItem(chave);
  if (!sessao || !/^[a-zA-Z0-9_-]{16,64}$/.test(sessao)) {
    sessao = 'web_' + crypto.randomUUID();
    localStorage.setItem(chave, sessao);
  }
  return sessao;
}

// texto é a mensagem digitada; autorizado permite usar somente nome e categoria geral
function montarMensagemIara(texto, autorizado) {
  const corpo = {session: buscarSessaoIara(), texto: texto, perfil: 'nenhum'};
  const cidadao = buscarCidadaoConectado();
  if (autorizado && cidadao) {
    corpo.nome = cidadao.nome;
    const perfis = {idosa: 'idoso', mobilidade: 'mobilidade_reduzida'};
    // não infere um diagnóstico a partir da categoria genérica pcd
    corpo.perfil = perfis[cidadao.categoria] || 'nenhum';
  }
  return corpo;
}

// =================================================================
// registros confirmados pelo servidor
// =================================================================

// registro contém os campos efetivamente retornados pela consulta do sqlite
function adaptarChamadoIara(registro) {
  const servicos = {TRAVESSIA: 'travessia', APOIO_METRO: 'metro', ZELADORIA: 'zeladoria'};
  const siglas = {TRAVESSIA: 'TR', APOIO_METRO: 'AF', ZELADORIA: 'ZU'};
  const tipos = {TRAVESSIA: 'Travessia acessível', APOIO_METRO: 'Apoio ferroviário', ZELADORIA: 'Zeladoria urbana'};
  const situacoes = {PENDENTE: 'Pedido recebido', APROVADO: 'Aprovado', RECUSADO: 'Recusado', RECUSADA: 'Recusado', ACEITA: 'Aceita pelo controlador', REGISTRADA: 'Registrada'};
  const data = String(registro.data_hora || '');
  if (!Number.isSafeInteger(Number(registro.id)) || Number(registro.id) <= 0 || !servicos[registro.tipo] || !/^\d{4}-\d{2}-\d{2}[ T]/.test(data)) return null;
  const instante = data.includes('T') ? data : data.replace(' ', 'T');
  if (!Number.isFinite(Date.parse(instante))) return null;
  const horario = new Date(instante).toLocaleString('pt-BR');
  const situacao = situacoes[registro.status] || String(registro.status || 'Não informado');
  const etapas = [{titulo: 'Registro recebido pelo servidor', horario: horario, instante: instante}];
  if (registro.data_decisao) etapas.push({titulo: situacao, horario: new Date(String(registro.data_decisao).replace(' ', 'T')).toLocaleString('pt-BR')});
  return {
    idServidor: Number(registro.id), fonte: 'node-red', statusServidor: registro.status,
    protocolo: 'MT-' + siglas[registro.tipo] + '-' + data.slice(0,4) + '-' + String(registro.id).padStart(4,'0'),
    servico: servicos[registro.tipo], tipo: tipos[registro.tipo], nome: registro.cidadao || 'Não informado',
    origem: 'IARA / Node-RED', orgao: registro.tipo === 'APOIO_METRO' ? (registro.orgao || '') : 'cet',
    linha: registro.linha || '', estacao: registro.estacao || '', encontro: registro.ponto_encontro || 'Não informado',
    local: registro.cruzamento || registro.local_livre || registro.estacao || 'Não informado',
    descricao: registro.descricao || '', situacao: situacao,
    dataSolicitacao: instante, horarioSolicitacao: horario, etapas: etapas,
    credencial: 'Dados documentais não consultados', funcionario: registro.funcionario || '',
    tempoRestante: registro.tempo_restante, tempoConcedido: registro.tempo_concedido
  };
}

// lista é uma resposta da api; cada id do banco ocupa uma única posição
function normalizarChamadosIara(lista) {
  if (!Array.isArray(lista)) throw new Error('A API não retornou uma lista de chamados.');
  const resultado = [];
  for (let i = 0; i < lista.length; i++) {
    if (!lista[i] || typeof lista[i] !== 'object') continue;
    const pedido = adaptarChamadoIara(lista[i]);
    if (!pedido) continue;
    const indice = resultado.findIndex(function (item) { return item.idServidor === pedido.idServidor; });
    if (indice === -1) resultado.push(pedido);
    else resultado[indice] = pedido;
  }
  return resultado;
}

// tipo limita a consulta ao serviço do painel, mantendo o último resultado em caso de erro
async function consultarChamadosIara(tipo) {
  const caminho = '/api/chamados' + (tipo ? '?tipo=' + encodeURIComponent(tipo) : '');
  const lista = normalizarChamadosIara(await consultarApiIara(caminho));
  chamadosAdministrativosIara = lista;
  return lista;
}

// servico seleciona os registros remotos utilizados pelos componentes administrativos existentes
function buscarChamadosIara(servico) {
  return chamadosAdministrativosIara.filter(function (pedido) { return !servico || pedido.servico === servico; });
}

// chamado utiliza o id original; a tela só será atualizada depois da resposta e de uma nova consulta
async function enviarDecisaoIara(chamado, decisao, funcionario) {
  if (chamado.fonte !== 'node-red' || chamado.servico !== 'metro' || !['APROVADO', 'RECUSADO'].includes(decisao)) throw new Error('Decisão não disponível.');
  const resposta = await consultarApiIara('/api/chamados/' + chamado.idServidor + '/decisao', {
    method: 'POST', body: JSON.stringify({decisao: decisao, funcionario: funcionario})
  });
  if (!resposta || resposta.ok !== true || Number(resposta.id) !== chamado.idServidor || resposta.status !== decisao) throw new Error('O servidor não confirmou a decisão.');
  return resposta;
}

// consulta exclusiva do cidadão; nunca utiliza a listagem administrativa como alternativa
async function consultarPedidosCidadaoIara() {
  const sessao = buscarSessaoIara();
  if (sessaoPedidosIara !== sessao) {
    pedidosIndividuaisIara = [];
    sessaoPedidosIara = sessao;
  }
  if (!configuracaoIara.rotaPedidosCidadao || !sessao) return;
  const resposta = await consultarApiIara(configuracaoIara.rotaPedidosCidadao + '?session=' + encodeURIComponent(sessao));
  // rejeita uma resposta antiga caso o cidadão tenha saído ou trocado de conta
  if (sessao !== buscarSessaoIara()) return;
  if (!resposta || resposta.session !== sessao || !Array.isArray(resposta.chamados)) throw new Error('Consulta individual não confirmada.');
  pedidosIndividuaisIara = normalizarChamadosIara(resposta.chamados);
}

// devolve somente os registros da sessão consultada, sem reaproveitar dados administrativos
function buscarPedidosIndividuaisIara() {
  if (sessaoPedidosIara !== buscarSessaoIara()) return [];
  return pedidosIndividuaisIara;
}
