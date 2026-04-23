import { useEffect, useState } from "react";

function EntryGate({ onEnter, onStart }) {
  const [open, setOpen] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 3000);

    const enterTimer = setTimeout(() => {
      onEnter();
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(enterTimer);
    };
  }, [open, onEnter]);

  const handleSceneClick = () => {
    if (open) return;
    setOpen(true);
    onStart?.();
  };

  return (
    <div id="entry-gate" className={fadingOut ? "fade-out" : ""}>
      <div
        className={`scene ${open ? "open" : ""}`}
        id="revealScene"
        onClick={handleSceneClick}
      >
        <div className="ornament top-left"></div>
        <div className="ornament bottom-right"></div>

        <div className="line-group">
          <div className="line-side"></div>
          <div className="line-main"></div>
          <div className="line-side"></div>
        </div>

        <div className="panel left-gate"></div>
        <div className="panel right-gate"></div>

        <div className="seal-container">
          <button
            className="seal-button"
            type="button"
            aria-label="Tap to open"
            onClick={(event) => {
              event.stopPropagation();
              handleSceneClick();
            }}
          >
            <div className="seal-inner-ring"></div>
            <div className="seal-text">
              <div className="letter-z">R&T</div>
              <div className="tap-label">Tap to Open</div>
            </div>
          </button>
        </div>

        <div className="spark"></div>
      </div>
    </div>
  );
}

export default EntryGate;
