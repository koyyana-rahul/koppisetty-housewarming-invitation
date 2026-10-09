import { useCallback, useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";

export default function CeremonyTimeline({ ceremony }) {
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0);

  /* Grow the line down to the furthest dot that has scrolled into view */
  const syncProgress = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reached = [...wrap.querySelectorAll(".tl-row.revealed")].reduce(
      (furthest, row) => {
        const offset = row.offsetTop + row.offsetHeight / 2;
        return offset > furthest ? offset : furthest;
      },
      0,
    );

    setProgress(Math.min(reached / wrap.offsetHeight, 1));
  }, []);

  useEffect(() => {
    const rows = document.querySelectorAll("#timeline-section .tl-row");
    if (rows.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
            syncProgress();
          }
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -60px 0px" },
    );

    rows.forEach((row) => observer.observe(row));
    window.addEventListener("resize", syncProgress);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncProgress);
    };
  }, [ceremony, syncProgress]);

  return (
    <section
      id="timeline-section"
      className="section-shell py-16 sm:py-20 lg:py-28"
      aria-label="Ceremony schedule"
    >
      <SectionHeading
        label={ceremony.scheduleLabel}
        titleTe={ceremony.scheduleTitleTe}
        title={ceremony.scheduleTitle}
        className="reveal"
      />

      <div
        className="tl-wrap"
        ref={wrapRef}
        style={{ "--tl-progress": progress }}
      >
        <div className="tl-line" aria-hidden="true">
          <span className="tl-line-fill" />
          <span className="tl-line-bead" />
        </div>

        {ceremony.schedule.map((item) => (
          <div className="tl-row" key={`${item.time}-${item.title}`}>
            <div className={`tl-dot ${item.highlight ? "gold" : ""}`} />
            <div className={`tl-content ${item.highlight ? "tl-highlight" : ""}`}>
              {item.day ? <span className="tl-day">{item.day}</span> : null}
              <span className="tl-time">{item.time}</span>
              <span className="tl-evt">{item.title}</span>
              {item.titleTe ? <span className="te tl-te">{item.titleTe}</span> : null}
              {item.note ? <span className="tl-note">{item.note}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}