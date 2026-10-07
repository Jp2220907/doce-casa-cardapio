const seed=[
  {id:1,name:'Bolo de chocolate',description:'Massa fofinha, recheio cremoso e cobertura de ganache.',price:50,category:'Bolos',image:'🍫',active:true},
  {id:2,name:'Bolo de morango',description:'Massa branca, creme suave e morangos frescos.',price:60,category:'Bolos',image:'🍓',active:true},
  {id:3,name:'Bolo de cenoura',description:'Clássico bolo caseiro com cobertura de chocolate.',price:42,category:'Bolos',image:'🥕',active:true},
  {id:4,name:'Cupcake especial',description:'Unidade decorada com brigadeiro e confeitos.',price:9.5,category:'Doces',image:'🧁',active:true},
  {id:5,name:'Brigadeiro gourmet',description:'Caixinha com 6 unidades, sabores sortidos.',price:24,category:'Doces',image:'🍬',active:true}
];

const KEY='doceCasaProducts', CART='doceCasaCart', AUTH='doceCasaAdmin', SETTINGS='doceCasaSettings', VISITOR_LANGUAGE='doceCasaVisitorLanguage', NAME_TRANSLATIONS='doceCasaNameTranslations';
const whatsapp='5573988578330';
const currencyOptions={BRL:'Real brasileiro (R$)',EUR:'Euro (€)',USD:'Dólar americano (US$)',GBP:'Libra esterlina (£)',JPY:'Iene japonês (¥)'};
const languageOptions={'pt-BR':'Português (Brasil)','en-GB':'English (United Kingdom)','es-ES':'Español','fr-FR':'Français','de-DE':'Deutsch','it-IT':'Italiano'};
const translations={
  'pt-BR':{eyebrow:'CARDÁPIO DIGITAL',hero1:'Bolos que viram',hero2:'memórias.',heroDesc:'Escolha seus favoritos e envie o pedido direto pelo WhatsApp.',made:'FEITO HOJE',choose:'Escolha seus favoritos',cart:'Carrinho',custom:'Peça seu bolo personalizado',customSub:'Conte sua ideia e receba um orçamento pelo WhatsApp',add:'Adicionar',empty:'Nenhum produto disponível nesta categoria.',order:'SEU PEDIDO',review:'Confira seu carrinho',emptyCart:'Seu carrinho está vazio.',total:'Total do pedido',finish:'Finalizar pelo WhatsApp →',hint:'O pagamento, entrega e horário serão combinados diretamente pelo WhatsApp.',customSmall:'BOLO PERSONALIZADO',customTitle:'Conte sua ideia',customHint:'Descreva o sabor, tamanho, recheio, decoração e qualquer detalhe importante.',customDescription:'Como você imagina o bolo?',customDate:'Para quando você precisa?',sendIdea:'Enviar ideia pelo WhatsApp →',datePlaceholder:'Ex.: sábado, 20 de abril',descriptionPlaceholder:'Ex.: Bolo de chocolate, 2 kg, recheio de brigadeiro com morango, decoração rosa e dourado...'},
  'en-GB':{eyebrow:'DIGITAL MENU',hero1:'Cakes that become',hero2:'memories.',heroDesc:'Choose your favourites and send your order directly via WhatsApp.',made:'MADE TODAY',choose:'Choose your favourites',cart:'Basket',custom:'Request your custom cake',customSub:'Tell us your idea and receive a quote via WhatsApp',add:'Add',empty:'No products available in this category.',order:'YOUR ORDER',review:'Review your basket',emptyCart:'Your basket is empty.',total:'Order total',finish:'Order via WhatsApp →',hint:'Payment, delivery and collection time will be arranged directly via WhatsApp.',customSmall:'CUSTOM CAKE',customTitle:'Tell us your idea',customHint:'Describe the flavour, size, filling, decoration and any important detail.',customDescription:'How would you like your cake?',customDate:'When do you need it?',sendIdea:'Send idea via WhatsApp →',datePlaceholder:'E.g. Saturday, 20 April',descriptionPlaceholder:'E.g. Chocolate cake, 2 kg, brigadeiro and strawberry filling, pink and gold decoration...'},
  'es-ES':{eyebrow:'MENÚ DIGITAL',hero1:'Tartas que se vuelven',hero2:'recuerdos.',heroDesc:'Elige tus favoritos y envía el pedido directamente por WhatsApp.',made:'HECHO HOY',choose:'Elige tus favoritos',cart:'Carrito',custom:'Pide tu tarta personalizada',customSub:'Cuéntanos tu idea y recibe un presupuesto por WhatsApp',add:'Añadir',empty:'No hay productos disponibles en esta categoría.',order:'TU PEDIDO',review:'Revisa tu carrito',emptyCart:'Tu carrito está vacío.',total:'Total del pedido',finish:'Finalizar por WhatsApp →',hint:'El pago, la entrega y el horario se acordarán directamente por WhatsApp.',customSmall:'TARTA PERSONALIZADA',customTitle:'Cuéntanos tu idea',customHint:'Describe el sabor, tamaño, relleno, decoración y cualquier detalle importante.',customDescription:'¿Cómo imaginas la tarta?',customDate:'¿Para cuándo la necesitas?',sendIdea:'Enviar idea por WhatsApp →',datePlaceholder:'Ej.: sábado, 20 de abril',descriptionPlaceholder:'Ej.: Tarta de chocolate, 2 kg, relleno de brigadeiro y fresa, decoración rosa y dorada...'},
  'fr-FR':{eyebrow:'MENU DIGITAL',hero1:'Des gâteaux qui deviennent',hero2:'des souvenirs.',heroDesc:'Choisissez vos favoris et envoyez votre commande directement par WhatsApp.',made:"PRÉPARÉ AUJOURD'HUI",choose:'Choisissez vos favoris',cart:'Panier',custom:'Demandez votre gâteau personnalisé',customSub:'Partagez votre idée et recevez un devis par WhatsApp',add:'Ajouter',empty:'Aucun produit disponible dans cette catégorie.',order:'VOTRE COMMANDE',review:'Vérifiez votre panier',emptyCart:'Votre panier est vide.',total:'Total de la commande',finish:'Commander par WhatsApp →',hint:'Le paiement, la livraison et l’horaire seront convenus directement par WhatsApp.',customSmall:'GÂTEAU PERSONNALISÉ',customTitle:'Partagez votre idée',customHint:'Décrivez la saveur, la taille, la garniture, la décoration et tout détail important.',customDescription:'Comment imaginez-vous le gâteau ?',customDate:'Pour quelle date ?',sendIdea:'Envoyer par WhatsApp →',datePlaceholder:'Ex. samedi 20 avril',descriptionPlaceholder:'Ex. Gâteau au chocolat, 2 kg, garniture brigadeiro et fraise, décoration rose et dorée...'},
  'de-DE':{eyebrow:'DIGITALE SPEISEKARTE',hero1:'Kuchen, die zu',hero2:'Erinnerungen werden.',heroDesc:'Wählen Sie Ihre Favoriten und senden Sie die Bestellung direkt über WhatsApp.',made:'HEUTE GEMACHT',choose:'Favoriten auswählen',cart:'Warenkorb',custom:'Individuelle Torte anfragen',customSub:'Erzählen Sie uns Ihre Idee und erhalten Sie ein Angebot per WhatsApp',add:'Hinzufügen',empty:'In dieser Kategorie sind keine Produkte verfügbar.',order:'IHRE BESTELLUNG',review:'Warenkorb prüfen',emptyCart:'Ihr Warenkorb ist leer.',total:'Bestellsumme',finish:'Über WhatsApp bestellen →',hint:'Zahlung, Lieferung und Abholzeit werden direkt über WhatsApp vereinbart.',customSmall:'INDIVIDUELLE TORTE',customTitle:'Erzählen Sie uns Ihre Idee',customHint:'Beschreiben Sie Geschmack, Größe, Füllung, Dekoration und wichtige Details.',customDescription:'Wie soll Ihre Torte aussehen?',customDate:'Für wann benötigen Sie sie?',sendIdea:'Idee über WhatsApp senden →',datePlaceholder:'z. B. Samstag, 20. April',descriptionPlaceholder:'z. B. Schokoladentorte, 2 kg, Brigadeiro-Erdbeer-Füllung, rosa-goldene Dekoration...'},
  'it-IT':{eyebrow:'MENU DIGITALE',hero1:'Torte che diventano',hero2:'ricordi.',heroDesc:'Scegli i tuoi preferiti e invia l’ordine direttamente tramite WhatsApp.',made:'FATTO OGGI',choose:'Scegli i tuoi preferiti',cart:'Carrello',custom:'Richiedi la tua torta personalizzata',customSub:'Raccontaci la tua idea e ricevi un preventivo su WhatsApp',add:'Aggiungi',empty:'Nessun prodotto disponibile in questa categoria.',order:'IL TUO ORDINE',review:'Controlla il carrello',emptyCart:'Il carrello è vuoto.',total:'Totale ordine',finish:'Ordina su WhatsApp →',hint:'Pagamento, consegna e orario saranno concordati direttamente su WhatsApp.',customSmall:'TORTA PERSONALIZZATA',customTitle:'Raccontaci la tua idea',customHint:'Descrivi gusto, dimensione, ripieno, decorazione e ogni dettaglio importante.',customDescription:'Come immagini la torta?',customDate:'Per quando ti serve?',sendIdea:'Invia idea su WhatsApp →',datePlaceholder:'Es. sabato 20 aprile',descriptionPlaceholder:'Es. Torta al cioccolato, 2 kg, ripieno brigadeiro e fragola, decorazione rosa e oro...'}
};

const checkoutText = {
  'pt-BR': ['Olá, Doce Casa! 😊','Gostaria de fazer este pedido:','Quantidade','Preço unitário','Subtotal','Podem me informar as opções de entrega/retirada e formas de pagamento?','Gostaria de encomendar um bolo personalizado.','Minha ideia','Data desejada','Ainda vou combinar','Podem me enviar as opções de preço e disponibilidade?','Confira e envie a mensagem no WhatsApp.','Conferindo…','O carrinho foi atualizado com os preços e a disponibilidade atuais. Confira antes de continuar.','Não foi possível conferir o catálogo. Tente novamente.','Fechar janela','Remover item','Diminuir quantidade','Aumentar quantidade'],
  'en-GB': ['Hello, Doce Casa! 😊','I would like to place this order:','Quantity','Unit price','Subtotal','Could you tell me the delivery/collection options and payment methods?','I would like to order a custom cake.','My idea','Requested date','To be arranged','Could you send me the prices and availability?','Review and send the message in WhatsApp.','Checking…','Your basket has been updated with current prices and availability. Please review it before continuing.','Unable to check the menu. Please try again.','Close dialog','Remove item','Decrease quantity','Increase quantity'],
  'es-ES': ['¡Hola, Doce Casa! 😊','Me gustaría hacer este pedido:','Cantidad','Precio unitario','Subtotal','¿Podrían indicarme las opciones de entrega/recogida y los métodos de pago?','Me gustaría encargar una tarta personalizada.','Mi idea','Fecha deseada','Por acordar','¿Podrían enviarme los precios y la disponibilidad?','Revisa y envía el mensaje en WhatsApp.','Comprobando…','El carrito se ha actualizado con los precios y la disponibilidad actuales. Revísalo antes de continuar.','No se pudo comprobar el menú. Inténtalo de nuevo.','Cerrar ventana','Eliminar artículo','Reducir cantidad','Aumentar cantidad'],
  'fr-FR': ['Bonjour, Doce Casa ! 😊','Je souhaite passer cette commande :','Quantité','Prix unitaire','Sous-total','Pouvez-vous préciser les options de livraison/retrait et les moyens de paiement ?','Je souhaite commander un gâteau personnalisé.','Mon idée','Date souhaitée','À convenir','Pouvez-vous m’envoyer les prix et les disponibilités ?','Vérifiez et envoyez le message dans WhatsApp.','Vérification…','Le panier a été actualisé avec les prix et les disponibilités actuels. Vérifiez-le avant de continuer.','Impossible de vérifier le menu. Réessayez.','Fermer la fenêtre','Supprimer cet article','Diminuer la quantité','Augmenter la quantité'],
  'de-DE': ['Hallo, Doce Casa! 😊','Ich möchte Folgendes bestellen:','Menge','Stückpreis','Zwischensumme','Welche Liefer-/Abholmöglichkeiten und Zahlungsarten gibt es?','Ich möchte eine individuelle Torte bestellen.','Meine Idee','Gewünschtes Datum','Noch zu vereinbaren','Könnten Sie mir Preise und Verfügbarkeit mitteilen?','Prüfen und senden Sie die Nachricht in WhatsApp.','Wird geprüft…','Der Warenkorb wurde mit aktuellen Preisen und Verfügbarkeiten aktualisiert. Bitte vor dem Fortfahren prüfen.','Die Speisekarte konnte nicht geprüft werden. Bitte erneut versuchen.','Dialog schließen','Artikel entfernen','Menge verringern','Menge erhöhen'],
  'it-IT': ['Ciao, Doce Casa! 😊','Vorrei effettuare questo ordine:','Quantità','Prezzo unitario','Subtotale','Potete indicarmi le opzioni di consegna/ritiro e i metodi di pagamento?','Vorrei ordinare una torta personalizzata.','La mia idea','Data desiderata','Da concordare','Potete inviarmi prezzi e disponibilità?','Controlla e invia il messaggio su WhatsApp.','Verifica…','Il carrello è stato aggiornato con prezzi e disponibilità attuali. Controllalo prima di continuare.','Impossibile verificare il menu. Riprova.','Chiudi finestra','Rimuovi articolo','Riduci quantità','Aumenta quantità']
};
const ct = index => (checkoutText[viewLanguage] || checkoutText['pt-BR'])[index];
let actionBusy = false, modalOpener = null;
async function exclusiveAction(button, label, task) {
  if (actionBusy) return;
  actionBusy = true;
  const controls = [...document.querySelectorAll('button, input, select, textarea')];
  const disabled = controls.map(control => control.disabled);
  const original = button?.textContent;
  // Read form data synchronously before disabling its fields.
  try {
    const pending = task();
    controls.forEach(control => { control.disabled = true; });
    if (button) { button.textContent = label; button.setAttribute('aria-busy', 'true'); }
    await pending;
  } finally {
    controls.forEach((control, index) => { control.disabled = disabled[index]; });
    if (button) { button.textContent = original; button.removeAttribute('aria-busy'); }
    actionBusy = false;
  }
}
function protectForm(form, label = 'Salvando…') {
  const handler = form.onsubmit;
  form.onsubmit = event => {
    event.preventDefault();
    return exclusiveAction(form.querySelector('button.primary'), label, () => handler(event));
  };
}
function prepareModal() {
  const modal = document.querySelector('.modal');
  if (!modal) return;
  if (!modalOpener) modalOpener = document.activeElement;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.tabIndex = -1;
  const title = modal.querySelector('h2');
  title.id = 'dialogTitle';
  modal.setAttribute('aria-labelledby', title.id);
  const close = modal.querySelector('.close');
  close.setAttribute('aria-label', route() === 'admin' ? 'Fechar janela' : ct(15));
  close.onclick = () => { if (!actionBusy) closeModal(); };
  modal.querySelectorAll('[data-r]').forEach(button => button.setAttribute('aria-label', ct(16) + ': ' + (cart.find(item => item.id == button.dataset.r)?.displayName || '')));
  modal.querySelectorAll('[data-q]').forEach(button => button.setAttribute('aria-label', ct(Number(button.dataset.d) < 0 ? 17 : 18) + ': ' + (cart.find(item => item.id == button.dataset.q)?.displayName || '')));
  document.querySelector('.app-shell').inert = true;
  modal.onkeydown = event => {
    if (event.key === 'Escape') { event.preventDefault(); if (!actionBusy) closeModal(); }
    if (event.key !== 'Tab') return;
    const controls = [...modal.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]')].filter(el => el.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (!first) { event.preventDefault(); modal.focus(); }
    else if (event.shiftKey && (document.activeElement === first || document.activeElement === modal)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || document.activeElement === modal)) { event.preventDefault(); first.focus(); }
  };
  modal.focus();
}
function releaseModal() {
  document.querySelector('.app-shell').inert = false;
  const target = modalOpener;
  modalOpener = null;
  setTimeout(() => {
    if (target?.isConnected) target.focus();
    else document.querySelector('#cartBtn, #newProduct')?.focus();
  }, 0);
}
function reconcileCart(latest) {
  let changed = false;
  cart = cart.flatMap(item => {
    const product = latest.find(product => product.id === item.id && product.active);
    if (!product) { changed = true; return []; }
    if (Number(product.price) !== Number(item.price)) changed = true;
    return [{...product, qty: item.qty, displayName: productText(product, 'name')}];
  });
  return changed;
}
function openWhatsApp(message, clearCart) {
  // Same-tab navigation also works after the asynchronous catalog check on mobile.
  if (clearCart) { cart = []; save(); }
  closeModal();
  menu();
  notify(ct(11));
  window.location.assign('https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(message));
}

const $=s=>document.querySelector(s);
const readJSON=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key));return value??fallback}catch{return fallback}};
let products=readJSON(KEY,seed),cart=readJSON(CART,[]),settings={currency:'BRL',language:'pt-BR',...readJSON(SETTINGS,{})},nameTranslations=readJSON(NAME_TRANSLATIONS,{}),visitorLanguage=localStorage.getItem(VISITOR_LANGUAGE)||null,viewLanguage=settings.language,category='Todos',cloudReady=false,cloudCatalogEmpty=false,stagedImageURLs=[];
const t=key=>(translations[viewLanguage]||translations['pt-BR'])[key]||translations['pt-BR'][key]||key;
const languageName=()=>languageOptions[viewLanguage]||viewLanguage;
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const money=n=>{try{return new Intl.NumberFormat(viewLanguage,{style:'currency',currency:settings.currency}).format(Number(n)||0)}catch{return new Intl.NumberFormat('pt-BR',{style:'currency',currency:settings.currency}).format(Number(n)||0)}};
const visual=v=>{const value=String(v||'🍰');return /^(https?:\/\/|data:image\/)/i.test(value)?`<img src="${esc(value)}" alt="" loading="lazy">`:esc(value)};
const productSourceLanguage=p=>languageOptions[p.translations?._source?.language]?p.translations._source.language:p.translations?.['pt-BR']?.name===p.name?'pt-BR':Object.entries(p.translations||{}).find(([language,value])=>languageOptions[language]&&value?.name===p.name)?.[0]||'pt-BR';
const savedProductName=(p,language)=>{const name=p.translations?.[language]?.name;return name&&(language===productSourceLanguage(p)||name!==p.name)?name:''};
const productText=(p,field)=>field==='name'?(savedProductName(p,viewLanguage)||nameTranslations[`${p.id}:${productSourceLanguage(p)}:${viewLanguage}:${p.name}`]||p.name||''):(p.translations?.[viewLanguage]?.[field]||p[field]||'');
let translationRun=0;
async function translateProductNames(language){
  const run=++translationRun;
  const candidates=products.filter(p=>p.active&&productSourceLanguage(p)!==language&&!savedProductName(p,language));
  await Promise.all(candidates.map(async product=>{
    const source=productSourceLanguage(product),key=`${product.id}:${source}:${language}:${product.name}`;
    if(nameTranslations[key])return;
    try{
      const query=new URLSearchParams({id:String(product.id),lang:language,name:product.name,source});
      const response=await fetch(`/api/product-name?${query}`,{cache:'force-cache'});
      if(!response.ok)return;
      const result=await response.json();
      if(typeof result.name!=='string'||!result.name.trim())return;
      if(run!==translationRun)return;
      nameTranslations[key]=result.name.trim();
      localStorage.setItem(NAME_TRANSLATIONS,JSON.stringify(nameTranslations));
    }catch{}
  }));
}
function save(){localStorage.setItem(KEY,JSON.stringify(products));localStorage.setItem(CART,JSON.stringify(cart))}
function saveSettings(){localStorage.setItem(SETTINGS,JSON.stringify(settings))}
async function loadCloud(){try{const response=await fetch(`/api/catalog${route()==='admin'?'?admin=1':''}`,{cache:'no-store',credentials:'same-origin'});if(!response.ok)return false;const remote=await response.json();if(!Array.isArray(remote.products))return false;const previous=JSON.stringify({products,settings});cloudReady=true;cloudCatalogEmpty=remote.products.length===0;products=remote.products;settings={currency:'BRL',language:'pt-BR',...remote.settings};save();saveSettings();return previous!==JSON.stringify({products,settings})}catch{return false}}
async function syncCatalog(){if(!cloudReady||sessionStorage.getItem(AUTH)!=='ok')throw new Error('Catalog is not connected');const response=await fetch('/api/catalog',{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({products,settings})});if(!response.ok)throw new Error('catalog sync failed');const saved=await response.json();if(!saved.ok||!Array.isArray(saved.products))throw new Error('catalog response invalid');products=saved.products;settings={...settings,...saved.settings};cloudCatalogEmpty=false;save();saveSettings();return true}
function notify(message){const e=$('#toast');e.setAttribute('role','status');e.setAttribute('aria-live','polite');e.textContent=message;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
function route(){const adminSubdomain=location.hostname.startsWith('admin.')&&(['','/','/admin'].includes(location.pathname));return location.pathname.startsWith('/admin')||adminSubdomain?'admin':'menu'}

function menu(){
  viewLanguage=visitorLanguage||settings.language;document.documentElement.lang=viewLanguage;
  const active=products.filter(p=>p.active),cats=['Todos',...new Set(active.map(p=>p.category))];
  $('#app').innerHTML=`<div class="heading"><div><small>${t('made')}</small><h2>${t('choose')}</h2></div><div class="heading-actions"><label class="language-picker" title="Escolher idioma">🌐 <select id="visitorLanguage" aria-label="Escolher idioma"><option value="default" ${visitorLanguage?'':'selected'}>Padrão da loja</option>${Object.entries(languageOptions).map(([key,label])=>`<option value="${key}" ${viewLanguage===key&&visitorLanguage?'selected':''}>${label}</option>`).join('')}</select></label><button class="cart-btn" id="cartBtn">🛒 ${t('cart')} <b>${cartQty()}</b></button></div></div><nav class="categories">${cats.map(c=>`<button class="cat ${c===category?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</nav><button class="custom-cake" id="customCakeBtn">🎂 ${t('custom')}<span>${t('customSub')}</span></button><section class="grid">${active.filter(p=>category==='Todos'||p.category===category).map(card).join('')||`<div class="empty">${t('empty')}</div>`}</section>`;
  document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{category=b.dataset.cat;menu()});
  document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>add(+b.dataset.add));
  $('#visitorLanguage').onchange=e=>{visitorLanguage=e.target.value==='default'?null:e.target.value;if(visitorLanguage)localStorage.setItem(VISITOR_LANGUAGE,visitorLanguage);else localStorage.removeItem(VISITOR_LANGUAGE);viewLanguage=visitorLanguage||settings.language;category='Todos';menu();const language=viewLanguage;translateProductNames(language).then(()=>{if(viewLanguage===language)menu()})};
  $('#cartBtn').onclick=cartModal;$('#customCakeBtn').onclick=customCakeModal;
}
function card(p){return `<article class="product"><div class="pic">${visual(p.image)}</div><h3>${esc(productText(p,'name'))}</h3><p>${esc(productText(p,'description'))}</p><div class="product-foot"><strong>${money(p.price)}</strong><button class="add" data-add="${p.id}">＋ ${t('add')}</button></div></article>`}
function cartQty(){return cart.reduce((sum,item)=>sum+item.qty,0)}
function add(id){const p=products.find(x=>x.id===id),i=cart.find(x=>x.id===id);if(!p)return;i?i.qty++:cart.push({...p,displayName:productText(p,'name'),qty:1});save();menu();notify(viewLanguage==='en-GB'?'Product added to basket':'Produto adicionado ao carrinho')}
function cartModal(message=''){if(typeof message!=='string')message='';const total=cart.reduce((sum,item)=>sum+item.price*item.qty,0);$('#modalRoot').innerHTML=`<div class="backdrop"><div class="modal"><button class="close" onclick="closeModal()">×</button><small>${t('order')}</small><h2>${t('review')}</h2>${cart.length?cart.map(i=>`<div class="cart-line"><span class="cart-name">${visual(i.image)} ${esc(i.displayName||i.name)}</span><div class="qty"><button data-q="${i.id}" data-d="-1">−</button><b>${i.qty}</b><button data-q="${i.id}" data-d="1">＋</button><strong>${money(i.price*i.qty)}</strong><button class="remove" data-r="${i.id}">×</button></div></div>`).join(''):`<div class="empty">${t('emptyCart')}</div>`}<div class="total"><span>${t('total')}</span><strong>${money(total)}</strong></div><button class="primary full" id="whatsBtn" ${cart.length?'':'disabled'}>${t('finish')}</button><p class="hint">${t('hint')}</p><p class="hint" role="status">${esc(message)}</p></div></div>`;
  document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const i=cart.find(x=>x.id==b.dataset.q);if(!i)return;i.qty+=+b.dataset.d;if(i.qty<=0)cart=cart.filter(x=>x!==i);save();cartModal()});
  document.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{cart=cart.filter(i=>i.id!=b.dataset.r);save();cartModal()});$('#whatsBtn').onclick=whatsappOrder;prepareModal();
}
function closeModal(){const pending=[...stagedImageURLs];stagedImageURLs=[];if(pending.length)fetch('/api/upload',{method:'DELETE',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({images:pending})}).catch(()=>{});$('#modalRoot').innerHTML='';releaseModal()}
async function whatsappOrder() {
  if (!cart.length) return;
  return exclusiveAction($('#whatsBtn'), ct(12), async () => {
    try {
      const response = await fetch('/api/catalog', {cache:'no-store', credentials:'same-origin'});
      if (!response.ok) throw new Error('catalog');
      const latest = await response.json();
      if (!Array.isArray(latest.products) || latest.products.some(p => !Number.isFinite(Number(p.price)) || Number(p.price) < 0)) throw new Error('catalog');
      const oldCurrency = settings.currency;
      products = latest.products;
      settings = {...settings, ...latest.settings};
      const changed = reconcileCart(products) || oldCurrency !== settings.currency;
      save(); saveSettings();
      if (changed || !cart.length) { cartModal(ct(13)); return; }
      const lines = cart.map((item,index) => `${index+1}. ${item.displayName}\n   ${ct(2)}: ${item.qty}\n   ${ct(3)}: ${money(item.price)}\n   ${ct(4)}: ${money(item.price*item.qty)}`).join('\n\n');
      const total = cart.reduce((sum,item) => sum + item.price*item.qty, 0);
      openWhatsApp(`${ct(0)}\n\n${ct(1)}\n\n🧁 *${t('order')}*\n\n${lines}\n\n💰 *${t('total')}: ${money(total)}*\n\n${ct(5)}`, true);
    } catch { cartModal(ct(14)); }
  });
}

function customCakeModal(){$('#modalRoot').innerHTML=`<div class="backdrop"><div class="modal"><button class="close" onclick="closeModal()">×</button><small>${t('customSmall')}</small><h2>${t('customTitle')}</h2><p class="hint left">${t('customHint')}</p><form id="customForm"><label>${t('customDescription')}<textarea name="description" required placeholder="${t('descriptionPlaceholder')}"></textarea></label><label>${t('customDate')} <input name="date" type="text" placeholder="${t('datePlaceholder')}"></label><button class="primary full">${t('sendIdea')}</button></form></div></div>`;$('#customForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),date=f.get('date')||ct(9);const msg=`${ct(0)}\n\n${ct(6)}\n\n🎂 *${ct(7)}:*\n${f.get('description')}\n\n📅 *${ct(8)}:* ${date}\n\n${ct(10)}`;openWhatsApp(msg,false)};prepareModal()}


function admin(){if(sessionStorage.getItem(AUTH)!=='ok')return login();if(!cloudReady){$('#app').innerHTML='<section class="login"><h1>Catálogo indisponível</h1><p>Não foi possível carregar os dados do Supabase. Atualize a página e tente novamente; nenhuma alteração local será enviada.</p><button class="primary" onclick="location.reload()">Tentar novamente</button></section>';return}viewLanguage=settings.language;$('#app').innerHTML=`<section class="admin-head"><div><small>ÁREA ADMINISTRATIVA</small><h1>Gestão de produtos</h1><p>As alterações aparecem no cardápio público imediatamente.</p></div><div><a class="view-link" href="/cardapio">Ver cardápio ↗</a><button class="logout" id="logout">Sair</button></div></section><section class="settings-card"><div><small>CONFIGURAÇÕES DO CARDÁPIO</small><h2>Moeda e idioma</h2><p>Escolha como os preços e os textos principais serão exibidos para os clientes.</p></div><form id="settingsForm"><div class="form-row"><label>Moeda<select name="currency">${Object.entries(currencyOptions).map(([key,label])=>`<option value="${key}" ${settings.currency===key?'selected':''}>${label}</option>`).join('')}</select></label><label>Idioma padrão do cardápio<select name="language">${Object.entries(languageOptions).map(([key,label])=>`<option value="${key}" ${settings.language===key?'selected':''}>${label}</option>`).join('')}</select></label></div><p class="setting-note">Este idioma será o padrão. Cada cliente também poderá escolher outro idioma no próprio cardápio.</p><button class="primary">Salvar configurações</button></form></section><div class="toolbar"><strong>${products.length} produtos cadastrados</strong><button class="primary" id="newProduct">＋ Novo produto</button></div><section class="admin-list">${products.map(adminRow).join('')}</section>`;
  $('#logout').onclick=async()=>{try{await fetch('/api/logout',{method:'POST',credentials:'same-origin'})}finally{sessionStorage.removeItem(AUTH);location.href='/admin'}};$('#newProduct').onclick=()=>productModal();$('#settingsForm').onsubmit=async e=>{e.preventDefault();const before={...settings},f=new FormData(e.target);settings.currency=f.get('currency');settings.language=f.get('language');try{await syncCatalog();category='Todos';admin();notify('Configurações salvas')}catch{settings=before;saveSettings();admin();notify('Não foi possível salvar. Tente novamente.')}};
  document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>productModal(+b.dataset.edit));document.querySelectorAll('[data-active]').forEach(b=>b.onclick=async()=>{const before=JSON.stringify(products),p=products.find(x=>x.id==b.dataset.active);p.active=!p.active;try{await syncCatalog();admin()}catch{products=JSON.parse(before);save();admin();notify('Não foi possível salvar. Tente novamente.')}});document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{if(confirm('Remover este produto?')){const before=JSON.stringify(products);products=products.filter(x=>x.id!=b.dataset.delete);try{await syncCatalog();admin()}catch{products=JSON.parse(before);save();admin();notify('Não foi possível remover. Tente novamente.')}}})
  protectForm($('#settingsForm'));
  document.querySelectorAll('[data-active], [data-delete]').forEach(button => {
    const handler = button.onclick;
    button.onclick = () => exclusiveAction(button, 'Salvando…', handler);
  });
}
function login(){$('#app').innerHTML=`<section class="login"><span class="brand-mark">✦</span><small>PAINEL ADMINISTRATIVO</small><h1>Bem-vindo de volta</h1><p>Entre para gerenciar os produtos do cardápio.</p><form id="loginForm"><label>E-mail<input type="email" name="email" required placeholder="admin@doce-casa.com"></label><label>Senha<input type="password" name="password" required placeholder="••••••••"></label><div id="loginError" class="error"></div><button class="primary full">Entrar no painel →</button></form><a href="/cardapio" class="back-link">← Voltar ao cardápio</a></section>`;$('#loginForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),button=e.target.querySelector('button');button.disabled=true;try{const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({email:f.get('email'),password:f.get('password')})});if(!r.ok)throw new Error(r.status===429?'Muitas tentativas. Aguarde 15 minutos.':'E-mail ou senha inválidos ou servidor indisponível.');sessionStorage.setItem(AUTH,'ok');if(!await loadCloud()&&!cloudReady)throw new Error('Login feito, mas não foi possível carregar o catálogo do banco.');admin()}catch(error){sessionStorage.removeItem(AUTH);fetch('/api/logout',{method:'POST',credentials:'same-origin'}).catch(()=>{});$('#loginError').textContent=error.message||'E-mail ou senha inválidos ou servidor indisponível.';button.disabled=false}}}
function adminRow(p){return `<article class="admin-row"><span class="admin-emoji">${visual(p.image)}</span><div class="admin-info"><strong>${esc(productText(p,'name'))}</strong><small>${esc(p.category)} · ${money(p.price)}</small></div><span class="pill ${p.active?'on':'off'}">${p.active?'Disponível':'Indisponível'}</span><div class="admin-actions"><button class="secondary" data-active="${p.id}">${p.active?'Desativar':'Ativar'}</button><button class="secondary" data-edit="${p.id}">Editar</button><button class="danger" data-delete="${p.id}">Excluir</button></div></article>`}
function productModal(id){const p=id?products.find(x=>x.id===id):{name:'',description:'',price:'',category:'Bolos',image:'🍰',active:true};const currentName=productText(p,'name'),currentDescription=productText(p,'description');let imageValue=p.image||'🍰';stagedImageURLs=[];$('#modalRoot').innerHTML=`<div class="backdrop"><div class="modal"><button class="close" onclick="closeModal()">×</button><small>${id?'EDITAR PRODUTO':'NOVO PRODUTO'}</small><h2>${id?'Atualizar item':'Adicionar item'}</h2><p class="field-help">Idioma atual: <strong>${esc(languageName())}</strong>. Para oferecer outro idioma, cadastre o produto novamente com esse idioma selecionado.</p><form id="productForm"><label>Nome<input name="name" required value="${esc(currentName)}"></label><label>Descrição<textarea name="description" required>${esc(currentDescription)}</textarea></label><div class="form-row"><label>Preço<input name="price" type="number" step="0.01" min="0" required value="${esc(p.price)}"></label><label>Categoria<input name="category" required value="${esc(p.category)}"></label></div><label>Imagem por URL ou emoji<input name="image" id="imageValue" value="${esc(imageValue)}" placeholder="https://... ou 🍰"></label><div class="image-actions"><label>Ou envie uma imagem<input name="imageFile" type="file" accept="image/png,image/jpeg,image/webp"></label><button class="secondary" id="removeProductImage" type="button">Remover imagem</button></div><span class="image-preview" id="imagePreview">${visual(imageValue)}</span><button class="primary full">Salvar produto</button></form></div></div>`;
  prepareModal();
  const imageInput=$('#imageValue'),preview=$('#imagePreview');imageInput.oninput=()=>{imageValue=imageInput.value.trim()||'🍰';preview.innerHTML=visual(imageValue)};
  $('#removeProductImage').onclick=()=>{imageValue='🍰';imageInput.value=imageValue;preview.innerHTML=visual(imageValue)};
  $('#productForm [name=imageFile]').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;try{const imageData=await compressImage(file),form=new FormData();form.append('image',dataURLToBlob(imageData),'produto.jpg');const response=await fetch('/api/upload',{method:'POST',credentials:'same-origin',body:form}),result=await response.json();if(!response.ok||!result.url)throw new Error(result.error||'Upload failed');imageValue=result.url;stagedImageURLs.push(result.url);imageInput.value=imageValue;preview.innerHTML=visual(imageValue)}catch(error){notify(error.message||'Não foi possível carregar a imagem')}};
  $('#productForm').onsubmit=async e=>{e.preventDefault();const before=JSON.stringify(products),f=new FormData(e.target),data={name:f.get('name'),description:f.get('description'),price:Number(f.get('price')),category:f.get('category'),image:imageValue||'🍰',active:p.active};if(id){const existing=products.find(x=>x.id===id);existing.translations=existing.translations||{};existing.translations[settings.language]={name:data.name,description:data.description};if(settings.language==='pt-BR')Object.assign(existing,data);else Object.assign(existing,{price:data.price,category:data.category,image:data.image,active:data.active})}else{const created={id:Date.now(),...data};if(settings.language!=='pt-BR')created.translations={[settings.language]:{name:data.name,description:data.description}};products.push(created)}try{await syncCatalog();stagedImageURLs=stagedImageURLs.filter(url=>url!==data.image);closeModal();admin();notify('Produto salvo e sincronizado')}catch{products=JSON.parse(before);save();notify('Não foi possível salvar no banco. Confira sua conexão e tente novamente.')}}
  protectForm($('#productForm'));
  const fileInput = $('#productForm [name=imageFile]'), upload = fileInput.onchange;
  fileInput.onchange = event => exclusiveAction($('#productForm button.primary'), 'Enviando imagem…', () => upload(event));
}
function dataURLToBlob(dataURL){const [meta,data]=dataURL.split(',');const binary=atob(data);const bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return new Blob([bytes],{type:meta.match(/data:(.*?);/)?.[1]||'image/jpeg'})}
function compressImage(file){return new Promise((resolve,reject)=>{if(!file.type.startsWith('image/'))return reject(new Error('invalid'));const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{const max=1000,scale=Math.min(1,max/Math.max(image.width,image.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.82))};image.onerror=reject;image.src=reader.result};reader.onerror=reject;reader.readAsDataURL(file)})}

async function boot(){await loadCloud();if(route()==='admin'&&!cloudReady){sessionStorage.removeItem(AUTH);login()}else if(route()==='menu'){viewLanguage=visitorLanguage||settings.language;menu();const language=viewLanguage;translateProductNames(language).then(()=>{if(viewLanguage===language)menu()});if(!cloudReady)notify('Cardápio offline: mostrando a última versão salva neste aparelho.')}else admin();setInterval(async()=>{if(route()!=='menu'||actionBusy||document.querySelector('.modal'))return;if(await loadCloud()){viewLanguage=visitorLanguage||settings.language;menu();const language=viewLanguage;translateProductNames(language).then(()=>{if(viewLanguage===language)menu()})}},10000)}
window.addEventListener('popstate',route);boot();

