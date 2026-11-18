// =================================================================
// PAINEL DE ACESSIBILIDADE
// =================================================================

// seleciona o botão responsável por abrir e fechar o painel
const botaoAcessibilidade = document.getElementById(
  "abrir-painel-acessibilidade",
);

// seleciona o painel que contém os recursos de acessibilidade
const painelAcessibilidade = document.getElementById("painel-acessibilidade");

// função responsável por abrir e fechar o painel
function alternarPainelAcessibilidade() {
  // verifica se o painel está escondido
  if (painelAcessibilidade.hidden === true) {
    painelAcessibilidade.hidden = false; // mostra o painel

    // informa ao leitor de tela que o painel está aberto
    botaoAcessibilidade.setAttribute("aria-expanded", "true");
  } else {
    painelAcessibilidade.hidden = true; // esconde o painel

    // informa ao leitor de tela que o painel está fechado
    botaoAcessibilidade.setAttribute("aria-expanded", "false");
  }
}

// verifica se o botão e o painel existem no html
if (botaoAcessibilidade && painelAcessibilidade) {
  painelAcessibilidade.hidden = true; // inicia com o painel fechado

  // executa a função quando o usuário clica no botão
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
// utilizamos let porque esse valor pode mudar
let tamanhoTexto = 100;

// função responsável por aumentar o tamanho dos textos
function aumentarTexto() {
  // verifica se o texto ainda não atingiu o limite de 200%
  if (tamanhoTexto < 200) {
    tamanhoTexto = tamanhoTexto + 25; // aumenta 25 pontos percentuais

    // documentElement representa a tag html
    // fontSize altera o tamanho da fonte
    document.documentElement.style.fontSize = tamanhoTexto + "%";
  }
}

// função responsável por restaurar o tamanho original
function restaurarTexto() {
  tamanhoTexto = 100; // retorna ao tamanho inicial

  // aplica novamente o tamanho original da fonte
  document.documentElement.style.fontSize = "100%";
}

// verifica se o botão de aumentar texto existe
if (botaoAumentarTexto) {
  // executa a função ao clicar no botão
  botaoAumentarTexto.addEventListener("click", aumentarTexto);
}

// verifica se o botão de restaurar texto existe
if (botaoRestaurarTexto) {
  // executa a função ao clicar no botão
  botaoRestaurarTexto.addEventListener("click", restaurarTexto);
}

// =================================================================
// TEMA ESCURO E ALTO CONTRASTE
// =================================================================

// seleciona a tag body da página
const corpoPagina = document.body;

// seleciona o botão responsável pelo tema escuro
const botaoTemaEscuro = document.querySelector(".alternar-tema");

// seleciona o botão responsável pelo alto contraste
const botaoAltoContraste = document.querySelector(".alternar-contraste");

// função responsável por ativar e desativar o tema escuro
function alternarTemaEscuro() {
  // contains verifica se o body possui a classe tema-escuro
  if (corpoPagina.classList.contains("tema-escuro")) {
    // remove a classe do body e retorna ao tema normal
    corpoPagina.classList.remove("tema-escuro");

    // informa que o botão está desativado
    botaoTemaEscuro.setAttribute("aria-pressed", "false");
  } else {
    // remove o alto contraste para evitar dois temas ativos
    corpoPagina.classList.remove("alto-contraste");

    // adiciona a classe que contém os estilos do tema escuro
    corpoPagina.classList.add("tema-escuro");

    // informa que o tema escuro está ativado
    botaoTemaEscuro.setAttribute("aria-pressed", "true");

    // informa que o alto contraste está desativado
    botaoAltoContraste.setAttribute("aria-pressed", "false");
  }
}

// função responsável por ativar e desativar o alto contraste
function alternarAltoContraste() {
  // verifica se o body possui a classe alto-contraste
  if (corpoPagina.classList.contains("alto-contraste")) {
    // remove a classe e retorna ao tema normal
    corpoPagina.classList.remove("alto-contraste");

    // informa que o botão está desativado
    botaoAltoContraste.setAttribute("aria-pressed", "false");
  } else {
    // remove o tema escuro para evitar conflito entre os estilos
    corpoPagina.classList.remove("tema-escuro");

    // adiciona a classe que contém os estilos de alto contraste
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
