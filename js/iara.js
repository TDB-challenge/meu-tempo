// =================================================================
// DISPONIBILIDADE DA IARA WEB
// =================================================================

// apresenta a limitação real sem inventar respostas de um serviço externo
function prepararIara() {
  // seleciona o aviso já existente da conversa
  const aviso = document.getElementById('aviso-chat');
  // protege páginas sem a assistente
  if (!aviso) {
    return;
  }
  aviso.hidden = false;
  aviso.textContent = 'O webchat da IARA será configurado futuramente. Não há serviço de conversa conectado. Utilize as páginas de serviços para registrar seus pedidos.';
  // impede coleta de mensagens enquanto não existir destino configurado
  document.getElementById('campo-mensagem').disabled = true;
  // mantém o formulário sem envio ou comunicação fictícia
  document.getElementById('formulario-chat').addEventListener('submit', function (evento) {
    evento.preventDefault();
  });
  // apresenta atalhos locais com destinos explícitos
  const ids = ['sugestao-travessia', 'sugestao-metro', 'sugestao-zeladoria', 'sugestao-informacoes'];
  // guarda somente destinos de navegação local
  const paginas = ['travessia.html', 'apoio-metro.html', 'zeladoria.html', '../solucao.html'];
  // conecta cada atalho ao serviço existente sem simular conversa
  for (let i = 0; i < ids.length; i = i + 1) {
    // recupera o botão da sugestão
    const botao = document.getElementById(ids[i]);
    botao.disabled = false;
    // data-destino identifica a página aberta pelo atalho
    botao.setAttribute('data-destino', paginas[i]);
    botao.addEventListener('click', function (evento) {
      window.location.href = evento.currentTarget.getAttribute('data-destino');
    });
  }
  // seleciona o controle que poderia oferecer voz de conversa
  const ouvir = document.getElementById('ouvir-mensagem');
  // guarda a escolha de voz sem inventar uma conexão com o serviço
  if (ouvir) {
    ouvir.disabled = false;
    ouvir.setAttribute('aria-pressed', String(buscarPreferenciasAcessibilidade().vozIara));
    ouvir.addEventListener('click', function () {
      // sincroniza a mesma preferência utilizada no cadastro e no perfil
      const preferencias = buscarPreferenciasAcessibilidade();
      preferencias.vozIara = !preferencias.vozIara;
      salvarPreferenciasAcessibilidade(preferencias);
      ouvir.setAttribute('aria-pressed', String(preferencias.vozIara));
      aviso.textContent = 'Sua preferência foi salva. A conversa por voz ainda não está disponível.';
    });
  }
}

// apresenta a situação do serviço ao carregar a página
prepararIara();
