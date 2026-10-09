import { useCallback, useEffect, useRef, useState } from "react";

/**
 * "Scratch to reveal" the auspicious Gruhapravesham date, carried over
 * from the original invitation.
 */
export default function ScratchDate({
  dateParts,
  onComplete,
  className = "",
  active = false,
}) {
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  /* Set by each canvas's effect so a card can also be revealed without
     dragging — see the keyboard handler on `.scratch-card`. */
  const revealersRef = useRef([]);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current?.();
  }, []);

  const total = Math.min(3, dateParts.length);
  const allRevealed = revealedCount >= total;

  useEffect(() => {
    if (!active) return undefined;

    let doneCount = 0;
    const cleanups = [];

    dateParts.slice(0, 3).forEach((_, i) => {
      const canvas = document.getElementById(`sc-${i + 1}`);
      const wrap = canvas?.parentElement;
      if (!canvas || !wrap) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      let ready = false;
      let done = false;
      let drawing = false;
      let checkQueued = false;
      let width = 1;

      const build = () => {
        const rect = wrap.getBoundingClientRect();
        const W = Math.max(1, rect.width);
        const H = Math.max(1, rect.height);
        width = W;

        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        const gradient = ctx.createLinearGradient(0, 0, W, H);
        gradient.addColorStop(0, "#f6e7cd");
        gradient.addColorStop(0.5, "#c2653f");
        gradient.addColorStop(1, "#a5854b");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        ctx.font = "italic 500 13px 'Cormorant Garamond'";
        ctx.fillStyle = "rgba(253,247,236,.92)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("scratch me", W / 2, H / 2);

        ctx.globalCompositeOperation = "destination-out";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = Math.max(18, W * 0.16);
        ready = true;
      };

      const pos = (event) => {
        const rect = canvas.getBoundingClientRect();
        const point = event.touches ? event.touches[0] : event;
        return { x: point.clientX - rect.left, y: point.clientY - rect.top };
      };

      const eraseAt = (x, y) => {
        const brush = Math.max(10, width * 0.06);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.beginPath();
        ctx.arc(x, y, brush, 0, Math.PI * 2);
        ctx.fill();
      };

      const reveal = () => {
        if (done) return;
        done = true;
        canvas.style.transition = "opacity .7s";
        canvas.style.opacity = "0";
        window.setTimeout(() => {
          canvas.style.display = "none";
          document.getElementById(`card-${i + 1}`)?.classList.add("glow");
          doneCount += 1;
          setRevealedCount(doneCount);
          if (doneCount === 3) finish();
        }, 700);
      };

      /* Lets the card also be opened from the keyboard, so the reveal is
         never something a pointer is required for. */
      revealersRef.current[i] = reveal;

      const queueCheck = () => {
        if (checkQueued || done) return;
        checkQueued = true;
        window.requestAnimationFrame(() => {
          checkQueued = false;
          if (done) return;
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          let clear = 0;
          for (let k = 3; k < data.length; k += 4) {
            if (data[k] === 0) clear += 1;
          }
          if (clear / (canvas.width * canvas.height) > 0.5) reveal();
        });
      };

      const start = (event) => {
        if (!ready || done) return;
        drawing = true;
        event.preventDefault();
        const point = pos(event);
        eraseAt(point.x, point.y);
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        queueCheck();
      };

      const move = (event) => {
        if (!drawing || done) return;
        event.preventDefault();
        const point = pos(event);
        eraseAt(point.x, point.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        queueCheck();
      };

      const end = () => {
        drawing = false;
        if (ready && !done) ctx.beginPath();
      };

      canvas.addEventListener("mousedown", start);
      canvas.addEventListener("mousemove", move);
      canvas.addEventListener("mouseleave", end);
      canvas.addEventListener("touchstart", start, { passive: false });
      canvas.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("mouseup", end);
      window.addEventListener("touchend", end);
      window.addEventListener("touchcancel", end);

      const onResize = () => {
        if (!done) build();
      };
      window.addEventListener("resize", onResize, { passive: true });

      const buildTimer = window.setTimeout(build, 120);

      cleanups.push(() => {
        window.clearTimeout(buildTimer);
        revealersRef.current[i] = null;
        canvas.removeEventListener("mousedown", start);
        canvas.removeEventListener("mousemove", move);
        canvas.removeEventListener("mouseleave", end);
        canvas.removeEventListener("touchstart", start);
        canvas.removeEventListener("touchmove", move);
        window.removeEventListener("mouseup", end);
        window.removeEventListener("touchend", end);
        window.removeEventListener("touchcancel", end);
        window.removeEventListener("resize", onResize);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [active, dateParts, finish]);

  return (
    <section
      id="scratch-section"
      className={className}
      data-revealed={allRevealed ? "true" : "false"}
    >
      <span className="eyebrow">The Auspicious Day</span>
      <h2 className="section-title mt-3">Scratch to Reveal</h2>
      <p className="lede mt-3">
        Scratch the cards below to unveil the day of our Gruhapravesham
      </p>

      <div className="scratch-row">
        {dateParts.slice(0, 3).map((part, index) => (
          <div className="scratch-unit" key={part.label}>
            <span className="scratch-lbl">{part.label}</span>

            <div
              className="scratch-card"
              id={`card-${index + 1}`}
              tabIndex={0}
              role="button"
              aria-label={`Reveal ${part.label}: ${part.value}`}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                revealersRef.current[index]?.();
              }}
            >
              <div className="scratch-inner">
                <span className="scratch-value">{part.value}</span>
                <span className="scratch-rule" />
              </div>
              <canvas
                className="scratch-canvas"
                id={`sc-${index + 1}`}
                aria-hidden="true"
              />
            </div>

            <span
              className="scratch-hint"
              style={index > 0 ? { animationDelay: `${index * 0.18}s` } : undefined}
            >
              ↑ scratch
            </span>
          </div>
        ))}
      </div>

      {/* Tells the visitor why the page will not move yet — a locked
          scroll with no explanation just reads as a broken site. */}
      <p className="scratch-status" role="status">
        {allRevealed ? (
          <>
            <span className="scratch-status-tick" aria-hidden="true">
              &#10003;
            </span>
            The auspicious day is revealed
          </>
        ) : (
          <>
            <span className="scratch-status-count">
              {revealedCount}/{total}
            </span>
            revealed — scratch each card to continue
          </>
        )}
      </p>
    </section>
  );
}