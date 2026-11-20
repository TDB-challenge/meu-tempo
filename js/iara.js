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
  // interrompe a preparação quando não existe cidadão identificado para esta conversa
  if (!buscarSessaoIara()) return;
  // limita o texto ao tamanho aceito pelo fluxo do node-red
  document.getElementById('campo-mensagem').maxLength = 600;
  // disabled falso libera o campo que estava desativado antes de conectar o atendimento
  document.getElementById('campo-mensagem').disabled = false;
  document.getElementById('enviar-mensagem').disabled = false;
  // remove as sugestões anteriores; as próximas serão criadas com o retorno real da api
  document.getElementById('sugestoes-iara').textContent = '';
  document.getElementById('mensagens').textContent = '';
  // o submit nativo atende tanto ao botão quanto à tecla enter
  document.getElementById('formulario-chat').addEventListener('submit', function (evento) {
    // impede que o envio normal do formulário recarregue a página e interrompa a conversa
    evento.preventDefault();
    enviarMensagemIara(document.getElementById('campo-mensagem').value);
  });
  // solicita o menu ao servidor; false evita apresentar essa mensagem inicial como se tivesse sido digitada
  enviarMensagemIara('menu', false);
  iniciarNotificacoesIara();
  // pagehide avisa quando a pessoa está saindo desta página, para encerrar a consulta da caixa
  window.addEventListener('pagehide', pararNotificacoesIara);
  window.addEventListener('pageshow', function (evento) {
    // persisted indica retorno pelo histórico com a página em cache; nesse caso, retoma a consulta
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

// esta marca impede iniciar outro envio enquanto a resposta anterior ainda não chegou
let enviandoIara = false;
// guarda o último texto enviado com sucesso para identificar repetições muito rápidas
let ultimaMensagemIara = '';
// guarda o instante desse sucesso em milissegundos, para comparar o intervalo entre envios
let instanteMensagemIara = 0;
// guarda o identificador do intervalo, permitindo cancelá-lo ao sair da página
let temporizadorIara = null;
// evita sobrepor duas consultas de notificações dentro da mesma aba
let consultandoNotificacoesIara = false;
// guardará a função que libera a vez desta aba consultar a sessão
let liberarNotificacoesIara = null;

// texto e autor definem o balão; textcontent impede executar marcação recebida pela api
function adicionarMensagemIara(texto, autor) {
  const mensagens = document.getElementById('mensagens');
  // createelement monta o elemento em memória; ele só aparece depois de ser inserido na página
  const balao = document.createElement('div');
  // reutiliza a classe visual do projeto e diferencia quem enviou a mensagem
  balao.className = 'mensagem mensagem-' + autor;
  const paragrafo = document.createElement('p');
  // textcontent apresenta o conteúdo como texto, sem executar tags ou códigos recebidos
  paragrafo.textContent = texto;
  balao.appendChild(paragrafo);
  // appendchild coloca o novo balão depois das mensagens que já estão na conversa
  mensagens.appendChild(balao);
  const conversa = document.getElementById('conversa-iara');
  // move a rolagem até o final para deixar a mensagem mais recente visível
  conversa.scrollTop = conversa.scrollHeight;
}

// resposta contém somente o texto e as opções retornadas pelo node-red
function apresentarRespostaIara(resposta) {
  // confere mensagem e lista de opções antes de alterar a conversa; uma resposta incompleta é tratada como falha
  if (!resposta || typeof resposta.resposta !== 'string' || !resposta.resposta.trim() || !Array.isArray(resposta.opcoes)) throw new Error('Resposta inválida.');
  adicionarMensagemIara(resposta.resposta, 'iara');
  // seleciona o mesmo espaço de sugestões usado pelo layout existente
  const sugestoes = document.getElementById('sugestoes-iara');
  // limpa opções antigas porque elas podem não corresponder à pergunta atual da assistente
  sugestoes.textContent = '';
  // percorre cada opção devolvida pelo servidor para montar seu botão
  for (let i = 0; i < resposta.opcoes.length; i++) {
    const opcao = resposta.opcoes[i];
    // ignora opções sem texto ou valor válido, mantendo as demais disponíveis
    if (!opcao || typeof opcao.rotulo !== 'string' || typeof opcao.valor !== 'string') continue;
    const botao = document.createElement('button');
    // button evita que clicar na sugestão dispare o envio nativo de outro formulário
    botao.type = 'button';
    botao.className = 'botao-sugestao';
    botao.textContent = opcao.rotulo;
    // o rótulo é apresentado; o valor original é enviado, inclusive nas perguntas de perfil
    botao.addEventListener('click', function () { return enviarMensagemIara(opcao.valor); });
    sugestoes.appendChild(botao);
  }
  // só faz a leitura quando a preferência está ativada e o navegador oferece síntese de voz
  if (buscarPreferenciasAcessibilidade().vozIara && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
    // cria a fala a partir da resposta recebida; esse recurso lê texto e não grava o microfone
    const fala = new SpeechSynthesisUtterance(resposta.resposta);
    fala.lang = 'pt-BR';
    window.speechSynthesis.speak(fala);
  }
}

// bloqueado acompanha a requisição para impedir cliques repetidos e envios simultâneos
function bloquearEnvioIara(bloqueado) {
  document.getElementById('campo-mensagem').disabled = bloqueado;
  document.getElementById('enviar-mensagem').disabled = bloqueado;
  // aria-busy informa aos recursos de acessibilidade que o formulário está aguardando uma resposta
  document.getElementById('formulario-chat').setAttribute('aria-busy', String(bloqueado));
  const botoes = document.getElementById('sugestoes-iara').querySelectorAll('button');
  for (let i = 0; i < botoes.length; i++) botoes[i].disabled = bloqueado;
}

// texto é a mensagem ou valor de opção; mostrar diferencia o menu inicial de uma mensagem digitada
async function enviarMensagemIara(texto, mostrar) {
  // transforma a entrada em texto e remove espaços nas extremidades antes da validação
  texto = String(texto || '').trim();
  const sessao = buscarSessaoIara();
  // interrompe envios sem sessão, vazios, grandes demais ou iniciados durante outra requisição
  if (!sessao || !texto || texto.length > 600 || enviandoIara) return;
  // impede reenviar o mesmo texto durante o segundo seguinte ao sucesso anterior
  if (texto === ultimaMensagemIara && Date.now() - instanteMensagemIara < 1000) return;
  // marca o envio como iniciado antes de aguardar a rede, bloqueando cliques repetidos
  enviandoIara = true;
  // desativa campo, botão de envio e opções enquanto o servidor processa a mensagem
  bloquearEnvioIara(true);
  const campo = document.getElementById('campo-mensagem');
  const aviso = document.getElementById('aviso-chat');
  aviso.hidden = false;
  aviso.textContent = 'IARA está respondendo…';
  // mostra o balão do cidadão em mensagens comuns; o menu inicial não precisa desse balão
  if (mostrar !== false) adicionarMensagemIara(texto, 'usuario');
  // consulta o controle opcional que autoriza o uso de nome e categoria, sem copiar documentos
  const consentimento = document.getElementById('autorizar-perfil-iara');
  try {
    const resposta = await consultarApiIara('/api/chat', {
      // monta apenas os campos autorizados e os transforma em texto json para enviar ao chatbot
      method: 'POST', body: JSON.stringify(montarMensagemIara(texto, consentimento && consentimento.checked))
    });
    // descarta uma resposta antiga se a conta conectada mudou durante a espera
    if (buscarSessaoIara() !== sessao) return;
    apresentarRespostaIara(resposta);
    // a repetição rápida só é bloqueada após uma resposta válida; uma falha ainda permite tentar novamente
    ultimaMensagemIara = texto;
    instanteMensagemIara = Date.now();
    campo.value = '';
    aviso.textContent = '';
    aviso.hidden = true;
  } catch (erro) {
    // não repete automaticamente um post que pode ter sido gravado antes da falha
    aviso.textContent = 'Não foi possível confirmar a resposta. Confira sua conexão e os pedidos antes de reenviar.';
    // devolve a mensagem ao campo quando a requisição falha para que a pessoa não precise digitar tudo de novo
    if (mostrar !== false) campo.value = texto;
  // executa esta parte no sucesso ou na falha para nunca deixar os controles bloqueados
  } finally {
    // marca a requisição como encerrada, permitindo a próxima mensagem
    enviandoIara = false;
    bloquearEnvioIara(false);
    // devolve o foco ao campo para continuar a conversa pelo teclado
    campo.focus();
  }
}

// =================================================================
// notificações reais da sessão
// =================================================================

// sessao identifica a caixa consultada; nenhuma notificação é criada a partir de texto livre
async function consultarNotificacoesIara(sessao) {
  // aguarda uma consulta ou envio em andamento e impede consultar a caixa de outra conta
  if (consultandoNotificacoesIara || enviandoIara || sessao !== buscarSessaoIara()) return;
  consultandoNotificacoesIara = true;
  try {
    // consulta a caixa desta sessão; encodeuricomponent prepara sua identificação para o endereço
    const resposta = await consultarApiIara('/api/chat/poll?session=' + encodeURIComponent(sessao));
    if (sessao !== buscarSessaoIara()) return;
    if (!resposta || !Array.isArray(resposta.mensagens)) throw new Error('Notificações inválidas.');
    // apresenta cada notificação que o servidor efetivamente devolveu, usando os mesmos balões da conversa
    for (let i = 0; i < resposta.mensagens.length; i++) apresentarRespostaIara(resposta.mensagens[i]);
  } catch (erro) {
    const aviso = document.getElementById('aviso-chat');
    aviso.hidden = false;
    aviso.textContent = 'Não foi possível atualizar as notificações. A consulta será retomada automaticamente.';
  } finally {
    // libera outra consulta mesmo quando a comunicação falhou
    consultandoNotificacoesIara = false;
  }
}

// mantém a trava pelo tempo de vida da página: outras abas não consomem a mesma caixa
function iniciarNotificacoesIara() {
  const sessao = buscarSessaoIara();
  // exige sessão e suporte a travas entre abas, e evita criar outro intervalo se a consulta já foi iniciada
  if (!sessao || !navigator.locks || temporizadorIara !== null || liberarNotificacoesIara) return;
  // web locks dá a vez para uma única aba por sessão; ifavailable não deixa as outras esperando com uma requisição presa
  navigator.locks.request('iara-notificacoes-' + sessao, {ifAvailable: true}, async function (trava) {
    // sem a trava, outra aba já está consultando; esta não deve consumir as mesmas notificações
    if (!trava) {
      // tenta assumir a consulta caso a aba que a possui seja fechada
      // espera três segundos para tentar assumir a vez; cancela esse intervalo antes de iniciar uma nova tentativa
      temporizadorIara = setInterval(function () { clearInterval(temporizadorIara); temporizadorIara = null; iniciarNotificacoesIara(); }, configuracaoIara.intervalo);
      return;
    }
    // a promise fica pendente para manter a trava enquanto a página está aberta; a função liberar encerra essa espera
    await new Promise(function (liberar) {
      // guarda a função de liberação para ser chamada ao sair da conversa
      liberarNotificacoesIara = liberar;
      // faz a primeira consulta sem esperar pelo primeiro intervalo de três segundos
      consultarNotificacoesIara(sessao);
      // setinterval repete a consulta a cada três segundos enquanto esta aba possui a vez
      temporizadorIara = setInterval(function () { consultarNotificacoesIara(sessao); }, configuracaoIara.intervalo);
    });
  }).catch(function () {
    pararNotificacoesIara();
  });
}

// encerra a consulta e libera a caixa ao sair da conversa
function pararNotificacoesIara() {
  // cancela a repetição automática, impedindo consultas de uma página que está sendo fechada
  clearInterval(temporizadorIara);
  temporizadorIara = null;
  // se esta aba possuía a trava, encerra a promise para outra aba poder assumir a consulta
  if (liberarNotificacoesIara) liberarNotificacoesIara();
  liberarNotificacoesIara = null;
}

// apresenta o menu real ao carregar a conversa
prepararIara();
