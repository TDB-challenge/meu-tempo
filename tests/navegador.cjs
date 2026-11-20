const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const http=require('node:http');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 let server,chrome,ws;
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'meu-tempo-chrome-'));
 try {
  server=http.createServer((req,res)=>{
   const relative=decodeURIComponent(req.url.split('?')[0]);
   const file=path.resolve('.','.'+relative);
   if(!file.startsWith(process.cwd()+path.sep)){res.writeHead(403).end();return;}
   fs.readFile(file,(err,body)=>{
    if(err){res.writeHead(404).end();return;}
    const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.mp3':'audio/mpeg'};
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(body);
   });
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(5500,'127.0.0.1',resolve);}).catch(async e=>{
   if(e.code!=='EADDRINUSE')throw e;
   server=null;
   const r=await fetch('http://localhost:5500/js/integracao.js');
   assert.ok(r.ok,'A porta 5500 esta em uso por outro projeto.');
   console.log('Usando servidor local existente na porta 5500.');
  });
  chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
  const portFile=path.join(profile,'DevToolsActivePort');
  for(let i=0;i<100&&!fs.existsSync(portFile);i++)await delay(100);
  assert.ok(fs.existsSync(portFile),'Chrome nao iniciou a depuracao.');
  const port=fs.readFileSync(portFile,'utf8').split('\n')[0];
  const tabs=await (await fetch('http://127.0.0.1:'+port+'/json')).json();
  ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
  let id=0;const pending=new Map();const errors=[];
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+(m.params.exceptionDetails.exception?.description||''));};
  const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
  const evaluate=async(expression)=>{
   const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
   if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);
   return r.result.value;
  };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Page.navigate',{url:'http://localhost:5500/paginas/index.html'});await delay(700);
  await evaluate(`localStorage.setItem('meu-tempo-cidadaos',JSON.stringify([{id:'teste-navegador',nome:'Teste local',categoria:'geral',preferencias:{}}]));sessionStorage.setItem('cidadao-sessao',JSON.stringify({id:'teste-navegador'}));`);
  await send('Page.navigate',{url:'http://localhost:5500/paginas/app/iara.html'});
  let ready=false;
  for(let i=0;i<100;i++){await delay(150);ready=await evaluate(`document.querySelectorAll('#sugestoes-iara button').length>0`);if(ready)break;}
  assert.ok(ready,'Menu real nao carregou: '+await evaluate(`document.getElementById('aviso-chat')?.textContent`));
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
  for(const pagina of ['coordenacao','relatorios']){
   await send('Page.navigate',{url:'http://localhost:5500/paginas/admin/'+pagina+'.html'});await delay(1400);
   assert.ok((await evaluate(`document.getElementById('aviso-integracao-iara')?.textContent||''`)).includes('conectada'));
   console.log('PASS navegador: painel '+pagina+' conectado a API.');
  }
  assert.deepEqual(errors,[],'Erros JavaScript no navegador');
  console.log('PASS navegador: nenhum erro JavaScript nas paginas verificadas.');
  await send('Browser.close').catch(()=>{});
 } finally {
  if(ws)ws.close();if(chrome)chrome.kill();if(server)await new Promise(r=>server.close(r));
  console.log('Perfil temporario de teste: '+profile);
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
