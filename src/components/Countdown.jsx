import { useEffect, useState } from "react";

function getTimeLeft(target) {
  const diff = target.getTime() - Date.now();

  if (diff <= 0) {
    return { done: true, days: "00", hours: "00", mins: "00", secs: "00" };
  }

  const fmt = (n) => String(n).padStart(2, "0");

  return {
    done: false,
    days: fmt(Math.floor(diff / 86400000)),
    hours: fmt(Math.floor((diff % 86400000) / 3600000)),
    mins: fmt(Math.floor((diff % 3600000) / 60000)),
    secs: fmt(Math.floor((diff % 60000) / 1000)),
  };
}

export default function Countdown({
  dateTime,
  eyebrow,
  script,
  quote,
  doneText,
}) {
  const [time, setTime] = useState(() => getTimeLeft(new Date(dateTime)));

  useEffect(() => {
    const target = new Date(dateTime);
    if (Number.isNaN(target.getTime())) return undefined;

    const timer = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(timer);
  }, [dateTime]);

  return (
    <section id="countdown" aria-label="Countdown">
      <div className="section-shell py-14 sm:py-20">
        <div className="paper-card countdown-card reveal">
          <span className="eyebrow">{eyebrow}</span>
          <p className="script-text countdown-script">{script}</p>
          <p className="countdown-quote mt-2">{quote}</p>

          {time.done ? (
            <p className="countdown-done">{doneText}</p>
          ) : (
            <div className="countdown-grid">
              <div className="countdown-unit">
                <span className="countdown-num">{time.days}</span>
                <span className="countdown-lbl">Days</span>
              </div>
              <div className="countdown-unit">
                <span className="countdown-num">{time.hours}</span>
                <span className="countdown-lbl">Hours</span>
              </div>
              <div className="countdown-unit">
                <span className="countdown-num">{time.mins}</span>
                <span className="countdown-lbl">Mins</span>
              </div>
              <div className="countdown-unit">
                <span className="countdown-num">{time.secs}</span>
                <span className="countdown-lbl">Secs</span>
              </div>
            </div>
          )}

          <div className="ornament-rule mt-8">
            <span>❀</span>
          </div>
        </div>
      </div>
    </section>
  );
}