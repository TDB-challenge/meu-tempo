/*
  cadastro e entrada dos usuários do protótipo:
  este arquivo conecta os formulários administrativos e os formulários do cidadão.
  as etapas, validações e credenciais demonstrativas utilizam os dados compartilhados de dados.js.

  formulario-cadastro-admin e formulario-login-admin identificam o acesso dos profissionais.
  form-cadastro e form-login identificam os formulários da área cidadã.
  os nomes dos campos são procurados por id; os botões de senha reutilizam suas classes existentes.
  hidden alterna as etapas sem criar outras páginas ou duplicar formulários.
  os eventos de envio impedem a navegação padrão antes de validar e salvar as informações.
  a sessão do cidadão e a sessão administrativa permanecem separadas no navegador.
*/

// a acessibilidade compartilhada é inicializada por script.js

// =================================================================
// menu responsivo
// =================================================================

const botaoMenu = document.getElementById("abrir-menu");

const menuNavegacao = document.getElementById("menu-navegacao");

function alternarMenu() {
  // adiciona ou remove a classe que mostra o menu
  menuNavegacao.classList.toggle("ativo");

  // o estado acessível acompanha a mesma classe que exibe o menu
  botaoMenu.setAttribute("aria-expanded", String(menuNavegacao.classList.contains("ativo")));
}

if (botaoMenu && menuNavegacao) {
  botaoMenu.addEventListener("click", alternarMenu);
}

// =================================================================
// visualização das senhas
// =================================================================

// seleciona todos os botões de visualizar senha
// a classe botao-visualizar-senha reúne os controles que alternam a exibição do campo associado
const botoesSenha = document.querySelectorAll(".botao-visualizar-senha");

function alternarSenha(event) {
  const botao = event.currentTarget;

  const idCampo = botao.getAttribute("data-campo-senha");

  const campoSenha = document.getElementById(idCampo);

  if (campoSenha) {
    const oculta = campoSenha.type === "password";
    if (oculta) campoSenha.type = "text";
    else campoSenha.type = "password";
    botao.setAttribute("aria-pressed", String(oculta));
  }
}

for (let i = 0; i < botoesSenha.length; i++) {
  botoesSenha[i].addEventListener("click", alternarSenha);
}

// =================================================================
// validação dos requisitos da senha
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
// requisito é o elemento do indicador e atendido é o resultado booleano usado para aplicar ou remover seu destaque
function marcarRequisito(requisito, atendido) {
  if (atendido) {
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
// confirmação da senha
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
// navegação entre as etapas do cadastro
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
// exibição das etapas
// =================================================================

// numero identifica a etapa do cadastro administrativo que deve ficar visível após a navegação
function mostrarEtapa(numero) {
  const etapas = [etapaIdentificacao, etapaVinculo, etapaRevisao];
  // campos de etapas ocultas ficam desativados para não bloquear a validação da etapa atual
  for (let i = 0; i < etapas.length; i++) {
    const ativa = i + 1 === numero;
    etapas[i].hidden = !ativa;
    etapas[i].disabled = !ativa;
  }

  // atualiza o indicador de progresso
  atualizarIndicadores(numero);
}

// =================================================================
// indicador de progresso
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
// validação da identificação
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
// validação do vínculo profissional
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
// botões de navegação
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
// vínculo profissional
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
// as opções são elementos criados no navegador; apagar o conteúdo anterior evita repetir escolhas a cada mudança de vínculo
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
// revisão dos dados do cadastro
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
// geração do protocolo
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
// registro da solicitação de cadastro
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
// confirmação do cadastro
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
// validação do login administrativo
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

// função que verifica as credenciais do profissional
// função que verifica as credenciais do profissional
function prepararLogin(event) {
  // impede o recarregamento da página
  event.preventDefault();

  // recupera o e-mail digitado
  const email = emailLogin.value.trim().toLowerCase();

  // recupera a senha digitada
  const senha = senhaLogin.value;

  // recupera todos os usuários autorizados
  const usuarios = buscarUsuariosAutorizados();

  // percorre a lista de profissionais
  for (let i = 0; i < usuarios.length; i++) {
    // recupera o profissional atual
    const usuario = usuarios[i];

    // verifica se as credenciais estão corretas
    if (usuario.email === email && usuario.senha === senha) {
      // verifica se o profissional está autorizado
      if (usuario.status === "aprovado") {
        // salva a sessão do profissional
        salvarSessao(usuario);

        // direciona para o painel correspondente
        direcionarPainel(usuario);

        // encerra a função
        return;
      }
    }
  }

  // apresenta a mensagem de erro
  mensagemLogin.textContent = "E-mail ou senha incorretos.";

  // aplica a aparência de erro
  mensagemLogin.classList.add("mensagem-erro");

  // mostra a mensagem
  mensagemLogin.hidden = false;
}
// verifica se estamos na página de login administrativo
if (formularioLoginAdmin) {
  // verifica o e-mail enquanto o profissional digita
  emailLogin.addEventListener("input", validarLogin);

  // verifica a senha enquanto o profissional digita
  senhaLogin.addEventListener("input", validarLogin);

  // executa a autenticação ao enviar o formulário
  formularioLoginAdmin.addEventListener("submit", prepararLogin);

  // verifica os campos quando a página é carregada
  validarLogin();
}

// =================================================================
// redirecionamento administrativo
// =================================================================

// função que direciona o profissional conforme sua função
// usuario representa a conta encontrada durante o login
function direcionarPainel(usuario) {
  // verifica se o profissional é um coordenador
  if (usuario.funcao === "Coordenador") {
    // abre o painel da coordenação
    window.location.href = "coordenacao.html";
  } else if (usuario.funcao === "Operador CET") {
    // abre o painel da cet
    window.location.href = "cet.html";
  } else if (usuario.funcao === "Agente de transporte") {
    // abre o painel de transporte ferroviário
    window.location.href = "metro.html";
  }
}

// =================================================================
// recuperação de acesso
// =================================================================

// seleciona o botão esqueci minha senha
const abrirRecuperacao = document.getElementById("abrir-recuperacao");

// seleciona a janela de recuperação
const modalRecuperacao = document.getElementById("modal-recuperacao");

// seleciona o formulário de recuperação
const formularioRecuperacao = document.getElementById("formulario-recuperacao");

// seleciona o campo de e-mail
const emailRecuperacao = document.getElementById("email-recuperacao");

// seleciona o botão de solicitar recuperação
const solicitarRecuperacao = document.getElementById("solicitar-recuperacao");

// seleciona o elemento que apresenta a mensagem
const mensagemRecuperacao = document.getElementById("mensagem-recuperacao");

// função que abre a janela de recuperação
function abrirModalRecuperacao() {
  // limpa o campo de e-mail
  emailRecuperacao.value = "";

  // esconde a mensagem anterior
  mensagemRecuperacao.hidden = true;

  // desabilita o botão inicialmente
  solicitarRecuperacao.disabled = true;

  // abre a janela de recuperação
  modalRecuperacao.showModal();
}

// função que verifica o e-mail digitado
function validarRecuperacao() {
  // esconde a mensagem anterior
  mensagemRecuperacao.hidden = true;

  // verifica se o e-mail atende às regras do html
  if (emailRecuperacao.checkValidity()) {
    solicitarRecuperacao.disabled = false;
  } else {
    solicitarRecuperacao.disabled = true;
  }
}

// função que simula uma solicitação de recuperação
function recuperarAcesso(event) {
  // impede que o formulário recarregue a página
  event.preventDefault();

  // apresenta uma mensagem demonstrativa
  mensagemRecuperacao.textContent =
    "Caso a credencial esteja cadastrada, a recuperação deverá ser realizada pela coordenação.";

  // adiciona a classe que estiliza a mensagem
  mensagemRecuperacao.classList.add("mensagem-sucesso");

  // mostra a mensagem
  mensagemRecuperacao.hidden = false;
}

// verifica se estamos na página de login
if (abrirRecuperacao && modalRecuperacao && formularioRecuperacao) {
  // abre o modal ao clicar em esqueci minha senha
  abrirRecuperacao.addEventListener("click", abrirModalRecuperacao);

  // valida o e-mail enquanto o usuário digita
  emailRecuperacao.addEventListener("input", validarRecuperacao);

  // executa a recuperação ao enviar o formulário
  formularioRecuperacao.addEventListener("submit", recuperarAcesso);
}

// =================================================================
// sessão administrativa
// =================================================================

// função que registra o profissional conectado
// usuario representa a conta encontrada no login
// a sessão fica vinculada à aba e pode sobreviver ao recarregamento; não representa um token validado por servidor
function salvarSessao(usuario) {
  // cria um objeto com as informações do profissional
  const profissionalConectado = {
    nome: usuario.nome,
    matricula: usuario.matricula,
    email: usuario.email,
    orgao: usuario.orgao,
    funcao: usuario.funcao,
    linha: usuario.linha,
    estacao: usuario.estacao,
    regiao: usuario.regiao,
  };

  // transforma o objeto em texto e salva na sessão
  sessionStorage.setItem("admin-sessao", JSON.stringify(profissionalConectado));
}

// =================================================================
// cadastro demonstrativo do cidadão
// =================================================================

// seleciona formulários e mensagens sem usar as contas administrativas
const formularioCidadao = document.getElementById("form-cadastro");
// seleciona o formulário de entrada do cidadão
const formularioEntradaCidadao = document.getElementById("form-login");
// seleciona a mensagem das etapas e da conclusão
const avisoCadastroCidadao = document.getElementById("aviso-cadastro");
// guarda o passo atual para impedir envio antes da revisão
let passoAtualCidadao = 1;

// calcula a idade considerando o aniversário e recusa datas inválidas ou futuras
// nascimento representa uma data no formato ano-mês-dia
function calcularIdadeCidadao(nascimento) {
  // separa os números da data e recupera a data atual
  const partes = nascimento.split("-");
  // recupera o dia atual para conferir o aniversário
  const hoje = new Date();
  // monta a data com os valores informados pelo cidadão
  const dataNascimento = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
  // verifica se a data foi preenchida corretamente e já aconteceu
  if (partes.length !== 3 || isNaN(dataNascimento.getTime()) || dataNascimento > hoje || dataNascimento.getFullYear() !== Number(partes[0]) || dataNascimento.getMonth() !== Number(partes[1]) - 1 || dataNascimento.getDate() !== Number(partes[2])) {
    return -1;
  }
  // inicia a idade pela diferença entre os anos
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  // desconta um ano quando o aniversário ainda não chegou
  if (hoje.getMonth() < dataNascimento.getMonth() || (hoje.getMonth() === dataNascimento.getMonth() && hoje.getDate() < dataNascimento.getDate())) {
    idade = idade - 1;
  }
  // devolve a idade completa em anos
  return idade;
}

// cria um resumo da senha apenas para a demonstração local, sem guardar a senha
// senha representa a credencial fictícia escolhida no formulário
async function resumirSenhaCidadao(senha) {
  // exige o recurso nativo disponível em localhost ou conexão segura
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error("Abra o Meu Tempo em localhost ou HTTPS para concluir o cadastro com segurança.");
  }
  // converte a senha fictícia em bytes e calcula o resumo sha-256
  // textencoder transforma os caracteres em bytes utf-8, formato exigido pela operação criptográfica nativa
  const bytesSenha = new TextEncoder().encode(senha);
  // aguarda o cálculo nativo sem guardar a senha original
  // digest devolve uma promessa; await espera o cálculo sha-256 antes de continuar a comparação
  const resumo = await window.crypto.subtle.digest("SHA-256", bytesSenha);
  // permite percorrer os bytes do resumo em um laço básico
  // uint8array permite ler cada posição do resultado como um número inteiro entre zero e 255
  const bytesResumo = new Uint8Array(resumo);
  // reúne os bytes em texto hexadecimal para comparação demonstrativa
  // a representação hexadecimal usa dois caracteres por byte; esse resumo local não oferece a proteção de armazenamento de senhas em servidor
  let textoResumo = "";
  // percorre cada byte do resumo nativo
  for (let i = 0; i < bytesResumo.length; i++) {
    textoResumo = textoResumo + bytesResumo[i].toString(16).padStart(2, "0");
  }
  // retorna somente o resumo; isto não equivale a autenticação segura de servidor
  return textoResumo;
}

// verifica os campos e a senha antes de avançar ou concluir
function validarIdentificacaoCidadao() {
  // seleciona os campos obrigatórios da primeira etapa
  const campos = document.querySelectorAll("#cadastro-passo-1 [required]");
  // percorre os campos e apresenta a validação nativa no primeiro erro
  for (let i = 0; i < campos.length; i++) {
    // recusa campos vazios ou formatos inválidos
    if (campos[i].id !== "cad-senha" && campos[i].id !== "cad-confirma-senha" && (!campos[i].checkValidity() || campos[i].value.trim() === "")) {
      mostrarPassoCidadao(1);
      campos[i].reportValidity();
      campos[i].focus();
      avisoCadastroCidadao.textContent = "Preencha os campos obrigatórios da identificação.";
      return false;
    }
  }
  // recupera a senha fictícia escolhida e sua confirmação
  const senha = document.getElementById("cad-senha").value;
  // recupera a repetição da senha para comparação
  const confirmacao = document.getElementById("cad-confirma-senha").value;
  // exige exatamente quatro números sem converter o pin para inteiro
  if (!/^[0-9]{4}$/.test(senha)) {
    mostrarPassoCidadao(1);
    avisoCadastroCidadao.textContent = "Informe quatro números.";
    document.getElementById("cad-senha").focus();
    return false;
  }
  // exige confirmação idêntica sem expor a senha na revisão
  if (senha !== confirmacao) {
    mostrarPassoCidadao(1);
    avisoCadastroCidadao.textContent = "Os PINs precisam ser iguais.";
    document.getElementById("cad-confirma-senha").focus();
    return false;
  }
  // confere somente o formato fictício de cpf e rg, sem consultar identidade oficial
  const cpf = document.getElementById("cad-cpf").value.replace(/[.\-]/g, "");
  // recupera o rg removendo apenas a pontuação permitida
  const rg = document.getElementById("cad-rg").value.replace(/[.\-]/g, "").toUpperCase();
  // diferencia a cin, cujo número de identificação é o próprio cpf
  const tipo = document.getElementById("cad-tipo-documento").value;
  // recusa letras e quantidades incorretas no cpf ou no rg paulista
  if (!/^[0-9]{11}$/.test(cpf) || (tipo === "rg" && !/^[0-9]{8}[0-9X]$/.test(rg))) {
    mostrarPassoCidadao(1);
    avisoCadastroCidadao.textContent = "Informe CPF com onze dígitos e, para RG paulista, nove posições com X permitido no final.";
    return false;
  }
  // calcula a idade com base na data preenchida
  const idade = calcularIdadeCidadao(document.getElementById("cad-nascimento").value);
  // recusa nascimento futuro ou incompatível com a categoria idosa
  if (idade < 0 || (document.getElementById("cad-categoria").value === "idosa" && idade < 60)) {
    mostrarPassoCidadao(1);
    avisoCadastroCidadao.textContent = "Confira o nascimento. A categoria de pessoa idosa exige 60 anos completos; corrija a data ou selecione outra categoria. Serviços gerais continuam disponíveis.";
    document.getElementById("cad-nascimento").focus();
    return false;
  }
  // libera as demais categorias sem exigir comprovação para serviços gerais
  return true;
}

// recupera as escolhas de uma lista de checkboxes sem criar dados automáticos
// nome representa o atributo name dos campos da lista
// nome corresponde ao atributo name do grupo de campos cujas opções marcadas serão reunidas
function coletarEscolhasCidadao(nome) {
  // seleciona as opções e cria uma lista de respostas
  const opcoes = formularioCidadao.querySelectorAll('input[name="' + nome + '"]');
  // começa a lista de escolhas sem preencher condições automaticamente
  const escolhas = [];
  // percorre somente as opções deste grupo
  for (let i = 0; i < opcoes.length; i++) {
    // adiciona apenas as opções selecionadas pelo cidadão
    if (opcoes[i].checked) {
      escolhas.push(opcoes[i].value);
    }
  }
  // devolve as escolhas autodeclaradas
  return escolhas;
}

// recusa combinar a opção de não informar com necessidades específicas
function validarNecessidadesCidadao() {
  // recupera as escolhas do cidadão
  const escolhas = coletarEscolhasCidadao("necessidade");
  // verifica cada escolha para manter a declaração coerente
  for (let i = 0; i < escolhas.length; i++) {
    // pede uma correção sem selecionar condições pelo cidadão
    if (escolhas[i] === "Prefiro não informar" && escolhas.length > 1) {
      mostrarPassoCidadao(2);
      avisoCadastroCidadao.textContent = "Selecione apenas ‘Prefiro não informar’ ou as necessidades que deseja declarar.";
      return false;
    }
  }
  // aceita inclusive quem não deseja informar necessidades
  return true;
}

// apresenta um passo e atualiza os indicadores acessíveis
// numero representa a etapa de 1 a 4
function mostrarPassoCidadao(numero) {
  // recupera todos os passos e indicadores do cadastro do cidadão
  const passos = formularioCidadao.querySelectorAll(".cadastro-passo");
  // seleciona as barras que indicam o progresso do formulário
  const indicadores = document.querySelectorAll("[data-indicador-etapa]");
  passoAtualCidadao = numero;
  avisoCadastroCidadao.textContent = "";
  // exibe apenas a etapa escolhida
  for (let i = 0; i < passos.length; i++) {
    passos[i].hidden = i + 1 !== numero;
  }
  // indica o passo atual visualmente e para leitores de tela
  for (let i = 0; i < indicadores.length; i++) {
    indicadores[i].classList.remove("ativa");
    indicadores[i].removeAttribute("aria-current");
    // aria-current com step identifica a etapa atual do cadastro
    if (i + 1 === numero) {
      indicadores[i].classList.add("ativa");
      indicadores[i].setAttribute("aria-current", "step");
    }
  }
  // leva o foco ao primeiro controle ou título disponível na etapa aberta
  // o seletor procura o primeiro título ou controle da etapa para orientar o foco após a mudança de tela
  const foco = passos[numero - 1].querySelector("h3, input, select, button");
  // permite focalizar o título sem inseri-lo na navegação por tabulação
  if (foco) {
    // os títulos precisam de tabindex para receber o foco programático
    if (foco.tagName === "H3") {
      foco.setAttribute("tabindex", "-1");
    }
    foco.focus();
  }
}

// monta os dados sem incluir senha original, imagens ou texto médico livre
function coletarCadastroCidadao() {
  // recupera as preferências globais atuais
  const preferencias = buscarPreferenciasAcessibilidade();
  // reúne somente os dados fictícios necessários ao protótipo
  const cadastro = {
    id: "CID-" + Date.now(),
    nome: document.getElementById("cad-nome").value.trim(),
    nascimento: document.getElementById("cad-nascimento").value,
    tipoDocumento: document.getElementById("cad-tipo-documento").value,
    cpf: document.getElementById("cad-cpf").value.replace(/[.\-]/g, ""),
    rg: document.getElementById("cad-rg").value.replace(/[.\-]/g, "").toUpperCase(),
    email: document.getElementById("cad-email").value.trim().toLowerCase(),
    telefone: document.getElementById("cad-telefone").value.trim(),
    municipio: document.getElementById("cad-municipio").value.trim(),
    estado: document.getElementById("cad-estado").value,
    bairro: document.getElementById("cad-bairro").value.trim(),
    categoria: document.getElementById("cad-categoria").value,
    idade: calcularIdadeCidadao(document.getElementById("cad-nascimento").value),
    documentos: {identificacao: "Formato validado", leitura: identificacaoCidadao, complementar: complementarCidadao},
    necessidades: coletarEscolhasCidadao("necessidade"),
    preferencias: preferencias,
    servicos: coletarEscolhasCidadao("uso"),
    termosAceitos: document.getElementById("cad-termos").checked
  };
  // a cin usa somente o cpf e não guarda um rg tradicional oculto
  if (cadastro.tipoDocumento === "cin") {
    cadastro.rg = "";
  }
  // retorna o objeto sem guardar arquivos nem texto complementar livre
  return cadastro;
}

// adiciona uma linha segura ao resumo sem interpretar os dados como html
// titulo descreve a informação; texto representa o valor a apresentar
function acrescentarResumoCidadao(titulo, texto) {
  // cria um cartão com título e conteúdo inserido de maneira segura
  const bloco = document.createElement("section");
  // reaproveita o cartão existente para separar os blocos da revisão
  bloco.className = "cadastro-qrcode-box";
  // cria o título do grupo
  const cabecalho = document.createElement("h4");
  cabecalho.textContent = titulo;
  // cria o texto sem interpretar valores como html
  const linha = document.createElement("p");
  linha.textContent = texto;
  bloco.appendChild(cabecalho);
  bloco.appendChild(linha);
  document.getElementById("resumo-cadastro-cidadao").appendChild(bloco);
}

// apresenta blocos legíveis sem pin ou imagens pessoais
function revisarCadastroCidadao() {
  // recupera os dados atuais sem armazenar arquivos
  const cadastro = coletarCadastroCidadao();
  // seleciona os recursos disponíveis no formulário
  const controles = formularioCidadao.querySelectorAll("[data-preferencia]");
  // reúne os nomes dos recursos ativados
  const preferenciasTexto = [];
  document.getElementById("resumo-cadastro-cidadao").textContent = "";
  // percorre as preferências e usa seus rótulos visíveis
  for (let i = 0; i < controles.length; i++) {
    // descreve somente recursos ativados
    if (controles[i].type === "checkbox" && controles[i].checked) {
      preferenciasTexto.push(controles[i].parentElement.querySelector("span").textContent);
    }
  }
  // formata a data localmente para preservar o dia no fuso brasileiro
  const nascimento = new Date(cadastro.nascimento + "T12:00:00").toLocaleDateString("pt-BR");
  // recupera o nome completo do documento selecionado
  const tipo = document.getElementById("cad-tipo-documento").selectedOptions[0].textContent;
  // inicia os dados documentais pelo cpf utilizado também na cin
  let documento = "CPF: " + cadastro.cpf;
  // apresenta rg somente quando este tipo foi escolhido
  if (cadastro.tipoDocumento === "rg") {
    documento = documento + " · RG: " + cadastro.rg;
  }
  acrescentarResumoCidadao("Identificação", cadastro.nome + " · Nascimento: " + nascimento + " · " + tipo + " · " + documento + " · " + document.getElementById("cad-categoria").selectedOptions[0].textContent + " · Identificação: formato validado");
  // omite contatos opcionais vazios em vez de deixar separadores sem informação
  let contato = cadastro.municipio + "/" + cadastro.estado;
  if (cadastro.bairro !== "") contato = contato + " · " + cadastro.bairro;
  contato = contato + " · " + cadastro.email;
  if (cadastro.telefone !== "") contato = contato + " · " + cadastro.telefone;
  acrescentarResumoCidadao("Localização e contato", contato);
  // informa explicitamente quando não há necessidades autodeclaradas
  let necessidades = cadastro.necessidades.join(", ");
  if (necessidades === "") {
    necessidades = "Nenhuma necessidade informada.";
  }
  acrescentarResumoCidadao("Necessidades e mobilidade", necessidades);
  // recupera os nomes completos dos serviços selecionados
  const servicos = formularioCidadao.querySelectorAll('input[name="uso"]');
  // reúne os rótulos sem expor identificadores internos
  const nomesServicos = [];
  // percorre os cartões de serviço
  for (let i = 0; i < servicos.length; i++) {
    // utiliza o título do cartão escolhido
    if (servicos[i].checked) {
      nomesServicos.push(servicos[i].parentElement.querySelector("strong").textContent);
    }
  }
  // informa as escolhas sem expor nomes internos nem deixar grupos em branco
  let recursos = "Recursos adicionais desativados";
  if (preferenciasTexto.length > 0) recursos = preferenciasTexto.join(", ");
  let interesses = "Nenhum selecionado; todos os serviços continuam disponíveis";
  if (nomesServicos.length > 0) interesses = nomesServicos.join(", ");
  acrescentarResumoCidadao("Preferências", "Tamanho do texto: " + cadastro.preferencias.fonte + "% · " + recursos + " · Serviços de interesse: " + interesses);
}

// trata a navegação pelo identificador do botão acionado
// evento representa o clique em um botão do formulário
function navegarCadastroCidadao(evento) {
  // recupera o botão acionado para decidir a etapa
  const id = evento.currentTarget.id;
  // valida a identificação antes de continuar
  if (id === "btn-cad-ir-passo2" && validarIdentificacaoCidadao()) {
    mostrarPassoCidadao(2);
  } else if (id === "btn-cad-ir-passo3" && validarNecessidadesCidadao()) {
    mostrarPassoCidadao(3);
  } else if (id === "btn-cad-ir-passo4" && validarIdentificacaoCidadao() && validarNecessidadesCidadao()) {
    revisarCadastroCidadao();
    mostrarPassoCidadao(4);
  } else if (id === "btn-cad-voltar-1") {
    mostrarPassoCidadao(1);
  } else if (id === "btn-cad-voltar-2") {
    mostrarPassoCidadao(2);
  } else if (id === "btn-cad-voltar-3") {
    mostrarPassoCidadao(3);
  }
}

// registra a conta local apenas depois da revisão e aceite dos termos
// evento representa o envio do formulário do cidadão
// evento é o envio do formulário; o processamento assíncrono aguarda o resumo da senha antes de salvar o cadastro local
async function registrarCadastroCidadao(evento) {
  evento.preventDefault();
  // impede concluir por enter nas etapas anteriores
  if (passoAtualCidadao !== 4) {
    avisoCadastroCidadao.textContent = "Use Continuar para revisar as quatro etapas antes de concluir.";
    return;
  }
  // repete a validação antes de gravar os dados
  if (!validarIdentificacaoCidadao() || !validarNecessidadesCidadao()) {
    return;
  }
  // exige consentimento dos termos ao finalizar
  if (!document.getElementById("cad-termos").checked) {
    avisoCadastroCidadao.textContent = "Leia e aceite os termos de uso para concluir.";
    document.getElementById("cad-termos").focus();
    return;
  }
  // impede envios repetidos enquanto o navegador calcula o resumo da senha
  const botao = document.getElementById("concluir-cadastro-cidadao");
  // interrompe um segundo envio durante a operação
  if (botao.disabled) {
    return;
  }
  botao.disabled = true;
  try {
    // reúne os dados fictícios e substitui a senha por seu resumo demonstrativo
    const cadastro = coletarCadastroCidadao();
    cadastro.senhaResumo = await resumirSenhaCidadao(document.getElementById("cad-senha").value);
    // identifica contas novas sem alterar resumos de credenciais antigas
    cadastro.acesso = "pin4";
    // recupera as contas locais somente após o cálculo assíncrono
    const cidadaos = buscarCidadaos();
    // recusa cadastrar novamente o mesmo e-mail
    for (let i = 0; i < cidadaos.length; i++) {
      // compara os e-mails já normalizados
      if (cidadaos[i].email === cadastro.email) {
        avisoCadastroCidadao.textContent = "Este e-mail já possui cadastro. Acesse a página de login.";
        return;
      }
    }
    cidadaos.push(cadastro);
    // salva somente dados fictícios e resumo, sem arquivos ou senha em texto
    salvarCidadaos(cidadaos);
    document.getElementById("cad-senha").value = "";
    document.getElementById("cad-confirma-senha").value = "";
    document.getElementById("cad-complemento").value = "";
    limparDocumentosCadastro();
    formularioCidadao.reset();
    avisoCadastroCidadao.textContent = "";
    // apresenta confirmação com o ícone e a hierarquia já utilizados no projeto
    const iconeConclusao = document.createElement("img");
    iconeConclusao.src = "../assets/icones/confirmacao.svg";
    iconeConclusao.alt = "";
    iconeConclusao.className = "icone";
    avisoCadastroCidadao.appendChild(iconeConclusao);
    const tituloConclusao = document.createElement("h3");
    tituloConclusao.textContent = "Cadastro concluído!";
    avisoCadastroCidadao.appendChild(tituloConclusao);
    const textoConclusao = document.createElement("p");
    textoConclusao.textContent = "Sua conta está pronta. Entre para utilizar os serviços.";
    avisoCadastroCidadao.appendChild(textoConclusao);
    // reaproveita o cartão existente para destacar a confirmação
    avisoCadastroCidadao.classList.add("cadastro-qrcode-box");
    // oferece um destino explícito para o login sem reutilizar a leitura de documentos
    const linkEntrada = document.createElement("a");
    linkEntrada.href = "login.html";
    // destaca a entrada com o botão principal do projeto
    linkEntrada.className = "btn";
    linkEntrada.textContent = "Entrar com sua conta";
    avisoCadastroCidadao.appendChild(linkEntrada);
    linkEntrada.focus();
    document.getElementById("cadastro-passo-4").hidden = true;
  } catch (erro) {
    // informa indisponibilidade do recurso nativo ou armazenamento local
    avisoCadastroCidadao.textContent = "Não foi possível concluir o cadastro. " + erro.message;
  } finally {
    botao.disabled = false;
  }
}

// ativa a navegação apenas quando existe o cadastro do cidadão
if (formularioCidadao) {
  // seleciona os botões existentes das quatro etapas
  const navegacaoCidadao = formularioCidadao.querySelectorAll(".cadastro-botoes-linha button[type='button'], #btn-cad-ir-passo2");
  // associa cada botão à navegação do cadastro
  for (let i = 0; i < navegacaoCidadao.length; i++) {
    navegacaoCidadao[i].addEventListener("click", navegarCadastroCidadao);
  }
  // registra a conclusão após as validações da demonstração
  formularioCidadao.addEventListener("submit", registrarCadastroCidadao);
}

// =================================================================
// login e sessão separada do cidadão
// =================================================================

// compara credenciais fictícias sem solicitar novamente a leitura do documento
// evento representa o envio do formulário de login do cidadão
// evento representa a tentativa de entrada; o resultado depende dos cadastros demonstrativos deste navegador
async function entrarCidadao(evento) {
  evento.preventDefault();
  // seleciona a mensagem e os campos do cidadão
  const aviso = document.getElementById("aviso-login");
  // seleciona a credencial de e-mail do cidadão
  const email = document.getElementById("login-email");
  // seleciona a senha fictícia digitada para comparação
  const senha = document.getElementById("login-senha");
  // seleciona o botão para impedir envios simultâneos
  const botao = formularioEntradaCidadao.querySelector("button[type='submit']");
  aviso.textContent = "";
  // exige e-mail válido e senha preenchida sem impor domínio administrativo
  if (!email.checkValidity() || !/^[0-9]{4}$/.test(senha.value)) {
    aviso.textContent = "Informe um e-mail válido e quatro números no PIN.";
    formularioEntradaCidadao.reportValidity();
    return;
  }
  // evita autenticações simultâneas
  if (botao.disabled) {
    return;
  }
  botao.disabled = true;
  try {
    // compara apenas resumos de senhas das contas demonstrativas
    const resumo = await resumirSenhaCidadao(senha.value);
    // recupera somente contas do cidadão, separadas dos profissionais
    const cidadaos = buscarCidadaos();
    // procura o cidadão pelas duas credenciais informadas
    for (let i = 0; i < cidadaos.length; i++) {
      // exige a correspondência do e-mail e do resumo
      if (cidadaos[i].email === email.value.trim().toLowerCase() && cidadaos[i].senhaResumo === resumo) {
        // identifica a conta antes de recuperar suas preferências, preservando a conta anterior
        sessionStorage.setItem("cidadao-sessao", JSON.stringify({id: cidadaos[i].id}));
        // recupera as preferências da conta que acabou de entrar
        salvarPreferenciasAcessibilidade(cidadaos[i].preferencias);
        senha.value = "";
        window.location.href = "app/inicio.html";
        return;
      }
    }
    aviso.textContent = "E-mail ou PIN incorretos. Contas antigas com senha precisam de uma nova conta com outro e-mail.";
  } catch (erro) {
    // mantém uma mensagem clara caso o navegador impeça a demonstração
    aviso.textContent = "Não foi possível entrar. " + erro.message;
  } finally {
    botao.disabled = false;
  }
}

// registra o evento somente na página de login do cidadão
if (formularioEntradaCidadao) {
  formularioEntradaCidadao.addEventListener("submit", entrarCidadao);
}
