'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { CirclePlay, CirclePause, SkipForward, SkipBack } from 'lucide-react';

export interface MusicCardProps {
  src: string;
  poster: string;
  autoPlay?: boolean;
  mainColor?: string;
  title?: string;
  artist?: string;
  className?: string;
}

export function MusicCard({
  src,
  poster,
  autoPlay = false,
  mainColor = '#D4AF37',
  title = 'Unknown Title',
  artist = 'Unknown Artist',
  className = '',
}: MusicCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const howler = useRef<Howl | null>(null);
  const progressInterval = useRef<any>(null);

  useEffect(() => {
    if (howler.current) {
      howler.current.stop();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    const sound = new Howl({
      src: [src],
      html5: true,
      onpause: () => {
        setIsPlaying(false);
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      },
      onplay: () => {
        setIsPlaying(true);
        updateProgress();
      },
      onend: () => {
        setIsPlaying(false);
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
        setProgress(0);
      },
      onstop: () => {
        setIsPlaying(false);
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
        setProgress(0);
      },
      onload: () => {
        setDuration(sound.duration());
      },
      onloaderror: (_id, err) => {
        console.warn('Howler load error:', err);
      },
    });

    howler.current = sound;

    if (autoPlay) {
      sound.play();
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      sound.unload();
    };
  }, [src]);

  const updateProgress = () => {
    if (!howler.current) return;

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(() => {
      const seek = howler.current?.seek() || 0;
      setProgress(typeof seek === 'number' ? seek : 0);
    }, 1000);
  };

  const handlePlayPause = () => {
    if (!howler.current) return;

    if (isPlaying) {
      howler.current.pause();
    } else {
      howler.current.play();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!howler.current) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newPosition = percentage * duration;

    howler.current.seek(newPosition);
    setProgress(newPosition);
  };

  const handleSkip = (direction: 'forward' | 'backward') => {
    if (!howler.current) return;

    const currentTime = (howler.current.seek() as number) || 0;
    const skipAmount = 10;
    const newTime =
      direction === 'forward'
        ? Math.min(currentTime + skipAmount, duration)
        : Math.max(currentTime - skipAmount, 0);

    howler.current.seek(newTime);
    setProgress(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cardStyle = {
    '--main-color': mainColor,
    '--hover-color': `${mainColor}33`,
  } as React.CSSProperties;

  return (
    <section
      className={`w-full max-w-[20rem] bg-white/70 dark:bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 
        shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#D4AF37]/40 
        hover:border-[#D4AF37] ${className}`}
      style={cardStyle}
    >
      {/* Album Poster Frame */}
      <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden group bg-stone-100 shadow-md">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Track Info */}
      <div className="mb-3 px-1 text-center">
        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
          {title}
        </h3>
        <p className="text-xs sm:text-sm font-sans text-stone-600 dark:text-stone-400 truncate">
          {artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-3 px-1">
        <div
          className="h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full cursor-pointer group"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-[var(--main-color)] rounded-full relative"
            style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
          >
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 
              bg-[var(--main-color)] rounded-full shadow-md transform scale-0 
              group-hover:scale-100 transition-transform"
            />
          </div>
        </div>
        <div className="flex justify-between mt-1 text-[11px] font-mono text-stone-500 dark:text-stone-400">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-3 pt-1">
        <button
          onClick={() => handleSkip('backward')}
          className="p-2 text-stone-600 dark:text-stone-400 
            hover:text-[var(--main-color)] dark:hover:text-[var(--main-color)] 
            transition-colors cursor-pointer active:scale-95"
          title="Rewind 10s"
        >
          <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={handlePlayPause}
          className="p-2 text-[var(--main-color)] hover:opacity-80 transition-all cursor-pointer active:scale-90"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <CirclePause className="w-8 h-8 sm:w-9 sm:h-9" />
          ) : (
            <CirclePlay className="w-8 h-8 sm:w-9 sm:h-9" />
          )}
        </button>
        <button
          onClick={() => handleSkip('forward')}
          className="p-2 text-stone-600 dark:text-stone-400 
            hover:text-[var(--main-color)] dark:hover:text-[var(--main-color)] 
            transition-colors cursor-pointer active:scale-95"
          title="Forward 10s"
        >
          <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </section>
  );
}

export default MusicCard;
