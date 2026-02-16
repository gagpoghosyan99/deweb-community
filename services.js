// services.js

const LS_LANG = "deweb_lang";

const LANGS = [
  { code: "hy", label: "HY" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

let currentLang = localStorage.getItem(LS_LANG) || "en";

// Simple dictionary for titles; you can expand later
const DATA = {
  web: {
    badge: "Web",
    title: "Web & E-commerce",
    subtitle: "Landing pages, corporate sites, online stores — choose what fits your goal.",
    items: [
      {
        name: "Landing Page",
        desc: "1-page conversion-focused website with responsive layout.",
        price: "from $299",
        features: ["Unique sections", "Mobile-first", "Basic SEO", "Deploy"]
      },
      {
        name: "Corporate Website",
        desc: "Multi-page site for company presentation and trust.",
        price: "from $799",
        features: ["5–10 pages", "CMS optional", "Forms + email", "Deploy"]
      },
      {
        name: "E-commerce Store",
        desc: "Online store with catalog, cart, checkout, payment options.",
        price: "from $1499",
        features: ["Products + categories", "Cart + checkout", "Payments", "Admin basics"]
      },
      {
        name: "SEO + Performance",
        desc: "Speed optimization + SEO foundations + analytics setup.",
        price: "from $199",
        features: ["Core Web Vitals", "Meta + sitemap", "Analytics", "Report"]
      }
    ]
  },

  bots: {
    badge: "Bots",
    title: "Bots & Automation",
    subtitle: "Automate sales, support, bookings, operations via bots + integrations.",
    items: [
      {
        name: "Telegram Sales Bot",
        desc: "Collect leads, show products/services, FAQs, and handoff to manager.",
        price: "from $399",
        features: ["Menus + flows", "Lead capture", "Admin commands", "Deploy"]
      },
      {
        name: "Booking / Reservation Bot",
        desc: "Calendar scheduling, reminders, and confirmations.",
        price: "from $499",
        features: ["Time slots", "Reminders", "Manager panel", "Deploy"]
      },
      {
        name: "CRM / Sheets Integration",
        desc: "Send data to Google Sheets / CRM, automate notifications.",
        price: "from $299",
        features: ["Webhook/API", "Data mapping", "Alerts", "Logs"]
      },
      {
        name: "Monitoring / Alerts",
        desc: "Alerts for price, uptime, events — with dashboards.",
        price: "from $599",
        features: ["Monitoring", "Alert rules", "Reports", "Deploy"]
      }
    ]
  },

  design: {
    badge: "Design",
    title: "Design & Branding",
    subtitle: "Brand identity + UI that looks premium and sells.",
    items: [
      {
        name: "Logo + Identity",
        desc: "Logo concepts + final + basic brand rules.",
        price: "from $199",
        features: ["3 concepts", "Final logo pack", "Colors + fonts", "Brand rules"]
      },
      {
        name: "UI/UX in Figma",
        desc: "Website design ready for development handoff.",
        price: "from $499",
        features: ["Wireframe", "UI design", "Responsive", "Components"]
      },
      {
        name: "UI Kit / Design System",
        desc: "Reusable components for fast development.",
        price: "from $399",
        features: ["Buttons/forms", "Grids", "Typography", "Tokens"]
      },
      {
        name: "Marketplace Graphics",
        desc: "Banners, ads, product visuals, templates.",
        price: "from $99",
        features: ["Templates", "High quality", "Fast delivery", "Brand safe"]
      }
    ]
  },

  support: {
    badge: "Support",
    title: "Growth & Support",
    subtitle: "Monthly support, fixes, performance, security, growth improvements.",
    items: [
      {
        name: "Monthly Maintenance",
        desc: "Fixes, updates, small improvements.",
        price: "from $199/mo",
        features: ["Priority fixes", "Updates", "Small features", "Support"]
      },
      {
        name: "Performance Boost",
        desc: "Speed, Core Web Vitals, optimization.",
        price: "from $249",
        features: ["Audit", "Optimization", "Caching", "Report"]
      },
      {
        name: "Security Check",
        desc: "Hardening, backups, vulnerability checks.",
        price: "from $299",
        features: ["Backups", "Hardening", "Checks", "Guidelines"]
      },
      {
        name: "Conversion Improvements",
        desc: "Improve UX and conversion with analysis and tweaks.",
        price: "from $399",
        features: ["UX review", "A/B plan", "Fixes", "Report"]
      }
    ]
  }
};

// Language dropdown (same behavior as your index)
const langDD = document.getElementById("langDD");
const langBtn = document.getElementById("langBtn");
const langLabel = document.getElementById("langLabel");
const langMenu = document.getElementById("langMenu");

function renderLangUI() {
  const selected = LANGS.find(l => l.code === currentLang) || LANGS[1];
  langLabel.textContent = selected.label;

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
      // later we can localize DATA by language too
    };
    langMenu.appendChild(item);
  });
}

function openLangMenu(){ langDD.classList.add("open"); langBtn.setAttribute("aria-expanded","true"); }
function closeLangMenu(){ langDD.classList.remove("open"); langBtn.setAttribute("aria-expanded","false"); }
function toggleLangMenu(){ langDD.classList.contains("open") ? closeLangMenu() : openLangMenu(); }

langBtn?.addEventListener("click", (e) => { e.stopPropagation(); toggleLangMenu(); });
document.addEventListener("click", (e) => { if (!langDD.contains(e.target)) closeLangMenu(); });

renderLangUI();

// Render category details
function getCat() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat") || "web";
}

function renderPage() {
  const cat = getCat();
  const cfg = DATA[cat] || DATA.web;

  document.getElementById("catBadge").textContent = cfg.badge;
  document.getElementById("catTitle").textContent = cfg.title;
  document.getElementById("catSubtitle").textContent = cfg.subtitle;

  const grid = document.getElementById("detailsGrid");
  grid.innerHTML = "";

  cfg.items.forEach((it) => {
    const card = document.createElement("div");
    card.className = "detail-card";
    card.innerHTML = `
      <h3>${it.name}</h3>
      <p>${it.desc}</p>
      <ul>${it.features.map(f => `<li>${f}</li>`).join("")}</ul>
      <div class="price-row">
        <span class="price">${it.price}</span>
        <button class="cta-btn secondary" type="button">Offer your price</button>
      </div>
    `;
    // scroll to offer box
    card.querySelector("button").addEventListener("click", () => {
      document.querySelector(".offer-box")?.scrollIntoView({ behavior: "smooth" });
      document.getElementById("offerText").focus();
      document.getElementById("offerText").value =
        `${cfg.title} → ${it.name}\n\nDescribe your requirements here...`;
    });
    grid.appendChild(card);
  });
}

document.getElementById("offerForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("offerEmail").value.trim();
  const text = document.getElementById("offerText").value.trim();
  if (!email || !text) return alert("Fill message + email.");
  alert("Sent! We will contact you soon.");
  e.target.reset();
});

renderPage();
