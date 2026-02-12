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
    let unlocked = false;

    function removeUnlockListeners() {
      unlockEvents.forEach(function (eventName) {
        window.removeEventListener(eventName, unlock, true);
      });
    }

    function unlock() {
      if (unlocked) return;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(function () {
            unlocked = true;
            removeUnlockListeners();
            saveState();
          })
          .catch(function () {
            // Keep listeners until a successful play.
          });
      } else if (!audio.paused) {
        unlocked = true;
        removeUnlockListeners();
        saveState();
      }
    }

    if (!audio.paused) {
      unlocked = true;
      removeUnlockListeners();
      return;
    }

    unlockEvents.forEach(function (eventName) {
      window.addEventListener(eventName, unlock, true);
    });
  }

  function tryAutoPlay() {
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(function () {
          saveState();
        })
        .catch(function () {
          // First-load autoplay can be blocked; interaction fallback will handle it.
        });
    } else if (!audio.paused) {
      saveState();
    }
  }

  restoreState();
  tryAutoPlay();
  enablePlayOnInteraction();
  audio.addEventListener("play", saveState);
  audio.addEventListener("timeupdate", saveState);
  window.addEventListener("pagehide", saveState);
  window.addEventListener("beforeunload", saveState);
})();
