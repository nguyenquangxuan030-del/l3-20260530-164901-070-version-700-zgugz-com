(function () {
  function setupPlayer(root) {
    var video = root.querySelector("video[data-hls-src]");
    var button = root.querySelector("[data-play-button]");
    if (!video || !button) {
      return;
    }

    var source = video.getAttribute("data-hls-src");
    var hls = null;
    var ready = false;

    function attachSource() {
      if (ready || !source) {
        return;
      }
      ready = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      attachSource();
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      playVideo();
    });

    root.addEventListener("click", function (event) {
      if (event.target.closest("button") || event.target.closest("video")) {
        return;
      }
      playVideo();
    });

    video.addEventListener("play", function () {
      button.classList.add("is-hidden");
    });

    video.addEventListener("pause", function () {
      if (video.currentTime === 0 || video.ended) {
        button.classList.remove("is-hidden");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      document.querySelectorAll("[data-player]").forEach(setupPlayer);
    });
  } else {
    document.querySelectorAll("[data-player]").forEach(setupPlayer);
  }
})();
