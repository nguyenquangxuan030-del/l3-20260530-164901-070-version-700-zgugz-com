(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5600);
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          restart();
        });
      }

      restart();
    }

    var urlParams = new URLSearchParams(window.location.search);
    var queryFromUrl = urlParams.get("q");
    if (queryFromUrl) {
      document.querySelectorAll(".movie-search").forEach(function (input) {
        input.value = queryFromUrl;
      });
    }

    function normalize(text) {
      return (text || "").toString().trim().toLowerCase();
    }

    function applyFilter(scopeId) {
      var scope = document.getElementById(scopeId);
      if (!scope) {
        return;
      }
      var searchInput = document.querySelector('.movie-search[data-filter-scope="' + scopeId + '"]');
      var search = normalize(searchInput ? searchInput.value : "");
      var selects = Array.prototype.slice.call(document.querySelectorAll('.movie-select[data-filter-scope="' + scopeId + '"]'));
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
      var shown = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.year,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre,
          card.dataset.category
        ].join(" "));
        var match = !search || haystack.indexOf(search) !== -1;
        selects.forEach(function (select) {
          if (!match || !select.value) {
            return;
          }
          var key = select.dataset.filterKey;
          var value = normalize(select.value);
          var field = normalize(card.dataset[key]);
          if (field.indexOf(value) === -1) {
            match = false;
          }
        });
        card.style.display = match ? "" : "none";
        if (match) {
          shown += 1;
        }
      });

      var empty = document.querySelector('[data-empty-for="' + scopeId + '"]');
      if (empty) {
        empty.classList.toggle("visible", shown === 0);
      }
    }

    document.querySelectorAll(".movie-search, .movie-select").forEach(function (control) {
      var scopeId = control.dataset.filterScope;
      control.addEventListener("input", function () {
        applyFilter(scopeId);
      });
      control.addEventListener("change", function () {
        applyFilter(scopeId);
      });
      if (queryFromUrl) {
        applyFilter(scopeId);
      }
    });
  });
})();
