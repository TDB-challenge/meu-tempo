// =================================================================
// INTEGRAÇÃO FUTURA DE DOCUMENTOS
// =================================================================

// mantém vazio o endereço porque esta demonstração não possui servidor de ocr
const endpointDocumentos = "";

// prepara o envio futuro sem conter chaves ou simular dados extraídos
// arquivo representa uma imagem fictícia; consentimento representa a autorização atual
async function solicitarLeituraDocumento(arquivo, consentimento) {
  // interrompe qualquer envio sem autorização ou sem configuração
  if (consentimento !== true || endpointDocumentos === "") {
    throw new Error("OCR indisponível: falta configurar um endpoint seguro. Utilize a conferência manual.");
  }
  // reúne a imagem para o futuro serviço de leitura
  // formdata monta as partes do envio de arquivo; o navegador define o separador do conteúdo multipart automaticamente
  const formularioDocumento = new FormData();
  formularioDocumento.append("documento", arquivo);
  // aguarda a resposta do endpoint configurado sem incluir credenciais privadas
  // fetch devolve uma promessa de resposta http; falhas de rede rejeitam essa promessa e respostas de erro são verificadas por ok
  const respostaDocumento = await fetch(endpointDocumentos, {method: "POST", body: formularioDocumento});
  // informa uma falha do serviço em vez de inventar uma leitura
  if (!respostaDocumento.ok) {
    throw new Error("Não foi possível ler o documento. Preencha os dados manualmente.");
  }
  // devolve os dados reais da resposta para uma futura integração de revisão
  // json interpreta o corpo da resposta como dados; o código que recebe esse retorno ainda precisa conferir os campos utilizados
  return await respostaDocumento.json();
}
