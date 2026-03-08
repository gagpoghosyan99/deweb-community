// cart.js — Cart page: list items, remove, Pay → payment.html

const CART_KEY = "deweb_services_cart";
const LS_LANG = "deweb_lang";

const LANGS = [
  { code: "hy", label: "HY" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

let currentLang = localStorage.getItem(LS_LANG) || "en";
let cart = [];

const I18N = {
  en: {
    yourCart: "Your cart",
    cartEmpty: "Your cart is empty.",
    payBtn: "Pay",
    continueShopping: "Continue shopping",
    backToDeweb: "← Back to DEWEB",
    services: "Services",
  },
  ru: {
    yourCart: "Ваша корзина",
    cartEmpty: "Корзина пуста.",
    payBtn: "Оплатить",
    continueShopping: "Продолжить покупки",
    backToDeweb: "← Назад в DEWEB",
    services: "Услуги",
  },
  hy: {
    yourCart: "Ձեր զամբյուղը",
    cartEmpty: "Զամբյուղը դատարկ է։",
    payBtn: "Վճարել",
    continueShopping: "Շարունակել գնումները",
    backToDeweb: "← Հետ DEWEB",
    services: "Ծառայություններ",
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

function saveCart() {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}

function renderCart() {
  const list = document.getElementById("cartList");
  const emptyEl = document.getElementById("cartEmpty");
  const footer = document.getElementById("cartFooter");
  const emptyActions = document.getElementById("emptyActions");

  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = "";
    if (emptyEl) emptyEl.style.display = "block";
    if (footer) footer.style.display = "none";
    if (emptyActions) emptyActions.style.display = "block";
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";
  if (footer) footer.style.display = "block";
  if (emptyActions) emptyActions.style.display = "none";

  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = cart.length === 1 ? "1 item" : `${cart.length} items`;

  list.innerHTML = cart
    .map(
      (item, i) => `
    <div class="cart-item" data-i="${i}">
      <span class="cart-item-name">${escapeHtml(item.name)}</span>
      <span class="cart-item-qty">× ${item.qty}</span>
      <span class="cart-item-price">${escapeHtml(item.price)}</span>
      <button type="button" class="cart-item-remove" data-i="${i}" aria-label="Remove">×</button>
    </div>
  `
    )
    .join("");

  list.querySelectorAll(".cart-item-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      cart.splice(Number(btn.dataset.i), 1);
      saveCart();
      renderCart();
    });
  });
}

function applyI18n() {
  const title = document.getElementById("cartPageTitle");
  if (title) title.textContent = t("yourCart");
  const emptyEl = document.getElementById("cartEmpty");
  if (emptyEl) emptyEl.textContent = t("cartEmpty");
  const payBtn = document.getElementById("payBtn");
  if (payBtn) payBtn.textContent = t("payBtn");
  const continueShopping = document.getElementById("continueShopping");
  if (continueShopping) continueShopping.textContent = t("continueShopping");
  const continueShoppingEmpty = document.getElementById("continueShoppingEmpty");
  if (continueShoppingEmpty) continueShoppingEmpty.textContent = t("continueShopping");
  const backToDeweb = document.getElementById("backToDeweb");
  if (backToDeweb) backToDeweb.textContent = t("backToDeweb");
  const backToServices = document.getElementById("backToServices");
  if (backToServices) backToServices.textContent = t("services");
}

document.getElementById("payBtn")?.addEventListener("click", () => {
  window.location.href = "payment.html";
});

// Lang dropdown (minimal)
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
      renderCart();
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
renderLangUI();
applyI18n();
renderCart();
