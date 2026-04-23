import { useEffect } from "react";

function MapIcon() {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function EventsSection({ events, timeline }) {
  useEffect(() => {
    const wraps = document.querySelectorAll(".evt-video");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("open");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    wraps.forEach((wrap) => observer.observe(wrap));

    return () => observer.disconnect();
  }, [events]);

  return (
    <section id="events-section">
      <div className="tc reveal" style={{ marginBottom: "1rem" }}>
        <span className="sec-label">The Celebrations Unfold</span>
        <h2 className="sec-heading">Sacred Ceremonies</h2>
      </div>

      {events.map((event, index) => (
        <div key={`${event.dayHeader}-${event.name}`}>
          <h3
            className={`day-header reveal ${event.dayHeaderSage ? "sage-day" : ""}`}
            style={event.dayHeaderStyle}
          >
            {event.dayHeader}
          </h3>

          <div className="event-block reveal">
            <div className="evt-video" id={`ev${index + 1}`}>
              {event.video ? (
                <video autoPlay muted loop playsInline>
                  <source src={event.video} type="video/mp4" />
                </video>
              ) : event.image ? (
                <img src={event.image} alt={event.name} />
              ) : null}
            </div>

            <div
              className={`evt-card reveal reveal-d1 ${event.cardSage ? "sage" : ""}`}
            >
              <div className="evt-info">
                <span className="evt-name" style={event.nameStyle}>
                  {event.name}
                </span>
                <span className="evt-time" style={event.timeStyle}>
                  {event.time}
                </span>
                <span className="evt-addr">
                  {event.addressLines?.map((line, i) => (
                    <span key={`${line}-${i}`}>
                      {line}
                      {i < event.addressLines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </span>

                <a
                  className="dir-btn"
                  href={event.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapIcon />
                  View on Map
                </a>

                {event.mapEmbed ? (
                  <iframe
                    className="map-frame"
                    loading="lazy"
                    src={event.mapEmbed}
                    allowFullScreen
                    title={`${event.name} map`}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ))}

      {timeline ? (
        <section id="timeline-section" className="reveal">
          <div className="tc">
            <span className="sec-label" style={{ color: "var(--sage)" }}>
              {timeline.sectionLabel}
            </span>
            <h2 className="sec-heading" style={timeline.titleStyle}>
              {timeline.title}
            </h2>
            <p
              style={{
                fontStyle: "italic",
                color: "var(--text-mid)",
                fontSize: "1.05rem",
                marginBottom: ".5rem",
              }}
            >
              {timeline.intro}{" "}
              <strong style={{ color: "var(--sage-dark)" }}>
                {timeline.introHighlight}
              </strong>
              {timeline.introSuffix}
            </p>
          </div>

          <div className="tl-wrap">
            <div className="tl-line" />

            {timeline.items?.map((item, idx) => (
              <div className="tl-row" key={`${item.time}-${item.title}-${idx}`}>
                <div
                  className={`tl-dot ${item.dotClassName ?? ""}`}
                  style={item.dotStyle}
                />
                <div className="tl-content" style={item.contentStyle}>
                  <span className="tl-time" style={item.timeStyle}>
                    {item.time}
                  </span>
                  <span className="tl-evt" style={item.titleStyle}>
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}

export default EventsSection;
