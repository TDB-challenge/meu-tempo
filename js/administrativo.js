// =====================================================
// NAVEGAÇÃO E ABAS DO AMBIENTE ADMINISTRATIVO (admin.js)
// =====================================================
const seletorAreaTrabalho = document.getElementById("seletor-area-trabalho");

if (seletorAreaTrabalho) {
  seletorAreaTrabalho.addEventListener("change", function () {
    if (this.value) {
      window.location.href = this.value;
    }
  });
}

const btnAdminMenuMobile = document.getElementById("btn-admin-menu-mobile");
const adminSidebar = document.getElementById("admin-sidebar");

if (btnAdminMenuMobile && adminSidebar) {
  btnAdminMenuMobile.addEventListener("click", function () {
    adminSidebar.classList.toggle("aberto");
  });
}

const botoesAbaAdmin = document.querySelectorAll("[data-admin-aba]");
const paineisAbaAdmin = document.querySelectorAll(".admin-aba-painel");

function abrirAbaAdmin(nomeAba) {
  for (let i = 0; i < paineisAbaAdmin.length; i++) {
    paineisAbaAdmin[i].hidden = paineisAbaAdmin[i].id !== "aba-" + nomeAba;
  }
  for (let i = 0; i < botoesAbaAdmin.length; i++) {
    const ativo = botoesAbaAdmin[i].getAttribute("data-admin-aba") === nomeAba;
    botoesAbaAdmin[i].classList.toggle("ativo", ativo);
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

const btnAdminAcess = document.getElementById("btn-admin-acessibilidade");
if (btnAdminAcess) {
  btnAdminAcess.addEventListener("click", function () {
    abrirModalAdmin("modal-admin-acessibilidade");
  });
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

// Controles reais dentro do pop-up "Uma experiência do seu jeito"
const selectFonteModal = document.getElementById("modal-select-fonte");
const toggleContrasteModal = document.getElementById("modal-toggle-contraste");
const toggleIaraModal = document.getElementById("modal-toggle-iara");
const toggleVibrarModal = document.getElementById("modal-toggle-vibrar");
const toggleFonteLegivelModal = document.getElementById("modal-toggle-fonte-legivel");
const toggleTemaEscuroModal = document.getElementById("modal-toggle-tema-escuro");
const btnMaisLeitura = document.getElementById("btn-mais-opcoes-leitura");
const painelMaisLeitura = document.getElementById("painel-mais-leitura");
const btnRestaurarAcess = document.getElementById("btn-restaurar-acess");

if (btnMaisLeitura && painelMaisLeitura) {
  btnMaisLeitura.addEventListener("click", function () {
    const aberto = !painelMaisLeitura.hidden;
    painelMaisLeitura.hidden = aberto;
    this.setAttribute("aria-expanded", String(!aberto));
  });
}

if (selectFonteModal) {
  const fonteSalva = localStorage.getItem("meuTempoAdminFonte") || "100";
  selectFonteModal.value = fonteSalva;
  document.documentElement.style.fontSize = fonteSalva + "%";

  selectFonteModal.addEventListener("change", function () {
    document.documentElement.style.fontSize = this.value + "%";
    localStorage.setItem("meuTempoAdminFonte", this.value);
  });
}

if (toggleContrasteModal) {
  toggleContrasteModal.checked = document.body.classList.contains("alto-contraste");
  toggleContrasteModal.addEventListener("change", function () {
    document.body.classList.toggle("alto-contraste", this.checked);
    localStorage.setItem("altoContraste", this.checked ? "ativo" : "inativo");
  });
}

if (toggleIaraModal) {
  toggleIaraModal.checked = localStorage.getItem("meuTempoIaraVoz") === "ativo";
  toggleIaraModal.addEventListener("change", function () {
    localStorage.setItem("meuTempoIaraVoz", this.checked ? "ativo" : "inativo");
  });
}

if (toggleVibrarModal) {
  toggleVibrarModal.checked = localStorage.getItem("meuTempoVibrar") === "ativo";
  toggleVibrarModal.addEventListener("change", function () {
    localStorage.setItem("meuTempoVibrar", this.checked ? "ativo" : "inativo");
    if (this.checked && navigator.vibrate) {
      navigator.vibrate(120);
    }
  });
}

if (toggleFonteLegivelModal) {
  toggleFonteLegivelModal.checked = document.body.classList.contains("fonte-legivel");
  toggleFonteLegivelModal.addEventListener("change", function () {
    document.body.classList.toggle("fonte-legivel", this.checked);
    localStorage.setItem("fonteLegivel", this.checked ? "ativo" : "inativo");
  });
}

if (toggleTemaEscuroModal) {
  toggleTemaEscuroModal.checked = document.body.classList.contains("tema-escuro");
  toggleTemaEscuroModal.addEventListener("change", function () {
    document.body.classList.toggle("tema-escuro", this.checked);
    localStorage.setItem("temaEscuro", this.checked ? "ativo" : "inativo");
  });
}

if (btnRestaurarAcess) {
  btnRestaurarAcess.addEventListener("click", function () {
    document.documentElement.style.fontSize = "100%";
    document.body.classList.remove("alto-contraste", "fonte-legivel", "tema-escuro");

    localStorage.setItem("meuTempoAdminFonte", "100");
    localStorage.setItem("altoContraste", "inativo");
    localStorage.setItem("meuTempoIaraVoz", "inativo");
    localStorage.setItem("meuTempoVibrar", "inativo");
    localStorage.setItem("fonteLegivel", "inativo");
    localStorage.setItem("temaEscuro", "inativo");

    if (selectFonteModal) selectFonteModal.value = "100";
    if (toggleContrasteModal) toggleContrasteModal.checked = false;
    if (toggleIaraModal) toggleIaraModal.checked = false;
    if (toggleVibrarModal) toggleVibrarModal.checked = false;
    if (toggleFonteLegivelModal) toggleFonteLegivelModal.checked = false;
    if (toggleTemaEscuroModal) toggleTemaEscuroModal.checked = false;
  });
}

// =================================================================
// CHAMADOS DE APOIO DO METRÔ
// =================================================================

// seleciona os botões de atendimento
const botoesChamadosMetro = document.querySelectorAll("[data-acao-chamado]");

// seleciona os indicadores da visão geral
const indicadorPendentes = document.getElementById("indicador-pendentes");
const indicadorAndamento = document.getElementById("indicador-andamento");
const indicadorConcluidos = document.getElementById("indicador-concluidos");

// guarda os chamados fictícios da estação
const chamadosMetro = [

    {
        protocolo: "MT-1042",
        situacao: "Aguardando agente"
    },

    {
        protocolo: "MT-1041",
        situacao: "Em atendimento"
    }

];


// =================================================================
// INDICADORES DA VISÃO GERAL
// =================================================================

// função que atualiza os números dos atendimentos
function atualizarIndicadoresMetro() {

    // guarda a quantidade de chamados pendentes
    let pendentes = 0;

    // guarda a quantidade de chamados em atendimento
    let andamento = 0;

    // começa com um atendimento fictício já concluído
    let concluidos = 1;

    // percorre a lista de chamados
    for (let i = 0; i < chamadosMetro.length; i++) {

        // verifica a situação de cada chamado
        if (chamadosMetro[i].situacao === "Aguardando agente") {

            pendentes = pendentes + 1;

        } else if (chamadosMetro[i].situacao === "Em atendimento") {

            andamento = andamento + 1;

        } else if (chamadosMetro[i].situacao === "Concluído") {

            concluidos = concluidos + 1;

        }

    }

    // apresenta os números atualizados na visão geral
    indicadorPendentes.textContent = pendentes;
    indicadorAndamento.textContent = andamento;
    indicadorConcluidos.textContent = concluidos;

}


// =================================================================
// ATUALIZAÇÃO DOS CHAMADOS
// =================================================================

// função que atualiza a aparência de cada chamado
// chamado representa o objeto que será atualizado
function atualizarChamadoMetro(chamado) {

    // transforma o protocolo no formato utilizado pelos ids
    const identificador = chamado.protocolo.toLowerCase().replace("-", "");

    // seleciona o elemento que apresenta a situação
    const situacao = document.getElementById("situacao-" + identificador);

    // seleciona os três botões do chamado
    const aceitar = document.getElementById("aceitar-" + identificador);
    const recusar = document.getElementById("recusar-" + identificador);
    const concluir = document.getElementById("concluir-" + identificador);

    // apresenta a situação atualizada na tabela
    situacao.textContent = chamado.situacao;

    // desabilita inicialmente todos os botões
    aceitar.disabled = true;
    recusar.disabled = true;
    concluir.disabled = true;

    // verifica se o chamado ainda está pendente
    if (chamado.situacao === "Aguardando agente") {

        aceitar.disabled = false;
        recusar.disabled = false;

    } else if (chamado.situacao === "Em atendimento") {

        concluir.disabled = false;

    }

    // seleciona o chamado exibido na visão geral
    const chamadoRecente = document.querySelector(
        '#lista-chamados-recentes [data-protocolo="' +
        chamado.protocolo + '"]'
    );

    // verifica se o chamado aparece na visão geral
    if (chamadoRecente) {

        // seleciona o texto da situação
        const situacaoRecente = chamadoRecente.querySelector(".admin-status-pill");

        // atualiza a situação na visão geral
        situacaoRecente.textContent = chamado.situacao;

    }

}


// =================================================================
// AÇÕES DE ATENDIMENTO
// =================================================================

// função que executa a ação escolhida pelo profissional
function alterarChamadoMetro(event) {

    // recupera o botão clicado
    const botao = event.currentTarget;

    // recupera o protocolo do chamado
    const protocolo = botao.getAttribute("data-protocolo");

    // recupera a ação escolhida
    const acao = botao.getAttribute("data-acao-chamado");

    // percorre a lista de chamados
    for (let i = 0; i < chamadosMetro.length; i++) {

        // verifica se encontrou o chamado correspondente
        if (chamadosMetro[i].protocolo === protocolo) {

            // guarda o chamado encontrado
            const chamado = chamadosMetro[i];

            // verifica se o profissional aceitou o chamado
            if (acao === "aceitar" && chamado.situacao === "Aguardando agente") {

                chamado.situacao = "Em atendimento";

            } else if (acao === "recusar" && chamado.situacao === "Aguardando agente") {

                chamado.situacao = "Recusado";

            } else if (acao === "concluir" && chamado.situacao === "Em atendimento") {

                chamado.situacao = "Concluído";

            }

            // atualiza o chamado na página
            atualizarChamadoMetro(chamado);

            // atualiza os indicadores da visão geral
            atualizarIndicadoresMetro();

            // encerra a função
            return;

        }

    }

}


// =================================================================
// INICIALIZAÇÃO DOS CHAMADOS
// =================================================================

// verifica se estamos no painel do metrô
if (document.body.classList.contains("pagina-metro")) {

    // percorre os botões de atendimento
    for (let i = 0; i < botoesChamadosMetro.length; i++) {

        // executa a ação quando o botão é clicado
        botoesChamadosMetro[i].addEventListener("click", alterarChamadoMetro);

    }

    // apresenta os indicadores iniciais
    atualizarIndicadoresMetro();

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
        "<span>" + protocolo + " · " + hora + " · Origem: IARA</span>" +
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
          "Nova decisão (" + protocolo + "): pedido aprovado, aguardando transição.";
      }
    } else {
      totalRecusados++;
      novoCard.innerHTML =
        '<div class="admin-chamado-meta">' +
        "<span>" + protocolo + " · " + hora + " · Origem: IARA</span>" +
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
          "Nova decisão (" + protocolo + "): pedido recusado pois restam 8s ou menos no ciclo.";
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
  const btnZeladoriaResolvido = document.getElementById("btn-zeladoria-resolvido");

  if (btnZeladoriaAnalise && statusZeladoria) {
    btnZeladoriaAnalise.addEventListener("click", function () {
      statusZeladoria.textContent = "Em análise";
      statusZeladoria.className = "admin-status-pill cet-pill-recusado";
      if (avisoZeladoria) {
        avisoZeladoria.textContent = "Pedido MT-1041: Em análise. O pedido foi atualizado.";
      }
    });
  }

  if (btnZeladoriaResolvido && statusZeladoria) {
    btnZeladoriaResolvido.addEventListener("click", function () {
      statusZeladoria.textContent = "Concluído";
      statusZeladoria.className = "admin-status-pill cet-pill-aprovado";
      if (avisoZeladoria) {
        avisoZeladoria.textContent = "Pedido MT-1041: Concluído. O pedido foi atualizado.";
      }
    });
  }
}

// =====================================================
// PAINEL COORDENAÇÃO OPERACIONAL (admin/coordenacao.html)
// =====================================================
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
    const matchOrgao = orgao === "todos" || linhas[i].getAttribute("data-orgao") === orgao;
    const matchLocal = local === "todos" || linhas[i].getAttribute("data-local") === local;
    const matchSituacao =
      situacao === "todos" || linhas[i].getAttribute("data-situacao") === situacao;

    const exibir = matchOrgao && matchLocal && matchSituacao;
    linhas[i].hidden = !exibir;
    if (exibir) visiveis++;
  }

  const contagemTexto = document.getElementById("contagem-coord-pedidos");
  const tabelaWrapper = document.getElementById("tabela-coord-wrapper");
  const estadoVazio = document.getElementById("vazio-coord-pedidos");

  if (contagemTexto) {
    const plural = visiveis === 1 ? "solicitação encontrada" : "solicitações encontradas";
    contagemTexto.textContent = visiveis + " " + plural + " · Período selecionado";
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
    filtroCoordPeriodo
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
    const conteudoCsv =
      "\uFEFFProtocolo;Servico e necessidade;Orgao;Local;Situacao;Horario\n" +
      "MT-1041;Piso tatil danificado;Zeladoria;Av. Paulista x Rua Pamplona;Concluido;Hoje - 09:15\n" +
      "MT-1042;Acompanhamento ate a plataforma;Metro;Consolacao - Linha 2 Verde - Entrada principal;Funcionario a caminho;Hoje - 14:32\n";

    const blob = new Blob([conteudoCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const linkDownload = document.createElement("a");
    linkDownload.href = url;
    linkDownload.download = "relatorio-atendimentos-meu-tempo.csv";
    document.body.appendChild(linkDownload);
    linkDownload.click();
    document.body.removeChild(linkDownload);
    URL.revokeObjectURL(url);

    mostrarToastAdmin("Relatório de atendimentos exportado com os filtros selecionados.");
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
var listaSolicitacoesCadastro = document.getElementById("lista-solicitacoes-cadastro");
var modeloSolicitacaoCadastro = document.getElementById("modelo-solicitacao-cadastro");
var avisoSolicitacoesCadastro = document.getElementById("aviso-solicitacoes-cadastro");

// salva a decisao e apresenta a lista atualizada
function decidirSolicitacaoCadastro() {
  alterarSituacaoCadastro(this.getAttribute("data-protocolo"), this.getAttribute("data-situacao"));
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
    var cartao = modeloSolicitacaoCadastro.cloneNode(true);
    cartao.removeAttribute("id");
    cartao.hidden = false;

    // apresenta os dados cadastrados somente como texto
    cartao.querySelector(".admin-chamado-meta span").textContent = cadastro.protocolo + " · " + cadastro.orgao;
    cartao.querySelector("h3").textContent = cadastro.nome;
    var local = cadastro.regiao || "";
    if (cadastro.estacao) {
      local = cadastro.estacao;
    }
    if (cadastro.linha) {
      local = local + " · " + cadastro.linha;
    }
    cartao.querySelector(".admin-chamado-local").textContent = "Vínculo: " + local;
    cartao.querySelector("[data-dados-solicitacao]").textContent = "Matrícula: " + cadastro.matricula + " · " + cadastro.funcao + " · E-mail: " + cadastro.email;

    // atualiza a situacao e mostra as credenciais apenas na aprovacao
    var situacao = cartao.querySelector(".admin-status-pill");
    situacao.removeAttribute("id");
    situacao.className = "admin-status-pill cet-pill-recusado";
    var credenciais = cartao.querySelector("[data-credenciais-cadastro]");
    credenciais.hidden = true;
    if (cadastro.status === "aprovado") {
      situacao.textContent = "Cadastro aprovado";
      situacao.className = "admin-status-pill cet-pill-aprovado";
      credenciais.textContent = "E-mail administrativo: " + cadastro.emailAdministrativo + " · Senha demonstrativa: MeuTempo123!";
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
const botoesIrRelatorios = document.querySelectorAll('[data-admin-aba="relatorios"]');
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
    if (paginaAdmin.endsWith("/coordenacao.html") ||
        paginaAdmin.endsWith("/relatorios.html")) {

        if (profissionalAdmin.funcao !== "Coordenador") {

            window.location.replace("login.html");

        }

    }

}


// verifica se estamos em uma página administrativa
if (paginaAdmin.endsWith("/metro.html") ||
    paginaAdmin.endsWith("/cet.html") ||
    paginaAdmin.endsWith("/coordenacao.html") ||
    paginaAdmin.endsWith("/relatorios.html")) {

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
// EQUIPAMENTOS DO METRÔ
// =================================================================

// seleciona os botões de alteração dos equipamentos
const botoesEquipamentosMetro = document.querySelectorAll(
    "[data-alterar-equipamento]"
);

// seleciona o indicador de equipamentos disponíveis
const indicadorEquipamentos = document.getElementById(
    "indicador-equipamentos"
);

// guarda os equipamentos fictícios da estação
const equipamentosMetro = [

    {
        codigo: "EL-01",
        situacao: "Disponível"
    },

    {
        codigo: "ER-02",
        situacao: "Em manutenção"
    }

];


// função que atualiza o indicador de equipamentos
function atualizarEquipamentosMetro() {

    // guarda a quantidade de equipamentos disponíveis
    let disponiveis = 0;

    // percorre a lista de equipamentos
    for (let i = 0; i < equipamentosMetro.length; i++) {

        // recupera o equipamento atual
        const equipamento = equipamentosMetro[i];

        // prepara o código para localizar o id no html
        const identificador = equipamento.codigo.toLowerCase().replace("-", "");

        // seleciona o texto da situação
        const situacao = document.getElementById("situacao-" + identificador);

        // apresenta a situação atualizada
        situacao.textContent = equipamento.situacao;

        // verifica se o equipamento está disponível
        if (equipamento.situacao === "Disponível") {

            disponiveis = disponiveis + 1;

        }

    }

    // apresenta a quantidade na visão geral
    indicadorEquipamentos.textContent = disponiveis;

}


// função que altera a situação do equipamento
function alterarEquipamentoMetro(event) {

    // recupera o botão clicado
    const botao = event.currentTarget;

    // recupera o código do equipamento
    const codigo = botao.getAttribute("data-alterar-equipamento");

    // percorre os equipamentos cadastrados
    for (let i = 0; i < equipamentosMetro.length; i++) {

        // verifica se encontrou o equipamento
        if (equipamentosMetro[i].codigo === codigo) {

            // recupera o equipamento encontrado
            const equipamento = equipamentosMetro[i];

            // verifica a situação atual
            if (equipamento.situacao === "Disponível") {

                equipamento.situacao = "Em manutenção";

            } else if (equipamento.situacao === "Em manutenção") {

                equipamento.situacao = "Indisponível";

            } else {

                equipamento.situacao = "Disponível";

            }

            // atualiza as informações na página
            atualizarEquipamentosMetro();

            return;

        }

    }

}


// verifica se estamos no painel do metrô
if (document.body.classList.contains("pagina-metro")) {

    // percorre os botões dos equipamentos
    for (let i = 0; i < botoesEquipamentosMetro.length; i++) {

        // executa a alteração ao clicar no botão
        botoesEquipamentosMetro[i].addEventListener(
            "click",
            alterarEquipamentoMetro
        );

    }

    // apresenta as informações iniciais
    atualizarEquipamentosMetro();

}


// =================================================================
// OCORRÊNCIAS DO METRÔ
// =================================================================

// seleciona o formulário
const formularioOcorrenciaMetro = document.getElementById("formulario-ocorrencia");

// seleciona os campos do formulário
const tipoOcorrenciaMetro = document.getElementById("tipo-ocorrencia");
const localOcorrenciaMetro = document.getElementById("local-ocorrencia");
const descricaoOcorrenciaMetro = document.getElementById("descricao-ocorrencia");

// seleciona a mensagem e a lista de ocorrências
const avisoOcorrenciaMetro = document.getElementById("aviso-ocorrencia");
const listaOcorrenciasMetro = document.getElementById("lista-ocorrencias-metro");

// cria uma lista para guardar as ocorrências
let ocorrenciasMetro = [];


// função que apresenta as ocorrências registradas
function exibirOcorrenciasMetro() {

    // limpa a lista anterior
    listaOcorrenciasMetro.innerHTML = "";

    // verifica se a lista está vazia
    if (ocorrenciasMetro.length === 0) {

        listaOcorrenciasMetro.innerHTML =
            "<li>Nenhuma ocorrência registrada.</li>";

        return;

    }

    // percorre as ocorrências cadastradas
    for (let i = 0; i < ocorrenciasMetro.length; i++) {

        // recupera a ocorrência atual
        const ocorrencia = ocorrenciasMetro[i];

        // cria um item da lista
        const item = document.createElement("li");

        // apresenta as informações da ocorrência
        item.textContent =
            ocorrencia.tipo + " | " +
            ocorrencia.local + " | " +
            ocorrencia.descricao;

        // adiciona o item à lista
        listaOcorrenciasMetro.appendChild(item);

    }

}


// função que registra uma ocorrência
function registrarOcorrenciaMetro(event) {

    // impede o recarregamento da página
    event.preventDefault();

    // verifica se os campos possuem conteúdo
    if (localOcorrenciaMetro.value.trim() === "" ||
        descricaoOcorrenciaMetro.value.trim() === "") {

        avisoOcorrenciaMetro.textContent = "Preencha todos os campos.";

        return;

    }

    // cria o objeto com os dados informados
    const ocorrencia = {

        tipo: tipoOcorrenciaMetro.options[tipoOcorrenciaMetro.selectedIndex].text,

        local: localOcorrenciaMetro.value.trim(),

        descricao: descricaoOcorrenciaMetro.value.trim()

    };

    // adiciona a ocorrência à lista
    ocorrenciasMetro.push(ocorrencia);

    // salva as ocorrências no navegador
    localStorage.setItem(
        "metro-ocorrencias",
        JSON.stringify(ocorrenciasMetro)
    );

    // atualiza a lista apresentada
    exibirOcorrenciasMetro();

    // limpa os campos do formulário
    formularioOcorrenciaMetro.reset();

    // apresenta a mensagem de confirmação
    avisoOcorrenciaMetro.textContent =
        "Ocorrência registrada com sucesso!";

}


// verifica se estamos no painel do metrô
if (formularioOcorrenciaMetro && listaOcorrenciasMetro) {

    // recupera as ocorrências salvas anteriormente
    const ocorrenciasSalvas = localStorage.getItem("metro-ocorrencias");

    // verifica se existem registros anteriores
    if (ocorrenciasSalvas !== null) {

        ocorrenciasMetro = JSON.parse(ocorrenciasSalvas);

    }

    // apresenta as ocorrências existentes
    exibirOcorrenciasMetro();

    // registra a ocorrência ao enviar o formulário
    formularioOcorrenciaMetro.addEventListener(
        "submit",
        registrarOcorrenciaMetro
    );

}


