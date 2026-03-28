/**
 * Замените ссылки и тексты на свои — блоки ниже единственное место правки проектов.
 */
const CREATOR_PROJECTS = [
  {
    title: "Серия «Неон и тишина»",
    desc: "Визуальная история в 12 кадрах: цвет, композиция, единый стиль для соцсетей.",
    url: "https://behance.net/",
    badge: "визуал",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&h=450&q=85",
  },
  {
    title: "Персонаж для бренда",
    desc: "Маскот и ключевые ракурсы для кампании — от скетча до финальных рендеров.",
    url: "https://www.artstation.com/",
    badge: "персонаж",
    image:
      "https://images.unsplash.com/photo-1634014237911-39f1ee7d4344?auto=format&fit=crop&w=800&h=450&q=85",
  },
  {
    title: "Обложки и превью",
    desc: "Пакет обложек для подкаста/стримов с узнаваемой графикой.",
    url: "https://www.figma.com/",
    badge: "бренд",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&h=450&q=85",
  },
];

const PROMPT_PROJECTS = [
  {
    title: "Шаблоны для портретов",
    desc: "Структура промпта + негатив + стили: воспроизводимый результат в MJ/SD.",
    url: "https://github.com/",
    badge: "промпт",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&h=450&q=85",
  },
  {
    title: "Пайплайн: идея → серия",
    desc: "Цепочка из 4 шагов с LLM и генерацией изображений для контент-плана.",
    url: "https://github.com/",
    badge: "воркфлоу",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&h=450&q=85",
  },
  {
    title: "Кейс: e-commerce визуал",
    desc: "Промпты под единый свет и фон для каталога без фотостудии.",
    url: "https://notion.so/",
    badge: "кейс",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&h=450&q=85",
  },
];

const ARROW_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>';

function renderCards(container, items) {
  container.innerHTML = items
    .map(
      (p) => `
    <a class="card project-link" data-reveal href="${escapeAttr(p.url)}" data-external="1" target="_blank" rel="noopener noreferrer">
      <div class="card-thumb">
        <img src="${escapeAttr(p.image)}" alt="" width="800" height="450" loading="lazy" decoding="async" />
      </div>
      <div class="card-body">
        <span class="card-badge">${escapeHtml(p.badge)}</span>
        <h3 class="card-title">${escapeHtml(p.title)}</h3>
        <p class="card-desc">${escapeHtml(p.desc)}</p>
        <span class="card-arrow">перейти к проекту ${ARROW_SVG}</span>
      </div>
    </a>`
    )
    .join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function initReveal() {
  const nodes = document.querySelectorAll("[data-reveal]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  nodes.forEach((n, i) => {
    n.style.transitionDelay = `${Math.min(i * 0.05, 0.35)}s`;
    io.observe(n);
  });
}

function initCreatorPhoto() {
  const wrap = document.getElementById("creator-photo-wrap");
  const img = document.getElementById("creator-photo-img");
  if (!wrap || !img) return;

  const markLoaded = () => {
    if (img.naturalWidth > 0) wrap.classList.add("creator-photo--loaded");
  };

  img.addEventListener("load", markLoaded);
  img.addEventListener("error", () => wrap.classList.remove("creator-photo--loaded"));

  if (img.complete) markLoaded();
}

function initProjectTransitions() {
  const overlay = document.getElementById("page-transition");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.body.addEventListener("click", (e) => {
    const link = e.target.closest("a.project-link");
    if (!link || prefersReduced) return;
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    e.preventDefault();
    overlay.classList.add("is-active");
    // Открываем сразу в том же обработчике клика — иначе браузер блокирует всплывающее окно.
    window.open(href, "_blank", "noopener,noreferrer");
    setTimeout(() => overlay.classList.remove("is-active"), 480);
  });
}

const THEME_KEY = "portfolio-theme";

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const isDark = theme === "dark";
  btn.setAttribute("aria-pressed", isDark ? "true" : "false");
  btn.setAttribute(
    "aria-label",
    isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"
  );
  btn.title = isDark ? "Светлая тема" : "Тёмная тема";
}

function initTheme() {
  applyTheme(getInitialTheme());
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

const creatorEl = document.getElementById("creator-cards");
const promptEl = document.getElementById("prompt-cards");
if (creatorEl) renderCards(creatorEl, CREATOR_PROJECTS);
if (promptEl) renderCards(promptEl, PROMPT_PROJECTS);

initTheme();
initCreatorPhoto();
initReveal();
initProjectTransitions();
