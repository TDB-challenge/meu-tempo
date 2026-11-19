// =====================================================
// NAVEGAÇÃO E ABAS DO AMBIENTE ADMINISTRATIVO (admin.js)
// =====================================================
const btnAdminMenuMobile = document.getElementById("btn-admin-menu-mobile");
const adminSidebar = document.getElementById("admin-sidebar");

if (btnAdminMenuMobile && adminSidebar) {
  btnAdminMenuMobile.addEventListener("click", function () {
    adminSidebar.classList.toggle("aberto");
  });
}

// os atributos data-admin-aba identificam os botões; a classe admin-aba-painel identifica as áreas alternadas por eles
const botoesAbaAdmin = document.querySelectorAll("[data-admin-aba]");
const paineisAbaAdmin = document.querySelectorAll(".admin-aba-painel");

// nomeaba é a chave da aba solicitada; o mesmo identificador relaciona seu botão ao painel correspondente
function abrirAbaAdmin(nomeAba) {
  for (let i = 0; i < paineisAbaAdmin.length; i++) {
    paineisAbaAdmin[i].hidden = paineisAbaAdmin[i].id !== "aba-" + nomeAba;
  }
  for (let i = 0; i < botoesAbaAdmin.length; i++) {
    const ativo = botoesAbaAdmin[i].getAttribute("data-admin-aba") === nomeAba;
    botoesAbaAdmin[i].classList.toggle("ativo", ativo);
    // aria informa qual seção está selecionada sem alterar a navegação existente
    if (ativo) botoesAbaAdmin[i].setAttribute("aria-current", "page");
    else botoesAbaAdmin[i].removeAttribute("aria-current");
  }
}

if (botoesAbaAdmin.length > 0) {
  for (let i = 0; i < botoesAbaAdmin.length; i++) {
    botoesAbaAdmin[i].addEventListener("click", function () {
      abrirAbaAdmin(this.getAttribute("data-admin-aba"));
      if (adminSidebar) {
        adminSidebar.classList.remove("aberto");
      }
    });
  }
}

const botoesVoltarVisao = document.querySelectorAll("[data-voltar-visao]");
for (let i = 0; i < botoesVoltarVisao.length; i++) {
  botoesVoltarVisao[i].addEventListener("click", function () {
    abrirAbaAdmin("visao-geral");
  });
}

// =====================================================
// POP-UPS DO TOPBAR (ACESSIBILIDADE, NOTIFICAÇÕES, PERFIL)
// =====================================================
function abrirModalAdmin(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    modal.hidden = false;
  }
}

function fecharTodosModaisAdmin() {
  const modais = document.querySelectorAll(".admin-modal-overlay");
  for (let i = 0; i < modais.length; i++) {
    modais[i].hidden = true;
  }
}

const btnAdminNotificacoes = document.getElementById("btn-admin-notificacoes");
if (btnAdminNotificacoes) {
  btnAdminNotificacoes.addEventListener("click", function () {
    abrirModalAdmin("modal-admin-notificacoes");
  });
}

const btnAdminPerfil = document.getElementById("btn-admin-perfil");
if (btnAdminPerfil) {
  btnAdminPerfil.addEventListener("click", function () {
    abrirModalAdmin("modal-admin-perfil");
  });
}

const botoesFecharModal = document.querySelectorAll("[data-fechar-modal]");
for (let i = 0; i < botoesFecharModal.length; i++) {
  botoesFecharModal[i].addEventListener("click", fecharTodosModaisAdmin);
}

// a classe admin-modal-overlay marca o fundo que envolve a janela; os cliques são recebidos também ao clicar nos elementos internos
const overlaysModais = document.querySelectorAll(".admin-modal-overlay");
for (let i = 0; i < overlaysModais.length; i++) {
  overlaysModais[i].addEventListener("click", function (evento) {
    if (evento.target === this) {
      fecharTodosModaisAdmin();
    }
  });
}

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape") {
    fecharTodosModaisAdmin();
  }
});

// os ajustes visuais utilizam o modal compartilhado de script.js

// =================================================================
// FILA E ATENDIMENTOS DO TRANSPORTE
// =================================================================

// guarda a lista compartilhada entre fila, tabela, histórico e acompanhamento
let chamadosMetro = [];
// seleciona os indicadores e os locais de apresentação dos chamados
const indicadorPendentes = document.getElementById("indicador-pendentes");
const indicadorAndamento = document.getElementById("indicador-andamento");
const indicadorConcluidos = document.getElementById("indicador-concluidos");
const listaChamadosRecentesMetro = document.getElementById("lista-chamados-recentes");
const corpoChamadosMetro = document.getElementById("corpo-chamados");
const corpoHistoricoMetro = document.getElementById("corpo-historico");
const listaNotificacoesMetro = document.getElementById("lista-notificacoes");
const listaModalNotificacoesMetro = document.querySelector("#modal-admin-notificacoes .cet-timeline");
const botaoAtualizarFilaMetro = document.getElementById("btn-atualizar-fila");
const avisoFilaMetro = document.getElementById("aviso-fila-metro");
const formularioRecusaMetro = document.getElementById("formulario-recusa-metro");
const motivoRecusaMetro = document.getElementById("motivo-recusa-metro");

// cria conteúdo seguro utilizando somente texto
// destino recebe o elemento, tag define a estrutura, texto define o conteúdo e classe define o estilo existente
// destino recebe o novo elemento, tag define sua marcação e classe aplica o estilo; o conteúdo é inserido como texto
function adicionarTextoOperacional(destino, tag, texto, classe) {
  // cria o elemento que será apresentado
  const elemento = document.createElement(tag);
  elemento.textContent = texto;
  elemento.className = classe;
  destino.appendChild(elemento);
  return elemento;
}

// verifica se o pedido pertence ao vínculo do profissional conectado
// chamado representa o pedido consultado
function chamadoDaEstacaoMetro(chamado) {
  // impede a apresentação de pedidos antes de identificar o profissional
  if (profissionalAdmin === null) return false;
  // compara a estação e a instituição sem mudar o vínculo do pedido
  if (chamado.estacao !== profissionalAdmin.estacao || chamado.orgao !== profissionalAdmin.orgao) return false;
  // verifica a linha quando ela faz parte da sessão
  if (profissionalAdmin.linha && chamado.linha !== profissionalAdmin.linha) return false;
  return true;
}

// atualiza os indicadores com os registros da estação
function atualizarIndicadoresMetro() {
  // inicia as contagens dos atendimentos
  let pendentes = 0;
  let andamento = 0;
  let concluidos = 0;
  // percorre os chamados da lista compartilhada
  for (let i = 0; i < chamadosMetro.length; i++) {
    // recupera o pedido atual
    const chamado = chamadosMetro[i];
    // considera somente pedidos vinculados ao profissional
    if (chamadoDaEstacaoMetro(chamado)) {
      // separa os pedidos de acordo com a situação
      if (chamado.situacao === "Pedido recebido") pendentes = pendentes + 1;
      else if (chamado.situacao === "Aprovado" || chamado.situacao === "Funcionário a caminho" || chamado.situacao === "Em atendimento") andamento = andamento + 1;
      else if (chamado.situacao === "Concluído") concluidos = concluidos + 1;
    }
  }
  indicadorPendentes.textContent = pendentes;
  indicadorAndamento.textContent = andamento;
  indicadorConcluidos.textContent = concluidos;
}

// cria as mesmas ações para a fila e para a tabela
// chamado identifica o atendimento, destino recebe os botões e origem diferencia seus ids
function criarAcoesChamadoMetro(chamado, destino, origem) {
  // guarda as ações permitidas para a situação atual
  const acoes = [];
  // disponibiliza somente ações compatíveis com o atendimento
  if (chamado.situacao === "Pedido recebido") {
    acoes.push({acao: "aceitar", texto: "Aceitar chamado"});
    acoes.push({acao: "recusar", texto: "Recusar chamado"});
  } else if (chamado.situacao === "Funcionário a caminho" || chamado.situacao === "Aprovado") {
    acoes.push({acao: "iniciar", texto: "Iniciar atendimento"});
  } else if (chamado.situacao === "Em atendimento") {
    acoes.push({acao: "concluir", texto: "Concluir atendimento"});
  }
  acoes.push({acao: "acompanhar", texto: "Ver acompanhamento do cidadão"});
  // percorre as ações permitidas e conecta o mesmo evento aos dois locais
  for (let i = 0; i < acoes.length; i++) {
    // cria um botão para a ação atual
    const botao = adicionarTextoOperacional(destino, "button", acoes[i].texto, "btn btn-contorno");
    botao.type = "button";
    // destaca a próxima etapa e mantém as ações secundárias em contorno
    if (acoes[i].acao === "aceitar" || acoes[i].acao === "iniciar" || acoes[i].acao === "concluir") botao.className = "btn";
    botao.id = origem + acoes[i].acao + "-" + chamado.protocolo.toLowerCase().replace("-", "");
    // data relaciona o botão à ação e ao protocolo sem usar textos como identificadores
    botao.setAttribute("data-acao-chamado", acoes[i].acao);
    botao.setAttribute("data-protocolo", chamado.protocolo);
    // aria diferencia ações iguais de pedidos diferentes
    botao.setAttribute("aria-label", acoes[i].texto + " · " + chamado.protocolo);
    // executa a função compartilhada ao clicar
    botao.addEventListener("click", alterarChamadoMetro);
  }
}

// apresenta os mesmos registros na fila e na tabela
function exibirChamadosMetro() {
  listaChamadosRecentesMetro.textContent = "";
  corpoChamadosMetro.textContent = "";
  // conta os pedidos que podem ser apresentados
  let quantidade = 0;
  // percorre a lista para montar os dois locais de apresentação
  for (let i = 0; i < chamadosMetro.length; i++) {
    // recupera o pedido atual
    const chamado = chamadosMetro[i];
    // apresenta somente os pedidos da estação conectada
    if (chamadoDaEstacaoMetro(chamado)) {
      quantidade = quantidade + 1;
      // cria o cartão da fila e suas informações
      const cartao = adicionarTextoOperacional(listaChamadosRecentesMetro, "article", "", "admin-chamado-item");
      cartao.setAttribute("data-protocolo", chamado.protocolo);
      const meta = adicionarTextoOperacional(cartao, "div", "", "admin-chamado-meta");
      adicionarTextoOperacional(meta, "span", chamado.protocolo + " · " + chamado.horarioSolicitacao, "");
      adicionarTextoOperacional(meta, "span", chamado.situacao, "admin-status-pill");
      adicionarTextoOperacional(cartao, "h3", chamado.nome, "");
      adicionarTextoOperacional(cartao, "p", chamado.tipo + " · Origem: " + chamado.origem, "admin-chamado-local");
      adicionarTextoOperacional(cartao, "p", chamado.linha + " · " + chamado.estacao, "admin-chamado-local");
      adicionarTextoOperacional(cartao, "p", "Encontro: " + chamado.encontro, "admin-chamado-local");
      adicionarTextoOperacional(cartao, "p", chamado.credencial, "admin-chamado-credencial");
      const acoes = adicionarTextoOperacional(cartao, "div", "", "admin-chamado-acoes");
      criarAcoesChamadoMetro(chamado, acoes, "fila-");
      // cria a linha correspondente na tabela usando o mesmo pedido
      const linha = document.createElement("tr");
      linha.setAttribute("data-protocolo", chamado.protocolo);
      adicionarTextoOperacional(linha, "td", chamado.protocolo, "coord-td-proto");
      adicionarTextoOperacional(linha, "td", chamado.tipo + " · " + chamado.nome, "");
      adicionarTextoOperacional(linha, "td", chamado.local, "");
      const colunaSituacao = adicionarTextoOperacional(linha, "td", "", "");
      const situacao = adicionarTextoOperacional(colunaSituacao, "span", chamado.situacao, "admin-status-pill");
      situacao.id = "situacao-" + chamado.protocolo.toLowerCase().replace("-", "");
      const colunaAcoes = adicionarTextoOperacional(linha, "td", "", "");
      const botoes = adicionarTextoOperacional(colunaAcoes, "div", "", "admin-chamado-acoes");
      criarAcoesChamadoMetro(chamado, botoes, "");
      corpoChamadosMetro.appendChild(linha);
    }
  }
  // informa quando não existem pedidos para o vínculo conectado
  if (quantidade === 0) {
    adicionarTextoOperacional(listaChamadosRecentesMetro, "p", "Nenhum chamado vinculado à sua estação.", "painel-status");
    const linhaVazia = document.createElement("tr");
    const colunaVazia = adicionarTextoOperacional(linhaVazia, "td", "Nenhum chamado vinculado à sua estação.", "");
    colunaVazia.colSpan = 5;
    corpoChamadosMetro.appendChild(linhaVazia);
  }
}

// registra uma etapa no momento em que a ação ocorre
// chamado recebe a etapa e titulo identifica o andamento registrado
function registrarEtapaMetro(chamado, titulo) {
  // guarda o horário real da ação executada
  const data = new Date();
  const horario = data.toLocaleString("pt-BR");
  chamado.etapas.push({titulo: titulo, horario: horario, instante: data.toISOString()});
  chamado.situacao = titulo;
  // mantém a data utilizada no histórico de conclusão
  if (titulo === "Concluído") chamado.dataConclusao = horario;
}

// apresenta o acompanhamento e, quando solicitado, o campo de recusa
// chamado fornece os dados e recusar indica se o profissional deseja informar o motivo
function abrirAcompanhamentoMetro(chamado, recusar) {
  // seleciona os locais de apresentação dentro da janela
  const dados = document.getElementById("dados-acompanhamento-metro");
  const etapas = document.getElementById("etapas-acompanhamento-metro");
  dados.textContent = "";
  etapas.textContent = "";
  adicionarTextoOperacional(dados, "h3", chamado.nome + " · " + chamado.protocolo, "");
  adicionarTextoOperacional(dados, "p", chamado.tipo + " · " + chamado.linha + " · " + chamado.estacao, "admin-chamado-local");
  adicionarTextoOperacional(dados, "p", "Encontro: " + chamado.encontro, "admin-chamado-local");
  adicionarTextoOperacional(dados, "p", chamado.situacao, "admin-status-pill");
  // informa o motivo somente quando o pedido foi recusado
  if (chamado.motivoRecusa) adicionarTextoOperacional(dados, "p", "Motivo: " + chamado.motivoRecusa, "painel-status");
  // define as etapas normais do acompanhamento
  const titulos = ["Pedido recebido", "Aprovado", "Funcionário a caminho", "Em atendimento", "Concluído"];
  // acrescenta a recusa como etapa final quando ela ocorreu
  if (chamado.situacao === "Recusado") titulos.push("Recusado");
  // percorre as etapas e destaca somente as registradas
  for (let i = 0; i < titulos.length; i++) {
    // procura o horário que realmente foi registrado para esta etapa
    let horario = "";
    for (let j = 0; j < chamado.etapas.length; j++) {
      // compara o título com o registro salvo
      if (chamado.etapas[j].titulo === titulos[i]) horario = chamado.etapas[j].horario;
    }
    // cria o item da linha do tempo
    const item = adicionarTextoOperacional(etapas, "li", "", "etapa-pendente");
    const icone = adicionarTextoOperacional(item, "span", "○", "cet-timeline-icone");
    const conteudo = adicionarTextoOperacional(item, "div", "", "");
    adicionarTextoOperacional(conteudo, "strong", titulos[i], "");
    // diferencia etapas realizadas das etapas futuras
    if (horario) {
      item.className = "etapa-realizada";
      icone.textContent = "✓";
      adicionarTextoOperacional(conteudo, "p", horario, "");
    } else {
      adicionarTextoOperacional(conteudo, "p", "Etapa não realizada", "");
    }
  }
  formularioRecusaMetro.hidden = !recusar;
  formularioRecusaMetro.setAttribute("data-protocolo", chamado.protocolo);
  motivoRecusaMetro.value = "";
  document.getElementById("aviso-recusa-metro").textContent = "";
  abrirModalAdmin("modal-acompanhamento-metro");
  // posiciona o foco no campo ou no título da janela
  if (recusar) motivoRecusaMetro.focus();
  else document.getElementById("titulo-acompanhamento-metro").focus();
}

// executa a mesma ação a partir da fila ou da tabela
// event identifica o botão que recebeu o clique
function alterarChamadoMetro(event) {
  // recupera a ação e o protocolo pelos atributos do botão
  const botao = event.currentTarget;
  const protocolo = botao.getAttribute("data-protocolo");
  const acao = botao.getAttribute("data-acao-chamado");
  // percorre os pedidos para encontrar o atendimento selecionado
  for (let i = 0; i < chamadosMetro.length; i++) {
    // recupera o pedido atual
    const chamado = chamadosMetro[i];
    // verifica o protocolo e o vínculo antes de permitir uma ação
    if (chamado.protocolo === protocolo && chamadoDaEstacaoMetro(chamado)) {
      // apresenta o acompanhamento sem mudar a situação
      if (acao === "acompanhar") {
        abrirAcompanhamentoMetro(chamado, false);
        return;
      }
      // solicita o motivo antes de recusar um pedido pendente
      if (acao === "recusar" && chamado.situacao === "Pedido recebido") {
        abrirAcompanhamentoMetro(chamado, true);
        return;
      }
      // registra a aprovação e a saída do funcionário na mesma ação
      if (acao === "aceitar" && chamado.situacao === "Pedido recebido") {
        registrarEtapaMetro(chamado, "Aprovado");
        registrarEtapaMetro(chamado, "Funcionário a caminho");
      } else if (acao === "iniciar" && (chamado.situacao === "Funcionário a caminho" || chamado.situacao === "Aprovado")) {
        // registra o início do atendimento
        registrarEtapaMetro(chamado, "Em atendimento");
      } else if (acao === "concluir" && chamado.situacao === "Em atendimento") {
        // registra a conclusão e seu horário
        registrarEtapaMetro(chamado, "Concluído");
      } else {
        // impede ações incompatíveis com a situação atual
        return;
      }
      localStorage.setItem("metro-chamados", JSON.stringify(chamadosMetro));
      atualizarChamadoMetro(chamado);
      return;
    }
  }
}

// confirma a recusa após o preenchimento do motivo
// event representa o envio do formulário da janela
function confirmarRecusaMetro(event) {
  event.preventDefault();
  // recupera os dados informados na janela
  const protocolo = formularioRecusaMetro.getAttribute("data-protocolo");
  const motivo = motivoRecusaMetro.value.trim();
  // mantém a janela aberta quando não há motivo
  if (motivo === "") {
    document.getElementById("aviso-recusa-metro").textContent = "Informe o motivo da recusa.";
    return;
  }
  // percorre os pedidos antes de registrar uma recusa válida
  for (let i = 0; i < chamadosMetro.length; i++) {
    // recupera o atendimento atual
    const chamado = chamadosMetro[i];
    // permite a recusa somente enquanto o pedido está pendente
    if (chamado.protocolo === protocolo && chamado.situacao === "Pedido recebido" && chamadoDaEstacaoMetro(chamado)) {
      chamado.motivoRecusa = motivo;
      registrarEtapaMetro(chamado, "Recusado");
      localStorage.setItem("metro-chamados", JSON.stringify(chamadosMetro));
      atualizarChamadoMetro(chamado);
      fecharTodosModaisAdmin();
      return;
    }
  }
}

// adiciona um atendimento concluído ao histórico apresentado
// chamado representa o atendimento já registrado na lista compartilhada
function adicionarHistoricoMetro(chamado) {
  // cria a linha e sua lista de informações
  const linha = document.createElement("tr");
  const informacoes = [chamado.protocolo, chamado.tipo, chamado.local, chamado.dataConclusao, chamado.situacao];
  // cria cada célula como texto
  for (let i = 0; i < informacoes.length; i++) {
    adicionarTextoOperacional(linha, "td", informacoes[i], "");
  }
  corpoHistoricoMetro.appendChild(linha);
}

// apresenta uma mensagem nas duas listas de notificações
// mensagem representa o texto do andamento e horario identifica o momento registrado
function adicionarNotificacaoMetro(mensagem, horario) {
  // reúne os dois locais que recebem a mesma informação
  const listas = [listaNotificacoesMetro, listaModalNotificacoesMetro];
  // apresenta a mensagem nas duas listas
  for (let i = 0; i < listas.length; i++) {
    // cria o aviso e seu conteúdo
    const item = document.createElement("li");
    const conteudo = adicionarTextoOperacional(item, "div", "", "");
    adicionarTextoOperacional(conteudo, "strong", mensagem, "");
    adicionarTextoOperacional(conteudo, "p", horario, "");
    listas[i].prepend(item);
  }
}

// transforma o horário brasileiro em um instante para ordenar as notificações
// horario representa a data apresentada e instante preserva a ordem exata das ações novas
function instanteHorarioMetro(horario, instante) {
  // utiliza o registro completo quando a etapa possui esse dado
  if (instante) return new Date(instante).getTime();
  // separa a data e a hora sem assumir outro formato regional
  if (typeof horario !== "string" || horario.indexOf(",") === -1) return 0;
  const partes = horario.split(",");
  const data = partes[0].trim().split("/");
  const hora = partes[1].trim().split(":");
  // verifica se o registro possui as partes necessárias
  if (data.length !== 3 || hora.length !== 3) return 0;
  const dataConvertida = new Date(Number(data[2]), Number(data[1]) - 1, Number(data[0]), Number(hora[0]), Number(hora[1]), Number(hora[2]));
  return dataConvertida.getTime();
}

// atualiza o histórico e as notificações a partir das etapas armazenadas
function exibirRegistrosMetro() {
  corpoHistoricoMetro.textContent = "";
  listaNotificacoesMetro.textContent = "";
  listaModalNotificacoesMetro.textContent = "";
  // guarda os avisos que serão ordenados pelo horário registrado
  const avisos = [];
  // percorre os pedidos da estação sem gerar registros duplicados
  for (let i = 0; i < chamadosMetro.length; i++) {
    // recupera o atendimento atual
    const chamado = chamadosMetro[i];
    // considera somente o vínculo do profissional
    if (chamadoDaEstacaoMetro(chamado)) {
      // apresenta no histórico apenas os atendimentos concluídos
      if (chamado.situacao === "Concluído") adicionarHistoricoMetro(chamado);
      // transforma cada etapa realmente realizada em uma notificação
      for (let j = 0; j < chamado.etapas.length; j++) {
        avisos.push({mensagem: chamado.protocolo + " · " + chamado.etapas[j].titulo, horario: chamado.etapas[j].horario, instante: chamado.etapas[j].instante, ordem: avisos.length});
      }
    }
  }
  // ordena do horário mais antigo para o mais recente antes de inserir no início
  for (let i = 0; i < avisos.length; i++) {
    for (let j = i + 1; j < avisos.length; j++) {
      // troca os avisos quando o segundo ocorreu antes do primeiro
      const primeiro = instanteHorarioMetro(avisos[i].horario, avisos[i].instante);
      const segundo = instanteHorarioMetro(avisos[j].horario, avisos[j].instante);
      // preserva a ordem das etapas quando dois registros possuem o mesmo horário
      if (segundo < primeiro || (segundo === primeiro && avisos[j].ordem < avisos[i].ordem)) {
        const anterior = avisos[i];
        avisos[i] = avisos[j];
        avisos[j] = anterior;
      }
    }
  }
  // apresenta os avisos nas duas listas com o mais recente no topo
  for (let i = 0; i < avisos.length; i++) adicionarNotificacaoMetro(avisos[i].mensagem, avisos[i].horario);
  // informa quando o histórico ou as notificações ainda não possuem registros
  if (corpoHistoricoMetro.rows.length === 0) {
    const linha = document.createElement("tr");
    const coluna = adicionarTextoOperacional(linha, "td", "Nenhum atendimento concluído nesta estação.", "");
    coluna.colSpan = 5;
    corpoHistoricoMetro.appendChild(linha);
  }
  // apresenta a mesma indicação de lista vazia nos dois locais
  if (listaNotificacoesMetro.children.length === 0) adicionarNotificacaoMetro("Nenhuma atualização nesta estação.", "");
}

// sincroniza todas as apresentações após uma alteração
// chamado identifica o atendimento que acabou de mudar
function atualizarChamadoMetro(chamado) {
  exibirChamadosMetro();
  atualizarIndicadoresMetro();
  exibirRegistrosMetro();
  avisoFilaMetro.textContent = chamado.protocolo + " · " + chamado.situacao;
}

// recupera os dados e demonstra o recebimento de um único pedido adicional
function atualizarFilaMetro() {
  // lê novamente a lista compartilhada para recuperar mudanças já salvas
  chamadosMetro = buscarChamadosMetro();
  // verifica se o pedido adicional já existe
  let possuiNovoPedido = false;
  for (let i = 0; i < chamadosMetro.length; i++) {
    // compara o protocolo único da solicitação de demonstração
    if (chamadosMetro[i].protocolo === "MT-1043") possuiNovoPedido = true;
  }
  // insere o exemplo somente na estação à qual ele pertence
  if (possuiNovoPedido === false && profissionalAdmin.estacao === "Consolação" && profissionalAdmin.orgao === "metro" && profissionalAdmin.linha === "Linha 2 - Verde") {
    // prepara o novo pedido com o horário atual
    const novo = criarChamadoTransporte("MT-1043", "Carlos Mendes", "Apoio no desembarque", new Date().toLocaleString("pt-BR"), "Bloqueio norte", "IARA");
    novo.credencial = "Credencial não informada";
    chamadosMetro.push(novo);
  }
  localStorage.setItem("metro-chamados", JSON.stringify(chamadosMetro));
  exibirChamadosMetro();
  atualizarIndicadoresMetro();
  exibirRegistrosMetro();
  avisoFilaMetro.textContent = "Fila atualizada com os pedidos vinculados à estação.";
}

// =====================================================
// PAINEL CET · GESTÃO VIÁRIA (admin/cet.html)
// =====================================================
const listaDecisoesCet = document.getElementById("lista-decisoes-cet");

if (listaDecisoesCet) {
  let contadorTr = 103;
  let totalRecebidas = 2;
  let totalAprovados = 1;
  let totalRecusados = 1;

  const kpiRecebidas = document.getElementById("kpi-cet-recebidas");
  const kpiAprovados = document.getElementById("kpi-cet-aprovados");
  const kpiRecusados = document.getElementById("kpi-cet-recusados");
  const avisoDecisoesCet = document.getElementById("aviso-decisoes-cet");
  const espelhoDecisoesCet = document.getElementById("espelho-decisoes-cet");

  function sincronizarDecisoesCet() {
    if (kpiRecebidas) kpiRecebidas.textContent = totalRecebidas;
    if (kpiAprovados) kpiAprovados.textContent = totalAprovados;
    if (kpiRecusados) kpiRecusados.textContent = totalRecusados;
    if (espelhoDecisoesCet) {
      espelhoDecisoesCet.innerHTML = listaDecisoesCet.innerHTML;
    }
  }

  sincronizarDecisoesCet();

  function adicionarCicloCet(aprovado) {
    const agora = new Date();
    const hora =
      String(agora.getHours()).padStart(2, "0") +
      ":" +
      String(agora.getMinutes()).padStart(2, "0");

    const protocolo = "TR-" + contadorTr++;
    totalRecebidas++;

    const novoCard = document.createElement("article");
    novoCard.className = "admin-chamado-item";

    if (aprovado) {
      totalAprovados++;
      novoCard.innerHTML =
        '<div class="admin-chamado-meta">' +
        "<span>" +
        protocolo +
        " · " +
        hora +
        " · Origem: IARA</span>" +
        '<span class="admin-status-pill cet-pill-aprovado">' +
        '<img src="../../assets/icones/check.png" alt="" class="icone" /> APROVADO' +
        "</span>" +
        "</div>" +
        "<h3>Av. Paulista &times; Av. Brigadeiro Luís Antônio</h3>" +
        '<div class="cet-ciclo-grid">' +
        '<div><span class="cet-ciclo-label">Verde veicular restante</span><strong>14 segundos</strong></div>' +
        '<div><span class="cet-ciclo-label">Decisão do ciclo</span><strong>28 segundos totais programados</strong></div>' +
        '<div><span class="cet-ciclo-label">Alertas</span><strong>Standby · Não liberados</strong></div>' +
        "</div>" +
        '<p class="cet-ciclo-nota">Pedido aceito. Aguardando transição do ciclo; ainda não é uma liberação de travessia.</p>';

      if (avisoDecisoesCet) {
        avisoDecisoesCet.textContent =
          "Nova decisão (" +
          protocolo +
          "): pedido aprovado, aguardando transição.";
      }
    } else {
      totalRecusados++;
      novoCard.innerHTML =
        '<div class="admin-chamado-meta">' +
        "<span>" +
        protocolo +
        " · " +
        hora +
        " · Origem: IARA</span>" +
        '<span class="admin-status-pill cet-pill-recusado">' +
        '<img src="../../assets/icones/clock.png" alt="" class="icone" /> RECUSADO' +
        "</span>" +
        "</div>" +
        "<h3>Av. Paulista &times; Rua Augusta</h3>" +
        '<div class="cet-ciclo-grid">' +
        '<div><span class="cet-ciclo-label">Verde veicular restante</span><strong>5 segundos</strong></div>' +
        '<div><span class="cet-ciclo-label">Decisão do ciclo</span><strong>Sem alteração neste ciclo</strong></div>' +
        '<div><span class="cet-ciclo-label">Alertas</span><strong>Standby · Não liberados</strong></div>' +
        "</div>" +
        '<p class="cet-ciclo-nota">O ciclo não é alterado quando restam oito segundos ou menos de verde veicular.</p>';

      if (avisoDecisoesCet) {
        avisoDecisoesCet.textContent =
          "Nova decisão (" +
          protocolo +
          "): pedido recusado pois restam 8s ou menos no ciclo.";
      }
    }

    listaDecisoesCet.prepend(novoCard);
    sincronizarDecisoesCet();
  }

  const btnAddAprovado = document.getElementById("btn-cet-add-aprovado");
  const btnAddRecusado = document.getElementById("btn-cet-add-recusado");

  if (btnAddAprovado) {
    btnAddAprovado.addEventListener("click", function () {
      adicionarCicloCet(true);
    });
  }
  if (btnAddRecusado) {
    btnAddRecusado.addEventListener("click", function () {
      adicionarCicloCet(false);
    });
  }

  // Pesquisa ao vivo na aba Cruzamentos
  const inputBuscaCruzamento = document.getElementById("busca-cruzamento");
  const listaCruzamentos = document.getElementById("lista-cruzamentos-cet");

  if (inputBuscaCruzamento && listaCruzamentos) {
    inputBuscaCruzamento.addEventListener("input", function () {
      const termo = this.value.toLowerCase().trim();
      const itens = listaCruzamentos.querySelectorAll("[data-cruzamento]");

      for (let i = 0; i < itens.length; i++) {
        const texto = itens[i].textContent.toLowerCase();
        itens[i].hidden = termo !== "" && !texto.includes(termo);
      }
    });
  }

  // Atualização de status na aba Zeladoria viária
  const statusZeladoria = document.getElementById("status-zeladoria-mt1041");
  const avisoZeladoria = document.getElementById("aviso-zeladoria");
  const btnZeladoriaAnalise = document.getElementById("btn-zeladoria-analise");
  const btnZeladoriaResolvido = document.getElementById(
    "btn-zeladoria-resolvido",
  );

  if (btnZeladoriaAnalise && statusZeladoria) {
    btnZeladoriaAnalise.addEventListener("click", function () {
      statusZeladoria.textContent = "Em análise";
      statusZeladoria.className = "admin-status-pill cet-pill-recusado";
      if (avisoZeladoria) {
        avisoZeladoria.textContent =
          "Pedido ZEL-1041: Em análise. O pedido foi atualizado.";
      }
    });
  }

  if (btnZeladoriaResolvido && statusZeladoria) {
    btnZeladoriaResolvido.addEventListener("click", function () {
      statusZeladoria.textContent = "Concluído";
      statusZeladoria.className = "admin-status-pill cet-pill-aprovado";
      if (avisoZeladoria) {
        avisoZeladoria.textContent =
          "Pedido ZEL-1041: Concluído. O pedido foi atualizado.";
      }
    });
  }
}

// =====================================================
// PAINEL COORDENAÇÃO OPERACIONAL (admin/coordenacao.html)
// =====================================================
// mensagem é o aviso temporário mostrado ao usuário; o temporizador evita manter o aviso aberto indefinidamente
function mostrarToastAdmin(mensagem) {
  const toast = document.getElementById("admin-toast");
  if (!toast) return;

  toast.textContent = mensagem;
  toast.hidden = false;

  clearTimeout(window.timerToastAdmin);
  window.timerToastAdmin = setTimeout(function () {
    toast.hidden = true;
  }, 3500);
}

// Filtros dinâmicos da Central de acompanhamento
const filtroCoordOrgao = document.getElementById("filtro-coord-orgao");
const filtroCoordLocal = document.getElementById("filtro-coord-local");
const filtroCoordSituacao = document.getElementById("filtro-coord-situacao");
const filtroCoordPeriodo = document.getElementById("filtro-coord-periodo");
const tbodyCoordPedidos = document.getElementById("tbody-coord-pedidos");

function filtrarPedidosCoordenacao() {
  if (!tbodyCoordPedidos) return;

  const orgao = filtroCoordOrgao ? filtroCoordOrgao.value : "todos";
  const local = filtroCoordLocal ? filtroCoordLocal.value : "todos";
  const situacao = filtroCoordSituacao ? filtroCoordSituacao.value : "todos";

  const linhas = tbodyCoordPedidos.querySelectorAll("tr");
  let visiveis = 0;

  for (let i = 0; i < linhas.length; i++) {
    const matchOrgao =
      orgao === "todos" || linhas[i].getAttribute("data-orgao") === orgao;
    const matchLocal =
      local === "todos" || linhas[i].getAttribute("data-local") === local;
    const matchSituacao =
      situacao === "todos" ||
      linhas[i].getAttribute("data-situacao") === situacao;

    // verifica a data quando o filtro pede o dia ou o mês atual
    let correspondePeriodo = true;
    const dataRegistro = linhas[i].getAttribute("data-data-solicitacao");
    if (filtroCoordPeriodo && dataRegistro) {
      const data = new Date(dataRegistro);
      const hoje = new Date();
      if (filtroCoordPeriodo.value === "hoje") correspondePeriodo = data.toDateString() === hoje.toDateString();
      else if (filtroCoordPeriodo.value === "mes") correspondePeriodo = data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
    }
    const exibir = matchOrgao && matchLocal && matchSituacao && correspondePeriodo;
    linhas[i].hidden = !exibir;
    if (exibir) visiveis++;
  }

  const contagemTexto = document.getElementById("contagem-coord-pedidos");
  const tabelaWrapper = document.getElementById("tabela-coord-wrapper");
  const estadoVazio = document.getElementById("vazio-coord-pedidos");

  if (contagemTexto) {
    const plural =
      visiveis === 1 ? "solicitação encontrada" : "solicitações encontradas";
    contagemTexto.textContent =
      visiveis + " " + plural + " · Período selecionado";
  }

  if (tabelaWrapper && estadoVazio) {
    tabelaWrapper.hidden = visiveis === 0;
    estadoVazio.hidden = visiveis > 0;
  }
}

if (tbodyCoordPedidos) {
  const selectsFiltro = [
    filtroCoordOrgao,
    filtroCoordLocal,
    filtroCoordSituacao,
    filtroCoordPeriodo,
  ];
  for (let i = 0; i < selectsFiltro.length; i++) {
    if (selectsFiltro[i]) {
      selectsFiltro[i].addEventListener("change", filtrarPedidosCoordenacao);
    }
  }
}

// Botão "Ver solicitações ->" na aba Estações
const botoesVerEstacao = document.querySelectorAll("[data-filtrar-estacao]");
for (let i = 0; i < botoesVerEstacao.length; i++) {
  botoesVerEstacao[i].addEventListener("click", function () {
    const localEstacao = this.getAttribute("data-filtrar-estacao");
    abrirAbaAdmin("visao-geral");
    if (filtroCoordLocal) {
      filtroCoordLocal.value = localEstacao;
      filtrarPedidosCoordenacao();
    }
  });
}

// Exportar CSV real + Imprimir relatório na aba Relatórios
const btnExportarCsv = document.getElementById("btn-exportar-csv");
if (btnExportarCsv) {
  btnExportarCsv.addEventListener("click", function () {
    // monta o arquivo com as linhas visíveis da tabela consolidada
    let conteudoCsv = "\uFEFFProtocolo;Servico e necessidade;Local;Situacao;Horario\n";
    // percorre os registros apresentados no relatório
    for (let i = 0; i < tbodyCoordPedidos.rows.length; i++) {
      // recupera a linha atual e respeita os filtros ativos
      const linha = tbodyCoordPedidos.rows[i];
      if (linha.hidden === false) {
        // percorre as células e protege os separadores do arquivo
        for (let j = 0; j < linha.cells.length; j++) {
          let texto = linha.cells[j].textContent.trim();
          // impede que textos sejam interpretados como fórmulas da planilha
          if (/^[=+@-]/.test(texto)) texto = "'" + texto;
          conteudoCsv = conteudoCsv + '"' + texto.replace(/"/g, '""') + '"';
          // separa as colunas sem acrescentar separador após a última
          if (j < linha.cells.length - 1) conteudoCsv = conteudoCsv + ";";
        }
        conteudoCsv = conteudoCsv + "\n";
      }
    }

    // blob transforma o texto montado em um arquivo em memória e informa seu formato csv ao navegador
    const blob = new Blob([conteudoCsv], { type: "text/csv;charset=utf-8;" });
    // o endereço temporário aponta para esse arquivo local e permite que o link inicie o download
    const url = URL.createObjectURL(blob);
    const linkDownload = document.createElement("a");
    linkDownload.href = url;
    // download sugere o nome do arquivo salvo pelo navegador, sem enviar o relatório para um servidor
    linkDownload.download = "relatorio-atendimentos-meu-tempo.csv";
    document.body.appendChild(linkDownload);
    linkDownload.click();
    document.body.removeChild(linkDownload);
    // libera a referência temporária depois de acionar o link para evitar reter o arquivo em memória
    URL.revokeObjectURL(url);

    mostrarToastAdmin(
      "Relatório de atendimentos exportado com os filtros selecionados.",
    );
  });
}

const btnImprimirRelatorio = document.getElementById("btn-imprimir-relatorio");
if (btnImprimirRelatorio) {
  btnImprimirRelatorio.addEventListener("click", function () {
    window.print();
  });
}

// Gestão de acessos (Aprovar / Recusar cadastro CAD-2048)
// recupera o modelo e a lista de cadastros da coordenacao
var listaSolicitacoesCadastro = document.getElementById(
  "lista-solicitacoes-cadastro",
);
var modeloSolicitacaoCadastro = document.getElementById(
  "modelo-solicitacao-cadastro",
);
var avisoSolicitacoesCadastro = document.getElementById(
  "aviso-solicitacoes-cadastro",
);

// salva a decisao e apresenta a lista atualizada
function decidirSolicitacaoCadastro() {
  alterarSituacaoCadastro(
    this.getAttribute("data-protocolo"),
    this.getAttribute("data-situacao"),
  );
  exibirSolicitacoesCadastro();
  mostrarToastAdmin("Situação do cadastro atualizada");
}

// apresenta cada solicitacao usando o cartao existente
function exibirSolicitacoesCadastro() {
  var solicitacoes = buscarSolicitacoes();
  listaSolicitacoesCadastro.textContent = "";
  avisoSolicitacoesCadastro.hidden = solicitacoes.length > 0;

  for (var i = 0; i < solicitacoes.length; i++) {
    var cadastro = solicitacoes[i];
    // true copia também os elementos internos do cartão modelo, permitindo preencher cada solicitação separadamente
    var cartao = modeloSolicitacaoCadastro.cloneNode(true);
    cartao.removeAttribute("id");
    cartao.hidden = false;

    // apresenta os dados cadastrados somente como texto
    cartao.querySelector(".admin-chamado-meta span").textContent =
      cadastro.protocolo + " · " + cadastro.orgao;
    cartao.querySelector("h3").textContent = cadastro.nome;
    var local = cadastro.regiao || "";
    if (cadastro.estacao) {
      local = cadastro.estacao;
    }
    if (cadastro.linha) {
      local = local + " · " + cadastro.linha;
    }
    cartao.querySelector(".admin-chamado-local").textContent =
      "Vínculo: " + local;
    cartao.querySelector("[data-dados-solicitacao]").textContent =
      "Matrícula: " +
      cadastro.matricula +
      " · " +
      cadastro.funcao +
      " · E-mail: " +
      cadastro.email;

    // atualiza a situacao e mostra as credenciais apenas na aprovacao
    var situacao = cartao.querySelector(".admin-status-pill");
    situacao.removeAttribute("id");
    situacao.className = "admin-status-pill cet-pill-recusado";
    var credenciais = cartao.querySelector("[data-credenciais-cadastro]");
    credenciais.hidden = true;
    if (cadastro.status === "aprovado") {
      situacao.textContent = "Cadastro aprovado";
      situacao.className = "admin-status-pill cet-pill-aprovado";
      // separa as credenciais sem interpretar os dados como html
      credenciais.textContent = "";
      adicionarTextoOperacional(credenciais, "strong", "Acesso aprovado", "");
      adicionarTextoOperacional(credenciais, "p", "E-mail administrativo: " + cadastro.emailAdministrativo, "admin-chamado-local");
      adicionarTextoOperacional(credenciais, "p", "Senha demonstrativa: MeuTempo123!", "admin-chamado-local");
      credenciais.hidden = false;
    } else if (cadastro.status === "reprovado") {
      situacao.textContent = "Cadastro reprovado";
    } else {
      situacao.textContent = "Aguardando aprovação";
    }

    // associa cada decisao ao protocolo do cadastro correspondente
    var aprovar = cartao.querySelector("#btn-aprovar-cadastro");
    aprovar.removeAttribute("id");
    aprovar.setAttribute("data-protocolo", cadastro.protocolo);
    aprovar.setAttribute("data-situacao", "aprovado");
    aprovar.addEventListener("click", decidirSolicitacaoCadastro);
    var recusar = cartao.querySelector("#btn-recusar-cadastro");
    recusar.removeAttribute("id");
    recusar.setAttribute("data-protocolo", cadastro.protocolo);
    recusar.setAttribute("data-situacao", "reprovado");
    recusar.addEventListener("click", decidirSolicitacaoCadastro);
    listaSolicitacoesCadastro.appendChild(cartao);
  }
}

// executa a listagem somente na pagina que possui a gestao de acessos
if (listaSolicitacoesCadastro && modeloSolicitacaoCadastro) {
  exibirSolicitacoesCadastro();
}

// Abre a aba correta ao chegar em coordenacao.html via âncora (#estacoes, #solicitacoes, etc.)
if (window.location.hash && botoesAbaAdmin.length > 0) {
  const abaHash = window.location.hash.replace("#", "");
  if (document.getElementById("aba-" + abaHash)) {
    abrirAbaAdmin(abaHash);
  }
}

// Faz o botão "Ver relatórios ->" de coordenacao.html abrir diretamente relatorios.html
const botoesIrRelatorios = document.querySelectorAll(
  '[data-admin-aba="relatorios"]',
);
for (let i = 0; i < botoesIrRelatorios.length; i++) {
  botoesIrRelatorios[i].addEventListener("click", function () {
    window.location.href = "relatorios.html";
  });
}

// =================================================================
// VERIFICAÇÃO DA SESSÃO ADMINISTRATIVA
// =================================================================

// recupera a sessão armazenada durante o login
const sessaoAdmin = sessionStorage.getItem("admin-sessao");

// variável que receberá os dados do profissional
let profissionalAdmin = null;

// recupera o endereço da página atual
const paginaAdmin = window.location.pathname;

// função que verifica a sessão e a permissão do profissional
// esta checagem organiza a demonstração no navegador; dados de sessão editáveis localmente não substituem autorização em servidor
function verificarSessaoAdmin() {
  // verifica se existe uma sessão
  if (sessaoAdmin === null) {
    // retorna ao login caso não exista uma sessão
    window.location.replace("login.html");

    return;
  }

  // transforma os dados armazenados em um objeto
  profissionalAdmin = JSON.parse(sessaoAdmin);

  // verifica a permissão do painel de transporte
  if (paginaAdmin.endsWith("/metro.html")) {
    if (profissionalAdmin.funcao !== "Agente de transporte") {
      window.location.replace("login.html");
    }
  }

  // verifica a permissão do painel da cet
  if (paginaAdmin.endsWith("/cet.html")) {
    if (profissionalAdmin.funcao !== "Operador CET") {
      window.location.replace("login.html");
    }
  }

  // verifica a permissão da coordenação e dos relatórios
  if (
    paginaAdmin.endsWith("/coordenacao.html") ||
    paginaAdmin.endsWith("/relatorios.html")
  ) {
    if (profissionalAdmin.funcao !== "Coordenador") {
      window.location.replace("login.html");
    }
  }
}

// verifica se estamos em uma página administrativa
if (
  paginaAdmin.endsWith("/metro.html") ||
  paginaAdmin.endsWith("/cet.html") ||
  paginaAdmin.endsWith("/coordenacao.html") ||
  paginaAdmin.endsWith("/relatorios.html")
) {
  verificarSessaoAdmin();
}

// =================================================================
// ENCERRAMENTO DA SESSÃO ADMINISTRATIVA
// =================================================================

// seleciona todos os links que possuem o atributo data-sair
const botoesSairAdmin = document.querySelectorAll("[data-sair]");

// função que encerra a sessão do profissional
function sairAdmin(event) {
  // impede o comportamento padrão do link
  event.preventDefault();

  // remove a sessão do profissional conectado
  sessionStorage.removeItem("admin-sessao");

  // retorna para o login administrativo
  window.location.replace("login.html");
}

// percorre todos os botões de saída
for (let i = 0; i < botoesSairAdmin.length; i++) {
  // encerra a sessão quando o botão é clicado
  botoesSairAdmin[i].addEventListener("click", sairAdmin);
}

// =================================================================
// IDENTIFICAÇÃO DO PROFISSIONAL
// =================================================================

// função que apresenta os dados do profissional conectado
function exibirDadosProfissional() {
  // identifica a instituição e a linha da conta conectada
  const instituicoes = {metro: "Metrô de São Paulo", cptm: "CPTM", viaquatro: "ViaQuatro", viamobilidade: "ViaMobilidade", cet: "CET"};
  const orgaos = document.querySelectorAll("[data-orgao-profissional]");
  const linhas = document.querySelectorAll("[data-linha-profissional]");
  // percorre os elementos que apresentam o órgão da sessão
  for (let i = 0; i < orgaos.length; i++) orgaos[i].textContent = instituicoes[profissionalAdmin.orgao];
  // apresenta a linha somente quando ela faz parte do vínculo
  for (let i = 0; i < linhas.length; i++) {
    if (profissionalAdmin.linha) linhas[i].textContent = profissionalAdmin.linha;
    else linhas[i].textContent = "Não se aplica ao vínculo";
  }
  // seleciona os elementos que receberão os dados
  const nomes = document.querySelectorAll("[data-nome-profissional]");
  const matriculas = document.querySelectorAll("[data-matricula-profissional]");
  const funcoes = document.querySelectorAll("[data-funcao-profissional]");
  const locais = document.querySelectorAll("[data-local-profissional]");

  // apresenta o nome do profissional
  for (let i = 0; i < nomes.length; i++) {
    nomes[i].textContent = profissionalAdmin.nome;
  }

  // apresenta a matrícula do profissional
  for (let i = 0; i < matriculas.length; i++) {
    matriculas[i].textContent = profissionalAdmin.matricula;
  }

  // apresenta a função do profissional
  for (let i = 0; i < funcoes.length; i++) {
    funcoes[i].textContent = profissionalAdmin.funcao;
  }

  // guarda o local de atuação
  let localAtuacao = "";

  // verifica se o profissional atua em uma estação
  if (profissionalAdmin.estacao) {
    localAtuacao = profissionalAdmin.estacao;
  } else {
    localAtuacao = profissionalAdmin.regiao;
  }

  // apresenta o local de atuação
  for (let i = 0; i < locais.length; i++) {
    locais[i].textContent = localAtuacao;
  }
}

// verifica se existe um profissional conectado
if (profissionalAdmin !== null) {
  // apresenta os dados no painel
  exibirDadosProfissional();
}

// =================================================================
// EQUIPAMENTOS VINCULADOS À ESTAÇÃO
// =================================================================

// guarda os equipamentos existentes e seu vínculo fixo
const equipamentosMetro = buscarEquipamentosMetro();
// seleciona o corpo da tabela e o indicador de disponibilidade
const corpoEquipamentosMetro = document.getElementById("corpo-equipamentos");
const indicadorEquipamentos = document.getElementById("indicador-equipamentos");

// apresenta os equipamentos e as opções de seleção direta
function atualizarEquipamentosMetro() {
  corpoEquipamentosMetro.textContent = "";
  // conta os equipamentos disponíveis para a estação conectada
  let disponiveis = 0;
  // percorre os equipamentos existentes
  for (let i = 0; i < equipamentosMetro.length; i++) {
    // recupera o equipamento atual
    const equipamento = equipamentosMetro[i];
    // apresenta somente o vínculo que pertence ao profissional
    if (equipamento.estacao === profissionalAdmin.estacao && equipamento.orgao === profissionalAdmin.orgao) {
      // cria a linha com os dados do equipamento
      const linha = document.createElement("tr");
      adicionarTextoOperacional(linha, "td", equipamento.nome + " " + equipamento.codigo, "coord-td-proto");
      adicionarTextoOperacional(linha, "td", equipamento.estacao + " · " + equipamento.local, "");
      const colunaSituacao = adicionarTextoOperacional(linha, "td", "", "");
      const situacao = adicionarTextoOperacional(colunaSituacao, "span", equipamento.situacao, "admin-status-pill");
      situacao.id = "situacao-" + equipamento.codigo.toLowerCase().replace("-", "");
      const colunaAcao = adicionarTextoOperacional(linha, "td", "", "");
      // organiza os controles dentro da célula sem modificar sua estrutura
      const grupo = adicionarTextoOperacional(colunaAcao, "div", "", "campo-grupo");
      const seletor = document.createElement("select");
      seletor.id = "selecao-" + equipamento.codigo.toLowerCase().replace("-", "");
      seletor.className = "coord-select";
      // aria identifica o equipamento relacionado à seleção
      seletor.setAttribute("aria-label", "Situação do equipamento " + equipamento.codigo);
      // guarda as situações permitidas para escolha direta
      const opcoes = ["Disponível", "Em manutenção", "Indisponível"];
      // cria as opções de situação
      for (let j = 0; j < opcoes.length; j++) {
        // cria a opção atual
        const opcao = adicionarTextoOperacional(seletor, "option", opcoes[j], "");
        opcao.value = opcoes[j];
      }
      seletor.value = equipamento.situacao;
      grupo.appendChild(seletor);
      // cria a confirmação da situação escolhida
      const botao = adicionarTextoOperacional(grupo, "button", "Salvar situação", "btn btn-contorno");
      botao.type = "button";
      botao.id = "alterar-" + equipamento.codigo.toLowerCase().replace("-", "");
      botao.setAttribute("data-alterar-equipamento", equipamento.codigo);
      // salva somente ao confirmar a escolha
      botao.addEventListener("click", alterarEquipamentoMetro);
      corpoEquipamentosMetro.appendChild(linha);
      // soma os equipamentos que podem ser utilizados
      if (equipamento.situacao === "Disponível") disponiveis = disponiveis + 1;
    }
  }
  indicadorEquipamentos.textContent = disponiveis;
  // apresenta uma indicação quando não há equipamentos vinculados
  if (corpoEquipamentosMetro.rows.length === 0) {
    const linha = document.createElement("tr");
    const coluna = adicionarTextoOperacional(linha, "td", "Nenhum equipamento cadastrado para esta estação.", "");
    coluna.colSpan = 4;
    corpoEquipamentosMetro.appendChild(linha);
  }
}

// confirma e armazena a situação selecionada
// event representa o clique no botão do equipamento
function alterarEquipamentoMetro(event) {
  // identifica o equipamento escolhido
  const codigo = event.currentTarget.getAttribute("data-alterar-equipamento");
  const seletor = document.getElementById("selecao-" + codigo.toLowerCase().replace("-", ""));
  // percorre os equipamentos para localizar o registro
  for (let i = 0; i < equipamentosMetro.length; i++) {
    // verifica o código e o vínculo antes de salvar
    if (equipamentosMetro[i].codigo === codigo && equipamentosMetro[i].estacao === profissionalAdmin.estacao && equipamentosMetro[i].orgao === profissionalAdmin.orgao) {
      equipamentosMetro[i].situacao = seletor.value;
      localStorage.setItem("metro-equipamentos", JSON.stringify(equipamentosMetro));
      atualizarEquipamentosMetro();
      mostrarToastAdmin("Situação do equipamento atualizada.");
      return;
    }
  }
}

// seleciona o formulário de ocorrências
const formularioOcorrenciaMetro = document.getElementById(
  "formulario-ocorrencia",
);

// seleciona os campos do formulário
const tipoOcorrenciaMetro = document.getElementById("tipo-ocorrencia");
const localOcorrenciaMetro = document.getElementById("local-ocorrencia");
const descricaoOcorrenciaMetro = document.getElementById(
  "descricao-ocorrencia",
);

// seleciona a mensagem e a lista de ocorrências
const avisoOcorrenciaMetro = document.getElementById("aviso-ocorrencia");
const listaOcorrenciasMetro = document.getElementById(
  "lista-ocorrencias-metro",
);

// cria uma lista para guardar as ocorrências
let ocorrenciasMetro = [];

// função que apresenta as ocorrências registradas
// função que apresenta os registros vinculados ao profissional
function exibirOcorrenciasMetro() {
  listaOcorrenciasMetro.textContent = "";
  // percorre as ocorrências já armazenadas
  for (let i = 0; i < ocorrenciasMetro.length; i++) {
    // recupera o registro atual
    const ocorrencia = ocorrenciasMetro[i];
    // preserva registros antigos e apresenta os novos somente ao profissional responsável
    if (!ocorrencia.matricula || (ocorrencia.matricula === profissionalAdmin.matricula && ocorrencia.orgao === profissionalAdmin.orgao)) {
      // cria a apresentação organizada do registro
      const item = document.createElement("li");
      adicionarTextoOperacional(item, "strong", ocorrencia.tipo, "");
      adicionarTextoOperacional(item, "p", "Local: " + ocorrencia.local, "admin-chamado-local");
      adicionarTextoOperacional(item, "p", ocorrencia.descricao, "admin-chamado-local");
      // utiliza uma indicação clara quando o registro antigo não possui horário
      let horario = "Horário não registrado";
      if (ocorrencia.dataRegistro) horario = ocorrencia.dataRegistro;
      adicionarTextoOperacional(item, "p", horario, "admin-chamado-local");
      // mantém a situação inicial dos registros anteriores
      let situacao = "Registrada";
      if (ocorrencia.situacao) situacao = ocorrencia.situacao;
      adicionarTextoOperacional(item, "span", situacao, "admin-status-pill");
      listaOcorrenciasMetro.appendChild(item);
    }
  }
  // apresenta a indicação de lista vazia sem inserir conteúdo como html
  if (listaOcorrenciasMetro.children.length === 0) adicionarTextoOperacional(listaOcorrenciasMetro, "li", "Nenhuma ocorrência registrada.", "");
}

// registra a ocorrência mantendo o formulário e a chave já existentes
// event representa o envio do formulário pelo profissional
function registrarOcorrenciaMetro(event) {
  event.preventDefault();
  // verifica se os três campos foram preenchidos
  if (tipoOcorrenciaMetro.value === "" || localOcorrenciaMetro.value.trim() === "" || descricaoOcorrenciaMetro.value.trim() === "") {
    avisoOcorrenciaMetro.textContent = "Preencha todos os campos.";
    return;
  }
  // guarda o registro e o vínculo do profissional responsável
  const ocorrencia = {
    tipo: tipoOcorrenciaMetro.options[tipoOcorrenciaMetro.selectedIndex].text,
    local: localOcorrenciaMetro.value.trim(),
    descricao: descricaoOcorrenciaMetro.value.trim(),
    dataRegistro: new Date().toLocaleString("pt-BR"),
    situacao: "Registrada",
    matricula: profissionalAdmin.matricula,
    orgao: profissionalAdmin.orgao,
    estacao: profissionalAdmin.estacao
  };
  ocorrenciasMetro.push(ocorrencia);
  localStorage.setItem("metro-ocorrencias", JSON.stringify(ocorrenciasMetro));
  exibirOcorrenciasMetro();
  formularioOcorrenciaMetro.reset();
  avisoOcorrenciaMetro.textContent = "Ocorrência registrada com sucesso!";
}


// =================================================================
// CONSOLIDAÇÃO DO TRANSPORTE NA COORDENAÇÃO
// =================================================================

// relaciona a estação aos valores já utilizados pelos filtros
// estacao representa o nome apresentado nos pedidos
function codigoLocalOperacional(estacao) {
  // preserva os valores das opções existentes
  if (estacao === "Consolação") return "consolacao";
  if (estacao === "Paulista") return "paulista";
  if (estacao === "Sé") return "se";
  return estacao;
}

// recupera as situações salvas sem alterar o vínculo dos equipamentos
function recuperarEquipamentosMetro() {
  // recupera as situações dos equipamentos já salvas
  const equipamentosSalvos = lerListaOperacional("metro-equipamentos");
  for (let i = 0; i < equipamentosSalvos.length; i++) {
    // procura o equipamento correspondente sem mudar seu vínculo
    for (let j = 0; j < equipamentosMetro.length; j++) {
      // compara o código e permite somente as três situações previstas
      if (equipamentosSalvos[i].codigo === equipamentosMetro[j].codigo && (equipamentosSalvos[i].situacao === "Disponível" || equipamentosSalvos[i].situacao === "Em manutenção" || equipamentosSalvos[i].situacao === "Indisponível")) {
        equipamentosMetro[j].situacao = equipamentosSalvos[i].situacao;
      }
    }
  }
}

// apresenta os mesmos equipamentos no painel da coordenação
function sincronizarEquipamentosCoordenacao() {
  // seleciona a lista e o indicador que recebem os dados compartilhados
  const lista = document.getElementById("lista-equipamentos-coordenacao");
  const indicador = document.querySelector("[data-elevadores-inoperantes]");
  // guarda a quantidade de elevadores fora de operação
  let inoperantes = 0;
  // percorre os equipamentos mantendo os mesmos códigos do transporte
  for (let i = 0; i < equipamentosMetro.length; i++) {
    // recupera o equipamento atual
    const equipamento = equipamentosMetro[i];
    // conta somente elevadores que não estão disponíveis
    if (equipamento.nome === "Elevador" && equipamento.situacao !== "Disponível") inoperantes = inoperantes + 1;
  }
  // apresenta o indicador quando o cartão existe
  if (indicador) indicador.textContent = inoperantes;
  // monta os cartões somente no painel que possui essa seção
  if (lista) {
    lista.textContent = "";
    for (let i = 0; i < equipamentosMetro.length; i++) {
      // cria o cartão com os dados recuperados do mesmo registro
      const equipamento = equipamentosMetro[i];
      const cartao = adicionarTextoOperacional(lista, "article", "", "card-branco");
      adicionarTextoOperacional(cartao, "h3", equipamento.nome + " " + equipamento.codigo, "");
      adicionarTextoOperacional(cartao, "p", equipamento.estacao + " · " + equipamento.local, "admin-chamado-local");
      adicionarTextoOperacional(cartao, "span", equipamento.situacao, "admin-status-pill");
    }
  }
}

// apresenta os registros atuais nas tabelas consolidadas sem remover os outros serviços
function sincronizarTransporteAdministrativo() {
  // recupera os mesmos pedidos utilizados no painel de transporte
  const pedidos = buscarChamadosMetro();
  // acrescenta os outros serviços sem copiar ou trocar seus protocolos
  const pedidosAplicativo = buscarPedidosOperacionais();
  const registros = [];
  let travessias = 0;
  // conta somente simulações que alcançaram a abertura
  let travessiasAprovadas = 0;
  let zeladoria = 1;
  for (let i = 0; i < pedidos.length; i++) registros.push(pedidos[i]);
  for (let i = 0; i < pedidosAplicativo.length; i++) {
    registros.push(pedidosAplicativo[i]);
    if (travessiaLiberadaAplicativo(pedidosAplicativo[i])) travessiasAprovadas = travessiasAprovadas + 1;
    if (pedidosAplicativo[i].servico === "travessia") travessias = travessias + 1;
    else if (pedidosAplicativo[i].servico === "zeladoria") zeladoria = zeladoria + 1;
  }
  recuperarEquipamentosMetro();
  sincronizarEquipamentosCoordenacao();
  const tabelas = document.querySelectorAll("[data-pedidos-operacionais]");
  // relaciona a situação apresentada aos filtros existentes
  const codigos = {"Pedido recebido": "aguardando", "Aprovado": "aprovado", "Funcionário a caminho": "caminho", "Em atendimento": "atendimento", "Concluído": "concluido", "Recusado": "recusado", "Em análise": "analise", "Aguardando abertura": "aguardando", "Fase de segurança": "aguardando", "Travessia liberada na simulação": "atendimento", "Tempo próximo do fim": "atendimento", "Simulação concluída": "concluido", "Simulação encerrada pelo cidadão": "concluido"};
  // percorre as tabelas da coordenação e dos relatórios
  for (let i = 0; i < tabelas.length; i++) {
    // seleciona as linhas de transporte que serão atualizadas
    const anteriores = tabelas[i].querySelectorAll("[data-pedido-transporte]");
    // remove somente linhas que foram geradas a partir da lista compartilhada
    for (let j = 0; j < anteriores.length; j++) anteriores[j].remove();
    // acrescenta os pedidos preservando as linhas dos demais serviços
    for (let j = 0; j < registros.length; j++) {
      // recupera o atendimento atual sem alterar o serviço de origem
      const pedido = registros[j];
      const linha = document.createElement("tr");
      linha.setAttribute("data-pedido-transporte", pedido.protocolo);
      let orgao = "metro";
      if (pedido.servico === "travessia") orgao = "cet";
      else if (pedido.servico === "zeladoria") orgao = "zeladoria";
      linha.setAttribute("data-orgao", orgao);
      linha.setAttribute("data-local", codigoLocalOperacional(pedido.estacao || pedido.local));
      linha.setAttribute("data-situacao", codigos[pedido.situacao]);
      linha.setAttribute("data-data-solicitacao", pedido.dataSolicitacao || "");
      adicionarTextoOperacional(linha, "td", pedido.protocolo, "coord-td-proto");
      const servico = adicionarTextoOperacional(linha, "td", "", "");
      adicionarTextoOperacional(servico, "strong", pedido.tipo, "");
      adicionarTextoOperacional(servico, "span", pedido.nome + " · " + pedido.orgao.toUpperCase(), "");
      adicionarTextoOperacional(linha, "td", (pedido.linha || "") + " · " + pedido.local, "");
      const situacao = adicionarTextoOperacional(linha, "td", "", "");
      adicionarTextoOperacional(situacao, "span", pedido.situacao, "admin-status-pill");
      adicionarTextoOperacional(linha, "td", pedido.horarioSolicitacao, "");
      tabelas[i].appendChild(linha);
    }
    // atualiza a contagem associada à tabela atual
    // closest sobe pelos elementos ancestrais até encontrar o cartão que contém a tabela atual
    const cartao = tabelas[i].closest(".admin-fila-card");
    const contagem = cartao.querySelector(".coord-contagem-texto");
    if (contagem) contagem.textContent = tabelas[i].rows.length + " solicitações encontradas";
  }
  // atualiza os indicadores gerais a partir da tabela consolidada
  const valores = document.querySelectorAll("[data-total-pedidos]");
  const concluidos = document.querySelectorAll("[data-concluidos-pedidos]");
  // inicia a contagem de registros concluídos
  let quantidadeConcluidos = 0;
  if (tbodyCoordPedidos) {
    // percorre também os registros preservados de outros serviços
    for (let i = 0; i < tbodyCoordPedidos.rows.length; i++) {
      // verifica se a linha corresponde a um atendimento concluído
      if (tbodyCoordPedidos.rows[i].getAttribute("data-situacao") === "concluido") quantidadeConcluidos = quantidadeConcluidos + 1;
    }
    // apresenta os totais consolidados
    for (let i = 0; i < valores.length; i++) valores[i].textContent = tbodyCoordPedidos.rows.length;
    for (let i = 0; i < concluidos.length; i++) concluidos[i].textContent = quantidadeConcluidos;
  }
  // sincroniza os resumos textuais e as barras simples já existentes
  const resumos = document.querySelectorAll("[data-resumo-transporte]");
  for (let i = 0; i < resumos.length; i++) resumos[i].textContent = "Metrô: " + pedidos.length + " solicitações.";
  const outrosResumos = document.querySelectorAll("[data-resumo-servico]");
  for (let i = 0; i < outrosResumos.length; i++) {
    if (outrosResumos[i].getAttribute("data-resumo-servico") === "travessia") outrosResumos[i].textContent = "Travessia: " + travessias + " solicitações.";
    else outrosResumos[i].textContent = "Zeladoria: " + zeladoria + " solicitações.";
  }
  const indicadorTravessias = document.querySelector("[data-travessias-aprovadas]");
  if (indicadorTravessias) indicadorTravessias.textContent = travessiasAprovadas;
  const grupos = document.querySelectorAll(".cet-barras-lista");
  for (let i = 0; i < grupos.length; i++) {
    // percorre as barras para atualizar a quantidade ferroviária
    const barras = grupos[i].querySelectorAll(".cet-barra-linha");
    let maior = 1;
    for (let j = 0; j < barras.length; j++) {
      const valor = barras[j].querySelector(".cet-barra-valor");
      const nomeServico = barras[j].querySelector(".cet-barra-nome").textContent;
      if (nomeServico === "Metrô") valor.textContent = pedidos.length;
      else if (nomeServico === "Travessia") valor.textContent = travessias;
      else if (nomeServico === "Zeladoria") valor.textContent = zeladoria;
      if (Number(valor.textContent) > maior) maior = Number(valor.textContent);
    }
    // mantém a proporção visual das barras com as quantidades apresentadas
    for (let j = 0; j < barras.length; j++) barras[j].querySelector(".cet-barra-preenchimento").style.width = Number(barras[j].querySelector(".cet-barra-valor").textContent) / maior * 100 + "%";
  }
  // atualiza a quantidade de pedidos apresentada em cada estação
  const estacoes = document.querySelectorAll("[data-filtrar-estacao]");
  for (let i = 0; i < estacoes.length; i++) {
    // conta os pedidos que pertencem à estação do cartão
    let quantidade = 0;
    for (let j = 0; j < pedidos.length; j++) {
      if (codigoLocalOperacional(pedidos[j].estacao) === estacoes[i].getAttribute("data-filtrar-estacao")) quantidade = quantidade + 1;
    }
    // atualiza somente a descrição do cartão relacionado ao botão
    const descricao = estacoes[i].closest("article").querySelector("p");
    if (descricao) descricao.textContent = quantidade + " solicitações registradas";
  }
  // atualiza os avisos de transporte sem manter situações fixas contraditórias
  sincronizarEtapasTransporte(registros);
  filtrarPedidosCoordenacao();
}

// atualiza as etapas de transporte nos painéis que apresentam seu acompanhamento
// pedidos representa a lista compartilhada de atendimentos
function sincronizarEtapasTransporte(pedidos) {
  const listas = document.querySelectorAll("[data-etapas-operacionais]");
  // percorre as listas compartilhadas com a coordenação
  for (let i = 0; i < listas.length; i++) {
    // remove apenas etapas de transporte geradas anteriormente
    const anteriores = listas[i].querySelectorAll("[data-etapa-transporte]");
    for (let j = 0; j < anteriores.length; j++) anteriores[j].remove();
    // apresenta as etapas realmente registradas
    for (let j = 0; j < pedidos.length; j++) {
      // percorre as etapas do pedido atual
      for (let k = 0; k < pedidos[j].etapas.length; k++) {
        // cria o registro do andamento
        const item = document.createElement("li");
        item.setAttribute("data-etapa-transporte", pedidos[j].protocolo);
        const conteudo = adicionarTextoOperacional(item, "div", "", "");
        adicionarTextoOperacional(conteudo, "strong", pedidos[j].protocolo + " · " + pedidos[j].etapas[k].titulo, "");
        adicionarTextoOperacional(conteudo, "p", pedidos[j].etapas[k].horario, "");
        listas[i].appendChild(item);
      }
    }
  }
}

// =================================================================
// RECUPERAÇÃO E INICIALIZAÇÃO DO PAINEL DO METRÔ
// =================================================================

// inicia somente depois de verificar a sessão e a função do profissional
if (document.body.classList.contains("pagina-metro") && profissionalAdmin !== null && profissionalAdmin.funcao === "Agente de transporte") {
  // recupera os pedidos sem apagar situações e históricos anteriores
  chamadosMetro = buscarChamadosMetro();
  localStorage.setItem("metro-chamados", JSON.stringify(chamadosMetro));
  recuperarEquipamentosMetro();
  // recupera as ocorrências usando a mesma chave da versão anterior
  ocorrenciasMetro = lerListaOperacional("metro-ocorrencias");
  exibirChamadosMetro();
  atualizarIndicadoresMetro();
  exibirRegistrosMetro();
  atualizarEquipamentosMetro();
  exibirOcorrenciasMetro();
  // atualiza a fila quando o profissional solicita a sincronização
  botaoAtualizarFilaMetro.addEventListener("click", atualizarFilaMetro);
  // registra o motivo somente quando o formulário de recusa é enviado
  formularioRecusaMetro.addEventListener("submit", confirmarRecusaMetro);
  // preserva o envio do formulário existente de ocorrências
  formularioOcorrenciaMetro.addEventListener("submit", registrarOcorrenciaMetro);
}

// utiliza os dados compartilhados apenas nos painéis de consolidação
if ((paginaAdmin.endsWith("/coordenacao.html") || paginaAdmin.endsWith("/relatorios.html")) && profissionalAdmin !== null && profissionalAdmin.funcao === "Coordenador") {
  sincronizarTransporteAdministrativo();
}

// atualiza somente os avisos compartilhados, preservando as ações da cet
if (paginaAdmin.endsWith("/cet.html") && profissionalAdmin !== null && profissionalAdmin.funcao === "Operador CET") {
  sincronizarEtapasTransporte(buscarChamadosMetro());
}

// =================================================================
// ATUALIZAÇÃO DOS DADOS COMPARTILHADOS ENTRE ABAS
// =================================================================

// acompanha alterações feitas em outra aba do mesmo navegador
// event informa qual lista local foi atualizada
function receberAtualizacaoAdministrativa(event) {
  // atualiza solicitações quando a coordenação está aberta
  if (event.key === "admin-solicitacoes" && listaSolicitacoesCadastro && profissionalAdmin !== null && profissionalAdmin.funcao === "Coordenador") exibirSolicitacoesCadastro();
  // sincroniza somente as listas operacionais relacionadas aos painéis
  if (event.key === "metro-chamados" || event.key === "metro-equipamentos" || event.key === "meu-tempo-pedidos") {
    // atualiza a apresentação do transporte sem gravar novamente o mesmo evento
    if (document.body.classList.contains("pagina-metro") && profissionalAdmin !== null && profissionalAdmin.funcao === "Agente de transporte") {
      chamadosMetro = buscarChamadosMetro();
      recuperarEquipamentosMetro();
      exibirChamadosMetro();
      atualizarIndicadoresMetro();
      exibirRegistrosMetro();
      atualizarEquipamentosMetro();
    } else if (profissionalAdmin !== null && profissionalAdmin.funcao === "Coordenador") {
      // atualiza as tabelas consolidadas mantendo os filtros selecionados
      sincronizarTransporteAdministrativo();
    } else if (profissionalAdmin !== null && profissionalAdmin.funcao === "Operador CET") {
      // mantém as notificações compartilhadas da cet coerentes
      sincronizarEtapasTransporte(buscarChamadosMetro());
      exibirPedidosAplicativoCET();
    }
  }
}

// recebe o evento emitido pelo navegador quando outra aba altera os dados
// storage informa alterações feitas por outras páginas da mesma origem; a própria página que gravou não recebe esse evento
window.addEventListener("storage", receberAtualizacaoAdministrativa);

// =================================================================
// SOLICITAÇÕES DO APLICATIVO NA CET
// =================================================================

// verifica a abertura efetivamente registrada na demonstração
// pedido representa o registro compartilhado com o aplicativo
function travessiaLiberadaAplicativo(pedido) {
  // impede incluir zeladoria ou pedidos sem histórico na contagem
  if (pedido.servico !== "travessia" || !Array.isArray(pedido.etapas)) return false;
  // procura a etapa de abertura sem considerar a espera como aprovação
  for (let i = 0; i < pedido.etapas.length; i++) {
    if (pedido.etapas[i].titulo === "Travessia liberada na simulação") return true;
  }
  return false;
}

// apresenta somente os registros relacionados à área viária
function exibirPedidosAplicativoCET() {
  // recupera a lista compartilhada sem modificar os atendimentos ferroviários
  const pedidos = buscarPedidosOperacionais();
  // seleciona os locais destinados a cada serviço
  const destinos = [{id: "lista-pedidos-cet", servico: "travessia"}, {id: "lista-relatos-cet", servico: "zeladoria"}];
  // inicia as contagens adicionais aos exemplos operacionais já existentes
  let recebidos = 0;
  let aprovados = 0;
  let recusados = 0;
  // percorre os serviços sem duplicar sua lógica de apresentação
  for (let i = 0; i < destinos.length; i++) {
    const lista = document.getElementById(destinos[i].id);
    if (lista) {
      lista.textContent = "";
      // apresenta somente os pedidos do serviço correspondente
      for (let j = 0; j < pedidos.length; j++) {
        const pedido = pedidos[j];
        if (pedido.orgao === "cet" && pedido.servico === destinos[i].servico) {
          recebidos = recebidos + 1;
          if (travessiaLiberadaAplicativo(pedido)) aprovados = aprovados + 1;
          if (pedido.situacao === "Recusado") recusados = recusados + 1;
          // cria o cartão utilizando os mesmos textos seguros dos demais painéis
          const cartao = adicionarTextoOperacional(lista, "article", "", "admin-chamado-item");
          const meta = adicionarTextoOperacional(cartao, "div", "", "admin-chamado-meta");
          adicionarTextoOperacional(meta, "span", pedido.protocolo + " · " + pedido.horarioSolicitacao, "");
          adicionarTextoOperacional(meta, "span", pedido.situacao, "admin-status-pill");
          adicionarTextoOperacional(cartao, "h3", pedido.tipo + " · " + pedido.nome, "");
          adicionarTextoOperacional(cartao, "p", pedido.local, "admin-chamado-local");
          // apresenta a reserva e a concessão registradas pelo controlador local
          if (pedido.servico === "travessia") adicionarTextoOperacional(cartao, "p", "Adicional solicitado: " + (pedido.tempoAdicionalSolicitado || 0) + " s. Concedido: " + (pedido.tempoAdicionalConcedido || 0) + " s. Cenário: " + (pedido.cenario || "Anterior") + ".", "admin-chamado-local");
          // inclui a descrição quando o serviço recebeu um relato textual
          if (pedido.descricao) adicionarTextoOperacional(cartao, "p", pedido.descricao, "admin-chamado-local");
          const detalhes = adicionarTextoOperacional(cartao, "details", "", "");
          adicionarTextoOperacional(detalhes, "summary", "Acompanhar etapas", "");
          const etapas = adicionarTextoOperacional(detalhes, "ol", "", "cet-timeline");
          // apresenta somente as etapas efetivamente registradas pelo serviço
          for (let k = 0; k < pedido.etapas.length; k++) {
            const etapa = adicionarTextoOperacional(etapas, "li", "", "");
            adicionarTextoOperacional(etapa, "span", pedido.etapas[k].titulo + " · " + pedido.etapas[k].horario, "");
          }
          // a travessia é automática na simulação; apenas a zeladoria recebe ações manuais
          if (pedido.servico === "zeladoria" && pedido.situacao !== "Concluído" && pedido.situacao !== "Recusado") {
            const acoes = adicionarTextoOperacional(cartao, "div", "", "admin-chamado-acoes");
            const situacoes = ["Em análise", "Concluído"];
            for (let k = 0; k < situacoes.length; k++) {
              const botao = adicionarTextoOperacional(acoes, "button", "Marcar: " + situacoes[k], "btn btn-contorno");
              botao.type = "button";
              // data identifica o registro e a próxima situação da mesma solicitação
              botao.setAttribute("data-pedido-cet", pedido.protocolo);
              botao.setAttribute("data-situacao-cet", situacoes[k]);
              botao.addEventListener("click", alterarPedidoAplicativoCET);
            }
          }
        }
      }
      // informa ausência de pedidos sem apresentar exemplos como novos registros
      if (lista.children.length === 0) adicionarTextoOperacional(lista, "p", "Nenhum pedido do aplicativo para este serviço.", "admin-chamado-local");
    }
  }
  // preserva os exemplos de decisões da cet e soma os pedidos reais da simulação
  const exemplos = document.getElementById("lista-decisoes-cet");
  if (exemplos) {
    document.getElementById("kpi-cet-recebidas").textContent = exemplos.querySelectorAll(".admin-chamado-item").length + recebidos;
    document.getElementById("kpi-cet-aprovados").textContent = exemplos.querySelectorAll(".cet-pill-aprovado").length + aprovados;
    document.getElementById("kpi-cet-recusados").textContent = exemplos.querySelectorAll(".cet-pill-recusado").length + recusados;
  }
}

// atualiza o mesmo relato que o cidadão acompanha no aplicativo
// event representa o botão que informa o protocolo e a situação escolhida
function alterarPedidoAplicativoCET(event) {
  // recupera a solicitação e a decisão do controle
  const protocolo = event.currentTarget.getAttribute("data-pedido-cet");
  const situacao = event.currentTarget.getAttribute("data-situacao-cet");
  const pedidos = buscarPedidosOperacionais();
  // verifica a função antes de alterar o relato
  if (profissionalAdmin === null || profissionalAdmin.funcao !== "Operador CET") return;
  // percorre os pedidos preservando os demais registros
  for (let i = 0; i < pedidos.length; i++) {
    const pedido = pedidos[i];
    // permite modificar somente a zeladoria vinculada à cet e ainda não encerrada
    if (pedido.protocolo === protocolo && pedido.servico === "zeladoria" && pedido.orgao === "cet" && pedido.situacao !== "Concluído" && pedido.situacao !== "Recusado" && pedido.situacao !== situacao) {
      const data = new Date();
      pedido.situacao = situacao;
      pedido.etapas.push({titulo: situacao, horario: data.toLocaleString("pt-BR"), instante: data.toISOString()});
      if (situacao === "Concluído") pedido.dataConclusao = data.toLocaleString("pt-BR");
      salvarPedidoCidadao(pedido);
      exibirPedidosAplicativoCET();
      mostrarToastAdmin("Relato atualizado no acompanhamento do cidadão.");
      return;
    }
  }
}

// conecta os pedidos do aplicativo sem retirar as ações viárias anteriores
if (paginaAdmin.endsWith("/cet.html") && profissionalAdmin !== null && profissionalAdmin.funcao === "Operador CET") {
  exibirPedidosAplicativoCET();
  // recalcula os indicadores depois das ações de demonstração já existentes
  const exemplos = [document.getElementById("btn-cet-add-aprovado"), document.getElementById("btn-cet-add-recusado")];
  for (let i = 0; i < exemplos.length; i++) {
    if (exemplos[i]) exemplos[i].addEventListener("click", exibirPedidosAplicativoCET);
  }
}

// =================================================================
// ATUALIZAÇÃO DOS CICLOS NOS PAINÉIS DE ACOMPANHAMENTO
// =================================================================

// guarda a única consulta periódica das etapas automáticas
let temporizadorCiclosAdmin = null;

// recupera as mudanças programadas quando o aplicativo não está aberto
function atualizarCiclosAdministrativos() {
  // compara o armazenamento para evitar reconstruir tabelas sem necessidade
  const anterior = localStorage.getItem("meu-tempo-pedidos");
  buscarPedidosOperacionais();
  // atualiza somente quando a conciliação registrou uma nova etapa
  if (anterior !== localStorage.getItem("meu-tempo-pedidos")) {
    if (profissionalAdmin.funcao === "Operador CET") exibirPedidosAplicativoCET();
    else sincronizarTransporteAdministrativo();
  }
}

// inicia a consulta apenas nas páginas que acompanham as travessias
if (profissionalAdmin !== null && (profissionalAdmin.funcao === "Operador CET" || profissionalAdmin.funcao === "Coordenador")) {
  // o intervalo solicita uma atualização por segundo, mas abas em segundo plano podem executar os chamados com atraso
  temporizadorCiclosAdmin = setInterval(atualizarCiclosAdministrativos, 1000);
  // encerra a consulta ao sair do painel
  // pagehide permite interromper o intervalo quando a página sai da visualização, inclusive ao entrar no cache de navegação
  window.addEventListener("pagehide", function () {
    clearInterval(temporizadorCiclosAdmin);
    temporizadorCiclosAdmin = null;
  });
  // retoma somente a consulta interrompida pelo histórico do navegador
  // persisted indica retorno pelo cache de navegação; nesse caso o intervalo precisa ser reativado
  window.addEventListener("pageshow", function (evento) {
    if (evento.persisted && temporizadorCiclosAdmin === null) {
      atualizarCiclosAdministrativos();
      temporizadorCiclosAdmin = setInterval(atualizarCiclosAdministrativos, 1000);
    }
  });
}

// revalida a saída ao restaurar uma página administrativa pelo histórico
window.addEventListener("pageshow", function (evento) {
  if (evento.persisted && sessionStorage.getItem("admin-sessao") === null) window.location.replace("login.html");
});
