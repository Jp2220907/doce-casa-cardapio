const {chromium}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const data={products:[{id:1,name:'Bolo de chocolate',description:'Chocolate e carinho.',price:50,category:'Bolos',image:'🍰',active:true},{id:2,name:'Bolo de morango com nome bastante comprido para conferir o enquadramento',description:'Morango.',price:60,category:'Bolos',image:'🍓',active:false}],settings:{currency:'BRL',language:'pt-BR'}};
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  const file=path.join(root,['/admin','/cardapio'].includes(pathname)?'index.html':pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);return res.end()}
  res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html');
  res.end(fs.readFileSync(file));
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    const origin=`http://127.0.0.1:${server.address().port}`;
    const context=await browser.newContext();
    await context.route('https://**/*',r=>r.abort());
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    let delay=1500,calls=0,saves=0;
    await page.route('**/api/catalog*',async r=>{
      calls++;
      if(r.request().method()==='PUT'){saves++;Object.assign(data,r.request().postDataJSON())}
      await new Promise(resolve=>setTimeout(resolve,delay));
      await r.fulfill({json:{...data,ok:true}});
    });
    await page.goto(origin+'/cardapio');
    assert.equal(await page.locator('.catalog-loading').count(),1);
    assert.equal(await page.locator('.product').count(),0);
    await page.locator('.product').waitFor();
    const start=Date.now();
    await page.reload();
    await page.locator('.product').waitFor();
    const cachedMs=Date.now()-start;
    assert.ok(cachedMs<1200,`Cached render took ${cachedMs}ms`);
    await page.waitForTimeout(1600);
    await page.getByRole('button',{name:'Adicionar',exact:false}).click();
    await page.locator('#cartBtn').click();
    assert.equal(await page.locator('[role=dialog]').count(),1);
    await page.keyboard.press('Escape');
    const before=calls;
    await page.goto(origin+'/admin');
    assert.equal(await page.locator('#loginForm').count(),1);
    assert.equal(calls,before,'Login should not wait for catalog');
    delay=0;
    await page.evaluate(()=>sessionStorage.setItem('doceCasaAdmin','ok'));
    await page.reload();
    await page.locator('.admin-workspace').waitFor();
    for(const width of [320,375,768,1280]){
      await page.setViewportSize({width,height:900});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);
      assert.ok(await page.locator('[data-active]').first().evaluate(el=>el.scrollWidth<=el.clientWidth),`Button text overflow ${width}`);
    }
    await page.setViewportSize({width:375,height:900});
    await page.locator('summary').click();
    assert.ok(await page.locator('#settingsForm').isVisible());
    await page.locator('#settingsForm button').click();
    await page.waitForFunction(()=>!actionBusy);
    await page.locator('[data-edit]').first().click();
    await page.locator('#productForm [name=name]').fill('Bolo de teste');
    await page.locator('#productForm .primary').click();
    await page.waitForFunction(()=>!actionBusy);
    assert.ok(await page.locator('.admin-info').first().innerText().then(t=>t.includes('Bolo de teste')));
    await page.locator('[data-active]').first().click();
    await page.waitForFunction(()=>!actionBusy);
    assert.equal(data.products[0].active,false);
    assert.equal(saves,3);
    await page.screenshot({path:path.join(root,'admin-mobile-preview.png'),fullPage:true});
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({result:'PASS',cachedRenderMs:cachedMs,simulatedCatalogDelayMs:1500,widths:[320,375,768,1280],mockSaves:saves,consoleErrors:errors}));
    await context.close();
  }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});

