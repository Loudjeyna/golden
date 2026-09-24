/* ═══ الاتصال ═══ */
const SUPABASE_URL = 'https://cqkbqcvjjrirbrkyodbv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vFSo6qX4xD4wLLSPPTJhLA_KSIslSqu';   // ← ★ Publishable key ★

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const $ = s => document.querySelector(s);

/* ═══ الترجمة ═══ */
const I18N = {
  ar: {
    dir:'rtl',
    title:'Golden Store ',
    heroTitle:'هدايا وإكسسوارات تُسعد القلوب 💝',
    heroSub:'أحدث المنتجات بين يديك — تصفحي وأضيفي للسلة',
    heroBtn:'تصفح الأقسام 🛍️',
    catsTitle:'🗂️ الأقسام',
    recentTitle:'✨ وصل حديثاً',
    allCats:'✨ الكل',
    groupsIn:'مجموعات داخل',
    backToCats:'← كل الأقسام',
    cartTitle:'🛒 سلة المشتريات',
    cartEmpty:'سلتك فارغة — ابدئي التسوق!',
    total:'المجموع',
    checkout:'تأكيد الطلب 🛍️',
    sending:'جاري الإرسال...',
    fullName:'الاسم الكامل',
    phone:'رقم الهاتف',
    address:'الولاية / العنوان',
    notes:'ملاحظات (اختياري)',
    orderSuccess:'تم استلام طلبك بنجاح!',
    willCall:'سنتصل بك قريباً لتأكيد التفاصيل.',
    orderArrived:'وصل طلبك إلى المتجر ✓',
    addedCart:'تمت الإضافة إلى السلة ✓',
    addToCart:'أضف إلى السلة',
    soldOut:'نفدت الكمية 😔',
    outBadge:'نفدت الكمية',
    newBadge:'جديد ✨',
    onlyLeft:'⚡ بقي',
    only:' فقط!',
    choose:'اختر الخيار:',
    qty:'الكمية:',
    noDesc:'لا يوجد وصف لهذا المنتج بعد.',
    noProducts:'لا توجد منتجات بعد 🌱',
    noProductsCat:'لا توجد منتجات في هذا القسم بعد 🌱',
    footer:'صُنع بـ 💛 — جميع الحقوق محفوظة',
    currency:' دج',
    from:'من ',
    sendFail:'تعذر إرسال الطلب، حاولي مجدداً',
    loadFail:'تعذر تحميل المنتجات',
    home:'العودة إلى الصفحة الرئيسية'
  },
  en: {
    dir:'ltr',
    title:'My Store — Gifts & Accessories',
    heroTitle:'Gifts & Accessories that delight hearts 💝',
    heroSub:'The latest products at your fingertips — browse & add to cart',
    heroBtn:'Browse Categories 🛍️',
    catsTitle:'🗂️ Categories',
    recentTitle:'✨ New Arrivals',
    allCats:'✨ All',
    groupsIn:'Groups in',
    backToCats:'← All Categories',
    cartTitle:'🛒 Shopping Cart',
    cartEmpty:'Your cart is empty — start shopping!',
    total:'Total',
    checkout:'Place Order 🛍️',
    sending:'Sending...',
    fullName:'Full name',
    phone:'Phone number',
    address:'State / Address',
    notes:'Notes (optional)',
    orderSuccess:'Your order has been received!',
    willCall:'We will call you soon to confirm the details.',
    orderArrived:'Your order reached the store ✓',
    addedCart:'Added to cart ✓',
    addToCart:'Add to cart',
    soldOut:'Out of stock 😔',
    outBadge:'Out of stock',
    newBadge:'New ✨',
    onlyLeft:'⚡ Only',
    only:' left!',
    choose:'Choose an option:',
    qty:'Quantity:',
    noDesc:'No description for this product yet.',
    noProducts:'No products yet 🌱',
    noProductsCat:'No products in this category yet 🌱',
    footer:'Made with 💛 — All rights reserved',
    currency:' DZD',
    from:'from ',
    sendFail:'Failed to send the order, please try again',
    loadFail:'Failed to load products',
    home:'Back to home page'
  }
};

let lang = localStorage.getItem('store_lang') || 'ar';
const t = k => I18N[lang][k] || k;

function applyLang(){
  const L = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir  = L.dir;
  document.title = L.title;
  $('#hero-title').textContent = L.heroTitle;
  $('#hero-sub').textContent   = L.heroSub;
  $('#hero-btn').textContent   = L.heroBtn;
  $('#cats-title').textContent = L.catsTitle;
  $('#footer-txt').textContent = L.footer;
  $('#cart-title').textContent = L.cartTitle;
  $('#lang-btn').textContent   = lang === 'ar' ? 'EN' : 'ع';
  document.querySelector('.logo')?.setAttribute('aria-label', L.home);
  if (loaded) renderPage();
}
function toggleLang(){
  lang = lang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('store_lang', lang);
  applyLang();
}

/* ═══ الحالة ═══ */
let products = [], cats = [], loaded = false;
let view = 'home', catId = null, subId = null;
let current = null, selVariant = 0, qty = 1;
let cart = JSON.parse(localStorage.getItem('dz_cart') || '[]');

/* توحيد مسارات الصور */
const imgURL = u => (u || '').replace(/^\/+/, '');
const catById = id => cats.find(c => c.id === id);
const mainCats = () => cats.filter(c => !c.parent_id).sort((a,b)=>a.sort_order-b.sort_order);
const subsOf = id => cats.filter(c => c.parent_id === id).sort((a,b)=>a.sort_order-b.sort_order);
const money = n => Number(n).toLocaleString('en-US') + t('currency');
const isNew = p => p.created_at && (Date.now() - new Date(p.created_at)) < 14*864e5;
const soldOut = p => !p.product_variants?.length || p.product_variants.every(v => v.stock <= 0);
const catLabel = p => { const c = catById(p.subcategory_id) || catById(p.category_id); return c ? c.icon+' '+c.name : '🛍️'; };

/* ═══ التحميل ═══ */
async function loadAll(){
  const [cRes, pRes] = await Promise.all([
    db.from('categories').select('*').order('sort_order'),
    db.from('products').select('*, product_variants(*)').eq('is_active', true).order('created_at', { ascending:false })
  ]);
  if (cRes.error) console.error(cRes.error);
  if (pRes.error) console.error(pRes.error);
  cats = cRes.data || [];
  products = pRes.data || [];
  loaded = true;
  renderPage();
}

function renderPage(){ renderCatGrid(); renderSubArea(); renderShop(); renderCartBadge(); }

function renderCatGrid(){
  $('#cat-grid').innerHTML = mainCats().map(c => `
    <div class="cat-card ${view==='cat' && catId===c.id ? 'active':''}" onclick="openCat(${c.id})">
      ${c.image_url
        ? `<img src="${imgURL(c.image_url)}" alt="${c.name}" loading="lazy" onerror="this.style.display='none'"><div class="ph" style="display:none">${c.icon}</div>`
        : `<div class="ph">${c.icon}</div>`}
      <div class="ov"><b>${c.name}</b></div>
    </div>`).join('');
}

function renderSubArea(){
  const area = $('#sub-area');
  if (view !== 'cat' || !catId) { area.innerHTML = ''; return; }
  const subs = subsOf(catId);
  if (!subs.length) { area.innerHTML = ''; return; }
  area.innerHTML = `
    <div class="sub-title">${t('groupsIn')} «${catById(catId).name}»:</div>
    <div class="sub-strip">
      <button class="sub-card ${!subId?'active':''}" onclick="openSub(null)">
        <div class="sq">✨</div><span>${t('allCats')}</span>
      </button>
      ${subs.map(s => `
      <button class="sub-card ${subId===s.id?'active':''}" onclick="openSub(${s.id})">
        <div class="sq">${s.image_url
          ? `<img src="${imgURL(s.image_url)}" alt="${s.name}" loading="lazy" onerror="this.remove()">`
          : s.icon}</div><span>${s.name}</span>
      </button>`).join('')}
    </div>`;
}

function renderShop(){
  const head = $('#shop-head'), grid = $('#grid');
  if (view === 'home') {
    head.innerHTML = `<div class="sec-head"><h2>${t('recentTitle')}</h2></div>`;
    const list = products.slice(0, 8);
    grid.innerHTML = list.length ? list.map(cardHTML).join('')
      : `<div class="empty">${t('noProducts')}</div>`;
    return;
  }
  const main = catById(catId), sub = subId ? catById(subId) : null;
  head.innerHTML = `
    <div class="crumb">
      <button onclick="goHome()">${t('backToCats')}</button>
      <span class="cur">${main.icon} ${main.name}${sub ? ' / '+sub.name : ''}</span>
    </div>`;
  const subsIds = subsOf(catId).map(s => s.id);
  const list = products.filter(p =>
    subId ? p.subcategory_id === subId
          : (p.category_id === catId || subsIds.includes(p.subcategory_id)));
  grid.innerHTML = list.length ? list.map(cardHTML).join('')
    : `<div class="empty">${t('noProductsCat')}</div>`;
}

function openCat(id){
  if (view==='cat' && catId===id) { goHome(); return; }
  view='cat'; catId=id; subId=null;
  renderPage();
  document.getElementById('sub-area').scrollIntoView({behavior:'smooth', block:'center'});
}
function openSub(id){ subId=id; renderPage(); }
function goHome(){
  view='home'; catId=null; subId=null;
  closeModal(); toggleCart(false);
  renderPage();
  window.scrollTo({top:0, behavior:'smooth'});
}

/* ═══ بطاقة المنتج ═══ */
function cardHTML(p) {
  const vs = p.product_variants || [];
  const prices = vs.map(v => +v.price);
  const min = prices.length ? Math.min(...prices) : 0;
  const out = soldOut(p);
  const badges = [];
  if (out) badges.push(`<span class="badge out">${t('outBadge')}</span>`);
  else if (isNew(p)) badges.push(`<span class="badge new">${t('newBadge')}</span>`);
  if (p.old_price && min > 0 && min < +p.old_price)
    badges.push('<span class="badge off">-' + Math.round((1 - min/+p.old_price)*100) + '%</span>');
  const img = p.images?.[0];
  return `
  <article class="card" onclick="openModal(${p.id})">
    <div class="card-img">
      ${img
        ? `<img src="${imgURL(img)}" alt="${p.name}" loading="lazy" onerror="this.nextElementSibling.style.display='grid';this.remove()">
           <div class="ph" style="display:none">🛍️</div>`
        : `<div class="ph">🛍️</div>`}
      <div class="badges">${badges.join('')}</div>
    </div>
    <div class="card-body">
      <span class="card-cat">${catLabel(p)}</span>
      <h3>${p.name}</h3>
      <div class="card-price">
        ${p.old_price ? `<del>${money(p.old_price)}</del>` : ''}
        <b>${prices.length ? (min===Math.max(...prices) ? money(min) : t('from')+money(min)) : ''}</b>
      </div>
    </div>
  </article>`;
}

/* ═══ نافذة المنتج ═══ */
function openModal(id) {
  current = products.find(p => p.id === id);
  selVariant = 0; qty = 1;
  renderModal();
  $('#overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){ $('#overlay').classList.remove('open'); document.body.style.overflow = ''; }

function renderModal() {
  const p = current, vs = p.product_variants || [], v = vs[selVariant];
  const img = p.images?.[0], out = soldOut(p);
  $('#modal-body').innerHTML = `
    <button class="m-close" onclick="closeModal()">✕</button>
    <div class="m-img">
      ${img
        ? `<img src="${imgURL(img)}" alt="${p.name}" onerror="this.nextElementSibling.style.display='grid';this.remove()">
           <div class="ph" style="display:none">🛍️</div>`
        : `<div class="ph">🛍️</div>`}
    </div>
    <div class="m-info">
      <span class="card-cat">${catLabel(p)}</span>
      <h2>${p.name}</h2>
      <p class="m-desc">${p.description || t('noDesc')}</p>
      ${p.old_price ? `<div class="card-price" style="margin-bottom:12px"><del>${money(p.old_price)}</del></div>` : ''}
      ${vs.length ? `
        <div class="m-label">${t('choose')}</div>
        <div class="chips">
          ${vs.map((x,i)=>`<button class="chip ${i===selVariant?'active':''}" ${x.stock<=0?'disabled':''} onclick="pickV(${i})">${x.label} — ${money(x.price)}</button>`).join('')}
        </div>
        ${v && v.stock > 0 && v.stock <= 2 ? `<div class="low">${t('onlyLeft')} ${v.stock}${t('only')}</div>` : ''}
        ${!out ? `
          <div class="qty-row">
            <span>${t('qty')}</span>
            <div class="stepper">
              <button onclick="setQty(1)">+</button><b id="qty-val">${qty}</b><button onclick="setQty(-1)">−</button>
            </div>
          </div>
          <button class="cta" onclick="addCart()">${t('addToCart')} — <span id="cta-price">${money(v.price*qty)}</span></button>`
        : `<button class="cta" disabled>${t('soldOut')}</button>`}`
      : ''}
    </div>`;
}

function pickV(i){ selVariant = i; qty = 1; renderModal(); }
function setQty(d){
  const v = current.product_variants[selVariant];
  qty = Math.min(Math.max(1, qty + d), v.stock);
  $('#qty-val').textContent = qty;
  $('#cta-price').textContent = money(v.price * qty);
}

/* ═══ السلة ═══ */
function addCart(){
  const v = current.product_variants[selVariant];
  const exist = cart.find(i => i.vid === v.id);
  if (exist) exist.qty = Math.min(exist.qty + qty, v.stock);
  else cart.push({ vid:v.id, name:current.name, label:v.label, price:+v.price, stock:v.stock, qty, cat:catLabel(current) });
  saveCart(); closeModal(); showToast(t('addedCart'));
}
function saveCart(){ localStorage.setItem('dz_cart', JSON.stringify(cart)); renderCartBadge(); }
function renderCartBadge(){
  const n = cart.reduce((s,i)=>s+i.qty,0);
  $('#cart-count').textContent = n;
  $('#cart-count').style.display = n ? 'grid' : 'none';
}
function toggleCart(open){
  $('#drawer').classList.toggle('open', open);
  $('#scrim').classList.toggle('show', open);
  if (open) renderCart();
  document.body.style.overflow = open ? 'hidden' : '';
}
function cQty(ix,d){
  cart[ix].qty = Math.min(cart[ix].qty + d, cart[ix].stock);
  if (cart[ix].qty <= 0) cart.splice(ix,1);
  saveCart(); renderCart();
}
function cDel(ix){ cart.splice(ix,1); saveCart(); renderCart(); }

function renderCart(){
  if (!cart.length) { $('#drawer-body').innerHTML = `<div class="empty-cart"><div>🛒</div>${t('cartEmpty')}</div>`; return; }
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  $('#drawer-body').innerHTML = `
    ${cart.map((i,ix)=>`
    <div class="c-item">
      <div class="c-emoji">🛍️</div>
      <div class="c-info"><b>${i.name}</b><span>${i.label}</span><b class="c-price">${money(i.price*i.qty)}</b></div>
      <div class="c-qty">
        <button onclick="cQty(${ix},1)">+</button><span>${i.qty}</span><button onclick="cQty(${ix},-1)">−</button>
        <button class="c-del" onclick="cDel(${ix})">🗑</button>
      </div>
    </div>`).join('')}
    <div class="c-total"><span>${t('total')}</span><b>${money(total)}</b></div>
    <form onsubmit="checkout(event)">
      <input name="name" placeholder="${t('fullName')}" required>
      <input name="phone" type="tel" placeholder="${t('phone')}" required>
      <input name="address" placeholder="${t('address')}" required>
      <textarea name="notes" rows="2" placeholder="${t('notes')}"></textarea>
      <button id="checkout-btn" class="cta">${t('checkout')}</button>
    </form>`;
}

async function checkout(e){
  e.preventDefault();
  if (!cart.length) return;
  const btn = $('#checkout-btn'); btn.disabled = true; btn.textContent = t('sending');
  const fd = new FormData(e.target);
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const orderId = crypto.randomUUID();
  const { error } = await db.from('orders').insert({
    id: orderId, customer_name: fd.get('name'), phone: fd.get('phone'),
    address: fd.get('address'), notes: fd.get('notes') || null, total
  });
  if (error) { console.error(error); showToast(t('sendFail'),'err'); btn.disabled=false; btn.textContent=t('checkout'); return; }
  await db.from('order_items').insert(
    cart.map(i => ({ order_id: orderId, product_name: i.name, variant_label: i.label, unit_price: i.price, quantity: i.qty }))
  );
  cart = []; saveCart();
  $('#drawer-body').innerHTML = `<div class="success"><div>🎉</div><h3>${t('orderSuccess')}</h3><p>${t('willCall')}</p></div>`;
  showToast(t('orderArrived'));
}

/* ═══ إشعارات ═══ */
let toastT;
function showToast(msg, type=''){
  const tt = $('#toast'); tt.textContent = msg; tt.className = 'toast show ' + type;
  clearTimeout(toastT); toastT = setTimeout(()=>tt.classList.remove('show'), 2500);
}

/* ═══ التشغيل + البث الحيّ ═══ */
applyLang();
loadAll();
db.channel('store')
  .on('postgres_changes', { event:'*', schema:'public', table:'products' }, loadAll)
  .on('postgres_changes', { event:'*', schema:'public', table:'product_variants' }, loadAll)
  .on('postgres_changes', { event:'*', schema:'public', table:'categories' }, loadAll)
  .subscribe(status => console.log('🔌 حالة البث:', status));
setInterval(loadAll, 30000);