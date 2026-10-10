import React, { useEffect, useRef } from "react";

const DEFAULT_FALLBACK_AUDIO =
  "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3";

const MusicPlayer: React.FC<{ url: string }> = ({ url }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const initialSrc = url && url.trim().length > 0 ? url : DEFAULT_FALLBACK_AUDIO;
    audio.src = initialSrc;

    const notifyState = () => {
      const isPlaying = !audio.paused && !audio.ended && audio.currentTime > 0;
      window.dispatchEvent(
        new CustomEvent("wedding-music-state", {
          detail: { isPlaying },
        })
      );
    };

    const handlePlay = () => {
      if (!audio) return;
      audio
        .play()
        .then(notifyState)
        .catch((err) => {
          console.warn("Audio play blocked, switching to fallback:", err);
          if (audio.src !== DEFAULT_FALLBACK_AUDIO) {
            audio.src = DEFAULT_FALLBACK_AUDIO;
            audio.play().then(notifyState).catch(() => {});
          }
        });
    };

    const handleToggle = () => {
      if (!audio) return;
      if (audio.paused || audio.ended) {
        audio
          .play()
          .then(notifyState)
          .catch((err) => {
            console.warn("Audio play failed on toggle:", err);
            if (audio.src !== DEFAULT_FALLBACK_AUDIO) {
              audio.src = DEFAULT_FALLBACK_AUDIO;
              audio.play().then(notifyState).catch((e) => console.error("Fallback play failed:", e));
            }
          });
      } else {
        audio.pause();
        notifyState();
      }
    };

    const handlePause = () => {
      if (audio && !audio.paused) {
        audio.pause();
        notifyState();
      }
    };

    const handleQuery = () => {
      notifyState();
    };

    const handleError = () => {
      console.warn("Audio source error on", audio.src, "- switching to fallback track");
      if (audio.src !== DEFAULT_FALLBACK_AUDIO) {
        audio.src = DEFAULT_FALLBACK_AUDIO;
        audio.load();
      }
    };

    window.addEventListener("play-wedding-music", handlePlay);
    window.addEventListener("toggle-wedding-music", handleToggle);
    window.addEventListener("pause-wedding-music", handlePause);
    window.addEventListener("query-wedding-music-state", handleQuery);

    audio.addEventListener("play", notifyState);
    audio.addEventListener("pause", notifyState);
    audio.addEventListener("ended", notifyState);
    audio.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("play-wedding-music", handlePlay);
      window.removeEventListener("toggle-wedding-music", handleToggle);
      window.removeEventListener("pause-wedding-music", handlePause);
      window.removeEventListener("query-wedding-music-state", handleQuery);

      audio.removeEventListener("play", notifyState);
      audio.removeEventListener("pause", notifyState);
      audio.removeEventListener("ended", notifyState);
      audio.removeEventListener("error", handleError);
    };
  }, [url]);

  return (
    <audio
      ref={audioRef}
      loop
      preload="auto"
      className="hidden"
    />
  );
};

export default MusicPlayer;
