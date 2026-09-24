/* ═══ الاتصال ═══ */
const SUPABASE_URL = 'https://cqkbqcvjjrirbrkyodbv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vFSo6qX4xD4wLLSPPTJhLA_KSIslSqu';   // ← ★ Publishable key ★

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const $ = s => document.querySelector(s);

/* ═══ الترجمة ═══ */
const I18N = {
  ar: {
    dir:'rtl',
    title:'Golden Store',
    heroTitle:'هدايا وإكسسوارات  💝',
    heroSub:'أحدث المنتجات بين يديك — تصفح وأضيف للسلة',
    heroBtn:'تصفح الأقسام',
    catsTitle:'🗂️ الأقسام',
    recentTitle:'✨ وصل حديثاً',
    allCats:'الكل',
    groupsIn:'مجموعات داخل',
    backToCats:'← كل الأقسام',
    cartTitle:'سلة المشتريات',
    cartEmpty:'سلتك فارغة — ابدأ التسوق!',
    total:'المجموع',
    checkout:'تأكيد الطلب',
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
    sendFail:'تعذر إرسال الطلب، حاول مجدداً',
    loadFail:'تعذر تحميل المنتجات',
    home:'العودة إلى الصفحة الرئيسية'
  },
  en: {
    dir:'ltr',
    title:'Golden Store',
    heroTitle:'Gifts & Accessories that delight hearts 💝',
    heroSub:'The latest products at your fingertips — browse & add to cart',
    heroBtn:'Browse Categories',
    catsTitle:'🗂️ Categories',
    recentTitle:'✨ New Arrivals',
    allCats:'All',
    groupsIn:'Groups in',
    backToCats:'← All Categories',
    cartTitle:'Shopping Cart',
    cartEmpty:'Your cart is empty — start shopping!',
    total:'Total',
    checkout:'Place Order',
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

/* ═══ أيقونات SVG — بلون الهوية، بديلة عن كل الإيموجي الوظيفي ═══ */
const S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  'هدايا': `<svg viewBox="0 0 24 24" ${S}><rect x="3" y="8" width="18" height="4" rx="1.2"/><path d="M5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12"/><path d="M12 8v13"/><path d="M12 8s-1.6-4.2-4.2-4.2a2.1 2.1 0 0 0 0 4.2"/><path d="M12 8s1.6-4.2 4.2-4.2a2.1 2.1 0 0 1 0 4.2"/></svg>`,
  'إكسسوارات الهاتف': `<svg viewBox="0 0 24 24" ${S}><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg>`,
  'كفرات': `<svg viewBox="0 0 24 24" ${S}><rect x="7" y="2.5" width="10" height="19" rx="3"/><circle cx="12" cy="6" r="1.3"/><path d="M10.5 18.5h3"/></svg>`,
  'شواحن وكوابل': `<svg viewBox="0 0 24 24" ${S}><path d="M9 2.5V8M15 2.5V8"/><path d="M7 8h10v2.8a5 5 0 0 1-10 0z"/><path d="M12 15.8V21"/></svg>`,
  'سماعات': `<svg viewBox="0 0 24 24" ${S}><path d="M4 17.5V13a8 8 0 0 1 16 0v4.5"/><rect x="3" y="14" width="4.5" height="7" rx="2"/><rect x="16.5" y="14" width="4.5" height="7" rx="2"/></svg>`,
  'إكسسوارات بنات': `<svg viewBox="0 0 24 24" ${S}><path d="M12 3.5l1.7 4.3 4.3 1.7-4.3 1.7L12 15.5l-1.7-4.3L6 9.5l4.3-1.7z"/><path d="M18.5 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/><path d="M6 17l.7 1.6 1.6.7-1.6.7L6 21.6l-.7-1.6-1.6-.7 1.6-.7z"/></svg>`,
  'مجوهرات': `<svg viewBox="0 0 24 24" ${S}><path d="M7 3.5h10l4 5.5-9 12-9-12z"/><path d="M3 9h18M9.5 3.5 12 9l2.5-5.5M12 21 9.5 9M12 21l2.5-12"/></svg>`,
  'إكسسوارات شعر': `<svg viewBox="0 0 24 24" ${S}><path d="M12 12 5.8 8.4C4.2 7.5 4.4 5 6.4 4.9 9.3 4.7 11.2 8.2 12 12z"/><path d="M12 12l6.2-3.6c1.6-.9 1.4-3.4-.6-3.5C14.7 4.7 12.8 8.2 12 12z"/><circle cx="12" cy="12" r="1.7"/><path d="M10.6 14.2c-1.3 2-2 3.9-1.6 6.3M13.4 14.2c1.3 2 2 3.9 1.6 6.3"/></svg>`,
  'ساعات رجالية': `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="5.3"/><path d="M9.2 7l.6-4.2h4.4L14.8 7M9.2 17l.6 4.2h4.4l.6-4.2"/><path d="M12 9.6V12l1.7 1.1"/></svg>`,
  'ساعات نسائية': `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="5.3"/><path d="M9.2 7l.6-4.2h4.4L14.8 7M9.2 17l.6 4.2h4.4l.6-4.2"/><path d="M12 9.6V12l1.7 1.1"/></svg>`,
  'أساور': `<svg viewBox="0 0 24 24" ${S}><rect x="2.8" y="14.2" width="8.6" height="5.6" rx="2.8" transform="rotate(-45 7.1 17)"/><rect x="12.6" y="4.2" width="8.6" height="5.6" rx="2.8" transform="rotate(-45 16.9 7)"/><path d="M9.5 14.5l5-5"/></svg>`,
  'سلاسل': `<svg viewBox="0 0 24 24" ${S}><path d="M4.5 3c0 7.2 3.4 11.5 7.5 11.5s7.5-4.3 7.5-11.5"/><path d="M12 14.5v2.3"/><path d="m12 21-2.1-2.9L12 15l2.1 3.1z"/></svg>`,
  'عطور': `<svg viewBox="0 0 24 24" ${S}><rect x="6" y="9.5" width="12" height="11" rx="2.5"/><path d="M10 9.5V7a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 14 7v2.5"/><path d="M12 2.5v3"/><circle cx="18" cy="3.5" r="1" fill="currentColor" stroke="none"/><circle cx="21" cy="6" r="1" fill="currentColor" stroke="none"/></svg>`,
  'عطور نسائية': `<svg viewBox="0 0 24 24" ${S}><rect x="6" y="9.5" width="12" height="11" rx="2.5"/><path d="M10 9.5V7a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 14 7v2.5"/><path d="M12 2.5v3"/><circle cx="18" cy="3.5" r="1" fill="currentColor" stroke="none"/><circle cx="21" cy="6" r="1" fill="currentColor" stroke="none"/></svg>`,
  'عطور رجالية': `<svg viewBox="0 0 24 24" ${S}><rect x="6" y="9.5" width="12" height="11" rx="2.5"/><path d="M10 9.5V7a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 14 7v2.5"/><path d="M12 2.5v3"/><circle cx="18" cy="3.5" r="1" fill="currentColor" stroke="none"/><circle cx="21" cy="6" r="1" fill="currentColor" stroke="none"/></svg>`,
  'أغراض رجالية': `<svg viewBox="0 0 24 24" ${S}><circle cx="6.5" cy="14" r="3.3"/><circle cx="17.5" cy="14" r="3.3"/><path d="M9.8 14h4.4"/><path d="M3.2 14 4.3 8h4M20.8 14 19.7 8h-4"/></svg>`,
  'نظارات': `<svg viewBox="0 0 24 24" ${S}><circle cx="6.5" cy="14" r="3.3"/><circle cx="17.5" cy="14" r="3.3"/><path d="M9.8 14h4.4"/><path d="M3.2 14 4.3 8h4M20.8 14 19.7 8h-4"/></svg>`,
  'حقائب': `<svg viewBox="0 0 24 24" ${S}><rect x="3" y="7.5" width="18" height="13" rx="2.5"/><path d="M9 7.5v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>`,
  'علب وتغليف': `<svg viewBox="0 0 24 24" ${S}><path d="M21 15.5V8.4a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4a2 2 0 0 0-1 1.7v7.1a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7z"/><path d="M3.3 7.2 12 12l8.7-4.8M12 21.5V12"/></svg>`,
  'دباديب': `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="13.5" r="5.8"/><circle cx="6" cy="8" r="2.1"/><circle cx="18" cy="8" r="2.1"/><circle cx="10" cy="12.6" r=".7" fill="currentColor" stroke="none"/><circle cx="14" cy="12.6" r=".7" fill="currentColor" stroke="none"/><ellipse cx="12" cy="15" rx="1.1" ry=".9" fill="currentColor" stroke="none"/><path d="M12 16v1.6M10.6 18.4c.5.6 2.3.6 2.8 0"/></svg>`,
  'الكل': `<svg viewBox="0 0 24 24" ${S}><path d="M12 3.5l1.7 4.3 4.3 1.7-4.3 1.7L12 15.5l-1.7-4.3L6 9.5l4.3-1.7z"/><path d="M18.5 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/></svg>`,
  'default': `<svg viewBox="0 0 24 24" ${S}><path d="M6.2 7.5h11.6l1.1 12a1.8 1.8 0 0 1-1.8 2H6.9a1.8 1.8 0 0 1-1.8-2z"/><path d="M9 10.5V6a3 3 0 0 1 6 0v4.5"/></svg>`
};
const icon = n => ICONS[n] || ICONS['default'];

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

const imgURL = u => (u || '').replace(/^\/+/, '');
const catById = id => cats.find(c => c.id === id);
const mainCats = () => cats.filter(c => !c.parent_id).sort((a,b)=>a.sort_order-b.sort_order);
const subsOf = id => cats.filter(c => c.parent_id === id).sort((a,b)=>a.sort_order-b.sort_order);
const money = n => Number(n).toLocaleString('en-US') + t('currency');
const isNew = p => p.created_at && (Date.now() - new Date(p.created_at)) < 14*864e5;
const soldOut = p => !p.product_variants?.length || p.product_variants.every(v => v.stock <= 0);
const catLabel = p => {
  const c = catById(p.subcategory_id) || catById(p.category_id);
  return c ? `<span class="cat-ic">${icon(c.name)}</span>${c.name}` : `<span class="cat-ic">${icon('default')}</span>`;
};

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
  const cards = mainCats().map(c => `
    <div class="cat-card ${view==='cat' && catId===c.id ? 'active':''}" onclick="openCat(${c.id})">
      ${c.image_url
        ? `<img src="${imgURL(c.image_url)}" alt="${c.name}" loading="lazy" onerror="this.style.display='none'"><div class="ph" style="display:none">${icon(c.name)}</div>`
        : `<div class="ph">${icon(c.name)}</div>`}
      <div class="ov"><b>${c.name}</b></div>
    </div>`).join('');
  /* نكرر البلوكات مرتين — أساس الالتفاف اللانهائي */
  $('#cat-grid').innerHTML = `
    <div class="cat-strip">
      <div class="cat-track">${cards}${cards}</div>
    </div>`;
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
        <div class="sq">${icon('الكل')}</div><span>${t('allCats')}</span>
      </button>
      ${subs.map(s => `
      <button class="sub-card ${subId===s.id?'active':''}" onclick="openSub(${s.id})">
        <div class="sq">${s.image_url
          ? `<img src="${imgURL(s.image_url)}" alt="${s.name}" loading="lazy" onerror="this.remove()">`
          : icon(s.name)}</div><span>${s.name}</span>
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
      <span class="cur"><span class="cat-ic">${icon(main.name)}</span>${main.name}${sub ? ' / '+sub.name : ''}</span>
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
           <div class="ph" style="display:none">${icon('default')}</div>`
        : `<div class="ph">${icon('default')}</div>`}
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
           <div class="ph" style="display:none">${icon('default')}</div>`
        : `<div class="ph">${icon('default')}</div>`}
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