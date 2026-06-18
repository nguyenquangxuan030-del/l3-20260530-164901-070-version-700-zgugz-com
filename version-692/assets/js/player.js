const libraryUrl = "https://cdn.jsdelivr.net/npm/hls.js@latest";
let libraryReady;

function loadLibrary() {
  if (window.Hls) {
    return Promise.resolve(window.Hls);
  }

  if (libraryReady) {
    return libraryReady;
  }

  libraryReady = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = libraryUrl;
    script.async = true;
    script.onload = () => resolve(window.Hls);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return libraryReady;
}

export function createPlayer(videoId, layerId, buttonId, source) {
  const video = document.getElementById(videoId);
  const layer = document.getElementById(layerId);
  const button = document.getElementById(buttonId);
  let loaded = false;
  let hlsInstance = null;

  if (!video || !source) {
    return;
  }

  async function prepare() {
    if (loaded) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      loaded = true;
      return;
    }

    try {
      const Hls = await loadLibrary();
      if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({ enableWorker: true });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        loaded = true;
        return;
      }
    } catch (error) {
      video.src = source;
      loaded = true;
      return;
    }

    video.src = source;
    loaded = true;
  }

  async function start() {
    await prepare();

    if (layer) {
      layer.classList.add("is-hidden");
    }

    video.controls = true;
    const playTask = video.play();

    if (playTask && typeof playTask.catch === "function") {
      playTask.catch(() => {});
    }
  }

  if (button) {
    button.addEventListener("click", start);
  }

  if (layer) {
    layer.addEventListener("click", start);
  }

  video.addEventListener("click", () => {
    if (!loaded) {
      start();
    }
  });

  window.addEventListener("pagehide", () => {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
