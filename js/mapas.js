/*
  seleção dos locais e consulta pública de percurso:
  a travessia usa um diagrama em html, criado a partir do catálogo de dados.js.
  a zeladoria mantém a consulta pública em iframe; nenhum cálculo de rota é realizado neste arquivo.

  mapa-base-travessia recebe a avenida, as ruas e os botões de semáforo do diagrama.
  marcador-semaforo fornece o visual do botão; com-suporte e sem-suporte distinguem a disponibilidade.
  data-marcador-cruzamento relaciona cada botão ao rádio da lista textual equivalente.
  aria-pressed acompanha a seleção, permitindo identificar o ponto escolhido também sem depender da cor.
  partida-percurso e destino-percurso montam o link do maps com os endereços informados.
  a localização do dispositivo só é solicitada depois de uma ação explícita do cidadão.
*/

// =================================================================
// consulta pública de endereços
// =================================================================

// atualiza mapa e informações usando a opção escolhida na lista
function atualizarCruzamentoMapa() {
  // recupera o cruzamento escolhido na página atual
  // o seletor checked encontra apenas o rádio selecionado dentro do grupo chamado cruzamento
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
  let descricao = 'Indisponível na simulação.';
  // informa quando o catálogo permite simular o pedido
  if (suporte) {
    descricao = 'Disponível na simulação.';
  }
  document.getElementById('suporte-cruzamento-' + tipo).textContent = descricao;
  // seleciona o iframe público sem inventar coordenadas
  const mapa = document.getElementById('mapa-base-' + tipo);
  // preserva o mapa público da zeladoria; a travessia utiliza o diagrama local
  // encodeuricomponent protege o endereço como valor da consulta; a atribuição ao iframe carrega um mapa do serviço externo
  if (mapa.tagName === 'IFRAME') mapa.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(nome + ', São Paulo, SP') + '&output=embed';
  // sincroniza a seleção dos marcadores com a lista textual
  const marcadores = document.querySelectorAll('[data-marcador-cruzamento]');
  for (let i = 0; i < marcadores.length; i++) {
    marcadores[i].setAttribute('aria-pressed', String(marcadores[i].getAttribute('data-marcador-cruzamento') === escolha.value));
  }
  // atualiza confirmação e elegibilidade somente na travessia
  if (tipo === 'travessia') {
    document.getElementById('endereco-confirmacao').textContent = nome;
    // informa a disponibilidade por texto e cor, sem alterar a regra de suporte
    const situacao = document.getElementById('situacao-local');
    situacao.textContent = descricao;
    situacao.setAttribute('data-suporte', String(suporte));
    alterarTempoAdicional(0);
    document.getElementById('aviso-sem-suporte').hidden = suporte;
    document.getElementById('relatar-local').hidden = suporte;
    document.getElementById('relatar-local').href = 'zeladoria.html?local=' + encodeURIComponent(nome);
    document.getElementById('solicitar-travessia').disabled = !suporte;
    // atualiza o painel do controlador junto com a escolha do local
    if (typeof atualizarContagemApp === 'function') atualizarContagemApp();
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
  // a chamada é assíncrona: o navegador pede permissão e depois aciona a função de sucesso ou a função de falha
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

// permite escolher no diagrama usando os mesmos radios da lista textual
function prepararMarcadoresTravessia() {
  // seleciona o contêiner restaurado da representação demonstrativa
  const mapa = document.getElementById('mapa-base-travessia');
  if (!mapa || mapa.tagName === 'IFRAME') return;
  mapa.textContent = '';
  // desenha a avenida principal somente como referência visual do mapa esquemático
  const avenida = document.createElement('div');
  // avenida-mapa fornece o estilo da via principal; os elementos decorativos são ocultados da leitura assistiva por aria-hidden
  avenida.className = 'avenida-mapa';
  avenida.setAttribute('aria-hidden', 'true');
  mapa.appendChild(avenida);
  // identifica a via principal sem repetir o nome em cada cruzamento
  const tituloAvenida = document.createElement('span');
  tituloAvenida.className = 'nome-avenida';
  tituloAvenida.textContent = 'Av. Paulista';
  tituloAvenida.setAttribute('aria-hidden', 'true');
  mapa.appendChild(tituloAvenida);
  // apresenta todos os locais do catálogo, sem criar posições geográficas fictícias
  for (let i = 0; i < cruzamentosMeuTempo.length; i++) {
    // desenha a rua transversal usando o mesmo catálogo dos serviços
    const rua = document.createElement('div');
    rua.className = 'rua-mapa';
    rua.setAttribute('data-cruzamento', cruzamentosMeuTempo[i].id);
    // permite diferenciar visualmente os pontos disponíveis e indisponíveis
    rua.setAttribute('data-suporte', String(cruzamentosMeuTempo[i].suporte));
    // apresenta o nome da rua ao lado do seu semáforo
    const nomeRua = document.createElement('span');
    nomeRua.className = 'nome-rua';
    nomeRua.textContent = cruzamentosMeuTempo[i].nome.split(' × ')[1];
    nomeRua.setAttribute('aria-hidden', 'true');
    rua.appendChild(nomeRua);
    // cria um botão identificável por ícone, nome e situação de suporte
    const botao = document.createElement('button');
    botao.type = 'button';
    // marcador-semaforo define o botão no diagrama e as classes com-suporte e sem-suporte distinguem sua situação visual
    botao.className = 'marcador-semaforo sem-suporte';
    if (cruzamentosMeuTempo[i].suporte) botao.className = 'marcador-semaforo com-suporte';
    botao.setAttribute('data-marcador-cruzamento', cruzamentosMeuTempo[i].id);
    botao.setAttribute('aria-pressed', 'false');
    const icone = document.createElement('img');
    icone.src = '../../assets/icones/semaforo.svg';
    icone.className = 'icone';
    icone.alt = '';
    botao.appendChild(icone);
    const nome = document.createElement('span');
    let suporte = ' — indisponível na simulação';
    if (cruzamentosMeuTempo[i].suporte) suporte = ' — disponível na simulação';
    nome.textContent = cruzamentosMeuTempo[i].nome + suporte;
    // mantém no marcador o ícone e oferece o nome completo ao foco e ao ponteiro
    nome.hidden = true;
    botao.setAttribute('aria-label', nome.textContent);
    botao.title = nome.textContent;
    botao.appendChild(nome);
    // aciona a mesma seleção da alternativa acessível sem enviar solicitações
    botao.addEventListener('click', function (evento) {
      const escolhas = document.querySelectorAll('input[name="cruzamento"]');
      for (let j = 0; j < escolhas.length; j++) {
        if (escolhas[j].value === evento.currentTarget.getAttribute('data-marcador-cruzamento') && !escolhas[j].disabled) {
          escolhas[j].checked = true;
          // alterar checked por código não dispara change; o evento criado avisa os ouvintes e bubbles permite que ele alcance os elementos ancestrais
          escolhas[j].dispatchEvent(new Event('change', {bubbles: true}));
        }
      }
    });
    rua.appendChild(botao);
    mapa.appendChild(rua);
  }
}

// conecta a alternativa de lista e os campos de percurso
function prepararMapas() {
  prepararMarcadoresTravessia();
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
  // mantém os marcadores bloqueados quando um pedido foi recuperado
  if (document.getElementById('formulario-travessia')) bloquearSelecaoTravessia(pedidoTravessia !== null);
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
    // urlsearchparams interpreta a consulta da página e recupera o valor de local sem separar os pares de parâmetros manualmente
    const parametros = new URLSearchParams(window.location.search);
    // preenche somente quando o link trouxer um endereço
    if (parametros.get('local')) {
      document.getElementById('endereco-relato').value = parametros.get('local');
    }
  }
}

// adia a preparação até todos os scripts deferidos terem sido executados
document.addEventListener('DOMContentLoaded', prepararMapas);
