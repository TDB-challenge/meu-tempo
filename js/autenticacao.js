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
