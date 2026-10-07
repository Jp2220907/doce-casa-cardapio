const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/client.js'), 'utf8').replace("window.addEventListener('popstate',route);boot();", '');
function setup() {
  const button = {disabled:false, textContent:'Finalizar', setAttribute(){}, removeAttribute(){}};
  const storage = new Map();
  const context = vm.createContext({
    Intl, URLSearchParams, console, setTimeout, clearTimeout,
    localStorage:{getItem:key=>storage.get(key)??null, setItem:(key,value)=>storage.set(key,value)},
    sessionStorage:{getItem:()=> 'ok'},
    document:{querySelector:()=>button, querySelectorAll:()=>[button]},
    window:{}, location:{hostname:'localhost',pathname:'/cardapio'}
  });
  vm.runInContext(source, context);
  vm.runInContext("cartModal = message => { globalThis.review = message; }; openWhatsApp = (message,clear) => { globalThis.sent = message; if(clear) cart=[]; };", context);
  return {context,button,run:code=>vm.runInContext(code,context)};
}
(async () => {
  {
    const {context,run}=setup();
    run("cart=[{id:1,price:10,qty:2},{id:2,price:5,qty:1}];");
    context.fetch=async()=>({ok:true,json:async()=>({products:[{id:1,name:'Cake',price:12,active:true}],settings:{currency:'BRL'}})});
    await run('whatsappOrder()');
    assert.equal(run('cart.length'),1);
    assert.equal(run('cart[0].price'),12);
    assert.equal(run('cart[0].qty'),2);
    assert.equal(context.sent,undefined);
    assert.ok(context.review);
    await run('whatsappOrder()');
    assert.ok(context.sent.includes('Quantidade: 2'));
    assert.equal(run('cart.length'),0);
  }
  {
    const {context,run}=setup();
    run('cart=[{id:1,price:10,qty:1}];');
    context.fetch=async()=>{throw Error('offline');};
    await run('whatsappOrder()');
    assert.equal(run('cart.length'),1);
    assert.equal(context.sent,undefined);
    assert.ok(context.review.includes('Não foi possível'));
    context.fetch=async()=>({ok:true,json:async()=>({products:[{id:1,name:'Cake',price:10,active:false}]})});
    await run('whatsappOrder()');
    assert.equal(run('cart.length'),0);
    assert.equal(context.sent,undefined);
  }
  {
    const {context,run}=setup();
    run("cart=[{id:1,price:10,qty:1}];settings.currency='BRL';");
    context.fetch=async()=>({ok:true,json:async()=>({products:[{id:1,name:'Cake',price:10,active:true}],settings:{currency:'EUR'}})});
    await run('whatsappOrder()');
    assert.equal(context.sent,undefined);
    assert.equal(run('settings.currency'),'EUR');
  }
  {
    const {context,button,run}=setup();
    let resolve, calls=0;
    context.task=()=>{calls++;return new Promise(done=>resolve=done);};
    const first=run("exclusiveAction(document.querySelector('button'), 'Salvando…', task)");
    await run("exclusiveAction(document.querySelector('button'), 'Salvando…', task)");
    assert.equal(calls,1);
    assert.equal(button.disabled,true);
    assert.equal(button.textContent,'Salvando…');
    resolve(); await first;
    assert.equal(button.disabled,false);
    assert.equal(button.textContent,'Finalizar');
    context.task=async()=>{throw Error('failed');};
    await assert.rejects(run("exclusiveAction(document.querySelector('button'), 'Salvando…', task)"));
    assert.equal(button.disabled,false);
    assert.equal(run('actionBusy'),false);
  }
  for (const language of ['pt-BR','en-GB','es-ES','fr-FR','de-DE','it-IT']) {
    const {context,run}=setup();
    run(`viewLanguage=${JSON.stringify(language)};cart=[{id:1,price:10,qty:1}];`);
    context.fetch=async()=>({ok:true,json:async()=>({products:[{id:1,name:'Cake',price:10,active:true}]})});
    await run('whatsappOrder()');
    assert.ok(context.sent.includes(run('ct(0)')));
    assert.ok(context.sent.includes(run('ct(5)')));
    assert.equal(run('checkoutText[viewLanguage].length'),19);
    assert.ok(!context.sent.includes('undefined'));
  }
  {
    const {context,run}=setup();
    run("products=[{id:9,name:'Bolo de chocolate',description:'',price:10,active:true}];viewLanguage='en-GB';");
    context.fetch=async url=>({ok:true,json:async()=>({name:'Chocolate Cake'})});
    await run("translateProductNames('en-GB')");
    assert.equal(run("productText(products[0],'name')"),'Chocolate Cake');
    assert.equal(run("JSON.parse(localStorage.getItem(NAME_TRANSLATIONS))['9:pt-BR:en-GB:Bolo de chocolate']"),'Chocolate Cake');
    run("products[0].translations={'en-GB':{name:'Bolo de chocolate'},'pt-BR':{name:'Bolo de chocolate'}};");
    assert.equal(run("productSourceLanguage(products[0])"),'pt-BR');
    assert.equal(run("productText(products[0],'name')"),'Chocolate Cake');
  }
  console.log('PASS: price/availability/currency review, offline preservation, double-click guard, retry and six WhatsApp languages.');
})().catch(error=>{console.error(error);process.exitCode=1;});

