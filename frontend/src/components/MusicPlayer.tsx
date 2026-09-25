import React, { useEffect, useRef } from "react";

const MusicPlayer: React.FC<{ url: string }> = ({ url }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const notifyState = () => {
      const isPlaying = !audio.paused && !audio.ended && audio.currentTime > 0;
      window.dispatchEvent(
        new CustomEvent("wedding-music-state", {
          detail: { isPlaying: !audio.paused },
        })
      );
    };

    const handlePlay = () => {
      if (audio) {
        audio.play().then(notifyState).catch(() => {});
      }
    };

    const handleToggle = () => {
      if (!audio) return;
      if (audio.paused) {
        audio.play().then(notifyState).catch(() => {});
      } else {
        audio.pause();
        notifyState();
      }
    };

    window.addEventListener("play-wedding-music", handlePlay);
    window.addEventListener("toggle-wedding-music", handleToggle);
    audio.addEventListener("play", notifyState);
    audio.addEventListener("pause", notifyState);
    audio.addEventListener("ended", notifyState);

    return () => {
      window.removeEventListener("play-wedding-music", handlePlay);
      window.removeEventListener("toggle-wedding-music", handleToggle);
      audio.removeEventListener("play", notifyState);
      audio.removeEventListener("pause", notifyState);
      audio.removeEventListener("ended", notifyState);
    };
  }, []);

  return (
    <audio ref={audioRef} src={url} loop preload="auto" className="hidden" />
  );
};

export default MusicPlayer;

