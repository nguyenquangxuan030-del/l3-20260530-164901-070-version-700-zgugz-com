(function () {
  function attachPlayer(container) {
    var video = container.querySelector('video');
    var button = container.querySelector('.play-overlay');
    var src = container.getAttribute('data-m3u8');
    var hlsInstance = null;
    var loaded = false;

    function load() {
      if (loaded || !video || !src) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
      } else {
        video.src = src;
      }
      loaded = true;
    }

    function play() {
      load();
      container.classList.add('is-playing');
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          container.classList.remove('is-playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        container.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        if (!video.ended) {
          container.classList.remove('is-playing');
        }
      });
      video.addEventListener('ended', function () {
        container.classList.remove('is-playing');
      });
    }
    container.addEventListener('remove', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  }

  document.querySelectorAll('.movie-player').forEach(attachPlayer);
})();
