// =================================================================
// CONSULTA PÚBLICA DE ENDEREÇOS
// =================================================================

// atualiza mapa e informações usando a opção escolhida na lista
function atualizarCruzamentoMapa() {
  // recupera o cruzamento escolhido na página atual
  const escolha = document.querySelector('input[name="cruzamento"]:checked');
  // evita atualizar páginas sem lista de cruzamentos
  if (!escolha) {
    return;
  }
  // identifica qual página utiliza a lista
  let tipo = 'travessia';
  // seleciona a página de relato quando seu formulário estiver presente
  if (document.getElementById('formulario-zeladoria')) {
    tipo = 'zeladoria';
  }
  // recupera os dados do rótulo existente
  const rotulo = escolha.parentElement;
  // recupera o endereço apresentado na lista
  const nome = rotulo.querySelector('strong').textContent.trim();
  // recupera a cobertura demonstrativa declarada no catálogo
  const suporte = rotulo.getAttribute('data-suporte') === 'true';
  document.getElementById('nome-cruzamento-' + tipo).textContent = nome;
  document.getElementById('cruzamento-' + tipo).setAttribute('data-suporte', rotulo.getAttribute('data-suporte'));
  // prepara a descrição de cobertura sem afirmar integração com órgão público
  let descricao = 'Sem suporte no catálogo demonstrativo.';
  // informa quando o catálogo permite simular o pedido
  if (suporte) {
    descricao = 'Com suporte no catálogo demonstrativo.';
  }
  document.getElementById('suporte-cruzamento-' + tipo).textContent = descricao;
  // seleciona o iframe público sem inventar coordenadas
  const mapa = document.getElementById('mapa-base-' + tipo);
  mapa.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(nome + ', São Paulo, SP') + '&output=embed';
  // atualiza confirmação e elegibilidade somente na travessia
  if (tipo === 'travessia') {
    document.getElementById('endereco-confirmacao').textContent = nome;
    document.getElementById('aviso-sem-suporte').hidden = suporte;
    document.getElementById('relatar-local').hidden = suporte;
    document.getElementById('relatar-local').href = 'zeladoria.html?local=' + encodeURIComponent(nome);
    document.getElementById('solicitar-travessia').disabled = !suporte;
    // mantém bloqueado durante uma contagem ativa
    if (typeof pedidoTravessia !== 'undefined' && pedidoTravessia) {
      document.getElementById('solicitar-travessia').disabled = true;
    }
  } else {
    document.getElementById('endereco-relato').value = nome;
  }
}

// atualiza um link público de percurso a pé sem simular distância ou acessibilidade
function atualizarPercursoMapa() {
  // recupera a origem digitada pelo cidadão
  const partida = document.getElementById('partida-percurso').value.trim();
  // recupera o destino digitado pelo cidadão
  const destino = document.getElementById('destino-percurso').value.trim();
  // recupera o link para a consulta externa
  const link = document.getElementById('consultar-percurso');
  link.href = 'https://www.google.com/maps/dir/?api=1&travelmode=walking&origin=' + encodeURIComponent(partida) + '&destination=' + encodeURIComponent(destino);
}

// solicita geolocalização somente após clique explícito
function solicitarLocalizacaoRelato() {
  // seleciona o aviso de localização
  const aviso = document.getElementById('aviso-localizacao');
  aviso.hidden = false;
  // explica quando o navegador não oferece o recurso
  if (!navigator.geolocation) {
    aviso.textContent = 'Localização indisponível. Digite o endereço do relato.';
    return;
  }
  aviso.textContent = 'Aguardando sua autorização de localização no navegador.';
  // pede a posição sem iniciar rastreamento contínuo
  navigator.geolocation.getCurrentPosition(receberLocalizacaoRelato, falharLocalizacaoRelato);
}

// apresenta coordenadas realmente fornecidas pelo navegador
// posicao representa a posição autorizada pelo cidadão
function receberLocalizacaoRelato(posicao) {
  document.getElementById('latitude-relato').value = posicao.coords.latitude;
  document.getElementById('longitude-relato').value = posicao.coords.longitude;
  document.getElementById('aviso-localizacao').textContent = 'Localização obtida. Confira e informe o endereço por escrito para registrar o relato.';
  document.getElementById('mapa-base-zeladoria').src = 'https://maps.google.com/maps?q=' + encodeURIComponent(posicao.coords.latitude + ',' + posicao.coords.longitude) + '&output=embed';
}

// informa a falha sem inventar endereço ou posição
function falharLocalizacaoRelato() {
  document.getElementById('aviso-localizacao').textContent = 'Não foi possível obter a localização. Digite o endereço do relato.';
}

// conecta a alternativa de lista e os campos de percurso
function prepararMapas() {
  // recupera todos os controles de cruzamento existentes
  const escolhas = document.querySelectorAll('input[name="cruzamento"]');
  // conecta cada mudança de cruzamento ao mapa público
  for (let i = 0; i < escolhas.length; i = i + 1) {
    escolhas[i].addEventListener('change', atualizarCruzamentoMapa);
  }
  // inicia o mapa somente quando houver lista na página
  if (escolhas.length) {
    atualizarCruzamentoMapa();
  }
  // seleciona o campo de origem do percurso
  const partida = document.getElementById('partida-percurso');
  // conecta a consulta externa aos endereços informados
  if (partida) {
    partida.addEventListener('input', atualizarPercursoMapa);
    document.getElementById('destino-percurso').addEventListener('input', atualizarPercursoMapa);
    // impede abrir uma consulta vazia
    document.getElementById('consultar-percurso').addEventListener('click', function (evento) {
      if (!partida.value.trim() || !document.getElementById('destino-percurso').value.trim()) {
        evento.preventDefault();
        partida.focus();
      }
    });
    // conecta o botão existente para escolher outro cruzamento
    const trocar = document.getElementById('trocar-cruzamento');
    // mantém a escolha bloqueada também na restauração após recarregar
    trocar.disabled = typeof pedidoTravessia !== 'undefined' && pedidoTravessia !== null;
    trocar.addEventListener('click', function () {
      document.querySelector('.lista-cruzamentos').open = true;
      escolhas[0].focus();
    });
  }
  // seleciona a geolocalização opcional do relato
  const localizacao = document.getElementById('usar-localizacao');
  // pede permissão apenas no clique
  if (localizacao) {
    localizacao.disabled = false;
    localizacao.addEventListener('click', solicitarLocalizacaoRelato);
    // conecta a abertura do mapa já existente
    const escolher = document.getElementById('escolher-mapa');
    escolher.disabled = false;
    escolher.addEventListener('click', function () {
      document.getElementById('mapa-regiao').open = true;
      document.querySelector('.lista-cruzamentos').open = true;
      escolhas[0].focus();
    });
    // recupera o endereço enviado pelo link de cruzamento sem suporte
    const parametros = new URLSearchParams(window.location.search);
    // preenche somente quando o link trouxer um endereço
    if (parametros.get('local')) {
      document.getElementById('endereco-relato').value = parametros.get('local');
    }
  }
}

// adia a preparação até todos os scripts deferidos terem sido executados
document.addEventListener('DOMContentLoaded', prepararMapas);
