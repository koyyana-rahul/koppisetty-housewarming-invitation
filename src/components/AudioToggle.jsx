import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Ambient sound control.
 *  • If an `audioSrc` file is configured, a looping <audio> element is used.
 *  • Otherwise a very soft WebAudio ambience (low drone + occasional bell)
 *    is synthesised, so the invitation ships without any audio asset.
 */
function AudioToggle({ audioSrc = "", ambience = false, startSignal = 0 }) {
  const audioRef = useRef(null);
  const ctxRef = useRef(null);
  const gainRef = useRef(null);
  const voicesRef = useRef([]);
  const bellTimerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [supported] = useState(
    () => typeof window !== "undefined" && "AudioContext" in window,
  );

  const stopAmbience = useCallback(() => {
    if (bellTimerRef.current) {
      clearInterval(bellTimerRef.current);
      bellTimerRef.current = null;
    }

    const gain = gainRef.current;
    if (!gain || !ctxRef.current) return;

    const now = ctxRef.current.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
  }, []);

  const startAmbience = useCallback(() => {
    if (!supported) return;

    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;

      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);
      gainRef.current = master;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 620;
      filter.Q.value = 0.6;
      filter.connect(master);

      voicesRef.current = [110, 164.8, 220.5].map((freq, index) => {
        const osc = ctx.createOscillator();
        const voiceGain = ctx.createGain();
        osc.type = index === 2 ? "triangle" : "sine";
        osc.frequency.value = freq;
        voiceGain.gain.value = index === 2 ? 0.05 : 0.12;
        osc.connect(voiceGain);
        voiceGain.connect(filter);
        osc.start();
        return osc;
      });

      const bell = () => {
        const osc = ctx.createOscillator();
        const bellGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(784, ctx.currentTime);
        bellGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        bellGain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.05);
        bellGain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + 2.6,
        );
        osc.connect(bellGain);
        bellGain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 2.8);
      };

      window.setTimeout(bell, 900);
      bellTimerRef.current = setInterval(bell, 11000);
      ctxRef.current = ctx;
    }

    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;

    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
    gain.gain.linearRampToValueAtTime(0.5, now + 1.2);
  }, [supported]);

  const setAudio = useCallback(
    async (on) => {
      if (audioSrc) {
        const audio = audioRef.current;
        if (!audio) return;
        if (on) {
          if (audio.readyState === 0) audio.load();
          try {
            await audio.play();
          } catch {
            /* autoplay may be blocked until a gesture */
          }
        } else {
          audio.pause();
        }
        return;
      }

      if (ambience) {
        if (on) startAmbience();
        else stopAmbience();
      }
    },
    [ambience, audioSrc, startAmbience, stopAmbience],
  );

  useEffect(() => {
    if (!startSignal) return;
    setAudio(true);
  }, [startSignal, setAudio]);

  useEffect(
    () => () => {
      if (bellTimerRef.current) clearInterval(bellTimerRef.current);
      voicesRef.current.forEach((osc) => {
        try {
          osc.stop();
        } catch {
          /* already stopped */
        }
      });
      ctxRef.current?.close?.();
    },
    [],
  );

  if (!audioSrc && !ambience) return null;

  return (
    <>
      {audioSrc ? (
        <audio
          id="bg-audio"
          ref={audioRef}
          loop
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={audioSrc} type="audio/mpeg" />
        </audio>
      ) : null}

      <button
        id="audio-btn"
        type="button"
        title={playing ? "Mute ambience" : "Play ambience"}
        aria-label={playing ? "Mute ambience" : "Play ambience"}
        aria-pressed={playing}
        onClick={() => setAudio(!playing)}
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          viewBox="0 0 24 24"
          style={{ display: playing ? "block" : "none" }}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          viewBox="0 0 24 24"
          style={{ display: playing ? "none" : "block" }}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      </button>
    </>
  );
}

export default AudioToggle;