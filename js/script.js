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

for (let i = 0; i < botoesAumentar.length; i++) {
  botoesAumentar[i].addEventListener("click", function () {
    document.body.classList.add("fonte-grande");
  });
}

for (let i = 0; i < botoesDiminuir.length; i++) {
  botoesDiminuir[i].addEventListener("click", function () {
    document.body.classList.remove("fonte-grande");
  });
}

for (let i = 0; i < botoesContraste.length; i++) {
  botoesContraste[i].addEventListener("click", function () {
    document.body.classList.toggle("alto-contraste");
  });
}

for (let i = 0; i < botoesTema.length; i++) {
  botoesTema[i].addEventListener("click", function () {
    document.body.classList.toggle("tema-escuro");
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
// 4. SIMULADORES DA PÁGINA NOSSA SOLUÇÃO (solucao.html)
// =====================================================
const formTravessia = document.getElementById("form-travessia");
const statusTravessia = document.getElementById("status-travessia");

if (formTravessia) {
  formTravessia.addEventListener("submit", function (event) {
    event.preventDefault();
    const cruzamento = document.getElementById("cruzamento").value;
    const ritmo = document.getElementById("ritmo").value;

    statusTravessia.innerHTML =
      "<h3>Pedido confirmado!</h3>" +
      "<p><strong>Cruzamento:</strong> " + cruzamento + "</p>" +
      "<p><strong>Opção:</strong> " + ritmo + "</p>" +
      '<p class="aviso-ok">Tempo extra programado para o próximo ciclo. Aguarde o sinal verde de pedestres na via.</p>';
  });
}

const formMetro = document.getElementById("form-metro");
const statusMetro = document.getElementById("status-metro");

if (formMetro) {
  formMetro.addEventListener("submit", function (event) {
    event.preventDefault();
    const estacao = document.getElementById("estacao").value;
    const apoio = document.getElementById("apoio").value;

    statusMetro.innerHTML =
      "<h3>Apoio solicitado!</h3>" +
      "<p><strong>Estação:</strong> " + estacao + "</p>" +
      "<p><strong>Atendimento:</strong> " + apoio + "</p>" +
      '<p class="aviso-ok">A equipe operacional da estação foi avisada. Aguarde próximo aos bloqueios.</p>';
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
        '<p class="aviso-erro">Por favor, informe o endereço ou ponto de referência.</p>';
      return;
    }

    statusZeladoria.innerHTML =
      '<p class="aviso-ok">Ocorrência registrada (' + tipo + " em " + local + "). Obrigado pela colaboração!</p>";
    formZeladoria.reset();
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