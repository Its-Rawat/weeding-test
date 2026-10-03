import React, { useEffect, useRef } from "react";

const MusicPlayer: React.FC<{ url: string }> = ({ url }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const notifyState = () => {
      const isPlaying = !audio.paused && !audio.ended;
      window.dispatchEvent(
        new CustomEvent("wedding-music-state", {
          detail: { isPlaying },
        })
      );
    };

    const handlePlay = () => {
      if (audio) {
        audio.play().then(notifyState).catch((err) => {
          console.warn("Audio play blocked/error:", err);
        });
      }
    };

    const handleToggle = () => {
      if (!audio) return;
      if (audio.paused) {
        audio.play().then(notifyState).catch((err) => {
          console.warn("Audio play blocked/error:", err);
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

    window.addEventListener("play-wedding-music", handlePlay);
    window.addEventListener("toggle-wedding-music", handleToggle);
    window.addEventListener("pause-wedding-music", handlePause);
    window.addEventListener("query-wedding-music-state", handleQuery);

    audio.addEventListener("play", notifyState);
    audio.addEventListener("pause", notifyState);
    audio.addEventListener("ended", notifyState);

    return () => {
      window.removeEventListener("play-wedding-music", handlePlay);
      window.removeEventListener("toggle-wedding-music", handleToggle);
      window.removeEventListener("pause-wedding-music", handlePause);
      window.removeEventListener("query-wedding-music-state", handleQuery);

      audio.removeEventListener("play", notifyState);
      audio.removeEventListener("pause", notifyState);
      audio.removeEventListener("ended", notifyState);
    };
  }, [url]);

  return (
    <audio ref={audioRef} src={url} loop preload="auto" className="hidden" />
  );
};

export default MusicPlayer;

