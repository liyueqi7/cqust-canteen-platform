/* =========================================================
   重庆科技大学食堂服务平台 - 数据文件
   食堂 / 店铺 / 菜品 / 招牌 / 顾客评价 / 公告
   ========================================================= */

/* 图片生成：按规范使用 text_to_image 接口，prompt 需 URL 编码 */
function img(prompt, size) {
  size = size || 'square';
  return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
    encodeURIComponent(prompt) + '&image_size=' + size;
}
/* 菜品图 */
function dishImg(en) {
  return img('professional food photography, ' + en + ', close-up, appetizing, warm lighting, Chinese university canteen dish', 'square');
}
/* 店铺门头图 */
function shopImg(en) {
  return img('Chinese university canteen food stall, ' + en + ', realistic photo, bright', 'landscape_4_3');
}

/* ---------------- 轮播 Banner（含公告） ---------------- */
const BANNERS = [
  {
    image: img('wide view of bright modern Chinese university canteen dining hall, students enjoying meals, sunny, realistic photo', 'landscape_16_9'),
    tag: '平台公告',
    title: '欢迎来到重庆科技大学食堂服务平台',
    lines: [
      '全校 4 大食堂、12 家档口，菜品价格透明可查',
      '营业时间：早餐 6:30 起 · 午餐 11:00 起 · 晚餐 17:00 起',
      '支持在线提前点单领号，告别排队拥挤'
    ]
  },
  {
    image: img('Chinese canteen food stalls with steam and colorful dishes counters, realistic photo', 'landscape_16_9'),
    tag: '临时检修通知',
    title: '二食堂三楼档口临时停业检修',
    lines: [
      '检修时间：10月8日 - 10月10日（共3天）',
      '检修期间二食堂一楼、二楼正常营业',
      '给您带来不便，敬请谅解'
    ]
  },
  {
    image: img('delicious assorted Chinese cafeteria dishes spread on table, top view, appetizing', 'landscape_16_9'),
    tag: '节假日安排',
    title: '国庆节假期食堂开放安排',
    lines: [
      '10月1日 - 10月7日：一食堂、三食堂、民族餐厅暂停营业',
      '假期仅开放二食堂一楼，营业时间 10:30 - 19:00',
      '10月8日起全部食堂恢复正常营业'
    ]
  }
];

/* ---------------- 食堂 ---------------- */
const CANTEENS = [
  {
    id: 1,
    name: '第一食堂',
    alias: '禾风餐厅',
    location: '教学区 A 栋旁',
    desc: '离教学楼最近的食堂，出餐快、分量足，麻辣香锅和广式烧腊是招牌。',
    image: img('modern Chinese university canteen dining hall interior, bright windows, wooden tables, students dining, realistic', 'landscape_4_3'),
    hours: { 早: '6:30 - 9:30', 午: '11:00 - 13:30', 晚: '17:00 - 19:30' }
  },
  {
    id: 2,
    name: '第二食堂',
    alias: '锦绣餐厅',
    location: '学生生活区中心广场',
    desc: '全校规模最大、品类最全的食堂，川湘小炒、兰州拉面、轻食沙拉一应俱全。',
    image: img('large Chinese university food court with multiple stalls, warm lighting, lively, realistic', 'landscape_4_3'),
    hours: { 早: '6:30 - 10:00', 午: '10:30 - 13:30', 晚: '16:30 - 20:00' }
  },
  {
    id: 3,
    name: '第三食堂',
    alias: '书香餐厅',
    location: '图书馆北侧',
    desc: '紧邻图书馆的自习友好食堂，环境安静，自选快餐与铁板烧人气最高。',
    image: img('quiet cozy university canteen interior near library, bookshelf corner, green plants, soft light, realistic', 'landscape_4_3'),
    hours: { 早: '7:00 - 9:30', 午: '11:00 - 13:00', 晚: '17:00 - 20:00' }
  },
  {
    id: 4,
    name: '民族餐厅',
    alias: '清真餐厅',
    location: '宿舍区 9 栋一层',
    desc: '清真专用灶具与独立后厨，手抓羊肉饭和大盘鸡拌面广受好评。',
    image: img('elegant halal restaurant interior with ethnic patterns, warm colors, realistic', 'landscape_4_3'),
    hours: { 早: '7:00 - 9:00', 午: '11:30 - 13:30', 晚: '17:30 - 20:00' }
  }
];

const HOLIDAY_NOTICE = '节假日提示：法定节假日全校食堂暂停营业（假期值守仅开放二食堂一楼 10:30 - 19:00）；寒暑假期间仅二食堂一楼开放。请同学们合理安排就餐时间。';

/* ---------------- 店铺（档口） ---------------- */
const SHOPS = [
  { id: 'A', canteen: 1, name: '麻辣香锅坊', code: 'A', desc: '现点现炒，辣度自选，二十年老师傅掌勺。', image: shopImg('spicy Sichuan stir fry food stall with pots of fresh ingredients') },
  { id: 'B', canteen: 1, name: '面面俱到面馆', code: 'B', desc: '手工现擀面条，汤头每日现熬。', image: shopImg('noodle shop stall with chef pulling fresh noodles by hand') },
  { id: 'C', canteen: 1, name: '广式烧腊档', code: 'C', desc: '每日现烧现切，叉烧、烧鸭皮脆肉嫩。', image: shopImg('Cantonese roast meat stall with hanging roast ducks and BBQ pork') },
  { id: 'D', canteen: 1, name: '晨光早餐坊', code: 'D', desc: '现包现蒸，豆浆现磨，早餐一站式。', image: shopImg('breakfast stall with steamer baskets and fresh buns') },
  { id: 'E', canteen: 2, name: '川湘小炒', code: 'E', desc: '猛火快炒，锅气十足，湘味川味任选。', image: shopImg('Sichuan Hunan stir fry kitchen with wok fire flame') },
  { id: 'F', canteen: 2, name: '兰州拉面', code: 'F', desc: '拉面师傅现场甩面，一清二白三红四绿。', image: shopImg('Lanzhou noodle stall with chef stretching dough') },
  { id: 'G', canteen: 2, name: '轻食沙拉站', code: 'G', desc: '低卡低脂，健身减脂同学的首选。', image: shopImg('fresh salad bar with vegetables and fruits') },
  { id: 'H', canteen: 2, name: '砂锅粥铺', code: 'H', desc: '砂锅现煲，绵密生滚，暖胃首选。', image: shopImg('clay pot congee stall with bubbling pots') },
  { id: 'I', canteen: 3, name: '自选快餐', code: 'I', desc: '荤素自选称重计价，十分钟吃完一顿饭。', image: shopImg('canteen self service counter with trays of dishes') },
  { id: 'J', canteen: 3, name: '铁板烧工坊', code: 'J', desc: '铁板滋滋作响，现煎现浇汁。', image: shopImg('teppanyaki iron plate grill stall with sizzling steak') },
  { id: 'K', canteen: 3, name: '甜品烘焙屋', code: 'K', desc: '每日现烤面包与甜品，下午茶救星。', image: shopImg('bakery dessert display with cakes and pastries') },
  { id: 'L', canteen: 4, name: '清真面饭馆', code: 'L', desc: '清真认证食材，西北风味地道。', image: shopImg('halal noodle restaurant counter with lamb dishes') }
];

/* ---------------- 菜品 ----------------
   tag: 辣 / 微辣 / 清淡 / 甜
   meals: 早 / 午 / 晚
   sig: 招牌类型（manager 店长推荐 / value 高性价比 / student 同学推荐）
   weekSpecial: 周几特供（与 Date.getDay() 对应，0=周日） */
const DISHES = [
  /* 一食堂 · 麻辣香锅坊 */
  { id: 'd01', shop: 'A', name: '麻辣香锅（荤素自选）', price: 15.8, tag: '辣', meals: ['午', '晚'], weekSpecial: [3], en: 'spicy Sichuan dry pot with beef slices, lotus root, potato slices, tofu skin and vegetables in metal pan, red chili',
    sig: { manager: '香锅坊二十年老师傅的看家菜，麻辣鲜香一锅端，辣度可以自由选。' } },
  { id: 'd02', shop: 'A', name: '干锅土豆片', price: 8.8, tag: '微辣', meals: ['午', '晚'], en: 'dry pot potato slices with bacon and green pepper in small wok' },
  { id: 'd03', shop: 'A', name: '嫩滑香锅牛肉', price: 18, tag: '辣', meals: ['午', '晚'], en: 'tender beef slices stir fried with dried chili and scallion in hot spicy sauce',
    sig: { value: '18元满满一大份牛肉，腌制嫩滑入味，是香锅店里性价比之王。' } },
  { id: 'd04', shop: 'A', name: '蒜蓉西兰花', price: 6.8, tag: '清淡', meals: ['午', '晚'], en: 'stir fried broccoli with minced garlic on white plate' },
  { id: 'd05', shop: 'A', name: '什锦菌菇锅', price: 13, tag: '清淡', meals: ['午', '晚'], en: 'mixed mushroom pot with enoki, shiitake and vegetables in light broth' },

  /* 一食堂 · 面面俱到面馆 */
  { id: 'd06', shop: 'B', name: '红烧牛肉面', price: 12, tag: '辣', meals: ['午', '晚'], en: 'braised beef noodle soup with chili oil and green onion in ceramic bowl',
    sig: { student: '连吃四天不腻，牛肉给得实在，汤底浓，被同学们评为“回头率第一面”。' } },
  { id: 'd07', shop: 'B', name: '西红柿鸡蛋面', price: 9, tag: '清淡', meals: ['早', '午', '晚'], en: 'tomato and egg noodle soup, glossy red broth, home style' },
  { id: 'd08', shop: 'B', name: '重庆杂酱面', price: 10, tag: '微辣', meals: ['午', '晚'], weekSpecial: [5], en: 'Chongqing noodles with minced pork sauce, peanuts and scallion' },
  { id: 'd09', shop: 'B', name: '清汤抄手', price: 8.5, tag: '清淡', meals: ['午', '晚'], en: 'clear soup wontons with seaweed and egg drop' },

  /* 一食堂 · 广式烧腊档 */
  { id: 'd10', shop: 'C', name: '蜜汁叉烧饭', price: 14, tag: '甜', meals: ['午', '晚'], en: 'honey glazed char siu BBQ pork over rice with green vegetables',
    sig: { manager: '烧腊档每日现烧的蜜汁叉烧，肥瘦相间、蜜香入骨，店长本人最爱。' } },
  { id: 'd11', shop: 'C', name: '白切鸡饭', price: 13, tag: '清淡', meals: ['午', '晚'], en: 'poached white cut chicken over rice with ginger scallion sauce' },
  { id: 'd12', shop: 'C', name: '脆皮烧鸭饭', price: 15, tag: '微辣', meals: ['午', '晚'], en: 'crispy roast duck over rice with dark soy sauce' },
  { id: 'd13', shop: 'C', name: '老火例汤', price: 3.5, tag: '清淡', meals: ['午', '晚'], en: 'slow boiled Chinese herbal soup in white bowl' },

  /* 一食堂 · 晨光早餐坊 */
  { id: 'd14', shop: 'D', name: '鲜肉小笼包（6个）', price: 6, tag: '清淡', meals: ['早'], weekSpecial: [1, 3, 5], en: 'steamed soup dumplings xiaolongbao in bamboo steamer',
    sig: { value: '6元6个皮薄汁多，配一杯2元豆浆不到8元吃到饱，早餐性价比天花板。' } },
  { id: 'd15', shop: 'D', name: '现磨豆浆', price: 2, tag: '清淡', meals: ['早'], en: 'fresh soy milk in glass cup, warm' },
  { id: 'd16', shop: 'D', name: '皮蛋瘦肉粥', price: 5, tag: '清淡', meals: ['早'], en: 'century egg and pork congee in bowl with scallion' },
  { id: 'd17', shop: 'D', name: '茶叶蛋', price: 2, tag: '清淡', meals: ['早'], en: 'tea eggs with marbled brown shell in bowl' },
  { id: 'd18', shop: 'D', name: '鲜肉大包', price: 2.5, tag: '清淡', meals: ['早'], en: 'big steamed pork bun on paper, fluffy' },

  /* 二食堂 · 川湘小炒 */
  { id: 'd19', shop: 'E', name: '回锅肉', price: 13, tag: '辣', meals: ['午', '晚'], en: 'twice cooked pork belly with leek and chili, Sichuan style' },
  { id: 'd20', shop: 'E', name: '宫保鸡丁', price: 12, tag: '微辣', meals: ['午', '晚'], en: 'kung pao chicken with peanuts and dried chili',
    sig: { student: '花生脆、鸡丁嫩、微辣带甜，被同学投票选为“二食堂必点菜”。' } },
  { id: 'd21', shop: 'E', name: '麻婆豆腐', price: 8.8, tag: '辣', meals: ['午', '晚'], en: 'mapo tofu, silky tofu in spicy red sauce with minced beef',
    sig: { manager: '麻辣烫嘴、豆腐不碎，川湘小炒档主理人的招牌功夫菜。' } },
  { id: 'd22', shop: 'E', name: '酸辣土豆丝', price: 6.5, tag: '微辣', meals: ['午', '晚'], en: 'hot and sour shredded potato stir fry, crispy' },
  { id: 'd23', shop: 'E', name: '番茄炒蛋', price: 8, tag: '清淡', meals: ['午', '晚'], en: 'scrambled eggs with tomato, glossy, home style' },

  /* 二食堂 · 兰州拉面 */
  { id: 'd24', shop: 'F', name: '兰州牛肉拉面', price: 11, tag: '微辣', meals: ['早', '午', '晚'], en: 'Lanzhou hand pulled beef noodles, clear broth, radish slices, chili oil',
    sig: { value: '11元一碗正宗牛肉拉面，汤清面韧肉不少，早中晚都能吃到。' } },
  { id: 'd25', shop: 'F', name: '二细加蛋牛肉面', price: 13, tag: '微辣', meals: ['午', '晚'], en: 'thick hand pulled noodles with beef slices and soft egg in clear broth' },
  { id: 'd26', shop: 'F', name: '凉拌牛肉', price: 15, tag: '辣', meals: ['午', '晚'], en: 'cold sliced beef with cilantro and chili oil' },
  { id: 'd27', shop: 'F', name: '现烤羊肉串（5串）', price: 10, tag: '微辣', meals: ['午', '晚'], weekSpecial: [5, 6], en: 'grilled lamb skewers with cumin on charcoal grill' },

  /* 二食堂 · 轻食沙拉站 */
  { id: 'd28', shop: 'G', name: '鸡胸肉牛油果沙拉', price: 12.8, tag: '清淡', meals: ['午', '晚'], en: 'grilled chicken breast salad with avocado and greens in bowl' },
  { id: 'd29', shop: 'G', name: '缤纷水果酸奶碗', price: 9.8, tag: '甜', meals: ['早', '午'], en: 'fruit yogurt bowl with strawberry banana and granola' },
  { id: 'd30', shop: 'G', name: '全麦鸡排三明治', price: 8.8, tag: '清淡', meals: ['早', '午', '晚'], en: 'whole wheat chicken cutlet sandwich cut in half' },
  { id: 'd31', shop: 'G', name: '鲜榨橙汁', price: 6.8, tag: '清淡', meals: ['早', '午', '晚'], en: 'fresh orange juice in cup with orange slices' },

  /* 二食堂 · 砂锅粥铺 */
  { id: 'd32', shop: 'H', name: '皮蛋瘦肉砂锅粥', price: 10, tag: '清淡', meals: ['午', '晚'], en: 'clay pot congee with century egg and minced pork' },
  { id: 'd33', shop: 'H', name: '排骨玉米砂锅粥', price: 12, tag: '清淡', meals: ['午', '晚'], en: 'clay pot congee with pork ribs and sweet corn' },
  { id: 'd34', shop: 'H', name: '鲜虾砂锅粥', price: 15.8, tag: '清淡', meals: ['午', '晚'], en: 'clay pot congee with whole prawns in rich broth',
    sig: { student: '整只大虾给四只，粥底绵密鲜甜，同学们口口相传的“深夜食堂”。' } },
  { id: 'd35', shop: 'H', name: '潮汕砂锅粥双人餐', price: 32, tag: '清淡', meals: ['午', '晚'], en: 'Chaoshan style clay pot seafood congee set for two people' },

  /* 三食堂 · 自选快餐 */
  { id: 'd36', shop: 'I', name: '两荤一素套餐', price: 12.8, tag: '清淡', meals: ['午', '晚'], weekSpecial: [1, 2, 3, 4, 5], en: 'canteen combo tray with two meat dishes one vegetable dish and rice',
    sig: { value: '12.8元两荤一素还送米饭续加，三食堂干饭人的不二之选。' } },
  { id: 'd37', shop: 'I', name: '红烧排骨', price: 9.5, tag: '微辣', meals: ['午', '晚'], en: 'braised pork ribs in brown glossy sauce' },
  { id: 'd38', shop: 'I', name: '鱼香肉丝', price: 7.5, tag: '微辣', meals: ['午', '晚'], en: 'yu xiang shredded pork with wood ear mushroom and carrot' },
  { id: 'd39', shop: 'I', name: '清炒油麦菜', price: 4.2, tag: '清淡', meals: ['午', '晚'], en: 'stir fried green leafy vegetables, simple and fresh' },

  /* 三食堂 · 铁板烧工坊 */
  { id: 'd40', shop: 'J', name: '铁板牛柳', price: 16.8, tag: '微辣', meals: ['午', '晚'], en: 'sizzling iron plate beef strips with onion and smoke',
    sig: { manager: '牛柳现煎现浇黑椒汁，上桌还在滋滋响，档主最推荐的一道硬菜。' } },
  { id: 'd41', shop: 'J', name: '铁板鸡排饭', price: 13.8, tag: '清淡', meals: ['午', '晚'], en: 'sizzling chicken cutlet with rice and vegetables on iron plate' },
  { id: 'd42', shop: 'J', name: '铁板鱿鱼', price: 15.8, tag: '微辣', meals: ['午', '晚'], en: 'sizzling squid on iron plate with savory sauce',
    sig: { student: '鱿鱼Q弹酱香浓郁，一到饭点就排长队，同学推荐度最高的铁板菜。' } },
  { id: 'd43', shop: 'J', name: '铁板豆腐', price: 8.8, tag: '清淡', meals: ['午', '晚'], en: 'sizzling tofu steak on iron plate with sauce' },

  /* 三食堂 · 甜品烘焙屋 */
  { id: 'd44', shop: 'K', name: '葡式蛋挞（2只）', price: 5, tag: '甜', meals: ['早', '午', '晚'], weekSpecial: [6], en: 'Portuguese egg tarts, two pieces, golden custard, flaky crust' },
  { id: 'd45', shop: 'K', name: '芒果班戟', price: 8.8, tag: '甜', meals: ['午', '晚'], en: 'mango pancake dessert with whipped cream inside' },
  { id: 'd46', shop: 'K', name: '红豆软欧包', price: 4.5, tag: '甜', meals: ['早', '午', '晚'], en: 'red bean soft European bread bun' },
  { id: 'd47', shop: 'K', name: '提拉米苏', price: 9.8, tag: '甜', meals: ['午', '晚'], en: 'tiramisu slice dusted with cocoa powder' },

  /* 民族餐厅 · 清真面饭馆 */
  { id: 'd48', shop: 'L', name: '清真牛肉面', price: 11, tag: '微辣', meals: ['早', '午', '晚'], en: 'halal beef noodle soup with cilantro in white bowl' },
  { id: 'd49', shop: 'L', name: '手抓羊肉抓饭', price: 16.8, tag: '清淡', meals: ['午', '晚'], en: 'Xinjiang lamb pilaf with carrot and raisins on plate',
    sig: { manager: '羊肉每日鲜到、米饭油润带甜，是民族餐厅档主最自豪的一道主食。',
            student: '分量足到能吃撑，羊肉没有膻味，同学推荐民族餐厅必吃第一名。' } },
  { id: 'd50', shop: 'L', name: '大盘鸡拌面', price: 14.8, tag: '微辣', meals: ['午', '晚'], weekSpecial: [0, 6], en: 'big plate chicken with wide belt noodles, Xinjiang style' },
  { id: 'd51', shop: 'L', name: '老酸奶粽子', price: 6, tag: '甜', meals: ['午', '晚'], en: 'sweet rice dumpling dessert with yogurt and honey' }
];

/* 给每道菜生成图片 URL（en 为英文图片描述），并附热量估算（千卡） */
const KCAL = {
  d01: 520, d02: 330, d03: 450, d04: 120, d05: 190,
  d06: 560, d07: 470, d08: 520, d09: 360,
  d10: 680, d11: 550, d12: 630, d13: 90,
  d14: 420, d15: 75, d16: 230, d17: 80, d18: 240,
  d19: 560, d20: 470, d21: 340, d22: 200, d23: 250,
  d24: 520, d25: 600, d26: 280, d27: 380,
  d28: 330, d29: 270, d30: 380, d31: 110,
  d32: 300, d33: 390, d34: 360, d35: 880,
  d36: 640, d37: 430, d38: 370, d39: 90,
  d40: 570, d41: 630, d42: 430, d43: 300,
  d44: 310, d45: 350, d46: 260, d47: 390,
  d48: 510, d49: 650, d50: 670, d51: 230
};
DISHES.forEach(function (d) {
  d.image = dishImg(d.en);
  const base = KCAL[d.id] || 300;               // 标准份热量
  d.kcalS = Math.round(base * 0.6 / 5) * 5;     // 小份 ≈ 6 成
  d.kcalL = Math.round(base * 1.4 / 5) * 5;     // 大份 ≈ 1.4 倍
  d.kcal = base;
});

/* ---------------- 便民服务 ---------------- */
/* 各食堂负责人联系方式 */
const CANTEEN_CONTACTS = [
  { canteen: 1, manager: '张建国 主任', phone: '023-6861 2101', duty: '工作日 8:00 - 17:30' },
  { canteen: 2, manager: '李红梅 主任', phone: '023-6861 2102', duty: '周一至周六 8:00 - 18:00' },
  { canteen: 3, manager: '王志强 主任', phone: '023-6861 2103', duty: '工作日 8:30 - 17:30' },
  { canteen: 4, manager: '马阿依莎 主任', phone: '023-6861 2104', duty: '周一至周六 9:00 - 18:00' }
];
/* 高峰期就餐提示 */
const PEAK_TIPS = [
  '午餐 11:30 - 12:30、晚餐 17:30 - 18:30 为全校最高峰，建议提前或延后 20 分钟到食堂。',
  '使用「提前点单领号」选好时段，到店凭取号直接取餐，免去现场排队。',
  '一食堂靠近教学区，课间人流集中；赶时间的同学推荐出餐最快的自选快餐窗口。',
  '错峰小技巧：先占座再打饭，或选择二楼窗口，通常比一楼人少。'
];
/* 失物招领登记（示例数据，实际请到各食堂服务台登记） */
const LOST_FOUND = [
  { icon: '🎧', item: '白色蓝牙耳机（单只）', place: '二食堂二楼 3 号餐桌', time: '09-28 午餐', contact: '二食堂一楼服务台' },
  { icon: '🪪', item: '校园卡（王**同学）', place: '一食堂麻辣香锅坊窗口', time: '09-29 午餐', contact: '一食堂张主任' },
  { icon: '🌂', item: '黑色长柄伞', place: '三食堂自习角', time: '09-27 晚餐', contact: '三食堂一楼服务台' },
  { icon: '🧣', item: '灰色围巾', place: '民族餐厅 2 号桌', time: '09-26 晚餐', contact: '民族餐厅服务台' }
];

/* ---------------- 顾客评价（弹幕素材） ---------------- */
const REVIEWS = {
  d01: [
    { user: '川渝胃妹子', stars: 5, text: '微辣就很够味了！藕片土豆吸满汤汁，必点回旋！', time: '昨天 午餐' },
    { user: '干饭人老王', stars: 4, text: '分量很足，两个人吃一份刚好，就是高峰期要排一会。', time: '09-28 晚餐' },
    { user: '2023级小李', stars: 5, text: '牛肉给得多，麻辣香锅yyds！', time: '09-27 午餐' }
  ],
  d03: [
    { user: '运动系阿伟', stars: 5, text: '18块这么大一盆牛肉，练完吃的这顿太值了。', time: '昨天 晚餐' },
    { user: '清淡饮食派', stars: 3, text: '稍微有点咸，建议师傅收一点点盐。', time: '09-29 午餐' }
  ],
  d06: [
    { user: '早起鸟', stars: 5, text: '汤底浓郁，牛肉炖得软烂，一周必吃三次。', time: '昨天 午餐' },
    { user: '图书馆常驻', stars: 5, text: '出餐特别快，赶时间也能吃上热乎的。', time: '09-29 午餐' },
    { user: '干饭第一名', stars: 4, text: '希望辣度再分一档，中辣有点顶。', time: '09-28 晚餐' },
    { user: '奶茶续命君', stars: 5, text: '面量够大，女生吃一半就饱了，性价比可以。', time: '09-26 午餐' }
  ],
  d10: [
    { user: '恰饭少女', stars: 5, text: '叉烧肥瘦刚好，蜜汁甜而不腻，配上例汤绝了。', time: '昨天 午餐' },
    { user: '学霸小张', stars: 4, text: '米饭可以再多点哈哈，味道没得挑。', time: '09-29 午餐' }
  ],
  d14: [
    { user: '早起鸟', stars: 5, text: '6块钱6个小笼包还有汤汁，早餐界的天花板。', time: '昨天 早餐' },
    { user: '2024级小赵', stars: 5, text: '现蒸出炉，皮特别薄，蘸醋绝配。', time: '09-29 早餐' }
  ],
  d20: [
    { user: '干饭人老王', stars: 5, text: '花生超级脆，鸡丁嫩，甜辣平衡得很好。', time: '昨天 午餐' },
    { user: '奶茶续命君', stars: 4, text: '微微辣刚刚好，就是想多点花生米。', time: '09-28 午餐' },
    { user: '运动系阿伟', stars: 5, text: '下饭神器，配米饭能干两碗。', time: '09-27 晚餐' }
  ],
  d21: [
    { user: '川渝胃妹子', stars: 5, text: '麻婆豆腐很正宗，花椒香不呛口，勾茨到位。', time: '昨天 午餐' },
    { user: '清淡饮食派', stars: 4, text: '不能吃辣的同学慎点，是真的辣！', time: '09-29 晚餐' }
  ],
  d24: [
    { user: '2023级小李', stars: 5, text: '一清二白三红四绿，汤是真的牛骨熬的。', time: '昨天 早餐' },
    { user: '干饭第一名', stars: 5, text: '11块这个价格还有这么多牛肉，良心。', time: '09-29 午餐' },
    { user: '学霸小张', stars: 4, text: '面可以选粗细这点很贴心，就是中午人多。', time: '09-28 午餐' }
  ],
  d34: [
    { user: '深夜码农', stars: 5, text: '晚自习后来一碗，鲜虾四只，暖胃又满足。', time: '昨天 晚餐' },
    { user: '恰饭少女', stars: 5, text: '粥底熬得很绵，虾肉弹牙，强烈推荐！', time: '09-29 晚餐' },
    { user: '早起鸟', stars: 4, text: '砂锅端上来烫烫的很有氛围，价格小贵但值。', time: '09-27 晚餐' }
  ],
  d36: [
    { user: '干饭第一名', stars: 5, text: '12.8两荤一素米饭随便续，三食堂卷王套餐。', time: '昨天 午餐' },
    { user: '图书馆常驻', stars: 5, text: '选菜窗口动线合理，五分钟搞定一顿饭。', time: '09-29 午餐' }
  ],
  d40: [
    { user: '运动系阿伟', stars: 5, text: '黑椒汁拌饭一绝，牛柳嫩到出乎意料。', time: '昨天 晚餐' },
    { user: '2024级小赵', stars: 4, text: '铁板端上来还在响，仪式感拉满，量略少。', time: '09-29 晚餐' }
  ],
  d42: [
    { user: '奶茶续命君', stars: 5, text: '鱿鱼Q弹，酱香浓郁，排队也值！', time: '昨天 午餐' },
    { user: '干饭人老王', stars: 5, text: '每周必吃，酱汁拌饭太香了。', time: '09-28 晚餐' }
  ],
  d49: [
    { user: '2023级小李', stars: 5, text: '羊肉抓饭太香了，胡萝卜甜、米饭油润。', time: '昨天 午餐' },
    { user: '学霸小张', stars: 5, text: '没有膻味，羊肉给得厚道，民族餐厅必点。', time: '09-29 午餐' },
    { user: '清淡饮食派', stars: 5, text: '吃完不口干，很干净的一家店。', time: '09-27 午餐' }
  ],
  d44: [
    { user: '恰饭少女', stars: 5, text: '蛋挞皮酥到掉渣，下午茶配奶茶绝了。', time: '09-29 午餐' },
    { user: '奶茶续命君', stars: 4, text: '5块钱两只，比外面店便宜一半。', time: '09-28 午餐' }
  ],
  d19: [
    { user: '川渝胃妹子', stars: 5, text: '回锅肉锅气足，蒜苗切得大片，很家常。', time: '09-29 午餐' },
    { user: '干饭第一名', stars: 4, text: '肥肉略多，希望多给点瘦肉。', time: '09-27 晚餐' }
  ],
  d16: [
    { user: '早起鸟', stars: 5, text: '粥熬得稠，皮蛋切得细，早晨来一碗很舒服。', time: '09-29 早餐' }
  ],
  d28: [
    { user: '运动系阿伟', stars: 5, text: '鸡胸肉不柴，酱汁是低卡的，减脂期救星。', time: '09-29 午餐' }
  ],
  d37: [
    { user: '2024级小赵', stars: 4, text: '排骨烧得脱骨，就是有点甜口。', time: '09-28 午餐' }
  ],
  d45: [
    { user: '恰饭少女', stars: 5, text: '芒果很大块，奶油不腻，甜品屋招牌。', time: '09-29 晚餐' }
  ],
  d50: [
    { user: '干饭人老王', stars: 5, text: '大盘鸡味道正，皮带面吸饱汤汁，周末必来。', time: '09-28 晚餐' }
  ],
  d30: [
    { user: '早起鸟', stars: 4, text: '带着去教室吃很方便，面包体是全麦的。', time: '09-29 早餐' }
  ],
  d38: [
    { user: '2023级小李', stars: 4, text: '鱼香肉丝下饭，木耳脆嫩，酸甜口刚好。', time: '09-27 午餐' }
  ]
};
