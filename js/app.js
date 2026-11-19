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
  textoApp('data-atual', new Date().toLocaleDateString('pt-BR'));
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
  textoApp('status-documento', 'Identificação: não informada. Complementar: não informado.');
  // apresenta os registros existentes sem alegar autenticação externa
  if (cidadaoApp.documentos) {
    textoApp('status-documento', 'Identificação: ' + estadoDocumento(cidadaoApp.documentos.identificacao) + '. Complementar: ' + estadoDocumento(cidadaoApp.documentos.complementar) + '.');
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
  cidadaoApp.documentos = atualizado.documentos;
  cidadaoApp.nome = atualizado.nome;
  cidadaoApp.nascimento = atualizado.nascimento;
  cidadaoApp.telefone = document.getElementById('telefone-perfil').value.trim();
  cidadaoApp.municipio = document.getElementById('municipio-perfil').value.trim();
  cidadaoApp.bairro = document.getElementById('bairro-perfil').value.trim();
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

// conecta a contagem e recupera seu horário final após recarregar
function prepararTravessia() {
  // seleciona o formulário de travessia
  const formulario = document.getElementById('formulario-travessia');
  // ignora páginas sem o serviço
  if (!formulario) {
    return;
  }
  // inicia somente após pedido explícito
  formulario.addEventListener('submit', iniciarTravessiaApp);
  // permite encerrar a simulação
  document.getElementById('encerrar-travessia').addEventListener('click', encerrarTravessiaApp);
  // recupera pedidos associados à sessão atual
  const pedidos = buscarPedidosCidadao();
  // procura uma simulação ainda em andamento
  for (let i = 0; i < pedidos.length; i = i + 1) {
    if (pedidos[i].servico === 'travessia' && pedidos[i].fimSimulacao && !pedidos[i].simulacaoEncerrada) {
      pedidoTravessia = pedidos[i];
    }
  }
  // recalcula a contagem sem reiniciar seu horário final
  if (pedidoTravessia) {
    // recupera os controles existentes sem alterar o cruzamento do pedido salvo
    const cruzamentos = document.querySelectorAll('input[name="cruzamento"]');
    // restaura a seleção correspondente ao protocolo que continua ativo
    for (let i = 0; i < cruzamentos.length; i = i + 1) {
      cruzamentos[i].checked = cruzamentos[i].value === pedidoTravessia.cruzamento;
    }
    document.getElementById('ciclo-simulado').value = pedidoTravessia.cicloSimulado;
    // atualiza endereço, cobertura e mapa somente quando o módulo estiver disponível
    if (typeof atualizarCruzamentoMapa === 'function') {
      atualizarCruzamentoMapa();
    }
    bloquearSelecaoTravessia(true);
    atualizarContagemApp();
    // agenda somente quando ainda houver tempo restante
    if (pedidoTravessia) {
      temporizadorTravessia = setInterval(atualizarContagemApp, 1000);
    }
  }
}

// bloqueia a troca de cruzamento enquanto o pedido salvo estiver em andamento
// bloqueado indica se os controles de seleção devem ficar indisponíveis
function bloquearSelecaoTravessia(bloqueado) {
  // recupera todas as opções de cruzamento da simulação
  const cruzamentos = document.querySelectorAll('input[name="cruzamento"]');
  // mantém a seleção fixa até a conclusão ou o encerramento
  for (let i = 0; i < cruzamentos.length; i = i + 1) {
    cruzamentos[i].disabled = bloqueado;
  }
  document.getElementById('ciclo-simulado').disabled = bloqueado;
  document.getElementById('trocar-cruzamento').disabled = bloqueado;
}

// inicia a contagem demonstrativa de 28 segundos sem controlar semáforos
// evento representa o envio do formulário
function iniciarTravessiaApp(evento) {
  evento.preventDefault();
  // impede pedidos e intervalos simultâneos
  if (pedidoTravessia) {
    return;
  }
  // recupera a opção escolhida
  const selecionado = document.querySelector('input[name="cruzamento"]:checked');
  // respeita a cobertura demonstrativa do cruzamento
  if (!selecionado || selecionado.parentElement.getAttribute('data-suporte') !== 'true') {
    return;
  }
  // recupera o tempo de ciclo escolhido apenas para esta simulação acadêmica
  const ciclo = Number(document.getElementById('ciclo-simulado').value);
  // valida o intervalo permitido pelo formulário
  if (!evento.currentTarget.reportValidity() || ciclo < 1 || ciclo > 60) {
    return;
  }
  // aguarda uma transição curta quando ainda houver mais de oito segundos
  let espera = 2;
  // reserva para o próximo ciclo demonstrativo quando restarem oito segundos ou menos
  if (ciclo <= 8) {
    espera = ciclo + 2;
  }
  // calcula o instante de abertura sem consultar um semáforo real
  const abertura = Date.now() + espera * 1000;
  pedidoTravessia = registrarPedidoCidadao({servico: 'travessia', tipo: 'Simulação de travessia', orgao: 'cet', cruzamento: selecionado.value, local: document.getElementById('nome-cruzamento-travessia').textContent.trim(), aberturaSimulacao: abertura, fimSimulacao: abertura + 28000, cicloSimulado: ciclo, simulacaoEncerrada: false});
  bloquearSelecaoTravessia(true);
  etapaTravessiaApp('Aguardando abertura');
  alertarTravessiaApp('Solicitação recebida. Aguarde a abertura simulada. Observe o sinal físico de pedestres.');
  atualizarContagemApp();
  temporizadorTravessia = setInterval(atualizarContagemApp, 1000);
}

// calcula o tempo pelo instante final salvo
function atualizarContagemApp() {
  // ignora chamadas sem simulação ativa
  if (!pedidoTravessia) {
    return;
  }
  document.getElementById('resultado-travessia').hidden = false;
  document.getElementById('encerrar-travessia').hidden = false;
  document.getElementById('solicitar-travessia').disabled = true;
  // calcula o tempo sem depender da precisão do intervalo
  const restante = Math.max(0, Math.ceil((pedidoTravessia.fimSimulacao - Date.now()) / 1000));
  // calcula a espera até a abertura programada da simulação
  const espera = Math.max(0, Math.ceil((pedidoTravessia.aberturaSimulacao - Date.now()) / 1000));
  // apresenta a etapa de espera e a regra acadêmica sem autorizar travessia real
  if (espera > 0) {
    textoApp('contagem-travessia', pedidoTravessia.protocolo + ' — aguardando abertura simulada: ' + espera + ' segundos. Com oito segundos ou menos, o pedido fica para o próximo ciclo demonstrativo. Observe o sinal físico da rua.');
    return;
  }
  // registra a abertura somente uma vez, inclusive após recarregar a página
  if (pedidoTravessia.situacao === 'Aguardando abertura' && restante > 0) {
    etapaTravessiaApp('Travessia liberada na simulação');
    alertarTravessiaApp('Início da contagem simulada. Observe o sinal físico da rua.');
  }
  // avisa quando a contagem simulada estiver nos últimos oito segundos
  if (restante > 0 && restante <= 8 && pedidoTravessia.situacao !== 'Tempo próximo do fim') {
    etapaTravessiaApp('Tempo próximo do fim');
    alertarTravessiaApp('Atenção: tempo próximo do fim na simulação. Observe o sinal físico da rua.');
  }
  textoApp('contagem-travessia', pedidoTravessia.protocolo + ' — simulação: ' + restante + ' segundos. Observe o sinal físico da rua.');
  // encerra somente a simulação ao chegar a zero
  if (restante === 0) {
    finalizarTravessiaApp('Simulação concluída');
  }
}

// encerra a simulação após solicitação do cidadão
function encerrarTravessiaApp() {
  // impede alteração de pedidos já encerrados
  if (pedidoTravessia) {
    finalizarTravessiaApp('Simulação encerrada pelo cidadão');
  }
}

// finaliza o único intervalo e registra o evento real
// titulo indica o motivo do encerramento
function finalizarTravessiaApp(titulo) {
  clearInterval(temporizadorTravessia);
  temporizadorTravessia = null;
  pedidoTravessia.simulacaoEncerrada = true;
  etapaTravessiaApp(titulo);
  textoApp('contagem-travessia', pedidoTravessia.protocolo + ' — ' + titulo + '. Observe o sinal físico da rua.');
  pedidoTravessia = null;
  bloquearSelecaoTravessia(false);
  document.getElementById('encerrar-travessia').hidden = true;
  // recupera a cobertura da opção atual
  const selecionado = document.querySelector('input[name="cruzamento"]:checked');
  document.getElementById('solicitar-travessia').disabled = selecionado.parentElement.getAttribute('data-suporte') !== 'true';
  alertarTravessiaApp(titulo + '. Observe o sinal físico de pedestres.');
}

// acrescenta somente uma etapa ocorrida na simulação
// titulo indica o evento registrado
function etapaTravessiaApp(titulo) {
  // recupera o instante real do evento
  const agora = new Date();
  pedidoTravessia.situacao = titulo;
  pedidoTravessia.etapas.push({titulo: titulo, horario: agora.toLocaleTimeString('pt-BR'), instante: agora.toISOString()});
  // atualiza o mesmo protocolo sem duplicar pedidos
  salvarPedidoCidadao(pedidoTravessia);
}

// respeita preferências de som e vibração separadas da voz da iara
// mensagem indica o aviso de início ou término
function alertarTravessiaApp(mensagem) {
  // recupera as preferências atuais
  const preferencias = buscarPreferenciasAcessibilidade();
  // utiliza voz nativa somente quando autorizada e disponível
  if (preferencias.somTravessia && window.speechSynthesis) {
    // prepara a fala em português
    const fala = new SpeechSynthesisUtterance(mensagem);
    fala.lang = 'pt-BR';
    window.speechSynthesis.speak(fala);
  }
  // vibra somente quando a preferência e o dispositivo permitirem
  if (preferencias.vibracao && navigator.vibrate) {
    navigator.vibrate(200);
  }
}

// =================================================================
// PEDIDOS DO CIDADÃO
// =================================================================

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
  // recebe atualizações de situação feitas pelo painel em outra aba
  window.addEventListener('storage', function () {
    apresentarPedidosApp(lista.getAttribute('data-filtro'));
  });
}

// apresenta somente pedidos e etapas realmente registrados
// filtro indica todas, andamento ou finalizadas
function apresentarPedidosApp(filtro) {
  // recupera os pedidos já limitados ao cidadão conectado
  const pedidos = buscarPedidosCidadao();
  // recupera o contêiner da lista
  const lista = document.getElementById('lista-solicitacoes');
  lista.textContent = '';
  lista.setAttribute('data-filtro', filtro);
  // percorre pedidos do mais recente para o mais antigo
  for (let i = pedidos.length - 1; i >= 0; i = i - 1) {
    // identifica situações encerradas
    const finalizado = pedidos[i].situacao === 'Concluído' || pedidos[i].situacao === 'Recusado' || pedidos[i].situacao === 'Cancelado' || pedidos[i].situacao === 'Simulação concluída' || pedidos[i].situacao === 'Simulação encerrada pelo cidadão';
    // aplica o filtro escolhido
    if ((filtro !== 'filtro-andamento' || !finalizado) && (filtro !== 'filtro-finalizadas' || finalizado)) {
      // cria o cartão expansível preservando a classe existente
      const cartao = document.createElement('details');
      cartao.className = 'card-solicitacao';
      // apresenta protocolo, serviço e situação
      const resumo = document.createElement('summary');
      resumo.textContent = pedidos[i].protocolo + ' — ' + pedidos[i].tipo + ' — ' + pedidos[i].situacao;
      cartao.appendChild(resumo);
      // apresenta os dados de data e localização
      const dados = document.createElement('p');
      dados.textContent = pedidos[i].horarioSolicitacao + ' — ' + (pedidos[i].local || pedidos[i].estacao || '') + ' — ' + (pedidos[i].linha || '') + ' — ' + (pedidos[i].descricao || '');
      cartao.appendChild(dados);
      // apresenta o motivo informado pelo operador sem interpretar marcação externa
      if (pedidos[i].motivoRecusa) {
        // cria uma explicação textual acessível no acompanhamento do pedido
        const motivo = document.createElement('p');
        motivo.textContent = 'Motivo da recusa: ' + pedidos[i].motivoRecusa;
        cartao.appendChild(motivo);
      }
      // cria a linha de etapas do pedido
      const etapas = document.createElement('ol');
      etapas.className = 'linha-tempo';
      // apresenta somente eventos persistidos no pedido
      for (let j = 0; j < pedidos[i].etapas.length; j = j + 1) {
        // cria o texto de uma etapa registrada
        const etapa = document.createElement('li');
        etapa.className = 'etapa-solicitacao';
        etapa.textContent = pedidos[i].etapas[j].titulo + ' — ' + pedidos[i].etapas[j].horario;
        etapas.appendChild(etapa);
      }
      cartao.appendChild(etapas);
      lista.appendChild(cartao);
    }
  }
  document.getElementById('sem-solicitacoes').hidden = lista.children.length > 0;
  // recupera controles de filtro para sincronizar o destaque
  const botoes = document.querySelectorAll('button[id^="filtro-"]');
  // informa o filtro ativo visualmente e aos leitores de tela
  for (let i = 0; i < botoes.length; i = i + 1) {
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
