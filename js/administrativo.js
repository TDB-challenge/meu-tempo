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

// =====================================================
// PAINEL METRÔ / CPTM (admin/metro.html)
// =====================================================
const listaChamadosMetro = document.getElementById("lista-chamados-metro");
const btnAtualizarFila = document.getElementById("btn-atualizar-fila");
const avisoFilaMetro = document.getElementById("aviso-fila-metro");

function atualizarKpisMetro() {
  const kpiPendentes = document.getElementById("kpi-pendentes");
  const kpiAndamento = document.getElementById("kpi-andamento");
  const kpiConcluidos = document.getElementById("kpi-concluidos");
  if (!listaChamadosMetro || !kpiPendentes) return;

  const pendentes = listaChamadosMetro.querySelectorAll('[data-estado="pendente"]').length;
  const andamento = listaChamadosMetro.querySelectorAll('[data-estado="andamento"]').length;
  const concluidos = listaChamadosMetro.querySelectorAll('[data-estado="concluido"]').length;

  kpiPendentes.textContent = pendentes;
  kpiAndamento.textContent = andamento;
  kpiConcluidos.textContent = concluidos;
}

if (listaChamadosMetro) {
  listaChamadosMetro.addEventListener("click", function (evento) {
    const botaoAcao = evento.target.closest(".btn-acao-chamado");
    if (!botaoAcao) return;

    const itemChamado = botaoAcao.closest(".admin-chamado-item");
    const pillStatus = itemChamado.querySelector("[data-pill-status]");
    const estadoAtual = itemChamado.getAttribute("data-estado");

    if (estadoAtual === "pendente") {
      itemChamado.setAttribute("data-estado", "andamento");
      pillStatus.textContent = "Funcionário a caminho";
      botaoAcao.innerHTML = "Iniciar atendimento &rarr;";
    } else if (estadoAtual === "andamento") {
      itemChamado.setAttribute("data-estado", "concluido");
      pillStatus.textContent = "Atendimento em curso";
      botaoAcao.innerHTML = "Concluir embarque &rarr;";
    } else if (estadoAtual === "concluido") {
      pillStatus.textContent = "Concluído";
      botaoAcao.textContent = "Atendimento finalizado";
      botaoAcao.disabled = true;
    }

    atualizarKpisMetro();
  });
}

if (btnAtualizarFila && listaChamadosMetro) {
  let chamadoExtraAdicionado = false;

  btnAtualizarFila.addEventListener("click", function () {
    if (chamadoExtraAdicionado) {
      if (avisoFilaMetro) {
        avisoFilaMetro.textContent =
          "Fila sincronizada. Todos os chamados da Estação Consolação estão exibidos acima.";
      }
      return;
    }

    chamadoExtraAdicionado = true;
    const novoChamado = document.createElement("article");
    novoChamado.className = "admin-chamado-item";
    novoChamado.setAttribute("data-chamado-id", "MT-1043");
    novoChamado.setAttribute("data-estado", "pendente");

    novoChamado.innerHTML =
      '<div class="admin-chamado-meta">' +
      "<span>MT-1043 · Agora · Origem: Voz (IARA)</span>" +
      '<span class="admin-status-pill" data-pill-status>Aguardando agente</span>' +
      "</div>" +
      "<h3>Carlos Eduardo Mendes · Apoio com elevador e embarque</h3>" +
      '<p class="admin-chamado-local">Consolação · Linha 2 — Verde · Bloqueio Sul</p>' +
      '<p class="admin-chamado-credencial">Credencial validada · CIPCD · Mobilidade reduzida (QR Code)</p>' +
      '<div class="admin-chamado-acoes">' +
      '<button type="button" class="btn btn-acao-chamado">Aceitar chamado &rarr;</button>' +
      '<a href="../solucao01.html" class="link-seta">Ver acompanhamento do cidadão &rarr;</a>' +
      "</div>";

    listaChamadosMetro.prepend(novoChamado);
    atualizarKpisMetro();

    if (avisoFilaMetro) {
      avisoFilaMetro.textContent =
        "Novo chamado recebido: Carlos Eduardo Mendes (MT-1043) entrou na fila da Estação Consolação.";
    }
  });
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
const btnAprovarCadastro = document.getElementById("btn-aprovar-cadastro");
const btnRecusarCadastro = document.getElementById("btn-recusar-cadastro");
const statusCadastro = document.getElementById("status-cadastro-cad2048");

if (btnAprovarCadastro && statusCadastro) {
  btnAprovarCadastro.addEventListener("click", function () {
    statusCadastro.textContent = "Cadastro aprovado";
    statusCadastro.className = "admin-status-pill cet-pill-aprovado";
    mostrarToastAdmin("Cadastro aprovado");
  });
}

if (btnRecusarCadastro && statusCadastro) {
  btnRecusarCadastro.addEventListener("click", function () {
    statusCadastro.textContent = "Cadastro não autorizado";
    statusCadastro.className = "admin-status-pill cet-pill-recusado";
    mostrarToastAdmin("Cadastro não autorizado");
  });
}