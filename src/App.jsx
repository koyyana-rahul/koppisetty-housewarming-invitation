import { useEffect, useMemo, useRef, useState } from "react";
import AudioToggle from "./components/AudioToggle";
import Countdown from "./components/Countdown";
import EntryGate from "./components/EntryGate";
import EventsSection from "./components/EventsSection";
import FooterSection from "./components/FooterSection";
import LaavanSection from "./components/LaavanSection";
import PetalsCanvas from "./components/PetalsCanvas";
import RSVPSection from "./components/RSVPSection";
import ScratchDate from "./components/ScratchDate";
import StoryCards from "./components/StoryCards";
import { templates } from "./data/templates";
import confetti from "canvas-confetti";

function smoothScroll(endY, duration, userInteractedRef) {
  const startY = window.scrollY;
  const dist = endY - startY;
  let t0 = null;
  let rafId = 0;

  const step = (now) => {
    if (userInteractedRef.current) {
      cancelAnimationFrame(rafId);
      return;
    }

    if (!t0) t0 = now;
    const elapsed = now - t0;
    let t = elapsed / (duration / 2);
    let run;

    if (t < 1) {
      run = (dist / 2) * t * t * t + startY;
    } else {
      t -= 2;
      run = (dist / 2) * (t * t * t + 2) + startY;
    }

    window.scrollTo(0, run);
    if (elapsed < duration) {
      rafId = requestAnimationFrame(step);
    }
  };

  rafId = requestAnimationFrame(step);
}

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [lockedVisible, setLockedVisible] = useState(false);
  const [audioStartSignal, setAudioStartSignal] = useState(0);

  const autoScrollTimeoutRef = useRef(null);
  const userInteractedRef = useRef(false);

  const activeTemplate = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get("template");
    if (!templateId) return templates[0];
    return templates.find((item) => item.id === templateId) ?? templates[0];
  }, []);

  useEffect(() => {
    document.body.style.overflow = hasEntered ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered) return;

    const items = document.querySelectorAll(".reveal:not(.revealed)");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    items.forEach((item) => io.observe(item));

    const handleInteract = () => {
      userInteractedRef.current = true;
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
      ["wheel", "touchstart", "mousedown", "keydown"].forEach((eventName) => {
        window.removeEventListener(eventName, handleInteract);
      });
    };

    setTimeout(() => {
      ["wheel", "touchstart", "mousedown", "keydown"].forEach((eventName) => {
        window.addEventListener(eventName, handleInteract, { passive: true });
      });
    }, 1000);

    autoScrollTimeoutRef.current = setTimeout(() => {
      if (userInteractedRef.current) return;
      const scratch = document.getElementById("scratch-section");
      if (!scratch) return;

      const endY =
        scratch.getBoundingClientRect().top +
        window.scrollY +
        scratch.offsetHeight / 2 -
        window.innerHeight / 2;
      smoothScroll(endY, 2600, userInteractedRef);
    }, 4000);

    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
      ["wheel", "touchstart", "mousedown", "keydown"].forEach((eventName) => {
        window.removeEventListener(eventName, handleInteract);
      });
      io.disconnect();
    };
  }, [hasEntered]);

  const onScratchComplete = () => {
    setUnlocked(true);

    setTimeout(() => {
      setLockedVisible(true);

      const colors = [
        "#fdf5e6", // temple ivory
        "#c2a878", // antique zari gold
        "#8b0000", // kumkum crimson
        "#b22222", // sacred fire red accent
        "#043927", // emerald green accent
      ];
      const options = { colors, zIndex: 99999 };

      setTimeout(
        () =>
          confetti({
            ...options,
            particleCount: 200,
            spread: 100,
            origin: { x: 0.5, y: 0.65 },
          }),
        100,
      );
      setTimeout(
        () =>
          confetti({
            ...options,
            particleCount: 120,
            angle: 60,
            spread: 65,
            origin: { x: 0, y: 0.7 },
          }),
        400,
      );
      setTimeout(
        () =>
          confetti({
            ...options,
            particleCount: 120,
            angle: 120,
            spread: 65,
            origin: { x: 1, y: 0.7 },
          }),
        600,
      );

      setTimeout(() => {
        const countdown = document.getElementById("countdown-section");
        if (countdown) {
          countdown.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 2500);
    }, 50);
  };

  return (
    <>
      <AudioToggle
        audioSrc={activeTemplate.audioSrc}
        startSignal={audioStartSignal}
      />
      <PetalsCanvas active={hasEntered} />

      {!hasEntered ? (
        <EntryGate
          onStart={() => setAudioStartSignal((value) => value + 1)}
          onEnter={() => setHasEntered(true)}
        />
      ) : null}

      <div id="main-content" className={hasEntered ? "visible" : ""}>
        <section id="hero">
          <div className="hero-corner">
            <span />
          </div>

          <div className="hero-card">
            {activeTemplate.heroSymbol ? (
              <img
                src={activeTemplate.heroSymbol}
                alt="Ek Onkar"
                className="ek-onkar"
              />
            ) : null}

            <p className="ardas-text">
              "{activeTemplate.quote}"
              {activeTemplate.quoteAuthor ? (
                <>
                  <br />— {activeTemplate.quoteAuthor}
                </>
              ) : null}
            </p>

            <span className="couple-name shimmer">
              {activeTemplate.groomName}
            </span>
            <span className="parent-sub">{activeTemplate.groomParents}</span>

            <div className="amp-row">
              <div className="amp-line" />
              <span className="amp">&amp;</span>
              <div className="amp-line" />
            </div>

            <span className="couple-name shimmer">
              {activeTemplate.brideName}
            </span>
            <span className="parent-sub">{activeTemplate.brideParents}</span>
          </div>

          <button
            type="button"
            className="scroll-indicator"
            onClick={() => {
              const scratch = document.getElementById("scratch-section");
              scratch?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span>Scroll to Reveal</span>
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </section>

        <ScratchDate
          key={`${activeTemplate.id}-${activeTemplate.dateTimeLocal}`}
          dateParts={activeTemplate.dateParts}
          active={hasEntered}
          className="reveal"
          onComplete={onScratchComplete}
        />

        <div
          id="locked"
          className={`${unlocked ? "unlocked" : ""} ${lockedVisible ? "visible" : ""}`}
        >
          <Countdown dateTime={activeTemplate.countdownIso} />
          <StoryCards stories={activeTemplate.stories} />
          <EventsSection
            events={activeTemplate.events}
            timeline={activeTemplate.timeline}
          />
          <LaavanSection laavan={activeTemplate.laavan} />
          {/* <RSVPSection
            rsvp={activeTemplate.rsvp}
            coupleLabel={`${activeTemplate.groomName} & ${activeTemplate.brideName}`}
          /> */}
          <FooterSection footer={activeTemplate.footer} />
        </div>
      </div>
    </>
  );
}

export default App;
