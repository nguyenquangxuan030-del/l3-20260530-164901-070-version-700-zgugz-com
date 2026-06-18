(function () {
    var toggle = document.querySelector(".mobile-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (toggle && panel) {
        toggle.addEventListener("click", function () {
            var open = panel.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("is-active", i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === current);
        });
    }

    function startTimer() {
        if (slides.length < 2) {
            return;
        }
        timer = window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    function resetTimer() {
        if (timer) {
            window.clearInterval(timer);
        }
        startTimer();
    }

    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            showSlide(Number(dot.getAttribute("data-slide")) || 0);
            resetTimer();
        });
    });
    if (prev) {
        prev.addEventListener("click", function () {
            showSlide(current - 1);
            resetTimer();
        });
    }
    if (next) {
        next.addEventListener("click", function () {
            showSlide(current + 1);
            resetTimer();
        });
    }
    startTimer();

    document.querySelectorAll("[data-filter-scope]").forEach(function (toolbar) {
        var parent = toolbar.parentElement;
        var list = parent ? parent.querySelector(".filter-list") : null;
        var input = toolbar.querySelector(".filter-input");
        var select = toolbar.querySelector(".sort-select");
        var empty = parent ? parent.querySelector(".empty-state") : null;
        if (!list) {
            return;
        }
        var original = Array.prototype.slice.call(list.children);

        function updateList() {
            var query = input ? input.value.trim().toLowerCase() : "";
            var items = original.slice();
            if (select && select.value === "score") {
                items.sort(function (a, b) {
                    return Number(b.getAttribute("data-score") || 0) - Number(a.getAttribute("data-score") || 0);
                });
            } else if (select && select.value === "year") {
                items.sort(function (a, b) {
                    return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
                });
            } else if (select && select.value === "title") {
                items.sort(function (a, b) {
                    return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
                });
            }
            var visible = 0;
            items.forEach(function (item) {
                var text = [
                    item.getAttribute("data-title") || "",
                    item.getAttribute("data-tags") || "",
                    item.textContent || ""
                ].join(" ").toLowerCase();
                var matched = !query || text.indexOf(query) !== -1;
                item.hidden = !matched;
                if (matched) {
                    visible += 1;
                }
                list.appendChild(item);
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (input) {
            input.addEventListener("input", updateList);
        }
        if (select) {
            select.addEventListener("change", updateList);
        }
    });
}());
