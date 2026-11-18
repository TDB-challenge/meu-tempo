// =================================================================
// PAINEL DE ACESSIBILIDADE
// =================================================================

// seleciona o botão que abre o painel
const botaoAcessibilidade = document.getElementById(
  "abrir-painel-acessibilidade",
);

// seleciona o painel de acessibilidade
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

// verifica se os elementos existem na página
if (botaoAcessibilidade && painelAcessibilidade) {
  painelAcessibilidade.hidden = true; // inicia com o painel fechado

  // chama a função ao clicar no botão
  botaoAcessibilidade.addEventListener("click", alternarPainelAcessibilidade);
}

// =================================================================
// TAMANHO DOS TEXTOS
// =================================================================

// seleciona o botão de aumentar texto pela classe
const botaoAumentarTexto = document.querySelector(".aumentar-texto");

// seleciona o botão de restaurar texto pela classe
const botaoRestaurarTexto = document.querySelector(".restaurar-texto");

// guarda o tamanho atual da fonte em porcentagem
let tamanhoTexto = 100;

// função que aumenta o tamanho dos textos
function aumentarTexto() {
  // verifica se o tamanho ainda está abaixo do limite
  if (tamanhoTexto < 200) {
    // aumenta o tamanho em 25%
    tamanhoTexto = tamanhoTexto + 25;

    // altera o tamanho da fonte da tag html
    document.documentElement.style.fontSize = tamanhoTexto + "%";
  }
}

// função que restaura o tamanho dos textos
function restaurarTexto() {
  // retorna a variável para o tamanho inicial
  tamanhoTexto = 100;

  // restaura o tamanho da fonte
  document.documentElement.style.fontSize = "100%";
}

// verifica se o botão de aumentar existe
if (botaoAumentarTexto) {
  // aumenta os textos quando o botão for clicado
  botaoAumentarTexto.addEventListener("click", aumentarTexto);
}

// verifica se o botão de restaurar existe
if (botaoRestaurarTexto) {
  // restaura os textos quando o botão for clicado
  botaoRestaurarTexto.addEventListener("click", restaurarTexto);
}

// =================================================================
// PAINEL DE ACESSIBILIDADE
// =================================================================

// seleciona o botão que abre o painel
const botaoAcessibilidade = document.getElementById(
  "abrir-painel-acessibilidade",
);

// seleciona o painel de acessibilidade
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

// verifica se os elementos existem na página
if (botaoAcessibilidade && painelAcessibilidade) {
  painelAcessibilidade.hidden = true; // inicia com o painel fechado

  // chama a função ao clicar no botão
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
  // verifica se o tamanho ainda está abaixo do limite
  if (tamanhoTexto < 200) {
    tamanhoTexto = tamanhoTexto + 25; // aumenta o tamanho em 25%

    // altera o tamanho da fonte da tag html
    document.documentElement.style.fontSize = tamanhoTexto + "%";
  }
}

// função que restaura o tamanho dos textos
function restaurarTexto() {
  tamanhoTexto = 100; // retorna ao tamanho inicial

  // restaura o tamanho da fonte
  document.documentElement.style.fontSize = "100%";
}

// verifica se o botão de aumentar existe
if (botaoAumentarTexto) {
  // executa a função ao clicar
  botaoAumentarTexto.addEventListener("click", aumentarTexto);
}

// verifica se o botão de restaurar existe
if (botaoRestaurarTexto) {
  // executa a função ao clicar
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

// função que ativa ou desativa o tema escuro
function alternarTemaEscuro() {
  // verifica se o corpo da página possui a classe tema-escuro
  if (corpoPagina.classList.contains("tema-escuro")) {
    // remove a classe e retorna ao tema normal
    corpoPagina.classList.remove("tema-escuro");

    // informa que o botão está desativado
    botaoTemaEscuro.setAttribute("aria-pressed", "false");
  } else {
    // desativa o alto contraste antes de ativar o tema escuro
    corpoPagina.classList.remove("alto-contraste");

    // adiciona a classe que altera as cores da página
    corpoPagina.classList.add("tema-escuro");

    // informa que o tema escuro está ativado
    botaoTemaEscuro.setAttribute("aria-pressed", "true");

    // informa que o alto contraste está desativado
    botaoAltoContraste.setAttribute("aria-pressed", "false");
  }
}

// função que ativa ou desativa o alto contraste
function alternarAltoContraste() {
  // verifica se o corpo da página possui a classe alto-contraste
  if (corpoPagina.classList.contains("alto-contraste")) {
    // remove a classe e retorna ao tema normal
    corpoPagina.classList.remove("alto-contraste");

    // informa que o botão está desativado
    botaoAltoContraste.setAttribute("aria-pressed", "false");
  } else {
    // desativa o tema escuro antes de ativar o alto contraste
    corpoPagina.classList.remove("tema-escuro");

    // adiciona a classe que altera as cores da página
    corpoPagina.classList.add("alto-contraste");

    // informa que o alto contraste está ativado
    botaoAltoContraste.setAttribute("aria-pressed", "true");

    // informa que o tema escuro está desativado
    botaoTemaEscuro.setAttribute("aria-pressed", "false");
  }
}

// verifica se os dois botões existem na página
if (botaoTemaEscuro && botaoAltoContraste) {
  // informa que os dois temas começam desativados
  botaoTemaEscuro.setAttribute("aria-pressed", "false");
  botaoAltoContraste.setAttribute("aria-pressed", "false");

  // executa a função de tema escuro ao clicar
  botaoTemaEscuro.addEventListener("click", alternarTemaEscuro);

  // executa a função de alto contraste ao clicar
  botaoAltoContraste.addEventListener("click", alternarAltoContraste);
}
