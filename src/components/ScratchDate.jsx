import { useCallback, useEffect, useRef, useState } from "react";

/* Fraction of the foil that has to be gone before a card counts itself
   revealed. */
const REVEAL_AT = 0.42;

/* How often the erased area is re-measured while dragging. The foil is
   only ever a couple of hundred pixels across, but reading it back at
   display resolution once per frame is what made the drag stutter on
   high-DPI screens; a small downsample reads the same number for a
   fraction of the cost. */
const SAMPLE_MS = 90;

/**
 * "Scratch to reveal" the auspicious Gruahapravesham date, carried over
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
  /* Nodes are taken by ref rather than by id: the cards can be remounted
     at any time and an id lookup would happily hand back a stale canvas
     from an earlier mount. */
  const canvasRefs = useRef([]);
  const cardRefs = useRef([]);
  const unitRefs = useRef([]);
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

    /* Every card is registered up front, whether or not it ends up with a
       working canvas behind it. A card that cannot bind its canvas still
       has to count as revealed — otherwise the fence in App.jsx never
       lifts and the page stays frozen for good. */
    const parts = dateParts.slice(0, 3);
    const cards = parts.map(() => ({ done: false }));
    const cleanups = [];
    let revealedSoFar = 0;

    parts.forEach((_, i) => {
      const card = cards[i];
      const canvas = canvasRefs.current[i];
      const wrap = cardRefs.current[i];

      const reveal = () => {
        if (card.done) return;
        card.done = true;

        if (canvas) {
          canvas.style.transition = "opacity .55s ease";
          canvas.style.opacity = "0";
          /* An invisible canvas that still takes clicks reads as a dead
             card, so it stops being a target the moment it fades. */
          canvas.style.pointerEvents = "none";
          window.setTimeout(() => {
            canvas.style.display = "none";
          }, 560);
        }

        wrap?.classList.add("glow");
        /* The hint belongs to the card, not the section: it has to stop
           asking this particular card to be scratched the moment this
           particular card is scratched, or a finished board still
           pulses three invitations to do the thing that is already
           done. */
        unitRefs.current[i]?.classList.add("done");

        revealedSoFar += 1;
        setRevealedCount(revealedSoFar);
        if (revealedSoFar === parts.length) finish();
      };

      revealersRef.current[i] = reveal;

      if (!canvas) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
      const sampler = document.createElement("canvas");

      let ready = false;
      let pointerId = null;
      let lastX = 0;
      let lastY = 0;
      let width = 0;
      let height = 0;
      let brush = 0;
      let lastSample = 0;
      let resizeTimer = 0;

      /* One brush drives the taps, the drag and the measurement, so the
         track a finger leaves is the same width everywhere. Previously
         the stroke was drawn at `lineWidth` while the tap dots were drawn
         at a different radius, which showed up as a scratchy, uneven
         trail. */
      const stamp = (x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, brush, 0, Math.PI * 2);
        ctx.fill();
      };

      /* Always draws in CSS pixels. `build` puts the DPR scale on the
         context before calling this; resetting the transform here threw
         that scale away and painted the foil into a device-pixel
         corner of a larger backing store, leaving ~90% of the card with
         nothing to scratch. */
      const paint = (w, h) => {
        ctx.globalCompositeOperation = "source-over";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, "#f6e7cd");
        gradient.addColorStop(0.5, "#c2653f");
        gradient.addColorStop(1, "#a5854b");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        ctx.font = "italic 500 13px 'Cormorant Garamond'";
        ctx.fillStyle = "rgba(253,247,236,.92)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("scratch me", w / 2, h / 2);
      };

      /* Leaves the context in destination-out, which is the mode every
         later erase runs in. Kept explicit so the compositing mode is
         never inherited from whatever ran before. */
      const armEraser = () => {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "#000";
      };

      /* Grow and refill the foil. `keep` carries an erased canvas across
         a relayout, so rotating the phone does not wipe a half-scratched
         card back to blank.

         Measured from the card, never from the canvas: a canvas with no
         width/height attributes reports its 300x150 intrinsic default, so
         measuring it here would size the foil to the default and let CSS
         stretch a blank-looking gradient across the card. */
      const build = (keep) => {
        const rect = wrap.getBoundingClientRect();
        const w = Math.max(1, rect.width);
        const h = Math.max(1, rect.height);

        /* A card that has not been laid out yet measures 0; drawing into
           a 1x1 canvas then leaves the foil permanently unbuilt, because
           the resize handler only listens for window resizes. */
        if (rect.width < 2 || rect.height < 2) return false;

        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);

        width = w;
        height = h;
        brush = Math.max(9, Math.min(w, h) * 0.075);

        paint(w, h);

        /* `paint` leaves the context in destination-out, which is the
           erasing mode. Drawing the snapshot in that mode would erase
           the foil it contains, so it has to be composited normally. */
        if (keep && ready) {
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(keep, 0, 0, keep.width, keep.height, 0, 0, w, h);
        }

        armEraser();
        ready = true;
        return true;
      };

      const isErasedEnough = () => {
        const sw = 40;
        const sh = Math.max(1, Math.round((sw * height) / width));
        sampler.width = sw;
        sampler.height = sh;

        const sctx = sampler.getContext("2d", { willReadFrequently: true });
        if (!sctx) return false;
        sctx.clearRect(0, 0, sw, sh);
        sctx.drawImage(canvas, 0, 0, sw, sh);

        const { data } = sctx.getImageData(0, 0, sw, sh);
        let clear = 0;
        for (let k = 3; k < data.length; k += 4) {
          /* Anything mostly transparent counts. Testing for an exact 0
             ignores every anti-aliased edge pixel, so the foil "stuck"
             on the card well past the point a person would call it gone. */
          if (data[k] < 128) clear += 1;
        }
        return clear / (sw * sh) >= REVEAL_AT;
      };

      const maybeReveal = (now) => {
        if (card.done || now - lastSample < SAMPLE_MS) return;
        lastSample = now;
        if (isErasedEnough()) reveal();
      };

      /* Pointer events cover mouse, touch and pen in one path, and the
         capture keeps the drag alive when the pointer leaves the card
         instead of dropping the stroke mid-scratch. */
      const onDown = (event) => {
        if (!ready || card.done || pointerId !== null) return;
        pointerId = event.pointerId;
        canvas.setPointerCapture?.(event.pointerId);
        /* Suppresses the focus ring and text selection under the
           scratch. Guarded because a non-cancelable event — one the
           compositor has already committed to — logs an intervention
           warning when prevented. Scrolling is handled by
           `touch-action: none` in the stylesheet, not here. */
        if (event.cancelable) event.preventDefault();

        /* Measured against the canvas, which `width/height: 100%` now pins
           to the card's box — the same CSS-pixel space the brush and the
           foil are drawn in. */
        const rect = canvas.getBoundingClientRect();
        lastX = event.clientX - rect.left;
        lastY = event.clientY - rect.top;
        stamp(lastX, lastY);
        lastSample = 0;
        maybeReveal(performance.now());
      };

      const onMove = (event) => {
        if (pointerId === null || event.pointerId !== pointerId || card.done) {
          return;
        }

        /* Deliberately no preventDefault here. Touch scrolling is
           governed by `touch-action: none`, which the browser applies
           before the gesture starts; calling it on the move does
           nothing useful and warns once the event is non-cancelable. */

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        /* Stamped along the path rather than only at the sampled points:
         a fast flick delivers one event for a long distance and would
             otherwise draw a dotted line. */
        const dx = x - lastX;
        const dy = y - lastY;
        const distance = Math.hypot(dx, dy);
        const step = Math.max(1, brush * 0.4);
        for (let d = step; d <= distance; d += step) {
          stamp(lastX + (dx * d) / distance, lastY + (dy * d) / distance);
        }
        if (distance > 0) stamp(x, y);

        lastX = x;
        lastY = y;
        maybeReveal(performance.now());
      };

      const onUp = (event) => {
        if (pointerId === null || event.pointerId !== pointerId) return;
        canvas.releasePointerCapture?.(event.pointerId);
        pointerId = null;
        /* One last reading at the end of the stroke: a short scratch
           that clears the threshold mid-drag should still land. */
        if (!card.done && isErasedEnough()) reveal();
      };

      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
      canvas.addEventListener("lostpointercapture", onUp);

      /* Rebuild whenever the card's box actually changes, carrying the
         erased pixels across so a relayout does not wipe a
         half-scratched card. This also covers the first build: an
         observer fires as soon as the card is laid out, which a fixed
         timer cannot promise — if the section had not settled by then,
         the old code measured a zero-sized or default-sized box and
         left the foil stretched and unscratchable. */
      const relayout = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (card.done) return;
          const snapshot = document.createElement("canvas");
          snapshot.width = canvas.width;
          snapshot.height = canvas.height;
          snapshot.getContext("2d")?.drawImage(canvas, 0, 0);
          build(snapshot);
        }, 120);
      };

      const observer = new ResizeObserver((entries) => {
        const box = entries[0]?.contentRect;
        if (!box) return;
        if (box.width === width && box.height === height) return;
        relayout();
      });
      observer.observe(wrap);

      window.addEventListener("resize", relayout, { passive: true });

      /* Covers the case where the observer never fires because the card
         was already at its final size before this ran. */
      if (!build()) relayout();

      cleanups.push(() => {
        observer.disconnect();
        window.clearTimeout(resizeTimer);
        revealersRef.current[i] = null;
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        canvas.removeEventListener("lostpointercapture", onUp);
        window.removeEventListener("resize", relayout);
        canvas.style.display = "";
        canvas.style.opacity = "";
        canvas.style.pointerEvents = "";
        canvas.style.transition = "";
        canvas.getContext("2d")?.setTransform(1, 0, 0, 1, 0, 0);
        canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
      });
    });

    /* Cards that never got a canvas behind them still need to resolve,
       otherwise the gate never opens. */
    cards.forEach((card, i) => {
      if (card.done) return;
      if (canvasRefs.current[i]) return;
      window.setTimeout(() => revealersRef.current[i]?.(), 0);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
    /* `dateParts` rather than the sliced copy: the slice is a fresh array
       on every render, and putting it here would tear the canvases down
       and repaint the foil on every state change. */
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
        Scratch the cards below to unveil the day of our Gruahapravesham
      </p>

      <div className="scratch-row">
        {dateParts.slice(0, 3).map((part, index) => (
          <div
            className="scratch-unit"
            key={part.label}
            ref={(node) => {
              unitRefs.current[index] = node;
            }}
          >
            <span className="scratch-lbl">{part.label}</span>

            <div
              className="scratch-card"
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
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
                ref={(node) => {
                  canvasRefs.current[index] = node;
                }}
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