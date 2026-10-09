import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";

/* Consecutive entries sharing the same `day` are rendered under one date
   banner, so the date is never repeated on every card. `position` is the
   event's index across the whole programme, used for numbering, for the
   left/right alternation and for the reveal stagger. */
function buildProgramme(schedule) {
  const groups = [];

  schedule.forEach((item, position) => {
    const day = item.day ?? "";
    const last = groups[groups.length - 1];

    if (last && last.day === day) last.items.push({ ...item, position });
    else groups.push({ day, items: [{ ...item, position }] });
  });

  return groups;
}

export default function CeremonyTimeline({ ceremony }) {
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const groups = useMemo(
    () => buildProgramme(ceremony.schedule),
    [ceremony.schedule],
  );

  /* Grow the spine down to the furthest revealed dot. Measured from the dot
     itself, so it stays correct whatever the card height ends up being. */
  const syncProgress = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const wrapTop = wrap.getBoundingClientRect().top;

    const reached = [...wrap.querySelectorAll(".tl-row.is-revealed .tl-dot")]
      .reduce((furthest, dot) => {
        const box = dot.getBoundingClientRect();
        const centre = box.top + box.height / 2 - wrapTop;
        return centre > furthest ? centre : furthest;
      }, 0);

    setProgress(Math.max(0, Math.min(reached / wrap.offsetHeight, 1)));
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    const rows = wrap.querySelectorAll(".tl-row");
    const banners = wrap.querySelectorAll(".tl-dayhead");
    if (rows.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          /* Reveal unconditionally — a row that scrolls in from below and
             one that was already passed on a restored scroll position are
             both simply "reached" at this point. The entrance is CSS, so
             an already-passed row simply settles instantly. */
          observer.unobserve(entry.target);
          entry.target.classList.add("is-revealed");
          syncProgress();
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" },
    );

    rows.forEach((row) => observer.observe(row));
    banners.forEach((banner) => observer.observe(banner));

    window.addEventListener("resize", syncProgress);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncProgress);
    };
  }, [groups, syncProgress]);

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
        ref={wrapRef}
        className="tl-wrap"
        style={{ "--tl-progress": progress }}
      >
        <div className="tl-line" aria-hidden="true">
          <span className="tl-line-fill" />
          <span className="tl-line-bead" />
        </div>

        {groups.map((group, groupIndex) => (
          <div className="tl-group" key={group.day || `group-${groupIndex}`}>
            {group.day ? (
              <div className="tl-dayhead">
                <span className="tl-day">{group.day}</span>
              </div>
            ) : null}

            {group.items.map((item) => (
              <div
                className={`tl-row ${item.highlight ? "is-key" : ""}`}
                key={`${item.time}-${item.title}`}
                data-side={item.position % 2 === 0 ? "left" : "right"}
                style={{ "--tl-i": Math.min(item.position, 5) }}
              >
                <span className="tl-dot" aria-hidden="true" />

                <div
                  className={`tl-content ${item.highlight ? "tl-highlight" : ""}`}
                >
                  <p className="tl-meta">
                    <span className="tl-index">
                      {String(item.position + 1).padStart(2, "0")}
                    </span>
                    <span className="tl-time">{item.time}</span>
                  </p>

                  <h4 className="tl-evt">{item.title}</h4>

                  {item.titleTe ? (
                    <p className="te tl-te">{item.titleTe}</p>
                  ) : null}

                  {item.note ? <p className="tl-note">{item.note}</p> : null}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
