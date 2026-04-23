import { useEffect, useRef, useState } from "react";

function AudioToggle({ audioSrc, startSignal = 0 }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const setAudio = async (on) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (on) {
      if (audio.readyState === 0) {
        audio.load();
      }
      try {
        await audio.play();
      } catch {
        // autoplay may fail until user interaction
      }
      return;
    }

    audio.pause();
  };

  useEffect(() => {
    if (!startSignal) return;
    setAudio(true);
  }, [startSignal]);

  return (
    <>
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

      <button
        id="audio-btn"
        title="Toggle music"
        onClick={() => setAudio(!playing)}
      >
        <svg
          id="a-on"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{ display: playing ? "block" : "none" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
        <svg
          id="a-off"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{ display: playing ? "none" : "block" }}
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
