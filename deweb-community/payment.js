// payment.js — Payment page: Card / Crypto / Bank, save card, use saved card

const CART_KEY = "deweb_services_cart";
const SAVED_CARDS_KEY = "deweb_saved_cards";
const LS_LANG = "deweb_lang";

const LANGS = [
  { code: "hy", label: "HY" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

let currentLang = localStorage.getItem(LS_LANG) || "en";
let cart = [];
let savedCards = [];

const I18N = {
  en: {
    payTitle: "Pay",
    payWith: "Pay with",
    payCard: "Card",
    payCrypto: "Crypto",
    payBank: "Bank transfer",
    payNow: "Pay now",
    useSavedCard: "Use saved card",
    orNewCard: "Or enter new card below.",
    cardNumber: "Card number",
    cardExpiry: "Expiry (MM/YY)",
    cardCvc: "CVC",
    nameOnCard: "Name on card",
    saveCardToAccount: "Save card to my account",
    walletAddress: "Wallet address",
    networkOptional: "Network (optional)",
    paymentReference: "Payment reference / Order ID",
    bankHint: "We will send bank details and amount to your email after you confirm.",
    backToDeweb: "← Back to DEWEB",
    cart: "Cart",
    orderSummary: "Order summary",
    items: "items",
    successSent: "Thank you! Payment received. We will contact you soon.",
  },
  ru: {
    payTitle: "Оплатить",
    payWith: "Оплатить",
    payCard: "Карта",
    payCrypto: "Криптовалюта",
    payBank: "Банковский перевод",
    payNow: "Оплатить сейчас",
    useSavedCard: "Использовать сохранённую карту",
    orNewCard: "Или введите новую карту ниже.",
    cardNumber: "Номер карты",
    cardExpiry: "Срок (ММ/ГГ)",
    cardCvc: "CVC",
    nameOnCard: "Имя на карте",
    saveCardToAccount: "Сохранить карту в аккаунте",
    walletAddress: "Адрес кошелька",
    networkOptional: "Сеть (необязательно)",
    paymentReference: "Референс / ID заказа",
    bankHint: "Мы отправим реквизиты и сумму на вашу почту после подтверждения.",
    backToDeweb: "← Назад в DEWEB",
    cart: "Корзина",
    orderSummary: "Заказ",
    items: "товаров",
    successSent: "Спасибо! Оплата получена. Мы скоро свяжемся с вами.",
  },
  hy: {
    payTitle: "Վճարել",
    payWith: "Վճարել",
    payCard: "Քարտ",
    payCrypto: "Կրիպտո",
    payBank: "Բանկային փոխանցում",
    payNow: "Վճարել հիմա",
    useSavedCard: "Օգտագործել պահված քարտ",
    orNewCard: "Կամ մուտքագրեք նոր քարտ։",
    cardNumber: "Քարտի համար",
    cardExpiry: "Ժամկետ (ԹԹ/ԱԱ)",
    cardCvc: "CVC",
    nameOnCard: "Անուն քարտի վրա",
    saveCardToAccount: "Պահել քարտը իմ հաշվում",
    walletAddress: "Դրամապանակի հասցե",
    networkOptional: "Ցանց (ընտրովի)",
    paymentReference: "Վճարման հղում / Պատվերի ID",
    bankHint: "Հաստատելուց հետո բանկային տվյալներն ու գումարը կուղարկենք ձեր email-ին։",
    backToDeweb: "← Հետ DEWEB",
    cart: "Զամբյուղ",
    orderSummary: "Պատվեր",
    items: "ապրանք",
    successSent: "Շնորհակալություն։ Վճարումը ստացվեց։ Շուտով կկապվենք։",
  },
};

function t(key) {
  return I18N[currentLang]?.[key] ?? I18N.en[key] ?? key;
}

function loadCart() {
  try {
    const s = sessionStorage.getItem(CART_KEY);
    cart = s ? JSON.parse(s) : [];
  } catch (_) {
    cart = [];
  }
}

function loadSavedCards() {
  try {
    const s = localStorage.getItem(SAVED_CARDS_KEY);
    savedCards = s ? JSON.parse(s) : [];
  } catch (_) {
    savedCards = [];
  }
}

function saveSavedCards() {
  localStorage.setItem(SAVED_CARDS_KEY, JSON.stringify(savedCards));
}

function maskCardNumber(num) {
  const digits = (num || "").replace(/\D/g, "");
  if (digits.length < 4) return "••••";
  return "•••• " + digits.slice(-4);
}

function applyI18n() {
  const title = document.getElementById("paymentTitle");
  if (title) title.textContent = t("payTitle");
  const payWith = document.getElementById("payWithLabel");
  if (payWith) payWith.textContent = t("payWith");
  document.getElementById("payCard").textContent = t("payCard");
  document.getElementById("payCrypto").textContent = t("payCrypto");
  document.getElementById("payBank").textContent = t("payBank");
  const payCardBtn = document.getElementById("payCardBtn");
  if (payCardBtn) payCardBtn.textContent = t("payNow");
  const payCryptoBtn = document.getElementById("payCryptoBtn");
  if (payCryptoBtn) payCryptoBtn.textContent = t("payNow");
  const payBankBtn = document.getElementById("payBankBtn");
  if (payBankBtn) payBankBtn.textContent = t("payNow");
  const saveCardLabel = document.getElementById("saveCardLabel");
  if (saveCardLabel) saveCardLabel.textContent = t("saveCardToAccount");
  const savedCardsWrap = document.getElementById("savedCardsWrap");
  if (savedCardsWrap) {
    const label = savedCardsWrap.querySelector("label");
    if (label) label.textContent = t("useSavedCard");
    const hint = savedCardsWrap.querySelector(".payment-method-hint");
    if (hint) hint.textContent = t("orNewCard");
  }
  const cardNumber = document.getElementById("cardNumber");
  if (cardNumber) cardNumber.placeholder = "4242 4242 4242 4242";
  const cardExpiry = document.getElementById("cardExpiry");
  if (cardExpiry) cardExpiry.placeholder = "MM/YY";
  const cardName = document.getElementById("cardName");
  if (cardName) cardName.placeholder = t("nameOnCard");
  const bankHint = document.querySelector("#panelBank .payment-method-hint");
  if (bankHint) bankHint.textContent = t("bankHint");
  const backToDeweb = document.getElementById("backToDeweb");
  if (backToDeweb) backToDeweb.textContent = t("backToDeweb");
  const backToCart = document.getElementById("backToCart");
  if (backToCart) backToCart.textContent = t("cart");
}

function renderSummary() {
  const el = document.getElementById("paymentSummary");
  if (!el) return;
  if (cart.length === 0) {
    el.textContent = "";
    return;
  }
  const count = cart.length;
  el.innerHTML = `<p class="sub">${t("orderSummary")}: ${count} ${t("items")}</p>`;
}

function renderSavedCardsSelect() {
  const wrap = document.getElementById("savedCardsWrap");
  const select = document.getElementById("savedCardSelect");
  if (!wrap || !select) return;
  if (savedCards.length === 0) {
    wrap.style.display = "none";
    return;
  }
  wrap.style.display = "block";
  select.innerHTML = "<option value=\"\">— " + t("useSavedCard") + " —</option>" +
    savedCards.map((c, i) => `<option value="${i}">${c.mask}</option>`).join("");
}

// Tabs
document.querySelectorAll(".payment-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const method = tab.dataset.method;
    document.querySelectorAll(".payment-tab").forEach((t) => t.classList.toggle("active", t.dataset.method === method));
    document.querySelectorAll(".payment-method").forEach((p) => {
      p.style.display = p.dataset.panel === method ? "block" : "none";
    });
  });
});

function completePayment() {
  alert(t("successSent"));
  sessionStorage.removeItem(CART_KEY);
  window.location.href = "services.html";
}

document.getElementById("payCardBtn")?.addEventListener("click", () => {
  const select = document.getElementById("savedCardSelect");
  const useSaved = select && select.value !== "";
  if (useSaved) {
    completePayment();
    return;
  }
  const number = document.getElementById("cardNumber")?.value?.replace(/\s/g, "") || "";
  const expiry = document.getElementById("cardExpiry")?.value?.trim() || "";
  const cvc = document.getElementById("cardCvc")?.value?.trim() || "";
  const name = document.getElementById("cardName")?.value?.trim() || "";
  if (!number || number.replace(/\D/g, "").length < 13) {
    alert("Please enter a valid card number.");
    return;
  }
  const saveCheck = document.getElementById("saveCardCheck")?.checked;
  if (saveCheck) {
    const last4 = number.replace(/\D/g, "").slice(-4);
    savedCards.push({ id: Date.now().toString(36), mask: maskCardNumber(number), last4 });
    saveSavedCards();
    renderSavedCardsSelect();
  }
  completePayment();
});

document.getElementById("payCryptoBtn")?.addEventListener("click", () => {
  completePayment();
});

document.getElementById("payBankBtn")?.addEventListener("click", () => {
  completePayment();
});

// Lang dropdown
const langDD = document.getElementById("langDD");
const langBtn = document.getElementById("langBtn");
const langLabel = document.getElementById("langLabel");
const langMenu = document.getElementById("langMenu");

function renderLangUI() {
  const selected = LANGS.find((l) => l.code === currentLang) || LANGS[1];
  if (langLabel) langLabel.textContent = selected.label;
  if (!langMenu) return;
  langMenu.innerHTML = "";
  LANGS.filter((l) => l.code !== currentLang).forEach((l) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "lang-dd__item";
    item.textContent = l.label;
    item.onclick = () => {
      currentLang = l.code;
      localStorage.setItem(LS_LANG, currentLang);
      renderLangUI();
      if (langDD) langDD.classList.remove("open");
      applyI18n();
      renderSummary();
      renderSavedCardsSelect();
    };
    langMenu.appendChild(item);
  });
}

function toggleLangMenu() {
  if (langDD) langDD.classList.toggle("open");
}

if (langBtn && langDD) {
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleLangMenu();
  });
  document.addEventListener("click", (e) => {
    if (langDD && !langDD.contains(e.target)) langDD.classList.remove("open");
  });
}

loadCart();
if (cart.length === 0) {
  window.location.href = "cart.html";
} else {
  loadSavedCards();
  renderLangUI();
  applyI18n();
  renderSummary();
  renderSavedCardsSelect();
}
