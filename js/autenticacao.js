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

// =================================================================
// NAVEGAÇÃO ENTRE AS ETAPAS DO CADASTRO
// =================================================================

// seleciona as três etapas do formulário
const etapaIdentificacao = document.getElementById("etapa-identificacao");
const etapaVinculo = document.getElementById("etapa-vinculo");
const etapaRevisao = document.getElementById("etapa-revisao");

// seleciona os botões de navegação
const avancarIdentificacao = document.getElementById("avancar-identificacao");
const avancarVinculo = document.getElementById("avancar-vinculo");
const voltarIdentificacao = document.getElementById("voltar-identificacao");
const voltarVinculo = document.getElementById("voltar-vinculo");

// seleciona os botões de edição da revisão
const editarIdentificacao = document.getElementById("editar-identificacao");
const editarVinculo = document.getElementById("editar-vinculo");

// seleciona os indicadores de progresso
const indicadoresEtapas = document.querySelectorAll(".etapa-cadastro");

// seleciona os campos da primeira etapa
const nomeCompleto = document.getElementById("nome-completo");
const matriculaFuncional = document.getElementById("matricula-funcional");
const emailInstitucional = document.getElementById("email-institucional");
const aceitarTermos = document.getElementById("aceitar-termos");

// seleciona os campos da segunda etapa
const orgaoCadastro = document.getElementById("orgao");
const funcaoCadastro = document.getElementById("funcao");

// seleciona as mensagens de erro
const mensagemIdentificacao = document.getElementById("mensagem-identificacao");
const mensagemVinculo = document.getElementById("mensagem-vinculo");

// =================================================================
// EXIBIÇÃO DAS ETAPAS
// =================================================================

// numero representa a etapa que será exibida
function mostrarEtapa(numero) {
  // esconde todas as etapas
  etapaIdentificacao.hidden = true;
  etapaVinculo.hidden = true;
  etapaRevisao.hidden = true;

  // desativa os campos das etapas escondidas
  etapaIdentificacao.disabled = true;
  etapaVinculo.disabled = true;
  etapaRevisao.disabled = true;

  // mostra e ativa a etapa escolhida
  if (numero === 1) {
    etapaIdentificacao.hidden = false;
    etapaIdentificacao.disabled = false;
  } else if (numero === 2) {
    etapaVinculo.hidden = false;
    etapaVinculo.disabled = false;
  } else if (numero === 3) {
    etapaRevisao.hidden = false;
    etapaRevisao.disabled = false;
  }

  // atualiza o indicador de progresso
  atualizarIndicadores(numero);
}

// =================================================================
// INDICADOR DE PROGRESSO
// =================================================================

// função que atualiza a aparência das etapas
function atualizarIndicadores(numero) {
  // percorre os três indicadores
  for (let i = 0; i < indicadoresEtapas.length; i++) {
    // remove as classes anteriores
    indicadoresEtapas[i].classList.remove("etapa-ativa");
    indicadoresEtapas[i].classList.remove("etapa-concluida");

    // remove a indicação anterior de etapa atual
    indicadoresEtapas[i].removeAttribute("aria-current");

    // verifica se é a etapa atual
    if (i + 1 === numero) {
      // destaca a etapa atual
      indicadoresEtapas[i].classList.add("etapa-ativa");

      // informa a etapa atual ao leitor de tela
      indicadoresEtapas[i].setAttribute("aria-current", "step");
    } else if (i + 1 < numero) {
      // destaca as etapas anteriores como concluídas
      indicadoresEtapas[i].classList.add("etapa-concluida");
    }
  }
}

// =================================================================
// VALIDAÇÃO DA IDENTIFICAÇÃO
// =================================================================

// função que verifica os dados da primeira etapa
function validarIdentificacao() {
  // esconde mensagens anteriores
  mensagemIdentificacao.hidden = true;

  // atualiza a validação das senhas
  validarSenha();
  validarConfirmacao();

  // verifica se o nome foi preenchido
  if (nomeCompleto.value.trim() === "") {
    mensagemIdentificacao.textContent = "Informe seu nome completo.";
  } else if (matriculaFuncional.value.trim() === "") {
    mensagemIdentificacao.textContent = "Informe sua matrícula funcional.";
  } else if (!emailInstitucional.checkValidity()) {
    mensagemIdentificacao.textContent =
      "Informe um e-mail institucional válido.";
  } else if (senhaValida === false) {
    mensagemIdentificacao.textContent =
      "Preencha todos os requisitos da senha.";
  } else if (senhasIguais === false) {
    mensagemIdentificacao.textContent = "As senhas precisam ser iguais.";
  } else if (aceitarTermos.checked === false) {
    mensagemIdentificacao.textContent = "Aceite os termos para continuar.";
  } else {
    // avança quando todos os dados estão corretos
    mostrarEtapa(2);

    // encerra a função sem exibir erros
    return;
  }

  // aplica a aparência de mensagem de erro
  mensagemIdentificacao.classList.add("mensagem-erro");

  // exibe a mensagem
  mensagemIdentificacao.hidden = false;
}

// =================================================================
// VALIDAÇÃO DO VÍNCULO PROFISSIONAL
// =================================================================

// função que verifica os dados da segunda etapa
function validarVinculo() {
  // esconde mensagens anteriores
  mensagemVinculo.hidden = true;

  // verifica a instituição
  if (orgaoCadastro.value === "") {
    mensagemVinculo.textContent = "Selecione uma instituição.";

    // verifica a função
  } else if (funcaoCadastro.value === "") {
    mensagemVinculo.textContent = "Selecione sua função.";

    // verifica a linha caso os campos de transporte estejam visíveis
  } else if (camposTransporte.hidden === false && linhaCadastro.value === "") {
    mensagemVinculo.textContent = "Selecione sua linha de atuação.";

    // verifica a estação
  } else if (
    camposTransporte.hidden === false &&
    estacaoCadastro.value === ""
  ) {
    mensagemVinculo.textContent = "Selecione sua estação de atuação.";

    // verifica a região caso o campo esteja visível
  } else if (
    campoRegiao.hidden === false &&
    regiaoCadastro.value.trim() === ""
  ) {
    mensagemVinculo.textContent = "Informe sua região de atuação.";
  } else {
    // preenche o resumo com os dados atualizados
    preencherResumo();

    // avança para a etapa de revisão
    mostrarEtapa(3); // avança para a revisão

    return; // encerra a função
  }

  // aplica a aparência da mensagem de erro
  mensagemVinculo.classList.add("mensagem-erro");

  // mostra a mensagem
  mensagemVinculo.hidden = false;
}

// =================================================================
// BOTÕES DE NAVEGAÇÃO
// =================================================================

// verifica se estamos na página de cadastro
if (etapaIdentificacao && etapaVinculo && etapaRevisao) {
  // inicia o cadastro na primeira etapa
  mostrarEtapa(1);

  // valida a identificação ao clicar em continuar
  avancarIdentificacao.addEventListener("click", validarIdentificacao);

  // valida o vínculo ao clicar em continuar
  avancarVinculo.addEventListener("click", validarVinculo);

  // retorna à primeira etapa
  voltarIdentificacao.addEventListener("click", function () {
    mostrarEtapa(1);
  });

  // retorna à segunda etapa
  voltarVinculo.addEventListener("click", function () {
    mostrarEtapa(2);
  });

  // retorna à identificação para editar os dados
  editarIdentificacao.addEventListener("click", function () {
    mostrarEtapa(1);
  });

  // retorna ao vínculo para editar os dados
  editarVinculo.addEventListener("click", function () {
    mostrarEtapa(2);
  });
}

// =================================================================
// VÍNCULO PROFISSIONAL
// =================================================================

// seleciona os campos de linha e estação
const linhaCadastro = document.getElementById("linha");
const estacaoCadastro = document.getElementById("estacao");

// seleciona o grupo de campos de transporte
const camposTransporte = document.getElementById("campos-transporte");

// seleciona o grupo que contém o campo de região
const campoRegiao = document.getElementById("campo-regiao");

// seleciona o input de região
const regiaoCadastro = document.getElementById("regiao");

// função que adiciona opções a um select
// campo representa o select que receberá as opções
// lista representa os valores que serão adicionados
// texto representa a primeira opção do select
function preencherOpcoes(campo, lista, texto) {
  // limpa as opções anteriores
  campo.innerHTML = "";

  // cria a primeira opção
  const primeiraOpcao = document.createElement("option");

  primeiraOpcao.value = ""; // valor vazio
  primeiraOpcao.textContent = texto; // texto exibido

  // adiciona a primeira opção ao select
  campo.appendChild(primeiraOpcao);

  // percorre os valores da lista
  for (let i = 0; i < lista.length; i++) {
    // cria uma nova opção
    const opcao = document.createElement("option");

    opcao.value = lista[i]; // valor da opção
    opcao.textContent = lista[i]; // texto exibido

    // adiciona a opção ao select
    campo.appendChild(opcao);
  }
}

// função que esconde e limpa os campos de atuação
function limparCamposVinculo() {
  camposTransporte.hidden = true; // esconde linhas e estações
  campoRegiao.hidden = true; // esconde a região

  linhaCadastro.disabled = true; // desativa a linha
  estacaoCadastro.disabled = true; // desativa a estação
  regiaoCadastro.disabled = true; // desativa a região

  linhaCadastro.required = false; // deixa de ser obrigatório
  estacaoCadastro.required = false; // deixa de ser obrigatório
  regiaoCadastro.required = false; // deixa de ser obrigatório

  // limpa os valores anteriores
  preencherOpcoes(linhaCadastro, [], "Selecione a linha");
  preencherOpcoes(estacaoCadastro, [], "Selecione a estação");

  regiaoCadastro.value = "";
}

// função que carrega as funções da instituição escolhida
function carregarFuncoes() {
  // recupera a instituição selecionada
  const instituicao = orgaoCadastro.value;

  // limpa os campos relacionados ao vínculo
  limparCamposVinculo();

  // verifica se a instituição possui funções cadastradas
  if (funcoesInstituicoes[instituicao]) {
    // carrega as funções da instituição
    preencherOpcoes(
      funcaoCadastro,
      funcoesInstituicoes[instituicao],
      "Selecione sua função",
    );

    funcaoCadastro.disabled = false; // ativa o campo
  } else {
    // limpa as funções anteriores
    preencherOpcoes(funcaoCadastro, [], "Selecione a instituição");

    funcaoCadastro.disabled = true; // desativa o campo
  }
}

// função que mostra os campos necessários para cada profissional
function carregarCamposVinculo() {
  // recupera a instituição e a função escolhidas
  const instituicao = orgaoCadastro.value;
  const funcao = funcaoCadastro.value;

  // limpa os campos anteriores
  limparCamposVinculo();

  // verifica se alguma função foi selecionada
  if (funcao === "") {
    return; // encerra a função
  }

  // verifica se o profissional precisa informar uma região
  if (instituicao === "cet" || funcao === "Coordenador") {
    campoRegiao.hidden = false; // mostra a região
    regiaoCadastro.disabled = false; // ativa o campo
    regiaoCadastro.required = true; // torna obrigatório
  } else if (linhasInstituicoes[instituicao]) {
    // mostra os campos de transporte
    camposTransporte.hidden = false;

    // carrega as linhas da operadora
    preencherOpcoes(
      linhaCadastro,
      linhasInstituicoes[instituicao],
      "Selecione a linha",
    );

    linhaCadastro.disabled = false; // ativa o campo
    linhaCadastro.required = true; // torna obrigatório
  }
}

// função que carrega as estações da linha selecionada
function carregarEstacoes() {
  // recupera a linha escolhida
  const linha = linhaCadastro.value;

  // verifica se existem estações cadastradas para a linha
  if (estacoesLinhas[linha]) {
    // carrega as estações correspondentes
    preencherOpcoes(
      estacaoCadastro,
      estacoesLinhas[linha],
      "Selecione a estação",
    );

    estacaoCadastro.disabled = false; // ativa o campo
    estacaoCadastro.required = true; // torna obrigatório
  } else {
    // limpa as estações anteriores
    preencherOpcoes(estacaoCadastro, [], "Selecione a linha");

    estacaoCadastro.disabled = true; // desativa o campo
    estacaoCadastro.required = false; // deixa de ser obrigatório
  }
}

// verifica se estamos na página de cadastro
if (orgaoCadastro && funcaoCadastro && linhaCadastro) {
  // carrega as funções quando a instituição muda
  orgaoCadastro.addEventListener("change", carregarFuncoes);

  // mostra os campos quando a função muda
  funcaoCadastro.addEventListener("change", carregarCamposVinculo);

  // carrega as estações quando a linha muda
  linhaCadastro.addEventListener("change", carregarEstacoes);

  // prepara os campos ao carregar a página
  carregarFuncoes();
}

// =================================================================
// REVISÃO DOS DADOS DO CADASTRO
// =================================================================

// seleciona os elementos que receberão os dados de identificação
const resumoNome = document.getElementById("resumo-nome");
const resumoMatricula = document.getElementById("resumo-matricula");
const resumoEmail = document.getElementById("resumo-email");

// seleciona os elementos que receberão os dados profissionais
const resumoOrgao = document.getElementById("resumo-orgao");
const resumoFuncao = document.getElementById("resumo-funcao");
const resumoLinha = document.getElementById("resumo-linha");
const resumoEstacao = document.getElementById("resumo-estacao");
const resumoRegiao = document.getElementById("resumo-regiao");

// seleciona os grupos que podem ser mostrados ou escondidos
const itemResumoLinha = document.getElementById("item-resumo-linha");
const itemResumoEstacao = document.getElementById("item-resumo-estacao");
const itemResumoRegiao = document.getElementById("item-resumo-regiao");

// seleciona o botão de enviar a solicitação
const enviarSolicitacao = document.getElementById("enviar-solicitacao");

// função que preenche o resumo com os dados informados
function preencherResumo() {
  // copia os dados de identificação para a revisão
  resumoNome.textContent = nomeCompleto.value;
  resumoMatricula.textContent = matriculaFuncional.value;
  resumoEmail.textContent = emailInstitucional.value;

  // recupera o nome da instituição selecionada
  resumoOrgao.textContent =
    orgaoCadastro.options[orgaoCadastro.selectedIndex].text;

  // copia a função selecionada
  resumoFuncao.textContent = funcaoCadastro.value;

  // esconde inicialmente os dados de atuação
  itemResumoLinha.hidden = true;
  itemResumoEstacao.hidden = true;
  itemResumoRegiao.hidden = true;

  // verifica se o profissional atua no transporte ferroviário
  if (camposTransporte.hidden === false) {
    // copia a linha e a estação selecionadas
    resumoLinha.textContent = linhaCadastro.value;
    resumoEstacao.textContent = estacaoCadastro.value;

    // mostra essas informações na revisão
    itemResumoLinha.hidden = false;
    itemResumoEstacao.hidden = false;
  }

  // verifica se o profissional informou uma região
  if (campoRegiao.hidden === false) {
    // copia a região informada
    resumoRegiao.textContent = regiaoCadastro.value;

    // mostra a região na revisão
    itemResumoRegiao.hidden = false;
  }

  // habilita o botão de solicitar acesso
  enviarSolicitacao.disabled = false;
}

// =================================================================
// GERAÇÃO DO PROTOCOLO
// =================================================================

// função que gera o protocolo da solicitação
// instituicao representa o órgão selecionado
// quantidade representa o número de solicitações registradas
function gerarProtocolo(instituicao, quantidade) {
  // guarda a sigla da instituição
  let sigla = "";

  // verifica qual instituição foi selecionada
  if (instituicao === "metro") {
    sigla = "MET";
  } else if (instituicao === "cptm") {
    sigla = "CPT";
  } else if (instituicao === "viaquatro") {
    sigla = "VQT";
  } else if (instituicao === "viamobilidade") {
    sigla = "VMB";
  } else if (instituicao === "cet") {
    sigla = "CET";
  }

  // cria o número da próxima solicitação
  const numero = quantidade + 1;

  // completa o número com zeros até possuir quatro caracteres
  const numeroProtocolo = String(numero).padStart(4, "0");

  // retorna o protocolo completo
  return "CAD-" + sigla + "-" + numeroProtocolo;
}

// =================================================================
// REGISTRO DA SOLICITAÇÃO DE CADASTRO
// =================================================================

// seleciona o formulário de cadastro
const formularioCadastroAdmin = document.getElementById(
  "formulario-cadastro-admin",
);

// seleciona a mensagem de erro da revisão
const mensagemRevisao = document.getElementById("mensagem-revisao");

// função que registra a solicitação
function registrarSolicitacao(event) {
  // impede que o formulário recarregue a página
  event.preventDefault();

  // esconde mensagens anteriores
  mensagemRevisao.hidden = true;

  // recupera as solicitações armazenadas no navegador
  const dadosSalvos = localStorage.getItem("admin-solicitacoes");

  // cria uma lista vazia de solicitações
  let solicitacoes = [];

  // verifica se existem solicitações anteriores
  if (dadosSalvos !== null) {
    // transforma os dados armazenados em uma lista
    solicitacoes = JSON.parse(dadosSalvos);
  }

  // percorre as solicitações existentes
  for (let i = 0; i < solicitacoes.length; i++) {
    // verifica se o e-mail institucional já foi cadastrado
    if (
      solicitacoes[i].email === emailInstitucional.value.trim().toLowerCase()
    ) {
      // apresenta uma mensagem de erro
      mensagemRevisao.textContent =
        "Já existe uma solicitação para este e-mail.";

      mensagemRevisao.classList.add("mensagem-erro");

      mensagemRevisao.hidden = false;

      // encerra a função sem registrar novamente
      return;
    }
  }

  // gera o protocolo da nova solicitação
  const protocolo = gerarProtocolo(orgaoCadastro.value, solicitacoes.length);

  // cria um objeto com os dados do profissional
  const novaSolicitacao = {
    protocolo: protocolo,

    nome: nomeCompleto.value.trim(),

    matricula: matriculaFuncional.value.trim(),

    email: emailInstitucional.value.trim().toLowerCase(),

    orgao: orgaoCadastro.value,

    funcao: funcaoCadastro.value,

    linha: linhaCadastro.value,

    estacao: estacaoCadastro.value,

    regiao: regiaoCadastro.value.trim(),

    status: "pendente",

    dataSolicitacao: new Date().toISOString(),
  };

  // adiciona a nova solicitação à lista
  solicitacoes.push(novaSolicitacao);

  // transforma a lista em texto e salva no navegador
  localStorage.setItem("admin-solicitacoes", JSON.stringify(solicitacoes));

  // limpa os campos de senha
  senhaCadastro.value = "";
  confirmarSenha.value = "";

  // apresenta a confirmação do cadastro
  mostrarConfirmacao(protocolo);
}

// =================================================================
// CONFIRMAÇÃO DO CADASTRO
// =================================================================

// seleciona a seção de confirmação
const confirmacaoCadastro = document.getElementById("confirmacao-cadastro");

// seleciona o elemento que receberá o protocolo
const protocoloCadastro = document.getElementById("protocolo-cadastro");

// seleciona a situação do cadastro
const situacaoCadastro = document.getElementById("situacao-cadastro");

// seleciona o indicador de etapas
const etapasCadastro = document.getElementById("etapas-cadastro");

// seleciona o link de login abaixo do formulário
const cadastroLogin = document.getElementById("cadastro-login");

// seleciona o título da confirmação
const tituloConfirmacao = document.getElementById("titulo-confirmacao");

// seleciona o título e o subtítulo iniciais do cartão
const tituloCadastro = document.querySelector(".cadastro-card h2");
const subtituloCadastro = document.querySelector(".cadastro-subtitulo");

// função que apresenta a confirmação da solicitação
function mostrarConfirmacao(protocolo) {
  // esconde o formulário
  formularioCadastroAdmin.hidden = true;

  // esconde o indicador de etapas
  etapasCadastro.hidden = true;

  // esconde o link de login anterior
  cadastroLogin.hidden = true;

  // esconde o título e o subtítulo iniciais
  tituloCadastro.hidden = true;
  subtituloCadastro.hidden = true;

  // apresenta o protocolo gerado
  protocoloCadastro.textContent = protocolo;

  // apresenta a situação da solicitação
  situacaoCadastro.textContent = "Aguardando aprovação";

  // mostra a seção de confirmação
  confirmacaoCadastro.hidden = false;

  // direciona o foco para o título da confirmação
  tituloConfirmacao.focus();
}

// verifica se estamos na página de cadastro
if (formularioCadastroAdmin && enviarSolicitacao) {
  // executa a função quando o formulário for enviado
  formularioCadastroAdmin.addEventListener("submit", registrarSolicitacao);
}

// =================================================================
// VALIDAÇÃO DO LOGIN ADMINISTRATIVO
// =================================================================

// seleciona o formulário de login
const formularioLoginAdmin = document.getElementById("formulario-login-admin");

// seleciona o campo de e-mail administrativo
const emailLogin = document.getElementById("email-administrativo");

// seleciona o campo de senha do login
const senhaLogin = document.getElementById("senha");

// seleciona o botão de acessar o painel
const entrarPainel = document.getElementById("entrar-painel");

// seleciona o elemento que apresenta as mensagens do login
const mensagemLogin = document.getElementById("mensagem-login-admin");

// função que verifica o preenchimento dos campos
function validarLogin() {
  // esconde as mensagens anteriores
  mensagemLogin.hidden = true;

  // verifica se o e-mail é válido e a senha está preenchida
  if (emailLogin.checkValidity() && senhaLogin.value.trim() !== "") {
    // habilita o botão de acessar o painel
    entrarPainel.disabled = false;
  } else {
    // desabilita o botão caso os campos estejam incorretos
    entrarPainel.disabled = true;
  }
}

// função temporária que impede o envio tradicional do formulário
function prepararLogin(event) {
  // impede o recarregamento da página
  event.preventDefault();
}

// verifica se estamos na página de login administrativo
if (formularioLoginAdmin) {
  // verifica o e-mail enquanto o profissional digita
  emailLogin.addEventListener("input", validarLogin);

  // verifica a senha enquanto o profissional digita
  senhaLogin.addEventListener("input", validarLogin);

  // impede o envio tradicional até implementarmos a autenticação
  formularioLoginAdmin.addEventListener("submit", prepararLogin);

  // verifica os campos quando a página é carregada
  validarLogin();
}
