// account-dashboard.js — Account dashboard: My Profile, My Products, Renewals, Payment Methods, etc.

const LS = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};
const DB_KEYS = {
  users: "deweb_users",
  session: "deweb_session",
  orders: "deweb_orders",
  savedCards: "deweb_saved_cards",
  servicesCart: "deweb_services_cart"
};
const LS_LANG = "deweb_lang";

function getSession() { return LS.get(DB_KEYS.session, null); }
function clearSession() { localStorage.removeItem(DB_KEYS.session); }
function getUsers() { return LS.get(DB_KEYS.users, []); }
function setUsers(users) { LS.set(DB_KEYS.users, users); }
function findMe() {
  const s = getSession();
  if (!s) return null;
  return getUsers().find(u => u.id === s.userId) || null;
}
function updateMe(updates) {
  const me = findMe();
  if (!me) return;
  const users = getUsers();
  const idx = users.findIndex(u => u.id === me.id);
  if (idx === -1) return;
  users[idx] = { ...users[idx], ...updates };
  setUsers(users);
}

function getInitials(name) {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
function formatPhone(str) {
  const d = (str || "").replace(/\D/g, "");
  if (d.length >= 10) return "+" + d.slice(0, 3) + "." + d.slice(3);
  return str || "—";
}

// ——— Not logged in → redirect ———
const me = findMe();
if (!me) {
  window.location.href = "account.html";
}

// ——— Section switching ———
const sections = [
  "profile", "products", "renewals", "payment-methods", "order-history",
  "security", "delegate", "domain-defaults", "contact-prefs", "payees"
];
const sectionTitles = {
  profile: "My Profile",
  products: "My Products",
  renewals: "Renewals & Billing",
  "payment-methods": "Payment Methods",
  "order-history": "Order History",
  security: "Security",
  delegate: "Delegate Access",
  "domain-defaults": "Domain Defaults",
  "contact-prefs": "Contact Preferences",
  payees: "Payees"
};

function setActiveSection(id) {
  sections.forEach(sid => {
    const el = document.getElementById("section-" + sid);
    if (el) el.classList.toggle("active", sid === id);
  });
  document.querySelectorAll(".sidebar-link[data-section]").forEach(a => {
    a.classList.toggle("active", a.getAttribute("data-section") === id);
  });
  if (id !== "profile") renderSectionContent(id);
}

function renderSectionContent(id) {
  const container = document.getElementById("section-" + id);
  if (!container) return;
  if (id === "profile") return;
  const title = sectionTitles[id];
  const renderers = {
    products: renderProducts,
    renewals: renderRenewals,
    "payment-methods": renderPaymentMethods,
    "order-history": renderOrderHistory,
    security: renderSecurity,
    delegate: renderDelegate,
    "domain-defaults": renderDomainDefaults,
    "contact-prefs": renderContactPrefs,
    payees: renderPayees
  };
  const fn = renderers[id];
  const html = fn ? fn() : `<div class="section-empty"><p>Content for ${title} will be available here.</p></div>`;
  container.innerHTML = `<h1 class="dashboard-page-title">${title}</h1>${html}`;
}

function renderProducts() {
  const orders = LS.get(DB_KEYS.orders, []);
  const cart = LS.get(DB_KEYS.servicesCart, []);
  const myOrders = orders.filter(o => o.userId === findMe()?.id);
  const paid = myOrders.filter(o => o.status === "paid" || o.status === "completed");
  const pending = myOrders.filter(o => o.status === "pending" || o.status === "processing");
  const failed = myOrders.filter(o => o.status === "failed" || o.status === "cancelled");
  return `
    <div class="section-block">
      <h3>Purchase history</h3>
      ${myOrders.length === 0 ? '<div class="section-empty"><p>No orders yet.</p><a href="services.html" class="cta-btn primary">Browse services</a></div>' : `
        <table class="section-table">
          <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            ${myOrders.slice(0, 20).map(o => `
              <tr>
                <td>#${(o.id || o.orderId || "—").toString().slice(0, 8)}</td>
                <td>${o.date || "—"}</td>
                <td>${Array.isArray(o.items) ? o.items.length : 0} item(s)</td>
                <td>${o.total != null ? o.total + " " + (o.currency || "USD") : "—"}</td>
                <td><span class="status-badge status-${(o.status || "").toLowerCase()}">${(o.status || "—")}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `}
    </div>
    <div class="section-block">
      <h3>Items to pay</h3>
      ${pending.length === 0 && cart.length === 0 ? '<div class="section-empty"><p>No pending payments.</p></div>' : `
        ${pending.length ? `<p>You have <strong>${pending.length}</strong> order(s) pending payment.</p>` : ""}
        ${cart.length ? `<p>Cart: <strong>${cart.length}</strong> item(s) — <a href="services.html" class="cta-btn primary">Go to cart</a></p>` : ""}
      `}
    </div>
    <div class="section-block">
      <h3>Paid / Failed</h3>
      <p>Paid: <strong>${paid.length}</strong> — Failed: <strong>${failed.length}</strong></p>
    </div>
  `;
}

function renderRenewals() {
  const renewals = []; // could come from orders or a renewals store
  return `
    <div class="section-block">
      <h3>Upcoming renewals</h3>
      ${renewals.length === 0 ? '<div class="section-empty"><p>No upcoming renewals.</p><p>Domain and service renewals will appear here.</p></div>' : `
        <table class="section-table">
          <thead><tr><th>Item</th><th>Renewal date</th><th>Amount</th><th>Action</th></tr></thead>
          <tbody>${renewals.map(r => `<tr><td>${r.name}</td><td>${r.date}</td><td>${r.amount}</td><td><button class="cta-btn primary">Renew</button></td></tr>`).join("")}</tbody>
        </table>
      `}
    </div>
    <div class="section-block">
      <h3>Billing history</h3>
      <div class="section-empty"><p>Invoices and billing history will be listed here.</p></div>
    </div>
  `;
}

function renderPaymentMethods() {
  const cards = LS.get(DB_KEYS.savedCards, []);
  const myId = findMe()?.id;
  const myCards = Array.isArray(cards) ? cards.filter(c => c.userId === myId) : [];
  return `
    <div class="section-block">
      <h3>Saved payment methods</h3>
      ${myCards.length === 0 ? '<div class="section-empty"><p>No saved cards.</p><p>Add a card when checking out to see it here.</p></div>' : `
        <table class="section-table">
          <thead><tr><th>Type</th><th>Last 4</th><th>Expiry</th><th>Default</th></tr></thead>
          <tbody>
            ${myCards.map(c => `<tr><td>${c.brand || "Card"}</td><td>**** ${(c.last4 || "****")}</td><td>${c.expiry || "—"}</td><td>${c.default ? "Yes" : "—"}</td></tr>`).join("")}
          </tbody>
        </table>
      `}
    </div>
    <div class="section-block">
      <p><button class="cta-btn secondary" disabled>Add payment method</button> (available at checkout)</p>
    </div>
  `;
}

function renderOrderHistory() {
  const orders = LS.get(DB_KEYS.orders, []);
  const myId = findMe()?.id;
  const myOrders = (orders || []).filter(o => o.userId === myId);
  return `
    <div class="section-block">
      <h3>All orders</h3>
      ${myOrders.length === 0 ? '<div class="section-empty"><p>No orders yet.</p><a href="services.html" class="cta-btn primary">Browse services</a></div>' : `
        <table class="section-table">
          <thead><tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            ${myOrders.slice(0, 30).map(o => `
              <tr>
                <td>#${(o.id || o.orderId || "—").toString().slice(0, 12)}</td>
                <td>${o.date || "—"}</td>
                <td>${o.total != null ? o.total + " " + (o.currency || "USD") : "—"}</td>
                <td>${o.status || "—"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function renderSecurity() {
  return `
    <div class="section-block">
      <h3>Password</h3>
      <p>Change your password to keep your account secure.</p>
      <button type="button" class="cta-btn primary" id="changePasswordBtn">Change password</button>
    </div>
    <div class="section-block">
      <h3>Two-factor authentication</h3>
      <p>Add an extra layer of security with 2FA. (Coming soon)</p>
    </div>
    <div class="section-block">
      <h3>Active sessions</h3>
      <p>Current session: this device. Sign out elsewhere from this page.</p>
    </div>
  `;
}

function renderDelegate() {
  return `
    <div class="section-block">
      <h3>Delegate access</h3>
      <p>Grant other users limited access to manage your products and billing.</p>
      <div class="section-empty"><p>No delegates added.</p><button class="cta-btn secondary" disabled>Add delegate</button></p></div>
    </div>
  `;
}

function renderDomainDefaults() {
  return `
    <div class="section-block">
      <h3>Domain defaults</h3>
      <p>Set default nameservers, renewal preferences, and contact details for new domains.</p>
      <div class="section-empty"><p>Configure when you add your first domain.</p></div>
    </div>
  `;
}

function renderContactPrefs() {
  return `
    <div class="section-block">
      <h3>Contact preferences</h3>
      <p>Choose how we contact you: marketing, renewal reminders, and security alerts.</p>
      <p><label><input type="checkbox" checked /> Email: renewal reminders</label></p>
      <p><label><input type="checkbox" checked /> Email: product updates</label></p>
      <p><label><input type="checkbox" /> SMS: critical alerts</label></p>
      <button class="cta-btn primary">Save preferences</button>
    </div>
  `;
}

function renderPayees() {
  return `
    <div class="section-block">
      <h3>Payees</h3>
      <p>Manage payees for wire transfers and other payment types.</p>
      <div class="section-empty"><p>No payees added.</p></div>
    </div>
  `;
}

document.querySelectorAll(".sidebar-link[data-section]").forEach(a => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const id = a.getAttribute("data-section");
    if (id) setActiveSection(id);
  });
});

// ——— Profile: fill and edit ———
let profileDirty = false;
const fieldMap = {
  name: { valueEl: "profileName", inputId: "editName", key: "name" },
  address: { valueEl: "profileAddress", inputId: "editAddress", key: "address" },
  organization: { valueEl: "profileOrganization", inputId: "editOrganization", key: "company" },
  email: { valueEl: "profileEmail", inputId: "editEmail", key: "email" },
  phone: { valueEl: "profilePhone", inputId: "editPhone", key: "phone" },
  phone2: { valueEl: "profilePhone2", inputId: "editPhone2", key: "phone2" },
  homePhone: { valueEl: "profileHomePhone", inputId: "editHomePhone", key: "homePhone" },
  currency: { valueEl: "profileCurrency", inputId: "editCurrency", key: "currency" }
};

function fillProfile() {
  const user = findMe();
  if (!user) return;
  document.getElementById("profileName").textContent = user.name || "—";
  document.getElementById("profileAddress").textContent = user.address || "—";
  document.getElementById("profileOrganization").textContent = user.company || "—";
  document.getElementById("profileEmail").textContent = user.email || "—";
  document.getElementById("profilePhone").textContent = user.phone ? formatPhone(user.phone) : "—";
  document.getElementById("profilePhone2").textContent = user.phone2 || "—";
  document.getElementById("profileHomePhone").textContent = user.homePhone || "—";
  const currencyEl = document.getElementById("profileCurrency");
  const editCurrency = document.getElementById("editCurrency");
  currencyEl.textContent = user.currency || "USD";
  if (editCurrency) editCurrency.value = user.currency || "USD";

  const emailVerified = user.emailVerified === true;
  const phoneVerified = user.phoneVerified === true;
  const emailBadge = document.getElementById("emailVerifiedBadge");
  const phoneBadge = document.getElementById("phoneVerifiedBadge");
  const verifyEmailBtn = document.getElementById("verifyEmailBtn");
  const verifyPhoneBtn = document.getElementById("verifyPhoneBtn");
  if (emailBadge) emailBadge.style.display = emailVerified ? "inline" : "none";
  if (verifyEmailBtn) verifyEmailBtn.style.display = user.email && !emailVerified ? "inline" : "none";
  if (phoneBadge) phoneBadge.style.display = phoneVerified ? "inline" : "none";
  if (verifyPhoneBtn) verifyPhoneBtn.style.display = user.phone && !phoneVerified ? "inline" : "none";
}

function setProfileDirty(dirty) {
  profileDirty = dirty;
  const saveBtn = document.getElementById("profileSaveBtn");
  if (saveBtn) saveBtn.style.display = dirty ? "inline-block" : "none";
}

document.querySelectorAll(".profile-row[data-field]").forEach(row => {
  row.addEventListener("click", () => {
    const field = row.getAttribute("data-field");
    const cfg = fieldMap[field];
    if (!cfg) return;
    const valueEl = document.getElementById(cfg.valueEl);
    const inputEl = document.getElementById(cfg.inputId);
    if (!valueEl || !inputEl) return;
    if (inputEl.style.display === "none") {
      valueEl.style.display = "none";
      inputEl.style.display = "block";
      if (inputEl.tagName === "SELECT") inputEl.value = (findMe() || {})[cfg.key] || "USD";
      else inputEl.value = (findMe() || {})[cfg.key] || "";
      inputEl.focus();
    }
  });
});

["editName", "editAddress", "editOrganization", "editEmail", "editPhone", "editPhone2", "editHomePhone", "editCurrency"].forEach(id => {
  const input = document.getElementById(id);
  if (!input) return;
  function commit() {
    const field = Object.entries(fieldMap).find(([, c]) => c.inputId === id)?.[0];
    if (!field) return;
    const cfg = fieldMap[field];
    const user = findMe();
    if (!user) return;
    let val = input.value.trim();
    if (cfg.key === "currency") val = val || "USD";
    const prev = user[cfg.key];
    if (String(prev) === String(val)) {
      input.style.display = "none";
      document.getElementById(cfg.valueEl).style.display = "";
      return;
    }
    updateMe({ [cfg.key]: val });
    if (field === "name") document.getElementById("navAvatar").textContent = getInitials(val);
    if (field === "phone" || field === "phone2" || field === "homePhone") val = val ? formatPhone(val) : "—";
    document.getElementById(cfg.valueEl).textContent = val || "—";
    input.style.display = "none";
    document.getElementById(cfg.valueEl).style.display = "";
    setProfileDirty(true);
  }
  input.addEventListener("blur", commit);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } });
});

document.getElementById("profileSaveBtn")?.addEventListener("click", () => {
  setProfileDirty(false);
  fillProfile();
});

// ——— Verification modal ———
const verifyModal = document.getElementById("verifyModal");
const verifyModalTitle = document.getElementById("verifyModalTitle");
const verifyModalDesc = document.getElementById("verifyModalDesc");
const verifyStepSend = document.getElementById("verifyStepSend");
const verifyStepEnter = document.getElementById("verifyStepEnter");
const verifyCodeInput = document.getElementById("verifyCodeInput");
const verifySendCodeBtn = document.getElementById("verifySendCodeBtn");
const verifyConfirmBtn = document.getElementById("verifyConfirmBtn");
const verifyModalClose = document.getElementById("verifyModalClose");

let verifyMode = "email"; // 'email' | 'phone'
const MOCK_CODE = "123456";

function openVerifyModal(mode) {
  verifyMode = mode;
  verifyModal.setAttribute("aria-hidden", "false");
  verifyStepSend.style.display = "";
  verifyStepEnter.style.display = "none";
  verifyCodeInput.value = "";
  if (mode === "email") {
    verifyModalTitle.textContent = "Verify Email";
    verifyModalDesc.textContent = "We'll send a 6-digit code to your email. Enter it below.";
  } else {
    verifyModalTitle.textContent = "Verify Phone";
    verifyModalDesc.textContent = "We'll send a 6-digit code via SMS. Enter it below.";
  }
}

function closeVerifyModal() {
  verifyModal.setAttribute("aria-hidden", "true");
}

verifyModalClose?.addEventListener("click", closeVerifyModal);
verifyModal?.addEventListener("click", (e) => { if (e.target === verifyModal) closeVerifyModal(); });

verifySendCodeBtn?.addEventListener("click", () => {
  // Mock: "sent"
  verifyStepSend.style.display = "none";
  verifyStepEnter.style.display = "block";
  verifyCodeInput.focus();
});

verifyConfirmBtn?.addEventListener("click", () => {
  const code = (verifyCodeInput.value || "").trim();
  if (code !== MOCK_CODE) {
    alert("Invalid code. Try 123456 for demo.");
    return;
  }
  if (verifyMode === "email") updateMe({ emailVerified: true });
  else updateMe({ phoneVerified: true });
  closeVerifyModal();
  fillProfile();
});

verifyCodeInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") verifyConfirmBtn?.click();
});

document.getElementById("verifyEmailBtn")?.addEventListener("click", (e) => { e.stopPropagation(); openVerifyModal("email"); });
document.getElementById("verifyPhoneBtn")?.addEventListener("click", (e) => { e.stopPropagation(); openVerifyModal("phone"); });

// ——— Init ———
fillProfile();
document.getElementById("navAvatar").textContent = getInitials(findMe()?.name);

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  clearSession();
  window.location.href = "account.html";
});

// Lang dropdown
const langDD = document.getElementById("langDD");
const langBtn = document.getElementById("langBtn");
const langLabel = document.getElementById("langLabel");
const langMenu = document.getElementById("langMenu");
const LANGS = [{ code: "hy", label: "HY" }, { code: "en", label: "EN" }, { code: "ru", label: "RU" }];
let currentLang = localStorage.getItem(LS_LANG) || "en";

function renderLangUI() {
  const selected = LANGS.find(l => l.code === currentLang) || LANGS[1];
  if (langLabel) langLabel.textContent = selected.label;
  if (!langMenu) return;
  langMenu.innerHTML = "";
  LANGS.filter(l => l.code !== currentLang).forEach(l => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "lang-dd__item";
    item.textContent = l.label;
    item.onclick = () => {
      currentLang = l.code;
      localStorage.setItem(LS_LANG, currentLang);
      renderLangUI();
      if (langDD) langDD.classList.remove("open");
    };
    langMenu.appendChild(item);
  });
}
if (langBtn && langDD) {
  langBtn.addEventListener("click", (e) => { e.stopPropagation(); langDD.classList.toggle("open"); });
  document.addEventListener("click", (e) => { if (langDD && !langDD.contains(e.target)) langDD.classList.remove("open"); });
}
renderLangUI();
