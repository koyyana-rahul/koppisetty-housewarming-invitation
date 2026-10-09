import {
  CalendarIcon,
  ClockIcon,
  HouseIcon,
  LocationIcon,
} from "./Motifs";
import SectionHeading from "./SectionHeading";

export default function EventDetails({ ceremony }) {
  const facts = [
    { icon: "house", label: "Occasion", value: `${ceremony.name} · Housewarming` },
    { icon: "calendar", label: "Date", value: ceremony.date },
    { icon: "clock", label: "Time", value: ceremony.time },
    { icon: "location", label: "Venue", value: ceremony.venueLine },
  ];

  const ICONS = {
    house: HouseIcon,
    calendar: CalendarIcon,
    clock: ClockIcon,
    location: LocationIcon,
  };

  return (
    <section
      id="ceremony"
      className="section-shell py-16 sm:py-20 lg:py-28"
      aria-label="Ceremony details"
    >
      <SectionHeading label={ceremony.sectionLabel} className="reveal" />

      <article className="paper-card event-card reveal reveal-d1 mt-8">
        <h3 className="event-name">{ceremony.name}</h3>
        {ceremony.nameTe ? (
          <p className="te te-heading mt-1">{ceremony.nameTe}</p>
        ) : null}
        <p className="event-subtitle">{ceremony.subtitle}</p>
        {ceremony.subtitleTe ? (
          <p className="te te-sm mt-1">{ceremony.subtitleTe}</p>
        ) : null}

        <div className="event-facts">
          {facts.map((fact) => {
            const Icon = ICONS[fact.icon];
            return (
              <div className="event-fact" key={fact.label}>
                <span className="event-fact-icon">
                  <Icon />
                </span>
                <span>
                  <span className="event-fact-label">{fact.label}</span>
                  <span className="event-fact-value">{fact.value}</span>
                </span>
              </div>
            );
          })}
        </div>

        <p className="event-muhurat">
          <ClockIcon />
          {ceremony.name} Muhurat · {ceremony.time}
        </p>
      </article>
    </section>
  );
}