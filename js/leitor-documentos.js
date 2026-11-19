// =================================================================
// PRÉVIA LOCAL DOS DOCUMENTOS
// =================================================================

// guarda somente endereços temporários na memória, nunca no armazenamento
let previaIdentificacaoLocal = "";
// guarda separadamente o endereço temporário do complemento
let previaComplementarLocal = "";
// guarda o resultado demonstrativo, sem afirmar autenticidade ou diagnóstico
let identificacaoCidadao = "Não conferida";
// mantém a documentação complementar sem diagnóstico automático
let complementarCidadao = "Não informado";
// identifica os arquivos atuais para ignorar respostas de anexos removidos
let arquivoIdentificacaoAtual = null;
let arquivoComplementarAtual = null;
// seleciona o arquivo de identificação fictício
const arquivoIdentificacao = document.getElementById("documento-identificacao");
// seleciona o arquivo complementar fictício
const arquivoComplementar = document.getElementById("documento-complementar");
// seleciona a mensagem acessível da leitura
const statusDocumentos = document.getElementById("status-qrcode-cadastro");

// remove uma prévia e libera a imagem da memória
// tipo representa identificacao ou complementar
function removerPreviaDocumento(tipo) {
  // seleciona a prévia correspondente
  const previa = document.getElementById("previa-" + tipo);
  // libera a referência temporária da identificação
  if (tipo === "identificacao") {
    URL.revokeObjectURL(previaIdentificacaoLocal);
    previaIdentificacaoLocal = "";
    arquivoIdentificacaoAtual = null;
    identificacaoCidadao = "Não conferida";
  } else {
    // libera a referência temporária do complemento
    URL.revokeObjectURL(previaComplementarLocal);
    previaComplementarLocal = "";
    arquivoComplementarAtual = null;
    complementarCidadao = "Não informado";
  }
  previa.removeAttribute("src");
  previa.hidden = true;
  document.getElementById("nome-" + tipo).textContent = "";
  document.getElementById("nome-" + tipo).hidden = true;
  document.getElementById("remover-" + tipo).hidden = true;
}

// apaga as imagens e os campos após conclusão ou saída
function limparDocumentosCadastro() {
  // executa apenas quando os campos existem nesta página
  if (arquivoIdentificacao && arquivoComplementar) {
    removerPreviaDocumento("identificacao");
    removerPreviaDocumento("complementar");
    // limpa câmera e arquivo sem apagar os dados já digitados
    const campos = document.querySelectorAll("#arquivos-cadastro input[type='file']");
    for (let i = 0; i < campos.length; i++) campos[i].value = "";
    statusDocumentos.textContent = "";
  }
}

// apresenta a imagem selecionada apenas na memória da página
// evento identifica o campo de arquivo alterado pelo cidadão
function apresentarPreviaDocumento(evento) {
  // identifica o campo e o tipo de documento escolhido
  const campo = evento.currentTarget;
  let tipo = "identificacao";
  if (campo.id.indexOf("complementar") !== -1) tipo = "complementar";
  // mantém a prévia atual quando o cidadão cancela a seleção
  if (campo.files.length === 0) return;
  const arquivo = campo.files[0];
  // aceita somente imagens conhecidas ou pdf dentro do limite de cinco megabytes
  if ((arquivo.type !== "image/jpeg" && arquivo.type !== "image/png" && arquivo.type !== "image/webp" && arquivo.type !== "application/pdf") || arquivo.size > 5 * 1024 * 1024) {
    campo.value = "";
    statusDocumentos.textContent = "Escolha uma imagem ou PDF de até 5 MB.";
    return;
  }
  removerPreviaDocumento(tipo);
  // descarta a seleção anterior do mesmo documento, seja câmera ou arquivo
  const campos = document.querySelectorAll("#arquivos-cadastro input[type='file']");
  for (let i = 0; i < campos.length; i++) {
    if (campos[i] !== campo && campos[i].id.indexOf(tipo) !== -1) campos[i].value = "";
  }
  // guarda somente a referência atual, sem persistir o arquivo
  if (tipo === "identificacao") arquivoIdentificacaoAtual = arquivo;
  else {
    arquivoComplementarAtual = arquivo;
    complementarCidadao = "Selecionado, sem comprovação automática";
  }
  document.getElementById("nome-" + tipo).textContent = arquivo.name;
  document.getElementById("nome-" + tipo).hidden = false;
  document.getElementById("remover-" + tipo).hidden = false;
  // pdf é identificado pelo nome e não recebe uma prévia de imagem
  if (arquivo.type !== "application/pdf") {
    const endereco = URL.createObjectURL(arquivo);
    const previa = document.getElementById("previa-" + tipo);
    previa.src = endereco;
    previa.hidden = false;
    if (tipo === "identificacao") previaIdentificacaoLocal = endereco;
    else previaComplementarLocal = endereco;
  }
  // utiliza o serviço real apenas quando houver configuração
  if (endpointDocumentos !== "") lerDadosCadastro(arquivo, tipo);
  else statusDocumentos.textContent = "Preencha os dados abaixo.";
}

// aproveita somente os dados retornados pelo serviço configurado
// arquivo identifica o anexo escolhido e tipo diferencia identificação e complemento
async function lerDadosCadastro(arquivo, tipo) {
  statusDocumentos.textContent = "Lendo documento...";
  try {
    // a escolha explícita do arquivo inicia a leitura, quando o serviço estiver configurado
    const dados = await solicitarLeituraDocumento(arquivo, true);
    // ignora respostas de arquivos removidos ou substituídos
    let atual = arquivoIdentificacaoAtual;
    if (tipo === "complementar") atual = arquivoComplementarAtual;
    if (atual !== arquivo) return;
    // não interpreta textos de comprovantes como diagnóstico ou validação médica
    if (tipo === "complementar") {
      complementarCidadao = "Comprovante recebido, aguardando análise";
      statusDocumentos.textContent = "Comprovante recebido.";
      return;
    }
    // relaciona apenas os dados de identificação aos campos normais do cadastro
    const propriedades = ["nome", "cpf", "rg", "nascimento"];
    const campos = ["cad-nome", "cad-cpf", "cad-rg", "cad-nascimento"];
    let preencheu = false;
    for (let i = 0; i < propriedades.length; i++) {
      // conserva os dados digitados quando a leitura não identificar esse campo
      if (typeof dados[propriedades[i]] === "string" && dados[propriedades[i]].trim() !== "") {
        document.getElementById(campos[i]).value = dados[propriedades[i]];
        preencheu = true;
      }
    }
    // mantém coerente a seleção de cin ou rg quando o serviço informar o tipo
    if (dados.tipoDocumento === "cin" || dados.tipoDocumento === "rg") {
      document.getElementById("cad-tipo-documento").value = dados.tipoDocumento;
      atualizarTipoCadastro();
    }
    if (preencheu) {
      identificacaoCidadao = "Dados extraídos por OCR";
      statusDocumentos.textContent = "Revise os dados preenchidos abaixo.";
    } else statusDocumentos.textContent = "Preencha os dados abaixo.";
  } catch (erro) {
    // mantém o preenchimento manual e ignora falhas de anexos já descartados
    if ((tipo === "identificacao" && arquivoIdentificacaoAtual === arquivo) || (tipo === "complementar" && arquivoComplementarAtual === arquivo)) statusDocumentos.textContent = "Não foi possível ler. Preencha os dados abaixo.";
  }
}

// descarta um arquivo cujo conteúdo o navegador não consegue exibir como imagem
// evento representa uma falha ao carregar a prévia local
function descartarImagemInvalida(evento) {
  // identifica qual prévia não pôde ser apresentada
  let tipo = "identificacao";
  if (evento.currentTarget.id === "previa-complementar") tipo = "complementar";
  removerPreviaDocumento(tipo);
  document.getElementById("documento-" + tipo).value = "";
  document.getElementById("camera-" + tipo).value = "";
  statusDocumentos.textContent = "Não foi possível abrir a imagem. Escolha outro arquivo.";
}

// alterna o tipo de documento sem apagar os dados já digitados
function atualizarTipoCadastro() {
  // identifica se a cin utiliza somente o cpf
  const cin = document.getElementById("cad-tipo-documento").value === "cin";
  document.getElementById("grupo-cad-rg").hidden = cin;
  document.getElementById("cad-rg").required = !cin;
}

// apresenta complemento opcional apenas para pessoa com deficiência
// evento indica uma mudança explícita de categoria
function atualizarComplementarCadastro(evento) {
  // recupera a categoria autodeclarada
  const pcd = document.getElementById("cad-categoria").value === "pcd";
  document.getElementById("complementar-cadastro").hidden = !pcd;
  document.getElementById("rotulo-identificacao").textContent = "Documento de identificação";
  if (pcd) {
    document.getElementById("rotulo-identificacao").textContent = "CIN ou documento de identificação";
    // sugere cin sem impedir a escolha manual de outro documento
    if (evento) {
      document.getElementById("cad-tipo-documento").value = "cin";
      atualizarTipoCadastro();
    }
  } else {
    // descarta arquivos complementares quando deixam de ser pertinentes
    removerPreviaDocumento("complementar");
    arquivoComplementar.value = "";
    document.getElementById("camera-complementar").value = "";
    document.getElementById("complementar-cadastro").open = false;
  }
}

// permite preencher manualmente e descarta anexos da opção anterior
function escolherManualCadastro() {
  limparDocumentosCadastro();
  document.getElementById("cad-nome").focus();
}

// remove o arquivo escolhido sem alterar os dados preenchidos no cadastro
// evento representa o botão correspondente ao anexo
function removerArquivoCadastro(evento) {
  // identifica o tipo pelo nome do botão
  const tipo = evento.currentTarget.id.replace("remover-", "");
  removerPreviaDocumento(tipo);
  document.getElementById("documento-" + tipo).value = "";
  document.getElementById("camera-" + tipo).value = "";
  statusDocumentos.textContent = "";
}

// registra os eventos apenas no cadastro que possui o leitor
if (arquivoIdentificacao) {
  // conecta as escolhas e mantém tipo e categoria coerentes
  document.getElementById("cad-tipo-documento").addEventListener("change", atualizarTipoCadastro);
  document.getElementById("cad-categoria").addEventListener("change", atualizarComplementarCadastro);
  document.getElementById("escolher-manual").addEventListener("click", escolherManualCadastro);
  document.getElementById("remover-identificacao").addEventListener("click", removerArquivoCadastro);
  document.getElementById("remover-complementar").addEventListener("click", removerArquivoCadastro);
  atualizarTipoCadastro();
  atualizarComplementarCadastro();
  // utiliza o mesmo fluxo de leitura para câmera e arquivo
  const campos = document.querySelectorAll("#arquivos-cadastro input[type='file']");
  for (let i = 0; i < campos.length; i++) campos[i].addEventListener("change", apresentarPreviaDocumento);
  // descarta conteúdo inválido mesmo quando o arquivo informa um tipo permitido
  document.getElementById("previa-identificacao").addEventListener("error", descartarImagemInvalida);
  document.getElementById("previa-complementar").addEventListener("error", descartarImagemInvalida);
  // descarta arquivos ao deixar a página, inclusive no histórico do navegador
  window.addEventListener("pagehide", limparDocumentosCadastro);
}

// =================================================================
// REVISÃO LOCAL DOS DADOS NO PERFIL
// =================================================================

// abre a revisão manual sem oferecer alteração livre de identidade
function abrirRevisaoDocumentoPerfil() {
  // seleciona a janela existente no perfil
  const modal = document.getElementById("modal-documento");
  // abre somente quando a janela ainda estiver fechada
  if (!modal.open) {
    modal.showModal();
  }
  // recupera os dados salvos para facilitar a revisão sem alterar identidade
  const cidadao = buscarCidadaoConectado();
  // preenche somente quando a sessão está disponível
  if (cidadao) {
    document.getElementById("manual-nome-completo").value = cidadao.nome;
    document.getElementById("manual-data-nascimento").value = cidadao.nascimento;
    document.getElementById("manual-tipo-documento").value = cidadao.tipoDocumento || "";
  }
  document.getElementById("preenchimento-manual-documento").open = true;
  document.getElementById("manual-nome-completo").focus();
}

// compara a transcrição manual com o cadastro sem salvar mudanças de identidade
function conferirDadosDocumentoPerfil() {
  // recupera o cadastro atual para impedir comparação com dados antigos
  const cidadao = buscarCidadaoConectado();
  // seleciona a mensagem de retorno da revisão
  const mensagem = document.getElementById("mensagem-leitura-documento");
  // impede conferência quando a sessão não estiver disponível
  if (!cidadao) {
    mensagem.textContent = "Entre novamente para consultar seus dados.";
    return;
  }
  // recupera o nome transcrito manualmente
  const nome = document.getElementById("manual-nome-completo");
  // recupera o nascimento transcrito manualmente
  const nascimento = document.getElementById("manual-data-nascimento");
  // recupera o tipo de documento declarado para esta revisão local
  const tipo = document.getElementById("manual-tipo-documento");
  // exige preenchimento dos campos antes de comparar
  if (!nome.reportValidity() || !nascimento.reportValidity() || !tipo.reportValidity() || !nome.value.trim()) {
    mensagem.textContent = "Informe o nome, o nascimento e o tipo de documento para comparar com o cadastro.";
    return;
  }
  // informa divergências sem alterar dados ou estados documentais já cadastrados
  if (nome.value.trim().toLowerCase() !== cidadao.nome.trim().toLowerCase() || nascimento.value !== cidadao.nascimento || (cidadao.tipoDocumento && tipo.value !== cidadao.tipoDocumento)) {
    mensagem.textContent = "Nome ou nascimento divergem do cadastro. Esta revisão local não altera a identidade. A atualização de identidade depende de uma conferência documental ainda indisponível.";
    return;
  }
  mensagem.textContent = "Os dados digitados coincidem com o cadastro nesta revisão manual. Isso não comprova identidade ou autenticidade documental. Nenhum dado ou estado documental foi alterado.";
}

// seleciona o botão apenas quando o leitor está na página de perfil
const abrirDocumentoPerfil = document.getElementById("abrir-leitor-documentos");
// conecta a janela existente sem modificar o fluxo de cadastro
if (abrirDocumentoPerfil) {
  abrirDocumentoPerfil.addEventListener("click", abrirRevisaoDocumentoPerfil);
  // permite comparar os dados sem OCR, upload ou persistência de imagens
  document.getElementById("confirmar-dados-manuais").disabled = false;
  document.getElementById("confirmar-dados-manuais").addEventListener("click", conferirDadosDocumentoPerfil);
  // recupera o foco no controle que abriu a revisão
  document.getElementById("modal-documento").addEventListener("close", function () {
    abrirDocumentoPerfil.focus();
  });
}
