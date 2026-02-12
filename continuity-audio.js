(function () {
  const audio = document.querySelector("audio.bgm");
  if (!audio) return;

  const KEY = "valentine_bgm_state_v1";
  const src = new URL(audio.getAttribute("src"), window.location.href).pathname;

  function saveState() {
    try {
      const state = {
        src,
        currentTime: audio.currentTime || 0,
        playing: !audio.paused,
      };
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch (_) {
      // Ignore storage failures; playback should still work.
    }
  }

  function restoreState() {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (!raw) return;
      const state = JSON.parse(raw);
      if (!state || state.src !== src) return;

      const applyTime = () => {
        if (typeof state.currentTime === "number" && state.currentTime > 0) {
          audio.currentTime = state.currentTime;
        }
      };

      if (audio.readyState >= 1) {
        applyTime();
      } else {
        audio.addEventListener("loadedmetadata", applyTime, { once: true });
      }

      if (state.playing) {
        audio.play().catch(function () {
          // Browser autoplay policy may block until user interaction.
        });
      }
    } catch (_) {
      // Ignore parse/storage failures.
    }
  }

  function enablePlayOnInteraction() {
    const unlockEvents = ["pointerdown", "touchstart", "keydown", "click"];

    function unlock() {
      audio.play().catch(function () {
        // Keep listeners until a successful play.
      });
      if (!audio.paused) {
        unlockEvents.forEach(function (eventName) {
          window.removeEventListener(eventName, unlock, true);
        });
      }
    }

    unlockEvents.forEach(function (eventName) {
      window.addEventListener(eventName, unlock, true);
    });
  }

  restoreState();
  audio.play().catch(function () {
    // First-load autoplay can be blocked; start on first interaction.
  });
  enablePlayOnInteraction();
  audio.addEventListener("timeupdate", saveState);
  window.addEventListener("pagehide", saveState);
  window.addEventListener("beforeunload", saveState);
})();
