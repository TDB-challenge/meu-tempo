/*
  recursos compartilhados do site e dos dois ambientes:
  menu institucional, acessibilidade, simuladores, perguntas frequentes e atalhos locais.
  cada bloco verifica os controles que existem na página antes de conectar seus eventos.

  data-preferencia relaciona um campo à configuração salva; interruptor fornece o visual do controle.
  alto-contraste, tema-escuro e fonte-legivel são classes aplicadas ao body pelo mesmo conjunto de preferências.
  modal-acessibilidade-global identifica a janela comum, criada uma única vez em cada página.
  os nomes acessíveis dos controles alimentam a orientação por voz, sem ler os valores digitados.
  o widget oficial do vlibras também é carregado aqui, evitando cópias nos htmls.
*/

// =====================================================
// 1. menu mobile (hambúrguer)
// =====================================================
const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu-navegacao");

if (btnMenu && menu) {
  btnMenu.addEventListener("click", function () {
    menu.classList.toggle("ativo");
  });
}

// =================================================================
// preferências globais de acessibilidade
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
  // interrompe imediatamente uma orientação ao desativar a voz ou restaurar as preferências
  if (!preferencias.orientacoesVoz && "speechSynthesis" in window) window.speechSynthesis.cancel();
  document.body.classList.toggle("alto-contraste", preferencias.contraste);
  document.body.classList.toggle("tema-escuro", preferencias.temaEscuro);
  document.body.classList.toggle("fonte-legivel", preferencias.fonteLegivel);
  // atualiza cada campo que representa uma preferência
  // o seletor por atributo reúne os campos que declaram qual preferência alteram, sem depender de uma única página
  const controles = document.querySelectorAll("[data-preferencia]");
  for (let i = 0; i < controles.length; i++) {
    const chave = controles[i].getAttribute("data-preferencia");
    if (chave === "fonte") controles[i].value = preferencias.fonte;
    else controles[i].checked = preferencias[chave] === true;
  }
  // atualiza os controles da página institucional de acessibilidade
  // switch-toggle identifica os botões visuais; a classe ativo acompanha o estado anunciado por aria-pressed
  const botoes = document.querySelectorAll(".switch-toggle");
  for (let i = 0; i < botoes.length; i++) {
    let ativo = false;
    if (botoes[i].classList.contains("acao-contraste")) ativo = preferencias.contraste;
    else if (botoes[i].classList.contains("acao-musical")) ativo = preferencias.somTravessia;
    else if (botoes[i].classList.contains("acao-vibracao")) ativo = preferencias.vibracao;
    botoes[i].classList.toggle("ativo", ativo);
    botoes[i].setAttribute("aria-pressed", String(ativo));
    // permite guardar a escolha antes da futura integração de voz
    if (botoes[i].classList.contains("acao-voz")) {
      botoes[i].disabled = false;
      botoes[i].classList.toggle("ativo", preferencias.vozIara);
      botoes[i].setAttribute("aria-pressed", String(preferencias.vozIara));
      botoes[i].removeAttribute("title");
    }
  }
  atualizarStatusAcessibilidade();
}

// armazena somente as preferências visuais e de interação
// preferencias reúne as escolhas de exibição e avisos; o armazenamento local permite recuperá-las em visitas futuras nesta origem
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

// reproduz orientações curtas usando a voz disponível no próprio navegador
// texto representa a orientação curta do controle ou serviço
function falarOrientacaoAcessivel(texto) {
  const preferencias = buscarPreferenciasAcessibilidade();
  if (preferencias.orientacoesVoz && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
    // cancela a orientação anterior para não acumular uma fila durante a navegação
    window.speechSynthesis.cancel();
    // cria a mensagem em português e solicita sua reprodução ao navegador
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    window.speechSynthesis.speak(fala);
    return fala;
  }
}

// lê o nome do controle ao navegar pelo teclado ou focalizar um campo
// evento identifica o elemento que recebeu o foco
function orientarFocoAcessivel(evento) {
  // considera apenas os controles da página, sem ler valores digitados ou senhas
  const controle = evento.target.closest("button, a, input, select, textarea, summary");
  if (!controle) return;
  // prioriza o nome acessível dos botões com ícones e o rótulo dos campos
  let texto = controle.getAttribute("aria-label") || "";
  if (!texto && controle.labels && controle.labels.length > 0) texto = controle.labels[0].textContent;
  // links e botões textuais podem fornecer o próprio nome quando não possuem rótulo
  if (!texto && (controle.tagName === "BUTTON" || controle.tagName === "A" || controle.tagName === "SUMMARY")) texto = controle.textContent;
  // remove espaços repetidos e limita a orientação para não narrar cartões inteiros
  texto = texto.replace(/\s+/g, " ").trim().slice(0, 180);
  if (texto) falarOrientacaoAcessivel(texto);
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
  // a confirmação ao ativar a voz também oferece uma primeira interação para o navegador
  if (chave === "orientacoesVoz" && campo.checked) falarOrientacaoAcessivel("Orientações por voz ativadas.");
  else falarOrientacaoAcessivel("Preferência atualizada.");
}

// conecta uma única vez os controles existentes ou acrescentados ao perfil
function conectarControlesAcessibilidade() {
  const controles = document.querySelectorAll("[data-preferencia]");
  for (let i = 0; i < controles.length; i++) {
    // reaproveita o interruptor do perfil em todas as escolhas de ativação
    if (controles[i].type === "checkbox") controles[i].classList.add("interruptor");
    // a escolha de voz permanece disponível mesmo sem a integração do webchat
    if (controles[i].getAttribute("data-preferencia") === "vozIara") controles[i].disabled = false;
    if (!controles[i].hasAttribute("data-preferencia-conectada")) {
      controles[i].setAttribute("data-preferencia-conectada", "true");
      controles[i].addEventListener("change", alterarPreferenciaAcessibilidade);
    }
  }
  aplicarPreferenciasAcessibilidade();
}

// cria um campo básico para o mesmo modal utilizado em todas as páginas
// destino é o contêiner do novo controle, titulo é seu rótulo e chave relaciona o campo à preferência salva
function criarCampoAcessibilidade(destino, titulo, chave) {
  const rotulo = document.createElement("label");
  rotulo.className = "opcao-acessibilidade-global";
  const nome = document.createElement("span");
  nome.textContent = titulo;
  rotulo.appendChild(nome);
  let campo;
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
  } else {
    campo = document.createElement("input");
    campo.type = "checkbox";
  }
  campo.setAttribute("data-preferencia", chave);
  // guarda a preferência mesmo quando o dispositivo não oferece o recurso
  if (chave !== "fonte") campo.className = "interruptor";
  rotulo.appendChild(campo);
  destino.appendChild(rotulo);
}

// monta a janela compartilhada e conecta as preferências de cada página
function iniciarAcessibilidadeGlobal() {
  // cria o botão flutuante com nome acessível e o ícone local
  const botao = document.createElement("button");
  botao.type = "button";
  botao.id = "abrir-acessibilidade-global";
  botao.className = "botao-acessibilidade-global";
  botao.setAttribute("aria-label", "Abrir recursos de acessibilidade");
  botao.setAttribute("aria-controls", "modal-acessibilidade-global");
  const icone = document.createElement("img");
  let caminho = "../assets/icones/acessibilidade.svg";
  if (document.body.classList.contains("app") || location.pathname.indexOf("/admin/") !== -1) caminho = "../../assets/icones/acessibilidade.svg";
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
  criarCampoAcessibilidade(modal, "Ouvir a IARA", "vozIara");
  criarCampoAcessibilidade(modal, "Guia sonoro da travessia", "somTravessia");
  criarCampoAcessibilidade(modal, "Vibração · quando o dispositivo permitir", "vibracao");
  const restaurar = document.createElement("button");
  restaurar.type = "button";
  restaurar.className = "btn";
  restaurar.textContent = "Restaurar configurações";
  modal.appendChild(restaurar);
  document.body.appendChild(modal);
  // abre e fecha a mesma janela por meio dos controles visíveis
  // showmodal abre o diálogo nativo sobre a página e restringe a interação com o conteúdo ao fundo até seu fechamento
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
      // permite salvar a escolha para a futura integração de voz
      if (camposPerfil[i][1] === "vozIara") campo.disabled = false;
    }
  }
  // salva o formato compartilhado antes de conectar os controles
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
  // load só é disparado depois que o script externo termina de carregar, quando seu objeto global pode ser utilizado
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
  // salva a voz da iara separadamente do guia sonoro da travessia
  else if (botao.classList.contains("acao-voz")) preferencias.vozIara = !preferencias.vozIara;
  else if (botao.classList.contains("acao-vibracao")) preferencias.vibracao = !preferencias.vibracao;
  else if (botao.id === "btn-resetar-acess") { salvarPreferenciasAcessibilidade(preferenciasIniciaisAcessibilidade()); return; }
  salvarPreferenciasAcessibilidade(preferencias);
}

// inicializa os recursos compartilhados depois que o html já foi interpretado
iniciarAcessibilidadeGlobal();
// um único evento atende os controles existentes e os acrescentados pelos painéis
document.addEventListener("focusin", orientarFocoAcessivel);
// evita continuar narrando a página anterior depois de sair dela
window.addEventListener("pagehide", function () {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
});
// conecta cada botão institucional uma única vez
const controlesInstitucionais = document.querySelectorAll(".acao-aumentar, .acao-diminuir, .acao-contraste, .acao-tema, .acao-fonte-legivel, .acao-musical, .acao-voz, .acao-vibracao, #btn-resetar-acess");
for (let i = 0; i < controlesInstitucionais.length; i++) controlesInstitucionais[i].addEventListener("click", alterarControleInstitucional);
// aplica mudanças feitas em outra aba sem regravá-las
// o evento de armazenamento sincroniza mudanças de acessibilidade realizadas em outras abas da mesma origem
window.addEventListener("storage", function (event) { if (event.key === "meu-tempo-acessibilidade") aplicarPreferenciasAcessibilidade(); });

// =====================================================
// 3. chat interativo da iara (index.html)
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
    mensagemIara.textContent = "Orientação da IARA: " + resposta;
    listaChat.appendChild(mensagemIara);
    listaChat.scrollTop = listaChat.scrollHeight;
    inputIara.value = "";
  });
}

// =====================================================
// 4. simuladores da página nossa solução
// =====================================================
const botoesSimulador = document.querySelectorAll(".btn-abrir-simulador");

for (let i = 0; i < botoesSimulador.length; i++) {
  botoesSimulador[i].addEventListener("click", function () {
    const idAlvo = botoesSimulador[i].getAttribute("data-alvo");
    const caixa = document.getElementById(idAlvo);
    if (caixa) {
      caixa.classList.toggle("aberto");
      // informa se a demonstração está aberta ao leitor de tela
      botoesSimulador[i].setAttribute("aria-expanded", String(caixa.classList.contains("aberto")));
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
        '<p class="aviso-erro">Não há tempo suficiente para começar a travessia agora. O tempo estendido fica reservado para o <strong>próximo ciclo</strong>. Aguarde na calçada até o sinal abrir novamente.</p>';
    } else {
      statusTravessia.innerHTML =
        "<h3>Tempo estendido! (" + tempoRestante + "s + 12s extras)</h3>" +
        "<p><strong>Local:</strong> " + cruzamento + "</p>" +
        "<p><strong>Guia ativado:</strong> " + guia + "</p>" +
        '<p class="aviso-ok">A extensão foi aplicada ao ciclo atual. O celular emite o sinal sonoro e a vibração durante a travessia. Atravesse com atenção e observe sempre o semáforo e o fluxo de veículos.</p>';
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
      "<h3>Chamado de apoio na estação</h3>" +
      "<p><strong>Estação:</strong> " + estacao + "</p>" +
      "<p><strong>Localização exata:</strong> " + ponto + "</p>" +
      "<p><strong>Atendimento:</strong> " + apoio + "</p>" +
      '<p class="aviso-ok">Atendimento aceito! Um agente da estação foi acionado e está a caminho do ponto indicado. Permaneça no local informado.</p>';
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
      "<h3>Relato de zeladoria registrado</h3>" +
      "<p><strong>Ocorrência:</strong> " + tipo + "</p>" +
      "<p><strong>Local:</strong> " + local + "</p>" +
      '<p class="aviso-ok">Relato recebido! A ocorrência foi encaminhada à equipe de zeladoria responsável pela região. Você pode acompanhar o andamento pelo aplicativo.</p>';
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
    // informa se a conversa demonstrativa está aberta ao leitor de tela
    btnDemoIara.setAttribute("aria-expanded", String(demoIaraBox.classList.contains("aberto")));
  });
}

if (btnIaraSim && demoIaraMensagens) {
  btnIaraSim.addEventListener("click", function () {
    demoIaraMensagens.innerHTML +=
      '<div class="msg-usuario">“Sim, estou na Avenida Paulista, 5502.”</div>' +
      '<div class="msg-iara">Local confirmado! Se o ciclo atual tiver menos de 8 segundos, eu reservo o <strong>tempo estendido para o próximo ciclo</strong>. Vou te avisar por voz, som e vibração quando for a hora de atravessar.</div>';
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

// 5. filtro de assuntos, busca e acordeão no faq (faq.html)
// =====================================================
const campoBuscaFaq = document.getElementById("busca-faq");
const btnLimparFaq = document.getElementById("btn-limpar-faq");
// faq-cat-btn identifica os filtros por categoria e faq-item identifica as perguntas avaliadas pela busca
const botoesCategoriaFaq = document.querySelectorAll(".faq-cat-btn");
const itensFaq = document.querySelectorAll(".faq-item");
const contadorFaq = document.getElementById("contador-faq");
const avisoFaq = document.getElementById("sem-resultado");

let categoriaAtivaFaq = "todas";

function filtrarFaq() {
  if (itensFaq.length === 0) {
    return;
  }

  let termo = "";
  if (campoBuscaFaq) termo = campoBuscaFaq.value.toLowerCase().trim();
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
    contadorFaq.textContent = encontrados + " perguntas encontradas";
    if (encontrados === 1) contadorFaq.textContent = "1 pergunta encontrada";
  }

  if (avisoFaq) {
    avisoFaq.style.display = "none";
    if (encontrados === 0) avisoFaq.style.display = "block";
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

// abrir e fechar respostas ao clicar nas perguntas
// faq-pergunta identifica os botões que expandem ou recolhem cada resposta e atualizam seu estado acessível
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
      sinal.textContent = "−";
      if (aberta) sinal.textContent = "+";
    }
  });
}

// =====================================================
// 6. validação do formulário de contato (contato.html)
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
// apagar preferências locais (privacidade.html)
// =====================================================
const btnApagarPreferencias = document.getElementById("btn-apagar-preferencias");
const avisoPrivacidade = document.getElementById("aviso-privacidade");

if (btnApagarPreferencias) {
  btnApagarPreferencias.addEventListener("click", function () {
    // restaura somente os ajustes, preservando contas e solicitações
    salvarPreferenciasAcessibilidade(preferenciasIniciaisAcessibilidade());

    if (avisoPrivacidade) {
      avisoPrivacidade.textContent =
        "Preferências restauradas neste navegador.";
    }
  });
}

// =====================================================
// fluxo de cadastro realista com perfil do carlos (cadastro.html)
// =====================================================
// os formulários do cidadão são controlados por autenticacao.js

// btn-toggle-senha identifica os controles institucionais que mostram ou ocultam o campo de senha do mesmo grupo
const botoesToggleSenha = document.querySelectorAll(".btn-toggle-senha");

for (let i = 0; i < botoesToggleSenha.length; i++) {
  botoesToggleSenha[i].addEventListener("click", function () {
    const inputAlvo = this.parentElement.querySelector("input");
    if (!inputAlvo) return;

    const estaOculta = inputAlvo.type === "password";
    if (estaOculta) {
      inputAlvo.type = "text";
      this.setAttribute("aria-label", "Ocultar senha");
    } else {
      inputAlvo.type = "password";
      this.setAttribute("aria-label", "Mostrar senha");
    }
    this.setAttribute("aria-pressed", String(estaOculta));
    // identifica o pin do cidadão sem alterar os controles administrativos
    if (inputAlvo.id === "cad-senha" || inputAlvo.id === "cad-confirma-senha" || inputAlvo.id === "login-senha") {
      // acompanha o estado de visibilidade usando o nome correto da credencial
      let rotulo = "Mostrar PIN";
      if (estaOculta) rotulo = "Ocultar PIN";
      this.setAttribute("aria-label", rotulo);
    }
  });
}

// =====================================================
// recuperação de senha (recuperar-senha.html)
// =====================================================
const formRecuperarSenha = document.getElementById("form-recuperar-senha");

if (formRecuperarSenha) {
  const inputEmailRec = document.getElementById("rec-email");
  const avisoRecuperar = document.getElementById("aviso-recuperar");

  formRecuperarSenha.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let email = "";
    if (inputEmailRec) email = inputEmailRec.value.trim();

    if (!email || !email.includes("@")) {
      avisoRecuperar.textContent = "Informe um endereço de e-mail válido para continuar.";
      return;
    }

    avisoRecuperar.innerHTML =
      '<p style="margin-bottom: 10px;">Solicitação registrada! Se este e-mail estiver vinculado a uma conta, enviaremos as instruções de redefinição.</p>' +
      '<a href="login.html" class="link-seta">&larr; Voltar para o login</a>';

    formRecuperarSenha.reset();
  });
}
