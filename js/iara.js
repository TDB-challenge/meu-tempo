/*
  conversa real com a iara pelo node-red:
  integracao.js compartilha endereço e sessão, sem chaves de serviços no navegador.
  formulario-chat atende ao botão e ao enter; aviso-chat informa processamento e falhas.
  as sugestões enviam o valor recebido da api sem abrir outras páginas.
  ouvir-mensagem mantém a preferência de leitura separada dos sons da travessia.
*/

// =================================================================
// disponibilidade da iara web
// =================================================================

// prepara os controles existentes para o atendimento do cidadão
function prepararIara() {
  // seleciona o aviso já existente da conversa
  // aviso-chat identifica o texto de processamento e falhas da conexão
  const aviso = document.getElementById('aviso-chat');
  // protege páginas sem a assistente
  if (!aviso) {
    return;
  }
  if (!buscarSessaoIara()) return;
  document.getElementById('campo-mensagem').maxLength = 600;
  document.getElementById('campo-mensagem').disabled = false;
  document.getElementById('enviar-mensagem').disabled = false;
  document.getElementById('sugestoes-iara').textContent = '';
  document.getElementById('mensagens').textContent = '';
  // o submit nativo atende tanto ao botão quanto à tecla enter
  document.getElementById('formulario-chat').addEventListener('submit', function (evento) {
    evento.preventDefault();
    enviarMensagemIara(document.getElementById('campo-mensagem').value);
  });
  enviarMensagemIara('menu', false);
  iniciarNotificacoesIara();
  window.addEventListener('pagehide', pararNotificacoesIara);
  window.addEventListener('pageshow', function (evento) {
    if (evento.persisted) iniciarNotificacoesIara();
  });
  // seleciona o controle de leitura das respostas reais
  const ouvir = document.getElementById('ouvir-mensagem');
  // guarda a escolha de voz sem inventar uma conexão com o serviço
  if (ouvir) {
    ouvir.disabled = false;
    // aria-pressed comunica a preferência ativada aos leitores de tela; o atributo espera um valor textual
    ouvir.setAttribute('aria-pressed', String(buscarPreferenciasAcessibilidade().vozIara));
    ouvir.addEventListener('click', function () {
      // sincroniza a mesma preferência utilizada no cadastro e no perfil
      const preferencias = buscarPreferenciasAcessibilidade();
      preferencias.vozIara = !preferencias.vozIara;
      salvarPreferenciasAcessibilidade(preferencias);
      ouvir.setAttribute('aria-pressed', String(preferencias.vozIara));
      aviso.hidden = false;
      aviso.textContent = preferencias.vozIara ? 'Leitura das respostas ativada.' : 'Leitura das respostas desativada.';
      if (!preferencias.vozIara && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    });
  }
}


// =================================================================
// envio e apresentação da conversa
// =================================================================

let enviandoIara = false;
let ultimaMensagemIara = '';
let instanteMensagemIara = 0;
let temporizadorIara = null;
let consultandoNotificacoesIara = false;
let liberarNotificacoesIara = null;

// texto e autor definem o balão; textcontent impede executar marcação recebida pela api
function adicionarMensagemIara(texto, autor) {
  const mensagens = document.getElementById('mensagens');
  const balao = document.createElement('div');
  balao.className = 'mensagem mensagem-' + autor;
  const paragrafo = document.createElement('p');
  paragrafo.textContent = texto;
  balao.appendChild(paragrafo);
  mensagens.appendChild(balao);
  const conversa = document.getElementById('conversa-iara');
  conversa.scrollTop = conversa.scrollHeight;
}

// resposta contém somente o texto e as opções retornadas pelo node-red
function apresentarRespostaIara(resposta) {
  if (!resposta || typeof resposta.resposta !== 'string' || !resposta.resposta.trim() || !Array.isArray(resposta.opcoes)) throw new Error('Resposta inválida.');
  adicionarMensagemIara(resposta.resposta, 'iara');
  const sugestoes = document.getElementById('sugestoes-iara');
  sugestoes.textContent = '';
  for (let i = 0; i < resposta.opcoes.length; i++) {
    const opcao = resposta.opcoes[i];
    if (!opcao || typeof opcao.rotulo !== 'string' || typeof opcao.valor !== 'string') continue;
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'botao-sugestao';
    botao.textContent = opcao.rotulo;
    // o rótulo é apresentado; o valor original é enviado, inclusive nas perguntas de perfil
    botao.addEventListener('click', function () { return enviarMensagemIara(opcao.valor); });
    sugestoes.appendChild(botao);
  }
  if (buscarPreferenciasAcessibilidade().vozIara && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
    const fala = new SpeechSynthesisUtterance(resposta.resposta);
    fala.lang = 'pt-BR';
    window.speechSynthesis.speak(fala);
  }
}

// bloqueado acompanha a requisição para impedir cliques repetidos e envios simultâneos
function bloquearEnvioIara(bloqueado) {
  document.getElementById('campo-mensagem').disabled = bloqueado;
  document.getElementById('enviar-mensagem').disabled = bloqueado;
  document.getElementById('formulario-chat').setAttribute('aria-busy', String(bloqueado));
  const botoes = document.getElementById('sugestoes-iara').querySelectorAll('button');
  for (let i = 0; i < botoes.length; i++) botoes[i].disabled = bloqueado;
}

// texto é a mensagem ou valor de opção; mostrar diferencia o menu inicial de uma mensagem digitada
async function enviarMensagemIara(texto, mostrar) {
  texto = String(texto || '').trim();
  const sessao = buscarSessaoIara();
  if (!sessao || !texto || texto.length > 600 || enviandoIara) return;
  if (texto === ultimaMensagemIara && Date.now() - instanteMensagemIara < 1000) return;
  enviandoIara = true;
  bloquearEnvioIara(true);
  const campo = document.getElementById('campo-mensagem');
  const aviso = document.getElementById('aviso-chat');
  aviso.hidden = false;
  aviso.textContent = 'IARA está respondendo…';
  if (mostrar !== false) adicionarMensagemIara(texto, 'usuario');
  const consentimento = document.getElementById('autorizar-perfil-iara');
  try {
    const resposta = await consultarApiIara('/api/chat', {
      method: 'POST', body: JSON.stringify(montarMensagemIara(texto, consentimento && consentimento.checked))
    });
    if (buscarSessaoIara() !== sessao) return;
    apresentarRespostaIara(resposta);
    ultimaMensagemIara = texto;
    instanteMensagemIara = Date.now();
    campo.value = '';
    aviso.textContent = '';
    aviso.hidden = true;
  } catch (erro) {
    // não repete automaticamente um post que pode ter sido gravado antes da falha
    aviso.textContent = 'Não foi possível confirmar a resposta. Confira sua conexão e os pedidos antes de reenviar.';
    if (mostrar !== false) campo.value = texto;
  } finally {
    enviandoIara = false;
    bloquearEnvioIara(false);
    campo.focus();
  }
}

// =================================================================
// notificações reais da sessão
// =================================================================

// sessao identifica a caixa consultada; nenhuma notificação é criada a partir de texto livre
async function consultarNotificacoesIara(sessao) {
  if (consultandoNotificacoesIara || enviandoIara || sessao !== buscarSessaoIara()) return;
  consultandoNotificacoesIara = true;
  try {
    const resposta = await consultarApiIara('/api/chat/poll?session=' + encodeURIComponent(sessao));
    if (sessao !== buscarSessaoIara()) return;
    if (!resposta || !Array.isArray(resposta.mensagens)) throw new Error('Notificações inválidas.');
    for (let i = 0; i < resposta.mensagens.length; i++) apresentarRespostaIara(resposta.mensagens[i]);
  } catch (erro) {
    const aviso = document.getElementById('aviso-chat');
    aviso.hidden = false;
    aviso.textContent = 'Não foi possível atualizar as notificações. A consulta será retomada automaticamente.';
  } finally {
    consultandoNotificacoesIara = false;
  }
}

// mantém a trava pelo tempo de vida da página: outras abas não consomem a mesma caixa
function iniciarNotificacoesIara() {
  const sessao = buscarSessaoIara();
  if (!sessao || !navigator.locks || temporizadorIara !== null || liberarNotificacoesIara) return;
  navigator.locks.request('iara-notificacoes-' + sessao, {ifAvailable: true}, async function (trava) {
    if (!trava) {
      // tenta assumir a consulta caso a aba que a possui seja fechada
      temporizadorIara = setInterval(function () { clearInterval(temporizadorIara); temporizadorIara = null; iniciarNotificacoesIara(); }, configuracaoIara.intervalo);
      return;
    }
    await new Promise(function (liberar) {
      liberarNotificacoesIara = liberar;
      consultarNotificacoesIara(sessao);
      temporizadorIara = setInterval(function () { consultarNotificacoesIara(sessao); }, configuracaoIara.intervalo);
    });
  }).catch(function () {
    pararNotificacoesIara();
  });
}

// encerra a consulta e libera a caixa ao sair da conversa
function pararNotificacoesIara() {
  clearInterval(temporizadorIara);
  temporizadorIara = null;
  if (liberarNotificacoesIara) liberarNotificacoesIara();
  liberarNotificacoesIara = null;
}

// apresenta o menu real ao carregar a conversa
prepararIara();
