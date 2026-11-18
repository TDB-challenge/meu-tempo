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

// =================================================================
// MENU RESPONSIVO
// =================================================================

// seleciona o botão do menu
const botaoMenu = document.getElementById("abrir-menu");

// seleciona o menu que contém os links
const menuNavegacao = document.getElementById("menu-navegacao");

// função que abre e fecha o menu
function alternarMenu() {
  // adiciona ou remove a classe que mostra o menu
  menuNavegacao.classList.toggle("menu-aberto");

  // verifica se o menu está aberto
  if (menuNavegacao.classList.contains("menu-aberto")) {
    // informa que o menu está aberto
    botaoMenu.setAttribute("aria-expanded", "true");
  } else {
    // informa que o menu está fechado
    botaoMenu.setAttribute("aria-expanded", "false");
  }
}

// verifica se os elementos existem
if (botaoMenu && menuNavegacao) {
  // executa a função ao clicar no botão
  botaoMenu.addEventListener("click", alternarMenu);
}

// =================================================================
// VISUALIZAÇÃO DAS SENHAS
// =================================================================

// seleciona todos os botões de visualizar senha
const botoesSenha = document.querySelectorAll(".botao-visualizar-senha");

// função que mostra ou esconde a senha
function alternarSenha(event) {
  // identifica o botão que foi clicado
  const botao = event.currentTarget;

  // recupera o id do campo de senha
  const idCampo = botao.getAttribute("data-campo-senha");

  // seleciona o campo correspondente
  const campoSenha = document.getElementById(idCampo);

  // verifica se o campo existe
  if (campoSenha) {
    // verifica se a senha está escondida
    if (campoSenha.type === "password") {
      campoSenha.type = "text"; // mostra a senha

      // informa que a visualização está ativa
      botao.setAttribute("aria-pressed", "true");
    } else {
      campoSenha.type = "password"; // esconde a senha

      // informa que a visualização está desativada
      botao.setAttribute("aria-pressed", "false");
    }
  }
}

// percorre os botões de senha encontrados
for (let i = 0; i < botoesSenha.length; i++) {
  // executa a função quando um botão for clicado
  botoesSenha[i].addEventListener("click", alternarSenha);
}

// =================================================================
// VALIDAÇÃO DOS REQUISITOS DA SENHA
// =================================================================

// seleciona o campo de criação da senha
const senhaCadastro = document.getElementById("senha");

// seleciona o campo de confirmação da senha
const confirmarSenha = document.getElementById("confirmar-senha");

// seleciona cada requisito da lista pelo atributo data-requisito
const requisitoComprimento = document.querySelector(
  '[data-requisito="comprimento"]',
);
const requisitoMaiuscula = document.querySelector(
  '[data-requisito="maiuscula"]',
);
const requisitoMinuscula = document.querySelector(
  '[data-requisito="minuscula"]',
);
const requisitoNumero = document.querySelector('[data-requisito="numero"]');
const requisitoEspecial = document.querySelector('[data-requisito="especial"]');

// guarda o resultado da validação da senha
let senhaValida = false;

// função que altera a aparência de um requisito
// requisito representa o elemento da lista
// atendido representa o resultado da condição
function marcarRequisito(requisito, atendido) {
  // verifica se a regra foi cumprida
  if (atendido) {
    // adiciona a classe que deixa o requisito verde
    requisito.classList.add("requisito-atendido");
  } else {
    // remove a classe quando a regra não é cumprida
    requisito.classList.remove("requisito-atendido");
  }
}

// função que verifica os requisitos da senha
function validarSenha() {
  // recupera a senha digitada
  const senha = senhaCadastro.value;

  // verifica se possui pelo menos 8 caracteres
  const comprimento = senha.length >= 8;

  // verifica se possui uma letra maiúscula
  const maiuscula = /[A-Z]/.test(senha);

  // verifica se possui uma letra minúscula
  const minuscula = /[a-z]/.test(senha);

  // verifica se possui um número
  const numero = /[0-9]/.test(senha);

  // verifica se possui um símbolo especial
  const especial = /[!@#$%&*()+?_=.,:;/-]/.test(senha);

  // atualiza a aparência de cada requisito
  marcarRequisito(requisitoComprimento, comprimento);
  marcarRequisito(requisitoMaiuscula, maiuscula);
  marcarRequisito(requisitoMinuscula, minuscula);
  marcarRequisito(requisitoNumero, numero);
  marcarRequisito(requisitoEspecial, especial);

  // verifica se todos os requisitos foram cumpridos
  if (comprimento && maiuscula && minuscula && numero && especial) {
    senhaValida = true;
  } else {
    senhaValida = false;
  }
}

// =================================================================
// CONFIRMAÇÃO DA SENHA
// =================================================================

// seleciona o elemento que apresenta a mensagem de confirmação
const mensagemConfirmacao = document.getElementById(
  "mensagem-confirmacao-senha",
);

// guarda o resultado da comparação entre as senhas
let senhasIguais = false;

// função que compara as duas senhas
function validarConfirmacao() {
  // remove as classes das mensagens anteriores
  mensagemConfirmacao.classList.remove("mensagem-sucesso");
  mensagemConfirmacao.classList.remove("mensagem-erro");

  // verifica se o campo de confirmação está vazio
  if (confirmarSenha.value === "") {
    // mantém a mensagem vazia
    mensagemConfirmacao.textContent = "";

    senhasIguais = false;
  } else if (senhaCadastro.value === confirmarSenha.value) {
    // apresenta a mensagem de sucesso
    mensagemConfirmacao.textContent = "As senhas coincidem.";

    // adiciona a classe que deixa a mensagem verde
    mensagemConfirmacao.classList.add("mensagem-sucesso");

    senhasIguais = true;
  } else {
    // apresenta a mensagem de erro
    mensagemConfirmacao.textContent = "As senhas não coincidem.";

    // adiciona a classe que deixa a mensagem vermelha
    mensagemConfirmacao.classList.add("mensagem-erro");

    senhasIguais = false;
  }
}

// verifica se os elementos do cadastro existem na página
if (senhaCadastro && confirmarSenha && mensagemConfirmacao) {
  // verifica os requisitos enquanto o usuário digita a senha
  senhaCadastro.addEventListener("input", validarSenha);

  // compara novamente as senhas quando a primeira for modificada
  senhaCadastro.addEventListener("input", validarConfirmacao);

  // compara as senhas enquanto o usuário digita a confirmação
  confirmarSenha.addEventListener("input", validarConfirmacao);

  // verifica os valores iniciais dos campos
  validarSenha();
  validarConfirmacao();
}
