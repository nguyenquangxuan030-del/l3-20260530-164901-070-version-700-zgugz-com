(function () {
  function each(selector, callback, scope) {
    Array.prototype.forEach.call((scope || document).querySelectorAll(selector), callback);
  }

  function initMobileMenu() {
    var button = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slides = document.querySelectorAll('[data-hero-slide]');
    if (!slides.length) {
      return;
    }
    var dots = document.querySelectorAll('[data-hero-dot]');
    var next = document.querySelector('[data-hero-next]');
    var prev = document.querySelector('[data-hero-prev]');
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      each('[data-hero-slide]', function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      each('[data-hero-dot]', function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 6200);
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    Array.prototype.forEach.call(dots, function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot') || 0));
        restart();
      });
    });

    restart();
  }

  function initFilters() {
    var cards = document.querySelectorAll('[data-movie-card]');
    if (!cards.length) {
      return;
    }
    var input = document.querySelector('[data-movie-search]');
    var typeButtons = document.querySelectorAll('[data-filter]');
    var yearButtons = document.querySelectorAll('[data-year-filter]');
    var activeType = 'all';
    var activeYear = 'all';

    function setActive(buttons, activeButton) {
      Array.prototype.forEach.call(buttons, function (button) {
        button.classList.toggle('is-active', button === activeButton);
      });
    }

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : '';
      Array.prototype.forEach.call(cards, function (card) {
        var text = card.getAttribute('data-key') || '';
        var type = card.getAttribute('data-type') || '';
        var year = card.getAttribute('data-year') || '';
        var matchText = !query || text.indexOf(query) !== -1;
        var matchType = activeType === 'all' || type.indexOf(activeType) !== -1;
        var matchYear = activeYear === 'all' || year === activeYear;
        card.hidden = !(matchText && matchType && matchYear);
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    Array.prototype.forEach.call(typeButtons, function (button) {
      button.addEventListener('click', function () {
        activeType = button.getAttribute('data-filter') || 'all';
        setActive(typeButtons, button);
        apply();
      });
    });

    Array.prototype.forEach.call(yearButtons, function (button) {
      button.addEventListener('click', function () {
        activeYear = button.getAttribute('data-year-filter') || 'all';
        setActive(yearButtons, button);
        apply();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHero();
    initFilters();
  });
})();

function createMoviePlayer(videoId, overlayId, sourceUrl) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  if (!video || !overlay || !sourceUrl) {
    return;
  }
  var hlsInstance = null;

  function bindSource() {
    if (video.getAttribute('data-ready') === '1') {
      return;
    }
    video.setAttribute('data-ready', '1');
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({ enableWorker: true });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = sourceUrl;
    }
  }

  function start() {
    bindSource();
    overlay.classList.add('is-hidden');
    video.controls = true;
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  overlay.addEventListener('click', start);
  video.addEventListener('click', function () {
    if (video.getAttribute('data-ready') !== '1') {
      start();
    }
  });
  window.addEventListener('pagehide', function () {
    if (hlsInstance && typeof hlsInstance.destroy === 'function') {
      hlsInstance.destroy();
    }
  });
}
