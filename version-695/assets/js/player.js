(function () {
  window.initMoviePlayer = function (source) {
    var video = document.getElementById("movie-player");
    var overlay = document.querySelector("[data-player-overlay]");
    var loaded = false;
    var hls = null;

    if (!video || !overlay || !source) {
      return;
    }

    function hideOverlay() {
      overlay.classList.add("is-hidden");
    }

    function playVideo() {
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          overlay.classList.remove("is-hidden");
        });
      }
    }

    function loadAndPlay() {
      hideOverlay();
      video.controls = true;

      if (loaded) {
        playVideo();
        return;
      }

      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.addEventListener("loadedmetadata", playVideo, { once: true });
        video.load();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
        return;
      }

      video.src = source;
      video.addEventListener("loadedmetadata", playVideo, { once: true });
      video.load();
    }

    overlay.addEventListener("click", loadAndPlay);
    video.addEventListener("click", function () {
      if (video.paused) {
        loadAndPlay();
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
