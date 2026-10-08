import { useCallback, useEffect, useState } from "react";
import confetti from "canvas-confetti";

import AudioToggle from "./components/AudioToggle";
import CeremonyTimeline from "./components/CeremonyTimeline";
import Countdown from "./components/Countdown";
import EntryGate from "./components/EntryGate";
import EventDetails from "./components/EventDetails";
import FooterSection from "./components/FooterSection";
import HeroSection from "./components/HeroSection";
import HostSection from "./components/HostSection";
import InvitationMessage from "./components/InvitationMessage";
import PetalsCanvas from "./components/PetalsCanvas";
import RitualsSection from "./components/RitualsSection";
import ScratchDate from "./components/ScratchDate";
import VenueSection from "./components/VenueSection";
import { invitationData } from "./data/invitation";

function celebrate() {
  const colors = [
    "#fdf7ec", // ivory
    "#c2a878", // antique zari gold
    "#c2653f", // terracotta
    "#7a1f1f", // deep maroon
    "#7d9a72", // mango leaf green
  ];

  const options = { colors, zIndex: 99999 };

  setTimeout(
    () =>
      confetti({
        ...options,
        particleCount: 160,
        spread: 90,
        shapes: ["circle", "petal"],
        origin: { x: 0.5, y: 0.62 },
      }),
    80,
  );

  setTimeout(
    () =>
      confetti({
        ...options,
        particleCount: 90,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.68 },
      }),
    340,
  );

  setTimeout(
    () =>
      confetti({
        ...options,
        particleCount: 90,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.68 },
      }),
    520,
  );
}

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [audioStartSignal, setAudioStartSignal] = useState(0);

  const scrollTo = useCallback((target) => {
    document.getElementById(target)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = hasEntered ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [hasEntered]);

  useEffect(() => {
    if (!hasEntered) return undefined;

    const items = document.querySelectorAll(".reveal:not(.revealed)");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [hasEntered]);

  const onDateRevealed = useCallback(() => {
    celebrate();
    window.setTimeout(() => scrollTo("invitation"), 2200);
  }, [scrollTo]);

  return (
    <>
      <AudioToggle
        audioSrc={invitationData.audioSrc}
        ambience={invitationData.ambience}
        startSignal={audioStartSignal}
      />

      <PetalsCanvas active={hasEntered} />

      {!hasEntered ? (
        <EntryGate
          gate={invitationData.gate}
          onStart={() => setAudioStartSignal((value) => value + 1)}
          onEnter={() => setHasEntered(true)}
        />
      ) : null}

      <main id="main-content">
        <HeroSection
          hero={invitationData.hero}
          familyName={invitationData.family.familyName}
          onCta={() => scrollTo("invitation")}
        />

        <ScratchDate
          key={`${invitationData.id}-${invitationData.ceremony.dateTimeLocal}`}
          dateParts={invitationData.ceremony.dateParts}
          active={hasEntered}
          className="reveal"
          onComplete={onDateRevealed}
        />

        <HostSection family={invitationData.family} />

        <InvitationMessage message={invitationData.message} />

        <Countdown
          dateTime={invitationData.ceremony.countdownIso}
          eyebrow={invitationData.ceremony.countdownEyebrow}
          script={invitationData.ceremony.countdownScript}
          quote={invitationData.ceremony.countdownQuote}
          doneText={invitationData.ceremony.countdownDone}
        />

        <EventDetails ceremony={invitationData.ceremony} />

        <CeremonyTimeline timeline={invitationData.timeline} />

        <RitualsSection rituals={invitationData.rituals} />

        <VenueSection
          venue={invitationData.venue}
          share={invitationData.venue.share}
        />

        <FooterSection footer={invitationData.footer} />
      </main>
    </>
  );
}

export default App;