import { useEffect, useState } from "react";

function StoryCards({ stories }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const section = document.getElementById("story-section");
    if (!section || stories.length === 0) return undefined;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        const top = section.getBoundingClientRect().top + window.scrollY;
        const range = Math.max(1, section.offsetHeight - window.innerHeight);
        const raw = (window.scrollY - top) / range;
        const next = Math.round(
          Math.max(0, Math.min(1, raw)) * (stories.length - 1),
        );
        setIndex(next);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [stories]);

  const active = stories[index] ?? stories[0];

  return (
    <section id="story-section">
      <div className="story-sticky">
        <div className="story-text">
          <span className="sec-label">A Glimpse of Our Journey</span>
          <h2 className="sec-heading">Our Story</h2>
          {active ? (
            <>
              <span className="story-chapter" id="story-chapter">
                {active.title}
              </span>
              <p className="story-p" id="story-p">
                {active.text}
              </p>
            </>
          ) : null}
        </div>

        <div className="ls-stack" id="ls-stack">
          {stories.map((story, idx) => {
            const classNames = ["ls-card"];
            if (idx < index) classNames.push("stacked");
            if (idx === index) classNames.push("visible");

            return (
              <div
                key={`${story.title}-${idx}`}
                className={classNames.join(" ")}
                data-idx={idx}
                style={idx < index ? { "--d": String(index - idx) } : undefined}
              >
                <img
                  src={story.image}
                  alt={story.title}
                  decoding="async"
                  loading={idx < 3 ? "eager" : "lazy"}
                />
                <div className="ls-caption">
                  <span>{story.caption || story.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StoryCards;
