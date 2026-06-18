(function () {
    function qs(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function lower(value) {
        return (value || "").toString().toLowerCase();
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("open");
        });
    }

    function setupSiteSearch() {
        qs("[data-site-search]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var query = input ? input.value.trim() : "";
                if (query) {
                    window.location.href = "./search.html?q=" + encodeURIComponent(query);
                } else {
                    window.location.href = "./search.html";
                }
            });
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero-carousel]");
        if (!root) {
            return;
        }
        var slides = qs("[data-hero-slide]", root);
        var dots = qs("[data-hero-dot]", root);
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(parseInt(dot.getAttribute("data-hero-dot"), 10) || 0);
                restart();
            });
        });
        restart();
    }

    function setupFilters() {
        qs(".filter-zone").forEach(function (zone) {
            var input = zone.querySelector("[data-filter-input]");
            var cards = qs(".movie-card", zone);
            var tagButtons = qs("[data-tag-filter]", zone);
            var activeTag = "all";

            function applyFilter() {
                var query = lower(input ? input.value.trim() : "");
                cards.forEach(function (card) {
                    var text = lower([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-tags"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre")
                    ].join(" "));
                    var tagMatch = activeTag === "all" || text.indexOf(lower(activeTag)) !== -1;
                    var queryMatch = !query || text.indexOf(query) !== -1;
                    card.classList.toggle("is-hidden", !(tagMatch && queryMatch));
                });
            }

            if (input) {
                input.addEventListener("input", applyFilter);
            }
            tagButtons.forEach(function (button) {
                button.addEventListener("click", function () {
                    activeTag = button.getAttribute("data-tag-filter") || "all";
                    tagButtons.forEach(function (item) {
                        item.classList.toggle("active", item === button);
                    });
                    applyFilter();
                });
            });
            applyFilter();
        });
    }

    function setupSearchQuery() {
        var input = document.querySelector("[data-search-page-input]");
        if (!input) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        if (query) {
            input.value = query;
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupMenu();
        setupSiteSearch();
        setupHero();
        setupFilters();
        setupSearchQuery();
    });
})();
