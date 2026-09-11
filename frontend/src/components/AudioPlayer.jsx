import React, { useEffect, useRef } from 'react';

export default function AudioPlayer({ isPlaying, onToggle }) {
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      startAmbientIndianMusic();
    } else {
      stopAmbientIndianMusic();
    }

    return () => {
      stopAmbientIndianMusic();
    };
  }, [isPlaying]);

  const startAmbientIndianMusic = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Raag Yaman / Bhupali traditional Indian scale notes in Hz
      // Fundamental Sa = D3 (146.83 Hz), Pa = A3 (220.0 Hz)
      const droneNotes = [146.83, 220.0, 293.66]; // Sa, Pa, high Sa
      
      // Create continuous Tanpura drone
      droneNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        oscGain.gain.setValueAtTime(0.06, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
      });

      // Gentle procedural bansuri / flute melody notes
      const fluteRaga = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33]; // D, E, F#, A, B, D

      const playFluteNote = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        const now = ctx.currentTime;
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        const randomNote = fluteRaga[Math.floor(Math.random() * fluteRaga.length)];
        noteOsc.type = 'sine';
        noteOsc.frequency.setValueAtTime(randomNote, now);

        // Smooth flute envelope
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.05, now + 0.8);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        noteOsc.connect(noteGain);
        noteGain.connect(masterGain);

        noteOsc.start(now);
        noteOsc.stop(now + 3.3);
      };

      // Play a soft flute chime every 3.5 seconds
      intervalRef.current = setInterval(playFluteNote, 3500);
      playFluteNote();
    } catch (e) {
      console.warn("Audio playback not allowed without user gesture:", e);
    }
  };

  const stopAmbientIndianMusic = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  return null;
}
