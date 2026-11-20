// Executar manualmente: este teste cria um chamado ficticio no Node-RED local.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const session='teste_'+crypto.randomUUID();
 const nome='Teste IARA '+crypto.randomUUID().slice(0,8);
 const base='http://127.0.0.1:1880';
 const request=async(path,options)=>{
  const r=await fetch(base+path,{...options,signal:AbortSignal.timeout(20000),headers:{'Content-Type':'application/json'}});
  const data=await r.json();if(!r.ok)throw Error('HTTP '+r.status);return data;
 };
 const chat=texto=>request('/api/chat',{method:'POST',body:JSON.stringify({session,texto,perfil:'nenhum',nome})});
 const menu=await chat('menu');assert.ok(menu.opcoes.length>0);assert.equal(typeof menu.resposta,'string');
 await chat('2');await chat('Preciso de acompanhamento na catraca da estacao Consolacao.');
 let row;
 for(let i=0;i<20;i++){
  row=(await request('/api/chamados?tipo=APOIO_METRO')).find(p=>p.cidadao===nome);
  if(row)break;await delay(200);
 }
 assert.ok(row,'Pedido ficticio nao encontrado no banco');
 assert.equal(row.status,'PENDENTE');
 const c=vm.createContext({console,fetch,crypto:webcrypto,setTimeout,clearTimeout,AbortController});
 vm.runInContext(fs.readFileSync('js/integracao.js','utf8'),c);
 const pedido=c.adaptarChamadoIara(row);
 const decisao=await c.enviarDecisaoIara(pedido,'APROVADO','Teste de integracao');
 assert.equal(Number(decisao.id),Number(row.id));
 let gravado;
 for(let i=0;i<20;i++){
  gravado=(await request('/api/chamados?tipo=APOIO_METRO')).find(p=>p.id===row.id);
  if(gravado.status==='APROVADO')break;await delay(200);
 }
 assert.equal(gravado.status,'APROVADO');
 const avisos=await request('/api/chat/poll?session='+session);
 assert.ok(avisos.mensagens.some(m=>m.resposta.includes('APROVADO')),'Notificacao real nao recebida');
 assert.equal((await request('/api/chat/poll?session='+session)).mensagens.length,0);
 const repetida=await fetch(base+'/api/chamados/'+row.id+'/decisao',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({decisao:'RECUSADO'})});
 assert.equal(repetida.status,409);
 console.log('PASS API real: menu, opcao, registro SQLite, decisao persistida, notificacao, consumo unico e rejeicao de segunda decisao.');
 console.log('Registro ficticio de teste mantido no banco: '+pedido.protocolo+' (ID '+row.id+').');
})().catch(e=>{console.error(e);process.exitCode=1;});
