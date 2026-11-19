// =====================================================
// 1. MENU MOBILE (HAMBÚRGUER)
// =====================================================
const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu-navegacao");

if (btnMenu && menu) {
  btnMenu.addEventListener("click", function () {
    menu.classList.toggle("ativo");
  });
}

// =================================================================
// PREFERÊNCIAS GLOBAIS DE ACESSIBILIDADE
// =================================================================

// fornece os valores iniciais sem ativar preferências por uma condição presumida
function preferenciasIniciaisAcessibilidade() {
  return {fonte: "100", contraste: false, temaEscuro: false, fonteLegivel: false, orientacoesVoz: false, vozIara: false, somTravessia: false, vibracao: false};
}

// recupera as escolhas já utilizadas em todas as áreas do projeto
function buscarPreferenciasAcessibilidade() {
  // prepara o padrão e consulta a chave compartilhada
  const preferencias = preferenciasIniciaisAcessibilidade();
  const texto = localStorage.getItem("meu-tempo-acessibilidade");
  // recupera somente o formato esperado
  if (texto !== null) {
    try {
      const salvas = JSON.parse(texto);
      // copia apenas as preferências conhecidas
      const chaves = ["contraste", "temaEscuro", "fonteLegivel", "orientacoesVoz", "vozIara", "somTravessia", "vibracao"];
      if (salvas && typeof salvas === "object") {
        for (let i = 0; i < chaves.length; i++) preferencias[chaves[i]] = salvas[chaves[i]] === true;
        if (Number(salvas.fonte) >= 100 && Number(salvas.fonte) <= 200) preferencias.fonte = String(salvas.fonte);
      }
    } catch (erro) {
      // erro indica preferências antigas que não podem ser interpretadas
      return preferencias;
    }
    return preferencias;
  }
  // aproveita as chaves antigas uma única vez, sem apagar dados de contas ou pedidos
  const fonteAntiga = localStorage.getItem("admin-tamanho-texto") || localStorage.getItem("meuTempoAdminFonte");
  if (Number(fonteAntiga) >= 100 && Number(fonteAntiga) <= 200) preferencias.fonte = String(fonteAntiga);
  preferencias.temaEscuro = localStorage.getItem("admin-tema") === "tema-escuro" || localStorage.getItem("temaEscuro") === "ativo";
  preferencias.contraste = localStorage.getItem("admin-tema") === "alto-contraste" || localStorage.getItem("altoContraste") === "ativo";
  preferencias.fonteLegivel = localStorage.getItem("fonteLegivel") === "ativo";
  preferencias.vibracao = localStorage.getItem("meuTempoVibrar") === "ativo" || localStorage.getItem("alertaVibracao") === "ativo";
  return preferencias;
}

// aplica as escolhas e mantém os controles do modal e do perfil sincronizados
function aplicarPreferenciasAcessibilidade() {
  // recupera a mesma configuração para todos os componentes
  const preferencias = buscarPreferenciasAcessibilidade();
  document.documentElement.style.fontSize = preferencias.fonte + "%";
  document.body.classList.toggle("alto-contraste", preferencias.contraste);
  document.body.classList.toggle("tema-escuro", preferencias.temaEscuro);
  document.body.classList.toggle("fonte-legivel", preferencias.fonteLegivel);
  // atualiza cada campo que representa uma preferência
  const controles = document.querySelectorAll("[data-preferencia]");
  for (let i = 0; i < controles.length; i++) {
    const chave = controles[i].getAttribute("data-preferencia");
    if (chave === "fonte") controles[i].value = preferencias.fonte;
    else controles[i].checked = preferencias[chave] === true;
  }
  // atualiza os controles da página institucional de acessibilidade
  const botoes = document.querySelectorAll(".switch-toggle");
  for (let i = 0; i < botoes.length; i++) {
    let ativo = false;
    if (botoes[i].classList.contains("acao-contraste")) ativo = preferencias.contraste;
    else if (botoes[i].classList.contains("acao-musical")) ativo = preferencias.somTravessia;
    else if (botoes[i].classList.contains("acao-vibracao")) ativo = preferencias.vibracao;
    botoes[i].classList.toggle("ativo", ativo);
    botoes[i].setAttribute("aria-pressed", String(ativo));
    // a voz do webchat não está conectada nesta etapa
    if (botoes[i].classList.contains("acao-voz")) {
      botoes[i].disabled = true;
      botoes[i].title = "O webchat da IARA será configurado em outra etapa.";
    }
  }
  atualizarStatusAcessibilidade();
}

// armazena somente as preferências visuais e de interação
// preferencias representa as escolhas do modal, cadastro ou perfil
function salvarPreferenciasAcessibilidade(preferencias) {
  localStorage.setItem("meu-tempo-acessibilidade", JSON.stringify(preferencias));
  // retira chaves antigas para impedir que outro script aplique uma configuração divergente
  const antigas = ["admin-tamanho-texto", "admin-tema", "meuTempoAdminFonte", "altoContraste", "temaEscuro", "fonteLegivel", "vozIara", "meuTempoIaraVoz", "meuTempoVibrar", "alertaVibracao"];
  for (let i = 0; i < antigas.length; i++) localStorage.removeItem(antigas[i]);
  // guarda também as preferências do cidadão que já está conectado
  if (typeof buscarCidadaoConectado === "function") {
    const cidadao = buscarCidadaoConectado();
    if (cidadao !== null) {
      cidadao.preferencias = preferencias;
      salvarDadosCidadao(cidadao);
    }
  }
  aplicarPreferenciasAcessibilidade();
}

// apresenta um resumo curto na página que permite experimentar os ajustes
function atualizarStatusAcessibilidade() {
  const feedback = document.getElementById("feedback-acess");
  if (feedback) {
    const preferencias = buscarPreferenciasAcessibilidade();
    feedback.textContent = "Tamanho das letras: " + preferencias.fonte + "%. As preferências acompanham sua navegação.";
  }
}

// utiliza a leitura nativa somente quando a pessoa escolheu orientações por voz
// texto representa a orientação curta do controle ou serviço
function falarOrientacaoAcessivel(texto) {
  const preferencias = buscarPreferenciasAcessibilidade();
  if (preferencias.orientacoesVoz && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(fala);
  }
}

// salva a preferência representada pelo campo alterado
// event identifica o campo do modal, cadastro ou perfil
function alterarPreferenciaAcessibilidade(event) {
  const campo = event.currentTarget;
  const chave = campo.getAttribute("data-preferencia");
  const preferencias = buscarPreferenciasAcessibilidade();
  if (chave === "fonte") preferencias.fonte = campo.value;
  else preferencias[chave] = campo.checked;
  // mantém contraste e tema como alternativas que não se sobrepõem
  if (chave === "contraste" && campo.checked) preferencias.temaEscuro = false;
  if (chave === "temaEscuro" && campo.checked) preferencias.contraste = false;
  salvarPreferenciasAcessibilidade(preferencias);
  falarOrientacaoAcessivel("Preferência atualizada.");
}

// conecta uma única vez os controles existentes ou acrescentados ao perfil
function conectarControlesAcessibilidade() {
  const controles = document.querySelectorAll("[data-preferencia]");
  for (let i = 0; i < controles.length; i++) {
    if (!controles[i].hasAttribute("data-preferencia-conectada")) {
      controles[i].setAttribute("data-preferencia-conectada", "true");
      controles[i].addEventListener("change", alterarPreferenciaAcessibilidade);
    }
  }
  aplicarPreferenciasAcessibilidade();
}

// cria um campo básico para o mesmo modal utilizado em todas as páginas
// destino recebe o campo, titulo apresenta a escolha e chave identifica a preferência
function criarCampoAcessibilidade(destino, titulo, chave) {
  const rotulo = document.createElement("label");
  rotulo.className = "opcao-acessibilidade-global";
  const nome = document.createElement("span");
  nome.textContent = titulo;
  rotulo.appendChild(nome);
  let campo = document.createElement("input");
  // a escala utiliza as opções já presentes nos protótipos
  if (chave === "fonte") {
    campo = document.createElement("select");
    const escalas = [100, 115, 125, 130, 150, 175, 200];
    for (let i = 0; i < escalas.length; i++) {
      const opcao = document.createElement("option");
      opcao.value = String(escalas[i]);
      opcao.textContent = escalas[i] + "%";
      campo.appendChild(opcao);
    }
  } else campo.type = "checkbox";
  campo.setAttribute("data-preferencia", chave);
  // não apresenta funções de voz externa ou vibração ausente como disponíveis
  if (chave === "vozIara" || (chave === "vibracao" && typeof navigator.vibrate !== "function")) campo.disabled = true;
  if (chave === "orientacoesVoz" && !("speechSynthesis" in window)) campo.disabled = true;
  rotulo.appendChild(campo);
  destino.appendChild(rotulo);
}

// substitui os controles redundantes sem manter dois sistemas de acessibilidade
function iniciarAcessibilidadeGlobal() {
  // remove somente as barras e a antiga janela de recursos
  const antigos = document.querySelectorAll(".barra-acessibilidade, .barra-util, .painel-acess-rapido");
  for (let i = 0; i < antigos.length; i++) antigos[i].remove();
  const modalAntigo = document.getElementById("modal-admin-acessibilidade");
  if (modalAntigo) modalAntigo.remove();
  const botaoAntigo = document.getElementById("btn-admin-acessibilidade");
  if (botaoAntigo) botaoAntigo.remove();
  // cria o botão flutuante com nome acessível e o ícone local
  const botao = document.createElement("button");
  botao.type = "button";
  botao.id = "abrir-acessibilidade-global";
  botao.className = "botao-acessibilidade-global";
  botao.setAttribute("aria-label", "Abrir recursos de acessibilidade");
  botao.setAttribute("aria-controls", "modal-acessibilidade-global");
  const icone = document.createElement("img");
  let caminho = "../assets/icones/disabled-2.svg";
  if (document.body.classList.contains("app") || location.pathname.indexOf("/admin/") !== -1) caminho = "../../assets/icones/disabled-2.svg";
  icone.src = caminho;
  icone.alt = "";
  botao.appendChild(icone);
  document.body.appendChild(botao);
  document.body.classList.add("com-acessibilidade");
  // usa dialog para manter o foco dentro da janela e permitir o fechamento por escape
  const modal = document.createElement("dialog");
  modal.id = "modal-acessibilidade-global";
  modal.className = "modal-acessibilidade-global";
  modal.setAttribute("aria-labelledby", "titulo-acessibilidade-global");
  const titulo = document.createElement("h2");
  titulo.id = "titulo-acessibilidade-global";
  titulo.textContent = "Uma experiência do seu jeito";
  modal.appendChild(titulo);
  const fechar = document.createElement("button");
  fechar.type = "button";
  fechar.className = "fechar-acessibilidade-global";
  fechar.textContent = "Fechar";
  fechar.setAttribute("aria-label", "Fechar recursos de acessibilidade");
  modal.appendChild(fechar);
  // mantém voz da iara separada das orientações e dos alertas da travessia
  criarCampoAcessibilidade(modal, "Tamanho das letras", "fonte");
  criarCampoAcessibilidade(modal, "Alto contraste", "contraste");
  criarCampoAcessibilidade(modal, "Tema escuro", "temaEscuro");
  criarCampoAcessibilidade(modal, "Fonte de alta legibilidade", "fonteLegivel");
  criarCampoAcessibilidade(modal, "Orientações por voz", "orientacoesVoz");
  criarCampoAcessibilidade(modal, "Voz da IARA · webchat ainda não configurado", "vozIara");
  criarCampoAcessibilidade(modal, "Guia sonoro da travessia", "somTravessia");
  criarCampoAcessibilidade(modal, "Vibração · quando o dispositivo permitir", "vibracao");
  const restaurar = document.createElement("button");
  restaurar.type = "button";
  restaurar.className = "btn";
  restaurar.textContent = "Restaurar configurações";
  modal.appendChild(restaurar);
  document.body.appendChild(modal);
  // abre e fecha a mesma janela por meio dos controles visíveis
  botao.addEventListener("click", function () { modal.showModal(); });
  fechar.addEventListener("click", function () { modal.close(); });
  restaurar.addEventListener("click", function () { salvarPreferenciasAcessibilidade(preferenciasIniciaisAcessibilidade()); });
  // recupera o foco no botão que abriu a janela
  modal.addEventListener("close", function () { botao.focus(); });
  // conecta os campos conhecidos do perfil sem criar outro sistema
  const camposPerfil = [["tamanho-fonte", "fonte"], ["alto-contraste", "contraste"], ["tema-escuro", "temaEscuro"], ["fonte-legivel", "fonteLegivel"], ["ouvir-iara", "vozIara"], ["vibrar-avisos", "vibracao"]];
  for (let i = 0; i < camposPerfil.length; i++) {
    const campo = document.getElementById(camposPerfil[i][0]);
    if (campo) {
      campo.setAttribute("data-preferencia", camposPerfil[i][1]);
      if (camposPerfil[i][1] === "vozIara") campo.disabled = true;
    }
  }
  // migra as preferências antes que os outros scripts antigos sejam executados
  salvarPreferenciasAcessibilidade(buscarPreferenciasAcessibilidade());
  conectarControlesAcessibilidade();
  prepararVLibrasGlobal();
}

// reaproveita a integração oficial já utilizada pelo site
function prepararVLibrasGlobal() {
  // preserva o widget existente, sem carregar o plugin duas vezes
  if (document.querySelector("[vw]")) return;
  const widget = document.createElement("div");
  widget.setAttribute("vw", "");
  widget.className = "enabled";
  const acesso = document.createElement("div");
  acesso.setAttribute("vw-access-button", "");
  acesso.className = "active";
  const painel = document.createElement("div");
  painel.setAttribute("vw-plugin-wrapper", "");
  const topo = document.createElement("div");
  topo.className = "vw-plugin-top-wrapper";
  painel.appendChild(topo);
  widget.appendChild(acesso);
  widget.appendChild(painel);
  document.body.appendChild(widget);
  // carrega apenas o plugin oficial, sem novas bibliotecas
  const plugin = document.createElement("script");
  plugin.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
  plugin.addEventListener("load", function () {
    if (window.VLibras) new window.VLibras.Widget("https://vlibras.gov.br/app");
  });
  plugin.addEventListener("error", function () { widget.title = "VLibras indisponível nesta conexão."; });
  document.body.appendChild(plugin);
}

// conecta os botões de demonstração da página de acessibilidade ao mesmo armazenamento
// event representa o controle que a pessoa escolheu
function alterarControleInstitucional(event) {
  const botao = event.currentTarget;
  const preferencias = buscarPreferenciasAcessibilidade();
  if (botao.classList.contains("acao-aumentar")) {
    const escalas = [100, 115, 125, 130, 150, 175, 200];
    for (let i = 0; i < escalas.length; i++) {
      if (escalas[i] > Number(preferencias.fonte)) { preferencias.fonte = String(escalas[i]); break; }
    }
  } else if (botao.classList.contains("acao-diminuir")) preferencias.fonte = "100";
  else if (botao.classList.contains("acao-contraste")) { preferencias.contraste = !preferencias.contraste; preferencias.temaEscuro = false; }
  else if (botao.classList.contains("acao-tema")) { preferencias.temaEscuro = !preferencias.temaEscuro; preferencias.contraste = false; }
  else if (botao.classList.contains("acao-fonte-legivel")) preferencias.fonteLegivel = !preferencias.fonteLegivel;
  else if (botao.classList.contains("acao-musical")) preferencias.somTravessia = !preferencias.somTravessia;
  else if (botao.classList.contains("acao-vibracao")) preferencias.vibracao = !preferencias.vibracao;
  else if (botao.id === "btn-resetar-acess") { salvarPreferenciasAcessibilidade(preferenciasIniciaisAcessibilidade()); return; }
  salvarPreferenciasAcessibilidade(preferencias);
}

// inicializa os recursos compartilhados depois que o html já foi interpretado
iniciarAcessibilidadeGlobal();
// conecta cada botão institucional uma única vez
const controlesInstitucionais = document.querySelectorAll(".acao-aumentar, .acao-diminuir, .acao-contraste, .acao-tema, .acao-fonte-legivel, .acao-musical, .acao-vibracao, #btn-resetar-acess");
for (let i = 0; i < controlesInstitucionais.length; i++) controlesInstitucionais[i].addEventListener("click", alterarControleInstitucional);
// aplica mudanças feitas em outra aba sem regravá-las
window.addEventListener("storage", function (event) { if (event.key === "meu-tempo-acessibilidade") aplicarPreferenciasAcessibilidade(); });


// =====================================================
// 3. CHAT INTERATIVO DA IARA (index.html)
// =====================================================
const formIara = document.getElementById("form-iara");
const inputIara = document.getElementById("input-iara");
const listaChat = document.getElementById("chat-lista");

if (formIara) {
  formIara.addEventListener("submit", function (event) {
    event.preventDefault();

    const textoDigitado = inputIara.value.trim();
    if (textoDigitado === "") {
      return;
    }

    // apresenta a mensagem digitada sem interpretar seu conteúdo como html
    const mensagemUsuario = document.createElement("div");
    mensagemUsuario.className = "msg-usuario";
    mensagemUsuario.textContent = textoDigitado;
    listaChat.appendChild(mensagemUsuario);

    const minusculo = textoDigitado.toLowerCase();
    let resposta =
      "Posso ajudar com travessia acessível, apoio no Metrô ou registro de calçadas. Acesse Nossa solução para simular.";

    if (minusculo.includes("semáforo") || minusculo.includes("atravessar")) {
      resposta =
        "Para pedir mais tempo no semáforo, entre em Nossa solução > Travessia acessível e escolha o cruzamento.";
    } else if (minusculo.includes("metrô") || minusculo.includes("estação")) {
      resposta =
        "No serviço Apoio no Metrô e CPTM você escolhe sua estação e chama um agente para acompanhamento.";
    } else if (minusculo.includes("calçada") || minusculo.includes("buraco")) {
      resposta =
        "Em Zeladoria urbana você pode registrar o endereço da barreira para orientar outros cidadãos.";
    }

    // informa que esta orientação local não é uma resposta do futuro webchat
    const mensagemIara = document.createElement("div");
    mensagemIara.className = "msg-iara";
    mensagemIara.textContent = "Orientação do protótipo: " + resposta;
    listaChat.appendChild(mensagemIara);
    listaChat.scrollTop = listaChat.scrollHeight;
    inputIara.value = "";
  });
}

// =====================================================
// 4. SIMULADORES DA PÁGINA NOSSA SOLUÇÃO
// =====================================================
const botoesSimulador = document.querySelectorAll(".btn-abrir-simulador");

for (let i = 0; i < botoesSimulador.length; i++) {
  botoesSimulador[i].addEventListener("click", function () {
    const idAlvo = botoesSimulador[i].getAttribute("data-alvo");
    const caixa = document.getElementById(idAlvo);
    if (caixa) {
      caixa.classList.toggle("aberto");
    }
  });
}

const formTravessia = document.getElementById("form-travessia");
const statusTravessia = document.getElementById("status-travessia");

if (formTravessia) {
  formTravessia.addEventListener("submit", function (event) {
    event.preventDefault();
    const cruzamento = document.getElementById("cruzamento").value;
    const tempoRestante = Number(document.getElementById("tempo-semaforo").value);
    const guia = document.getElementById("guia-sensorial").value;

    if (tempoRestante < 8) {
      statusTravessia.innerHTML =
        "<h3>Ciclo atual com menos de 8 segundos (" + tempoRestante + "s)</h3>" +
        "<p><strong>Local:</strong> " + cruzamento + "</p>" +
        "<p><strong>Guia ativado:</strong> " + guia + "</p>" +
        '<p class="aviso-erro">Para não travar o fluxo de veículos, o sistema programou automaticamente o tempo estendido para o <strong>próximo sinal verde</strong>. Aguarde o aviso sonoro e a vibração no celular.</p>';
    } else {
      statusTravessia.innerHTML =
        "<h3>Tempo estendido ativado agora! (" + tempoRestante + "s + 12s extras)</h3>" +
        "<p><strong>Local:</strong> " + cruzamento + "</p>" +
        "<p><strong>Guia ativado:</strong> " + guia + "</p>" +
        '<p class="aviso-ok">Semáforo sincronizado automaticamente sem intermediários. Pode iniciar a travessia seguindo o sinal musical e a vibração do seu celular.</p>';
    }
  });
}

const formMetro = document.getElementById("form-metro");
const statusMetro = document.getElementById("status-metro");

if (formMetro) {
  formMetro.addEventListener("submit", function (event) {
    event.preventDefault();
    const estacao = document.getElementById("estacao").value;
    const ponto = document.getElementById("ponto-estacao").value;
    const apoio = document.getElementById("apoio").value;

    statusMetro.innerHTML =
      "<h3>Chamado enviado ao painel da estação!</h3>" +
      "<p><strong>Estação:</strong> " + estacao + "</p>" +
      "<p><strong>Localização exata:</strong> " + ponto + "</p>" +
      "<p><strong>Atendimento:</strong> " + apoio + "</p>" +
      '<p class="aviso-ok">O administrador da estação aceitou o chamado e designou um agente para ir até você. Previsão de chegada: 2 minutos.</p>';
  });
}

const formZeladoria = document.getElementById("form-zeladoria");
const statusZeladoria = document.getElementById("status-zeladoria");

if (formZeladoria) {
  formZeladoria.addEventListener("submit", function (event) {
    event.preventDefault();
    const tipo = document.getElementById("tipo-barreira").value;
    const local = document.getElementById("local-barreira").value.trim();

    if (local === "") {
      statusZeladoria.innerHTML =
        '<p class="aviso-erro">Por favor, informe o endereço ou a estação onde está o problema.</p>';
      return;
    }

    statusZeladoria.innerHTML =
      "<h3>Relato registrado com sucesso!</h3>" +
      "<p><strong>Ocorrência:</strong> " + tipo + "</p>" +
      "<p><strong>Local:</strong> " + local + "</p>" +
      '<p class="aviso-ok">Alerta publicado para os cidadãos na região e enviado aos indicadores da CET / Metrô.</p>';
    formZeladoria.reset();
  });
}

const btnDemoIara = document.getElementById("btn-demo-iara");
const demoIaraBox = document.getElementById("demo-iara-box");
const btnIaraSim = document.getElementById("btn-iara-sim");
const btnIaraNao = document.getElementById("btn-iara-nao");
const demoIaraMensagens = document.getElementById("demo-iara-mensagens");
const demoIaraAcoes = document.getElementById("demo-iara-acoes");

if (btnDemoIara && demoIaraBox) {
  btnDemoIara.addEventListener("click", function () {
    demoIaraBox.classList.toggle("aberto");
  });
}

if (btnIaraSim && demoIaraMensagens) {
  btnIaraSim.addEventListener("click", function () {
    demoIaraMensagens.innerHTML +=
      '<div class="msg-usuario">“Sim, estou na Avenida Paulista, 5502.”</div>' +
      '<div class="msg-iara">Local confirmado! Conectei ao semáforo do cruzamento: o ciclo atual tem menos de 8 segundos, então já reservei seu <strong>tempo estendido + sinal musical e vibração</strong> para o próximo sinal verde. Avisarei por voz assim que abrir!</div>';
    demoIaraAcoes.style.display = "none";
  });
}

if (btnIaraNao && demoIaraMensagens) {
  btnIaraNao.addEventListener("click", function () {
    demoIaraMensagens.innerHTML +=
      '<div class="msg-usuario">“Não, estou um quarteirão antes.”</div>' +
      '<div class="msg-iara">Sem problemas! Pode me dizer o número ou ponto de referência próximo, ou abrir o seletor de cruzamentos logo acima.</div>';
    demoIaraAcoes.style.display = "none";
  });
}

// =====================================================
// 5. FILTRO DE ASSUNTOS, BUSCA E ACORDEÃO NO FAQ (faq.html)
// =====================================================
const campoBuscaFaq = document.getElementById("busca-faq");
const btnLimparFaq = document.getElementById("btn-limpar-faq");
const botoesCategoriaFaq = document.querySelectorAll(".faq-cat-btn");
const itensFaq = document.querySelectorAll(".faq-item");
const contadorFaq = document.getElementById("contador-faq");
const avisoFaq = document.getElementById("sem-resultado");

let categoriaAtivaFaq = "todas";

function filtrarFaq() {
  if (itensFaq.length === 0) {
    return;
  }

  const termo = campoBuscaFaq ? campoBuscaFaq.value.toLowerCase().trim() : "";
  let encontrados = 0;

  if (btnLimparFaq) {
    btnLimparFaq.hidden = termo === "";
  }

  for (let i = 0; i < itensFaq.length; i++) {
    const item = itensFaq[i];
    const categoriaItem = item.getAttribute("data-categoria");
    const conteudo = item.textContent.toLowerCase();

    const bateCategoria = categoriaAtivaFaq === "todas" || categoriaItem === categoriaAtivaFaq;
    const bateBusca = termo === "" || conteudo.includes(termo);

    if (bateCategoria && bateBusca) {
      item.style.display = "block";
      encontrados++;
    } else {
      item.style.display = "none";
    }
  }

  if (contadorFaq) {
    contadorFaq.textContent =
      encontrados === 1 ? "1 pergunta encontrada" : encontrados + " perguntas encontradas";
  }

  if (avisoFaq) {
    avisoFaq.style.display = encontrados === 0 ? "block" : "none";
  }
}

if (campoBuscaFaq) {
  campoBuscaFaq.addEventListener("input", filtrarFaq);
}

if (btnLimparFaq && campoBuscaFaq) {
  btnLimparFaq.addEventListener("click", function () {
    campoBuscaFaq.value = "";
    filtrarFaq();
    campoBuscaFaq.focus();
  });
}

for (let i = 0; i < botoesCategoriaFaq.length; i++) {
  botoesCategoriaFaq[i].addEventListener("click", function () {
    for (let j = 0; j < botoesCategoriaFaq.length; j++) {
      botoesCategoriaFaq[j].classList.remove("ativo");
    }
    this.classList.add("ativo");
    categoriaAtivaFaq = this.getAttribute("data-categoria");
    filtrarFaq();
  });
}

// Abrir e fechar respostas ao clicar nas perguntas
const perguntasFaq = document.querySelectorAll(".faq-pergunta");

for (let i = 0; i < perguntasFaq.length; i++) {
  perguntasFaq[i].addEventListener("click", function () {
    const aberta = this.getAttribute("aria-expanded") === "true";
    const resposta = this.nextElementSibling;
    const sinal = this.querySelector(".faq-sinal");

    this.setAttribute("aria-expanded", String(!aberta));
    if (resposta) {
      resposta.hidden = aberta;
    }
    if (sinal) {
      sinal.textContent = aberta ? "+" : "−";
    }
  });
}

// =====================================================
// 6. VALIDAÇÃO DO FORMULÁRIO DE CONTATO (contato.html)
// =====================================================
const formContato = document.getElementById("form-contato");
const avisoContato = document.getElementById("aviso-contato");

if (formContato) {
  formContato.addEventListener("submit", function (event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const assunto = document.getElementById("assunto").value;
    const mensagem = document.getElementById("mensagem").value.trim();

    if (nome === "" || email === "" || assunto === "" || mensagem === "") {
      avisoContato.innerHTML =
        '<p class="aviso-erro">Preencha todos os campos obrigatórios antes de enviar.</p>';
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      avisoContato.innerHTML =
        '<p class="aviso-erro">Insira um endereço de e-mail válido.</p>';
      return;
    }

    avisoContato.innerHTML =
      '<p class="aviso-ok">Mensagem enviada com sucesso! Obrigado pelo contato, ' + nome + ".</p>";
    formContato.reset();
  });
}

// =====================================================
// APAGAR PREFERÊNCIAS LOCAIS (privacidade.html)
// =====================================================
const btnApagarPreferencias = document.getElementById("btn-apagar-preferencias");
const avisoPrivacidade = document.getElementById("aviso-privacidade");

if (btnApagarPreferencias) {
  btnApagarPreferencias.addEventListener("click", function () {
    // restaura somente os ajustes, preservando contas e solicitações
    salvarPreferenciasAcessibilidade(preferenciasIniciaisAcessibilidade());

    document.body.classList.remove(
      "alto-contraste",
      "fonte-legivel",
      "tema-escuro",
      "voz-iara-ativa",
      "vibracao-ativa",
      "musical-ativo"
    );
    document.documentElement.style.fontSize = "";

    if (avisoPrivacidade) {
      avisoPrivacidade.textContent =
        "Preferências locais e dados de sessão apagados deste navegador.";
    }
  });
}

// =====================================================
// FLUXO DE CADASTRO REALISTA COM PERFIL DO CARLOS (cadastro.html)
// =====================================================
// os formulários do cidadão são controlados por autenticacao.js

const botoesToggleSenha = document.querySelectorAll(".btn-toggle-senha");

for (let i = 0; i < botoesToggleSenha.length; i++) {
  botoesToggleSenha[i].addEventListener("click", function () {
    const inputAlvo = this.parentElement.querySelector("input");
    if (!inputAlvo) return;

    const estaOculta = inputAlvo.type === "password";
    inputAlvo.type = estaOculta ? "text" : "password";
    this.setAttribute("aria-pressed", estaOculta ? "true" : "false");
    this.setAttribute(
      "aria-label",
      estaOculta ? "Ocultar senha" : "Mostrar senha"
    );
  });
}

// =====================================================
// RECUPERAÇÃO DE SENHA (recuperar-senha.html)
// =====================================================
const formRecuperarSenha = document.getElementById("form-recuperar-senha");

if (formRecuperarSenha) {
  const inputEmailRec = document.getElementById("rec-email");
  const avisoRecuperar = document.getElementById("aviso-recuperar");

  formRecuperarSenha.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const email = inputEmailRec ? inputEmailRec.value.trim() : "";

    if (!email || !email.includes("@")) {
      avisoRecuperar.textContent = "Informe um endereço de e-mail válido para continuar.";
      return;
    }

    avisoRecuperar.innerHTML =
      '<p style="margin-bottom: 10px;">Solicitação registrada! Se este e-mail estiver vinculado a uma conta, enviaremos as instruções de redefinição (simulação demonstrativa).</p>' +
      '<a href="login.html" class="link-seta">Voltar para o login &rarr;</a>';

    formRecuperarSenha.reset();
  });
}