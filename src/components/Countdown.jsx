import { useEffect, useState } from "react";

function getTimeLeft(target) {
  const diff = target.getTime() - Date.now();

  if (diff <= 0) {
    return {
      done: true,
      days: "00",
      hours: "00",
      mins: "00",
      secs: "00",
    };
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

function Countdown({ dateTime }) {
  const [time, setTime] = useState(() => getTimeLeft(new Date(dateTime)));

  useEffect(() => {
    const target = new Date(dateTime);
    const timer = setInterval(() => {
      setTime(getTimeLeft(target));
    }, 1000);

    return () => clearInterval(timer);
  }, [dateTime]);

  return (
    <section id="countdown-section">
      <div className="cd-card">
        <p className="cd-quote">
          A lifetime of togetherness begins with one sacred step
        </p>
        <span className="cd-script">Wedding</span>

        <div className="cd-grid">
          {time.done ? (
            <p
              style={{
                gridColumn: "1/-1",
                fontFamily: '"Great Vibes",cursive',
                fontSize: "2.5rem",
                color: "var(--sage-dark)",
              }}
            >
              Waheguru Bless You! 🌸
            </p>
          ) : (
            <>
              <div className="cd-unit">
                <span className="cd-num" id="cd-days">
                  {time.days}
                </span>
                <span className="cd-lbl">Days</span>
              </div>
              <div className="cd-unit">
                <span className="cd-num" id="cd-hours">
                  {time.hours}
                </span>
                <span className="cd-lbl">Hours</span>
              </div>
              <div className="cd-unit">
                <span className="cd-num" id="cd-mins">
                  {time.mins}
                </span>
                <span className="cd-lbl">Mins</span>
              </div>
              <div className="cd-unit">
                <span className="cd-num" id="cd-secs">
                  {time.secs}
                </span>
                <span className="cd-lbl">Secs</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Countdown;
