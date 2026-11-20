/*
  verificação manual da api real: node tests/api-local.cjs.
  este arquivo precisa do node-red local funcionando e cria um chamado fictício no banco.
  não faz parte do site: confirma o caminho chat, gravação, decisão e notificação.
*/
// Executar manualmente: este teste cria um chamado ficticio no Node-RED local.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 // gera uma sessão exclusiva para não misturar a verificação com a conversa de um cidadão
 const session='teste_'+crypto.randomUUID();
 // um nome fictício exclusivo permite localizar somente o registro criado por esta execução
 const nome='Teste IARA '+crypto.randomUUID().slice(0,8);
 const base='http://127.0.0.1:1880';
 // esta função auxiliar envia uma requisição real e confere o resultado http
 const request=async(path,options)=>{
  // aguarda a resposta por no máximo vinte segundos, evitando que o teste fique preso indefinidamente
  const r=await fetch(base+path,{...options,signal:AbortSignal.timeout(20000),headers:{'Content-Type':'application/json'}});
  const data=await r.json();if(!r.ok)throw Error('HTTP '+r.status);return data;
 };
 const chat=texto=>request('/api/chat',{method:'POST',body:JSON.stringify({session,texto,perfil:'nenhum',nome})});
 // confere que o servidor entregou texto e opções para iniciar a conversa
 const menu=await chat('menu');assert.ok(menu.opcoes.length>0);assert.equal(typeof menu.resposta,'string');
 await chat('2');await chat('Preciso de acompanhamento na catraca da estacao Consolacao.');
 let row;
 // consulta novamente por um período curto porque a gravação pode aparecer depois da resposta do chat
 for(let i=0;i<20;i++){
  row=(await request('/api/chamados?tipo=APOIO_METRO')).find(p=>p.cidadao===nome);
  if(row)break;await delay(200);
 }
 assert.ok(row,'Pedido ficticio nao encontrado no banco');
 // verifica que o pedido foi registrado antes de tentar aprová-lo
 assert.equal(row.status,'PENDENTE');
 const c=vm.createContext({console,fetch,crypto:webcrypto,setTimeout,clearTimeout,AbortController});
 // carrega a função real do front-end para testar a decisão pelo mesmo caminho usado pelo painel
 vm.runInContext(fs.readFileSync('js/integracao.js','utf8'),c);
 const pedido=c.adaptarChamadoIara(row);
 // aprova apenas o chamado fictício identificado acima, utilizando seu id original
 const decisao=await c.enviarDecisaoIara(pedido,'APROVADO','Teste de integracao');
 assert.equal(Number(decisao.id),Number(row.id));
 let gravado;
 // consulta novamente por um período curto porque a gravação pode aparecer depois da resposta do chat
 for(let i=0;i<20;i++){
  gravado=(await request('/api/chamados?tipo=APOIO_METRO')).find(p=>p.id===row.id);
  if(gravado.status==='APROVADO')break;await delay(200);
 }
 // confere na listagem do banco que a alteração realmente foi persistida
 assert.equal(gravado.status,'APROVADO');
 // consulta as notificações da mesma sessão usada para criar o chamado de teste
 const avisos=await request('/api/chat/poll?session='+session);
 assert.ok(avisos.mensagens.some(m=>m.resposta.includes('APROVADO')),'Notificacao real nao recebida');
 // uma segunda consulta não deve devolver a mesma notificação já consumida
 assert.equal((await request('/api/chat/poll?session='+session)).mensagens.length,0);
 const repetida=await fetch(base+'/api/chamados/'+row.id+'/decisao',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({decisao:'RECUSADO'})});
 // 409 informa conflito: o servidor deve impedir que um pedido já decidido receba outra decisão
 assert.equal(repetida.status,409);
 console.log('PASS API real: menu, opcao, registro SQLite, decisao persistida, notificacao, consumo unico e rejeicao de segunda decisao.');
 console.log('Registro ficticio de teste mantido no banco: '+pedido.protocolo+' (ID '+row.id+').');
})().catch(e=>{console.error(e);process.exitCode=1;});
