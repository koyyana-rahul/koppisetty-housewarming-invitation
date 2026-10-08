import { useEffect } from "react";
import SectionHeading from "./SectionHeading";

export default function CeremonyTimeline({ timeline }) {
  useEffect(() => {
    const rows = document.querySelectorAll("#timeline-section .tl-row");

    if (rows.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35, rootMargin: "0px 0px -60px 0px" },
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [timeline]);

  return (
    <section
      id="timeline-section"
      className="section-shell py-16 sm:py-20 lg:py-28"
      aria-label="Ceremony schedule"
    >
      <SectionHeading
        label={timeline.sectionLabel}
        title={timeline.title}
        className="reveal"
      />

      <p className="lede mt-4 text-center">
        {timeline.intro}{" "}
        <strong className="font-semibold not-italic text-maroon">
          {timeline.introHighlight}
        </strong>
        {timeline.introSuffix}
      </p>

      <div className="tl-wrap">
        <div className="tl-line" />
        {timeline.items.map((item) => (
          <div
            className="tl-row"
            key={`${item.time}-${item.title}`}
          >
            <div
              className={`tl-dot ${item.dotClassName ?? ""}`}
              style={item.dotStyle}
            />
            <div
              className={`tl-content ${item.contentClassName ?? ""}`}
              style={item.contentStyle}
            >
              {item.day ? <span className="tl-day">{item.day}</span> : null}
              <span className="tl-time" style={item.timeStyle}>
                {item.time}
              </span>
              <span className="tl-evt" style={item.titleStyle}>
                {item.title}
              </span>
              {item.titleTe ? (
                <span className="te tl-te">{item.titleTe}</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}