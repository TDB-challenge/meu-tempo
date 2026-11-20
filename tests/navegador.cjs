/*
  verificação da interface no chrome: node tests/navegador.cjs.
  usa somente recursos nativos do node e o chrome instalado para abrir páginas e conferir resultados.
  o protocolo de depuração do chrome permite enviar comandos sem acrescentar bibliotecas ao projeto.
  os dados fictícios ficam no perfil temporário; o node-red local precisa estar disponível.
*/
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const http=require('node:http');
// spawn inicia o chrome de teste sem instalar ferramentas adicionais de automação
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 let server,chrome,ws;
 // cria um perfil temporário para não usar as contas, sessões e preferências do navegador pessoal
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'meu-tempo-chrome-'));
 try {
  // serve apenas os arquivos estáticos para o teste; não implementa um backend da aplicação
  server=http.createServer((req,res)=>{
   const relative=decodeURIComponent(req.url.split('?')[0]);
   const file=path.resolve('.','.'+relative);
   // impede que o servidor de teste leia caminhos fora da pasta do projeto
   if(!file.startsWith(process.cwd()+path.sep)){res.writeHead(403).end();return;}
   fs.readFile(file,(err,body)=>{
    if(err){res.writeHead(404).end();return;}
    const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.mp3':'audio/mpeg'};
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(body);
   });
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(5500,'127.0.0.1',resolve);}).catch(async e=>{
   // se a porta já estiver ocupada, tenta aproveitar o servidor local existente; outros erros encerram o teste
   if(e.code!=='EADDRINUSE')throw e;
   server=null;
   const r=await fetch('http://localhost:5500/js/integracao.js');
   assert.ok(r.ok,'A porta 5500 esta em uso por outro projeto.');
   console.log('Usando servidor local existente na porta 5500.');
  });
  chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
  // o chrome grava neste arquivo a porta de depuração escolhida automaticamente
  const portFile=path.join(profile,'DevToolsActivePort');
  for(let i=0;i<100&&!fs.existsSync(portFile);i++)await delay(100);
  assert.ok(fs.existsSync(portFile),'Chrome nao iniciou a depuracao.');
  const port=fs.readFileSync(portFile,'utf8').split('\n')[0];
  // consulta as abas do chrome criado para descobrir como controlar a página de teste
  const tabs=await (await fetch('http://127.0.0.1:'+port+'/json')).json();
  // websocket mantém a comunicação com a depuração do chrome durante as verificações
  ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
  // cada comando recebe um id; pending relaciona respostas a comandos; errors guarda erros da página
  let id=0;const pending=new Map();const errors=[];
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+(m.params.exceptionDetails.exception?.description||''));};
  const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
  // executa uma expressão na página para clicar em controles e verificar os elementos apresentados
  const evaluate=async(expression)=>{
   const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
   if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);
   return r.result.value;
  };
  // habilita os eventos de execução javascript e os comandos de navegação da página
  await send('Runtime.enable'); await send('Page.enable');
  await send('Page.navigate',{url:'http://localhost:5500/paginas/index.html'});await delay(700);
  await evaluate(`localStorage.setItem('meu-tempo-cidadaos',JSON.stringify([{id:'teste-navegador',nome:'Teste local',categoria:'geral',preferencias:{}}]));sessionStorage.setItem('cidadao-sessao',JSON.stringify({id:'teste-navegador'}));`);
  await send('Page.navigate',{url:'http://localhost:5500/paginas/app/iara.html'});
  let ready=false;
  for(let i=0;i<100;i++){await delay(150);ready=await evaluate(`document.querySelectorAll('#sugestoes-iara button').length>0`);if(ready)break;}
  assert.ok(ready,'Menu real nao carregou: '+await evaluate(`document.getElementById('aviso-chat')?.textContent`));
  // confere que compartilhar nome e categoria não começa autorizado automaticamente
  assert.equal(await evaluate(`document.getElementById('autorizar-perfil-iara').checked`),false);
  const count=await evaluate(`document.querySelectorAll('#mensagens .mensagem').length`);
  await evaluate(`document.querySelectorAll('#sugestoes-iara button')[1].click()`);
  for(let i=0;i<100;i++){await delay(100);if(await evaluate(`!enviandoIara`))break;}
  assert.ok((await evaluate(`document.querySelectorAll('#mensagens .mensagem').length`))>count);
  assert.ok((await evaluate(`document.querySelector('#mensagens .mensagem:last-child').textContent`)).includes('estação'));
  assert.equal(await evaluate(`location.pathname`),'/paginas/app/iara.html');
  console.log('PASS navegador: menu real, opcoes clicaveis, resposta real e consentimento inicialmente desmarcado.');
  const sid=await evaluate('buscarSessaoIara()');
  await send('Page.navigate',{url:'http://localhost:5500/paginas/app/solicitacoes.html'});await delay(600);
  assert.ok((await evaluate(`document.getElementById('aviso-pedidos-iara').textContent`)).includes('acompanhamento individual'));
  assert.equal(await evaluate('buscarSessaoIara()'),sid);
  console.log('PASS navegador: sessao estavel e acompanhamento individual sem acesso a listagem administrativa.');
  await evaluate(`sessionStorage.setItem('admin-sessao',JSON.stringify({nome:'Teste operador',funcao:'Agente de transporte',orgao:'metro',linha:'Linha 2 - Verde',estacao:'Consolação'}))`);
  await send('Page.navigate',{url:'http://localhost:5500/paginas/admin/metro.html'});await delay(1400);
  assert.ok((await evaluate(`document.getElementById('aviso-integracao-iara')?.textContent||''`)).includes('conectada'));
  console.log('PASS navegador: painel metro conectado a API.');
  await evaluate(`sessionStorage.setItem('admin-sessao',JSON.stringify({nome:'Teste CET',funcao:'Operador CET',orgao:'cet'}))`);
  await send('Page.navigate',{url:'http://localhost:5500/paginas/admin/cet.html'});await delay(1400);
  assert.ok((await evaluate(`document.getElementById('aviso-integracao-iara')?.textContent||''`)).includes('conectada'));
  console.log('PASS navegador: painel CET conectado a API.');
  await evaluate(`sessionStorage.setItem('admin-sessao',JSON.stringify({nome:'Teste coordenacao',funcao:'Coordenador',orgao:'metro'}))`);
  // repete a mesma verificação nos dois painéis de consolidação
  for(const pagina of ['coordenacao','relatorios']){
   await send('Page.navigate',{url:'http://localhost:5500/paginas/admin/'+pagina+'.html'});await delay(1400);
   assert.ok((await evaluate(`document.getElementById('aviso-integracao-iara')?.textContent||''`)).includes('conectada'));
   console.log('PASS navegador: painel '+pagina+' conectado a API.');
  }
  // a lista deve permanecer vazia: nenhuma página testada pode lançar erro javascript
  assert.deepEqual(errors,[],'Erros JavaScript no navegador');
  console.log('PASS navegador: nenhum erro JavaScript nas paginas verificadas.');
  await send('Browser.close').catch(()=>{});
 // a limpeza é executada mesmo quando uma verificação falha
 } finally {
  if(ws)ws.close();if(chrome)chrome.kill();if(server)await new Promise(r=>server.close(r));
  console.log('Perfil temporario de teste: '+profile);
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
