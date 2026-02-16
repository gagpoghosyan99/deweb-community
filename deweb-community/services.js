// services.js — Packages & pricing, i18n EN/RU/HY, Buy section

const LS_LANG = "deweb_lang";

const LANGS = [
  { code: "hy", label: "HY" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

let currentLang = localStorage.getItem(LS_LANG) || "en";

// UI strings in 3 languages
const I18N = {
  en: {
    backToDeweb: "← Back to DEWEB",
    service: "Service",
    subtitle: "Choose what you need — each item has scope, base price, and the option to offer your price.",
    offerTitle: "Offer your price",
    offerSub: "Tell us your scope and budget — we'll reply with the best plan and timeline.",
    whatNeed: "What do you need?",
    describeProject: "Describe your project...",
    name: "Name",
    email: "Email",
    yourBudget: "Your budget (optional)",
    deadline: "Deadline (optional)",
    sendInquiry: "Send inquiry",
    offerYourPrice: "Offer your price",
    buyTitle: "Buy / Order",
    buySub: "Select a product and quantity, or request a custom quote. We deliver solutions and products.",
    selectProduct: "Select product",
    quantity: "Quantity",
    addToCart: "Add to cart",
    requestQuote: "Request quote",
    buyOrOfferBtn: "Buy or Offer your price",
    promocode: "Promocode",
    promoPlaceholder: "e.g. HAYUGEN",
    itemsInCart: "Items in cart",
    yourCart: "Your cart",
    cartEmpty: "Your cart is empty.",
    checkout: "Checkout",
    payWith: "Pay with",
    payNow: "Pay now",
    payBtn: "Pay",
    payCard: "Card",
    payCrypto: "Crypto",
    payBank: "Bank transfer",
    successSent: "Sent! We will contact you soon.",
    fillRequired: "Please fill message and email.",
  },
  ru: {
    backToDeweb: "← Назад в DEWEB",
    service: "Услуга",
    subtitle: "Выберите, что нужно — у каждого пункта есть объём, базовая цена и возможность предложить свою цену.",
    offerTitle: "Предложите свою цену",
    offerSub: "Опишите задачу и бюджет — мы ответим с планом и сроками.",
    whatNeed: "Что вам нужно?",
    describeProject: "Опишите проект...",
    name: "Имя",
    email: "Email",
    yourBudget: "Ваш бюджет (необязательно)",
    deadline: "Сроки (необязательно)",
    sendInquiry: "Отправить заявку",
    offerYourPrice: "Предложить цену",
    buyTitle: "Купить / Заказать",
    buySub: "Выберите продукт и количество или запросите индивидуальное предложение.",
    selectProduct: "Выберите продукт",
    quantity: "Количество",
    addToCart: "В корзину",
    requestQuote: "Запросить предложение",
    buyOrOfferBtn: "Купить или предложить цену",
    promocode: "Промокод",
    promoPlaceholder: "напр. HAYUGEN",
    itemsInCart: "Товары в корзине",
    yourCart: "Ваша корзина",
    cartEmpty: "Корзина пуста.",
    checkout: "Оформить заказ",
    payWith: "Оплатить",
    payNow: "Оплатить сейчас",
    payBtn: "Оплатить",
    payCard: "Карта",
    payCrypto: "Криптовалюта",
    payBank: "Банковский перевод",
    successSent: "Отправлено! Мы скоро свяжемся с вами.",
    fillRequired: "Заполните сообщение и email.",
  },
  hy: {
    backToDeweb: "← Հետ DEWEB",
    service: "Ծառայություն",
    subtitle: "Ընտրեք այն, ինչ ձեզ հարկավոր է — յուրաքանչյուր դիրք ունի շրջանակ, բազային գին և ձեր գին առաջարկելու հնարավորություն։",
    offerTitle: "Առաջարկեք ձեր գինը",
    offerSub: "Նշեք շրջանակն ու բյուջեն — մենք կպատասխանենք լավագույն պլանով և ժամկետներով։",
    whatNeed: "Ի՞նչ է ձեզ հարկավոր։",
    describeProject: "Նկարագրեք նախագիծը...",
    name: "Անուն",
    email: "Email",
    yourBudget: "Ձեր բյուջեն (ընտրովի)",
    deadline: "Ժամկետ (ընտրովի)",
    sendInquiry: "Ուղարկել հարցում",
    offerYourPrice: "Առաջարկել գին",
    buyTitle: "Գնել / Պատվիրել",
    buySub: "Ընտրեք ապրանք և քանակ կամ խնդրեք անհատական առաջարկ։",
    selectProduct: "Ընտրել ապրանք",
    quantity: "Քանակ",
    addToCart: "Զամբյուղ",
    requestQuote: "Պահանջել առաջարկ",
    buyOrOfferBtn: "Գնել կամ առաջարկել գին",
    promocode: "Պրոմոկոդ",
    promoPlaceholder: "օր. HAYUGEN",
    itemsInCart: "Զամբյուղի ապրանքներ",
    yourCart: "Ձեր զամբյուղը",
    cartEmpty: "Զամբյուղը դատարկ է։",
    checkout: "Ստուգել",
    payWith: "Վճարել",
    payNow: "Վճարել հիմա",
    payBtn: "Վճարել",
    payCard: "Քարտ",
    payCrypto: "Կրիպտո",
    payBank: "Բանկային փոխանցում",
    successSent: "Ուղարկված է։ Շուտով կկապվենք։",
    fillRequired: "Խնդրում ենք լրացնել հաղորդագրությունն ու email-ը։",
  },
};

function t(key) {
  return I18N[currentLang]?.[key] ?? I18N.en[key] ?? key;
}

// Back to DEWEB = one step back in history
document.getElementById("backToDeweb")?.addEventListener("click", (e) => {
  e.preventDefault();
  if (window.history.length > 1) window.history.back();
  else window.location.href = "index.html";
});

// Cart state (persist in sessionStorage for same tab)
let cart = [];
const CART_KEY = "deweb_services_cart";
function loadCart() {
  try {
    const s = sessionStorage.getItem(CART_KEY);
    cart = s ? JSON.parse(s) : [];
  } catch (_) { cart = []; }
}
function saveCart() {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}

// Product data: name, desc, fullDesc (long), price, features. Optional _ru, _hy for name/desc/fullDesc/features.
const DATA = {
  web: {
    badge: { en: "Web", ru: "Веб", hy: "Վեբ" },
    title: { en: "Web & E-commerce", ru: "Веб и E-commerce", hy: "Վեբ և E-commerce" },
    subtitle: { en: "Landing pages, corporate sites, online stores — choose what fits your goal.", ru: "Лендинги, корпоративные сайты, интернет-магазины.", hy: "Լենդինգներ, կորպորատիվ կայքեր, առցանց խանութներ։" },
    items: [
      { name: { en: "Landing Page", ru: "Лендинг", hy: "Լենդինգ" }, desc: { en: "1-page conversion-focused website.", ru: "Одностраничный сайт под конверсии.", hy: "Մեկ էջ՝ կոնվերսիայի համար։" }, fullDesc: { en: "A single-page website built to convert visitors into leads or customers. Includes unique sections, mobile-first responsive layout, basic SEO setup, and deployment. Ideal for campaigns, product launches, or service offers.", ru: "Одностраничный сайт для конверсии посетителей в заявки или клиентов. Уникальные блоки, адаптив, базовое SEO, размещение.", hy: "Մեկ էջ՝ այցելուներին հաճախորդների վերածելու համար։ Բաժիններ, ադապտիվ, SEO, տեղակայում։" }, price: "from $299", features: { en: ["Unique sections", "Mobile-first", "Basic SEO", "Deploy"], ru: ["Уникальные блоки", "Адаптив", "Базовое SEO", "Размещение"], hy: ["Բաժիններ", "Ադապտիվ", "SEO", "Տեղակայում"] } },
      { name: { en: "Corporate Website", ru: "Корпоративный сайт", hy: "Կորպորատիվ կայք" }, desc: { en: "Multi-page site for company presentation.", ru: "Многостраничный сайт компании.", hy: "Բազմաէջ կայք ընկերության համար։" }, fullDesc: { en: "Multi-page website for company presentation and trust: 5–10 pages, optional CMS, contact forms and email integration, professional deployment. Perfect for businesses that need a solid online presence.", ru: "Многостраничный сайт для презентации компании: 5–10 страниц, опционально CMS, формы и почта, размещение.", hy: "Բազմաէջ կայք ընկերության ներկայացման համար՝ 5–10 էջ, CMS, ձևեր, տեղակայում։" }, price: "from $799", features: { en: ["5–10 pages", "CMS optional", "Forms + email", "Deploy"], ru: ["5–10 страниц", "CMS по желанию", "Формы и почта", "Размещение"], hy: ["5–10 էջ", "CMS", "Ձևեր", "Տեղակայում"] } },
      { name: { en: "E-commerce Store", ru: "Интернет-магазин", hy: "Առցանց խանութ" }, desc: { en: "Online store with catalog, cart, checkout.", ru: "Магазин с каталогом, корзиной, оплатой.", hy: "Խանութ կատալոգով, զամբյուղով, վճարումով։" }, fullDesc: { en: "Full online store with product catalog and categories, shopping cart and checkout, payment options, and basic admin for managing products and orders. Scalable and secure.", ru: "Интернет-магазин: каталог, категории, корзина, оплата, базовая админка для товаров и заказов.", hy: "Առցանց խանութ՝ կատալոգ, զամբյուղ, վճարում, ադմին ապրանքների և պատվերների համար։" }, price: "from $1499", features: { en: ["Products + categories", "Cart + checkout", "Payments", "Admin basics"], ru: ["Товары и категории", "Корзина и оплата", "Платежи", "Админка"], hy: ["Ապրանքներ", "Զամբյուղ", "Վճարում", "Ադմին"] } },
      { name: { en: "SEO + Performance", ru: "SEO и скорость", hy: "SEO և արագություն" }, desc: { en: "Speed optimization + SEO + analytics.", ru: "Скорость, SEO, аналитика.", hy: "Արագություն, SEO, անալիտիկա։" }, fullDesc: { en: "Speed optimization and SEO foundations: Core Web Vitals, meta tags and sitemap, analytics setup, and a short report. Makes your existing site faster and more visible in search.", ru: "Оптимизация скорости и SEO: Core Web Vitals, мета и карта сайта, аналитика, отчёт.", hy: "Արագություն և SEO՝ Core Web Vitals, մետա, քարտեզ, անալիտիկա, հաշվետվություն։" }, price: "from $199", features: { en: ["Core Web Vitals", "Meta + sitemap", "Analytics", "Report"], ru: ["Core Web Vitals", "Мета и карта", "Аналитика", "Отчёт"], hy: ["Core Web Vitals", "Մետա", "Անալիտիկա", "Հաշվետվություն"] } },
    ],
  },
  bots: {
    badge: { en: "Bots", ru: "Боты", hy: "Բոտեր" },
    title: { en: "Bots & Automation", ru: "Боты и автоматизация", hy: "Բոտեր և ավտոմատացում" },
    subtitle: { en: "Automate sales, support, bookings via bots and integrations.", ru: "Автоматизация продаж, поддержки, записей.", hy: "Վաճառք, աջակցություն, ամրագրումներ։" },
    items: [
      { name: { en: "Telegram Sales Bot", ru: "Telegram-бот для продаж", hy: "Telegram վաճառքի բոտ" }, desc: { en: "Collect leads, show products, FAQs.", ru: "Сбор заявок, товары, FAQ.", hy: "Լիդեր, ապրանքներ, FAQ։" }, fullDesc: { en: "Telegram bot for lead collection, product or service display, FAQs, and handoff to a manager. Includes menus and flows, lead capture, admin commands, and deployment.", ru: "Telegram-бот: сбор заявок, показ товаров/услуг, FAQ, передача менеджеру. Меню, админ-команды, размещение.", hy: "Telegram բոտ՝ լիդեր, ապրանքներ, FAQ, փոխանցում մենեջերին։ Մենյու, ադմին, տեղակայում։" }, price: "from $399", features: { en: ["Menus + flows", "Lead capture", "Admin commands", "Deploy"], ru: ["Меню и сценарии", "Заявки", "Админ-команды", "Размещение"], hy: ["Մենյու", "Լիդեր", "Ադմին", "Տեղակայում"] } },
      { name: { en: "Booking / Reservation Bot", ru: "Бот записи", hy: "Ամրագրման բոտ" }, desc: { en: "Calendar scheduling, reminders.", ru: "Запись по календарю, напоминания.", hy: "Օրացույց, հիշեցումներ։" }, fullDesc: { en: "Bot for scheduling and reservations: time slots, reminders, confirmations, and a simple manager panel. Deploy included.", ru: "Бот для записи: слоты, напоминания, подтверждения, панель менеджера, размещение.", hy: "Բոտ ամրագրումների համար՝ ժամեր, հիշեցումներ, հաստատումներ, տեղակայում։" }, price: "from $499", features: { en: ["Time slots", "Reminders", "Manager panel", "Deploy"], ru: ["Слоты", "Напоминания", "Панель", "Размещение"], hy: ["Ժամեր", "Հիշեցումներ", "Պանել", "Տեղակայում"] } },
      { name: { en: "CRM / Sheets Integration", ru: "Интеграция с CRM / Таблицами", hy: "CRM / Աղյուսակներ" }, desc: { en: "Send data to Sheets / CRM, alerts.", ru: "Данные в Таблицы/CRM, алерты.", hy: "Տվյալներ Sheets/CRM, ալերտներ։" }, fullDesc: { en: "Send data from forms or bots to Google Sheets or CRM, with mapping and optional alerts. Webhooks/API, logs included.", ru: "Передача данных из форм/ботов в Таблицы или CRM, маппинг, алерты. Webhook/API, логи.", hy: "Ձևերից/բոտից տվյալներ Sheets կամ CRM, ալերտներ։ Webhook, լոգեր։" }, price: "from $299", features: { en: ["Webhook/API", "Data mapping", "Alerts", "Logs"], ru: ["Webhook/API", "Маппинг", "Алерты", "Логи"], hy: ["Webhook", "Քարտեզ", "Ալերտ", "Լոգ"] } },
      { name: { en: "Monitoring / Alerts", ru: "Мониторинг и алерты", hy: "Մոնիտորինգ" }, desc: { en: "Alerts for price, uptime, events.", ru: "Алерты по цене, аптайму, событиям.", hy: "Ալերտներ գնի, աշխատանքի համար։" }, fullDesc: { en: "Monitoring and alerting for prices, uptime, or custom events, with simple dashboards. Alert rules, reports, and deployment.", ru: "Мониторинг и алерты: цены, аптайм, события. Правила, отчёты, размещение.", hy: "Մոնիտորինգ և ալերտներ՝ գներ, աշխատանք, իրադարձություններ։ Կանոններ, հաշվետվություն։" }, price: "from $599", features: { en: ["Monitoring", "Alert rules", "Reports", "Deploy"], ru: ["Мониторинг", "Правила", "Отчёты", "Размещение"], hy: ["Մոնիտորինգ", "Կանոններ", "Հաշվետվություն", "Տեղակայում"] } },
    ],
  },
  design: {
    badge: { en: "Design", ru: "Дизайн", hy: "Դիզայն" },
    title: { en: "Design & Branding", ru: "Дизайн и брендинг", hy: "Դիզայն և ապրանքանիշ" },
    subtitle: { en: "Brand identity and UI that looks premium and sells.", ru: "Фирменный стиль и UI под продажи.", hy: "Բրենդ և UI, որ վաճառում է։" },
    items: [
      { name: { en: "Logo + Identity", ru: "Логотип и идентичность", hy: "Լոգո և իդենտիկություն" }, desc: { en: "Logo concepts + final + brand rules.", ru: "Концепты лого, финал, правила бренда.", hy: "Լոգոյի հայեցակարգեր, ֆինալ, կանոններ։" }, fullDesc: { en: "Logo development: several concepts, final logo pack, colors and typography, basic brand rules. Ready for use across channels.", ru: "Разработка логотипа: концепты, финальный пакет, цвета и шрифты, правила бренда.", hy: "Լոգոյի մշակում՝ հայեցակարգեր, ֆինալ փաթեթ, գույներ, կանոններ։" }, price: "from $199", features: { en: ["3 concepts", "Final logo pack", "Colors + fonts", "Brand rules"], ru: ["3 концепта", "Финальный пакет", "Цвета и шрифты", "Правила"], hy: ["3 հայեցակարգ", "Փաթեթ", "Գույներ", "Կանոններ"] } },
      { name: { en: "UI/UX in Figma", ru: "UI/UX в Figma", hy: "UI/UX Figma-ում" }, desc: { en: "Website design ready for development.", ru: "Дизайн сайта под разработку.", hy: "Կայքի դիզայն զարգացման համար։" }, fullDesc: { en: "Website UI/UX design in Figma: wireframes, final UI, responsive layouts, component set. Ready for developer handoff.", ru: "UI/UX дизайн сайта в Figma: вайрфреймы, финальный UI, адаптив, компоненты.", hy: "Կայքի UI/UX Figma-ում՝ վայրֆրեյմ, UI, ադապտիվ, կոմպոնենտներ։" }, price: "from $499", features: { en: ["Wireframe", "UI design", "Responsive", "Components"], ru: ["Вайрфрейм", "UI", "Адаптив", "Компоненты"], hy: ["Վայրֆրեյմ", "UI", "Ադապտիվ", "Կոմպոնենտներ"] } },
      { name: { en: "UI Kit / Design System", ru: "UI Kit / Дизайн-система", hy: "UI Kit / Դիզայն համակարգ" }, desc: { en: "Reusable components for fast development.", ru: "Переиспользуемые компоненты.", hy: "Կրկնօգտագործելի կոմպոնենտներ։" }, fullDesc: { en: "Reusable UI kit: buttons, forms, grids, typography, tokens. Speeds up development and keeps the product consistent.", ru: "UI kit: кнопки, формы, сетки, типографика, токены. Ускоряет разработку.", hy: "UI kit՝ կոճակներ, ձևեր, ցանց, տիպոգրաֆիա, թոքեններ։" }, price: "from $399", features: { en: ["Buttons/forms", "Grids", "Typography", "Tokens"], ru: ["Кнопки и формы", "Сетки", "Типографика", "Токены"], hy: ["Կոճակներ", "Ցանց", "Տիպոգրաֆիա", "Թոքեններ"] } },
      { name: { en: "Marketplace Graphics", ru: "Графика для маркетплейса", hy: "Մարկետփլեյս գրաֆիկա" }, desc: { en: "Banners, ads, product visuals.", ru: "Баннеры, реклама, визуалы.", hy: "Բաներներ, գովազդ, վիզուալներ։" }, fullDesc: { en: "Graphics for marketplaces and ads: banners, product visuals, templates. High quality, fast delivery, on-brand.", ru: "Графика для маркетплейсов и рекламы: баннеры, визуалы товаров, шаблоны.", hy: "Մարկետփլեյսի և գովազդի գրաֆիկա՝ բաներներ, ապրանքների նկարներ, ձևանմուշներ։" }, price: "from $99", features: { en: ["Templates", "High quality", "Fast delivery", "Brand safe"], ru: ["Шаблоны", "Качество", "Быстро", "В стиле бренда"], hy: ["Ձևանմուշներ", "Որակ", "Արագ", "Բրենդ"] } },
    ],
  },
  support: {
    badge: { en: "Support", ru: "Поддержка", hy: "Աջակցություն" },
    title: { en: "Growth & Support", ru: "Рост и поддержка", hy: "Աճ և աջակցություն" },
    subtitle: { en: "Monthly support, fixes, performance, security.", ru: "Поддержка, правки, скорость, безопасность.", hy: "Ամսական աջակցություն, ուղղումներ, արագություն։" },
    items: [
      { name: { en: "Monthly Maintenance", ru: "Ежемесячная поддержка", hy: "Ամսական պահպանում" }, desc: { en: "Fixes, updates, small improvements.", ru: "Правки, обновления, доработки.", hy: "Ուղղումներ, թարմացումներ։" }, fullDesc: { en: "Ongoing monthly maintenance: priority fixes, updates, small new features, and support. Keeps your product stable and up to date.", ru: "Ежемесячная поддержка: приоритетные правки, обновления, мелкие доработки.", hy: "Ամսական պահպանում՝ ուղղումներ, թարմացումներ, փոքր նոր ֆունկցիաներ։" }, price: "from $199/mo", features: { en: ["Priority fixes", "Updates", "Small features", "Support"], ru: ["Приоритетные правки", "Обновления", "Доработки", "Поддержка"], hy: ["Ուղղումներ", "Թարմացումներ", "Ֆունկցիաներ", "Աջակցություն"] } },
      { name: { en: "Performance Boost", ru: "Ускорение сайта", hy: "Արագացում" }, desc: { en: "Speed, Core Web Vitals.", ru: "Скорость, Core Web Vitals.", hy: "Արագություն, Core Web Vitals։" }, fullDesc: { en: "Performance audit and optimization: speed, Core Web Vitals, caching, images. Includes a short report with recommendations.", ru: "Аудит и оптимизация: скорость, Core Web Vitals, кэш, изображения, отчёт.", hy: "Աուդիտ և օպտիմիզացիա՝ արագություն, Core Web Vitals, զեկույց։" }, price: "from $249", features: { en: ["Audit", "Optimization", "Caching", "Report"], ru: ["Аудит", "Оптимизация", "Кэш", "Отчёт"], hy: ["Աուդիտ", "Օպտիմիզացիա", "Քեշ", "Զեկույց"] } },
      { name: { en: "Security Check", ru: "Проверка безопасности", hy: "Անվտանգության ստուգում" }, desc: { en: "Hardening, backups, vulnerability checks.", ru: "Защита, бэкапы, проверки.", hy: "Կոշտացում, բեքապներ, ստուգումներ։" }, fullDesc: { en: "Security hardening, backups, vulnerability checks, and short guidelines. Keeps your project and data safer.", ru: "Защита, бэкапы, проверка уязвимостей, рекомендации.", hy: "Անվտանգություն, բեքապներ, խոցելիությունների ստուգում, ձեռնարկ։" }, price: "from $299", features: { en: ["Backups", "Hardening", "Checks", "Guidelines"], ru: ["Бэкапы", "Защита", "Проверки", "Рекомендации"], hy: ["Բեքապ", "Կոշտացում", "Ստուգում", "Ձեռնարկ"] } },
      { name: { en: "Conversion Improvements", ru: "Улучшение конверсии", hy: "Կոնվերսիայի բարելավում" }, desc: { en: "UX and conversion analysis and tweaks.", ru: "UX и конверсия: анализ и правки.", hy: "UX և կոնվերսիա՝ անալիզ և ուղղումներ։" }, fullDesc: { en: "Improve conversion with UX review, A/B ideas, and targeted fixes. Includes a short report with next steps.", ru: "Улучшение конверсии: UX-аудит, идеи A/B, точечные правки, отчёт.", hy: "Կոնվերսիայի բարելավում՝ UX զեկույց, A/B գաղափարներ, զեկույց։" }, price: "from $399", features: { en: ["UX review", "A/B plan", "Fixes", "Report"], ru: ["UX-аудит", "A/B план", "Правки", "Отчёт"], hy: ["UX զեկույց", "A/B", "Ուղղումներ", "Զեկույց"] } },
    ],
  },
};

function getText(obj) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[currentLang] ?? obj.en ?? "";
}

// Language dropdown
const langDD = document.getElementById("langDD");
const langBtn = document.getElementById("langBtn");
const langLabel = document.getElementById("langLabel");
const langMenu = document.getElementById("langMenu");

function renderLangUI() {
  const selected = LANGS.find(l => l.code === currentLang) || LANGS[1];
  if (langLabel) langLabel.textContent = selected.label;
  if (!langMenu) return;
  langMenu.innerHTML = "";
  LANGS.filter(l => l.code !== currentLang).forEach((l) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "lang-dd__item";
    item.textContent = l.label;
    item.onclick = () => {
      currentLang = l.code;
      localStorage.setItem(LS_LANG, currentLang);
      renderLangUI();
      closeLangMenu();
      applyPageI18n();
      renderPage();
    };
    langMenu.appendChild(item);
  });
}

function openLangMenu() { if (langDD) { langDD.classList.add("open"); langBtn?.setAttribute("aria-expanded", "true"); } }
function closeLangMenu() { if (langDD) { langDD.classList.remove("open"); langBtn?.setAttribute("aria-expanded", "false"); } }
function toggleLangMenu() { if (langDD) (langDD.classList.contains("open") ? closeLangMenu : openLangMenu)(); }

if (langBtn && langDD) {
  langBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleLangMenu(); });
  document.addEventListener("click", (e) => { if (!langDD.contains(e.target)) closeLangMenu(); });
}

function applyPageI18n() {
  const backLink = document.querySelector(".nav-links a");
  if (backLink) backLink.textContent = t("backToDeweb");

  const catBadge = document.getElementById("catBadge");
  const catTitle = document.getElementById("catTitle");
  const catSubtitle = document.getElementById("catSubtitle");
  const cfg = DATA[getCat()];
  if (catBadge) catBadge.textContent = cfg ? getText(cfg.badge) : t("service");
  if (catTitle) catTitle.textContent = cfg ? getText(cfg.title) : "";
  if (catSubtitle) catSubtitle.textContent = cfg ? getText(cfg.subtitle) : t("subtitle");

  const offerTitle = document.getElementById("offerTitle");
  const offerSub = document.getElementById("offerSub");
  const buyTitle = document.getElementById("buyTitle");
  if (offerTitle) offerTitle.textContent = t("offerTitle");
  if (offerSub) offerSub.textContent = t("offerSub");
  if (buyTitle) buyTitle.textContent = t("buyTitle");

  const offerLabel = document.getElementById("offerLabel");
  if (offerLabel) offerLabel.textContent = t("whatNeed");
  {
    const offerForm = document.getElementById("offerForm");
    const ph = document.getElementById("offerText");
    if (ph) ph.placeholder = t("describeProject");
    const namePh = document.getElementById("offerName");
    if (namePh) namePh.placeholder = t("name");
    const emailPh = document.getElementById("offerEmail");
    if (emailPh) emailPh.placeholder = t("email");
    const budgetPh = document.getElementById("offerBudget");
    if (budgetPh) budgetPh.placeholder = t("yourBudget");
    const deadlinePh = document.getElementById("offerDeadline");
    if (deadlinePh) deadlinePh.placeholder = t("deadline");
    const submitBtn = offerForm?.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = t("sendInquiry");
  }

  const promoLabel = document.getElementById("promoLabel");
  if (promoLabel) promoLabel.textContent = t("promocode");
  const promoCodeInput = document.getElementById("promoCode");
  if (promoCodeInput) promoCodeInput.placeholder = t("promoPlaceholder");
  const cartItemsTitle = document.getElementById("cartItemsTitle");
  if (cartItemsTitle) cartItemsTitle.textContent = t("itemsInCart");
  const addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn) addToCartBtn.textContent = t("addToCart");
  const payDirectBtn = document.getElementById("payDirectBtn");
  if (payDirectBtn) payDirectBtn.textContent = t("payBtn");
  const cartTitle = document.getElementById("cartTitle");
  if (cartTitle) cartTitle.textContent = t("yourCart");
  const checkoutBtnEl = document.getElementById("checkoutBtn");
  if (checkoutBtnEl) checkoutBtnEl.textContent = t("checkout");
  updateOfferAndBuy();
  const payWithLabel = document.getElementById("payWithLabel");
  if (payWithLabel) payWithLabel.textContent = t("payWith");
  ["payCardBtn", "payCryptoBtn", "payBankBtn"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.textContent = t("payNow");
  });
  const payCardEl = document.getElementById("payCard");
  if (payCardEl) payCardEl.textContent = t("payCard");
  const payCryptoEl = document.getElementById("payCrypto");
  if (payCryptoEl) payCryptoEl.textContent = t("payCrypto");
  const payBankEl = document.getElementById("payBank");
  if (payBankEl) payBankEl.textContent = t("payBank");
}

function getCat() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat") || "web";
  return DATA[cat] ? cat : "web";
}

function renderCart() {
  const list = document.getElementById("cartList");
  const manageSection = document.getElementById("cartManageSection");
  if (!list) return;
  if (cart.length === 0) {
    if (manageSection) manageSection.classList.remove("is-visible");
    list.innerHTML = "";
    return;
  }
  if (manageSection) manageSection.classList.add("is-visible");
  list.innerHTML = cart.map((item, i) => `
    <div class="cart-item" data-i="${i}">
      <span class="cart-item-name">${escapeHtml(item.name)}</span>
      <span class="cart-item-qty">× ${item.qty}</span>
      <span class="cart-item-price">${item.price}</span>
      <button type="button" class="cart-item-remove" data-i="${i}" aria-label="Remove">×</button>
    </div>
  `).join("");
  list.querySelectorAll(".cart-item-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      cart.splice(Number(btn.dataset.i), 1);
      saveCart();
    });
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}

// Promocode HAYUGEN → price $355 (for any selected product)
const PROMO_CODE = "HAYUGEN";
const PROMO_PRICE = "$355";

// Selected product from card click: { cat, index }
let selectedProduct = null;

function getSelectedProductData() {
  if (!selectedProduct) return null;
  const cfg = DATA[selectedProduct.cat];
  return cfg ? cfg.items[selectedProduct.index] : null;
}

function getSelectedPrice() {
  const code = document.getElementById("promoCode")?.value?.trim().toUpperCase();
  if (code === PROMO_CODE) return PROMO_PRICE;
  const it = getSelectedProductData();
  return it ? it.price : "—";
}

function updateOfferAndBuy() {
  const it = getSelectedProductData();
  const name = it ? getText(it.name) : "";
  const offerNameEl = document.getElementById("offerSelectedName");
  const buyNameEl = document.getElementById("buySelectedName");
  const buyPriceEl = document.getElementById("buySelectedPrice");
  if (offerNameEl) offerNameEl.textContent = name ? `${name} — describe what you need:` : "";
  if (buyNameEl) buyNameEl.textContent = name || "Select a service above";
  if (buyPriceEl) buyPriceEl.textContent = getSelectedPrice();
}

function showPaymentSection() {
  document.getElementById("paymentSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function withFirstWord(text) {
  if (!text || !text.trim()) return "";
  const t = text.trim();
  const i = t.indexOf(" ");
  if (i === -1) return `<span class="first-word">${escapeHtml(t)}</span>`;
  return `<span class="first-word">${escapeHtml(t.slice(0, i))}</span>${escapeHtml(t.slice(i))}`;
}

function renderPage() {
  const cat = getCat();
  const cfg = DATA[cat];
  if (!cfg) return;

  const catBadge = document.getElementById("catBadge");
  const catTitle = document.getElementById("catTitle");
  const catSubtitle = document.getElementById("catSubtitle");
  if (catBadge) catBadge.textContent = getText(cfg.badge);
  if (catTitle) catTitle.textContent = getText(cfg.title);
  if (catSubtitle) catSubtitle.textContent = getText(cfg.subtitle);

  const grid = document.getElementById("detailsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  grid.className = "details-list";

  cfg.items.forEach((it, idx) => {
    const name = getText(it.name);
    const fullDesc = getText(it.fullDesc);
    const features = it.features && typeof it.features === "object" && !Array.isArray(it.features)
      ? (it.features[currentLang] || it.features.en || [])
      : (it.features || []);
    const row = document.createElement("div");
    row.className = "detail-row";
    row.innerHTML = `
      <div class="detail-row-card detail-card">
        <h3>${name}</h3>
        <ul>${(Array.isArray(features) ? features : []).map(f => `<li>${f}</li>`).join("")}</ul>
        <div class="price-row">
          <span class="price">${it.price}</span>
          <button class="cta-btn secondary" type="button" data-offer="${idx}">${t("buyOrOfferBtn")}</button>
        </div>
      </div>
      <div class="detail-row-desc">
        <p>${withFirstWord(fullDesc || getText(it.desc))}</p>
      </div>
    `;
    row.querySelector("[data-offer]").addEventListener("click", () => {
      selectedProduct = { cat, index: idx };
      updateOfferAndBuy();
      document.getElementById("cartSection")?.scrollIntoView({ behavior: "smooth" });
      document.getElementById("offerText")?.focus();
    });
    grid.appendChild(row);
  });
}

document.getElementById("offerForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("offerEmail").value.trim();
  const text = document.getElementById("offerText").value.trim();
  if (!email || !text) {
    alert(t("fillRequired"));
    return;
  }
  alert(t("successSent"));
  e.target.reset();
});

document.getElementById("promoCode")?.addEventListener("input", updateOfferAndBuy);
document.getElementById("promoCode")?.addEventListener("change", updateOfferAndBuy);

document.getElementById("addToCartBtn")?.addEventListener("click", () => {
  const it = getSelectedProductData();
  if (!it) return;
  const name = getText(it.name);
  const price = getSelectedPrice();
  cart.push({ name, price, qty: 1, cat: selectedProduct.cat, productIndex: selectedProduct.index });
  saveCart();
  document.getElementById("cartManageSection")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.getElementById("payDirectBtn")?.addEventListener("click", () => {
  const it = getSelectedProductData();
  if (it) {
    cart.push({
      name: getText(it.name),
      price: getSelectedPrice(),
      qty: 1,
      cat: selectedProduct.cat,
      productIndex: selectedProduct.index
    });
    saveCart();
  }
  showPaymentSection();
});

document.getElementById("checkoutBtn")?.addEventListener("click", showPaymentSection);

// Payment method tabs
document.querySelectorAll(".payment-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const method = tab.dataset.method;
    document.querySelectorAll(".payment-tab").forEach((t) => t.classList.toggle("active", t.dataset.method === method));
    document.querySelectorAll(".payment-method").forEach((p) => {
      p.style.display = p.dataset.panel === method ? "block" : "none";
    });
  });
});

function doPay() {
  alert(t("successSent"));
  cart = [];
  saveCart();
  document.getElementById("cartManageSection")?.classList.remove("is-visible");
}

document.getElementById("payCardBtn")?.addEventListener("click", doPay);
document.getElementById("payCryptoBtn")?.addEventListener("click", doPay);
document.getElementById("payBankBtn")?.addEventListener("click", doPay);

// Init
loadCart();
renderLangUI();
applyPageI18n();
renderPage();
renderCart();
updateOfferAndBuy();
