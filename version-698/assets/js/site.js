(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    document.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.classList.add("is-missing");
      });
    });

    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var active = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === active);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === active);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(active + 1);
        }, 5200);
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
          restart();
        });
      });
      if (prev) {
        prev.addEventListener("click", function () {
          show(active - 1);
          restart();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          show(active + 1);
          restart();
        });
      }
      show(0);
      restart();
    });

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      var year = scope.querySelector("[data-filter-year]");
      var type = scope.querySelector("[data-filter-type]");
      var buttons = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-button]"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-card]"));
      var quick = "";

      function valueOf(element) {
        return element ? String(element.value || "").trim().toLowerCase() : "";
      }

      function apply() {
        var keyword = valueOf(input);
        var yearValue = valueOf(year);
        var typeValue = valueOf(type);
        var quickValue = quick.toLowerCase();

        cards.forEach(function (card) {
          var text = String(card.getAttribute("data-search") || "").toLowerCase();
          var cardYear = String(card.getAttribute("data-year") || "").toLowerCase();
          var cardType = String(card.getAttribute("data-type") || "").toLowerCase();
          var okKeyword = !keyword || text.indexOf(keyword) !== -1;
          var okQuick = !quickValue || text.indexOf(quickValue) !== -1;
          var okYear = !yearValue || cardYear === yearValue;
          var okType = !typeValue || cardType === typeValue;
          card.classList.toggle("is-hidden", !(okKeyword && okQuick && okYear && okType));
        });
      }

      if (input) {
        input.addEventListener("input", apply);
      }
      if (year) {
        year.addEventListener("change", apply);
      }
      if (type) {
        type.addEventListener("change", apply);
      }
      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          quick = String(button.getAttribute("data-filter-button") || "");
          buttons.forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });
          apply();
        });
      });
      apply();
    });
  });
})();
