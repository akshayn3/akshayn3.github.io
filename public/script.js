// Keep every role collapsed on load; request its media only after expansion.
const experiences = [...document.querySelectorAll("details.experience-item")];
experiences.forEach((experience) => {
  experience.addEventListener("toggle", () => {
    if (!experience.open) return;
    experiences.forEach((other) => { if (other !== experience) other.open = false; });
    const media = experience.querySelector("template[data-experience-media]");
    if (media) media.replaceWith(media.content.cloneNode(true));
  });
});

const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const closeMenu = () => {
  menuButton?.setAttribute("aria-expanded", "false");
  if (menu) menu.dataset.open = "false";
};
if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menu.dataset.open = String(!open);
  });
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.dataset.open === "true") {
      closeMenu();
      menuButton.focus();
    }
  });
  // Hide mobile navigation only after its menu control is ready.
  document.documentElement.classList.add("js");
}

const filters = document.querySelector("[data-filters]");
const dishes = [...document.querySelectorAll(".dish-card")];
const count = document.querySelector("[data-gallery-count]");
const moreDishes = document.querySelector("[data-gallery-more]");
let allDishesExpanded = false;
if (filters && dishes.length) {
  filters.hidden = false;
  const updateGallery = (category) => {
    const matching = dishes.filter((dish) => category === "all" || dish.dataset.category === category);
    const visible = category === "all" && !allDishesExpanded ? matching.slice(0, 6) : matching;
    const visibleSet = new Set(visible);
    dishes.forEach((dish) => { dish.hidden = !visibleSet.has(dish); });
    if (count) count.textContent = `${visible.length}${visible.length < matching.length ? ` of ${matching.length}` : ""} ${matching.length === 1 ? "dish" : "dishes"}`;
    if (moreDishes) moreDishes.hidden = visible.length === matching.length;
  };
  updateGallery("all");
  moreDishes?.addEventListener("click", () => {
    allDishesExpanded = true;
    updateGallery("all");
  });
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button || button.getAttribute("aria-pressed") === "true") return;
    filters.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    updateGallery(button.dataset.filter);
  });
}

const dialog = document.querySelector("[data-lightbox]");
if (dialog && typeof dialog.showModal === "function") {
  const photo = dialog.querySelector("[data-lightbox-image]");
  let opener;
  document.querySelectorAll("[data-gallery]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); opener = link;
      photo.src = link.href;
      photo.alt = link.querySelector("img")?.alt || link.dataset.title;
      dialog.querySelector("#lightbox-title").textContent = link.dataset.title;
      dialog.querySelector("[data-lightbox-subtitle]").textContent = link.dataset.subtitle;
      dialog.showModal();
    });
  });
  dialog.querySelector("[data-lightbox-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => { photo.removeAttribute("src"); opener?.focus(); });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
