/* =========================================================
   重庆科技大学食堂服务平台 - 交互逻辑（原生 JS，无框架）
   模块：轮播 / 食堂导航与路由 / 营业时间 / 菜品展示（筛选+排序+收藏）
        今日菜单 / 店铺总览 / 特色招牌 / 评价弹幕（打星）
        菜品详情（规格+数量）/ 登录注册 / 汉堡菜单 / 提前点单（购物车 localStorage）
   ========================================================= */

/* ---------- 工具 ---------- */
const $ = (s, p) => (p || document).querySelector(s);
const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => '¥' + (n % 1 === 0 ? n : n.toFixed(1));

function load(key, def) { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch (e) { return def; } }
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
function todayStr() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
const WEEK_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- 数据索引 ---------- */
const shopMap = {}; SHOPS.forEach(s => shopMap[s.id] = s);
const canteenMap = {}; CANTEENS.forEach(c => canteenMap[c.id] = c);
const dishMap = {}; DISHES.forEach(d => dishMap[d.id] = d);
const shopOf = d => shopMap[d.shop];
const canteenOf = d => canteenMap[shopMap[d.shop].canteen];
const dishFrom = dish => dishMap[dish] || dish; // 兼容传 id 或对象

/* ---------- 收藏 ---------- */
let FAVS = new Set(load('cqust_favs', []));
function persistFavs() { save('cqust_favs', [...FAVS]); }
function toggleFav(id) {
  if (FAVS.has(id)) { FAVS.delete(id); toast('已取消收藏'); }
  else { FAVS.add(id); toast('已加入收藏 ❤'); }
  persistFavs();
  $$('.heart[data-id="' + id + '"]').forEach(b => { b.classList.toggle('on', FAVS.has(id)); b.textContent = FAVS.has(id) ? '❤' : '♡'; });
  $('#favCount').textContent = FAVS.size;
  if ($('#favOnly').checked) renderDishGrid();
}

/* ---------- 评价数据（预置 + 用户提交） ---------- */
function userReviews() { return load('cqust_user_reviews', []); }
function reviewsOf(dishId) {
  const rs = (REVIEWS[dishId] || []).concat(userReviews().filter(r => r.dish === dishId));
  // 打星从五星到一星依次展示（弹幕先弹好评）
  return rs.slice().sort((a, b) => b.stars - a.stars);
}
function avgStars(dishId) {
  const rs = reviewsOf(dishId);
  if (!rs.length) return 0;
  return (rs.reduce((s, r) => s + r.stars, 0) / rs.length);
}
function starsText(v) {
  const full = Math.round(v);
  return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
}
function rateCountToday() { const r = load('cqust_rate', { date: '', count: 0 }); return r.date === todayStr() ? r.count : 0; }
function rateLeft() { return Math.max(0, 3 - rateCountToday()); }
function updateRateUI() {
  $('#rateLeft').textContent = rateLeft();
  $('#rateChance').innerHTML = '今日还可评价 <strong>' + rateLeft() + '</strong> / 3 次';
}

/* ---------- 菜品卡片模板 ---------- */
function dishCard(d, opts) {
  opts = opts || {};
  const shop = shopOf(d), ct = canteenOf(d);
  const special = (d.weekSpecial || []).includes(new Date().getDay())
    ? '<span class="special">' + WEEK_CN[new Date().getDay()] + '特供</span>' : '';
  const fav = FAVS.has(d.id);
  const meals = d.meals.map(m => ({ 早: '早餐', 午: '午餐', 晚: '晚餐' }[m])).join(' / ');
  return '<div class="dish-card" data-dish="' + d.id + '">' +
    '<div class="pic" data-detail="' + d.id + '">' +
      '<img loading="lazy" src="' + d.image + '" alt="' + esc(d.name) + '">' +
      '<span class="tag tag-' + esc(d.tag) + '">' + esc(d.tag) + '</span>' + special +
      '<button class="heart' + (fav ? ' on' : '') + '" data-id="' + d.id + '" title="收藏">' + (fav ? '❤' : '♡') + '</button>' +
    '</div>' +
    '<div class="body">' +
      '<h4 data-detail="' + d.id + '">' + esc(d.name) + '</h4>' +
      '<p class="from">' + shop.name + ' · ' + ct.name + ' ｜ ' + meals + '</p>' +
      '<div class="foot"><span class="price"><small>¥</small>' + d.price + '</span>' +
      '<span class="stars">' + (avgStars(d.id) ? starsText(avgStars(d.id)) : '暂无评分') + '</span></div>' +
      (opts.addBtn ? '<button class="add-btn" data-add="' + d.id + '">＋ 加入点单</button>' : '') +
    '</div>' +
  '</div>';
}

/* 全局点击代理：收藏 / 查看详情 / 加入点单 / 打开评价弹幕 */
document.addEventListener('click', e => {
  const heart = e.target.closest('.heart');
  if (heart) { e.stopPropagation(); toggleFav(heart.dataset.id); return; }
  const detail = e.target.closest('[data-detail]');
  if (detail) { openDishDetail(detail.dataset.detail); return; }
  const add = e.target.closest('[data-add]');
  if (add) { addToOrder(add.dataset.add); return; }
  const rcard = e.target.closest('.review-card');
  if (rcard) { openDanmaku(rcard.dataset.dish); return; }
});

/* =========================================================
   1. 轮播 Banner
   ========================================================= */
let slideIdx = 0, slideTimer;
function renderCarousel() {
  $('#carouselSlides').innerHTML = BANNERS.map(b =>
    '<div class="carousel-slide"><img src="' + b.image + '" alt="' + esc(b.title) + '">' +
    '<div class="slide-mask"></div>' +
    '<div class="slide-info"><span class="slide-tag">' + esc(b.tag) + '</span>' +
    '<h2>' + esc(b.title) + '</h2><ul>' + b.lines.map(l => '<li>' + esc(l) + '</li>').join('') + '</ul></div></div>'
  ).join('');
  $('#carouselDots').innerHTML = BANNERS.map((_, i) => '<span data-i="' + i + '"></span>').join('');
  $('#noticeText').textContent = '【临时检修】二食堂三楼档口 10月8日-10日 停业检修　　【国庆安排】10月1日-7日 仅二食堂一楼开放（10:30-19:00）　　【欢迎】支持提前点单领号，错峰就餐更轻松　　';
  $('#carouselDots').addEventListener('click', e => { if (e.target.dataset.i != null) showSlide(+e.target.dataset.i); });
  showSlide(0);
  slideTimer = setInterval(nextSlide, 5000);
  $('#carouselPrev').onclick = () => { nextSlide(-1); };
  $('#carouselNext').onclick = () => nextSlide(1);
  $('#carousel').addEventListener('mouseenter', () => clearInterval(slideTimer));
  $('#carousel').addEventListener('mouseleave', () => { clearInterval(slideTimer); slideTimer = setInterval(nextSlide, 5000); });
}
function showSlide(i) {
  slideIdx = (i + BANNERS.length) % BANNERS.length;
  $('#carouselSlides').style.transform = 'translateX(-' + slideIdx * 100 + '%)';
  $$('#carouselDots span').forEach((d, j) => d.classList.toggle('on', j === slideIdx));
}
function nextSlide(dir) { showSlide(slideIdx + (dir === -1 ? -1 : 1)); }

/* =========================================================
   2. 食堂导航 & 3. 营业时间
   ========================================================= */
function renderCanteens() {
  $('#canteenGrid').innerHTML = CANTEENS.map(c =>
    '<div class="canteen-card" data-go="' + c.id + '">' +
      '<div class="cover"><img loading="lazy" src="' + c.image + '" alt="' + esc(c.name) + '"><span class="badge">进入食堂 →</span></div>' +
      '<div class="body"><h3>' + esc(c.name) + '<small>' + esc(c.alias) + '</small></h3>' +
      '<p class="loc">📍 ' + esc(c.location) + '</p>' +
      '<p>' + esc(c.desc) + '</p>' +
      '<div class="mini-hours"><span>早 ' + c.hours['早'].split(' ')[0] + '</span><span>午 ' + c.hours['午'].split(' ')[0] + '</span><span>晚 ' + c.hours['晚'].split(' ')[0] + '</span></div>' +
      '</div></div>'
  ).join('');
  $('#canteenGrid').addEventListener('click', e => {
    const card = e.target.closest('[data-go]');
    if (card) location.hash = '#/canteen/' + card.dataset.go;
  });
}
function renderHours() {
  $('#hoursGrid').innerHTML = CANTEENS.map(c =>
    '<div class="hours-card"><h3>' + esc(c.name) + ' <small style="color:var(--ink-2);font-weight:normal">· ' + esc(c.alias) + '</small></h3>' +
    '<p class="sub">📍 ' + esc(c.location) + '</p>' +
    '<div class="hours-row"><span class="t">🌅 早餐</span><span class="v">' + c.hours['早'] + '</span></div>' +
    '<div class="hours-row"><span class="t">🍛 午餐</span><span class="v">' + c.hours['午'] + '</span></div>' +
    '<div class="hours-row"><span class="t">🌙 晚餐</span><span class="v">' + c.hours['晚'] + '</span></div>' +
    '<div class="hours-row"><span class="t">节假日</span><span class="v closed">休息</span></div>' +
    '</div>'
  ).join('');
  $('#holidayNotice').textContent = '📌 ' + HOLIDAY_NOTICE;
}

/* =========================================================
   4. 菜品展示（口味筛选 + 价格排序 + 收藏）
   ========================================================= */
let tasteFilter = '全部';
function renderDishGrid() {
  let list = DISHES.slice();
  if (tasteFilter !== '全部') list = list.filter(d => d.tag === tasteFilter);
  if ($('#favOnly').checked) list = list.filter(d => FAVS.has(d.id));
  // 商品价格排序
  const mode = $('#dishSort').value;
  if (mode === 'asc') list.sort((a, b) => a.price - b.price);
  if (mode === 'desc') list.sort((a, b) => b.price - a.price);
  $('#dishGrid').innerHTML = list.length
    ? list.map(d => dishCard(d)).join('')
    : '<p class="empty-tip" style="grid-column:1/-1">没有符合条件的菜品～</p>';
}

/* =========================================================
   5. 今日菜单
   ========================================================= */
let mealTab = '早';
function renderToday() {
  const d = new Date();
  $('#todayDate').textContent = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 · ' + WEEK_CN[d.getDay()];
  const list = DISHES.filter(x => x.meals.includes(mealTab));
  $('#todayGrid').innerHTML = list.map(x => dishCard(x, { addBtn: true })).join('');
}

/* =========================================================
   板块一：店铺与菜品总览
   ========================================================= */
let shopCanteenFilter = 0; // 0=全部
function renderShopFilter() {
  $('#shopCanteenFilter').innerHTML =
    '<button class="chip' + (shopCanteenFilter === 0 ? ' active' : '') + '" data-c="0">全部食堂</button>' +
    CANTEENS.map(c => '<button class="chip' + (shopCanteenFilter === c.id ? ' active' : '') + '" data-c="' + c.id + '">' + esc(c.name) + '</button>').join('');
}
function renderShops() {
  const shops = SHOPS.filter(s => !shopCanteenFilter || s.canteen === shopCanteenFilter);
  $('#shopList').innerHTML = shops.map(s => {
    const ct = canteenMap[s.canteen];
    const dishes = DISHES.filter(d => d.shop === s.id);
    return '<div class="shop-block">' +
      '<div class="shop-head"><img loading="lazy" src="' + s.image + '" alt="' + esc(s.name) + '">' +
        '<div><h3>' + esc(s.name) + '</h3>' +
        '<p class="shop-meta">' + esc(ct.name) + '（' + esc(ct.alias) + '）· ' + esc(ct.location) + ' · 共 ' + dishes.length + ' 道菜品</p>' +
        '<p class="shop-desc">' + esc(s.desc) + '</p></div>' +
        '<button class="btn-ghost order-link" data-shop-pick="' + s.id + '">去点单 →</button>' +
      '</div>' +
      '<div class="shop-dishes">' + dishes.map(d => dishCard(d, { addBtn: true })).join('') + '</div>' +
    '</div>';
  }).join('');
  $$('#shopCanteenFilter .chip').forEach(ch => ch.onclick = () => { shopCanteenFilter = +ch.dataset.c; renderShopFilter(); renderShops(); });
  $$('#shopList .order-link').forEach(b => b.onclick = () => { pickShopInOrder(b.dataset.shopPick); location.hash = '#order'; });
}

/* =========================================================
   板块二：特色招牌
   ========================================================= */
let sigTab = 'manager';
const SIG_META = {
  manager: { title: '👑 店长推荐', sub: '店铺管理人员推荐 · 最好吃的' },
  value: { title: '💰 高性价比', sub: '兼具味道与合适的价格' },
  student: { title: '🎓 同学推荐', sub: '同学 / 食堂顾客的人气之选' }
};
function renderSignature() {
  const list = DISHES.filter(d => d.sig && d.sig[sigTab]);
  $('#sigGrid').innerHTML = list.map(d => {
    const shop = shopOf(d), ct = canteenOf(d);
    return '<div class="sig-card">' +
      '<div class="pic"><img loading="lazy" src="' + d.image + '" alt="' + esc(d.name) + '"><span class="crown">' + SIG_META[sigTab].title + '</span></div>' +
      '<div class="body"><h4>' + esc(d.name) + '</h4>' +
      '<p class="from">' + shop.name + ' · ' + ct.name + ' ｜ 口味：' + esc(d.tag) + '</p>' +
      '<p class="quote">“' + esc(d.sig[sigTab]) + '”</p>' +
      '<div class="foot"><span class="price"><small>¥</small>' + d.price + '</span>' +
      '<span class="stars">' + starsText(avgStars(d.id)) + '</span></div>' +
      '<button class="add-btn" data-add="' + d.id + '">＋ 加入点单</button></div></div>';
  }).join('') || '<p class="empty-tip" style="grid-column:1/-1">该类招牌整理中…</p>';
  $$('#sigTabs .sig-tab').forEach(t => t.onclick = () => {
    sigTab = t.dataset.sig;
    $$('#sigTabs .sig-tab').forEach(x => x.classList.toggle('active', x === t));
    renderSignature();
  });
}

/* =========================================================
   板块三：顾客评价（弹幕）
   ========================================================= */
function renderReviewCanteenFilter() {
  $('#reviewCanteenFilter').innerHTML =
    '<button class="chip active" data-c="0">全部食堂</button>' +
    CANTEENS.map(c => '<button class="chip" data-c="' + c.id + '">' + esc(c.name) + '</button>').join('');
  $$('#reviewCanteenFilter .chip').forEach(ch => ch.onclick = () => {
    $$('#reviewCanteenFilter .chip').forEach(x => x.classList.remove('active'));
    ch.classList.add('active');
    renderReviews(+ch.dataset.c);
  });
}
function renderReviews(canteenId) {
  let list = canteenId ? DISHES.filter(d => canteenOf(d).id === canteenId)
                       : DISHES.filter(d => reviewsOf(d.id).length > 0);
  $('#reviewGrid').innerHTML = list.map(d => {
    const avg = avgStars(d.id), n = reviewsOf(d.id).length;
    return '<div class="review-card" data-dish="' + d.id + '">' +
      '<div class="pic"><img loading="lazy" src="' + d.image + '" alt="' + esc(d.name) + '"><span class="count">' + (n ? '💬 ' + n + ' 条评价' : '🙋 抢首评') + '</span></div>' +
      '<div class="body"><h4>' + esc(d.name) + '</h4>' +
      '<p class="from">' + shopOf(d).name + ' · ' + canteenOf(d).name + '</p>' +
      '<div class="avg"><span class="stars">' + (n ? starsText(avg) : '☆☆☆☆☆') + '</span><b>' + (n ? avg.toFixed(1) : '暂无') + '</b><span style="font-size:12px;color:var(--ink-2)">/ 5.0</span></div>' +
      '<p class="cta">🖱️ 点击查看弹幕评价 & 写评价</p></div></div>';
  }).join('') || '<p class="empty-tip" style="grid-column:1/-1">该食堂暂无评价</p>';
}

/* ---------- 弹幕弹窗 ---------- */
let danmakuTimer = null, currentDish = null, pickedStars = 0;
function openDanmaku(dishId) {
  currentDish = dishId;
  const d = dishMap[dishId];
  const avg = avgStars(dishId);
  $('#danmakuDish').innerHTML =
    '<img src="' + d.image + '" alt=""><div>' +
    '<h3>' + esc(d.name) + '<span class="price">' + money(d.price) + '</span></h3>' +
    '<p class="meta">' + shopOf(d).name + ' · ' + canteenOf(d).name + ' ｜ 口味：' + esc(d.tag) +
    ' ｜ <span style="color:#e3a23a">' + starsText(avg) + '</span> ' + (avg ? avg.toFixed(1) + ' 分（' + reviewsOf(dishId).length + ' 条）' : '暂无评分') + '</p></div>';
  $('#danmakuModal').hidden = false;
  document.body.style.overflow = 'hidden';
  // 已登录则自动带上昵称
  const u = currentUser();
  if (u) $('#reviewUser').value = u.nick;
  updateRateUI();
  startDanmaku();
}
function closeDanmaku() {
  $('#danmakuModal').hidden = true;
  document.body.style.overflow = '';
  stopDanmaku();
  resetReviewForm();
}
function startDanmaku() {
  stopDanmaku();
  const stage = $('#danmakuStage');
  stage.querySelectorAll('.dm-item').forEach(el => el.remove());
  const list = reviewsOf(currentDish);
  if (!list.length) {
    $('#stageTip').hidden = false;
    $('#stageTip').textContent = '😶 暂无评价，快来抢沙发写下第一条真实评价吧！';
    return;
  }
  $('#stageTip').hidden = true;
  const tints = ['rgba(141,91,63,.30)', 'rgba(192,57,43,.26)', 'rgba(95,156,138,.30)', 'rgba(227,162,58,.26)', 'rgba(255,255,255,.14)'];
  let i = 0;
  const spawn = () => {
    const r = list[i % list.length];
    const el = document.createElement('div');
    el.className = 'dm-item';
    el.style.top = (8 + Math.random() * 68) + '%';
    el.style.animationDuration = (7 + Math.random() * 4) + 's';
    el.style.background = tints[i % tints.length];
    el.innerHTML = '<b>' + esc(r.user || '匿名同学') + '</b><i>' + '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars) + '</i>' +
      esc(r.text) + '<small>' + esc(r.time || '') + '</small>';
    el.addEventListener('animationend', () => el.remove());
    stage.appendChild(el);
    i++;
    if (i >= list.length) clearInterval(danmakuTimer);
  };
  spawn();
  danmakuTimer = setInterval(spawn, 1600);
}
function stopDanmaku() { clearInterval(danmakuTimer); danmakuTimer = null; }

/* ---------- 写评价 ---------- */
function resetReviewForm() {
  pickedStars = 0;
  $$('#starPicker .star-pick').forEach(s => s.classList.remove('on'));
  $('#starHint').textContent = '点击打星（满星 5 颗）';
  $('#reviewText').value = '';
}
$$('#starPicker .star-pick').forEach(s => {
  s.onclick = () => {
    pickedStars = +s.dataset.v;
    $$('#starPicker .star-pick').forEach((x, i) => x.classList.toggle('on', i < pickedStars));
    $('#starHint').textContent = pickedStars + ' 星 · ' + ['尚需努力', '一般般', '还不错', '很好吃', '绝绝子！'][pickedStars - 1];
  };
});
$('#submitReview').onclick = () => {
  if (rateLeft() <= 0) { toast('今天 3 次评价机会已用完，明天再来吧～'); return; }
  if (!pickedStars) { toast('请先点击星星打分（1-5 星）'); return; }
  const text = $('#reviewText').value.trim();
  if (!text) { toast('请写下你的真实评价内容'); return; }
  const list = userReviews();
  const loginUser = currentUser();
  list.push({
    dish: currentDish,
    user: $('#reviewUser').value.trim() || (loginUser ? loginUser.nick : '匿名同学'),
    stars: pickedStars,
    text: text,
    time: '今天 ' + (new Date().getHours() < 11 ? '早餐' : new Date().getHours() < 15 ? '午餐' : '晚餐'),
    date: todayStr()
  });
  save('cqust_user_reviews', list);
  save('cqust_rate', { date: todayStr(), count: rateCountToday() + 1 });
  toast('评价成功！已加入弹幕 🎉');
  resetReviewForm();
  updateRateUI();
  renderReviews(0);
  renderDishGrid(); renderToday(); renderSignature(); // 刷新各处星级
  startDanmaku(); // 立即重播弹幕，看到自己的评价飞过
};
$('#danmakuClose').onclick = closeDanmaku;
$('#danmakuMask').onclick = closeDanmaku;
$('#danmakuReplay').onclick = startDanmaku;

/* =========================================================
   板块四：提前点单
   ========================================================= */
/* 购物车数据用 localStorage 存储，刷新不丢失 */
const orderState = load('cqust_cart', { shop: null, items: {}, slot: null });
function saveCart() { save('cqust_cart', orderState); }
const SLOTS = [];
for (let h = 8; h <= 20; h++) SLOTS.push(String(h).padStart(2, '0') + ':00 - ' + String(h + 1).padStart(2, '0') + ':00');

/* 规格：分量（加价）与辣度（不加价） */
const SIZE_SPECS = [{ key: '小份', delta: 0 }, { key: '大份', delta: 3 }];
const SPICY_SPECS = ['标准辣度', '减辣', '加辣'];
function specPrice(d, spec) { return +(d.price + (spec && spec.indexOf('大份') === 0 ? 3 : 0)).toFixed(1); }
function dishQtyInCart(id) {
  let n = 0;
  Object.values(orderState.items).forEach(it => { if (it.id === id) n += it.qty; });
  return n;
}

function renderOrderSelects() {
  $('#orderCanteen').innerHTML = CANTEENS.map(c => '<option value="' + c.id + '">' + esc(c.name) + '（' + esc(c.alias) + '）</option>').join('');
  fillShopSelect();
  $('#orderCanteen').onchange = fillShopSelect;
  $('#orderShop').onchange = () => { orderState.shop = $('#orderShop').value; orderState.items = {}; saveCart(); renderOrderDishes(); };
}
function fillShopSelect() {
  // 恢复已存购物车时，食堂与档口下拉同步到保存的档口
  const saved = orderState.shop && shopMap[orderState.shop];
  const cid = saved ? saved.canteen : +$('#orderCanteen').value;
  $('#orderCanteen').value = cid;
  $('#orderShop').innerHTML = SHOPS.filter(s => s.canteen === cid)
    .map(s => '<option value="' + s.id + '">' + esc(s.name) + '</option>').join('');
  if (saved && saved.canteen === cid) {
    $('#orderShop').value = orderState.shop;
  } else {
    orderState.shop = $('#orderShop').value;
    orderState.items = {};
    saveCart();
  }
  renderOrderDishes();
}
function pickShopInOrder(shopId) {
  const shop = shopMap[shopId];
  $('#orderCanteen').value = shop.canteen;
  $('#orderShop').innerHTML = SHOPS.filter(s => s.canteen === shop.canteen)
    .map(s => '<option value="' + s.id + '">' + esc(s.name) + '</option>').join('');
  $('#orderShop').value = shopId;
  if (orderState.shop !== shopId) orderState.items = {};
  orderState.shop = shopId;
  saveCart();
  renderOrderDishes();
}
function renderOrderDishes() {
  const dishes = DISHES.filter(d => d.shop === orderState.shop);
  $('#orderDishList').innerHTML = dishes.map(d => {
    const q = dishQtyInCart(d.id);
    return '<div class="order-dish' + (q ? ' picked' : '') + '" data-od="' + d.id + '">' +
    '<img loading="lazy" src="' + d.image + '" alt="">' +
    '<div class="od-info"><h5>' + esc(d.name) + '</h5><p class="od-price">¥' + d.price + ' · ' + esc(d.tag) + '</p></div>' +
    '<div class="qty"><button data-q="-1">−</button><span>' + q + '</span><button data-q="1">＋</button></div>' +
    '</div>';
  }).join('');
  $$('#orderDishList .qty button').forEach(b => b.onclick = () => {
    const id = b.closest('.order-dish').dataset.od;
    const step = +b.dataset.q;
    if (step > 0) { addToOrder(id); return; }
    // 减号：优先减“小份”，没有则减该菜任意一种规格
    const keys = Object.keys(orderState.items).filter(k => orderState.items[k].id === id);
    const key = keys.find(k => orderState.items[k].spec === '小份') || keys[0];
    if (!key) return;
    const it = orderState.items[key];
    if (it.qty <= 1) delete orderState.items[key]; else it.qty--;
    saveCart(); renderOrderDishes(); renderCart();
  });
}
function renderSlots() {
  const nowH = new Date().getHours();
  $('#slotGrid').innerHTML = SLOTS.map((s, i) => {
    const startH = 8 + i;
    const past = startH < nowH;
    return '<button class="slot' + (orderState.slot === s ? ' on' : '') + '" data-slot="' + s + '"' + (past ? ' disabled' : '') + '>' + s + (past ? '<br><small>已过</small>' : '') + '</button>';
  }).join('');
  $$('#slotGrid .slot').forEach(b => b.onclick = () => {
    orderState.slot = b.dataset.slot;
    saveCart();
    $$('#slotGrid .slot').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    renderCart();
  });
}
function renderCart() {
  const keys = Object.keys(orderState.items);
  let total = 0;
  $('#cartItems').innerHTML = keys.length
    ? keys.map(k => {
        const it = orderState.items[k], d = dishMap[it.id];
        total += specPrice(d, it.spec) * it.qty;
        return '<div class="cart-item"><span class="ci-name">' + esc(d.name) +
          '<span class="ci-spec">' + esc(it.spec) + '</span></span>' +
          '<span class="ci-qty">× ' + it.qty + '</span><span class="ci-price">' + money(specPrice(d, it.spec) * it.qty) + '</span></div>';
      }).join('')
    : '<p class="empty-tip">还没有选菜，先挑几样想吃的吧～</p>';
  $('#cartTotal').textContent = '¥' + total.toFixed(1);
  $('#cartSlot').textContent = orderState.slot || '未选择';
}
/* 加入点单：可带规格与数量（来自菜品详情弹窗） */
function addToOrder(dishId, opts) {
  opts = opts || {};
  const d = dishMap[dishId];
  if (shopOf(d).id !== orderState.shop) pickShopInOrder(shopOf(d).id);
  const spec = opts.spec || '小份';
  const key = dishId + '|' + spec;
  const cur = orderState.items[key];
  const qty = (cur ? cur.qty : 0) + (opts.qty || 1);
  orderState.items[key] = { id: dishId, spec, qty };
  saveCart(); renderOrderDishes(); renderCart();
  toast('已加入点单：' + d.name + '（' + spec + ' × ' + qty + '）');
}
$('#submitOrder').onclick = () => {
  const keys = Object.keys(orderState.items);
  if (!keys.length) { toast('请先挑选至少一份菜品'); return; }
  if (!orderState.slot) { toast('请选择就餐时段（8:00 - 21:00）'); return; }
  const orders = load('cqust_orders', []);
  const shop = shopMap[orderState.shop];
  let total = 0;
  const items = keys.map(k => {
    const it = orderState.items[k], d = dishMap[it.id];
    total += specPrice(d, it.spec) * it.qty;
    return { id: d.id, name: d.name, spec: it.spec, qty: it.qty, price: specPrice(d, it.spec) };
  });
  const user = currentUser();
  const order = {
    id: 'o' + Date.now(),
    no: shop.code + '-' + String(orders.length + 1).padStart(3, '0'),
    shopId: shop.id, shopName: shop.name,
    canteen: canteenMap[shop.canteen].name,
    items, total: +total.toFixed(1), slot: orderState.slot,
    by: user ? user.nick : '游客',
    time: todayStr() + ' ' + new Date().toLocaleTimeString('zh-CN', { hour12: false }),
    status: '待取餐'
  };
  orders.unshift(order);
  save('cqust_orders', orders);
  orderState.items = {}; orderState.slot = null;
  saveCart();
  renderOrderDishes(); renderCart(); renderSlots(); renderOrders();
  toast('点单成功！取号 ' + order.no);
};
function renderOrders() {
  const orders = load('cqust_orders', []);
  $('#orderList').innerHTML = orders.length ? orders.map(o =>
    '<div class="order-ticket">' +
    '<span class="no">' + esc(o.no) + '</span>' +
    '<div class="ot-info"><b>' + esc(o.shopName) + '</b>（' + esc(o.canteen) + '）<br>' +
    o.items.map(i => esc(i.name) + ' × ' + i.qty).join('、') + '<br>' +
    '就餐时段：<b>' + esc(o.slot) + '</b> ｜ 合计 <b style="color:var(--red)">' + money(o.total) + '</b> ｜ 下单于 ' + esc(o.time) + '</div>' +
    (o.status === '待取餐' ? '<span class="status">' + esc(o.status) + '</span><button class="cancel" data-cancel="' + o.id + '">取消点单</button>'
      : '<span class="status" style="background:#b08968">已取消</span>') +
    '</div>'
  ).join('') : '<p class="empty-tip">暂无点单记录，去上面领一个号吧！</p>';
  $$('#orderList [data-cancel]').forEach(b => b.onclick = () => {
    const orders = load('cqust_orders', []);
    const o = orders.find(x => x.id === b.dataset.cancel);
    if (o) { o.status = '已取消'; save('cqust_orders', orders); renderOrders(); toast('已取消点单 ' + o.no); }
  });
}

/* =========================================================
   菜品详情弹窗：规格选择（分量 / 辣度）+ 数量选择
   ========================================================= */
const ddState = { id: null, size: '小份', spicy: '标准辣度', qty: 1 };
function openDishDetail(id) {
  const d = dishMap[id];
  if (!d) return;
  ddState.id = id; ddState.size = '小份'; ddState.spicy = '标准辣度'; ddState.qty = 1;
  const shop = shopOf(d), ct = canteenOf(d);
  $('#ddImg').src = d.image;
  $('#ddImg').alt = d.name;
  $('#ddName').textContent = d.name;
  $('#ddMeta').innerHTML = shop.name + ' · ' + ct.name + ' ｜ 口味：' + esc(d.tag) +
    ' ｜ <span style="color:#e3a23a">' + (avgStars(id) ? starsText(avgStars(id)) + ' ' + avgStars(id).toFixed(1) + ' 分' : '暂无评分') + '</span>';
  $('#ddPrice').innerHTML = money(d.price) + ' 起';
  $('#ddDesc').textContent = (d.sig && (d.sig.manager || d.sig.value || d.sig.student))
    ? '推荐理由：' + (d.sig.manager || d.sig.value || d.sig.student)
    : '来自' + ct.name + '「' + shop.name + '」的现做菜品，口味偏' + d.tag + '，支持提前点单免排队。';
  // 分量规格
  $('#specSize').innerHTML = SIZE_SPECS.map(s =>
    '<button class="spec-opt' + (s.key === '小份' ? ' on' : '') + '" data-size="' + s.key + '">' +
    s.key + (s.delta ? ' +¥' + s.delta : '') + '</button>').join('');
  $$('#specSize .spec-opt').forEach(b => b.onclick = () => {
    ddState.size = b.dataset.size;
    $$('#specSize .spec-opt').forEach(x => x.classList.toggle('on', x === b));
    renderDdSum();
  });
  // 辣度规格（清淡 / 甜菜品不显示）
  const spicyShow = d.tag === '辣' || d.tag === '微辣';
  $('#specSpicyGroup').style.display = spicyShow ? '' : 'none';
  $('#specSpicy').innerHTML = SPICY_SPECS.map((s, i) =>
    '<button class="spec-opt' + (i === 0 ? ' on' : '') + '" data-spicy="' + s + '">' + s + '</button>').join('');
  $$('#specSpicy .spec-opt').forEach(b => b.onclick = () => {
    ddState.spicy = b.dataset.spicy;
    $$('#specSpicy .spec-opt').forEach(x => x.classList.toggle('on', x === b));
  });
  $('#dishModal').hidden = false;
  document.body.style.overflow = 'hidden';
  renderDdSum();
}
function renderDdSum() {
  const d = dishMap[ddState.id];
  if (!d) return;
  $('#ddNum').textContent = ddState.qty;
  $('#ddSum').textContent = '¥' + (specPrice(d, ddState.size) * ddState.qty).toFixed(1);
}
$('#ddMinus').onclick = () => { ddState.qty = Math.max(1, ddState.qty - 1); renderDdSum(); };
$('#ddPlus').onclick = () => { ddState.qty = Math.min(99, ddState.qty + 1); renderDdSum(); };
$('#ddAdd').onclick = () => {
  const d = dishMap[ddState.id];
  const spicyShow = d.tag === '辣' || d.tag === '微辣';
  const spec = spicyShow ? ddState.size + ' / ' + ddState.spicy : ddState.size;
  addToOrder(ddState.id, { spec, qty: ddState.qty });
  closeDishModal();
};
function closeDishModal() { $('#dishModal').hidden = true; document.body.style.overflow = ''; }
$('#dishClose').onclick = closeDishModal;
$('#dishMask').onclick = closeDishModal;

/* =========================================================
   登录 / 注册：Tab 切换 + 表单校验（演示数据存 localStorage）
   ========================================================= */
function currentUser() { return load('cqust_user', null); }
function renderAuthArea() {
  const u = currentUser();
  $('#userArea').hidden = !u;
  $('#btnLogin').hidden = !!u;
  if (u) $('#userNick').textContent = u.nick;
}
function closeAuth() { $('#authModal').hidden = true; document.body.style.overflow = ''; }
$('#btnLogin').onclick = () => { $('#authModal').hidden = false; document.body.style.overflow = 'hidden'; };
$('#authClose').onclick = closeAuth;
$('#authMask').onclick = closeAuth;
/* 登录 / 注册 Tab 切换 */
$$('.auth-tab').forEach(t => t.onclick = () => {
  $$('.auth-tab').forEach(x => x.classList.toggle('active', x === t));
  $('#loginForm').classList.toggle('on', t.dataset.tab === 'login');
  $('#regForm').classList.toggle('on', t.dataset.tab === 'register');
});
/* 表单校验辅助：错误时标红字段并显示提示 */
function markField(input, bad) {
  input.closest('.field').classList.toggle('invalid', bad);
  input.classList.toggle('err', bad);
  return !bad;
}
/* 登录校验 */
$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const nameI = $('#loginName'), pwdI = $('#loginPwd');
  let ok = markField(nameI, !nameI.value.trim());
  ok = markField(pwdI, pwdI.value.length < 6) && ok;
  if (!ok) return;
  const users = load('cqust_users', []);
  const name = nameI.value.trim();
  const u = users.find(x => x.sid === name || x.nick === name);
  if (!u) { toast('账号不存在，请先注册'); markField(nameI, true); return; }
  if (u.pwd !== pwdI.value) { toast('密码错误，请重试'); markField(pwdI, true); return; }
  save('cqust_user', { nick: u.nick, sid: u.sid });
  renderAuthArea(); closeAuth();
  toast('欢迎回来，' + u.nick + '！');
});
/* 注册校验 */
$('#regForm').addEventListener('submit', e => {
  e.preventDefault();
  const nickI = $('#regNick'), sidI = $('#regSid'), pwdI = $('#regPwd'), pwd2I = $('#regPwd2');
  let ok = markField(nickI, !nickI.value.trim());
  ok = markField(sidI, !/^\d{11}$/.test(sidI.value.trim())) && ok;
  ok = markField(pwdI, pwdI.value.length < 6) && ok;
  ok = markField(pwd2I, pwd2I.value !== pwdI.value) && ok;
  if (!ok) return;
  if (!$('#regAgree').checked) { toast('请先勾选同意用户协议'); return; }
  const users = load('cqust_users', []);
  if (users.some(x => x.sid === sidI.value.trim())) { toast('该学号已注册，请直接登录'); markField(sidI, true); return; }
  const u = { nick: nickI.value.trim(), sid: sidI.value.trim(), pwd: pwdI.value };
  users.push(u);
  save('cqust_users', users);
  save('cqust_user', { nick: u.nick, sid: u.sid });
  renderAuthArea(); closeAuth();
  toast('注册成功，已自动登录～');
});
$('#btnLogout').onclick = () => {
  localStorage.removeItem('cqust_user');
  renderAuthArea();
  toast('已退出登录');
};

/* =========================================================
   移动端汉堡菜单导航
   ========================================================= */
$('#hamburger').onclick = () => $('.site-header').classList.toggle('nav-open');
$$('#mainNav a').forEach(a => a.addEventListener('click', () => $('.site-header').classList.remove('nav-open')));

/* =========================================================
   路由：首页 / 食堂详情
   ========================================================= */
function route() {
  const m = location.hash.match(/^#\/canteen\/(\d+)/);
  if (m) {
    const c = canteenMap[+m[1]];
    if (!c) { location.hash = '#/'; return; }
    $('#homeView').hidden = true;
    $('#canteenView').hidden = false;
    renderCanteenView(c);
    window.scrollTo(0, 0);
  } else {
    $('#canteenView').hidden = true;
    $('#homeView').hidden = false;
    if (location.hash === '#/' || location.hash === '#') window.scrollTo(0, 0);
  }
}
function renderCanteenView(c) {
  $('#canteenHero').innerHTML =
    '<div class="hero-box"><img src="' + c.image + '" alt="' + esc(c.name) + '"><div class="hero-mask"></div>' +
    '<div class="hero-txt"><h1>' + esc(c.name) + ' · ' + esc(c.alias) + '</h1>' +
    '<p>📍 ' + esc(c.location) + ' ｜ 早 ' + c.hours['早'] + ' ｜ 午 ' + c.hours['午'] + ' ｜ 晚 ' + c.hours['晚'] + '</p></div></div>';
  $('#canteenInfo').innerHTML =
    '<div class="info-cell"><h5>食堂简介</h5><p class="desc">' + esc(c.desc) + '</p></div>' +
    '<div class="info-cell"><h5>档口数量</h5><p>' + SHOPS.filter(s => s.canteen === c.id).length + ' 家档口 · ' + DISHES.filter(d => shopMap[d.shop].canteen === c.id).length + ' 道菜品</p></div>' +
    '<div class="info-cell"><h5>节假日</h5><p style="color:var(--red)">暂停营业（详见首页公告）</p></div>';
  $('#canteenShops').innerHTML = SHOPS.filter(s => s.canteen === c.id).map(s => {
    const dishes = DISHES.filter(d => d.shop === s.id);
    return '<div class="shop-block">' +
      '<div class="shop-head"><img loading="lazy" src="' + s.image + '" alt="">' +
      '<div><h3>' + esc(s.name) + '</h3><p class="shop-meta">共 ' + dishes.length + ' 道菜品 · 营业时间见上方</p>' +
      '<p class="shop-desc">' + esc(s.desc) + '</p></div>' +
      '<button class="btn-ghost order-link" data-shop-pick="' + s.id + '">去点单 →</button></div>' +
      '<div class="shop-dishes">' + dishes.map(d => dishCard(d, { addBtn: true })).join('') + '</div></div>';
  }).join('');
  $$('#canteenShops .order-link').forEach(b => b.onclick = () => { pickShopInOrder(b.dataset.shopPick); location.hash = '#order'; });
}
$('#btnBack').onclick = () => { location.hash = '#/'; };
$('#brandLink').onclick = () => { location.hash = '#/'; };

/* ---------- 导航高亮 ---------- */
const NAV_SECTIONS = ['home', 'canteens', 'hours', 'dishes', 'today', 'shops', 'signature', 'reviews', 'order'];
function initNavSpy() {
  window.addEventListener('scroll', () => {
    if ($('#homeView').hidden) return;
    let cur = 'home';
    for (const id of NAV_SECTIONS) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < 140) cur = id;
    }
    $$('#mainNav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }, { passive: true });
}

/* ---------- 初始化 ---------- */
/* 图片生成接口偶发超时：加载失败的图片自动重试一次 */
document.addEventListener('error', function (e) {
  const t = e.target;
  if (t && t.tagName === 'IMG' && !t.dataset.retried) {
    t.dataset.retried = '1';
    setTimeout(function () { t.src = t.src + (t.src.indexOf('?') > -1 ? '&' : '?') + 'retry=1'; }, 1500);
  }
}, true);

function init() {
  renderCarousel();
  renderCanteens();
  renderHours();
  $('#favCount').textContent = FAVS.size;
  $('#favOnly').onchange = renderDishGrid;
  $('#dishSort').onchange = renderDishGrid; // 价格排序
  $$('#tasteFilter .chip').forEach(ch => ch.onclick = () => {
    tasteFilter = ch.dataset.tag;
    $$('#tasteFilter .chip').forEach(x => x.classList.toggle('active', x === ch));
    renderDishGrid();
  });
  renderDishGrid();
  $$('#mealTabs .meal-tab').forEach(t => t.onclick = () => {
    mealTab = t.dataset.meal;
    $$('#mealTabs .meal-tab').forEach(x => x.classList.toggle('active', x === t));
    renderToday();
  });
  renderToday();
  renderShopFilter();
  renderShops();
  renderSignature();
  renderReviewCanteenFilter();
  renderReviews(0);
  updateRateUI();
  // 恢复购物车：已过时段自动清空
  if (orderState.slot) {
    const startH = parseInt(orderState.slot, 10);
    if (startH < new Date().getHours()) { orderState.slot = null; saveCart(); }
  }
  renderAuthArea();
  renderOrderSelects();
  renderSlots();
  renderCart();
  renderOrders();
  initNavSpy();
  window.addEventListener('hashchange', route);
  route();
}
init();
