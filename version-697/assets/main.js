(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-main-nav]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-search]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var empty = document.querySelector('[data-empty]');

  if (searchInput && cards.length) {
    searchInput.addEventListener('input', function () {
      var key = searchInput.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region')
        ].join(' ').toLowerCase();
        var ok = !key || text.indexOf(key) !== -1;
        card.style.display = ok ? '' : 'none';
        if (ok) visible += 1;
      });
      if (empty) empty.classList.toggle('show', visible === 0);
    });
  }

  function startVideo(video) {
    var src = video.getAttribute('data-play-src');
    if (!src) return;
    var cover = document.querySelector('[data-player-cover]');
    if (cover) cover.classList.add('hidden');
    if (window.Hls && window.Hls.isSupported()) {
      if (!video._hlsReady) {
        var hls = new window.Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        video._hlsReady = true;
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else {
        video.play().catch(function () {});
      }
      return;
    }
    if (!video.getAttribute('src')) {
      video.setAttribute('src', src);
    }
    video.play().catch(function () {});
  }

  var video = document.querySelector('[data-player-video]');
  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-player-trigger]'));
  if (video && triggers.length) {
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        startVideo(video);
      });
    });
    video.addEventListener('click', function () {
      startVideo(video);
    });
  }
})();
