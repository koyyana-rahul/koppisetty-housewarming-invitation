import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Choreography — one timeline, shared with the stylesheet.

   The seal releases, the doors part, and the invitation is already
   rising into view as the light comes through. The gate then keeps
   itself mounted until its last glow has dissolved, so the page is
   never revealed through a half-transparent door and never sits empty.
   ───────────────────────────────────────────────────────────── */
const DOORS_MS = 1150; // doors swing open
const FADE_MS = 560; // then the last of the glow dissolves

/* The doors are already moving by the time the invitation is handed
   over, so the card is rising into the opening rather than appearing
   after it. This is deliberately earlier than the doors finishing:
   the backdrop clears while they are still swinging. */
const ENTER_MS = 120;

export default function EntryGate({ gate, onEnter, onStart }) {
  const [open, setOpen] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    /* Honour the preference: no doors, no dissolve, no wait. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onEnter();
      return undefined;
    }

    /* The invitation is handed over as the doors are still opening, so the
       card is already rising into the widening gap rather than appearing
       only once the door has finished moving. */
    const enterTimer = setTimeout(() => onEnter(), ENTER_MS);
    const fadeTimer = setTimeout(() => setFadingOut(true), DOORS_MS);
    /* Removed only once the dissolve has actually finished, so the
       page is never revealed through a half-transparent door. */
    const doneTimer = setTimeout(() => setGone(true), DOORS_MS + FADE_MS);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [open, onEnter]);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    onStart?.();
  };

  if (gone) return null;

  return (
    <div
      id="entry-gate"
      className={`${open ? "is-open" : ""} ${fadingOut ? "fade-out" : ""}`}
    >
      <div
        className={`scene ${open ? "open" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={gate.altText}
        onClick={handleOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpen();
          }
        }}
      >
        <div className="line-group">
          <div className="line-side" />
          <div className="line-main" />
          <div className="line-side" />
        </div>

        <div className="panel left-gate" />
        <div className="panel right-gate" />

        <p className="mantra">{gate.mantra ?? "॥ शुभ गृह प्रवेश ॥"}</p>
        <div className="mantra-glow" aria-hidden="true" />

        <div className="seal-container">
          <div className="seal-float">
            <button
              className="seal-button"
              type="button"
              aria-label={gate.altText}
              onClick={(event) => {
                event.stopPropagation();
                handleOpen();
              }}
            >
              <span className="seal-ring" aria-hidden="true" />
              <span className="seal-inner-ring" />
              <span className="seal-letter">{gate.monogram}</span>
              <span className="tap-label">{gate.sealLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
