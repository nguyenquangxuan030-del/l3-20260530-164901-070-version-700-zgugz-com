(function () {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();
    var input = document.getElementById("search-query");
    var results = document.getElementById("search-results");
    var tip = document.getElementById("search-tip");
    if (input) {
        input.value = query;
    }
    if (!results || !Array.isArray(window.SEARCH_ITEMS)) {
        return;
    }

    function createCard(item) {
        var tags = (item.tags || []).slice(0, 3).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return [
            "<article class=\"movie-card\">",
            "<a href=\"" + escapeHtml(item.url) + "\" class=\"poster-link\">",
            "<img src=\"" + escapeHtml(item.cover) + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">",
            "<span class=\"card-badge\">" + escapeHtml(item.score) + "</span>",
            "<span class=\"card-gradient\"></span>",
            "<span class=\"card-title-on-image\">" + escapeHtml(item.title) + "</span>",
            "</a>",
            "<div class=\"card-body\">",
            "<div class=\"card-meta\"><span>" + escapeHtml(item.region) + "</span><span>" + escapeHtml(item.year) + "</span></div>",
            "<a href=\"" + escapeHtml(item.url) + "\" class=\"movie-title\">" + escapeHtml(item.title) + "</a>",
            "<p>" + escapeHtml(item.oneLine) + "</p>",
            "<div class=\"tag-row\">" + tags + "</div>",
            "</div>",
            "</article>"
        ].join("");
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function render(value) {
        var normalized = value.trim().toLowerCase();
        if (!normalized) {
            results.innerHTML = "";
            if (tip) {
                tip.textContent = "输入关键词后显示匹配影片。";
            }
            return;
        }
        var words = normalized.split(/\s+/).filter(Boolean);
        var matched = window.SEARCH_ITEMS.filter(function (item) {
            var text = [
                item.title,
                item.region,
                item.type,
                item.genre,
                (item.tags || []).join(" "),
                item.oneLine
            ].join(" ").toLowerCase();
            return words.every(function (word) {
                return text.indexOf(word) !== -1;
            });
        }).slice(0, 120);
        results.innerHTML = matched.map(createCard).join("");
        if (tip) {
            tip.textContent = matched.length ? "为你找到相关影片。" : "没有找到匹配内容。";
        }
    }

    render(query);
    if (input) {
        input.addEventListener("input", function () {
            render(input.value || "");
        });
    }
}());
