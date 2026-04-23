import { useEffect, useRef, useState } from "react";

function ScratchDate({
  dateParts,
  onComplete,
  className = "",
  active = false,
}) {
  const onCompleteRef = useRef(onComplete);
  const [cursorStates, setCursorStates] = useState(() =>
    dateParts.slice(0, 3).map(() => ({ x: 0, y: 0, visible: false })),
  );

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active) return undefined;

    let doneCount = 0;

    const cleanups = [];

    ["sc-1", "sc-2", "sc-3"].forEach((id, i) => {
      const canvas = document.getElementById(id);
      const wrap = canvas?.parentElement;
      if (!canvas || !wrap) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const completionThreshold = 0.5;
      let ready = false;
      let done = false;
      let drawing = false;
      let checkQueued = false;
      let width = 1;

      const build = () => {
        const r = wrap.getBoundingClientRect();
        const W = Math.max(1, r.width);
        const H = Math.max(1, r.height);
        width = W;

        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, "#fdf5e6");
        g.addColorStop(0.52, "#8b0000");
        g.addColorStop(1, "#c2a878");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        ctx.font = "italic 500 13px 'Cormorant Garamond'";
        ctx.fillStyle = "rgba(255,245,226,.93)";
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
        const r = canvas.getBoundingClientRect();
        const s = event.touches ? event.touches[0] : event;
        return { x: s.clientX - r.left, y: s.clientY - r.top };
      };

      const eraseAt = (x, y, strength = 1) => {
        const brush = Math.max(10, width * 0.06) * strength;
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.beginPath();
        ctx.arc(x, y, brush, 0, Math.PI * 2);
        ctx.fill();
      };

      const revealDone = () => {
        const hint = document.getElementById(`hint-${i + 1}`);
        if (hint) hint.style.opacity = "0";

        const card = document.getElementById(`card-${i + 1}`);
        if (card) card.classList.add("glow");

        doneCount += 1;
        if (doneCount === 3) {
          onCompleteRef.current?.();
        }
      };

      const check = () => {
        if (done) return;

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let clear = 0;
        for (let k = 3; k < data.length; k += 4) {
          if (data[k] === 0) clear += 1;
        }

        if (clear / (canvas.width * canvas.height) > completionThreshold) {
          done = true;
          canvas.style.transition = "opacity .8s";
          canvas.style.opacity = "0";
          setTimeout(() => {
            canvas.style.display = "none";
            revealDone();
          }, 800);
        }
      };

      const queueCheck = () => {
        if (checkQueued || done) return;
        checkQueued = true;
        window.requestAnimationFrame(() => {
          checkQueued = false;
          check();
        });
      };

      const start = (event) => {
        if (!ready || done) return;
        drawing = true;
        event.preventDefault();
        const p = pos(event);
        eraseAt(p.x, p.y);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        queueCheck();
      };

      const move = (event) => {
        if (!drawing || done) return;
        event.preventDefault();
        const p = pos(event);
        eraseAt(p.x, p.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        queueCheck();
      };

      const end = () => {
        drawing = false;
        if (ready && !done) ctx.beginPath();
      };

      canvas.addEventListener("mousedown", start);
      canvas.addEventListener("mousemove", move);
      canvas.addEventListener("mouseleave", end);
      window.addEventListener("mouseup", end);
      canvas.addEventListener("touchstart", start, { passive: false });
      canvas.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", end);
      window.addEventListener("touchcancel", end);

      const onResize = () => {
        if (!done) build();
      };
      window.addEventListener("resize", onResize, { passive: true });

      const buildTimeoutId = window.setTimeout(build, 100);

      cleanups.push(() => {
        window.clearTimeout(buildTimeoutId);
        canvas.removeEventListener("mousedown", start);
        canvas.removeEventListener("mousemove", move);
        canvas.removeEventListener("mouseleave", end);
        window.removeEventListener("mouseup", end);
        canvas.removeEventListener("touchstart", start);
        canvas.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", end);
        window.removeEventListener("touchcancel", end);
        window.removeEventListener("resize", onResize);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [dateParts, active]);

  const updateCursor = (index, event, visible) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const point = event.touches?.[0] ?? event;

    setCursorStates((prev) =>
      prev.map((state, i) =>
        i === index
          ? {
              x: point.clientX - rect.left,
              y: point.clientY - rect.top,
              visible,
            }
          : state,
      ),
    );
  };

  return (
    <section id="scratch-section" className={className}>
      <span className="sec-label">The Date</span>
      <h2 className="sec-heading">Save the Date</h2>
      <p
        style={{
          fontStyle: "italic",
          color: "var(--text-light)",
          fontSize: "1.05rem",
          marginTop: ".25rem",
        }}
      >
        Scratch below to reveal our wedding date
      </p>

      <div className="scratch-row">
        {dateParts.slice(0, 3).map((part, index) => (
          <div className="scratch-unit" key={`${part.label}-${index}`}>
            <span className="scratch-lbl">{part.label}</span>
            <div
              className="scratch-card"
              id={`card-${index + 1}`}
              onMouseEnter={(event) => updateCursor(index, event, true)}
              onMouseMove={(event) => updateCursor(index, event, true)}
              onMouseLeave={() =>
                setCursorStates((prev) =>
                  prev.map((state, i) =>
                    i === index ? { ...state, visible: false } : state,
                  ),
                )
              }
              onTouchStart={(event) => updateCursor(index, event, true)}
              onTouchMove={(event) => updateCursor(index, event, true)}
              onTouchEnd={() =>
                setCursorStates((prev) =>
                  prev.map((state, i) =>
                    i === index ? { ...state, visible: false } : state,
                  ),
                )
              }
            >
              <div className="scratch-inner">
                <div className="sc-val">{part.value}</div>
                <div className="sc-rule" />
              </div>
              <span
                className="scratch-pointer"
                style={{
                  left: `${cursorStates[index]?.x ?? 0}px`,
                  top: `${cursorStates[index]?.y ?? 0}px`,
                  opacity: cursorStates[index]?.visible ? 1 : 0,
                }}
                aria-hidden="true"
              >
                <span className="scratch-pointer-mark">+</span>
              </span>
              <canvas className="scratch-canvas" id={`sc-${index + 1}`} />
            </div>
            <span
              className="scratch-hint"
              id={`hint-${index + 1}`}
              style={
                index > 0 ? { animationDelay: `${index * 0.18}s` } : undefined
              }
            >
              ↑ scratch
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ScratchDate;
