// =================================================================
// PRÉVIA LOCAL E CONFERÊNCIA MANUAL
// =================================================================

// guarda somente endereços temporários na memória, nunca no armazenamento
let previaIdentificacaoLocal = "";
// guarda separadamente o endereço temporário do complemento
let previaComplementarLocal = "";
// guarda o resultado demonstrativo, sem afirmar autenticidade ou diagnóstico
let identificacaoCidadao = "Não conferida";
// mantém a documentação complementar sem diagnóstico automático
let complementarCidadao = "Não informado";
// seleciona a autorização, os arquivos e a mensagem acessível da demonstração
const consentimentoDocumentos = document.getElementById("consentimento-documentos");
// seleciona o arquivo de identificação fictício
const arquivoIdentificacao = document.getElementById("documento-identificacao");
// seleciona o arquivo complementar fictício
const arquivoComplementar = document.getElementById("documento-complementar");
// seleciona a mensagem que informa os limites da conferência manual
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
    identificacaoCidadao = "Não conferida";
    document.getElementById("conferencia-documento").hidden = true;
    document.getElementById("documento-nome").value = "";
    document.getElementById("documento-nascimento").value = "";
  } else {
    // libera a referência temporária do documento complementar
    URL.revokeObjectURL(previaComplementarLocal);
    previaComplementarLocal = "";
    complementarCidadao = "Não informado";
  }
  previa.removeAttribute("src");
  previa.hidden = true;
  document.getElementById("nome-" + tipo).textContent = "";
  document.getElementById("remover-" + tipo).hidden = true;
}

// apaga as imagens e os campos após revogação, conclusão ou saída
function limparDocumentosCadastro() {
  // executa apenas quando os campos existem nesta página
  if (arquivoIdentificacao && arquivoComplementar) {
    removerPreviaDocumento("identificacao");
    removerPreviaDocumento("complementar");
    arquivoIdentificacao.value = "";
    arquivoComplementar.value = "";
    consentimentoDocumentos.checked = false;
    arquivoIdentificacao.disabled = true;
    arquivoComplementar.disabled = true;
    statusDocumentos.textContent = "Arquivos descartados. Não há imagem conferida nesta página.";
  }
}

// reflete a autorização e descarta as imagens quando ela é retirada
function atualizarConsentimentoDocumentos() {
  // impede seleção e remove os dados quando não há consentimento
  if (!consentimentoDocumentos.checked) {
    limparDocumentosCadastro();
    statusDocumentos.textContent = "Autorização retirada. As imagens foram descartadas.";
  } else {
    arquivoIdentificacao.disabled = false;
    arquivoComplementar.disabled = false;
    statusDocumentos.textContent = "Selecione apenas imagens fictícias. A prévia é local; não há envio nem OCR.";
  }
}

// apresenta a imagem selecionada apenas na memória da página
// evento identifica o campo de arquivo alterado pelo cidadão
function apresentarPreviaDocumento(evento) {
  // identifica o campo e o tipo de documento escolhido
  const campo = evento.currentTarget;
  // inicia com o tipo de identificação até verificar o campo alterado
  let tipo = "identificacao";
  // diferencia a documentação complementar
  if (campo.id === "documento-complementar") {
    tipo = "complementar";
  }
  removerPreviaDocumento(tipo);
  // verifica autorização atual e existência do arquivo
  if (!consentimentoDocumentos.checked || campo.files.length === 0) {
    campo.value = "";
    return;
  }
  // recupera a imagem selecionada sem converter para texto ou salvar no navegador
  const arquivo = campo.files[0];
  // aceita somente imagens conhecidas dentro do limite informado
  if ((arquivo.type !== "image/jpeg" && arquivo.type !== "image/png" && arquivo.type !== "image/webp" && arquivo.type !== "application/pdf") || arquivo.size > 5 * 1024 * 1024) {
    campo.value = "";
    statusDocumentos.textContent = "Selecione imagem JPG, PNG, WEBP ou PDF de até 5 MB.";
    return;
  }
  document.getElementById("nome-" + tipo).textContent = arquivo.name + " — selecionado apenas nesta página";
  document.getElementById("remover-" + tipo).hidden = false;
  // utiliza o serviço real apenas quando houver configuração e autorização
  if (endpointDocumentos !== "") {
    lerDadosCadastro(campo, tipo);
  }
  // pdf é identificado pelo nome e não recebe uma prévia de imagem
  if (arquivo.type === "application/pdf") {
    // o complemento permanece opcional e não representa comprovação médica
    if (tipo === "complementar") {
      complementarCidadao = "Selecionado, sem comprovação automática";
    }
    statusDocumentos.textContent = "PDF selecionado. Confira e preencha os dados manualmente; a leitura automática ainda não está disponível.";
    return;
  }
  // cria um endereço temporário para exibição local
  const endereco = URL.createObjectURL(arquivo);
  // seleciona a imagem que receberá somente o endereço temporário
  const previa = document.getElementById("previa-" + tipo);
  previa.src = endereco;
  previa.hidden = false;
  // permite conferência manual somente após selecionar a identificação
  if (tipo === "identificacao") {
    previaIdentificacaoLocal = endereco;
    document.getElementById("conferencia-documento").hidden = false;
  } else {
    previaComplementarLocal = endereco;
    complementarCidadao = "Selecionado, sem comprovação automática";
  }
  statusDocumentos.textContent = "Prévia local disponível. Não há extração automática nem análise documental. Confira os dados manualmente.";
}

// aproveita somente os dados retornados pelo serviço configurado
// campo identifica o anexo atual e tipo diferencia identificação e complemento
async function lerDadosCadastro(campo, tipo) {
  // preserva a referência para ignorar respostas de arquivos removidos ou substituídos
  const arquivo = campo.files[0];
  try {
    // envia somente ao endpoint configurado, com autorização atual
    const dados = await solicitarLeituraDocumento(arquivo, consentimentoDocumentos.checked);
    // ignora uma resposta se o cidadão retirou a autorização ou o arquivo
    if (!consentimentoDocumentos.checked || campo.files[0] !== arquivo) {
      return;
    }
    // documentos complementares não comprovam diagnósticos automaticamente
    if (tipo === "complementar") {
      complementarCidadao = "Dados extraídos por OCR, sem comprovação automática";
      statusDocumentos.textContent = "Complemento lido. A leitura não comprova condição médica. Revise seus dados.";
      return;
    }
    // preenche somente campos recebidos do serviço, sem inventar valores
    if (typeof dados.nome === "string") {
      document.getElementById("cad-nome").value = dados.nome;
    }
    if (typeof dados.cpf === "string") {
      document.getElementById("cad-cpf").value = dados.cpf;
    }
    if (typeof dados.rg === "string") {
      document.getElementById("cad-rg").value = dados.rg;
    }
    if (typeof dados.nascimento === "string") {
      document.getElementById("cad-nascimento").value = dados.nascimento;
    }
    identificacaoCidadao = "Dados extraídos por OCR";
    statusDocumentos.textContent = "Dados extraídos por OCR. Revise e corrija os campos antes de continuar; a leitura não autentica a identidade.";
  } catch (erro) {
    // conserva o preenchimento manual quando a leitura falhar
    statusDocumentos.textContent = "Não foi possível ler o arquivo. Preencha os dados manualmente.";
  }
}

// invalida a comparação quando qualquer informação de identificação muda
function invalidarConferenciaDocumento() {
  identificacaoCidadao = "Não conferida";
  statusDocumentos.textContent = "Dados alterados. Confira novamente o nome e o nascimento digitados manualmente.";
}

// descarta um arquivo cujo conteúdo o navegador não consegue exibir como imagem
// evento representa uma falha ao carregar a prévia local
function descartarImagemInvalida(evento) {
  // identifica qual prévia não pôde ser apresentada
  let tipo = "identificacao";
  // diferencia a falha na imagem complementar
  if (evento.currentTarget.id === "previa-complementar") {
    tipo = "complementar";
  }
  removerPreviaDocumento(tipo);
  document.getElementById("documento-" + tipo).value = "";
  statusDocumentos.textContent = "Não foi possível abrir esta imagem. Selecione outro arquivo fictício JPG, PNG ou WEBP.";
}

// compara os dados digitados com a transcrição manual da imagem fictícia
function conferirDocumentoManual() {
  // seleciona as duas transcrições manuais e os dados básicos informados
  const nomeDocumento = document.getElementById("documento-nome").value.trim().toLowerCase();
  // recupera o nascimento transcrito manualmente da imagem fictícia
  const nascimentoDocumento = document.getElementById("documento-nascimento").value;
  // recupera o nome preenchido no cadastro para comparação
  const nomeInformado = document.getElementById("cad-nome").value.trim().toLowerCase();
  // recupera o nascimento preenchido no cadastro para comparação
  const nascimentoInformado = document.getElementById("cad-nascimento").value;
  // exige autorização, prévia e preenchimento antes de comparar
  if (!consentimentoDocumentos.checked || previaIdentificacaoLocal === "" || nomeDocumento === "" || nascimentoDocumento === "") {
    statusDocumentos.textContent = "Selecione a imagem fictícia autorizada e transcreva o nome e o nascimento para conferir.";
    return;
  }
  // informa divergências sem sobrescrever os dados nem atribuir condições médicas
  if (nomeDocumento !== nomeInformado || nascimentoDocumento !== nascimentoInformado) {
    identificacaoCidadao = "Não conferida";
    statusDocumentos.textContent = "Nome ou nascimento divergente. Corrija os dados ou a transcrição manual e confira novamente.";
    return;
  }
  identificacaoCidadao = "Conferência manual da demonstração";
  statusDocumentos.textContent = "Dados digitados coincidem na conferência manual da demonstração. Isso não comprova autenticidade nem direito a benefício.";
}

// alterna o tipo de documento sem apagar os dados já digitados
function atualizarTipoCadastro() {
  // identifica se a cin utiliza somente o cpf
  const cin = document.getElementById("cad-tipo-documento").value === "cin";
  document.getElementById("grupo-cad-rg").hidden = cin;
  document.getElementById("cad-rg").required = !cin;
}

// apresenta complemento opcional apenas para pessoa com deficiência
function atualizarComplementarCadastro() {
  // recupera a categoria autodeclarada
  const pcd = document.getElementById("cad-categoria").value === "pcd";
  document.getElementById("complementar-cadastro").hidden = !pcd;
  // descarta arquivos complementares quando deixam de ser pertinentes
  if (!pcd) {
    removerPreviaDocumento("complementar");
    arquivoComplementar.value = "";
  }
}

// apresenta os anexos opcionais sem exigir leitura para cadastrar
function escolherScanCadastro() {
  document.getElementById("arquivos-cadastro").hidden = false;
  document.getElementById("escolher-scan").setAttribute("aria-expanded", "true");
  consentimentoDocumentos.focus();
}

// permite preencher manualmente e descarta anexos da opção anterior
function escolherManualCadastro() {
  limparDocumentosCadastro();
  document.getElementById("arquivos-cadastro").hidden = true;
  document.getElementById("escolher-scan").setAttribute("aria-expanded", "false");
  statusDocumentos.textContent = "Preencha os campos abaixo. Não é necessário anexar arquivos.";
  document.getElementById("cad-nome").focus();
}

// remove o arquivo escolhido sem alterar os dados preenchidos no cadastro
// evento representa o botão correspondente ao anexo
function removerArquivoCadastro(evento) {
  // identifica o tipo pelo nome do botão
  const tipo = evento.currentTarget.id.replace("remover-", "");
  removerPreviaDocumento(tipo);
  document.getElementById("documento-" + tipo).value = "";
  statusDocumentos.textContent = "Arquivo removido. Os dados do cadastro foram preservados.";
}

// registra os eventos apenas no cadastro que possui o leitor
if (consentimentoDocumentos) {
  // conecta as escolhas e mantém tipo e categoria coerentes
  document.getElementById("cad-tipo-documento").addEventListener("change", atualizarTipoCadastro);
  document.getElementById("cad-categoria").addEventListener("change", atualizarComplementarCadastro);
  document.getElementById("escolher-scan").addEventListener("click", escolherScanCadastro);
  document.getElementById("escolher-manual").addEventListener("click", escolherManualCadastro);
  document.getElementById("remover-identificacao").addEventListener("click", removerArquivoCadastro);
  document.getElementById("remover-complementar").addEventListener("click", removerArquivoCadastro);
  atualizarTipoCadastro();
  atualizarComplementarCadastro();
  consentimentoDocumentos.addEventListener("change", atualizarConsentimentoDocumentos);
  arquivoIdentificacao.addEventListener("change", apresentarPreviaDocumento);
  arquivoComplementar.addEventListener("change", apresentarPreviaDocumento);
  // descarta conteúdo inválido mesmo quando o arquivo informa um tipo permitido
  document.getElementById("previa-identificacao").addEventListener("error", descartarImagemInvalida);
  document.getElementById("previa-complementar").addEventListener("error", descartarImagemInvalida);
  document.getElementById("btn-simular-qrcode").addEventListener("click", conferirDocumentoManual);
  // invalida a conferência após edição da transcrição ou dos dados básicos
  document.getElementById("documento-nome").addEventListener("input", invalidarConferenciaDocumento);
  document.getElementById("documento-nascimento").addEventListener("input", invalidarConferenciaDocumento);
  document.getElementById("cad-nome").addEventListener("input", invalidarConferenciaDocumento);
  document.getElementById("cad-nascimento").addEventListener("input", invalidarConferenciaDocumento);
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
