/* script.js */

/* ========================================
   DEWEB - JS (Slider + i18n + Account + Orders + Marketplace + Services Panel)
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const slidesWrapper = document.getElementById("slidesWrapper");
  const pagination = document.getElementById("pagination");
  const navLinks = document.querySelectorAll(".nav-links a");
  const totalSlides = slidesWrapper ? slidesWrapper.querySelectorAll(".slide").length : 0;

  if (!slidesWrapper || !totalSlides) {
    console.warn("Slider not initialized: slidesWrapper missing.");
    return;
  }

  let currentSlide = 0;

  /* =========================
     PAGINATION
     ========================= */
  function createPagination() {
    if (!pagination) return;
    pagination.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      pagination.appendChild(dot);
    }
  }

  function updateActiveStates() {
    document.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === currentSlide));
    navLinks.forEach((link) => {
      const idx = Number(link.dataset.slide);
      link.classList.toggle("active", idx === currentSlide);
    });
  }

  function goToSlide(slideIndex) {
    if (!Number.isFinite(slideIndex)) return;
    if (slideIndex < 0 || slideIndex >= totalSlides) return;

    currentSlide = slideIndex;
    slidesWrapper.style.transform = `translateX(${-slideIndex * 100}vw)`;
    document.body.setAttribute("data-slide", String(slideIndex));
    updateActiveStates();

    // ✅ reset vertical scroll on slide change
    const slides = slidesWrapper.querySelectorAll(".slide");
    const active = slides[slideIndex];
    if (active && typeof active.scrollTo === "function") {
      active.scrollTo({ top: 0, behavior: "auto" }); // "instant" is invalid
    }
  }

  function nextSlide() {
    if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
  }

  function previousSlide() {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
  }

  // expose for onclick handlers
  window.goToSlide = goToSlide;
  window.nextSlide = nextSlide;
  window.previousSlide = previousSlide;

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") previousSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  // Nav clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const slideIndex = Number(link.dataset.slide);
      goToSlide(slideIndex);
    });
  });

  // Touch swipe
  let touchStartX = 0;
  let touchEndX = 0;
  slidesWrapper.addEventListener("touchstart", (e) => (touchStartX = e.changedTouches[0].screenX), { passive: true });
  slidesWrapper.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) nextSlide();
    if (touchEndX - touchStartX > swipeThreshold) previousSlide();
  });

  /* =========================
     CONTACT FORM
     ========================= */
  window.submitForm = function submitForm() {
    const emailEl = document.getElementById("email");
    const suggestionsEl = document.getElementById("suggestions");

    if (!emailEl || !suggestionsEl) return alert("Form elements not found!");
    const email = emailEl.value.trim();
    const msg = suggestionsEl.value.trim();

    if (!email || !msg) return alert("Please fill in all fields!");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return alert("Please enter a valid email address!");
    alert("Thank you! Your message has been received. We will contact you soon!");
    emailEl.value = "";
    suggestionsEl.value = "";
  };

  /* =========================
     i18n (HY/EN/RU)
     ========================= */
  const I18N = {
    en: {
      nav: { home:"Home", services:"Services", packages:"Packages", order:"Order", marketplace:"Marketplace", about:"About", contact:"Contact", account:"Account" },
      home: {
        title:"IT Studio & Marketplace",
        subtitle:"Websites, bots, automation, design — built fast, clean, and scalable. Order end-to-end or hire verified talent.",
        cta1:"Order from 0 → 100%", cta2:"Explore Marketplace",
        stat1b:"Packages", stat1s:"Fixed scope offers",
        stat2b:"Milestones", stat2s:"Track progress in account",
        stat3b:"Roles", stat3s:"Client or Developer"
      },
      services:{
        title:"What DEWEB delivers",
        subtitle:"We sell solutions — not “hours”. Pick a direction or order full production.",
        cta:"Get Quote",
        web:{ t:"Web & E-commerce", d:"Landing pages, corporate sites, online stores, speed, SEO basics." },
        bot:{ t:"Bots & Automation", d:"Telegram bots, WhatsApp workflows, CRM integrations, monitoring, scraping." },
        design:{ t:"Design & Branding", d:"UI/UX, logos, identity, Figma systems, marketplaces graphics." },
        growth:{ t:"Growth & Support", d:"Maintenance, analytics, conversion, performance tuning, security." },
        whyTitle:"Why clients choose DEWEB",
        why1:"Productized packages (clear scope + timeline)",
        why2:"Milestone payments",
        why3:"Account tracking (stage updates)",
        why4:"Supplier network (fast scaling)",
        forSupTitle:"For suppliers & developers",
        forSup1:"Stable leads from DEWEB",
        forSup2:"Work under DEWEB brand",
        forSup3:"Portfolio + verified profile",
        forSup4:"Claim tasks inside dashboard",
        forSupCTA:"Go to Marketplace"
      },
      packages: {
        title:"Productized IT Packages",
        subtitle:"Clear scope. Clear price range. Fast delivery. Monthly support optional.",
        cta:"Get Quote →", cta2:"Talk to us",
        web:{ title:"Website Launch", desc:"Landing / corporate website from design to deploy.", li1:"UI/UX + responsive", li2:"SEO basics + analytics", li3:"Deploy + 30 days support" },
        bot:{ title:"Telegram Bot System", desc:"Sales, booking, CRM automation, payments.", li1:"Admin panel (basic)", li2:"Integrations (Sheets/CRM)", li3:"Deploy + monitoring" },
        design:{ title:"Brand + UI Kit", desc:"Logo + brand rules + website UI design in Figma.", li1:"Logo + identity", li2:"UI kit + components", li3:"Ready for dev handoff" },
        support:{ title:"Monthly Support", desc:"Updates, fixes, speed, security, small features.", li1:"Priority fixes", li2:"Performance checks", li3:"Reports + roadmap" },
        noteBadge:"Tip",
        noteText:"Don’t know which package fits? Use “Order” and we will propose best scope + pricing."
      },
      order:{
        title:"Order from 0 → 100%",
        subtitle:"Send your request. We reply with scope, price, timeline, and payment methods.",
        s1:"Inquiry", s1d:"you send details",
        s2:"Quote", s2d:"scope + price",
        s3:"Payment", s3d:"milestones",
        s4:"Delivery", s4d:"testing + launch",
        howTitle:"How it works inside your Account",
        how1:"You see your order status: Inquiry → Quote → Paid → In Progress → Delivered → Done",
        how2:"You can add files/links later (in real version)",
        how3:"Developers can claim tasks (Marketplace)",
        openAccount:"Open Account",
        service:"Service", budget:"Budget range", deadline:"Deadline", details:"Project details", contact:"Contact",
        opt:{ website:"Website / Landing / E-commerce", bot:"Telegram Bot / Automation", design:"Design / Branding / UI", support:"Maintenance / Growth" },
        pay:{ card:"Card", crypto:"Crypto", bank:"Bank transfer", cash:"Cash" },
        send:"Send Inquiry",
        note:"After sending, you’ll see the order in your Account dashboard."
      },
      market:{
        title:"Marketplace",
        subtitle:"Hire specialists or claim tasks if you’re a developer.",
        filters:"Filters",
        all:"All roles",
        dev:"Developers",
        skillAll:"All skills",
        tipBadge:"Tip",
        tipText:"Developers: sign up → role “Developer” → add portfolio → claim orders in dashboard.",
        openAccount:"Open Account",
        openOrders:"Open Orders",
        createOrder:"Create Order"
      },
      about:{
        title:"About DEWEB",
        base:"DEWEB is a senior-led IT production studio + marketplace. We deliver websites, automation, bots, and design. We also build a supplier ecosystem: verified developers get stable leads, clients get predictable delivery.",
        v1b:"Speed", v1s:"Fast delivery without chaos",
        v2b:"Clarity", v2s:"Packages, scope, milestones",
        v3b:"Quality", v3s:"Production-first engineering",
        cards:{ web:"Web & E-commerce", bots:"Bots & Automation", design:"Design & Branding", growth:"Growth & Support", market:"Marketplace", process:"Process" }
      },
      acc:{
        signin:"Sign in", signup:"Sign up", dashboard:"Dashboard",
        signinBtn:"Sign in", signupBtn:"Create account",
        roleClient:"Client", roleDev:"Developer",
        siNote:"Use sign up if you don't have an account.",
        suNote:"After sign up you can track orders or apply for work.",
        logout:"Log out"
      },
      dash:{
        clientOrders:"My Orders",
        devPortfolio:"My Portfolio",
        devNew:"New Orders",
        devDone:"Completed"
      },
      contact: { placeholderMessage: "Write your message...", placeholderEmail: "Write your e-mail...", sendButton: "SEND MESSAGE" }
    },

    ru: {
      nav: { home: "Главная", services: "Услуги", packages: "Пакеты", order: "Заказ", marketplace: "Маркетплейс", about: "О нас", contact: "Контакты", account: "Аккаунт" },
      home: { title: "IT-студия и маркетплейс", subtitle: "Сайты, боты, автоматизация, дизайн — быстро и масштабируемо. Закажите под ключ или наймите проверенных специалистов.", cta1: "Заказ от 0 до 100%", cta2: "В маркетплейс", stat1b: "Пакеты", stat1s: "Фиксированный объём", stat2b: "Этапы", stat2s: "Отслеживание в аккаунте", stat3b: "Роли", stat3s: "Клиент или разработчик" },
      services: { title: "Что делает DEWEB", subtitle: "Мы продаём решения, а не часы. Выберите направление или закажите полный цикл.", cta: "Получить предложение", web: { t: "Веб и E-commerce", d: "Лендинги, корпоративные сайты, интернет-магазины." }, bot: { t: "Боты и автоматизация", d: "Telegram-боты, интеграции, мониторинг." }, design: { t: "Дизайн и брендинг", d: "UI/UX, логотипы, Figma." }, growth: { t: "Рост и поддержка", d: "Поддержка, аналитика, безопасность." }, whyTitle: "Почему выбирают DEWEB", why1: "Пакетные предложения", why2: "Оплата по этапам", why3: "Статусы в аккаунте", why4: "Сеть исполнителей", forSupTitle: "Для поставщиков", forSup1: "Стабильные заказы", forSup2: "Работа под брендом DEWEB", forSup3: "Портфолио и профиль", forSup4: "Заявки в дашборде", forSupCTA: "В маркетплейс" },
      packages: { title: "IT-пакеты", subtitle: "Понятный объём, цена, сроки. Поддержка опционально.", cta: "Получить предложение →", cta2: "Связаться", web: { title: "Запуск сайта", desc: "Лендинг или корпоративный сайт.", li1: "UI/UX и адаптив", li2: "SEO и аналитика", li3: "Размещение и 30 дней поддержки" }, bot: { title: "Система Telegram-бота", desc: "Продажи, запись, CRM, платежи.", li1: "Админ-панель", li2: "Интеграции", li3: "Размещение" }, design: { title: "Бренд и UI Kit", desc: "Логотип, правила бренда, UI в Figma.", li1: "Логотип и идентичность", li2: "UI kit", li3: "Передача в разработку" }, support: { title: "Месячная поддержка", desc: "Правки, обновления, безопасность.", li1: "Приоритетные правки", li2: "Производительность", li3: "Отчёты" }, noteBadge: "Совет", noteText: "Не знаете, какой пакет подходит? Оформите заказ — предложим объём и цену." },
      order: { title: "Заказ от 0 до 100%", subtitle: "Оставьте заявку. Ответим с объёмом, ценой, сроками и способами оплаты.", s1: "Заявка", s1d: "вы отправляете детали", s2: "Предложение", s2d: "объём и цена", s3: "Оплата", s3d: "по этапам", s4: "Доставка", s4d: "тест и запуск", howTitle: "Как это в аккаунте", how1: "Статус заказа: Заявка → Предложение → Оплачено → В работе → Доставлено → Готово", how2: "Можно добавить файлы (в полной версии)", how3: "Разработчики могут брать задачи", openAccount: "Открыть аккаунт", service: "Услуга", budget: "Бюджет", deadline: "Срок", details: "Детали проекта", contact: "Контакт", opt: { website: "Сайт / Лендинг / E-commerce", bot: "Telegram-бот / Автоматизация", design: "Дизайн / Брендинг / UI", support: "Поддержка / Рост" }, pay: { card: "Карта", crypto: "Криптовалюта", bank: "Банк", cash: "Наличные" }, send: "Отправить заявку", note: "После отправки заказ появится в аккаунте." },
      market: { title: "Маркетплейс", subtitle: "Нанять специалистов или брать задачи как разработчик.", filters: "Фильтры", all: "Все роли", dev: "Разработчики", skillAll: "Все навыки", tipBadge: "Совет", tipText: "Разработчики: регистрация → роль «Разработчик» → портфолио → заявки в дашборде.", openAccount: "Открыть аккаунт", openOrders: "Открытые заказы", createOrder: "Создать заказ" },
      about: { title: "О DEWEB", base: "DEWEB — IT-студия и маркетплейс. Сайты, автоматизация, боты, дизайн. Проверенные разработчики получают заказы, клиенты — предсказуемый результат.", v1b: "Скорость", v1s: "Быстро без хаоса", v2b: "Ясность", v2s: "Пакеты, объём, этапы", v3b: "Качество", v3s: "Продакшен-уровень", cards: { web: "Веб и E-commerce", bots: "Боты и автоматизация", design: "Дизайн и брендинг", growth: "Рост и поддержка", market: "Маркетплейс", process: "Процесс" } },
      acc: { signin: "Вход", signup: "Регистрация", dashboard: "Дашборд", signinBtn: "Войти", signupBtn: "Создать аккаунт", roleClient: "Клиент", roleDev: "Разработчик", siNote: "Нет аккаунта? Зарегистрируйтесь.", suNote: "После регистрации можно отслеживать заказы или откликаться на задачи.", logout: "Выйти" },
      dash: { clientOrders: "Мои заказы", devPortfolio: "Портфолио", devNew: "Новые заказы", devDone: "Выполнено" },
      contact: { placeholderMessage: "Напишите сообщение...", placeholderEmail: "Ваш e-mail...", sendButton: "ОТПРАВИТЬ" }
    },
    hy: {
      nav: { home: "Գլխավոր", services: "Ծառայություններ", packages: "Փաթեթներ", order: "Պատվեր", marketplace: "Մարկետփլեյս", about: "Մեր մասին", contact: "Կապ", account: "Հաշիվ" },
      home: { title: "IT ստուդիա և մարկետփլեյս", subtitle: "Կայքեր, բոտեր, ավտոմատացում, դիզայն — արագ և մասշտաբելի։ Պատվիրեք ամբողջությամբ կամ վարձեք ստուգված մասնագետներին։", cta1: "Պատվեր 0-ից 100%", cta2: "Դեպի մարկետփլեյս", stat1b: "Փաթեթներ", stat1s: "Ֆիքսված շրջանակ", stat2b: "Փուլեր", stat2s: "Հետևում հաշվում", stat3b: "Դերեր", stat3s: "Կլիենտ կամ մշակող" },
      services: { title: "Ինչ է առաջարկում DEWEB", subtitle: "Մենք վաճառում ենք լուծումներ, ոչ ժամեր։ Ընտրեք ուղղություն կամ պատվիրեք ամբողջ արտադրությունը։", cta: "Ստանալ առաջարկ", web: { t: "Վեբ և E-commerce", d: "Լենդինգներ, կորպորատիվ կայքեր, առցանց խանութներ։" }, bot: { t: "Բոտեր և ավտոմատացում", d: "Telegram բոտեր, ինտեգրացիաներ։" }, design: { t: "Դիզայն և ապրանքանիշ", d: "UI/UX, լոգոներ, Figma։" }, growth: { t: "Աճ և աջակցություն", d: "Աջակցություն, անալիտիկա, անվտանգություն։" }, whyTitle: "Ինչու DEWEB", why1: "Փաթեթային առաջարկներ", why2: "Վճարում փուլերով", why3: "Կարգավիճակ հաշվում", why4: "Կատարողների ցանց", forSupTitle: "Մատակարարների համար", forSup1: "Կայուն պատվերներ", forSup2: "Աշխատանք DEWEB ապրանքանիշի ներքո", forSup3: "Պորտֆոլիո և պրոֆիլ", forSup4: "Հարցումներ դաշշբորդում", forSupCTA: "Դեպի մարկետփլեյս" },
      packages: { title: "IT փաթեթներ", subtitle: "Հասկանալի շրջանակ, գին, ժամկետներ։ Աջակցությունը ընտրովի է։", cta: "Ստանալ առաջարկ →", cta2: "Կապվել", web: { title: "Կայքի մեկնարկ", desc: "Լենդինգ կամ կորպորատիվ կայք։", li1: "UI/UX և ադապտիվ", li2: "SEO և անալիտիկա", li3: "Տեղակայում և 30 օր աջակցություն" }, bot: { title: "Telegram բոտի համակարգ", desc: "Վաճառք, ամրագրում, CRM, վճարումներ։", li1: "Ադմին-պանել", li2: "Ինտեգրացիաներ", li3: "Տեղակայում" }, design: { title: "Ապրանքանիշ և UI Kit", desc: "Լոգո, ապրանքանիշի կանոններ, UI Figma-ում։", li1: "Լոգո և իդենտիկություն", li2: "UI kit", li3: "Հանձնում մշակողին" }, support: { title: "Ամսական աջակցություն", desc: "Ուղղումներ, թարմացումներ, անվտանգություն։", li1: "Առաջնահերթ ուղղումներ", li2: "Արագություն", li3: "Հաշվետվություններ" }, noteBadge: "Խորհուրդ", noteText: "Չգիտե՞ք, թե որ փաթեթը հարմար է։ Օգտագործեք «Պատվեր» — կառաջարկենք շրջանակ և գին։" },
      order: { title: "Պատվեր 0-ից 100%", subtitle: "Ուղարկեք հարցում։ Կպատասխանենք շրջանակով, գնով, ժամկետներով և վճարման եղանակներով։", s1: "Հարցում", s1d: "դուք ուղարկում եք մանրամասներ", s2: "Առաջարկ", s2d: "շրջանակ և գին", s3: "Վճարում", s3d: "փուլեր", s4: "Առաքում", s4d: "թեստ և մեկնարկ", howTitle: "Ինչպես է աշխատում հաշվում", how1: "Պատվերի կարգավիճակ՝ Հարցում → Առաջարկ → Վճարված → Ընթացքում → Առաքված → Պատրաստ", how2: "Կարող եք ավելացնել ֆայլեր (լրիվ տարբերակում)", how3: "Մշակողները կարող են վերցնել առաջադրանքներ", openAccount: "Բացել հաշիվ", service: "Ծառայություն", budget: "Բյուջե", deadline: "Ժամկետ", details: "Նախագծի մանրամասներ", contact: "Կապ", opt: { website: "Կայք / Լենդինգ / E-commerce", bot: "Telegram բոտ / Ավտոմատացում", design: "Դիզայն / Ապրանքանիշ / UI", support: "Աջակցություն / Աճ" }, pay: { card: "Քարտ", crypto: "Կրիպտո", bank: "Բանկ", cash: "Կանխիկ" }, send: "Ուղարկել հարցում", note: "Ուղարկելուց հետո պատվերը կերևա հաշվի դաշշբորդում։" },
      market: { title: "Մարկետփլեյս", subtitle: "Վարձեք մասնագետներ կամ վերցրեք առաջադրանքներ որպես մշակող։", filters: "Զտիչներ", all: "Բոլոր դերերը", dev: "Մշակողներ", skillAll: "Բոլոր հմտությունները", tipBadge: "Խորհուրդ", tipText: "Մշակողներ՝ գրանցում → «Մշակող» դեր → պորտֆոլիո → առաջադրանքներ դաշշբորդում։", openAccount: "Բացել հաշիվ", openOrders: "Բաց պատվերներ", createOrder: "Ստեղծել պատվեր" },
      about: { title: "DEWEB-ի մասին", base: "DEWEB-ը IT արտադրության ստուդիա և մարկետփլեյս է։ Կայքեր, ավտոմատացում, բոտեր, դիզայն։ Ստուգված մշակողները ստանում են պատվերներ, կլիենտները՝ կանխատեսելի արդյունք։", v1b: "Արագություն", v1s: "Արագ առանց խառնաշփոթի", v2b: "Պարզություն", v2s: "Փաթեթներ, շրջանակ, փուլեր", v3b: "Որակ", v3s: "Արտադրության մակարդակ", cards: { web: "Վեբ և E-commerce", bots: "Բոտեր և ավտոմատացում", design: "Դիզայն և ապրանքանիշ", growth: "Աճ և աջակցություն", market: "Մարկետփլեյս", process: "Գործընթաց" } },
      acc: { signin: "Մուտք", signup: "Գրանցում", dashboard: "Դաշշբորդ", signinBtn: "Մուտք", signupBtn: "Ստեղծել հաշիվ", roleClient: "Կլիենտ", roleDev: "Մշակող", siNote: "Հաշիվ չունե՞ք։ Գրանցվեք։", suNote: "Գրանցումից հետո կարող եք հետևել պատվերներին կամ արձագանքել առաջադրանքներին։", logout: "Դուրս գալ" },
      dash: { clientOrders: "Իմ պատվերները", devPortfolio: "Պորտֆոլիո", devNew: "Նոր պատվերներ", devDone: "Կատարված" },
      contact: { placeholderMessage: "Գրեք ձեր հաղորդագրությունը...", placeholderEmail: "Ձեր e-mail...", sendButton: "ՈՒՂԱՐԿԵԼ" }
    }
  };

  function applyI18n(lang){
    const dict = I18N[lang] || I18N.en;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const path = el.dataset.i18n.split(".");
      let cur = dict;
      for (const k of path) cur = cur?.[k];
      if (typeof cur === "string") el.textContent = cur;
    });

    const c = dict.contact;
    if (c) {
      const suggestions = document.getElementById("suggestions");
      if (suggestions) suggestions.placeholder = c.placeholderMessage;
      const contactEmail = document.getElementById("email");
      if (contactEmail) contactEmail.placeholder = c.placeholderEmail;
      const sendBtn = document.querySelector(".contact-form .send-btn");
      if (sendBtn) sendBtn.textContent = c.sendButton;
    }
  }

  /* =========================
     Language Dropdown (single visible + menu with other 2)
     ========================= */
  const LANGS = [
    { code: "hy", label: "HY" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
  ];

  let currentLang = localStorage.getItem("deweb_lang") || "en";

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
      item.setAttribute("role", "option");
      item.textContent = l.label;

      item.addEventListener("click", () => {
        currentLang = l.code;
        localStorage.setItem("deweb_lang", currentLang);
        applyI18n(currentLang);
        renderLangUI();
        closeLangMenu();
      });

      langMenu.appendChild(item);
    });
  }

  function openLangMenu() {
    if (!langDD) return;
    langDD.classList.add("open");
    langBtn?.setAttribute("aria-expanded", "true");
  }

  function closeLangMenu() {
    if (!langDD) return;
    langDD.classList.remove("open");
    langBtn?.setAttribute("aria-expanded", "false");
  }

  function toggleLangMenu() {
    if (!langDD) return;
    langDD.classList.contains("open") ? closeLangMenu() : openLangMenu();
  }

  if (langBtn && langDD) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLangMenu();
    });

    document.addEventListener("click", (e) => {
      if (!langDD.contains(e.target)) closeLangMenu();
    });
  }

  /* =========================
     NEW: Services section hover panel + click
     (only works if you updated Slide 2 HTML)
     ========================= */
  function initServicesSection(){
  const stack = document.getElementById("servicesStack");
  const panelBadge = document.getElementById("panelBadge");
  const panelTitle = document.getElementById("panelTitle");
  const panelDesc  = document.getElementById("panelDesc");
  const panelBullets = document.getElementById("panelBullets");
  const panelDetailsLink = document.getElementById("panelDetailsLink");

  if (!stack || !panelTitle || !panelDesc || !panelBullets) return;

  // You can rewrite texts later via i18n. For now EN prototype.
  const content = {
    web: {
      title: "Web & E-commerce",
      desc: "High-converting landing pages, corporate websites, and e-commerce stores — fast, secure, scalable.",
      bullets: [
        "Landing pages that convert",
        "Corporate sites with clean UX",
        "E-commerce with payments",
        "SEO basics + analytics"
      ],
      details: [
        { h: "Landing pages", items: ["Copy + sections", "Responsive layout", "Lead forms", "Speed optimization"] },
        { h: "Corporate sites", items: ["Multi-page structure", "Team/About/Services", "CMS option", "Security basics"] },
        { h: "E-commerce", items: ["Product pages", "Cart/checkout", "Payments", "Admin workflows"] },
        { h: "Extras", items: ["Domain + deploy", "Analytics", "SEO basics", "Support plans"] },
      ]
    },
    bots: {
      title: "Bots & Automation",
      desc: "Telegram bots, workflows, integrations — automate sales, support, bookings, and operations.",
      bullets: [
        "Telegram bots (sales/booking/support)",
        "Google Sheets / CRM integrations",
        "Admin commands + notifications",
        "Deploy + monitoring"
      ],
      details: [
        { h: "Telegram bots", items: ["Menus & flows", "Payments (optional)", "Admin panel basics", "Anti-spam"] },
        { h: "Automation", items: ["Sheets/Notion/CRM", "Webhooks", "Scheduled tasks", "Alerts"] },
        { h: "Integrations", items: ["Website → bot", "APIs", "Tracking events", "Data export"] },
        { h: "Maintenance", items: ["Logs", "Uptime", "Bug fixes", "New features"] },
      ]
    },
    design: {
      title: "Design & Branding",
      desc: "Brand identity and UI design that looks premium and sells — ready for development handoff.",
      bullets: [
        "Logo + brand identity",
        "Figma UI kit + components",
        "Landing/product page design",
        "Marketplace graphics"
      ],
      details: [
        { h: "Branding", items: ["Logo", "Colors & typography", "Brand rules", "Social pack"] },
        { h: "UI/UX", items: ["Wireframes", "Final UI", "Components", "Design system"] },
        { h: "Web design", items: ["Landing", "Corporate", "E-commerce UI", "Mobile-first"] },
        { h: "Delivery", items: ["Figma file", "Export assets", "Specs for dev", "Iterations"] },
      ]
    },
    support: {
      title: "Growth & Support",
      desc: "Monthly support, speed, security, and conversion improvements — stable operations.",
      bullets: [
        "Fixes + small features",
        "Performance & speed",
        "Security checks",
        "Reports + roadmap"
      ],
      details: [
        { h: "Support", items: ["Bug fixes", "Content updates", "Small features", "Priority queue"] },
        { h: "Performance", items: ["Speed audits", "Image optimization", "Core Web Vitals", "Caching"] },
        { h: "Security", items: ["Basic hardening", "Updates", "Backups", "Monitoring"] },
        { h: "Growth", items: ["Analytics", "Conversion improvements", "A/B ideas", "Monthly report"] },
      ]
    },
  };

  let activeKey = "web";

  function setActive(key){
    const data = content[key];
    if (!data) return;
    activeKey = key;

    panelBadge.textContent = data.title;
    panelTitle.textContent = data.title;
    panelDesc.textContent  = data.desc;

    panelBullets.innerHTML = "";
    data.bullets.forEach((b) => {
      const li = document.createElement("li");
      li.textContent = b;
      panelBullets.appendChild(li);
    });

    if (panelDetailsLink) panelDetailsLink.href = "services.html?cat=" + key;

    stack.querySelectorAll(".svc-item").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.key === key);
    });
  }

  // Left titles click → update panel
  stack.querySelectorAll(".svc-item").forEach(btn => {
    btn.addEventListener("click", () => setActive(btn.dataset.key));
    btn.addEventListener("mouseenter", () => setActive(btn.dataset.key));
    btn.addEventListener("focus", () => setActive(btn.dataset.key));
  });

  setActive("web");
}

  /* =========================
     LocalStorage “DB”
     ========================= */
  const LS = {
    get(key, fallback){
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch { return fallback; }
    },
    set(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  };
  const DB_KEYS = { users:"deweb_users", session:"deweb_session", orders:"deweb_orders" };

  function getSession(){ return LS.get(DB_KEYS.session, null); }
  function setSession(s){ LS.set(DB_KEYS.session, s); }
  function clearSession(){ localStorage.removeItem(DB_KEYS.session); }

  function getUsers(){ return LS.get(DB_KEYS.users, []); }
  function setUsers(u){ LS.set(DB_KEYS.users, u); }

  function getOrders(){ return LS.get(DB_KEYS.orders, []); }
  function setOrders(o){ LS.set(DB_KEYS.orders, o); }

  function uid(){ return Math.random().toString(16).slice(2) + Date.now().toString(16); }

  function findMe(){
    const s = getSession();
    if (!s) return null;
    return getUsers().find(u => u.id === s.userId) || null;
  }

  /* =========================
     Account modal
     ========================= */
  const accountModal = document.getElementById("accountModal");
  const openAccountBtn = document.getElementById("openAccountBtn");
  const closeAccountBtn = document.getElementById("closeAccountBtn");

  function openModal(){
    accountModal?.classList.add("show");
    accountModal?.setAttribute("aria-hidden","false");
    refreshDashboard();
  }
  function closeModal(){
    accountModal?.classList.remove("show");
    accountModal?.setAttribute("aria-hidden","true");
  }

  openAccountBtn?.addEventListener("click", openModal);
  closeAccountBtn?.addEventListener("click", closeModal);
  accountModal?.addEventListener("click", (e) => { if (e.target === accountModal) closeModal(); });

  document.getElementById("openAccountFromOrder")?.addEventListener("click", openModal);
  document.getElementById("openAccountFromMarket")?.addEventListener("click", openModal);

  // Tabs
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");
  function setTab(name){
    tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === name));
    panels.forEach(p => p.classList.toggle("active", p.dataset.panel === name));
  }
  tabs.forEach(t => t.addEventListener("click", () => setTab(t.dataset.tab)));

  // Role toggle
  const roleRadios = document.querySelectorAll('input[name="role"]');
  const clientFields = document.getElementById("clientFields");
  const devFields = document.getElementById("devFields");
  roleRadios.forEach(r => r.addEventListener("change", () => {
    const role = document.querySelector('input[name="role"]:checked')?.value;
    if (clientFields) clientFields.style.display = role === "client" ? "block" : "none";
    if (devFields) devFields.style.display = role === "dev" ? "block" : "none";
  }));

  // Sign up
  document.getElementById("signUpBtn")?.addEventListener("click", () => {
    const role = document.querySelector('input[name="role"]:checked')?.value || "client";
    const name = document.getElementById("suName")?.value?.trim() || "";
    const email = (document.getElementById("suEmail")?.value || "").trim().toLowerCase();
    const pass = document.getElementById("suPass")?.value || "";

    if (!name || !email || !pass) return alert("Fill required fields.");

    const users = getUsers();
    if (users.some(u => u.email === email)) return alert("Email already exists.");

    const user = {
      id: uid(),
      role,
      name,
      email,
      pass, // prototype only
      phone: document.getElementById("suPhone")?.value?.trim() || "",
      company: document.getElementById("suCompany")?.value?.trim() || "",
      skills: document.getElementById("suSkills")?.value?.trim() || "",
      portfolio: document.getElementById("suPortfolio")?.value?.trim() || ""
    };

    users.push(user);
    setUsers(users);
    setSession({ userId: user.id });

    document.getElementById("dashTab").style.display = "inline-flex";
    setTab("dashboard");
    refreshDashboard();
  });

  // Sign in
  document.getElementById("signInBtn")?.addEventListener("click", () => {
    const email = (document.getElementById("siEmail")?.value || "").trim().toLowerCase();
    const pass = document.getElementById("siPass")?.value || "";
    const user = getUsers().find(u => u.email === email && u.pass === pass);
    if (!user) return alert("Wrong email or password.");
    setSession({ userId: user.id });

    document.getElementById("dashTab").style.display = "inline-flex";
    setTab("dashboard");
    refreshDashboard();
  });

  // Log out
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    clearSession();
    document.getElementById("dashTab").style.display = "none";
    setTab("signin");
    refreshDashboard();
  });

  /* =========================
     Orders: create inquiry
     ========================= */
  document.getElementById("orderForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const service = document.getElementById("orderService").value;
    const budget = document.getElementById("orderBudget").value;
    const deadline = document.getElementById("orderDeadline").value.trim();
    const details = document.getElementById("orderDetails").value.trim();
    const name = document.getElementById("orderName").value.trim();
    const email = document.getElementById("orderEmail").value.trim();
    const phone = document.getElementById("orderPhone").value.trim();
    const pay = document.getElementById("orderPay").value;

    if (!details || !email) return alert("Please fill details + email.");

    const me = findMe();
    const order = {
      id: "ORD-" + Math.floor(Math.random()*90000 + 10000),
      createdAt: new Date().toISOString(),
      clientId: me?.id || null,
      clientEmail: email,
      clientName: name || me?.name || "Client",
      phone,
      service,
      budget,
      deadline,
      pay,
      details,
      stage: "Inquiry",
      assignedDevId: null
    };

    const orders = getOrders();
    orders.unshift(order);
    setOrders(orders);

    alert("Inquiry sent! Open Account to track it.");
    renderOpenOrders();
    renderMarketplace();
  });

  /* =========================
     Dashboard render
     ========================= */
  function refreshDashboard(){
    const me = findMe();

    const dashTab = document.getElementById("dashTab");
    const hello = document.getElementById("dashHello");
    const role = document.getElementById("dashRole");

    const clientDash = document.getElementById("clientDash");
    const devDash = document.getElementById("devDash");

    if (!me){
      if (dashTab) dashTab.style.display = "none";
      if (clientDash) clientDash.style.display = "none";
      if (devDash) devDash.style.display = "none";
      return;
    }

    if (dashTab) dashTab.style.display = "inline-flex";
    if (hello) hello.textContent = `Hello, ${me.name}`;
    if (role) role.textContent = `Role: ${me.role}`;

    if (me.role === "client"){
      if (clientDash) clientDash.style.display = "block";
      if (devDash) devDash.style.display = "none";

      const orders = getOrders().filter(o => o.clientId === me.id || o.clientEmail === me.email);
      const statsEl = document.getElementById("clientDashStats");
      const tbody = document.getElementById("clientOrdersList");
      const fallback = document.getElementById("clientOrdersListFallback");
      const tableWrap = document.querySelector(".dash-pro-table-wrap");

      if (statsEl) {
        const inProgress = orders.filter(o => o.stage === "In Progress" || o.stage === "Quote").length;
        const delivered = orders.filter(o => o.stage === "Delivered" || o.stage === "Done").length;
        const dict = I18N[currentLang] || I18N.en;
        const ordersLabel = dict.dash?.clientOrders || "My Orders";
        statsEl.innerHTML = `
          <div class="dash-stat-item"><span class="dash-stat-value">${orders.length}</span><span class="dash-stat-label">${ordersLabel}</span></div>
          <div class="dash-stat-item"><span class="dash-stat-value">${inProgress}</span><span class="dash-stat-label">In progress</span></div>
          <div class="dash-stat-item"><span class="dash-stat-value">${delivered}</span><span class="dash-stat-label">Delivered</span></div>
        `;
      }

      if (tbody) {
        if (orders.length === 0) {
          if (tableWrap) tableWrap.style.display = "none";
          if (fallback) { fallback.style.display = "block"; fallback.innerHTML = `<div class="dash-item">No orders yet.</div>`; }
          tbody.innerHTML = "";
        } else {
          if (tableWrap) tableWrap.style.display = "block";
          if (fallback) fallback.style.display = "none";
          tbody.innerHTML = orders.map(o => `
            <tr>
              <td><strong>${escapeHtml(o.id)}</strong></td>
              <td>${escapeHtml(o.service)}</td>
              <td>${escapeHtml(o.budget)}</td>
              <td><span class="badge badge-stage">${escapeHtml(o.stage)}</span></td>
            </tr>
          `).join("");
        }
      }
    }

    if (me.role === "dev"){
      if (clientDash) clientDash.style.display = "none";
      if (devDash) devDash.style.display = "block";

      document.getElementById("devProfileBox").innerHTML = `
        <div class="dash-item">
          <div><b>${me.name}</b></div>
          <div style="color:rgba(168,178,209,.95);margin-top:6px;line-height:1.6">
            Skills: ${escapeHtml(me.skills || "—")}<br/>
            Portfolio: ${
              me.portfolio
                ? `<a href="${escapeAttr(me.portfolio)}" target="_blank" style="color:var(--accent-cyan)">open</a>`
                : "—"
            }
          </div>
        </div>
      `;

      const all = getOrders();
      const newOrders = all.filter(o => !o.assignedDevId && o.stage === "Inquiry");
      const doneOrders = all.filter(o => o.assignedDevId === me.id && (o.stage === "Delivered" || o.stage === "Done"));

      const newBox = document.getElementById("devNewOrders");
      newBox.innerHTML = newOrders.length ? "" : `<div class="dash-item">No new orders.</div>`;
      newOrders.forEach(o => {
        const el = document.createElement("div");
        el.className = "dash-item";
        el.innerHTML = `
          <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
            <b>${o.id}</b>
            <span class="badge">${o.service}</span>
          </div>
          <div style="margin-top:8px;color:rgba(168,178,209,.95)">
            Budget: ${o.budget} • ${o.deadline || "no deadline"}
          </div>
          <button class="cta-btn primary" style="margin-top:10px" data-claim="${o.id}">Claim</button>
        `;
        newBox.appendChild(el);
      });

      newBox.querySelectorAll("[data-claim]").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.claim;
          const orders = getOrders();
          const target = orders.find(x => x.id === id);
          if (!target) return;
          target.assignedDevId = me.id;
          target.stage = "In Progress";
          setOrders(orders);
          refreshDashboard();
          renderOpenOrders();
        });
      });

      const doneBox = document.getElementById("devDoneOrders");
      doneBox.innerHTML = doneOrders.length ? "" : `<div class="dash-item">No completed orders.</div>`;
      doneOrders.forEach(o => {
        const el = document.createElement("div");
        el.className = "dash-item";
        el.innerHTML = `<b>${o.id}</b> <span class="badge">${o.stage}</span>`;
        doneBox.appendChild(el);
      });
    }
  }

  /* =========================
     Marketplace (profiles)
     ========================= */
  function ensureSeedProfiles(){
    const users = getUsers();
    const hasDev = users.some(u => u.role === "dev");
    if (hasDev) return;

    users.push(
      { id: uid(), role:"dev", name:"Aram H.", email:"aram@example.com", pass:"1234", skills:"Frontend (React), UI, Landing pages", portfolio:"https://github.com/" },
      { id: uid(), role:"dev", name:"Mariam S.", email:"mariam@example.com", pass:"1234", skills:"Design (Figma), Branding, UI Kits", portfolio:"https://www.behance.net/" },
      { id: uid(), role:"dev", name:"Gor K.", email:"gor@example.com", pass:"1234", skills:"Bots (Telegram), Node.js, Integrations", portfolio:"https://github.com/" }
    );
    setUsers(users);
  }

  function renderMarketplace(){
    const grid = document.getElementById("marketGrid");
    if (!grid) return;

    const q = (document.getElementById("marketSearch")?.value || "").trim().toLowerCase();
    const role = document.getElementById("marketRole")?.value || "all";
    const skill = document.getElementById("marketSkill")?.value || "all";

    const users = getUsers().filter(u => u.role === "dev");
    let list = users;

    if (role === "dev") list = users;
    if (q) list = list.filter(u => (u.name + " " + (u.skills||"")).toLowerCase().includes(q));

    if (skill !== "all"){
      const map = {
        frontend:["frontend","react","ui"],
        backend:["backend","api","server","node","python"],
        bots:["bot","telegram","automation"],
        design:["design","figma","brand","logo","ui"],
        seo:["seo","performance","speed"]
      };
      const keys = map[skill] || [skill];
      list = list.filter(u => keys.some(k => (u.skills||"").toLowerCase().includes(k)));
    }

    grid.innerHTML = "";
    if (!list.length){
      grid.innerHTML = `<div class="dash-item">No profiles found.</div>`;
      return;
    }

    list.forEach(u => {
      const card = document.createElement("div");
      card.className = "profile-card";
      const initials = (u.name || "D").split(" ").map(x => x[0]).slice(0,2).join("").toUpperCase();

      card.innerHTML = `
        <div class="profile-head">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="avatar">${escapeHtml(initials)}</div>
            <div>
              <div class="profile-name">${escapeHtml(u.name)}</div>
              <div style="margin-top:4px"><span class="badge">Developer</span></div>
            </div>
          </div>
        </div>

        <div class="profile-skills">${escapeHtml(u.skills || "—")}</div>

        <div class="profile-actions">
          ${
            u.portfolio
              ? `<a class="small-btn" href="${escapeAttr(u.portfolio)}" target="_blank">Portfolio</a>`
              : `<button class="small-btn" type="button" disabled style="opacity:.6;cursor:not-allowed">No portfolio</button>`
          }
          <button class="small-btn" type="button" data-hire="${u.id}">Hire</button>
        </div>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll("[data-hire]").forEach(btn => {
      btn.addEventListener("click", () => {
        alert("Hiring flow: In full version this opens chat + contract + payment. For now, create an order on the Order slide.");
        goToSlide(3);
      });
    });
  }

  /* =========================
     Open orders list
     ========================= */
  function renderOpenOrders(){
    const box = document.getElementById("openOrdersList");
    if (!box) return;

    const open = getOrders().filter(o => o.stage === "Inquiry" && !o.assignedDevId);
    box.innerHTML = open.length ? "" : `<div class="dash-item">No open orders yet. Create one.</div>`;

    open.forEach(o => {
      const el = document.createElement("div");
      el.className = "dash-item";
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
          <b>${o.id}</b>
          <span class="badge">${escapeHtml(o.service)}</span>
        </div>
        <div style="margin-top:8px;color:rgba(168,178,209,.95)">
          Budget: ${escapeHtml(o.budget)} • ${escapeHtml(o.deadline || "no deadline")}
        </div>
      `;
      box.appendChild(el);
    });
  }

  /* =========================
     About switcher (slide 6)
     ========================= */
  function initAboutSwitcher(){
    const aboutText = document.getElementById("aboutText");
    const cards = document.querySelectorAll(".service-card");
    if (!aboutText || !cards.length) return;

    const texts = {
      web: "Web production: landing pages, corporate websites, e-commerce stores, speed optimization and analytics setup.",
      bots: "Bots & automation: Telegram bots, CRM integrations, lead collection, booking, monitoring and smart workflows.",
      design: "Design & branding: UI/UX in Figma, logos, identity systems, product graphics and conversion-focused layouts.",
      growth: "Growth & support: monthly maintenance, performance and security checks, SEO foundations, conversion improvements.",
      market: "Marketplace: clients can hire specialists, developers can create profiles and claim tasks inside their dashboard.",
      process: "Process: Inquiry → Quote → Milestone payments → Production → QA → Delivery → Ongoing support (optional)."
    };

    function setActive(card){
      cards.forEach(c => c.classList.remove("is-active"));
      card.classList.add("is-active");
    }

    function setText(str){
      aboutText.classList.add("is-fading");
      setTimeout(() => {
        aboutText.textContent = str;
        aboutText.classList.remove("is-fading");
      }, 160);
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const key = card.dataset.key;
        setActive(card);
        setText(texts[key] || aboutText.textContent);
      });
    });
  }

  /* =========================
     Marketplace filter events
     ========================= */
  function bindMarketFilters(){
    ["marketSearch","marketRole","marketSkill"].forEach(id => {
      document.getElementById(id)?.addEventListener("input", renderMarketplace);
      document.getElementById(id)?.addEventListener("change", renderMarketplace);
    });
  }

  /* =========================
     Helpers: safe HTML
     ========================= */
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, (m) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[m]));
  }
  function escapeAttr(s){
    return escapeHtml(s).replace(/"/g, "&quot;");
  }

  /* =========================
     INIT
     ========================= */
  // ⚠️ Put your full RU/HY dictionaries here to keep i18n working (copy from your file):
  // window.__I18N_RU__ = { ...your RU object... };
  // window.__I18N_HY__ = { ...your HY object... };

  applyI18n(currentLang);
  renderLangUI();
  initServicesSection();

  createPagination();
  ensureSeedProfiles();
  bindMarketFilters();
  initAboutSwitcher();

  renderMarketplace();
  renderOpenOrders();
  refreshDashboard();

  goToSlide(0);
});
