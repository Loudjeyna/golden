/* ═══ الاتصال ═══ */
const SUPABASE_URL = 'https://cqkbqcvjjrirbrkyodbv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vFSo6qX4xD4wLLSPPTJhLA_KSIslSqu';   // ← ★ Publishable key ★

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const $ = s => document.querySelector(s);

let products = [], cats = [];
let view = 'home', catId = null, subId = null;
let current = null, selVariant = 0, qty = 1;
let cart = JSON.parse(localStorage.getItem('dz_cart') || '[]');

/* توحيد مسارات الصور: تعمل مع /images/.. و https://.. معاً */
const imgURL = u => (u || '').replace(/^\/+/, '');
const catById = id => cats.find(c => c.id === id);
const mainCats = () => cats.filter(c => !c.parent_id).sort((a,b)=>a.sort_order-b.sort_order);
const subsOf = id => cats.filter(c => c.parent_id === id).sort((a,b)=>a.sort_order-b.sort_order);
const money = n => Number(n).toLocaleString('en-US') + ' دج';
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
    <div class="sub-title">مجموعات داخل «${catById(catId).name}»:</div>
    <div class="sub-strip">
      <button class="sub-card ${!subId?'active':''}" onclick="openSub(null)">
        <div class="sq">✨</div><span>الكل</span>
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
    head.innerHTML = `<div class="sec-head"><h2>✨ وصل حديثاً</h2></div>`;
    const list = products.slice(0, 8);
    grid.innerHTML = list.length ? list.map(cardHTML).join('')
      : '<div class="empty">لا توجد منتجات بعد 🌱</div>';
    return;
  }
  const main = catById(catId), sub = subId ? catById(subId) : null;
  head.innerHTML = `
    <div class="crumb">
      <button onclick="goHome()">← كل الأقسام</button>
      <span class="cur">${main.icon} ${main.name}${sub ? ' / '+sub.name : ''}</span>
    </div>`;
  const subsIds = subsOf(catId).map(s => s.id);
  const list = products.filter(p =>
    subId ? p.subcategory_id === subId
          : (p.category_id === catId || subsIds.includes(p.subcategory_id)));
  grid.innerHTML = list.length ? list.map(cardHTML).join('')
    : '<div class="empty">لا توجد منتجات في هذا القسم بعد 🌱</div>';
}

function openCat(id){
  if (view==='cat' && catId===id) { goHome(); return; }
  view='cat'; catId=id; subId=null;
  renderPage();
  document.getElementById('sub-area').scrollIntoView({behavior:'smooth', block:'center'});
}
function openSub(id){ subId=id; renderPage(); }
function goHome(){ view='home'; catId=null; subId=null; renderPage();
  document.getElementById('cats-sec').scrollIntoView({behavior:'smooth'}); }

/* ═══ بطاقة المنتج ═══ */
function cardHTML(p) {
  const vs = p.product_variants || [];
  const prices = vs.map(v => +v.price);
  const min = prices.length ? Math.min(...prices) : 0;
  const out = soldOut(p);
  const badges = [];
  if (out) badges.push('<span class="badge out">نفدت الكمية</span>');
  else if (isNew(p)) badges.push('<span class="badge new">جديد ✨</span>');
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
        <b>${prices.length ? (min===Math.max(...prices) ? money(min) : 'من '+money(min)) : ''}</b>
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
      <p class="m-desc">${p.description || 'لا يوجد وصف لهذا المنتج بعد.'}</p>
      ${p.old_price ? `<div class="card-price" style="margin-bottom:12px"><del>${money(p.old_price)}</del></div>` : ''}
      ${vs.length ? `
        <div class="m-label">اختر الخيار:</div>
        <div class="chips">
          ${vs.map((x,i)=>`<button class="chip ${i===selVariant?'active':''}" ${x.stock<=0?'disabled':''} onclick="pickV(${i})">${x.label} — ${money(x.price)}</button>`).join('')}
        </div>
        ${v && v.stock > 0 && v.stock <= 2 ? `<div class="low">⚡ بقي ${v.stock} فقط!</div>` : ''}
        ${!out ? `
          <div class="qty-row">
            <span>الكمية:</span>
            <div class="stepper">
              <button onclick="setQty(1)">+</button><b id="qty-val">${qty}</b><button onclick="setQty(-1)">−</button>
            </div>
          </div>
          <button class="cta" onclick="addCart()">أضف إلى السلة — <span id="cta-price">${money(v.price*qty)}</span></button>`
        : `<button class="cta" disabled>نفدت الكمية 😔</button>`}`
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
  saveCart(); closeModal(); showToast('تمت الإضافة إلى السلة ✓');
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
  if (!cart.length) { $('#drawer-body').innerHTML = '<div class="empty-cart"><div>🛒</div>سلتك فارغة — ابدئي التسوق!</div>'; return; }
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
    <div class="c-total"><span>المجموع</span><b>${money(total)}</b></div>
    <form onsubmit="checkout(event)">
      <input name="name" placeholder="الاسم الكامل" required>
      <input name="phone" type="tel" placeholder="رقم الهاتف" required>
      <input name="address" placeholder="الولاية / العنوان" required>
      <textarea name="notes" rows="2" placeholder="ملاحظات (اختياري)"></textarea>
      <button id="checkout-btn" class="cta">تأكيد الطلب 🛍️</button>
    </form>`;
}

async function checkout(e){
  e.preventDefault();
  if (!cart.length) return;
  const btn = $('#checkout-btn'); btn.disabled = true; btn.textContent = 'جاري الإرسال...';
  const fd = new FormData(e.target);
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const orderId = crypto.randomUUID();
  const { error } = await db.from('orders').insert({
    id: orderId, customer_name: fd.get('name'), phone: fd.get('phone'),
    address: fd.get('address'), notes: fd.get('notes') || null, total
  });
  if (error) { console.error(error); showToast('تعذر إرسال الطلب، حاولي مجدداً','err'); btn.disabled=false; btn.textContent='تأكيد الطلب'; return; }
  await db.from('order_items').insert(
    cart.map(i => ({ order_id: orderId, product_name: i.name, variant_label: i.label, unit_price: i.price, quantity: i.qty }))
  );
  cart = []; saveCart();
  $('#drawer-body').innerHTML = '<div class="success"><div>🎉</div><h3>تم استلام طلبك بنجاح!</h3><p>سنتصل بك قريباً لتأكيد التفاصيل.</p></div>';
  showToast('وصل طلبك إلى المتجر ✓');
}

/* ═══ إشعارات ═══ */
let toastT;
function showToast(msg, type=''){
  const t = $('#toast'); t.textContent = msg; t.className = 'toast show ' + type;
  clearTimeout(toastT); toastT = setTimeout(()=>t.classList.remove('show'), 2500);
}

/* ═══ التشغيل + البث الحيّ ═══ */
loadAll();
db.channel('store')
  .on('postgres_changes', { event:'*', schema:'public', table:'products' }, loadAll)
  .on('postgres_changes', { event:'*', schema:'public', table:'product_variants' }, loadAll)
  .on('postgres_changes', { event:'*', schema:'public', table:'categories' }, loadAll)
  .subscribe(status => console.log('🔌 حالة البث:', status));
setInterval(loadAll, 30000);