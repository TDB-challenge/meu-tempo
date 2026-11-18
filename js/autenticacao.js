
// =================================================================
// PAINEL DE ACESSIBILIDADE
// =================================================================


// seleciona o botão que abre o painel de acessibilidade
const botaoAcessibilidade = document.getElementById("abrir-painel-acessibilidade");

// seleciona o painel que possui as opções de acessibilidade
const painelAcessibilidade = document.getElementById("painel-acessibilidade");


// função responsável por abrir e fechar o painel
function alternarPainelAcessibilidade() {

    // verifica se o painel está escondido
    if (painelAcessibilidade.hidden === true) {

        // mostra o painel
        painelAcessibilidade.hidden = false;

        // informa ao leitor de tela que o painel está aberto
        botaoAcessibilidade.setAttribute("aria-expanded", "true");

    } else {

        // esconde o painel
        painelAcessibilidade.hidden = true;

        // informa ao leitor de tela que o painel está fechado
        botaoAcessibilidade.setAttribute("aria-expanded", "false");

    }

}


// verifica se o botão e o painel existem na página
if (botaoAcessibilidade && painelAcessibilidade) {

    // mantém o painel fechado quando a página é carregada
    painelAcessibilidade.hidden = true;

    // executa a função quando o usuário clica no botão
    botaoAcessibilidade.addEventListener("click", alternarPainelAcessibilidade);

}
