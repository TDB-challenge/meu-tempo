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

// =====================================================
// 2. BARRA DE ACESSIBILIDADE E CONTROLES VISUAIS
// =====================================================
const btnAbrirAcess = document.getElementById("btn-abrir-acess");
const painelAcess = document.getElementById("painel-acess-rapido");

if (btnAbrirAcess && painelAcess) {
  btnAbrirAcess.addEventListener("click", function () {
    painelAcess.classList.toggle("aberto");
  });
}

const botoesAumentar = document.querySelectorAll(".acao-aumentar");
const botoesDiminuir = document.querySelectorAll(".acao-diminuir");
const botoesContraste = document.querySelectorAll(".acao-contraste");
const botoesTema = document.querySelectorAll(".acao-tema");
const botoesFonteLegivel = document.querySelectorAll(".acao-fonte-legivel");
const btnResetarAcess = document.getElementById("btn-resetar-acess");
const feedbackAcess = document.getElementById("feedback-acess");

let escalaFonte = 100;

function atualizarStatusAcessibilidade() {
  if (!feedbackAcess) {
    return;
  }

  const ativos = [];

  if (escalaFonte > 100) {
    ativos.push("Texto ampliado (" + escalaFonte + "%)");
  }
  if (document.body.classList.contains("fonte-legivel")) {
    ativos.push("Tipografia de alta legibilidade");
  }
  if (document.body.classList.contains("alto-contraste")) {
    ativos.push("Alto contraste");
  }
  if (document.body.classList.contains("tema-escuro")) {
    ativos.push("Tema escuro");
  }

  if (ativos.length === 0) {
    feedbackAcess.textContent = "Configuração atual: Leitura padrão ativada (100%).";
  } else {
    feedbackAcess.textContent = "Filtros ativos agora: " + ativos.join(" • ") + ".";
  }
}

for (let i = 0; i < botoesAumentar.length; i++) {
  botoesAumentar[i].addEventListener("click", function () {
    if (escalaFonte < 145) {
      escalaFonte += 15;
      document.documentElement.style.fontSize = escalaFonte + "%";
    }
    atualizarStatusAcessibilidade();
  });
}

for (let i = 0; i < botoesDiminuir.length; i++) {
  botoesDiminuir[i].addEventListener("click", function () {
    if (escalaFonte > 100) {
      escalaFonte -= 15;
      document.documentElement.style.fontSize = escalaFonte + "%";
    }
    atualizarStatusAcessibilidade();
  });
}

for (let i = 0; i < botoesFonteLegivel.length; i++) {
  botoesFonteLegivel[i].addEventListener("click", function () {
    document.body.classList.toggle("fonte-legivel");
    atualizarStatusAcessibilidade();
  });
}

for (let i = 0; i < botoesContraste.length; i++) {
  botoesContraste[i].addEventListener("click", function () {
    document.body.classList.remove("tema-escuro");
    document.body.classList.toggle("alto-contraste");
    atualizarStatusAcessibilidade();
  });
}

for (let i = 0; i < botoesTema.length; i++) {
  botoesTema[i].addEventListener("click", function () {
    document.body.classList.remove("alto-contraste");
    document.body.classList.toggle("tema-escuro");
    atualizarStatusAcessibilidade();
  });
}

if (btnResetarAcess) {
  btnResetarAcess.addEventListener("click", function () {
    escalaFonte = 100;
    document.documentElement.style.fontSize = "100%";
    document.body.classList.remove("fonte-grande", "fonte-legivel", "alto-contraste", "tema-escuro");
    atualizarStatusAcessibilidade();
  });
}

// =====================================================
// CONTROLE DOS TOGGLES DE ACESSIBILIDADE
// =====================================================
const switchesToggle = document.querySelectorAll(".switch-toggle");

for (let i = 0; i < switchesToggle.length; i++) {
  switchesToggle[i].addEventListener("click", function (event) {
    // Garante que o alvo seja sempre o botão .switch-toggle, mesmo clicando na bolinha interna
    const botao = event.currentTarget;
    
    botao.classList.toggle("ativo");
    const ligado = botao.classList.contains("ativo");
    botao.setAttribute("aria-pressed", ligado);

    if (botao.classList.contains("acao-contraste")) {
      document.body.classList.toggle("alto-contraste", ligado);
    } else if (botao.classList.contains("acao-voz")) {
      document.body.classList.toggle("voz-iara-ativa", ligado);
    } else if (botao.classList.contains("acao-vibracao")) {
      document.body.classList.toggle("vibracao-ativa", ligado);
    } else if (botao.classList.contains("acao-musical")) {
      document.body.classList.toggle("musical-ativo", ligado);
    }

    if (typeof atualizarStatusAcessibilidade === "function") {
      atualizarStatusAcessibilidade();
    }
  });
}

// Botão flutuante de Libras
const btnLibras = document.getElementById("btn-libras");
if (btnLibras) {
  btnLibras.addEventListener("click", function () {
    alert("Conteúdo em Libras: os vídeos com intérprete estão em fase de revisão.");
  });
}

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

    listaChat.innerHTML += '<div class="msg-usuario">' + textoDigitado + "</div>";

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

    listaChat.innerHTML += '<div class="msg-iara">' + resposta + "</div>";
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
// 5. FILTRO DE PERGUNTAS NO FAQ (faq.html)
// =====================================================
const campoBuscaFaq = document.getElementById("busca-faq");
const itensFaq = document.querySelectorAll(".faq-item");
const avisoFaq = document.getElementById("sem-resultado");

if (campoBuscaFaq) {
  campoBuscaFaq.addEventListener("input", function () {
    const termo = campoBuscaFaq.value.toLowerCase();
    let encontrados = 0;

    for (let i = 0; i < itensFaq.length; i++) {
      const conteudo = itensFaq[i].textContent.toLowerCase();
      if (conteudo.includes(termo)) {
        itensFaq[i].style.display = "block";
        encontrados++;
      } else {
        itensFaq[i].style.display = "none";
      }
    }

    if (avisoFaq) {
      avisoFaq.style.display = encontrados === 0 ? "block" : "none";
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