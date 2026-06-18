import { movieSearchData } from "./search-data.js";

const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");
const params = new URLSearchParams(window.location.search);
const initial = params.get("q") || "";

function safe(value) {
  return String(value).replace(/[&<>"\']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "\'": "&#39;"
    }[char];
  });
}

function card(item) {
  const title = safe(item.title);
  const year = safe(item.year);
  const region = safe(item.region);
  const type = safe(item.type);
  const genre = safe(item.genre);
  const href = safe(item.href);
  const cover = safe(item.cover);
  const tags = item.tags.slice(0, 3).map((tag) => `<span class="tag">${safe(tag)}</span>`).join("");
  return `
    <a class="movie-card" href="${href}" data-filter-item>
      <div class="card-poster">
        <img src="${cover}" alt="${title}">
        <span class="card-badge">${year}</span>
        <span class="card-play">▶</span>
      </div>
      <div class="card-body">
        <h2 class="card-title">${title}</h2>
        <div class="card-meta"><span>${region}</span><span>${type}</span></div>
        <p class="card-text">${genre}</p>
        <div class="tag-row">${tags}</div>
      </div>
    </a>
  `;
}

function render(keyword) {
  const term = keyword.trim().toLowerCase();

  if (!term) {
    results.innerHTML = '<p class="empty-text">输入影片名称、类型、地区、年份或标签，即可快速查找片库内容。</p>';
    return;
  }

  const found = movieSearchData.filter((item) => {
    return item.searchText.toLowerCase().includes(term);
  }).slice(0, 120);

  if (!found.length) {
    results.innerHTML = '<p class="empty-text">没有找到匹配内容，可以换一个关键词继续搜索。</p>';
    return;
  }

  results.innerHTML = `<div class="result-grid">${found.map(card).join("")}</div>`;
}

if (input) {
  input.value = initial;
  render(initial);
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = input.value.trim();
    const url = new URL(window.location.href);

    if (keyword) {
      url.searchParams.set("q", keyword);
    } else {
      url.searchParams.delete("q");
    }

    window.history.replaceState({}, "", url);
    render(keyword);
  });
}
