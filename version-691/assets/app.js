(function () {
  var heroIndex = 0;
  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');

  function showHero(index) {
    if (!slides.length) {
      return;
    }
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === heroIndex);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === heroIndex);
    });
  }

  if (slides.length) {
    if (prev) {
      prev.addEventListener('click', function () {
        showHero(heroIndex - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        showHero(heroIndex + 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });
    window.setInterval(function () {
      showHero(heroIndex + 1);
    }, 5200);
  }

  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      mobileNav.hidden = !mobileNav.hidden;
    });
  }

  var globalSearch = document.getElementById('globalSearch');
  var searchPanel = document.getElementById('searchPanel');
  function renderSearchResults(query) {
    if (!globalSearch || !searchPanel) {
      return;
    }
    var value = query.trim().toLowerCase();
    if (!value || !window.MOVIE_SEARCH_DATA) {
      searchPanel.hidden = true;
      searchPanel.innerHTML = '';
      return;
    }
    var results = window.MOVIE_SEARCH_DATA.filter(function (item) {
      return item.title.toLowerCase().indexOf(value) > -1 ||
        item.meta.toLowerCase().indexOf(value) > -1 ||
        item.year.toLowerCase().indexOf(value) > -1;
    }).slice(0, 12);
    if (!results.length) {
      searchPanel.hidden = false;
      searchPanel.innerHTML = '<div class="search-result"><div></div><div><strong>暂无匹配内容</strong><span>换个关键词继续搜索</span></div></div>';
      return;
    }
    searchPanel.hidden = false;
    searchPanel.innerHTML = results.map(function (item) {
      return '<a class="search-result" href="' + item.url + '">' +
        '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
        '<div><strong>' + item.title + '</strong><span>' + item.year + ' · ' + item.meta + '</span></div>' +
        '</a>';
    }).join('');
  }

  if (globalSearch) {
    globalSearch.addEventListener('input', function () {
      renderSearchResults(globalSearch.value);
    });
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.header-search')) {
        if (searchPanel) {
          searchPanel.hidden = true;
        }
      }
    });
  }

  var pageFilter = document.querySelector('.page-filter');
  var yearFilter = document.querySelector('.year-filter');
  var pageCards = Array.prototype.slice.call(document.querySelectorAll('.page-movie-list .movie-card'));
  function applyPageFilter() {
    var keyword = pageFilter ? pageFilter.value.trim().toLowerCase() : '';
    var year = yearFilter ? yearFilter.value : '';
    pageCards.forEach(function (card) {
      var title = (card.getAttribute('data-title') || '').toLowerCase();
      var tags = (card.getAttribute('data-tags') || '').toLowerCase();
      var cardYear = card.getAttribute('data-year') || '';
      var matchText = !keyword || title.indexOf(keyword) > -1 || tags.indexOf(keyword) > -1;
      var matchYear = !year || cardYear === year;
      card.classList.toggle('is-filtered-out', !(matchText && matchYear));
    });
  }

  if (pageFilter) {
    pageFilter.addEventListener('input', applyPageFilter);
  }
  if (yearFilter) {
    yearFilter.addEventListener('change', applyPageFilter);
  }

  function startVideo(shell) {
    var video = shell.querySelector('video');
    var layer = shell.querySelector('.play-layer');
    if (!video) {
      return;
    }
    var streamUrl = video.getAttribute('data-stream-url');
    if (!streamUrl) {
      return;
    }
    if (layer) {
      layer.classList.add('is-hidden');
    }
    function playNow() {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }
    if (video.getAttribute('data-ready') === '1') {
      playNow();
      return;
    }
    video.setAttribute('data-ready', '1');
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', playNow, { once: true });
      video.load();
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, playNow);
      hls.on(window.Hls.Events.ERROR, function () {
        if (!video.src) {
          video.src = streamUrl;
          video.load();
        }
      });
      return;
    }
    video.src = streamUrl;
    video.addEventListener('loadedmetadata', playNow, { once: true });
    video.load();
  }

  Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(function (shell) {
    var layer = shell.querySelector('.play-layer');
    var video = shell.querySelector('video');
    if (layer) {
      layer.addEventListener('click', function () {
        startVideo(shell);
      });
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.getAttribute('data-ready') !== '1') {
          startVideo(shell);
        }
      });
    }
  });
})();
