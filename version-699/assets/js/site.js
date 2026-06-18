(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var siteNav = document.getElementById("siteNav");

    if (menuButton && siteNav) {
      menuButton.addEventListener("click", function () {
        siteNav.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var index = 0;

      function showSlide(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, itemIndex) {
          slide.classList.toggle("is-active", itemIndex === index);
        });
        dots.forEach(function (dot, itemIndex) {
          dot.classList.toggle("is-active", itemIndex === index);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          var nextIndex = parseInt(dot.getAttribute("data-hero-dot"), 10) || 0;
          showSlide(nextIndex);
        });
      });

      window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    var searchInput = document.querySelector("[data-local-search]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var emptyState = document.querySelector("[data-empty-state]");

    function filterCards(value) {
      var query = String(value || "").trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = card.getAttribute("data-search") || "";
        var matched = !query || text.indexOf(query) !== -1;
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });
      if (emptyState) {
        emptyState.classList.toggle("is-visible", visible === 0);
      }
    }

    if (searchInput && cards.length) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q") || "";
      if (q) {
        searchInput.value = q;
      }
      filterCards(searchInput.value);
      searchInput.addEventListener("input", function () {
        filterCards(searchInput.value);
      });
    }

    var video = document.getElementById("player");
    var button = document.getElementById("playButton");
    var frame = document.querySelector("[data-player-frame]");
    var notice = document.getElementById("playerNotice");
    var hlsInstance = null;
    var started = false;

    function showNotice(text) {
      if (!notice) {
        return;
      }
      notice.textContent = text;
      notice.classList.add("is-visible");
    }

    function playVideo(url) {
      if (!video || !url) {
        return;
      }

      if (button) {
        button.classList.add("is-hidden");
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video.play().catch(function () {
          showNotice("播放加载失败，请稍后再试");
        });
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {
            showNotice("播放加载失败，请稍后再试");
          });
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
            return;
          }
          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
            return;
          }
          showNotice("播放加载失败，请稍后再试");
        });
        return;
      }

      showNotice("播放加载失败，请稍后再试");
    }

    function startPlayer() {
      if (started || !button) {
        return;
      }
      started = true;
      playVideo(button.getAttribute("data-url"));
    }

    if (button && video) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        startPlayer();
      });
      if (frame) {
        frame.addEventListener("click", function (event) {
          if (event.target === frame || event.target === button || event.target === video) {
            startPlayer();
          }
        });
      }
      window.addEventListener("pagehide", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
        }
      });
    }
  });
})();
