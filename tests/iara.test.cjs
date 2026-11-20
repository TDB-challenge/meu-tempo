const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
function storage() {
  const data = new Map();
  return {getItem: k => data.get(k) ?? null, setItem: (k,v) => data.set(k,String(v)), removeItem: k => data.delete(k)};
}
function ambiente() {
  let cidadao = {id:'pessoa-a', nome:'Ana', categoria:'idosa', cpf:'sigiloso', pin:'1234'};
  const c = vm.createContext({console, crypto:webcrypto, localStorage:storage(), sessionStorage:storage(),
    AbortController, setTimeout, clearTimeout, setInterval, clearInterval,
    buscarCidadaoConectado:()=>cidadao,
    fetch: async()=>({ok:true,status:200,json:async()=>[]}),
    window:{location:{hostname:'localhost'},addEventListener:()=>{}},
    document:{getElementById:()=>null}, navigator:{}});
  const file = 'js/integracao.js';
  if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file,'utf8'),c);
  return {c, trocar: valor=>{cidadao=valor;}};
}
function executar(c,s) {return vm.runInContext(s,c);}
const row = {id:42,tipo:'APOIO_METRO',status:'PENDENTE',estacao:'Consolação',ponto_encontro:'catraca',descricao:'Acompanhamento',data_hora:'2026-11-19 19:30:00',cidadao:'Ana'};
test('sessao estavel por cidadao sem usar dados pessoais no identificador',()=>{
  const {c,trocar}=ambiente();
  assert.equal(typeof c.buscarSessaoIara,'function');
  const a=c.buscarSessaoIara();
  assert.equal(c.buscarSessaoIara(),a);
  assert.match(a,/^[a-zA-Z0-9_-]{16,64}$/);
  assert.ok(!a.includes('pessoa-a'));
  trocar({id:'pessoa-b'}); assert.notEqual(c.buscarSessaoIara(),a);
  trocar(null); assert.equal(c.buscarSessaoIara(),null);
});
test('payload omite nome e perfil pessoal sem consentimento e nunca envia documentos',()=>{
  const {c}=ambiente();
  assert.equal(typeof c.montarMensagemIara,'function');
  const p=c.montarMensagemIara('oi',false);
  assert.deepEqual(Object.keys(p).sort(),['perfil','session','texto']);
  assert.equal(p.perfil,'nenhum');
  const consentido=c.montarMensagemIara('oi',true);
  assert.equal(consentido.nome,'Ana'); assert.equal(consentido.perfil,'idoso');
  assert.ok(!JSON.stringify(consentido).includes('sigiloso'));
});
test('protocolo usa ID real e ano do banco, sem depender da ordem da consulta',()=>{
  const {c}=ambiente(); assert.equal(typeof c.adaptarChamadoIara,'function');
  const p=c.adaptarChamadoIara(row);
  assert.equal(p.protocolo,'MT-AF-2026-0042'); assert.equal(p.idServidor,42);
  assert.equal(p.situacao,'Pedido recebido'); assert.equal(p.linha,'');
  assert.equal(p.estacao,'Consolação'); assert.equal(p.encontro,'catraca');
});
test('travessia preserva tempos do servidor sem inventar adicional ou abertura',()=>{
  const {c}=ambiente(); assert.equal(typeof c.adaptarChamadoIara,'function');
  const p=c.adaptarChamadoIara({...row,tipo:'TRAVESSIA',status:'ACEITA',tempo_restante:12,tempo_concedido:28,cruzamento:'A x B'});
  assert.equal(p.tempoRestante,12); assert.equal(p.tempoConcedido,28);
  assert.equal(p.statusServidor,'ACEITA'); assert.equal(p.etapas.length,1);
  assert.equal(p.aberturaSimulacao,undefined); assert.equal(p.tempoAdicionalConcedido,undefined);
});
test('deduplica por ID e nao aceita registro sem data ou tipo reconhecido',()=>{
  const {c}=ambiente(); assert.equal(typeof c.normalizarChamadosIara,'function');
  const lista=c.normalizarChamadosIara([row,row,{...row,id:43,tipo:'OUTRO'},{...row,id:44,data_hora:null}]);
  assert.equal(lista.length,1); assert.equal(lista[0].idServidor,42);
});
test('consulta individual desativada nao chama listagem administrativa',async()=>{
  const {c}=ambiente(); let chamadas=0; c.fetch=async()=>{chamadas++;};
  assert.equal(typeof c.consultarPedidosCidadaoIara,'function');
  await c.consultarPedidosCidadaoIara(); assert.equal(chamadas,0);
});
test('falha na API nao apaga o ultimo conjunto de chamados',async()=>{
  const {c}=ambiente(); assert.equal(typeof c.consultarChamadosIara,'function');
  c.fetch=async()=>({ok:true,json:async()=>[row]});
  await c.consultarChamadosIara('APOIO_METRO');
  c.fetch=async()=>{throw Error('offline');};
  await assert.rejects(c.consultarChamadosIara('APOIO_METRO'));
  assert.equal(c.buscarChamadosIara('metro').length,1);
});
test('decisao usa ID original e somente confirma quando servidor responde ok',async()=>{
  const {c}=ambiente(); assert.equal(typeof c.enviarDecisaoIara,'function'); let url,body;
  c.fetch=async(u,o)=>{url=u;body=JSON.parse(o.body);return {ok:true,json:async()=>({ok:true,id:42,status:'APROVADO'})};};
  const p=c.adaptarChamadoIara(row);
  await c.enviarDecisaoIara(p,'APROVADO','Mariana');
  assert.ok(url.endsWith('/api/chamados/42/decisao'));
  assert.equal(body.funcionario,'Mariana'); assert.equal(body.decisao,'APROVADO');
  c.fetch=async()=>({ok:false,status:409,json:async()=>({erro:'Ja decidido'})});
  await assert.rejects(c.enviarDecisaoIara(p,'APROVADO','Mariana'));
  assert.equal(p.situacao,'Pedido recebido');
});
test('resposta nao JSON ou HTTP com erro nao vira sucesso',async()=>{
  const {c}=ambiente(); assert.equal(typeof c.consultarApiIara,'function');
  c.fetch=async()=>({ok:true,json:async()=>{throw Error('HTML');}});
  await assert.rejects(c.consultarApiIara('/api/chat'));
  c.fetch=async()=>({ok:false,status:500,json:async()=>({resposta:'texto'})});
  await assert.rejects(c.consultarApiIara('/api/chat'));
});
class Elemento {
  constructor(){this.children=[];this.listeners={};this.attributes={};this.value='';this.textContent='';this.disabled=false;this.scrollHeight=100;}
  appendChild(n){this.children.push(n);return n;}
  setAttribute(k,v){this.attributes[k]=v;}
  getAttribute(k){return this.attributes[k];}
  addEventListener(k,v){this.listeners[k]=v;}
  querySelectorAll(){return this.children;}
  focus(){}
}
function conversa() {
  const a=ambiente(); const elementos={};
  for(const id of ['aviso-chat','campo-mensagem','formulario-chat','ouvir-mensagem','enviar-mensagem','mensagens','sugestoes-iara','conversa-iara','autorizar-perfil-iara','sugestao-travessia','sugestao-metro','sugestao-zeladoria','sugestao-informacoes']) elementos[id]=new Elemento();
  a.c.document={getElementById:id=>elementos[id]||null,createElement:()=>new Elemento()};
  a.c.buscarPreferenciasAcessibilidade=()=>({vozIara:false});
  a.c.salvarPreferenciasAcessibilidade=()=>{};
  a.c.setInterval=()=>1; a.c.clearInterval=()=>{};
  a.c.consultarApiIara=async()=>({resposta:'Menu real',opcoes:[{rotulo:'Apoio',valor:'2'}]});
  vm.runInContext(fs.readFileSync('js/iara.js','utf8'),a.c);
  return {...a,elementos};
}
test('chat usa resposta real e envia valor da opcao sem redirecionar',async()=>{
  const {c,elementos}=conversa();
  assert.equal(typeof c.enviarMensagemIara,'function');
  await new Promise(resolve=>setImmediate(resolve));
  const opcoes=elementos['sugestoes-iara']; assert.equal(opcoes.children.at(-1).textContent,'Apoio');
  let corpo;
  c.consultarApiIara=async(url,o)=>{corpo=JSON.parse(o.body);return {resposta:'Qual estacao?',opcoes:[]};};
  await opcoes.children.at(-1).listeners.click();
  assert.equal(corpo.texto,'2');
  assert.equal(elementos.mensagens.children.at(-1).children[0].textContent,'Qual estacao?');
});
test('chat bloqueia envio duplicado enquanto aguarda e recupera controles apos erro',async()=>{
  const {c,elementos}=conversa(); assert.equal(typeof c.enviarMensagemIara,'function');
  await new Promise(resolve=>setImmediate(resolve));
  let liberar,numero=0;
  c.consultarApiIara=()=>{numero++;return new Promise((resolve,reject)=>{liberar=reject;});};
  const envio=c.enviarMensagemIara('Preciso de apoio');
  await c.enviarMensagemIara('Preciso de apoio');
  assert.equal(numero,1); assert.equal(elementos['enviar-mensagem'].disabled,true);
  liberar(Error('offline')); await envio;
  assert.equal(elementos['enviar-mensagem'].disabled,false);
  assert.match(elementos['aviso-chat'].textContent,/confirmar|conex/i);
});
test('chat apresenta HTML externo como texto e nao como marcacao executavel',async()=>{
  const {c,elementos}=conversa(); assert.equal(typeof c.enviarMensagemIara,'function');
  await new Promise(resolve=>setImmediate(resolve));
  c.consultarApiIara=async()=>({resposta:'<img src=x onerror=alert(1)>',opcoes:[]});
  await c.enviarMensagemIara('teste');
  assert.equal(elementos.mensagens.children.at(-1).children[0].textContent,'<img src=x onerror=alert(1)>');
});
function carregarFuncao(c,nome) {
  const s=fs.readFileSync('js/administrativo.js','utf8');
  let inicio=s.indexOf('function '+nome+'(');
  if (inicio>=6 && s.slice(inicio-6,inicio)==='async ') inicio-=6;
  assert.ok(inicio>=0,'funcao administrativa ausente: '+nome);
  const fim=s.indexOf('\n}',inicio)+2;
  vm.runInContext(s.slice(inicio,fim),c);
}
test('fila remota respeita estacao, linha e instituicao do operador sem atribuir linha ficticia',()=>{
  const {c}=ambiente();
  c.profissionalAdmin={funcao:'Agente de transporte',orgao:'metro',linha:'Linha 2 - Verde',estacao:'Consolação'};
  c.linhasInstituicoes={metro:['Linha 2 - Verde']}; c.estacoesLinhas={'Linha 2 - Verde':['Consolação']};
  carregarFuncao(c,'chamadoDaEstacaoMetro');
  const p=c.adaptarChamadoIara(row);
  assert.equal(c.chamadoDaEstacaoMetro(p),true);
  assert.equal(c.chamadoDaEstacaoMetro({...p,estacao:'Sé'}),false);
  assert.equal(c.chamadoDaEstacaoMetro({...p,linha:'Linha 1 - Azul'}),false);
  c.profissionalAdmin.orgao='cptm'; assert.equal(c.chamadoDaEstacaoMetro(p),false);
});
test('aceitar chamado remoto delega ao servidor e nao grava estado local',()=>{
  const {c}=ambiente(); const pedido=c.adaptarChamadoIara(row); c.chamadosMetro=[pedido];
  c.chamadoDaEstacaoMetro=()=>true; let decisao; let gravou=false;
  c.decidirChamadoRemotoIara=(p,d)=>{decisao=d;};
  c.registrarEtapaMetro=()=>{gravou=true;}; c.atualizarChamadoMetro=()=>{};
  carregarFuncao(c,'alterarChamadoMetro');
  c.alterarChamadoMetro({currentTarget:{getAttribute:k=>({'data-protocolo':pedido.protocolo,'data-acao-chamado':'aceitar','data-id-servidor':'42'})[k]||null}});
  assert.equal(decisao,'APROVADO'); assert.equal(gravou,false);
});
test('CET apresenta travessia vinda do banco nos cartoes existentes',async()=>{
  const {c}=ambiente();
  c.fetch=async()=>({ok:true,json:async()=>[{...row,tipo:'TRAVESSIA',status:'ACEITA',cruzamento:'Paulista x Augusta',tempo_restante:12,tempo_concedido:28}]});
  await c.consultarChamadosIara('TRAVESSIA');
  c.buscarPedidosOperacionais=()=>[];
  const listas={'lista-pedidos-cet':new Elemento(),'lista-relatos-cet':new Elemento()};
  c.document={getElementById:id=>listas[id]||null,createElement:()=>new Elemento()};
  carregarFuncao(c,'adicionarTextoOperacional');
  carregarFuncao(c,'travessiaLiberadaAplicativo');
  carregarFuncao(c,'exibirPedidosAplicativoCET');
  c.exibirPedidosAplicativoCET();
  const textos=n=>n.textContent+' '+n.children.map(textos).join(' ');
  assert.match(textos(listas['lista-pedidos-cet']),/MT-TR-2026-0042/);
  assert.match(textos(listas['lista-pedidos-cet']),/28/);
});
test('poll CET preserva historico dos pedidos locais quando API retorna lista vazia',async()=>{
 const {c}=ambiente();
 c.profissionalAdmin={funcao:'Operador CET'};c.consultandoPainelIara=false;
 c.buscarChamadosMetro=()=>[{protocolo:'local-preservado'}];
 c.exibirPedidosAplicativoCET=()=>{};c.avisarPainelIara=()=>{};
 let etapas=[];c.sincronizarEtapasTransporte=lista=>{etapas=lista;};
 carregarFuncao(c,'atualizarPainelIara');await c.atualizarPainelIara();
 assert.equal(etapas[0]?.protocolo,'local-preservado');
});
test('troca de conta descarta resposta individual atrasada',async()=>{
 const {c,trocar}=ambiente();executar(c,"configuracaoIara.rotaPedidosCidadao='/api/meus-chamados'");
 const sid=c.buscarSessaoIara();let responder;
 c.fetch=()=>new Promise(resolve=>{responder=()=>resolve({ok:true,json:async()=>({session:sid,chamados:[row]})});});
 const consulta=c.consultarPedidosCidadaoIara();trocar({id:'outra-conta'});responder();await consulta;
 assert.equal(c.buscarPedidosIndividuaisIara().length,0);
});
test('notificacoes utilizam trava de sessao e liberam ao fechar a pagina',async()=>{
 const {c}=conversa();await new Promise(resolve=>setImmediate(resolve));
 let liberar;let consultas=0;let travas=0;
 c.navigator.locks={request:(nome,opcoes,callback)=>{
  travas++;assert.ok(nome.startsWith('iara-notificacoes-web_'));assert.equal(opcoes.ifAvailable,true);
  return callback({});
 }};
 c.consultarNotificacoesIara=async()=>{consultas++;};
 c.iniciarNotificacoesIara();await new Promise(resolve=>setImmediate(resolve));
 c.iniciarNotificacoesIara();assert.equal(travas,1);assert.equal(consultas,1);
 c.pararNotificacoesIara();assert.equal(executar(c,'liberarNotificacoesIara'),null);
});
test('ID do servidor distingue chamado remoto de simulacao com mesmo protocolo',()=>{
 const {c}=ambiente();const remoto=c.adaptarChamadoIara(row);const local={...remoto,fonte:undefined,idServidor:undefined};
 c.chamadosMetro=[local,remoto];c.chamadoDaEstacaoMetro=()=>true;
 let selecionado=null;c.decidirChamadoRemotoIara=p=>{selecionado=p.idServidor;};
 c.registrarEtapaMetro=()=>{};c.atualizarChamadoMetro=()=>{};
 carregarFuncao(c,'alterarChamadoMetro');
 const attrs={'data-protocolo':remoto.protocolo,'data-acao-chamado':'aceitar','data-id-servidor':'42'};
 c.alterarChamadoMetro({currentTarget:{getAttribute:k=>attrs[k]||null}});
 assert.equal(selecionado,42);
});
