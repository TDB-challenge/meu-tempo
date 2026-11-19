// =================================================================
// SESSÃO E PERFIL
// =================================================================

// recupera o cadastro associado à sessão cidadã
const cidadaoApp = buscarCidadaoConectado();
// guarda o único intervalo da travessia
let temporizadorTravessia = null;
// guarda a simulação atualmente ativa
let pedidoTravessia = null;

// altera texto somente quando o elemento existe
// id indica o elemento e texto indica o conteúdo apresentado
function textoApp(id, texto) {
  // seleciona o elemento da página atual
  const elemento = document.getElementById(id);
  // protege páginas que não possuem esse elemento
  if (elemento) {
    elemento.textContent = texto;
  }
}

// prepara os controles compartilhados com sessão válida
function iniciarApp() {
  // exige login do cidadão antes de acessar o aplicativo
  if (!cidadaoApp) {
    window.location.replace('../login.html');
    return;
  }
  // divide o nome para formar a saudação
  const partes = cidadaoApp.nome.trim().split(' ');
  // começa pela primeira inicial
  let iniciais = partes[0].charAt(0);
  // acrescenta a inicial do sobrenome quando existir
  if (partes.length > 1) {
    iniciais = iniciais + partes[partes.length - 1].charAt(0);
  }
  textoApp('usuario-nome', cidadaoApp.nome);
  textoApp('perfil-nome', cidadaoApp.nome);
  textoApp('usuario-primeiro-nome', partes[0]);
  textoApp('usuario-iniciais', iniciais.toUpperCase());
  textoApp('perfil-iniciais', iniciais.toUpperCase());
  textoApp('data-atual', new Date().toLocaleDateString('pt-BR', {day: 'numeric', month: 'long', year: 'numeric'}));
  textoApp('usuario-localizacao', cidadaoApp.bairro + ' — ' + cidadaoApp.municipio);
  // seleciona a saída exclusiva do cidadão
  const sair = document.getElementById('sair-app');
  // remove somente a sessão cidadã no clique
  if (sair) {
    sair.addEventListener('click', function () {
      sessionStorage.removeItem('cidadao-sessao');
    });
  }
  // seleciona a edição da localização declarada
  const local = document.getElementById('alterar-localizacao');
  // encaminha o cidadão para editar seu endereço
  if (local) {
    local.addEventListener('click', function () {
      window.location.href = 'perfil.html#formulario-perfil';
    });
  }
  // revalida a sessão quando o navegador restaura uma tela após o logout
  window.addEventListener('pageshow', function (evento) {
    if (evento.persisted && buscarCidadaoConectado() === null) window.location.replace('../login.html');
  });
  prepararPerfil();
  prepararMetro();
  prepararZeladoria();
  prepararTravessia();
  prepararPedidos();
}

// preenche os dados do cadastro sem alterar identidade e nascimento
function prepararPerfil() {
  // seleciona o formulário de perfil
  const formulario = document.getElementById('formulario-perfil');
  // ignora páginas sem o formulário
  if (!formulario) {
    return;
  }
  document.getElementById('nome-completo').value = cidadaoApp.nome;
  document.getElementById('data-nascimento').value = cidadaoApp.nascimento;
  document.getElementById('telefone-perfil').value = cidadaoApp.telefone || '';
  document.getElementById('municipio-perfil').value = cidadaoApp.municipio || '';
  document.getElementById('bairro-perfil').value = cidadaoApp.bairro || '';
  // recupera identidade, contato e localização sem liberar edição documental
  document.getElementById('tipo-documento-perfil').value = cidadaoApp.tipoDocumento || '';
  document.getElementById('cpf-perfil').value = cidadaoApp.cpf || '';
  document.getElementById('rg-perfil').value = cidadaoApp.rg || '';
  document.getElementById('rg-perfil').disabled = cidadaoApp.tipoDocumento === 'cin';
  document.getElementById('email-perfil').value = cidadaoApp.email || '';
  document.getElementById('estado-perfil').value = cidadaoApp.estado || '';
  // apresenta a categoria pelo nome completo
  const categorias = {geral: 'Demais cidadãos', idosa: 'Pessoa idosa', pcd: 'Pessoa com deficiência', mobilidade: 'Pessoa com mobilidade reduzida', temporaria: 'Necessidade temporária de apoio'};
  document.getElementById('categoria-perfil').value = categorias[cidadaoApp.categoria] || 'Não informada';
  textoApp('status-documento', 'Identificação: dados antigos sem conferência de formato registrada.');
  // apresenta os registros existentes sem alegar autenticação externa
  if (cidadaoApp.documentos) {
    // não apresenta complemento quando ele não foi enviado ou não se aplica
    let situacao = 'Identificação: ' + estadoDocumento(cidadaoApp.documentos.identificacao) + '.';
    // informa separadamente quando os dados vieram de leitura automática
    if (cidadaoApp.documentos.leitura === 'Dados extraídos por OCR') {
      situacao = situacao + ' Dados extraídos por OCR e revisados no cadastro.';
    }
    // diferencia registro complementar de conferência de identificação
    if (cidadaoApp.categoria === 'pcd' && cidadaoApp.documentos.complementar && cidadaoApp.documentos.complementar !== 'Não informado') {
      situacao = situacao + ' Complementar: ' + estadoDocumento(cidadaoApp.documentos.complementar) + '.';
    }
    textoApp('status-documento', situacao);
  }
  // reúne escolhas editáveis do perfil
  const escolhas = formulario.querySelectorAll('input[type="checkbox"]');
  // marca escolhas previamente salvas no cadastro
  for (let i = 0; i < escolhas.length; i = i + 1) {
    // recupera as necessidades por padrão
    let valores = cidadaoApp.necessidades || [];
    // utiliza serviços para o grupo correspondente
    if (escolhas[i].name === 'servico-perfil') {
      valores = cidadaoApp.servicos || [];
    }
    // compara cada valor salvo com o controle
    for (let j = 0; j < valores.length; j = j + 1) {
      if (valores[j] === escolhas[i].value) {
        escolhas[i].checked = true;
      }
    }
  }
  // salva após envio explícito do formulário
  formulario.addEventListener('submit', salvarPerfilApp);
  // restaura o mesmo conjunto de preferências utilizado pelo modal global
  document.getElementById('restaurar-preferencias').addEventListener('click', function () {
    salvarPreferenciasAcessibilidade(preferenciasIniciaisAcessibilidade());
  });
}

// descreve o estado declarado pelo leitor
// documento representa o registro armazenado no cadastro
function estadoDocumento(documento) {
  // informa quando nenhum documento foi registrado
  if (!documento) {
    return 'não informado';
  }
  // utiliza o estado textual salvo no cadastro atual
  if (typeof documento === 'string') {
    return documento;
  }
  // preserva o estado registrado pelo leitor
  if (documento.status) {
    return documento.status;
  }
  return 'registrado pelo cidadão';
}

// recolhe escolhas sem apagar valores de cadastro sem controle equivalente
// nome indica o grupo e anteriores indica as escolhas já salvas
function escolhasPerfil(nome, anteriores) {
  // seleciona os controles do grupo
  const controles = document.querySelectorAll('input[name="' + nome + '"]');
  // reúne as escolhas que serão armazenadas
  const valores = [];
  // preserva escolhas anteriores que não aparecem neste formulário
  for (let i = 0; i < anteriores.length; i = i + 1) {
    // indica se a escolha possui controle editável
    let encontrado = false;
    // procura o controle equivalente
    for (let j = 0; j < controles.length; j = j + 1) {
      if (controles[j].value === anteriores[i]) {
        encontrado = true;
      }
    }
    if (!encontrado) {
      valores.push(anteriores[i]);
    }
  }
  // acrescenta somente os controles marcados
  for (let i = 0; i < controles.length; i = i + 1) {
    if (controles[i].checked) {
      valores.push(controles[i].value);
    }
  }
  return valores;
}

// salva contato, localização e escolhas individuais
// evento representa o envio do formulário
function salvarPerfilApp(evento) {
  evento.preventDefault();
  // valida campos obrigatórios antes de salvar
  if (!evento.currentTarget.reportValidity()) {
    return;
  }
  // preserva eventuais documentos conferidos após a abertura desta página
  const atualizado = buscarCidadaoConectado();
  // impede salvar sem sessão válida
  if (!atualizado) {
    textoApp('aviso-perfil', 'Entre novamente para salvar seus dados.');
    return;
  }
  cidadaoApp.documentos = atualizado.documentos;
  cidadaoApp.nome = atualizado.nome;
  cidadaoApp.nascimento = atualizado.nascimento;
  cidadaoApp.telefone = document.getElementById('telefone-perfil').value.trim();
  cidadaoApp.municipio = document.getElementById('municipio-perfil').value.trim();
  cidadaoApp.bairro = document.getElementById('bairro-perfil').value.trim();
  // salva a uf informada sem alterar os campos de identidade
  cidadaoApp.estado = document.getElementById('estado-perfil').value.trim().toUpperCase();
  // rejeita município formado apenas por espaços
  if (!cidadaoApp.municipio) {
    textoApp('aviso-perfil', 'Informe o município.');
    return;
  }
  cidadaoApp.necessidades = escolhasPerfil('necessidade-perfil', cidadaoApp.necessidades || []);
  // evita combinar a escolha de não informar com declarações específicas
  if (cidadaoApp.necessidades.indexOf('Prefiro não informar') >= 0 && cidadaoApp.necessidades.length > 1) {
    textoApp('aviso-perfil', 'Selecione apenas Prefiro não informar ou as necessidades que deseja declarar.');
    return;
  }
  cidadaoApp.servicos = escolhasPerfil('servico-perfil', cidadaoApp.servicos || []);
  cidadaoApp.preferencias = buscarPreferenciasAcessibilidade();
  // utiliza a persistência compartilhada do cadastro
  salvarDadosCidadao(cidadaoApp);
  textoApp('aviso-perfil', 'Dados atualizados.');
}

// =================================================================
// APOIO FERROVIÁRIO
// =================================================================

// conecta os catálogos de operadora, linha, estação e equipamentos
function prepararMetro() {
  // seleciona o formulário deste serviço
  const formulario = document.getElementById('formulario-apoio-metro');
  // executa apenas na página correspondente
  if (!formulario) {
    return;
  }
  document.getElementById('pedir-apoio').disabled = false;
  // atualiza linhas ao escolher operadora
  document.getElementById('orgao-metro').addEventListener('change', atualizarLinhasApp);
  // atualiza estações ao escolher linha
  document.getElementById('linha-metro').addEventListener('change', atualizarEstacoesApp);
  // atualiza os equipamentos ao escolher estação
  document.getElementById('estacao-metro').addEventListener('change', equipamentosApp);
  // registra o pedido no envio explícito
  formulario.addEventListener('submit', registrarMetroApp);
  atualizarLinhasApp();
}

// preenche um seletor usando o catálogo compartilhado
// campo representa o seletor e valores representa as opções
function opcoesApp(campo, valores) {
  campo.textContent = '';
  // cria cada opção sem inserir marcação externa
  for (let i = 0; i < valores.length; i = i + 1) {
    // cria uma opção do catálogo
    const opcao = document.createElement('option');
    opcao.value = valores[i];
    opcao.textContent = valores[i];
    campo.appendChild(opcao);
  }
}

// seleciona as linhas permitidas para a operadora
function atualizarLinhasApp() {
  opcoesApp(document.getElementById('linha-metro'), linhasInstituicoes[document.getElementById('orgao-metro').value]);
  atualizarEstacoesApp();
}

// seleciona as estações permitidas para a linha
function atualizarEstacoesApp() {
  opcoesApp(document.getElementById('estacao-metro'), estacoesLinhas[document.getElementById('linha-metro').value]);
  equipamentosApp();
}

// apresenta os mesmos equipamentos e situações do painel administrativo
function equipamentosApp() {
  // recupera o catálogo compartilhado
  const equipamentos = buscarEquipamentosMetro();
  // seleciona o contêiner existente
  const lista = document.getElementById('lista-elevadores');
  // recupera a estação selecionada
  const estacao = document.getElementById('estacao-metro').value;
  // recupera a operadora selecionada
  const orgao = document.getElementById('orgao-metro').value;
  lista.textContent = '';
  textoApp('estacao-elevadores', 'Equipamentos — ' + estacao);
  // exibe apenas equipamentos cadastrados da estação e operadora
  for (let i = 0; i < equipamentos.length; i = i + 1) {
    if (equipamentos[i].estacao === estacao && equipamentos[i].orgao === orgao) {
      // cria o cartão da situação registrada
      const cartao = document.createElement('p');
      cartao.className = 'card-elevador';
      cartao.textContent = equipamentos[i].nome + ' — ' + equipamentos[i].local + ' — ' + equipamentos[i].situacao;
      lista.appendChild(cartao);
    }
  }
  // informa ausência de equipamentos sem presumir disponibilidade
  if (!lista.children.length) {
    lista.textContent = 'Sem equipamentos cadastrados para esta estação.';
  }
}

// registra apoio na fila compartilhada com a operadora
// evento representa o envio do formulário
function registrarMetroApp(evento) {
  evento.preventDefault();
  // valida os campos obrigatórios
  if (!evento.currentTarget.reportValidity()) {
    return;
  }
  // recupera a estação escolhida
  const estacao = document.getElementById('estacao-metro').value;
  // recupera o encontro informado
  const encontro = document.getElementById('ponto-encontro').value.trim();
  // rejeita local de encontro formado apenas por espaços
  if (!encontro) {
    textoApp('aviso-apoio-metro', 'Informe o local de encontro.');
    document.getElementById('aviso-apoio-metro').hidden = false;
    return;
  }
  // registra metadados e etapas pela função compartilhada
  const pedido = registrarPedidoCidadao({servico: 'metro', tipo: document.getElementById('tipo-apoio').selectedOptions[0].textContent.trim(), orgao: document.getElementById('orgao-metro').value, linha: document.getElementById('linha-metro').value, estacao: estacao, encontro: encontro, local: estacao + ' - ' + encontro});
  textoApp('protocolo-apoio-metro', pedido.protocolo);
  document.getElementById('resultado-apoio-metro').hidden = false;
}

// =================================================================
// ZELADORIA E ANEXOS LOCAIS
// =================================================================

// prepara o formulário textual e as prévias locais
function prepararZeladoria() {
  // seleciona o formulário de ocorrências
  const formulario = document.getElementById('formulario-zeladoria');
  // evita acessar controles de outras páginas
  if (!formulario) {
    return;
  }
  document.getElementById('registrar-relato').disabled = false;
  // registra a ocorrência após envio explícito
  formulario.addEventListener('submit', registrarZeladoriaApp);
  // guarda os dois tipos de anexo existentes
  const tipos = ['foto', 'audio'];
  // conecta seleção e remoção de cada prévia
  for (let i = 0; i < tipos.length; i = i + 1) {
    document.getElementById(tipos[i] + '-relato').addEventListener('change', previaAnexoApp);
    document.getElementById('remover-' + tipos[i]).addEventListener('click', removerAnexoApp);
  }
}

// apresenta somente uma prévia temporária sem upload
// evento representa a escolha do arquivo
function previaAnexoApp(evento) {
  // recupera o campo alterado
  const campo = evento.currentTarget;
  // identifica o tipo de anexo
  const tipo = campo.id.split('-')[0];
  // seleciona a prévia de imagem por padrão
  let previa = document.getElementById('imagem-relato');
  // utiliza o áudio para esse tipo de arquivo
  if (tipo === 'audio') {
    previa = document.getElementById('reprodutor-audio');
    previa.pause();
  }
  // libera o arquivo temporário anterior
  if (previa.getAttribute('src')) {
    URL.revokeObjectURL(previa.getAttribute('src'));
    previa.removeAttribute('src');
  }
  document.getElementById('previa-' + tipo).hidden = true;
  // apresenta somente arquivos selecionados de fato
  if (campo.files.length) {
    previa.src = URL.createObjectURL(campo.files[0]);
    textoApp('nome-' + tipo, campo.files[0].name + ' — prévia local, sem envio');
    document.getElementById('previa-' + tipo).hidden = false;
  }
}

// remove o arquivo da prévia sem alterar o pedido textual
// evento representa o clique no botão de remoção
function removerAnexoApp(evento) {
  // identifica o tipo pelo botão
  const tipo = evento.currentTarget.id.split('-')[1];
  // seleciona o campo correspondente
  const campo = document.getElementById(tipo + '-relato');
  campo.value = '';
  previaAnexoApp({currentTarget: campo});
}

// registra somente os dados textuais do relato
// evento representa o envio do formulário
function registrarZeladoriaApp(evento) {
  evento.preventDefault();
  // recupera a categoria escolhida
  const categoria = document.querySelector('input[name="problema"]:checked');
  // recupera os textos retirando espaços nas extremidades
  const local = document.getElementById('endereco-relato').value.trim();
  // recupera a descrição textual do cidadão
  const descricao = document.getElementById('descricao-relato').value.trim();
  // valida categoria e campos obrigatórios
  if (!categoria || !local || !descricao || !evento.currentTarget.reportValidity()) {
    textoApp('aviso-zeladoria', 'Selecione o problema e preencha endereço e descrição.');
    document.getElementById('aviso-zeladoria').hidden = false;
    return;
  }
  // persiste a ocorrência sem anexos ou upload fictício
  const pedido = registrarPedidoCidadao({servico: 'zeladoria', tipo: 'Ocorrência de zeladoria', orgao: 'cet', categoria: categoria.value, local: local, descricao: descricao});
  textoApp('protocolo-zeladoria', pedido.protocolo);
  document.getElementById('resultado-zeladoria').hidden = false;
}

// =================================================================
// SIMULAÇÃO DE TRAVESSIA
// =================================================================

// guarda os quatro áudios próprios gerados para esta demonstração
const sonsTravessia = {};
// registra o ritmo atual para não reiniciar o mesmo áudio a cada segundo
let ritmoTravessia = "";
// registra a última situação anunciada para evitar repetições no leitor de tela
let estadoAnunciadoTravessia = "";

// conecta a contagem e recupera seu horário final após recarregar
function prepararTravessia() {
  // seleciona o formulário de travessia
  const formulario = document.getElementById('formulario-travessia');
  // ignora páginas sem o serviço
  if (!formulario) return;
  // recupera os áudios locais de autoria do próprio projeto
  const nomes = ['aguardando', 'travessia', 'atencao', 'encerramento'];
  for (let i = 0; i < nomes.length; i++) {
    sonsTravessia[nomes[i]] = new Audio('../../assets/audios/' + nomes[i] + '.wav');
    sonsTravessia[nomes[i]].volume = 0.3;
    sonsTravessia[nomes[i]].preload = 'auto';
  }
  // inicia somente após pedido explícito
  formulario.addEventListener('submit', iniciarTravessiaApp);
  // permite encerrar a simulação
  document.getElementById('encerrar-travessia').addEventListener('click', encerrarTravessiaApp);
  // altera um segundo por clique sem permitir valores negativos ou superiores a quinze
  document.getElementById('diminuir-tempo').addEventListener('click', function () { alterarTempoAdicional(-1); });
  document.getElementById('aumentar-tempo').addEventListener('click', function () { alterarTempoAdicional(1); });
  // permite testar o áudio por uma interação explícita do cidadão
  document.getElementById('testar-som-travessia').addEventListener('click', function (evento) {
    evento.stopPropagation();
    tocarSomTravessia('aguardando', false);
  });
  // ajusta o volume moderado dos quatro sons sem criar outra preferência global
  document.getElementById('volume-travessia').addEventListener('input', function (evento) {
    for (let i = 0; i < nomes.length; i++) sonsTravessia[nomes[i]].volume = Number(evento.currentTarget.value);
  });
  // recupera pedidos associados à sessão atual
  const pedidos = buscarPedidosCidadao();
  for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].servico === 'travessia' && !pedidos[i].simulacaoEncerrada) pedidoTravessia = pedidos[i];
  }
  // restaura a seleção do pedido sem criar outro protocolo ou outro ciclo
  if (pedidoTravessia) {
    const escolhas = document.querySelectorAll('input[name="cruzamento"]');
    for (let i = 0; i < escolhas.length; i++) escolhas[i].checked = escolhas[i].value === pedidoTravessia.cruzamento;
    document.getElementById('tempo-adicional').value = pedidoTravessia.tempoAdicionalSolicitado || 0;
  }
  alterarTempoAdicional(0);
  bloquearSelecaoTravessia(pedidoTravessia !== null);
  // mantém uma única atualização do controlador, inclusive antes de qualquer pedido
  atualizarContagemApp();
  temporizadorTravessia = setInterval(atualizarContagemApp, 1000);
  // interrompe sons e vibração imediatamente após mudar as preferências
  document.addEventListener('change', atualizarAvisosTravessia);
  document.addEventListener('click', atualizarAvisosTravessia);
  window.addEventListener('storage', atualizarAvisosTravessia);
  // descarta o temporizador e todos os avisos ao sair da página
  window.addEventListener('pagehide', function () {
    clearInterval(temporizadorTravessia);
    temporizadorTravessia = null;
    pararAvisosTravessia();
  });
  // retoma uma página restaurada do histórico sem duplicar seu temporizador
  window.addEventListener('pageshow', function (evento) {
    if (evento.persisted && temporizadorTravessia === null) {
      atualizarContagemApp();
      temporizadorTravessia = setInterval(atualizarContagemApp, 1000);
    }
  });
}

// altera somente a extensão solicitada, nunca o horário atual do ciclo
// variacao indica um segundo a mais ou a menos
function alterarTempoAdicional(variacao) {
  // limita o valor mesmo quando a função for chamada fora dos botões
  const campo = document.getElementById('tempo-adicional');
  campo.value = Math.max(0, Math.min(15, Number(campo.value) + variacao));
  document.getElementById('diminuir-tempo').disabled = Number(campo.value) === 0 || pedidoTravessia !== null;
  document.getElementById('aumentar-tempo').disabled = Number(campo.value) === 15 || pedidoTravessia !== null;
}

// bloqueia a troca de cruzamento enquanto o pedido salvo estiver em andamento
// bloqueado indica se os controles de seleção devem ficar indisponíveis
function bloquearSelecaoTravessia(bloqueado) {
  // recupera todas as opções de cruzamento da simulação
  const cruzamentos = document.querySelectorAll('input[name="cruzamento"]');
  for (let i = 0; i < cruzamentos.length; i++) cruzamentos[i].disabled = bloqueado;
  // mantém os marcadores com a mesma disponibilidade da alternativa textual
  const marcadores = document.querySelectorAll('[data-marcador-cruzamento]');
  for (let i = 0; i < marcadores.length; i++) marcadores[i].disabled = bloqueado;
  document.getElementById('trocar-cruzamento').disabled = bloqueado;
  alterarTempoAdicional(0);
}

// inicia a solicitação sem controlar diretamente a fase do semáforo simulado
// evento representa o envio do formulário
function iniciarTravessiaApp(evento) {
  evento.preventDefault();
  // impede pedidos e intervalos simultâneos
  if (pedidoTravessia) return;
  // valida novamente a extensão, inclusive quando o valor for alterado fora dos botões
  const adicional = Number(document.getElementById('tempo-adicional').value);
  if (!Number.isInteger(adicional) || adicional < 0 || adicional > 15) {
    textoApp('aviso-travessia', 'Escolha um tempo adicional entre zero e quinze segundos.');
    return;
  }
  // recupera a opção escolhida na lista ou no diagrama
  const selecionado = document.querySelector('input[name="cruzamento"]:checked');
  if (!selecionado) return;
  // delega a análise ao controlador compartilhado, que aplica os limites do ciclo
  pedidoTravessia = registrarTravessiaSimulada(selecionado.value, adicional);
  if (pedidoTravessia === null) {
    textoApp('aviso-travessia', 'Não foi possível reservar esse tempo. Consulte seus pedidos ou escolha outro cruzamento com suporte.');
    return;
  }
  estadoAnunciadoTravessia = '';
  bloquearSelecaoTravessia(true);
  atualizarContagemApp();
}

// apresenta os segundos no formato de minutos e segundos
// segundos representa o tempo restante calculado pelo controlador
function formatarTempoTravessia(segundos) {
  // mantém a contagem inteira e não negativa
  const tempo = Math.max(0, Math.ceil(segundos));
  return String(Math.floor(tempo / 60)).padStart(2, '0') + ':' + String(tempo % 60).padStart(2, '0');
}

// calcula o tempo pelo instante final salvo
function atualizarContagemApp() {
  // consulta o ciclo automático do cruzamento mesmo sem uma solicitação
  const selecionado = document.querySelector('input[name="cruzamento"]:checked');
  if (!selecionado) return;
  const ciclo = consultarCicloTravessia(selecionado.value);
  // informa ausência de suporte sem criar um controlador para esse local
  if (ciclo === null) {
    textoApp('cenario-ciclo', 'Suporte não confirmado no catálogo da simulação.');
    textoApp('estado-ciclo', 'Selecione outro cruzamento com suporte.');
    textoApp('contagem-ciclo', '00:00');
    return;
  }
  textoApp('cenario-ciclo', 'Cenário demonstrativo: trânsito ' + ciclo.cenario.toLowerCase() + '. Tempo-base: ' + ciclo.tempoBase + ' segundos.');
  textoApp('estado-ciclo', 'Ciclo automático: ' + ciclo.estado + '.');
  // identifica a próxima mudança prevista sem anunciar cada segundo
  let proximo = ciclo.transicao;
  if (Date.now() >= ciclo.fim) proximo = ciclo.fimCiclo;
  else if (Date.now() >= ciclo.abertura) proximo = ciclo.fim;
  else if (Date.now() >= ciclo.transicao) proximo = ciclo.abertura;
  textoApp('contagem-ciclo', formatarTempoTravessia((proximo - Date.now()) / 1000));
  // mantém o botão disponível apenas em locais contemplados e sem pedido ativo
  document.getElementById('solicitar-travessia').disabled = pedidoTravessia !== null;
  if (!pedidoTravessia) return;
  // recupera o mesmo protocolo com as etapas conciliadas, inclusive após trocar de página
  const pedidos = buscarPedidosOperacionais();
  for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].protocolo === pedidoTravessia.protocolo) pedidoTravessia = pedidos[i];
  }
  document.getElementById('resultado-travessia').hidden = false;
  textoApp('titulo-confirmacao-travessia', 'Acompanhe sua solicitação');
  textoApp('descricao-confirmacao-travessia', 'A reserva é analisada pelo controlador da simulação.');
  textoApp('titulo-resultado-travessia', pedidoTravessia.situacao);
  textoApp('dados-travessia', pedidoTravessia.protocolo + ' · ' + pedidoTravessia.local + ' · Adicional solicitado: ' + (pedidoTravessia.tempoAdicionalSolicitado || 0) + ' s. Concedido: ' + (pedidoTravessia.tempoAdicionalConcedido || 0) + ' s.');
  textoApp('estado-pedido-travessia', 'Tempo total programado neste ciclo: ' + (pedidoTravessia.tempoTotalSimulado || 28) + ' segundos.');
  // utiliza a abertura na espera e o encerramento durante a fase de pedestres
  let fim = pedidoTravessia.fimSimulacao;
  if (Date.now() < pedidoTravessia.aberturaSimulacao) fim = pedidoTravessia.aberturaSimulacao;
  textoApp('contagem-travessia', formatarTempoTravessia((fim - Date.now()) / 1000));
  apresentarEtapasTravessia();
  // comunica apenas mudanças importantes, respeitando as preferências independentes
  if (estadoAnunciadoTravessia !== pedidoTravessia.situacao) {
    estadoAnunciadoTravessia = pedidoTravessia.situacao;
    alertarTravessiaApp(pedidoTravessia.situacao);
  }
  atualizarAvisosTravessia();
  // libera a seleção ao encerrar o pedido sem manter avisos antigos
  if (pedidoTravessia.simulacaoEncerrada) {
    textoApp('descricao-confirmacao-travessia', 'Solicitação encerrada. Você pode fazer um novo pedido.');
    document.getElementById('encerrar-travessia').hidden = true;
    pedidoTravessia = null;
    bloquearSelecaoTravessia(false);
    document.getElementById('solicitar-travessia').disabled = false;
  } else document.getElementById('encerrar-travessia').hidden = false;
}

// monta somente as etapas efetivamente registradas no histórico
function apresentarEtapasTravessia() {
  // recupera a lista dentro do painel existente
  const lista = document.getElementById('etapas-travessia');
  lista.textContent = '';
  for (let i = 0; i < pedidoTravessia.etapas.length; i++) {
    // cria cada etapa com texto seguro e a estrutura visual já usada nos pedidos
    const item = document.createElement('li');
    item.className = 'etapa-solicitacao';
    const dados = document.createElement('div');
    dados.className = 'dados-etapa';
    dados.textContent = pedidoTravessia.etapas[i].titulo + ' · ' + pedidoTravessia.etapas[i].horario;
    item.appendChild(dados);
    lista.appendChild(item);
  }
}

// encerra a simulação após solicitação do cidadão
function encerrarTravessiaApp() {
  // impede alteração de pedidos já encerrados
  if (pedidoTravessia) finalizarTravessiaApp('Simulação encerrada pelo cidadão');
}

// finaliza o pedido sem interromper a existência do ciclo automático
// titulo indica o motivo do encerramento
function finalizarTravessiaApp(titulo) {
  pedidoTravessia.simulacaoEncerrada = true;
  pedidoTravessia.dataConclusao = new Date().toLocaleString('pt-BR');
  etapaTravessiaApp(titulo);
  atualizarContagemApp();
}

// acrescenta somente uma etapa ocorrida na simulação
// titulo indica o evento registrado
function etapaTravessiaApp(titulo) {
  // recupera o instante real do evento
  const agora = new Date();
  pedidoTravessia.situacao = titulo;
  pedidoTravessia.etapas.push({titulo: titulo, horario: agora.toLocaleString('pt-BR'), instante: agora.toISOString()});
  // atualiza o mesmo protocolo sem duplicar pedidos
  salvarPedidoCidadao(pedidoTravessia);
}

// interrompe toda reprodução anterior e qualquer vibração pendente
function pararAvisosTravessia() {
  pararSonsTravessia();
  if (navigator.vibrate) navigator.vibrate(0);
}

// pausa apenas os áudios sem interferir nos alertas vibratórios
function pararSonsTravessia() {
  // percorre os quatro sons conhecidos sem carregar recursos externos
  const nomes = ['aguardando', 'travessia', 'atencao', 'encerramento'];
  for (let i = 0; i < nomes.length; i++) {
    if (sonsTravessia[nomes[i]]) {
      sonsTravessia[nomes[i]].pause();
      sonsTravessia[nomes[i]].currentTime = 0;
    }
  }
  ritmoTravessia = '';
}

// reproduz um único ritmo local por vez
// nome identifica o áudio; repetir indica se a fase exige repetição
function tocarSomTravessia(nome, repetir) {
  pararSonsTravessia();
  // inicia a reprodução somente depois da escolha ou do teste explícito do cidadão
  const som = sonsTravessia[nome];
  ritmoTravessia = nome;
  som.loop = repetir;
  // mantém as outras funções operando quando o navegador bloquear o áudio
  som.play().catch(function () {
    textoApp('aviso-travessia', 'O navegador bloqueou o som. Utilize Testar som para autorizar a reprodução.');
  });
}

// respeita preferências de som e vibração separadas da voz da iara
// mensagem indica o aviso de início ou término
function alertarTravessiaApp(mensagem) {
  textoApp('aviso-travessia', mensagem + '. Aviso exclusivo da simulação acadêmica.');
  // interrompe os sons anteriores e apresenta um único aviso de encerramento
  if (mensagem === 'Simulação concluída' || mensagem === 'Simulação encerrada pelo cidadão') {
    pararAvisosTravessia();
    if (buscarPreferenciasAcessibilidade().somTravessia) tocarSomTravessia('encerramento', false);
  }
  // emite padrões curtos conforme o evento, quando o dispositivo oferecer suporte
  if (buscarPreferenciasAcessibilidade().vibracao && navigator.vibrate) {
    if (mensagem === 'Travessia liberada na simulação') navigator.vibrate([100, 120, 100]);
    else if (mensagem === 'Tempo próximo do fim') navigator.vibrate([80, 80, 80, 80, 80]);
    else if (mensagem === 'Simulação concluída' || mensagem === 'Simulação encerrada pelo cidadão') navigator.vibrate(220);
    else navigator.vibrate(100);
  }
}

// atualiza o ritmo e interrompe avisos assim que uma preferência for desativada
function atualizarAvisosTravessia() {
  // evita utilizar áudio em páginas que não possuem o formulário
  if (!document.getElementById('formulario-travessia')) return;
  const preferencias = buscarPreferenciasAcessibilidade();
  if (!preferencias.vibracao && navigator.vibrate) navigator.vibrate(0);
  // desativa imediatamente todos os sons ao desligar a preferência
  if (!preferencias.somTravessia) {
    pararSonsTravessia();
    return;
  }
  if (!pedidoTravessia || pedidoTravessia.simulacaoEncerrada) return;
  // escolhe um único ritmo para a fase atual sem utilizar fala sintetizada
  let ritmo = 'aguardando';
  if (pedidoTravessia.situacao === 'Travessia liberada na simulação') ritmo = 'travessia';
  else if (pedidoTravessia.situacao === 'Tempo próximo do fim') ritmo = 'atencao';
  // retoma a repetição mesmo quando o mesmo som foi testado uma única vez
  if (ritmoTravessia !== ritmo || !sonsTravessia[ritmo].loop) tocarSomTravessia(ritmo, true);
}

// =================================================================

// PEDIDOS DO CIDADÃO
// =================================================================

// guarda o único temporizador de consulta na página de pedidos
let temporizadorPedidosApp = null;
// guarda o conteúdo consultado para preservar o foco quando nada mudou
let dadosPedidosApp = '';

// concilia os horários mesmo quando o cidadão saiu da tela de travessia
function atualizarPedidosEmAberto() {
  // recupera etapas vencidas e compara as duas listas compartilhadas
  buscarPedidosOperacionais();
  const atual = localStorage.getItem('metro-chamados') + '|' + localStorage.getItem('meu-tempo-pedidos');
  // reconstrói os cartões somente quando houver alguma alteração real
  if (atual !== dadosPedidosApp) {
    dadosPedidosApp = atual;
    apresentarPedidosApp(document.getElementById('lista-solicitacoes').getAttribute('data-filtro'));
  }
}

// conecta filtros e atualizações recebidas de outra aba
function prepararPedidos() {
  // seleciona a lista de pedidos
  const lista = document.getElementById('lista-solicitacoes');
  // executa somente no histórico
  if (!lista) {
    return;
  }
  // recupera os três filtros existentes
  const filtros = document.querySelectorAll('button[id^="filtro-"]');
  // conecta cada filtro à lista cidadã
  for (let i = 0; i < filtros.length; i = i + 1) {
    filtros[i].addEventListener('click', function (evento) {
      apresentarPedidosApp(evento.currentTarget.id);
    });
  }
  apresentarPedidosApp('filtro-todas');
  // consulta uma vez por segundo sem reiniciar ciclos ou registrar novos pedidos
  dadosPedidosApp = localStorage.getItem('metro-chamados') + '|' + localStorage.getItem('meu-tempo-pedidos');
  temporizadorPedidosApp = setInterval(atualizarPedidosEmAberto, 1000);
  // interrompe a consulta quando esta página deixa de ser utilizada
  window.addEventListener('pagehide', function () {
    clearInterval(temporizadorPedidosApp);
    temporizadorPedidosApp = null;
  });
  // restaura a consulta ao voltar pelo histórico do navegador
  window.addEventListener('pageshow', function (evento) {
    if (evento.persisted && temporizadorPedidosApp === null) {
      atualizarPedidosEmAberto();
      temporizadorPedidosApp = setInterval(atualizarPedidosEmAberto, 1000);
    }
  });
  // recebe atualizações de situação feitas pelo painel em outra aba
  window.addEventListener('storage', function () {
    apresentarPedidosApp(lista.getAttribute('data-filtro'));
  });
}

// apresenta somente pedidos e etapas realmente registrados
// filtro indica todas, andamento ou finalizadas
function apresentarPedidosApp(filtro) {
  // recupera os pedidos do cidadão já ordenados pela data mais recente
  const pedidos = buscarPedidosCidadao();
  const lista = document.getElementById('lista-solicitacoes');
  // preserva o acompanhamento aberto e o foco durante atualizações de situação
  const abertos = lista.querySelectorAll('.card-solicitacao[open]');
  const protocolosAbertos = [];
  for (let i = 0; i < abertos.length; i++) protocolosAbertos.push(abertos[i].getAttribute('data-protocolo'));
  // identifica somente o foco que pertence à lista, mantendo os filtros independentes
  const focoAnterior = document.activeElement.closest('.card-solicitacao');
  let protocoloFoco = '';
  if (focoAnterior && lista.contains(focoAnterior)) protocoloFoco = focoAnterior.getAttribute('data-protocolo');
  lista.textContent = '';
  lista.setAttribute('data-filtro', filtro);
  // percorre os registros sem misturar pedidos de outros cidadãos
  for (let i = 0; i < pedidos.length; i++) {
    // identifica as situações encerradas que pertencem ao filtro de finalizadas
    const pedido = pedidos[i];
    const finalizado = pedido.situacao === 'Concluído' || pedido.situacao === 'Recusado' || pedido.situacao === 'Cancelado' || pedido.situacao === 'Simulação concluída' || pedido.situacao === 'Simulação encerrada pelo cidadão';
    if ((filtro !== 'filtro-andamento' || !finalizado) && (filtro !== 'filtro-finalizadas' || finalizado)) {
      // recupera o nome completo e o ícone local do serviço correspondente
      let nomeServico = 'Zeladoria urbana';
      let caminhoIcone = 'zeladoria.svg';
      if (pedido.servico === 'metro') {
        nomeServico = 'Apoio no Metrô e CPTM';
        caminhoIcone = 'metro.svg';
      } else if (pedido.servico === 'travessia') {
        nomeServico = 'Travessia acessível';
        caminhoIcone = 'traffic-lights.svg';
      }
      // reutiliza a mesma estrutura de cartão expansível que já possui estilos
      const cartao = document.createElement('details');
      cartao.className = 'card-solicitacao';
      cartao.setAttribute('data-protocolo', pedido.protocolo);
      // recupera apenas os cartões que o cidadão já havia expandido
      for (let j = 0; j < protocolosAbertos.length; j++) {
        if (protocolosAbertos[j] === pedido.protocolo) cartao.open = true;
      }
      const resumo = document.createElement('summary');
      resumo.setAttribute('aria-expanded', 'false');
      resumo.setAttribute('aria-label', 'Ver acompanhamento: ' + nomeServico + ', ' + pedido.protocolo);
      cartao.appendChild(resumo);
      // apresenta o ícone decorativo junto do nome textual do serviço
      const circulo = document.createElement('span');
      circulo.className = 'icone-solicitacao';
      const icone = document.createElement('img');
      icone.className = 'icone';
      icone.src = '../../assets/icones/' + caminhoIcone;
      icone.alt = '';
      circulo.appendChild(icone);
      resumo.appendChild(circulo);
      // organiza nome, protocolo, data e local com as classes existentes
      const informacoes = document.createElement('span');
      informacoes.className = 'dados-solicitacao';
      const nome = document.createElement('strong');
      nome.textContent = nomeServico;
      informacoes.appendChild(nome);
      const metadados = document.createElement('small');
      let horario = pedido.horarioSolicitacao || 'Horário não registrado';
      if (pedido.dataSolicitacao) horario = new Date(pedido.dataSolicitacao).toLocaleString('pt-BR');
      metadados.textContent = pedido.protocolo + ' · ' + horario;
      informacoes.appendChild(metadados);
      const local = document.createElement('small');
      local.textContent = pedido.local || pedido.estacao || '';
      informacoes.appendChild(local);
      const chamada = document.createElement('small');
      chamada.textContent = 'Ver acompanhamento';
      informacoes.appendChild(chamada);
      resumo.appendChild(informacoes);
      // mantém a etiqueta de situação com a aparência dos cartões originais
      const situacao = document.createElement('span');
      situacao.className = 'status-solicitacao status-andamento';
      if (finalizado) situacao.className = 'status-solicitacao status-finalizada';
      situacao.textContent = pedido.situacao;
      resumo.appendChild(situacao);
      const seta = document.createElement('img');
      seta.src = '../../assets/icones/seta-direita.svg';
      seta.alt = '';
      seta.className = 'icone seta-solicitacao';
      resumo.appendChild(seta);
      // agrupa os detalhes dentro da área recolhida que já possui espaçamento
      const historico = document.createElement('div');
      historico.className = 'historico-solicitacao';
      const detalhes = document.createElement('p');
      detalhes.className = 'protocolo-solicitacao';
      detalhes.textContent = pedido.tipo;
      if (pedido.servico === 'metro') detalhes.textContent = pedido.tipo + ' · ' + pedido.linha + ' · ' + pedido.estacao;
      else if (pedido.servico === 'travessia') detalhes.textContent = 'Adicional solicitado: ' + (pedido.tempoAdicionalSolicitado || 0) + ' s. Concedido: ' + (pedido.tempoAdicionalConcedido || 0) + ' s.';
      else detalhes.textContent = (pedido.categoria || 'Relato') + ' · ' + (pedido.descricao || '').slice(0, 180);
      historico.appendChild(detalhes);
      // apresenta o motivo da recusa usando somente texto
      if (pedido.motivoRecusa) {
        const motivo = document.createElement('p');
        motivo.textContent = 'Motivo da recusa: ' + pedido.motivoRecusa;
        historico.appendChild(motivo);
      }
      // utiliza a estrutura original das linhas do tempo, sem marcar etapas futuras
      const etapas = document.createElement('ol');
      etapas.className = 'linha-tempo';
      for (let j = 0; j < pedido.etapas.length; j++) {
        const etapa = document.createElement('li');
        etapa.className = 'etapa-solicitacao';
        const marca = document.createElement('span');
        marca.className = 'icone-etapa';
        marca.textContent = '✓';
        marca.setAttribute('aria-hidden', 'true');
        etapa.appendChild(marca);
        const dados = document.createElement('div');
        dados.className = 'dados-etapa';
        const titulo = document.createElement('strong');
        titulo.textContent = pedido.etapas[j].titulo;
        dados.appendChild(titulo);
        const data = document.createElement('p');
        data.textContent = pedido.etapas[j].horario;
        if (pedido.etapas[j].instante) data.textContent = new Date(pedido.etapas[j].instante).toLocaleString('pt-BR');
        dados.appendChild(data);
        etapa.appendChild(dados);
        etapas.appendChild(etapa);
      }
      historico.appendChild(etapas);
      cartao.appendChild(historico);
      // informa a expansão e o recolhimento também para tecnologias assistivas
      cartao.addEventListener('toggle', function (evento) {
        evento.currentTarget.querySelector('summary').setAttribute('aria-expanded', String(evento.currentTarget.open));
      });
      lista.appendChild(cartao);
      // mantém a posição de navegação ao atualizar um pedido que estava em foco
      if (protocoloFoco === pedido.protocolo) resumo.focus();
    }
  }
  // apresenta o estado vazio somente quando o filtro não possui resultados
  document.getElementById('sem-solicitacoes').hidden = lista.children.length > 0;
  const botoes = document.querySelectorAll('button[id^="filtro-"]');
  for (let i = 0; i < botoes.length; i++) {
    botoes[i].classList.remove('ativo');
    botoes[i].setAttribute('aria-pressed', 'false');
    if (botoes[i].id === filtro) {
      botoes[i].classList.add('ativo');
      botoes[i].setAttribute('aria-pressed', 'true');
    }
  }
}

// inicia após os scripts de dados e acessibilidade compartilhados
iniciarApp();
