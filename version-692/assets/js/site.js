const menuButton = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    mobileNav.classList.toggle("is-open");
  });
}

const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
const thumbs = Array.from(document.querySelectorAll("[data-hero-thumb]"));
let activeSlide = 0;

function showSlide(index) {
  if (!slides.length) {
    return;
  }

  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });

  thumbs.forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("is-active", thumbIndex === activeSlide);
  });
}

thumbs.forEach((thumb, index) => {
  thumb.addEventListener("click", () => showSlide(index));
});

if (slides.length > 1) {
  window.setInterval(() => showSlide(activeSlide + 1), 5200);
}

const localFilter = document.querySelector("[data-page-filter]");

if (localFilter) {
  const targets = Array.from(document.querySelectorAll("[data-filter-item]"));
  localFilter.addEventListener("input", () => {
    const keyword = localFilter.value.trim().toLowerCase();
    targets.forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(keyword) ? "" : "none";
    });
  });
}
