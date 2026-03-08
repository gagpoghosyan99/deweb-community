// account.js — Account page (1:1 design, shared localStorage with index.html)

const LS = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};
const DB_KEYS = { users: "deweb_users", session: "deweb_session", activity: "deweb_activity" };
const LS_LANG = "deweb_lang";

function getSession() { return LS.get(DB_KEYS.session, null); }
function setSession(s) { LS.set(DB_KEYS.session, s); }
function getUsers() { return LS.get(DB_KEYS.users, []); }
function setUsers(u) { LS.set(DB_KEYS.users, u); }
function getActivity() { return LS.get(DB_KEYS.activity, {}); }
function setActivity(a) { LS.set(DB_KEYS.activity, a); }
function pushActivity(userId, entry) {
  const a = getActivity();
  if (!a[userId]) a[userId] = [];
  a[userId].unshift({ at: new Date().toISOString(), ...entry });
  a[userId] = a[userId].slice(0, 20);
  setActivity(a);
}
function uid() { return Math.random().toString(16).slice(2) + Date.now().toString(16); }

const LANGS = [{ code: "hy", label: "HY" }, { code: "en", label: "EN" }, { code: "ru", label: "RU" }];
let currentLang = localStorage.getItem(LS_LANG) || "en";

const I18N = {
  en: { signin: "Sign In", signup: "Sign Up", noAccount: "Don't have an account?", haveAccount: "Already have an account?" },
  ru: { signin: "Вход", signup: "Регистрация", noAccount: "Нет аккаунта?", haveAccount: "Уже есть аккаунт?" },
  hy: { signin: "Մուտք", signup: "Գրանցում", noAccount: "Հաշիվ չունե՞ք։", haveAccount: "Արդեն հաշիվ ունե՞ք։" }
};
function t(key) { return I18N[currentLang]?.[key] ?? I18N.en[key] ?? key; }

function goToDashboard() {
  window.location.href = "account-dashboard.html";
}

const panels = document.querySelectorAll(".account-page__panel");
const heroSignIn = document.getElementById("heroSignIn");
const heroSignUp = document.getElementById("heroSignUp");
const accountFormTitle = document.getElementById("accountFormTitle");

function setPanel(name) {
  panels.forEach(p => {
    const on = p.dataset.panel === name;
    p.classList.toggle("active", on);
    p.hidden = !on;
  });
  if (accountFormTitle) accountFormTitle.textContent = name === "signup" ? t("signup") : t("signin");
  if (heroSignIn) heroSignIn.style.display = name === "signin" ? "block" : "none";
  if (heroSignUp) heroSignUp.style.display = name === "signup" ? "block" : "none";
}

document.getElementById("goSignUp")?.addEventListener("click", () => setPanel("signup"));
document.getElementById("goSignIn")?.addEventListener("click", () => setPanel("signin"));

// Sign in (username or email)
document.getElementById("signInBtn")?.addEventListener("click", () => {
  const username = (document.getElementById("siUsername")?.value || "").trim();
  const pass = document.getElementById("siPass")?.value || "";
  const user = getUsers().find(u => (u.email === username || (u.username && u.username === username)) && u.pass === pass);
  if (!user) return alert("Wrong username or password.");
  setSession({ userId: user.id });
  pushActivity(user.id, { method: "signin" });
  goToDashboard();
});

// Sign up
document.getElementById("signUpBtn")?.addEventListener("click", () => {
  const username = (document.getElementById("suUsername")?.value || "").trim();
  const email = (document.getElementById("suEmail")?.value || "").trim().toLowerCase();
  const pass = document.getElementById("suPass")?.value || "";
  const newsletter = document.getElementById("suNewsletter")?.checked || false;

  if (!username || !email || !pass) return alert("Fill required fields.");

  const users = getUsers();
  if (users.some(u => u.email === email)) return alert("Email already exists.");

  const user = {
    id: uid(),
    role: "client",
    name: username,
    username,
    email,
    pass,
    newsletter,
    linkedProviders: []
  };
  users.push(user);
  setUsers(users);
  setSession({ userId: user.id });
  pushActivity(user.id, { method: "signup" });
  goToDashboard();
});

// Lang dropdown
const langDD = document.getElementById("langDD");
const langBtn = document.getElementById("langBtn");
const langLabel = document.getElementById("langLabel");
const langMenu = document.getElementById("langMenu");

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
      applyI18n();
    };
    langMenu.appendChild(item);
  });
}

function applyI18n() {
  if (accountFormTitle) accountFormTitle.textContent = t("signin");
}

function toggleLangMenu() { if (langDD) langDD.classList.toggle("open"); }
if (langBtn && langDD) {
  langBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleLangMenu(); });
  document.addEventListener("click", (e) => { if (langDD && !langDD.contains(e.target)) langDD.classList.remove("open"); });
}

// Password visibility
document.getElementById("toggleSiPass")?.addEventListener("click", () => {
  const el = document.getElementById("siPass");
  if (!el) return;
  el.type = el.type === "password" ? "text" : "password";
});
document.getElementById("toggleSuPass")?.addEventListener("click", () => {
  const el = document.getElementById("suPass");
  if (!el) return;
  el.type = el.type === "password" ? "text" : "password";
});

document.getElementById("forgotPass")?.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Password reset will be available soon. Contact support for now.");
});

if (getSession()) {
  goToDashboard();
} else {
  renderLangUI();
  applyI18n();
}
