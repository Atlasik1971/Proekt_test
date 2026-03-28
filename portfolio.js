/**
 * Замените ссылки и тексты на свои — блоки ниже единственное место правки проектов.
 */
const CREATOR_PROJECTS = [
  {
    title: "Серия «Неон и тишина»",
    desc: "Визуальная история в 12 кадрах: цвет, композиция, единый стиль для соцсетей.",
    url: "https://behance.net/",
    badge: "визуал",
  },
  {
    title: "Персонаж для бренда",
    desc: "Маскот и ключевые ракурсы для кампании — от скетча до финальных рендеров.",
    url: "https://www.artstation.com/",
    badge: "персонаж",
  },
  {
    title: "Обложки и превью",
    desc: "Пакет обложек для подкаста/стримов с узнаваемой графикой.",
    url: "https://www.figma.com/",
    badge: "бренд",
  },
];

const PROMPT_PROJECTS = [
  {
    title: "Шаблоны для портретов",
    desc: "Структура промпта + негатив + стили: воспроизводимый результат в MJ/SD.",
    url: "https://github.com/",
    badge: "промпт",
  },
  {
    title: "Пайплайн: идея → серия",
    desc: "Цепочка из 4 шагов с LLM и генерацией изображений для контент-плана.",
    url: "https://github.com/",
    badge: "воркфлоу",
  },
  {
    title: "Кейс: e-commerce визуал",
    desc: "Промпты под единый свет и фон для каталога без фотостудии.",
    url: "https://notion.so/",
    badge: "кейс",
  },
];

const ARROW_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>';

function renderCards(container, items) {
  container.innerHTML = items
    .map(
      (p) => `
    <a class="card project-link" href="${escapeAttr(p.url)}" data-external="1" target="_blank" rel="noopener noreferrer">
      <span class="card-badge">${escapeHtml(p.badge)}</span>
      <h3 class="card-title">${escapeHtml(p.title)}</h3>
      <p class="card-desc">${escapeHtml(p.desc)}</p>
      <span class="card-arrow">перейти к проекту ${ARROW_SVG}</span>
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
initReveal();
initProjectTransitions();
