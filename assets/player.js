(function () {
    function ready(video, source) {
        if (video.getAttribute("data-ready") === "1") {
            video.play().catch(function () {});
            return;
        }
        video.setAttribute("data-ready", "1");
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            video.play().catch(function () {});
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {});
            });
            hls.on(window.Hls.Events.ERROR, function (_, data) {
                if (data && data.fatal) {
                    if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                        video.src = source;
                    }
                }
            });
            video._hls = hls;
            return;
        }
        video.src = source;
        video.play().catch(function () {});
    }

    window.startMoviePlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var overlay = document.getElementById(options.overlayId);
        if (!video || !options.source) {
            return;
        }
        function start() {
            if (overlay) {
                overlay.classList.add("hidden");
            }
            ready(video, options.source);
        }
        if (overlay) {
            overlay.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (video.getAttribute("data-ready") !== "1") {
                start();
            }
        });
    };
})();
