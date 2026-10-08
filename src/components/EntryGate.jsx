import { useEffect, useState } from "react";

export default function EntryGate({ gate, onEnter, onStart }) {
  const [open, setOpen] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const fadeTimer = setTimeout(() => setFadingOut(true), 2600);
    const enterTimer = setTimeout(() => onEnter(), 3100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(enterTimer);
    };
  }, [open, onEnter]);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    onStart?.();
  };

  return (
    <div id="entry-gate" className={fadingOut ? "fade-out" : ""}>
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

        <div className="seal-container">
          <button
            className="seal-button"
            type="button"
            aria-label={gate.altText}
            onClick={(event) => {
              event.stopPropagation();
              handleOpen();
            }}
          >
            <span className="seal-inner-ring" />
            <span className="seal-letter">{gate.monogram}</span>
            <span className="tap-label">{gate.sealLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
