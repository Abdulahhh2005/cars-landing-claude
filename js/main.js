"use strict";

/* ==========================================================================
   Scroll to top
   Shows the button after scrolling down, scrolls back up on click.
   ========================================================================== */

const scrollTopBtn = document.getElementById("scrollTop");
const SCROLL_THRESHOLD = 400; // px scrolled before the button appears

const toggleScrollTopBtn = () => {
  scrollTopBtn.classList.toggle(
    "scroll-top--visible",
    window.scrollY > SCROLL_THRESHOLD
  );
};

window.addEventListener("scroll", toggleScrollTopBtn);

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ==========================================================================
   Burger menu (mobile)
   Toggles the nav panel; closes after tapping a link.
   ========================================================================== */

const burger = document.getElementById("burger");
const primaryNav = document.getElementById("primary-nav");

const setMenu = (open) => {
  burger.setAttribute("aria-expanded", String(open));
  primaryNav.classList.toggle("header__nav--open", open);
};

burger.addEventListener("click", () => {
  const isOpen = burger.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

/* ==========================================================================
   Theme switch (dark / light)
   Initial theme is applied in <head> to avoid a flash; this only handles
   the toggle and persistence. Default is dark (no attribute).
   ========================================================================== */

const themeToggle = document.getElementById("themeToggle");

const THEME_ANIM_MS = 600; // must match --theme-transition

themeToggle.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const next = isLight ? "dark" : "light";

  // enable the page-wide colour fade only for the duration of the switch
  document.documentElement.classList.add("theme-anim");

  if (next === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  localStorage.setItem("theme", next);

  window.setTimeout(() => {
    document.documentElement.classList.remove("theme-anim");
  }, THEME_ANIM_MS);
});

/* ==========================================================================
   Language switch (i18n)
   Every translatable element carries data-i18n="key" (data-i18n-html for
   markup, data-i18n-placeholder for inputs). Dictionaries live in i18n/
   (en.js creates the shared `translations` object, uk.js extends it) —
   adding a language = a new i18n/<lang>.js file + its <script> tag in
   index.html + a button in the header. Brand names, specs, prices and the
   address intentionally stay in English.
   ========================================================================== */

const langButtons = document.querySelectorAll("[data-lang]");

const applyLang = (lang) => {
  const dict = translations[lang];
  if (!dict) return;

  document.documentElement.lang = lang;
  document.title = dict["meta.title"];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = dict[el.dataset.i18n];
    if (value === undefined) return;
    if (el.hasAttribute("data-i18n-html")) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const value = dict[el.dataset.i18nPlaceholder];
    if (value !== undefined) el.placeholder = value;
  });

  langButtons.forEach((btn) => {
    btn.classList.toggle("lang-switch__btn--active", btn.dataset.lang === lang);
  });

  localStorage.setItem("lang", lang);
};

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});

applyLang(localStorage.getItem("lang") || "en");
