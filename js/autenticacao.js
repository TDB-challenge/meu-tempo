// =================================================================
// PAINEL DE ACESSIBILIDADE
// =================================================================

// seleciona o botão responsável por abrir o painel
const botaoAcessibilidade = document.getElementById(
  "abrir-painel-acessibilidade",
);

// seleciona o painel com os recursos de acessibilidade
const painelAcessibilidade = document.getElementById("painel-acessibilidade");

// função que abre e fecha o painel
function alternarPainelAcessibilidade() {
  // verifica se o painel está escondido
  if (painelAcessibilidade.hidden === true) {
    painelAcessibilidade.hidden = false; // mostra o painel

    // informa que o painel está aberto
    botaoAcessibilidade.setAttribute("aria-expanded", "true");
  } else {
    painelAcessibilidade.hidden = true; // esconde o painel

    // informa que o painel está fechado
    botaoAcessibilidade.setAttribute("aria-expanded", "false");
  }
}

// verifica se os elementos existem no html
if (botaoAcessibilidade && painelAcessibilidade) {
  painelAcessibilidade.hidden = true; // inicia com o painel fechado

  // executa a função ao clicar no botão
  botaoAcessibilidade.addEventListener("click", alternarPainelAcessibilidade);
}

// =================================================================
// TAMANHO DOS TEXTOS
// =================================================================

// seleciona o botão de aumentar texto
const botaoAumentarTexto = document.querySelector(".aumentar-texto");

// seleciona o botão de restaurar texto
const botaoRestaurarTexto = document.querySelector(".restaurar-texto");

// guarda o tamanho atual da fonte em porcentagem
let tamanhoTexto = 100;

// função que aumenta o tamanho dos textos
function aumentarTexto() {
  // verifica se o tamanho ainda não atingiu o limite
  if (tamanhoTexto < 200) {
    tamanhoTexto = tamanhoTexto + 25; // aumenta 25 pontos percentuais

    // altera o tamanho da fonte da tag html
    document.documentElement.style.fontSize = tamanhoTexto + "%";

    // salva o tamanho escolhido no navegador
    localStorage.setItem("admin-tamanho-texto", tamanhoTexto);
  }
}

// função que restaura o tamanho original
function restaurarTexto() {
  tamanhoTexto = 100; // retorna ao tamanho inicial

  // aplica novamente o tamanho original
  document.documentElement.style.fontSize = "100%";

  // atualiza o tamanho armazenado no navegador
  localStorage.setItem("admin-tamanho-texto", tamanhoTexto);
}

// verifica se o botão de aumentar existe
if (botaoAumentarTexto) {
  // executa a função ao clicar no botão
  botaoAumentarTexto.addEventListener("click", aumentarTexto);
}

// verifica se o botão de restaurar existe
if (botaoRestaurarTexto) {
  // executa a função ao clicar no botão
  botaoRestaurarTexto.addEventListener("click", restaurarTexto);
}

// =================================================================
// TEMA ESCURO E ALTO CONTRASTE
// =================================================================

// seleciona o corpo da página
const corpoPagina = document.body;

// seleciona o botão de tema escuro
const botaoTemaEscuro = document.querySelector(".alternar-tema");

// seleciona o botão de alto contraste
const botaoAltoContraste = document.querySelector(".alternar-contraste");

// função que ativa e desativa o tema escuro
function alternarTemaEscuro() {
  // verifica se o tema escuro está ativo
  if (corpoPagina.classList.contains("tema-escuro")) {
    // remove o tema escuro
    corpoPagina.classList.remove("tema-escuro");

    // informa que o botão está desativado
    botaoTemaEscuro.setAttribute("aria-pressed", "false");

    // salva o tema normal no navegador
    localStorage.setItem("admin-tema", "normal");
  } else {
    // remove o alto contraste para evitar conflito
    corpoPagina.classList.remove("alto-contraste");

    // adiciona a classe do tema escuro
    corpoPagina.classList.add("tema-escuro");

    // informa que o tema escuro está ativo
    botaoTemaEscuro.setAttribute("aria-pressed", "true");

    // informa que o alto contraste está desativado
    botaoAltoContraste.setAttribute("aria-pressed", "false");

    // salva o tema escuro no navegador
    localStorage.setItem("admin-tema", "tema-escuro");
  }
}

// função que ativa e desativa o alto contraste
function alternarAltoContraste() {
  // verifica se o alto contraste está ativo
  if (corpoPagina.classList.contains("alto-contraste")) {
    // remove o alto contraste
    corpoPagina.classList.remove("alto-contraste");

    // informa que o botão está desativado
    botaoAltoContraste.setAttribute("aria-pressed", "false");

    // salva o tema normal no navegador
    localStorage.setItem("admin-tema", "normal");
  } else {
    // remove o tema escuro para evitar conflito
    corpoPagina.classList.remove("tema-escuro");

    // adiciona a classe de alto contraste
    corpoPagina.classList.add("alto-contraste");

    // informa que o alto contraste está ativo
    botaoAltoContraste.setAttribute("aria-pressed", "true");

    // informa que o tema escuro está desativado
    botaoTemaEscuro.setAttribute("aria-pressed", "false");

    // salva o alto contraste no navegador
    localStorage.setItem("admin-tema", "alto-contraste");
  }
}

// verifica se os dois botões existem
if (botaoTemaEscuro && botaoAltoContraste) {
  // define o estado inicial dos botões
  botaoTemaEscuro.setAttribute("aria-pressed", "false");
  botaoAltoContraste.setAttribute("aria-pressed", "false");

  // executa a função ao clicar no tema escuro
  botaoTemaEscuro.addEventListener("click", alternarTemaEscuro);

  // executa a função ao clicar no alto contraste
  botaoAltoContraste.addEventListener("click", alternarAltoContraste);
}

// =================================================================
// PREFERÊNCIAS DE ACESSIBILIDADE
// =================================================================

// função que recupera as preferências salvas no navegador
function carregarPreferencias() {
  // recupera o tamanho de texto salvo anteriormente
  const tamanhoSalvo = localStorage.getItem("admin-tamanho-texto");

  // recupera o tema escolhido anteriormente
  const temaSalvo = localStorage.getItem("admin-tema");

  // verifica se existe um tamanho de texto salvo
  if (tamanhoSalvo !== null) {
    // transforma o valor armazenado de texto para número
    const tamanhoRecuperado = Number(tamanhoSalvo);

    // verifica se o tamanho está dentro dos limites permitidos
    if (tamanhoRecuperado >= 100 && tamanhoRecuperado <= 200) {
      // atualiza a variável com o tamanho recuperado
      tamanhoTexto = tamanhoRecuperado;

      // aplica o tamanho salvo na página
      document.documentElement.style.fontSize = tamanhoTexto + "%";
    }
  }

  // verifica se os botões de tema existem na página
  if (botaoTemaEscuro && botaoAltoContraste) {
    // verifica se o tema salvo é o tema escuro
    if (temaSalvo === "tema-escuro") {
      // aplica o tema escuro
      corpoPagina.classList.add("tema-escuro");

      // informa que o botão está ativo
      botaoTemaEscuro.setAttribute("aria-pressed", "true");
    }

    // verifica se o tema salvo é o alto contraste
    if (temaSalvo === "alto-contraste") {
      // aplica o alto contraste
      corpoPagina.classList.add("alto-contraste");

      // informa que o botão está ativo
      botaoAltoContraste.setAttribute("aria-pressed", "true");
    }
  }
}

// executa a função quando o javascript é carregado
carregarPreferencias();
